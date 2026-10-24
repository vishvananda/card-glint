import { abuFlowHistoricalHash } from '../games/magic/tools/accuracy/abu-flow-ancestry.mjs';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { sourceHash, hash } from '../games/magic/tools/accuracy/common.mjs';
import {
  abuArtDelta,
  abuArtHistoricalHash,
  preAbuArtSource,
  abuArtAffected,
  abuArtRuntimeCompatible,
} from '../games/magic/tools/accuracy/abu-art-ancestry.mjs';
import {
  printingFlavorHistoricalHash,
  printingFlavorRuntimeCompatible,
  printingFlavorDelta,
} from '../games/magic/tools/accuracy/printing-flavor-data-ancestry.mjs';
const p = await abuArtDelta();
assert.equal(await abuFlowHistoricalHash(), p.afterRenderer);
assert.equal(await abuArtHistoricalHash(), p.beforeRenderer);
assert.equal(
  await printingFlavorHistoricalHash(),
  '7edb969eee987080fb14c25292542a9dcaa227d41d41e6731babcf253439b2af',
);
const flavorParent = await printingFlavorDelta();
for (const member of p.members) {
  assert(
    !(await printingFlavorRuntimeCompatible(
      'games/magic/src',
      flavorParent.beforeRenderer,
      member.set,
      'fullCard',
      false,
      { printingIds: [member.id] },
    )),
  );
}
for (const [file, e] of Object.entries(p.files)) {
  const before = await preAbuArtSource(file, await readFile(file));
  assert.equal(hash(before), e.before);
  assert.deepEqual(await preAbuArtSource(file, before), before);
}
for (const m of p.members) {
  const group = { printingIds: [m.id] };
  for (const task of ['frameGeometry', 'fullCard', 'release']) {
    assert(await abuArtAffected(m.set, task, false, group));
    assert(!(await abuArtAffected(m.set, task, true, group)));
    assert(
      !(await abuArtRuntimeCompatible(
        'games/magic/src',
        p.beforeRenderer,
        m.set,
        task,
        false,
        group,
      )),
    );
  }
  for (const task of [
    'references',
    'normalization',
    'frameColor',
    'paperColor',
    'blackLevels',
    'manaGeometry',
    'manaColor',
    'setSymbol',
    'headings',
    'rules',
    'flavor',
    'artist',
    'footer',
    'stats',
    'specialComponents',
  ]) {
    assert(!(await abuArtAffected(m.set, task, false, group)));
    assert(
      await abuArtRuntimeCompatible('games/magic/src', p.beforeRenderer, m.set, task, false, group),
    );
  }
}
assert(await abuArtAffected('lea', 'frameGeometry', false, {}), 'Unknown membership fails closed');
assert(!(await abuArtAffected('lea', 'frameGeometry', false, { printingIds: ['unaffected-id'] })));
assert(
  await abuArtRuntimeCompatible('games/magic/src', p.beforeRenderer, '2ed', 'fullCard', false, {
    printingIds: ['unaffected-id'],
  }),
);
assert(!(await abuArtRuntimeCompatible('games/magic/src', '0'.repeat(64), '2ed', 'fullCard')));
assert(
  !(await abuArtRuntimeCompatible('packages/browser/src', p.beforeRenderer, '2ed', 'fullCard')),
);
const prefix = 'games/magic/fixtures/accuracy/early-through-fourth/';
const scores = JSON.parse(gunzipSync(await readFile(prefix + 'abu-art-current-scores.json.gz')));
const old = JSON.parse(gunzipSync(await readFile(prefix + 'abu-flavor-current-scores.json.gz')));
const native = JSON.parse(gunzipSync(await readFile(p.native.file)));
assert.equal(scores.source.rendererHash, p.afterRenderer);
assert.equal(scores.source.nativeHash, p.native.contentSha256);
assert.equal(scores.rows.length, 899);
assert.equal(scores.priorNativeReused, 880);
assert.equal(scores.measuredCandidateReused, 19);
assert.deepEqual(scores.source.metricGraph, old.source.metricGraph);
assert.equal(scores.changes.filter((r) => r.delta100 > 0.5).length, 18);
assert.equal(scores.changes.filter((r) => r.delta100 < -0.5).length, 1);
assert.equal(scores.changes.find((r) => r.delta100 < -0.5).name, 'Savannah');
for (const r of scores.rows) {
  const n = native.rows.find((n) => n.id === r.id),
    previous = old.rows.find((n) => n.id === r.id);
  assert.equal(r.nativeFaceHash, n.original.hashes['after-face']);
  assert.equal(r.inputHash, previous.inputHash);
  assert.equal(r.referenceHash, previous.referenceHash);
  assert.equal(r.poseHash, previous.poseHash);
  if (!n.affected) assert.deepEqual(r, previous);
}
assert.equal(scores.summary['2ed'].mean100, old.summary['2ed'].mean100);
console.log(
  'AB dual art:899 native faces,114 Original/Oracle layer pairs,57 printing/art/custom-etch pairs;19 exact measured candidates,880 unchanged identities; historical projections exact and affected geometry approvals withheld.',
);
