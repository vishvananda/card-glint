import {
  fourthCenteredHistoricalHash,
  preFourthCenteredSource,
} from '../games/magic/tools/accuracy/fourth-centered-ancestry.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { createServer } from './magic-vite.mjs';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import {
  wallReviews,
  wallPaths,
  wallWordingDelta,
  wallWordingHistoricalHash,
  preWallWordingSource,
  wallWordingAffected,
  validateWallWordingData,
} from '../games/magic/tools/accuracy/wall-wording-data.mjs';
const p = await wallWordingDelta();
assert.equal(await fourthCenteredHistoricalHash(), p.afterRenderer);
assert.equal(await wallWordingHistoricalHash(), p.beforeRenderer);
for (const [file, r] of Object.entries(p.files)) {
  const b = await preFourthCenteredSource(file, await fs.readFile(file));
  assert.equal(hash(b), r.after);
  assert.equal(hash(await preWallWordingSource(file, b)), r.before);
  const unknown = Buffer.concat([b, Buffer.from('\n// unknown edit\n')]);
  assert.deepEqual(await preWallWordingSource(file, unknown), unknown);
}
const tampered = structuredClone(p),
  file = wallPaths.annotation2;
const data = JSON.parse(tampered.files[file].afterSource);
data.cards[wallReviews[0].id].flavorText = 'Hidden flavor change';
tampered.files[file].afterSource = JSON.stringify(data);
tampered.files[file].after = hash(tampered.files[file].afterSource);
assert.throws(() => validateWallWordingData(tampered));
const s = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false } });
try {
  const { resolveSetPrintingWording } = await s.ssrLoadModule('/games/magic/src/printing/lazy.ts');
  for (const r of wallReviews) {
    const flavor = [
      {
        role: 'flavor',
        runs: [
          { text: 'Caller italic ', italic: true },
          { text: 'book title', italic: false },
        ],
      },
      { role: 'flavor', runs: [{ text: '—An author', italic: true }] },
    ];
    const rule =
      r.name === 'Wall of Stone'
        ? "(Walls can't attack.)"
        : "Defender (This creature can't attack.)";
    const original = {
      typeLine: 'Summon Wall',
      rulesText: rule,
      flavorText: 'Caller italic book title\n—An author',
      rulesParagraphs: [{ role: 'rules', runs: [{ text: rule, italic: true }] }, ...flavor],
    };
    const oracle = {
      typeLine: 'Creature — Wall',
      rulesText: "Defender (This creature can't attack.)",
    };
    const input = { original, oracle },
      before = JSON.stringify(input);
    const result = await resolveSetPrintingWording(r.set, r.id, input, {
      referenceSha256: r.referenceHash,
    });
    assert.equal(result.provenance.status, 'applied');
    assert.equal(JSON.stringify(input), before);
    assert.deepEqual(result.wordings.original.rulesParagraphs, flavor);
    assert.equal(result.wordings.original.rulesText, original.flavorText);
    assert.equal(result.wordings.original.typeLine, 'Summon Wall');
    assert.equal(result.wordings.oracle.rulesText, oracle.rulesText);
    const stale = await resolveSetPrintingWording(r.set, r.id, input, {
      referenceSha256: '0'.repeat(64),
    });
    assert.equal(stale.provenance.status, 'reference-mismatch');
    assert.equal(stale.wordings.original.rulesParagraphs[0].role, 'rules');
  }
} finally {
  await s.close();
}
for (const r of wallReviews) {
  const group = { printingIds: [r.id] };
  for (const task of ['rules', 'flavor', 'fullCard', 'release']) {
    assert(await wallWordingAffected(r.set, task, false, group));
    assert.equal(await wallWordingAffected(r.set, task, true, group), task === 'rules');
    assert(!(await wallWordingAffected(r.set, task, false, { printingIds: ['unrelated'] })));
  }
  for (const task of [
    'references',
    'normalization',
    'frameGeometry',
    'frameColor',
    'paperColor',
    'blackLevels',
    'headings',
    'manaGeometry',
    'manaColor',
    'artist',
    'footer',
    'stats',
    'setSymbol',
  ])
    assert(!(await wallWordingAffected(r.set, task, false, group)));
  assert(!(await wallWordingAffected('lea', 'rules', false, group)));
  assert(!(await wallWordingAffected('leb', 'rules', false, group)));
}
const review = JSON.parse(
  await fs.readFile('games/magic/fixtures/accuracy/early-through-fourth/wall-wording-review.json'),
);
const native = JSON.parse(gunzipSync(await fs.readFile(p.native.file)));
const readArtifact = async (ref) => {
  const z = await fs.readFile(ref.file);
  assert.equal(hash(z), ref.sha256);
  const raw = gunzipSync(z);
  assert.equal(hash(raw), ref.contentSha256);
  assert(!/\/home\/|\/Users\/|127\.0\.0\.1/.test(raw.toString()));
  return raw;
};
assert.equal(native.toolHash, hash(await readArtifact(review.artifacts.nativeTool)));
const reuse = JSON.parse(await readArtifact(review.artifacts.baselineReuse));
assert.equal(reuse.toolHash, hash(await readArtifact(review.artifacts.baselineReuseTool)));
assert.equal(reuse.rendererHash, p.beforeRenderer);
assert.deepEqual(reuse.reuse, { reused: 302, fresh: 0 });
const parent = JSON.parse(
  gunzipSync(
    await fs.readFile(
      'games/magic/fixtures/accuracy/early-through-fourth/abu-flow-current-scores.json.gz',
    ),
  ),
);
assert.deepEqual(reuse.metricGraph, parent.source.metricGraph);
assert.equal(reuse.rows.length, 302);
assert.equal(new Set(reuse.rows.map((r) => r.id)).size, 302);
for (const r of reuse.rows) {
  const old = parent.rows.find((v) => v.id === r.id);
  assert(old && old.set === '2ed');
  assert.equal(r.nativeHash, old.nativeFaceHash);
  assert.equal(r.referenceHash, old.referenceHash);
  assert.equal(r.inputHash, old.inputHash);
  assert.equal(r.historicalPoseHash, old.poseHash);
  assert.equal(r.score.structuralScore, old.score100 / 100);
  for (const [key, value] of Object.entries(old.components))
    assert.equal(r.score.components[key].score100, value.score100);
  assert.equal(r.diagnosticFormat, 'archived-compact');
}

for (const set of ['2ed', '4ed']) {
  const scores = JSON.parse(await readArtifact(review.artifacts[set + 'Scores']));
  assert.equal(scores.wallNativeProofHash, p.native.contentSha256);
  assert.equal(scores.rendererHash, p.afterRenderer);
  assert.deepEqual(scores.reuse, { reused: set === '2ed' ? 300 : 376, fresh: 2 });
  assert.deepEqual(review.sets[set].wholeCard, scores.summary.all);
  const scoped = wallReviews.filter((r) => r.set === set).map((r) => r.id);
  for (const r of scores.rows) {
    const n = native.sets[set].rows.find((n) => n.id === r.id);
    assert.equal(r.beforeNativeHash, n.modes.original.before);
    assert.equal(r.nativeHash, n.modes.original.after);
    assert.equal(r.scoreReused, !scoped.includes(r.id));
    assert.equal(r.referenceHash, n.referenceHash);
  }
}
console.log(
  'Wall source:4 exact empty Original reviews,caller flavor/Oracle retained,2720 scoped native variants,676 score reuses and narrowly reopened approvals pass.',
);
