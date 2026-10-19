import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { hash, writeJson } from '../games/magic/tools/accuracy/common.mjs';
import { metricSourceGraph } from '../games/magic/tools/accuracy/module-graph.mjs';

const dir = await mkdtemp(path.join(tmpdir(), 'magic-abu-score-'));
try {
  const inputFile = path.join(dir, 'input.json'),
    scoreFile = path.join(dir, 'score.json'),
    scorerFile = path.join(dir, 'metric.mjs'),
    output = path.join(dir, 'result.json'),
    candidate = path.join(dir, 'candidate'),
    baseline = path.join(dir, 'baseline');
  await Promise.all([
    mkdir(candidate + '/_source', { recursive: true }),
    mkdir(baseline + '/W', { recursive: true }),
  ]);
  const bytes = Buffer.from('Exact native bytes; a cache hit must not decode this file.'),
    renderHash = hash(bytes),
    face = { name: 'Test', rulesText: 'Draw a card.' },
    entry = {
      id: 'card',
      material: 'W',
      card: { name: 'Test' },
      face,
      reference: { sha256: 'a'.repeat(64) },
    };
  await writeJson(inputFile, { entries: [entry] });
  const inputHash = hash(await readFile(inputFile)),
    pose = {
      id: entry.id,
      referenceHash: entry.reference.sha256,
      accepted: true,
      cohort: 'calibration',
      transform: {},
    },
    poses = { set: 'lea', inputHash, rows: [pose] },
    normalizationHash = hash(JSON.stringify(poses));
  await writeJson(dir + '/normalization.json', poses);
  await writeJson(dir + '/templates.json', {});
  const definition = { inputHash, normalizationHash, nativeTrials: true },
    studyHash = hash(JSON.stringify(definition));
  await writeJson(candidate + '/_source/study.json', { studyHash, ...definition });
  await writeFile(
    scorerFile,
    'import "./policy.mjs"; export function scoreRegions() { throw Error("Must reuse exact pixels"); }',
  );
  await writeFile(dir + '/policy.mjs', 'export const weight = 26;');
  await writeFile(baseline + '/W/card.png', bytes);
  await writeFile(candidate + '/card-candidate.png', bytes);
  await writeJson(baseline + '/W/observations.json', {
    baseline: { version: '0.5.3' },
    records: [{ id: entry.id, face, baseline: { file: 'card.png', sha256: renderHash } }],
  });
  const trial = {
    id: entry.id,
    studyHash,
    referenceHash: entry.reference.sha256,
    poseHash: hash(JSON.stringify(pose)),
    baselineHash: renderHash,
    nativeTrial: { outside: 0, maximum: 0, renderHash },
  };
  await writeJson(candidate + '/card.json', trial);
  const scores = {
    baseline: '0.5.3',
    inputHash,
    normalizationHash,
    scorerHash: hash(await readFile(scorerFile)),
    metricGraph: await metricSourceGraph(scorerFile),
    rows: [
      {
        id: entry.id,
        name: 'Test',
        material: 'W',
        cohort: pose.cohort,
        referenceHash: entry.reference.sha256,
        renderHash,
        poseHash: trial.poseHash,
        profileAccepted: true,
        normalizationAccepted: true,
        structural100: 64,
        coverage: 1,
        components: { rules: { score100: 64, eligible: true } },
      },
    ],
  };
  await writeJson(scoreFile, scores);
  const run = () =>
    execFileSync(
      process.execPath,
      [
        'games/magic/tools/accuracy/abu-calibration-score.mjs',
        inputFile,
        dir,
        baseline,
        scorerFile,
        output,
        candidate,
        scoreFile,
      ],
      { stdio: 'pipe', env: { ...process.env, MAGIC_ACCURACY_CACHE: dir + '/missing-raw-cache' } },
    );
  run();
  const result = JSON.parse(await readFile(output));
  assert.equal(result.summary.reused, 1);
  assert.equal(result.rows[0].structural100, 64);
  assert.equal(result.reusableScoresHash, hash(await readFile(scoreFile)));
  await writeJson(baseline + '/capture.json', {
    complete: true,
    inputHash,
    rows: [{ id: entry.id, after: renderHash, outside: 0, silhouette: 0, artworkChanged: 0 }],
  });
  const fullRun = () =>
    execFileSync(
      process.execPath,
      [
        'games/magic/tools/accuracy/abu-calibration-score.mjs',
        inputFile,
        dir,
        baseline,
        scorerFile,
        output,
        '-',
        scoreFile,
        inputFile,
      ],
      { stdio: 'pipe', env: { ...process.env, MAGIC_ACCURACY_CACHE: dir + '/missing-raw-cache' } },
    );
  fullRun();
  assert.equal(JSON.parse(await readFile(output)).summary.reused, 1);
  const changedInput = {
    entries: [{ ...entry, face: { ...face, rulesText: 'A different passage' } }],
  };
  await writeJson(dir + '/old-input.json', { entries: [entry] });
  await writeJson(inputFile, changedInput);
  assert.throws(fullRun, 'Changed inputs cannot claim the old native input identity');
  await writeJson(inputFile, { entries: [entry] });
  await writeFile(dir + '/policy.mjs', 'export const weight = 25;');
  assert.throws(run, 'An imported policy change must invalidate reuse');
  await writeFile(dir + '/policy.mjs', 'export const weight = 26;');
  await writeJson(scoreFile, { ...scores, scorerHash: 'changed-metric' });
  assert.throws(run, 'Changed scoring semantics must invalidate reuse');
  await writeJson(scoreFile, scores);
  await writeJson(candidate + '/card.json', {
    ...trial,
    nativeTrial: { ...trial.nativeTrial, outside: 1 },
  });
  assert.throws(run, 'Uncertified native changes must not reuse a score');
  await writeJson(candidate + '/card.json', trial);
  await writeFile(candidate + '/card-candidate.png', 'Different rendered pixels');
  assert.throws(run, 'Corrupt candidate bytes must be rejected');
  const changedBytes = Buffer.from('A valid changed rendering'),
    changedHash = hash(changedBytes);
  await writeFile(candidate + '/card-candidate.png', changedBytes);
  await writeJson(candidate + '/card.json', {
    ...trial,
    nativeTrial: { ...trial.nativeTrial, renderHash: changedHash },
  });
  assert.throws(run, 'Changed pixels must enter scoring and require the missing reference');
} finally {
  await rm(dir, { recursive: true, force: true });
}
console.log(
  'ABU score reuse: exact-byte hits skip raster work; metric, certification and pixel changes invalidate reuse.',
);
