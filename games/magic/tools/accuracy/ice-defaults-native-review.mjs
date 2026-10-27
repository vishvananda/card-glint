// Verify inherited defaults against frozen Original controls; no template fitting.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { PNG } from 'pngjs';
import { hash, sourceHash, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { metricSourceGraph } from './module-graph.mjs';
import { iceDefaultsDelta } from './ice-defaults-ancestry.mjs';
const [
  inputsFile,
  captureFile,
  previousFourth,
  oldDefaultDirectory,
  metricsFile,
  policyFile,
  output,
] = process.argv.slice(2);
assert(
  output,
  'Usage: ice-defaults-native-review.mjs INPUTS CAPTURE FOURTH_CAPTURE OLD_DEFAULTS_DIR METRICS POLICY OUTPUT',
);
const raw = await Promise.all([inputsFile, captureFile, previousFourth].map((f) => fs.readFile(f)));
const [inputs, capture, fourth] = raw.map((b) => JSON.parse(b)),
  delta = await iceDefaultsDelta();
assert.equal(capture.status, 'complete');
assert.equal(capture.inputHash, hash(raw[0]));
assert.equal(capture.rendererHash, delta.afterRenderer);
assert.equal(capture.rendererHash, await sourceHash('games/magic/src'));
assert.equal(fourth.status, 'complete');
assert.equal(inputs.entries.length, 488);
assert.equal(capture.rows.length, 488);
const metric = await metricSourceGraph(path.resolve(metricsFile)),
  policy = await metricSourceGraph(path.resolve(policyFile));
const { scoreRegions } = await import(pathToFileURL(path.resolve(metricsFile)));
const studies = {},
  baselines = {};
for (const set of ['ice', 'mir', 'usg', 'ons']) {
  studies[set] = JSON.parse(
    await fs.readFile(path.join(oldDefaultDirectory, set + '-trials-r3/study.json')),
  );
  baselines[set] = JSON.parse(
    await fs.readFile(path.join(oldDefaultDirectory, set + '-native/capture.json')),
  );
  assert.equal(studies[set].metricGraph.hash, metric.hash);
  assert.equal(studies[set].policyGraph.hash, policy.hash);
}
const rows = [];
let nativeVariants = 0;
for (const e of inputs.entries) {
  const set = e.card.set.toLowerCase(),
    now = capture.rows.find((r) => r.id === e.id);
  const prior = (set === '4ed' ? fourth : baselines[set]).rows.find((r) => r.id === e.id);
  assert(prior);
  assert.equal(now.referenceHash, prior.referenceHash);
  assert.equal(now.artHash, prior.artHash);
  const modes = {};
  for (const [mode, b] of Object.entries(prior.modes)) {
    const a = now.modes[mode];
    assert.equal(a.inputHash, b.inputHash);
    const file = path.join(path.dirname(captureFile), a.file),
      bytes = await fs.readFile(file);
    assert.equal(hash(bytes), a.sha256);
    nativeVariants++;
    if (set !== 'ice') {
      assert.equal(a.sha256, b.sha256, e.name + ' ' + mode + ' pixels');
      assert.equal(a.keyHash, b.keyHash, e.name + ' ' + mode + ' key');
    }
    modes[mode] = { before: b.sha256, after: a.sha256, beforeKey: b.keyHash, afterKey: a.keyHash };
  }
  const row = {
    id: e.id,
    set,
    name: e.name,
    referenceHash: e.reference.sha256,
    inputHash: hash(JSON.stringify(e.face)),
    modes,
  };
  if (set === 'ice') {
    const old = studies.ice.rows.find((r) => r.id === e.id);
    assert.equal(old.referenceHash, row.referenceHash);
    assert.equal(old.inputHash, row.inputHash);
    const scan = normalize(
      PNG.sync.read(
        await fs.readFile(path.join(oldDefaultDirectory, 'ice-trials-r3', old.scanFile)),
      ),
    );
    const face = {
      ...e.face,
      typeSource: 'Scan-reviewed type',
      rulesSource: 'Original printing source',
    };
    const bytes = await fs.readFile(path.join(path.dirname(captureFile), now.modes.original.file));
    row.ranked = old.ranked;
    row.poseHash = hash(JSON.stringify(old.pose));
    row.before = old.modes.current.score;
    row.after = scoreRegions(scan, normalize(PNG.sync.read(bytes)), e.card, face);
  }
  rows.push(row);
}
const ranked = rows.filter((r) => r.set === 'ice' && r.ranked);
const mean = (key) =>
  (100 * ranked.reduce((s, r) => s + r[key].structuralScore, 0)) / ranked.length;
await writeJson(output, {
  schema: 1,
  status: 'complete-inherited-default-native-review',
  set: 'ice',
  donor: '4ed',
  rendererHash: capture.rendererHash,
  inputsHash: hash(raw[0]),
  captureHash: hash(raw[1]),
  previousFourthHash: hash(raw[2]),
  toolHash: hash(await fs.readFile(new URL(import.meta.url))),
  metricGraph: metric,
  policyGraph: policy,
  scope:
    'Inherited starting point, not Ice Age certification. Original wording and scans are frozen. Existing scan-only poses are reused; rejected scans are excluded from means. All prior Fourth modes and later-set Original pixels/keys remain exact.',
  summary: {
    cards: 488,
    verifiedPriorVariants: nativeVariants,
    unaffectedOriginals: 459,
    iceCards: 29,
    ranked: ranked.length,
    rejected: 29 - ranked.length,
    before100: mean('before'),
    after100: mean('after'),
    gains: ranked.filter((r) => r.after.structuralScore > r.before.structuralScore).length,
    losses: ranked.filter((r) => r.after.structuralScore < r.before.structuralScore).length,
  },
  rows,
});
console.log({ ranked: ranked.length, before: mean('before'), after: mean('after') });
