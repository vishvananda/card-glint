// Shared parameter search on frozen rasters; no per-card fitted parameters.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { performance } from 'node:perf_hooks';
import { root, hash, sourceHash, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import {
  createModernManaObjective,
  manaCandidateCircle,
  manaCandidateControls,
} from './modern-mana-objective.mjs';
const [inputFile, nativeDirectory, scoreDirectory, auditFile, proposalFile, output] =
  process.argv.slice(2);
assert(output, 'Usage: modern-mana-shared-fit.mjs INPUTS NATIVE SCORES AUDIT PROPOSAL OUT');
const start = performance.now();
const read = async (file) => {
  const bytes = await readFile(file);
  return { data: JSON.parse(bytes), sha256: hash(bytes) };
};
const inputs = await read(inputFile),
  capture = await read(path.join(nativeDirectory, 'capture.json')),
  scores = await read(path.join(scoreDirectory, 'scores.json')),
  audit = await read(auditFile),
  proposal = await read(proposalFile);
const files = [
  'modern-mana-shared-fit.mjs',
  'modern-mana-objective.mjs',
  'modern-mana-ring.mjs',
  'pixels-pure.mjs',
];
const tools = await Promise.all(
  files.map(async (file) => [file, hash(await readFile(new URL(file, import.meta.url)))]),
);
assert.equal(inputs.data.set, 'm21');
assert.equal(inputs.data.entries.length, 297);
assert.equal(capture.data.completed, 297);
assert.equal(capture.data.source.manaStudy, undefined, 'Fit from the default native baseline');
assert.deepEqual(capture.data.faults, []);
assert.equal(capture.data.source.inputsHash, inputs.sha256);
assert.equal(scores.data.definition.nativeCaptureHash, capture.sha256);
for (const [key, value] of [
  ['inputsHash', inputs.sha256],
  ['nativeHash', capture.sha256],
  ['scoresHash', scores.sha256],
])
  assert.equal(audit.data.source[key], value);
assert.equal(audit.data.source.ringToolHash, tools.find(([f]) => f === 'modern-mana-ring.mjs')[1]);
assert.equal(
  await sourceHash(path.join(root, 'games/magic/src')),
  capture.data.source.rendererHash,
);
assert.equal(audit.data.rows.length, 264);
const crop = (image, disc) => {
  const width = 48,
    height = 48,
    left = Math.round(disc.x - width / 2),
    top = Math.round(disc.y - height / 2);
  assert(left >= 0 && top >= 0 && left + width < image.width && top + height < image.height);
  const data = new Uint8Array(width * height * 4);
  for (let row = 0; row < height; row++)
    data.set(
      image.data.subarray(
        ((top + row) * image.width + left) * 4,
        ((top + row) * image.width + left + width) * 4,
      ),
      row * width * 4,
    );
  return { image: { width, height, data }, left, top };
};
const rows = [];
let parityCount = 0,
  maxParityError = 0;
for (const row of audit.data.rows) {
  const entry = inputs.data.entries.find((e) => e.id === row.id),
    native = capture.data.rows.find((r) => r.id === row.id),
    reference = scores.data.rows.find((r) => r.id === row.id);
  assert(entry && native && reference);
  assert.equal(entry.face.wordingMode, 'original');
  assert.equal(hash(JSON.stringify(entry.face)), row.inputHash);
  assert.equal(native.layers.face.sha256, row.renderHash);
  assert.equal(native.referenceHash, row.referenceHash);
  assert.equal(reference.poseHash, row.poseHash);
  const raw = await readFile(path.join(nativeDirectory, native.layers.face.file)),
    ref = await readFile(path.join(scoreDirectory, reference.normalizedReference.file));
  assert.equal(hash(raw), row.renderHash);
  assert.equal(hash(ref), reference.normalizedReference.sha256);
  const images = {
    native: normalize(PNG.sync.read(raw, { checkCRC: true })),
    scan: PNG.sync.read(ref, { checkCRC: true }),
  };
  const discs = row.discs.map((disc) => {
    assert(disc.nativeControl, 'Do not fit from an unverified native detector');
    const objects = Object.fromEntries(
      Object.entries(images).map(([key, image]) => {
        const cropped = crop(image, disc),
          objective = createModernManaObjective(cropped.image, {
            paper: disc.paper,
            ...disc.template,
          });
        const fitted = disc[key === 'native' ? 'render' : 'scan'];
        const measured = objective.score(
          fitted.x - cropped.left,
          fitted.y - cropped.top,
          fitted.radius,
        );
        const error = Math.abs(measured - fitted.score);
        assert(error < 1e-8, 'Cached objective changed audited quality');
        maxParityError = Math.max(maxParityError, error);
        parityCount++;
        return [key, { objective, left: cropped.left, top: cropped.top }];
      }),
    );
    return { ...disc, objects };
  });
  if (row.kind === 'normal' && row.nonfoil)
    rows.push({
      id: row.id,
      name: row.name,
      number: row.number,
      geometry: reference.geometry,
      family: reference.family,
      discs,
    });
}
assert.equal(parityCount, 1134);
assert.equal(rows.length, 250);
assert.equal(
  rows.reduce((n, r) => n + r.discs.length, 0),
  527,
);
const scale = 1.01,
  radius = rows[0].discs[0].radius,
  size = (radius * 2) / scale,
  gap = 0.00378 * 488;
for (const row of rows)
  for (const disc of row.discs) assert(Math.abs(disc.radius - radius) < 1e-10);
const bounds = { diameter: [-2, 1], pitch: [-0.75, 0.75], dx: [-1, 1], dy: [-1.5, 1] };
const key = (c) => JSON.stringify(Object.keys(bounds).map((k) => c[k]));
const baseline = { diameter: 0, pitch: 0, dx: 0, dy: 0 };
const fromProposal = {
  diameter: proposal.data.diameterDelta,
  pitch: proposal.data.pitch.medianDelta,
  dx:
    Math.round(
      (proposal.data.unroundedProposal.dx +
        (size / 2) * (scale - proposal.data.unroundedProposal.scaleX)) *
        16,
    ) / 16,
  dy: proposal.data.unroundedProposal.dy,
};
const caches = { native: new Map(), scan: new Map() };
const perCard = (row, candidate, kind) =>
  row.discs.reduce((sum, disc) => {
    const circle = manaCandidateCircle(disc, candidate),
      o = disc.objects[kind];
    return sum + o.objective.score(circle.x - o.left, circle.y - o.top, circle.radius);
  }, 0) / row.discs.length;
const evaluate = (candidate, kind) => {
  const id = key(candidate);
  if (caches[kind].has(id)) return caches[kind].get(id);
  const quality = rows.reduce((n, row) => n + perCard(row, candidate, kind), 0) / rows.length;
  const result = { ...candidate, quality };
  caches[kind].set(id, result);
  return result;
};
const history = [];
function search(seed, kind) {
  let best = evaluate(seed, kind);
  for (const step of [0.5, 0.25, 0.125, 0.0625]) {
    let moves = 0;
    for (; moves < 30; moves++) {
      let next = best;
      for (const name of Object.keys(bounds))
        for (const direction of [-1, 1]) {
          const candidate = Object.fromEntries(Object.keys(bounds).map((k) => [k, best[k]]));
          candidate[name] += step * direction;
          if (candidate[name] < bounds[name][0] - 1e-9 || candidate[name] > bounds[name][1] + 1e-9)
            continue;
          const value = evaluate(candidate, kind);
          if (value.quality > next.quality + 1e-8) next = value;
        }
      if (next === best) break;
      best = next;
    }
    assert(moves < 30, 'Shared search did not settle within its bounded step budget');
    history.push({ kind, seed, step, best });
    console.log('shared mana', kind, step, JSON.stringify(best), 'candidates', caches[kind].size);
  }
  return best;
}
const preparedMs = performance.now() - start;
const control = search(baseline, 'native');
const a = search(baseline, 'scan'),
  b = search(fromProposal, 'scan'),
  best = a.quality >= b.quality ? a : b;
assert(
  Math.abs(control.diameter) <= 0.5 &&
    Math.abs(control.pitch) <= 0.25 &&
    Math.abs(control.dx) <= 0.5 &&
    Math.abs(control.dy) <= 0.5,
  'Own-render control prefers a materially different geometry',
);
const controls = manaCandidateControls(best, { size, gap, scale });
const cardRows = rows.map((row) => ({
  id: row.id,
  name: row.name,
  number: row.number,
  geometry: row.geometry,
  family: row.family,
  discs: row.discs.length,
  before: perCard(row, baseline, 'scan'),
  after: perCard(row, best, 'scan'),
}));
const changed = cardRows.map((r) => r.after - r.before);
const baselineScan = evaluate(baseline, 'scan'),
  baselineNative = evaluate(baseline, 'native');
await mkdir(output, { recursive: true });
assert.equal(
  await sourceHash(path.join(root, 'games/magic/src')),
  capture.data.source.rendererHash,
);
for (const [file, expected] of tools)
  assert.equal(hash(await readFile(new URL(file, import.meta.url))), expected);
await writeJson(path.join(output, 'fit.json'), {
  schema: 1,
  status: 'shared-mana-proposal-not-native-adoption',
  eligibleForPublication: false,
  scope:
    'All250 nonfoil normal-frame M21 costs (527 symbols), including scan-search boundary cases. One shared isotropic diameter, center pitch and x/y offset; no per-card adjustment or scan pose changes. Per-card average weighting. The internal perimeter objective is not the public structural score; candidate must pass native full-card replay.',
  source: {
    inputsHash: inputs.sha256,
    nativeHash: capture.sha256,
    scoresHash: scores.sha256,
    auditHash: audit.sha256,
    proposalHash: proposal.sha256,
    rendererHash: capture.data.source.rendererHash,
    tools,
  },
  parity: { comparisons: parityCount, maxAbsoluteQualityError: maxParityError, tolerance: 1e-8 },
  model: { baselineScale: scale, size, gap, bounds },
  baseline: { scan: baselineScan, native: baselineNative },
  ownRenderControl: control,
  selected: best,
  rendererControls: controls,
  history,
  summary: {
    cards: rows.length,
    discs: 527,
    improved: changed.filter((v) => v > 1e-7).length,
    regressed: changed.filter((v) => v < -1e-7).length,
    unchanged: changed.filter((v) => Math.abs(v) <= 1e-7).length,
  },
  performance: {
    scope:
      'CPU PNG decode, cached objective construction and numerical shared search; no browser/GPU/rendering benchmark',
    prepareMs: preparedMs,
    totalMs: performance.now() - start,
    nativeCandidates: caches.native.size,
    scanCandidates: caches.scan.size,
  },
  candidates: { native: [...caches.native.values()], scan: [...caches.scan.values()] },
  rows: cardRows,
});
console.log(
  JSON.stringify({
    selected: best,
    rendererControls: controls,
    parityCount,
    maxParityError,
    nativeCandidates: caches.native.size,
    scanCandidates: caches.scan.size,
    totalMs: performance.now() - start,
  }),
);
