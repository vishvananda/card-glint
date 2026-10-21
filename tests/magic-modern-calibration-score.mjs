// Exercise score provenance and cache refusal with a deliberately tiny mock
// metric. This does not claim to validate any physical scan or real metric.
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { PNG } from 'pngjs';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
const directory = await mkdtemp(path.join(os.tmpdir(), 'modern-score-contract-'));
try {
  const objects = path.join(directory, 'cache/objects'),
    native = path.join(directory, 'native'),
    normal = path.join(directory, 'normal'),
    out = path.join(directory, 'out');
  for (const p of [objects, native, normal]) await mkdir(p, { recursive: true });
  const png = new PNG({ width: 16, height: 24 });
  png.data.fill(150);
  for (let i = 3; i < png.data.length; i += 4) png.data[i] = 255;
  const pixels = PNG.sync.write(png),
    digest = hash(pixels);
  await writeFile(path.join(objects, digest), pixels);
  const entries = ['normal', 'unsupported'].map((kind, i) => ({
    id: 'fixture-' + i,
    card: { name: kind, collector_number: String(i), rarity: 'common', finishes: ['nonfoil'] },
    reference: { sha256: digest },
    face: { name: kind, wordingMode: 'original' },
  }));
  const inputBytes = Buffer.from(JSON.stringify({ set: 'fixture', entries }));
  const inputFile = path.join(directory, 'inputs.json');
  await writeFile(inputFile, inputBytes);
  await writeFile(path.join(native, 'inputs.json'), inputBytes);
  const capture = {
    source: { inputsHash: hash(inputBytes) },
    completed: 2,
    faults: [],
    rows: entries.map((e) => ({
      id: e.id,
      inputHash: hash(JSON.stringify(e.face)),
      referenceHash: digest,
      layers: { face: { file: e.id + '.png', sha256: digest } },
    })),
  };
  await writeFile(path.join(native, 'capture.json'), JSON.stringify(capture));
  for (const e of entries) await writeFile(path.join(native, e.id + '.png'), pixels);
  const poses = {
    summary: { completed: 2 },
    rows: entries.map((e) => ({
      id: e.id,
      referenceHash: digest,
      geometry: 'fixture',
      family: 'fixture',
      accepted: true,
      transform: { matrix: [1, 0, 0, 1, 0, 0] },
    })),
  };
  const poseFile = path.join(normal, 'normalization.json');
  await writeFile(poseFile, JSON.stringify(poses));
  const metricFile = path.join(directory, 'mock.mjs');
  const policyFile = path.join(directory, 'mock-policy.mjs');
  const policyText = 'export const value = 0.8;';
  await writeFile(policyFile, policyText);
  await writeFile(
    metricFile,
    `import {value} from "./mock-policy.mjs";
export function scoreRegions(a,b,card,face) {
    if(a.width!==488||b.height!==680||face.wordingMode!=='original') throw Error('Contract');
    const available=card.name==='normal';
    return {structuralScore:available?value:null,coverage:available?1:0,
      components:{title:{applicable:available,score:available?value:null}}};
  }`,
  );
  const args = [
    'games/magic/tools/accuracy/modern-calibration-score.mjs',
    inputFile,
    native,
    normal,
    metricFile,
    out,
    '--diagnostic',
  ];
  const run = (a = args) =>
    spawnSync(process.execPath, a, {
      encoding: 'utf8',
      env: { ...process.env, MAGIC_ACCURACY_CACHE: path.join(directory, 'cache') },
    });
  const first = run();
  assert.equal(first.status, 0, first.stderr);
  const report = JSON.parse(await readFile(path.join(out, 'scores.json')));
  assert.equal(report.eligibleForPublication, false);
  assert.equal(report.summary.total, 2);
  assert.equal(report.summary.measured, 1);
  assert.equal(report.summary.meanStructure100, 80);
  assert.deepEqual(report.summary.missingRegionMaps, ['fixture-1']);
  const resumed = run();
  assert.equal(resumed.status, 0, resumed.stderr);
  const normalized = path.join(out, report.rows[0].normalizedReference.file),
    saved = await readFile(normalized);
  await writeFile(normalized, 'corrupt');
  const corrupt = run();
  assert.notEqual(corrupt.status, 0);
  assert.match(corrupt.stderr, /Cached normalized raster changed/);
  await writeFile(normalized, saved);
  await writeFile(path.join(objects, digest), 'changed source');
  assert.notEqual(run().status, 0, 'Changed reference bytes must be refused before score reuse');
  await writeFile(path.join(objects, digest), pixels);
  await writeFile(policyFile, 'export const value = 0.9;');
  const changedMetric = run();
  assert.notEqual(changedMetric.status, 0);
  assert.match(
    changedMetric.stderr,
    /Use a new directory/,
    'Transitive metric change must invalidate reuse',
  );
  await writeFile(policyFile, policyText);
  poses.rows[0].transform.matrix[4] = 1;
  await writeFile(poseFile, JSON.stringify(poses));
  const moved = run();
  assert.notEqual(moved.status, 0);
  assert.match(moved.stderr, /Use a new directory/);
  assert.notEqual(run(args.slice(0, -1)).status, 0, 'Diagnostic mode must be explicit');
  console.log(
    'Modern score diagnostics: exact source/pose/raster identities, guarded resume and explicit missing-map denominator.',
  );
} finally {
  await rm(directory, { recursive: true, force: true });
}
