/** Diagnose shared old-frame displacements without refitting any scan. */
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
import { readObject } from './cache.mjs';
import { normalize } from './pixels-pure.mjs';
import { medianFrameGradient, gradientOverlap, bestGradientShift } from './frame-edge-measure.mjs';
import { median } from './metrics.mjs';

const bands = {
  stockLeft: [0, 100, 40, 470, 'x'],
  stockRight: [448, 100, 40, 470, 'x'],
  stockTop: [50, 0, 388, 45, 'y'],
  stockBottom: [50, 635, 388, 45, 'y'],
  artLeft: [35, 100, 45, 240, 'x'],
  artRight: [408, 100, 45, 240, 'x'],
  artTop: [100, 45, 288, 50, 'y'],
  artBottom: [100, 345, 288, 45, 'y'],
  paperLeft: [40, 445, 50, 130, 'x'],
  paperRight: [398, 445, 50, 130, 'x'],
  paperTop: [100, 390, 288, 50, 'y'],
  paperBottom: [100, 578, 288, 50, 'y'],
};
const [inputFile, posesFile, nativeDirectory, output] = process.argv.slice(2);
assert(output, 'Usage: early-frame-band-audit.mjs INPUTS POSES NATIVE_DIRECTORY OUTPUT');
const raw = await Promise.all(
  [inputFile, posesFile, path.join(nativeDirectory, 'capture.json')].map((f) => readFile(f)),
);
const [inputs, poses, capture] = raw.map((b) => JSON.parse(b));
const byPose = new Map(poses.rows.map((r) => [r.id, r]));
const byNative = new Map(capture.rows.map((r) => [r.id, r]));
assert.equal(inputs.entries.length, byPose.size);
assert.equal(inputs.entries.length, byNative.size);
const nativeInputHash = capture.source?.inputHash ?? capture.inputHash;
assert.equal(nativeInputHash, hash(raw[0]), 'Native recipe file changed');
const rows = [];
for (const e of inputs.entries) {
  const pose = byPose.get(e.id),
    native = byNative.get(e.id);
  assert(pose && native, 'Missing printing');
  assert.equal(pose.referenceHash, e.reference.sha256);
  assert.equal(native.referenceHash, e.reference.sha256);
  assert.equal(native.poseHash, hash(JSON.stringify(pose.transform)));
  if (native.inputHash) assert.equal(native.inputHash, hash(JSON.stringify(e.face)));
  const palette =
    e.face.frameColors ??
    { Plains: ['W'], Island: ['U'], Swamp: ['B'], Mountain: ['R'], Forest: ['G'] }[e.name];
  const material = e.material === 'L' ? 'L-' + (palette?.join('') || 'neutral') : e.material;
  const group = material + (e.face.legendary ? '/legendary' : '/ordinary');
  const base = {
    id: e.id,
    name: e.name,
    group,
    material,
    cohort: pose.cohort,
    referenceHash: e.reference.sha256,
    poseHash: native.poseHash,
  };
  if (!pose.accepted) {
    rows.push({ ...base, status: 'unaccepted-pose', bands: {} });
    continue;
  }
  const suffix = native.images?.original ? '.original.png' : '.png';
  const nativeHash = native.images?.original.sha256 ?? native.sha256;
  const [scanBytes, faceBytes] = await Promise.all([
    readObject(e.reference),
    readFile(path.join(nativeDirectory, e.id + suffix)),
  ]);
  assert.equal(hash(faceBytes), nativeHash);
  const scan = normalize(PNG.sync.read(scanBytes), pose.transform),
    face = normalize(PNG.sync.read(faceBytes));
  const values = {};
  for (const [name, rect] of Object.entries(bands)) {
    const a = medianFrameGradient(scan, rect),
      b = medianFrameGradient(face, rect);
    const energy = (x) => x.reduce((sum, v) => sum + v * v, 0);
    const supported = energy(a) > 1 && energy(b) > 1;
    const current = gradientOverlap(a, b),
      best = bestGradientShift(a, b);
    values[name] = {
      supported,
      current100: current,
      best100: best.score,
      nativeDisplacement: best.shift,
      nativeCorrection: -best.shift,
      boundaryWinner: Math.abs(best.shift) === 4,
      gain100: best.score - current,
      referenceEnergy: energy(a),
      nativeEnergy: energy(b),
    };
  }
  rows.push({ ...base, status: 'measured', nativeHash, bands: values });
  if (rows.length % 25 === 0)
    console.log(inputs.set, 'frame bands', rows.length, '/', inputs.entries.length);
}
const summary = {};
for (const group of ['all', ...new Set(rows.map((r) => r.group))]) {
  const members = rows.filter((r) => group === 'all' || r.group === group);
  summary[group] = {
    cards: members.length,
    unaccepted: members.filter((r) => r.status !== 'measured').map((r) => r.id),
    bands: {},
  };
  for (const name of Object.keys(bands)) {
    summary[group].bands[name] = {};
    for (const cohort of ['all', 'calibration', 'validation']) {
      const rs = members.filter(
        (r) => (cohort === 'all' || r.cohort === cohort) && r.bands[name]?.supported,
      );
      const mean = (key) =>
        rs.length ? rs.reduce((s, r) => s + r.bands[name][key], 0) / rs.length : null;
      summary[group].bands[name][cohort] = {
        cards: rs.length,
        current100: mean('current100'),
        best100: mean('best100'),
        medianNativeCorrection: rs.length
          ? median(rs.map((r) => r.bands[name].nativeCorrection))
          : null,
        boundaryWinners: rs.filter((r) => r.bands[name].boundaryWinner).length,
      };
    }
  }
}
const sources = Object.fromEntries(
  await Promise.all(
    [
      'early-frame-band-audit',
      'frame-edge-measure',
      'pixels-pure',
      'metrics',
      'scan-transform',
    ].map(async (n) => [n + '.mjs', hash(await readFile(new URL(n + '.mjs', import.meta.url)))]),
  ),
);
await writeJson(output, {
  schema: 1,
  status: 'diagnostic-no-adoption',
  scope:
    'Canonical RGB median-gradient bands on frozen scan-only poses. Translation peaks diagnose displacement; they are not per-card renderer values or revised scan poses. Color amplitude is normalized in overlap. Inspect low support, boundary winners and ambiguous multiple edges. This does not measure corner shape, certify normalization or approve geometry.',
  set: inputs.set,
  rendererHash: capture.source?.rendererHash ?? capture.rendererHash,
  inputHash: hash(raw[0]),
  normalizationHash: hash(raw[1]),
  captureHash: hash(raw[2]),
  bands,
  sources,
  summary,
  rows,
});
console.log('Wrote', output);
