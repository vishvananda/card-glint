import { abuRasterAffected } from '../games/magic/tools/accuracy/abu-raster-ancestry.mjs';
import { abuPerimeterAffected } from '../games/magic/tools/accuracy/abu-perimeter-ancestry.mjs';
import {
  printingArtistHistoricalHash,
  printingArtistAffected,
} from '../games/magic/tools/accuracy/printing-artist-data-ancestry.mjs';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import {
  abuFractionalAncestry,
  preAbuFractionalSource,
  abuFractionalAffected,
  abuFractionalRuntimeCompatible,
} from '../games/magic/tools/accuracy/abu-fractional-ancestry.mjs';
const proof = await abuFractionalAncestry();
assert.equal(await printingArtistHistoricalHash(), proof.afterRenderer);
assert.notEqual(
  proof.capturedRenderer,
  proof.afterRenderer,
  'Retain the recorded metadata-only transition',
);
for (const [file, entry] of Object.entries(proof.files)) {
  const current = await readFile(file),
    before = await preAbuFractionalSource(file, current);
  assert.equal(hash(current), entry.after);
  assert.equal(hash(before), entry.before);
  assert.deepEqual(await preAbuFractionalSource(file, before), before);
  await assert.rejects(
    preAbuFractionalSource(
      file,
      Buffer.concat([current, Buffer.from('\n// unknown source edit\n')]),
    ),
    /Unreviewed ABU fractional source/,
  );
}
for (const set of ['lea', 'leb', '2ed']) {
  for (const task of ['rules', 'flavor', 'fullCard', 'release']) {
    assert(abuFractionalAffected(set, task));
    assert.equal(
      await abuFractionalRuntimeCompatible('games/magic/src', proof.beforeRenderer, set, task),
      false,
      'Old runtime cannot approve changed Original text',
    );
    assert.equal(
      abuFractionalAffected(set, task, true),
      false,
      'Reviewed original data did not change',
    );
  }
  for (const task of [
    'frameGeometry',
    'frameColor',
    'manaGeometry',
    'headings',
    'artist',
    'footer',
    'stats',
  ])
    assert.equal(
      await abuFractionalRuntimeCompatible('games/magic/src', proof.beforeRenderer, set, task),
      !(await printingArtistAffected(set, task)) &&
        !(await abuPerimeterAffected(set, task)) &&
        !(await abuRasterAffected(set, task)),
    );
}
for (const set of ['8ed', 'm21', '3ed', '4ed'])
  assert(
    await abuFractionalRuntimeCompatible('games/magic/src', proof.beforeRenderer, set, 'fullCard'),
  );
assert.equal(
  await abuFractionalRuntimeCompatible('games/magic/src', '0'.repeat(64), '8ed', 'fullCard'),
  false,
);
const selected = JSON.parse(gunzipSync(await readFile(proof.evidence.selected.file)));
assert.equal(selected.summary.inventory, 899);
assert.equal(selected.summary.accepted, 896);
assert.equal(selected.summary.addedRows, 0);
assert.equal(selected.summary.fontSizeChanges, 17);
assert.equal(selected.status, 'complete-development-census');
for (const set of ['lea', 'leb', '2ed'])
  assert(selected.sets[set].after100 > selected.sets[set].before100);
for (const name of ['Mana Vault', 'Hypnotic Specter', 'Living Wall']) {
  const r = selected.rows.find((r) => r.set === '2ed' && r.name === name);
  assert.equal(r.afterLayout.size, 15.5);
  assert(r.score.delta100 > 25);
}
const simulacrum = selected.rows.find((r) => r.set === '2ed' && r.name === 'Simulacrum');
assert.equal(simulacrum.afterLayout.size, 15.25);
assert.equal(simulacrum.afterLayout.lines.length, 6);
const shadow = selected.rows.find((r) => r.set === 'lea' && r.name === 'Nether Shadow');
assert.equal(shadow.afterLayout.lines.length, 7);
assert(shadow.score.delta100 > 0);

const dualBase = 'games/magic/fixtures/accuracy/early-through-fourth/';
const dualRaw = gunzipSync(await readFile(dualBase + 'abu-dual-frame-recheck.json.gz'));
const dual = JSON.parse(dualRaw);
const dualReview = JSON.parse(await readFile(dualBase + 'abu-dual-frame-review.json'));
assert.equal(hash(dualRaw), dualReview.measurementSha256);
assert.equal(dual.rendererHash, proof.afterRenderer);
assert.equal(dual.nativeHash, proof.evidence.native.contentSha256);
assert.equal(dual.summary.inventory, 19);
assert.equal(dual.summary.frameIdentical, 19);
assert.equal(dual.rows.filter((r) => r.set === 'lea').length, 9);
assert.equal(dual.rows.filter((r) => r.set === 'leb').length, 10);
assert.equal(dualReview.rows.length, 19);
assert.equal(
  hash(await readFile('games/magic/tools/accuracy/abu-dual-frame-recheck.mjs')),
  dual.toolHash,
);
for (const r of dual.rows) {
  const n = selected.rows.find((n) => n.id === r.id);
  assert(n);
  assert.equal(r.referenceHash, n.referenceHash);
  assert.equal(r.poseHash, n.poseHash);
  assert.equal(r.renderHash, n.afterFaceHash);
  assert.equal(r.nonRulesChanged, 0);
  assert(dualReview.rows.some((v) => v.id === r.id && v.renderHash === r.renderHash));
  for (const side of Object.values(r.sides)) {
    assert(Number.isFinite(side.edgeCosine100));
    assert(Number.isFinite(side.bestDiagnostic.cosine));
    assert(Math.abs(side.bestDiagnostic.shift) <= 4);
  }
}

const fullRaw = gunzipSync(await readFile(dualBase + 'abu-fractional-full-score.json.gz'));
const full = JSON.parse(fullRaw);
const common = JSON.parse(
  gunzipSync(await readFile(dualBase + 'abu-fractional-full-report.json.gz')),
);
assert.equal(common.source.rawScoreHash, hash(fullRaw));
assert.equal(
  hash(await readFile('games/magic/tools/accuracy/abu-fractional-full-score.mjs')),
  full.source.toolHash,
);
assert.equal(
  hash(await readFile('games/magic/tools/accuracy/abu-fractional-full-report.mjs')),
  common.source.reportToolHash,
);
assert.equal(full.source.nativeHash, proof.evidence.native.contentSha256);
assert.equal(common.rows.length, 899);
assert.equal(full.rows.length, 899);
assert.equal(new Set(common.rows.map((r) => r.id)).size, 899);
for (const r of common.rows) {
  const n = selected.rows.find((n) => n.id === r.id);
  assert.equal(r.beforeFaceHash, n.beforeFaceHash);
  assert.equal(r.afterFaceHash, n.afterFaceHash);
  assert.equal(r.referenceHash, n.referenceHash);
  assert.equal(r.poseHash, n.poseHash);
  assert.equal(r.accepted, n.accepted);
  const a = r.scores.before,
    b = r.scores.after,
    c = r.comparison;
  assert.deepEqual(c.eligibilityChanges, []);
  assert.equal(a.expectedWeight, b.expectedWeight);
  assert.equal(c.commonWeight, a.measuredWeight);
  assert.equal(c.commonWeight, b.measuredWeight);
  let weight = 0,
    before = 0,
    after = 0;
  for (const key of c.commonComponents) {
    assert(a.components[key].eligible && b.components[key].eligible);
    assert.equal(a.components[key].weight, b.components[key].weight);
    weight += a.components[key].weight;
    before += a.components[key].weight * a.components[key].score100;
    after += b.components[key].weight * b.components[key].score100;
  }
  assert.equal(weight, c.commonWeight);
  assert(Math.abs(before / weight - c.before100) < 1e-10);
  assert(Math.abs(after / weight - c.after100) < 1e-10);
}
for (const set of ['lea', 'leb', '2ed']) {
  const result = common.sets[set];
  assert(result.after100 > result.before100);
  assert(result.medianAfter100 > result.medianBefore100);
  assert(result.p10After100 > result.p10Before100);
}
console.log(
  'ABU audit:899native faces,0added rows, typed source restoration, explicit metadata close and unaffected-component reuse pass.',
);
