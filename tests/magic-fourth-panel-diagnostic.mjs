import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { fourthNonbasicDelta } from '../games/magic/tools/accuracy/fourth-nonbasic-ancestry.mjs';
import {
  fitGradientProfiles,
  profileSupport,
} from '../games/magic/tools/accuracy/scan-gradient-fit.mjs';
const review = JSON.parse(
    await fs.readFile('games/magic/fixtures/accuracy/4ed/panel-normalization-review.json'),
  ),
  artifacts = {};
for (const [k, ref] of Object.entries(review.artifacts)) {
  const z = await fs.readFile(ref.file),
    raw = gunzipSync(z);
  assert.equal(hash(z), ref.sha256);
  assert.equal(hash(raw), ref.contentSha256);
  assert(!/\/home\/|\/Users\/|127\.0\.0\.1/.test(raw.toString()));
  const p = JSON.parse(raw);
  artifacts[k] = p;
  for (const [file, expected] of Object.entries(p.sources))
    assert.equal(hash(await fs.readFile('games/magic/tools/accuracy/' + file)), expected, file);
}
const p = await fourthNonbasicDelta(),
  native = JSON.parse(gunzipSync(await fs.readFile(p.native.file))),
  reg = artifacts.registration,
  text = artifacts.text,
  texture = artifacts.texture;
assert.equal(review.status, 'rejected-local-panel-warp-retain-stock');
assert.equal(review.scope.rendererDefaultsChanged, false);
assert.equal(review.scope.wholeCardScoresChanged, false);
assert.equal(review.scope.fullSetComplete, false);
assert.equal(reg.inputHash, native.inputHash);
assert.equal(text.inputHash, reg.inputHash);
assert.equal(texture.inputHash, reg.inputHash);
assert.equal(text.registrationHash, review.artifacts.registration.contentSha256);
assert.equal(texture.registrationHash, review.artifacts.registration.contentSha256);
assert.equal(text.rendererHash, p.afterRenderer);
assert.equal(review.rendererHash, p.afterRenderer);
assert.equal(reg.rows.length, 378);
assert.deepEqual(reg.rows.map((r) => r.id).sort(), native.rows.map((r) => r.id).sort());
for (const r of reg.rows) {
  const n = native.rows.find((n) => n.id === r.id);
  assert.equal(r.referenceHash, n.referenceHash);
  assert(r.contentIsolationPassed);
  const fit = fitGradientProfiles(
    { ...r, fit: { transform: { scale: 1, tx: 0, ty: 0 } } },
    {
      template: reg.templates[0][r.material],
      independentTemplate: reg.templates[1][r.material],
      search: 'independent-axis-seed-v1',
    },
  );
  assert.deepEqual(fit, r.fit, 'Frame-only fit replay drifted for ' + r.name);
  assert.deepEqual(
    profileSupport(r.certificationProfiles, reg.templates[2][r.material], fit.parameters, {
      residuals: true,
    }),
    r.certificate,
  );
  assert.equal(r.exact.length, 3);
}
assert.equal(reg.summary.accepted, 368);
assert.equal(reg.rows.filter((r) => r.material !== 'L' && r.accepted).length, 359);
assert.equal(reg.rows.filter((r) => r.material !== 'L' && !r.accepted)[0].name, 'Erg Raiders');
const studyReview = JSON.parse(
    await fs.readFile('games/magic/fixtures/accuracy/4ed/nonland-text-review.json'),
  ),
  study = JSON.parse(gunzipSync(await fs.readFile(studyReview.artifact.file)));
assert.equal(text.studyHash, studyReview.artifact.contentSha256);
assert.equal(text.rows.length, 360);
assert.equal(texture.rows.length, 378);
for (const r of text.rows) {
  const parent = reg.rows.find((p) => p.id === r.id),
    n = native.rows.find((n) => n.id === r.id),
    s = study.rows.find((s) => s.id === r.id);
  assert.equal(r.nativeHash, n.modes.original.after);
  assert.equal(r.referenceHash, n.referenceHash);
  assert.deepEqual(r.parentTransform, parent.parentTransform);
  assert.deepEqual(r.panelTransform, parent.transform);
  assert.equal(r.accepted, parent.accepted);
  assert(
    Math.abs(r.before.score - s.trials[0].metric.score) < 1e-8,
    'CPU/browser metric drift ' + r.name,
  );
  if (r.candidateBefore)
    assert(Math.abs(r.candidateBefore.score - s.trials[1].metric.score) < 1e-8);
}
assert.deepEqual(
  text.rows
    .filter((r) => r.narrow)
    .map((r) => r.id)
    .sort(),
  studyReview.exploratorySlices.find((s) => s.maxCharacters === 130).ids,
);
assert.equal(text.summary.accepted, 359);
assert.equal(text.summary.narrowSelected, 37);
assert.equal(text.summary.narrowGains, 36);
assert.equal(text.summary.narrowLosses, 1);
assert(text.summary.currentPanel100 < text.summary.currentStock100);
for (const m of ['W', 'U', 'B', 'R', 'G', 'A']) {
  assert(texture.summary[m].after.ncc < texture.summary[m].before.ncc);
  assert(texture.summary[m].after.residual > texture.summary[m].before.residual);
}
const v = texture.rows.filter((r) => r.material !== 'L' && r.cohort === 'validation'),
  mean = (a) => a.reduce((s, n) => s + n, 0) / a.length;
for (const mode of ['before', 'after']) {
  const patches = v.flatMap((r) => r[mode]).filter((p) => !p.weak);
  assert.equal(review.independentTexture[mode].cards, v.length);
  assert.equal(review.independentTexture[mode].patches, patches.length);
  assert.equal(review.independentTexture[mode].ncc, mean(patches.map((p) => p.at.score)));
}
assert.deepEqual(review.registration, reg.summary);
console.log(
  'Fourth panel audit:378 frame-only fit replays,360 exact CPU/browser metrics,untouched texture checks and retained stock-pose decision pass.',
);
