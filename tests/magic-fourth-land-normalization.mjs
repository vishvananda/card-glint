import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash, root } from '../games/magic/tools/accuracy/common.mjs';
const base = root + '/games/magic/fixtures/accuracy/4ed/';
const receipt = JSON.parse(await fs.readFile(base + 'land-normalization-review.json'));
const loaded = {};
for (const [key, a] of Object.entries(receipt.artifacts)) {
  const raw = await fs.readFile(root + '/' + a.file),
    bytes = gunzipSync(raw);
  assert.equal(hash(raw), a.sha256);
  assert.equal(hash(bytes), a.contentSha256);
  loaded[key] = a.file.endsWith('.json.gz') ? JSON.parse(bytes) : bytes.toString();
}
const inputBytes = gunzipSync(await fs.readFile(base + 'flavor-fractional-inputs.json.gz'));
const inputs = JSON.parse(inputBytes),
  prior = JSON.parse(
    gunzipSync(await fs.readFile(base + 'flavor-fractional-whole-scores.json.gz')),
  );
const capture = JSON.parse(
  gunzipSync(await fs.readFile(base + 'flavor-fractional-native-capture.json.gz')),
);
const { registration: study, scores, parentPoses } = loaded;
assert.equal(receipt.status, 'one-reference-only-refinement-measured-global-audit-open');
assert.equal(scores.registrationReproduced, true);
assert.equal(study.status, 'complete-experimental-not-adopted');
assert.equal(scores.rendererHash, capture.rendererHash);
assert.equal(scores.inputHash, hash(inputBytes));
assert.equal(study.inputHash, hash(inputBytes));
assert.equal(study.parentHash, receipt.artifacts.parentPoses.contentSha256);
assert.equal(scores.sources.registration, receipt.artifacts.registration.contentSha256);
assert.equal(
  scores.sources.native,
  hash(gunzipSync(await fs.readFile(base + 'flavor-fractional-native-capture.json.gz'))),
);
assert.equal(study.sources['fourth-land-registration.mjs'], hash(loaded.registrationTool));
assert.equal(scores.toolHash, hash(loaded.scoreTool));
assert.deepEqual(scores.metricGraph, prior.metricGraph);
assert.deepEqual(scores.policyGraph, prior.policyGraph);
assert.equal(study.rows.length, 15);
assert.equal(new Set(study.rows.map((r) => r.id)).size, 15);
const selected = [];
for (const r of study.rows) {
  const e = inputs.entries.find((e) => e.id === r.id),
    parent = parentPoses.rows.find((p) => p.id === r.id);
  assert(e && parent?.accepted);
  assert(/^Basic Land\b/.test(e.card.type_line));
  assert.equal(r.referenceHash, e.reference.sha256);
  assert.deepEqual(r.parentTransform, parent.transform);
  assert.equal(r.contentIsolationPassed, true);
  const panel =
    r.fit.accepted &&
    [r.certificate, ...r.exact].every(
      (v) =>
        v.accepted &&
        v.confidence >= 0.9 &&
        Object.values(v.sides).every((x) => x >= 0.8) &&
        v.residualRms <= 0.5,
    );
  assert.equal(r.panelAccepted, Boolean(panel));
  let texture = false;
  if (r.texture.length) {
    assert.equal(r.texture.length, 6);
    assert.equal(new Set(r.texturePeers).size, 2);
    const mean = (values) => values.reduce((a, b) => a + b, 0) / values.length;
    const before = mean(r.texture.map((t) => t.before.at.score)),
      after = mean(r.texture.map((t) => t.after.at.score));
    const br = mean(r.texture.map((t) => t.before.residual)),
      ar = mean(r.texture.map((t) => t.after.residual));
    const delta = Math.min(...r.texture.map((t) => t.after.at.score - t.before.at.score));
    const weak = r.texture.some((t) => t.before.weak || t.after.weak);
    assert(Math.abs(before - r.textureSummary.beforeNcc) < 1e-12);
    assert(Math.abs(after - r.textureSummary.afterNcc) < 1e-12);
    assert(Math.abs(br - r.textureSummary.beforeResidual) < 1e-12);
    assert(Math.abs(ar - r.textureSummary.afterResidual) < 1e-12);
    assert(Math.abs(delta - r.textureSummary.minimumPatchDelta) < 1e-12);
    texture = !weak && after >= 0.8 && after >= before + 0.01 && delta >= -0.01 && ar <= br - 0.25;
    for (const id of r.texturePeers) {
      assert.notEqual(id, r.id);
      const peer = parentPoses.rows.find((p) => p.id === id);
      assert.equal(peer.name, r.name);
      assert(
        peer.fit.confidence >= 0.9 &&
          peer.certification.confidence >= 0.9 &&
          Object.values(peer.certification.sides).every((v) => v >= 0.8),
      );
    }
  }
  assert.equal(r.textureAccepted, texture);
  assert.equal(r.acceptedExperimental, Boolean(panel && texture));
  if (r.acceptedExperimental) selected.push(r.id);
}
assert.equal(selected.length, 1);
assert.deepEqual(
  selected,
  receipt.selected.map((r) => r.id),
);
assert.equal(scores.rows.length, 378);
assert.equal(new Set(scores.rows.map((r) => r.id)).size, 378);
for (const r of scores.rows) {
  const old = prior.rows.find((o) => o.id === r.id),
    native = capture.rows.find((c) => c.id === r.id).modes.original;
  assert.equal(r.nativeHash, native.sha256);
  assert.equal(r.inputHash, old.inputHash);
  assert.equal(r.referenceHash, old.referenceHash);
  assert.deepEqual(r.beforeScore, old.score);
  assert.equal(r.beforePoseHash, old.poseHash);
  assert.equal(r.normalizationChanged, selected.includes(r.id));
  if (!r.normalizationChanged) {
    assert.equal(r.poseHash, old.poseHash);
    assert.deepEqual(r.score, old.score);
    assert.equal(r.scoreReused, true);
  } else {
    const refit = study.rows.find((s) => s.id === r.id);
    assert.equal(r.poseHash, hash(JSON.stringify(refit.transform)));
    assert.equal(r.scoreReused, false);
    assert(r.score.structuralScore > old.score.structuralScore);
    // Keep the observed art/credit losses visible; frame normalization is not a per-component fit.
    assert(r.score.components.credits.score < old.score.components.credits.score);
  }
}
assert.equal(scores.summary.fresh, 1);
assert.equal(scores.summary.reused, 377);
const mean = (key) => (100 * scores.rows.reduce((n, r) => n + r[key].structuralScore, 0)) / 378;
assert.equal(scores.summary.before100, mean('beforeScore'));
assert.equal(scores.summary.current100, mean('score'));
assert.deepEqual(scores.summary, receipt.summary);
console.log(
  'Fourth land normalization:15 scan-only trials,disjoint pixels,two independent texture peers,one gated refinement,378 exact metric/input/native joins and377 unchanged scores. Renderer and whole-set approval unchanged.',
);
