import { printingProfileGuardHistoricalHash } from '../games/magic/tools/accuracy/printing-profile-guard-ancestry.mjs';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import {
  abuFlowDelta,
  abuFlowHistoricalHash,
  abuFlowAffected,
  abuFlowRuntimeCompatible,
  preAbuFlowSource,
  preAbuFlowToolSource,
} from '../games/magic/tools/accuracy/abu-flow-ancestry.mjs';
const fieldFile = 'games/magic/tools/accuracy/printing-fields.mjs';
const fieldBytes = await readFile(fieldFile);
const oldFields = await import(
  'data:text/javascript;base64,' + preAbuFlowToolSource(fieldFile, fieldBytes).toString('base64')
);
const newFields = await import('../games/magic/tools/accuracy/printing-fields.mjs');
let unchangedFieldReviews = 0;
for (const file of ['annotations.json', 'annotations-empty-rules.json']) {
  const fixture = JSON.parse(await readFile('games/magic/fixtures/accuracy/m21/' + file));
  for (const annotation of Object.values(fixture.cards)) {
    const entry = {
      card: { name: annotation.name },
      reference: { sha256: annotation.referenceHash },
    };
    assert.deepEqual(
      newFields.reviewedPrintingFields(entry, annotation),
      oldFields.reviewedPrintingFields(entry, annotation),
    );
    unchangedFieldReviews++;
  }
}
assert.equal(unchangedFieldReviews, 29, 'Retain all actual M21 annotation controls');
const p = await abuFlowDelta();
assert.equal(await printingProfileGuardHistoricalHash(), p.afterRenderer);
assert.equal(await abuFlowHistoricalHash(), p.beforeRenderer);
for (const [file, e] of Object.entries(p.files)) {
  const before = await preAbuFlowSource(file, await readFile(file));
  assert.equal(hash(before), e.before);
  assert.deepEqual(await preAbuFlowSource(file, before), before);
  const foreign = Buffer.from('unreviewed source');
  assert.deepEqual(await preAbuFlowSource(file, foreign), foreign);
}
for (const m of p.members) {
  const group = { printingIds: [m.id] };
  for (const task of ['rules', 'flavor', 'fullCard', 'release']) {
    assert(await abuFlowAffected(m.set, task, false, group));
    assert(
      !(await abuFlowRuntimeCompatible(
        'games/magic/src',
        p.beforeRenderer,
        m.set,
        task,
        false,
        group,
      )),
    );
  }
  assert.equal(await abuFlowAffected(m.set, 'references', false, group), m.wording);
  assert.equal(await abuFlowAffected(m.set, 'rules', true, group), m.wording);
  for (const task of [
    'normalization',
    'frameGeometry',
    'frameColor',
    'paperColor',
    'blackLevels',
    'manaGeometry',
    'manaColor',
    'setSymbol',
    'headings',
    'artist',
    'footer',
    'stats',
    'specialComponents',
  ]) {
    assert(!(await abuFlowAffected(m.set, task, false, group)));
    assert(
      await abuFlowRuntimeCompatible(
        'games/magic/src',
        p.beforeRenderer,
        m.set,
        task,
        false,
        group,
      ),
    );
  }
}
assert(await abuFlowAffected('lea', 'rules', false, {}));
assert(!(await abuFlowAffected('lea', 'rules', false, { printingIds: ['unaffected-id'] })));
assert(!(await abuFlowAffected('4ed', 'rules')));
assert(!(await abuFlowRuntimeCompatible('games/magic/src', '0'.repeat(64), 'lea', 'headings')));
assert(
  !(await abuFlowRuntimeCompatible('packages/browser/src', p.beforeRenderer, 'lea', 'headings')),
);
const base = 'games/magic/fixtures/accuracy/early-through-fourth/';
const scores = JSON.parse(gunzipSync(await readFile(base + 'abu-flow-current-scores.json.gz')));
const oldZip = await readFile(base + 'abu-art-current-scores.json.gz');
const old = JSON.parse(gunzipSync(oldZip));
const n = JSON.parse(gunzipSync(await readFile(p.native.file)));
assert.equal(scores.source.rendererHash, p.afterRenderer);
assert.equal(scores.source.priorSummaryHash, hash(oldZip));
assert.equal(scores.source.nativeHash, p.native.contentSha256);
assert.equal(scores.source.inputsHash, n.source.afterInputHash);
assert.deepEqual(scores.source.metricGraph, old.source.metricGraph);
assert.equal(scores.rows.length, 899);
assert.equal(scores.recomputedPrintings, 33);
assert.equal(scores.reusedPrintings, 866);
for (const r of scores.rows) {
  const native = n.rows.find((v) => v.id === r.id),
    previous = old.rows.find((v) => v.id === r.id);
  assert.equal(r.nativeFaceHash, native.original.hashes['after-face']);
  assert.equal(r.referenceHash, previous.referenceHash);
  assert.equal(r.poseHash, previous.poseHash);
  assert.equal(r.inputHash, native.inputHash);
  assert.equal(r.coverage, previous.coverage);
  if (!native.pixelsChanged) assert.deepEqual(r, previous);
}
console.log(
  'ABU Original body adoption:899 native faces,47 scoped keys,33 rescored,866 exact reuse;376 Oracle/art/mask controls; exact source/data projections and affected approvals withheld.',
);
