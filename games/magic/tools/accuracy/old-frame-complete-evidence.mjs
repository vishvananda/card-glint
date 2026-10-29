// Complete Original native/scan/score census; never copies external image pixels.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { format } from 'prettier';
import { hash, sourceHash, root } from './common.mjs';
const [study, out] = process.argv.slice(2);
assert(out, 'Use STUDY_DIRECTORY NEW_ARCHIVE');
await fs.access(out).then(
  () => {
    throw Error('Archive exists');
  },
  (e) => {
    if (e.code !== 'ENOENT') throw e;
  },
);
const read = async (f) => JSON.parse(await fs.readFile(path.join(study, f)));
const renderer = await sourceHash(path.join(root, 'games/magic/src'));
const withoutCredits = (score) => {
  const copy = structuredClone(score);
  delete copy.components.credits;
  return copy;
};
const sets = {};
for (const [set, count] of [
  ['mir', 351],
  ['ons', 350],
]) {
  const inputs = await read(set + '-inputs-reviewed-artist-v1.json');
  const poses = await read(set + '-poses-complete-075.json');
  const audit = await read(set + '-chromatic-audit-v5.json');
  const proposal = await read(set + '-chromatic-recovery-v5.json');
  const scores = await read(set + '-scores-final-075.json');
  const before = await read(set + '-before-scores-complete-075.json');
  const native = await read(set + '-installed-native-v4/capture.json');
  const previous = await read(set + '-components-scores-v' + (set === 'mir' ? 13 : 14) + '.json');
  const original = await read(set + '-public-source-parity-v6.json');
  const parentPoseBytes = await fs.readFile(
    path.join(study, set + '-artist-lineage-v1/poses.json'),
  );
  const parentPoses = JSON.parse(parentPoseBytes);
  assert.equal(poses.parentPoseHash, hash(parentPoseBytes));
  const previousRows = previous.rows.map((r) => ({
    id: r.id,
    referenceHash: r.referenceHash,
    nativeHash: r.nativeHash,
    poseTransformHash: r.poseTransformHash,
    scoreDigest: r.score ? hash(JSON.stringify(r.score)) : null,
    nonCreditScoreDigest: r.score ? hash(JSON.stringify(withoutCredits(r.score))) : null,
  }));

  assert.equal(inputs.entries.length, count);
  assert.equal(native.rows.length, count);
  assert.equal(native.source.rendererHash, renderer);
  assert.equal(original.source.renderer, renderer);
  assert.equal(
    scores.captureHash,
    hash(await fs.readFile(path.join(study, set + '-installed-native-v4/capture.json'))),
  );
  assert.equal(
    scores.poseHash,
    hash(await fs.readFile(path.join(study, set + '-poses-complete-075.json'))),
  );
  assert.equal(
    poses.adoption.auditHash,
    hash(await fs.readFile(path.join(study, set + '-chromatic-audit-v5.json'))),
  );
  assert.equal(poses.summary.accepted, count);
  assert.equal(poses.summary.rejected, 0);
  assert.equal(scores.summary.measured, count);
  assert.equal(before.summary.measured, count);
  assert.equal(scores.metrics.hash, before.metrics.hash);
  let unchanged = 0,
    amendedFooters = 0;
  for (const row of scores.rows) {
    const old = previous.rows.find((r) => r.id === row.id),
      image = native.rows.find((r) => r.id === row.id);
    const face = inputs.entries.find((r) => r.id === row.id),
      pose = poses.rows.find((r) => r.id === row.id);
    assert(row.score);
    assert(pose.accepted);
    assert.equal(row.nativeHash, image.sha256);
    assert.equal(image.inputHash, hash(JSON.stringify(face.face)));
    assert.equal(row.referenceHash, face.reference.sha256);
    assert.equal(row.poseTransformHash, hash(JSON.stringify(pose.transform)));
    const oldPose = parentPoses.rows.find((r) => r.id === row.id);
    if (oldPose.accepted) assert.deepEqual(pose.transform, oldPose.transform);

    if (old.score) {
      if (image.footerRevision) {
        assert.equal(set, 'mir');
        assert.equal(image.footerRevision.kind, 'mir-gold-light-copyright');
        assert.equal(image.footerRevision.previousNativeHash, old.nativeHash);
        assert.equal(face.material, 'M');
        assert(image.footerRevision.changedPixels > 0);
        assert.deepEqual(
          withoutCredits(row.score),
          withoutCredits(old.score),
          'Copyright amendment affected a scored region',
        );
        amendedFooters++;
      } else {
        assert.equal(old.nativeHash, row.nativeHash);
        assert.deepEqual(row.score, old.score, 'Existing metric changed: ' + row.name);
        unchanged++;
      }
    }
  }
  assert.equal(count - unchanged - amendedFooters, set === 'mir' ? 1 : 6);
  const members = inputs.entries.map((e) => {
    const n = native.rows.find((r) => r.id === e.id),
      p = poses.rows.find((r) => r.id === e.id),
      s = scores.rows.find((r) => r.id === e.id),
      b = before.rows.find((r) => r.id === e.id);
    return {
      id: e.id,
      name: e.name,
      card: e.card,
      face: e.face,
      wordingEvidence: e.wordingEvidence,
      material: e.material,
      reference: e.reference,
      poseHash: hash(JSON.stringify(p.transform)),
      inputHash: n.inputHash,
      nativeFaceHash: n.sha256,
      ...(n.footerRevision ? { footerRevision: n.footerRevision } : {}),
      before100: b.score.structuralScore * 100,
      after100: s.score.structuralScore * 100,
      components: Object.fromEntries(
        Object.entries(s.score.components).map(([k, c]) => [
          k,
          { eligible: c.eligible, score100: Number.isFinite(c.score) ? c.score * 100 : null },
        ]),
      ),
    };
  });
  sets[set] = {
    native,
    original,
    poses,
    audit,
    proposal,
    scores,
    before,
    beforeLabel:
      'Frozen component-fit baseline with reviewed Original inputs; not a replay of the published release.',
    members,
    parentPoses,
    previousRows,
    unchangedScores: unchanged,
    amendedFooters,
    recovered: count - unchanged - amendedFooters,
  };
  console.log(
    set,
    'all',
    count,
    'scored; unchanged native/score pairs',
    unchanged,
    'copyright amendments',
    amendedFooters,
    'recovered scan alignments',
    count - unchanged - amendedFooters,
  );
}
const methods = {};
for (const f of [
  'old-frame-complete-evidence.mjs',
  'old-frame-installed-capture.mjs',
  'old-frame-heading-study.mjs',
  'old-frame-chromatic-profiles.mjs',
  'old-frame-chromatic-recovery.mjs',
  'old-frame-chromatic-audit.mjs',
  'old-frame-chromatic-adopt.mjs',
  'old-frame-set-baseline-score.mjs',
  'old-frame-peer-profiles.mjs',
  'old-frame-default-registration.mjs',
  'scan-frame-fit.mjs',
  'scan-affine-fit.mjs',
  'pixels-pure.mjs',
  'scan-transform.mjs',
]) {
  const file = 'games/magic/tools/accuracy/' + f,
    source = await fs.readFile(path.join(root, file), 'utf8');
  methods[file] = { sha256: hash(source), source };
}
const footerFile = 'games/magic/fixtures/accuracy/mirage-onslaught/footer-review.json.gz';
const data = {
  footerReview: { file: footerFile, sha256: hash(await fs.readFile(path.join(root, footerFile))) },
  schema: 1,
  status: 'complete-installed-original-census-publication-pending',
  rendererHash: renderer,
  scope:
    'Every ordinary nonfoil printing has frozen Original inputs, exact native output, validated scan-only pose and regional/full structural indices.All prior scan transforms are unchanged; unchanged native faces retain exact scores, the gold copyright amendment is rescored and7 recovered scans add scores. References and card names are reused development data, not an independent holdout. Credits remain a separate artist/footer review and are excluded by this metric.',
  methods,
  sets,
  sourceAdoption: hash(
    await fs.readFile(
      path.join(root, 'games/magic/fixtures/accuracy/mirage-onslaught/production-adoption.json.gz'),
    ),
  ),
};
const zipped = gzipSync(JSON.stringify(data) + '\n', { level: 9, mtime: 0 });
await fs.writeFile(out, zipped, { flag: 'wx' });
const summaryFile = path.join(
  root,
  'games/magic/fixtures/accuracy/mirage-onslaught/installed-review.json',
);
const review = JSON.parse(await fs.readFile(summaryFile));
review.completeCensus = {
  file: path.relative(root, out),
  sha256: hash(zipped),
  printings: 701,
  scored: 701,
  rejected: 0,
  unchangedScores: Object.values(sets).reduce((n, s) => n + s.unchangedScores, 0),
  amendedFooters: Object.values(sets).reduce((n, s) => n + s.amendedFooters, 0),
  recovered: 7,
};
review.scope = data.scope;
for (const [set, p] of Object.entries(sets)) {
  Object.assign(review.sets[set], {
    scored: p.scores.summary.measured,
    rejected: [],
    before100: p.before.summary.structuralMean100,
    beforeLabel: p.beforeLabel,
    after100: p.scores.summary.structuralMean100,
    components: p.scores.summary.components,
    materials: p.scores.materials,
    outliers: [...p.members]
      .sort((a, b) => a.after100 - b.after100)
      .slice(0, 20)
      .map((r) => ({ id: r.id, name: r.name, material: r.material, score100: r.after100 })),
  });
}
review.pending = [
  'Bind the complete census to the current calibration ledger.',
  'Finish renderer checks and publish0.7.5 with the matching Lab revision.',
];
await fs.writeFile(
  summaryFile,
  await format(JSON.stringify(review), { parser: 'json', printWidth: 100 }),
);
console.log('Complete census', hash(zipped), zipped.length, 'bytes');
