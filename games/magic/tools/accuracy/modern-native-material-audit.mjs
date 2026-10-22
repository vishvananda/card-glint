// Read-only material checks on complete, hash-bound native pairs and frozen references.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { sampleColor, delta, median } from './hsb-color.mjs';
const [inputFile, beforeDir, afterDir, scoreDir, parameterFile, output, ...options] =
  process.argv.slice(2);
assert(
  options.length === 0 || (options.length === 1 && options[0] === '--production'),
  'Unknown material-audit option',
);
const production = options.length === 1;
assert(
  output,
  'Usage: modern-native-material-audit.mjs INPUTS BEFORE AFTER SCORES PARAMETERS OUTPUT',
);
const read = async (file) => {
  const bytes = await readFile(file);
  return { bytes, value: JSON.parse(bytes) };
};
const input = await read(inputFile),
  before = await read(path.join(beforeDir, 'capture.json')),
  after = await read(path.join(afterDir, 'capture.json')),
  scores = await read(path.join(scoreDir, 'scores.json')),
  parameters = await read(parameterFile);
for (const capture of [before.value, after.value]) {
  assert.equal(capture.completed, input.value.entries.length);
  assert.equal(capture.denominator, capture.completed);
  assert.deepEqual(capture.faults, []);
  assert.equal(capture.source.inputsHash, hash(input.bytes));
  assert.equal(new Set(capture.rows.map((r) => r.id)).size, capture.completed);
}
assert.equal(scores.value.definition.inputsHash, hash(input.bytes));
assert.equal(parameters.value.schema, 1);
if (production) {
  assert(
    !after.value.source.materialStudy && !after.value.source.study,
    'Production measurement must use unmodified native composition',
  );
} else assert.equal(after.value.source.materialStudy.parametersHash, hash(parameters.bytes));
for (const key of [
  ...(production ? [] : ['rendererHash']),
  'rasterHelpers',
  'packMetadata',
  'components',
])
  assert.deepEqual(
    before.value.source[key],
    after.value.source[key],
    'Changed capture source: ' + key,
  );
const toolHash = hash(await readFile(new URL(import.meta.url)));
const selected = new Set(parameters.value.ids);
assert.equal(selected.size, parameters.value.ids.length);
const index = (rows) => {
  const m = new Map(rows.map((r) => [r.id, r]));
  assert.equal(m.size, rows.length);
  return m;
};
const prior = index(before.value.rows),
  next = index(after.value.rows),
  reference = index(scores.value.rows);
const windows = {
  frame: {
    rects: [
      [26, 100, 7, 250],
      [455, 100, 7, 250],
    ],
    paper: false,
  },
  rulesPaper: { rects: [[50, 442, 388, 142]], paper: true },
  namePaper: { rects: [[75, 33, 337, 13]], paper: true },
  typePaper: { rects: [[70, 385, 330, 17]], paper: true },
};
async function native(dir, row) {
  const bytes = await readFile(path.join(dir, row.layers.face.file));
  assert.equal(hash(bytes), row.layers.face.sha256);
  return normalize(PNG.sync.read(bytes, { checkCRC: true }));
}
const rows = [];
for (const e of input.value.entries) {
  if (!selected.has(e.id)) continue;
  const b = prior.get(e.id),
    a = next.get(e.id),
    s = reference.get(e.id);
  assert(b && a && s && !b.issue && !a.issue);
  for (const row of [b, a]) {
    assert.equal(row.inputHash, hash(JSON.stringify(e.face)));
    assert.equal(row.referenceHash, e.reference.sha256);
  }
  assert.equal(s.referenceHash, e.reference.sha256);
  assert(s.poseAccepted && s.nonfoilEligible, 'Requires accepted nonfoil source');
  const raw = await readFile(path.join(scoreDir, s.normalizedReference.file));
  assert.equal(hash(raw), s.normalizedReference.sha256);
  const ref = PNG.sync.read(raw, { checkCRC: true });
  assert.deepEqual([ref.width, ref.height], [488, 680]);
  const old = await native(beforeDir, b),
    current = await native(afterDir, a);
  const color = e.face.colors?.join('') || 'A';
  const row = {
    id: e.id,
    name: e.card.name,
    number: e.card.collector_number,
    color,
    referenceHash: e.reference.sha256,
    normalizedReferenceHash: s.normalizedReference.sha256,
    poseHash: s.poseHash,
    beforeHash: b.layers.face.sha256,
    afterHash: a.layers.face.sha256,
    parts: {},
  };
  for (const [part, w] of Object.entries(windows)) {
    // Text-heavy panels remain explicit missing observations; never fill them
    // from a neighbor or silently change a patch to make a candidate win.
    try {
      const r = sampleColor(ref, w.rects, { paper: w.paper }),
        x = sampleColor(old, w.rects, { paper: w.paper }),
        y = sampleColor(current, w.rects, { paper: w.paper });
      row.parts[part] = {
        status: 'measured',
        beforeDelta: delta(x.rgb, r.rgb),
        afterDelta: delta(y.rgb, r.rgb),
        beforeRgb: x.rgb,
        afterRgb: y.rgb,
        referenceRgb: r.rgb,
        beforeTileSpread: x.spread,
        afterTileSpread: y.spread,
        referenceTileSpread: r.spread,
        beforeRejectedInk: x.rejectedFraction,
        afterRejectedInk: y.rejectedFraction,
        referenceRejectedInk: r.rejectedFraction,
      };
    } catch (error) {
      if (!/Too few usable color tiles/.test(error.message)) throw error;
      row.parts[part] = { status: 'insufficient-uncontaminated-paper', reason: error.message };
    }
  }
  rows.push(row);
  if (rows.length % 25 === 0) console.log('material audit', rows.length, '/', selected.size);
}
assert.equal(rows.length, selected.size);
const average = (values) =>
  values.length ? values.reduce((s, v) => s + v, 0) / values.length : null;
const summarize = (list) =>
  Object.fromEntries(
    Object.keys(windows).map((part) => {
      const measured = list
        .filter((r) => r.parts[part].status === 'measured')
        .map((r) => r.parts[part]);
      return [
        part,
        {
          total: list.length,
          measured: measured.length,
          missing: list.length - measured.length,
          beforeMeanDelta: average(measured.map((p) => p.beforeDelta)),
          afterMeanDelta: average(measured.map((p) => p.afterDelta)),
          improved: measured.filter((p) => p.afterDelta < p.beforeDelta - 1e-7).length,
          regressed: measured.filter((p) => p.afterDelta > p.beforeDelta + 1e-7).length,
          beforeMedianTileSpread: measured.length
            ? median(measured.map((p) => p.beforeTileSpread))
            : null,
          afterMedianTileSpread: measured.length
            ? median(measured.map((p) => p.afterTileSpread))
            : null,
          referenceMedianTileSpread: measured.length
            ? median(measured.map((p) => p.referenceTileSpread))
            : null,
        },
      ];
    }),
  );
const report = {
  schema: 1,
  set: input.value.set,
  status: 'native-material-diagnostic-not-completion',
  definition: {
    inputsHash: hash(input.bytes),
    beforeCaptureHash: hash(before.bytes),
    afterCaptureHash: hash(after.bytes),
    referenceScoresHash: hash(scores.bytes),
    parametersHash: hash(parameters.bytes),
    materialBinding: production
      ? 'Cohort selection only; actual production pixels and material implementation are bound by native capture and renderer hashes'
      : 'Capture-bound injected material parameters',
    toolHash,
    colorMathHash: hash(await readFile(new URL('./hsb-color.mjs', import.meta.url))),
    windows,
    policy:
      'Shared fixed patches and the existing frozen normalized references; no image movement or per-printing fitting. Paper tiles reject dark lettering by the same rule for all variants. Delta is Oklab distance×100, not percentage correctness. Tile-center spread is a coarse texture-color diagnostic, not a certification of fine print grain.',
  },
  summary: summarize(rows),
  groups: Object.fromEntries(
    [...new Set(rows.map((r) => r.color))]
      .sort()
      .map((c) => [c, summarize(rows.filter((r) => r.color === c))]),
  ),
  rows,
};
assert.equal(
  hash(await readFile(new URL(import.meta.url))),
  toolHash,
  'Audit source changed during run',
);
await writeJson(output, report);
console.log(JSON.stringify({ summary: report.summary, groups: report.groups }));
