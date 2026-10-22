import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { PNG } from 'pngjs';
import { root, hash, sourceHash, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { manaCandidateCircle } from './modern-mana-objective.mjs';
import { extractManaGlyphPair, ManaGlyphObjective } from './modern-mana-glyph-objective.mjs';
const [inputFile, nativeDirectory, scoreDirectory, auditFile, fitFile, parameterFile, output] =
  process.argv.slice(2);
assert(
  output,
  'Usage: modern-mana-glyph-fit.mjs INPUTS NATIVE SCORES AUDIT CIRCLE_FIT PARAMETERS OUT',
);
const started = performance.now(),
  read = async (file) => {
    const bytes = await readFile(file);
    return { data: JSON.parse(bytes), sha256: hash(bytes) };
  };
const inputs = await read(inputFile),
  native = await read(path.join(nativeDirectory, 'capture.json')),
  scores = await read(path.join(scoreDirectory, 'scores.json')),
  audit = await read(auditFile),
  fit = await read(fitFile),
  parameters = await read(parameterFile);
assert.equal(inputs.data.set, 'm21');
assert.equal(inputs.data.entries.length, 297);
assert.equal(native.data.completed, 297);
assert.deepEqual(native.data.faults, []);
assert.equal(native.data.source.inputsHash, inputs.sha256);
assert.equal(scores.data.definition.nativeCaptureHash, native.sha256);
assert.equal(audit.data.source.inputsHash, inputs.sha256);
assert.equal(parameters.data.source.fitHash, fit.sha256);
assert.equal(native.data.source.manaStudy.parametersHash, parameters.sha256);
assert.deepEqual(native.data.source.manaStudy.rendererControls, fit.data.rendererControls);
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), native.data.source.rendererHash);
const files = [
  'modern-mana-glyph-fit.mjs',
  'modern-mana-glyph-objective.mjs',
  'modern-mana-objective.mjs',
  'pixels-pure.mjs',
];
const tools = await Promise.all(
  files.map(async (f) => [f, hash(await readFile(new URL(f, import.meta.url)))]),
);
const fields = [],
  issues = [];
for (const observed of audit.data.rows) {
  if (observed.kind !== 'normal') continue;
  assert(observed.nonfoil);
  const e = inputs.data.entries.find((e) => e.id === observed.id),
    capture = native.data.rows.find((r) => r.id === observed.id),
    scored = scores.data.rows.find((r) => r.id === observed.id);
  assert(e && capture && scored);
  assert.equal(e.face.wordingMode, 'original');
  assert.equal(hash(JSON.stringify(e.face)), capture.inputHash);
  const raw = await readFile(path.join(nativeDirectory, capture.layers.face.file)),
    ref = await readFile(path.join(scoreDirectory, scored.normalizedReference.file));
  assert.equal(hash(raw), capture.layers.face.sha256);
  assert.equal(hash(ref), scored.normalizedReference.sha256);
  const render = normalize(PNG.sync.read(raw, { checkCRC: true })),
    reference = PNG.sync.read(ref, { checkCRC: true });
  for (const disc of observed.discs) {
    const circle = manaCandidateCircle(disc, fit.data.selected),
      geometry = { ...disc, ...circle };
    try {
      const result = extractManaGlyphPair(render, reference, geometry);
      const own = new ManaGlyphObjective(
          result.source,
          result.nativeControl,
          result.side,
          result.maskRadius,
        ),
        target = new ManaGlyphObjective(
          result.source,
          result.reference,
          result.side,
          result.maskRadius,
        );
      fields.push({
        id: e.id,
        name: e.card.name,
        symbol: disc.symbol,
        index: disc.index,
        group: /^\d+$/.test(disc.symbol) ? 'N' : disc.symbol,
        pigment: result.pigment,
        own,
        target,
      });
    } catch (error) {
      issues.push({ id: e.id, name: e.card.name, symbol: disc.symbol, error: String(error) });
    }
  }
  if (fields.length % 50 < 3) console.log('glyph fields', fields.length);
}
assert.equal(fields.length + issues.length, 527);
assert.deepEqual(issues, [], 'Retain all glyph failures; do not silently fit a reduced census');
const baseline = { scale: 1, dx: 0, dy: 0 },
  bounds = { scale: [0.9, 1.1], dx: [-1, 1], dy: [-1, 1] };
const groups = {},
  history = [],
  cardChanges = [];
const preparedMs = performance.now() - started;
for (const group of [...new Set(fields.map((f) => f.group))].sort()) {
  const selected = fields.filter((f) => f.group === group),
    byCard = new Map();
  for (const field of selected) {
    const v = byCard.get(field.id) ?? [];
    v.push(field);
    byCard.set(field.id, v);
  }
  const cache = { own: new Map(), target: new Map() };
  const evaluate = (candidate, kind) => {
    const key = JSON.stringify(candidate);
    if (cache[kind].has(key)) return cache[kind].get(key);
    const quality =
      [...byCard.values()].reduce(
        (sum, list) => sum + list.reduce((n, f) => n + f[kind].score(candidate), 0) / list.length,
        0,
      ) / byCard.size;
    const value = { ...candidate, quality };
    cache[kind].set(key, value);
    return value;
  };
  const search = (seed, kind) => {
    let best = evaluate(seed, kind);
    for (const [scaleStep, offsetStep] of [
      [0.05, 0.5],
      [0.025, 0.25],
      [0.0125, 0.125],
      [0.00625, 0.0625],
    ]) {
      let moves = 0;
      for (; moves < 30; moves++) {
        let next = best;
        for (const key of Object.keys(bounds))
          for (const sign of [-1, 1]) {
            const c = Object.fromEntries(Object.keys(bounds).map((k) => [k, best[k]]));
            c[key] = Number(
              (c[key] + sign * (key === 'scale' ? scaleStep : offsetStep)).toFixed(6),
            );
            if (c[key] < bounds[key][0] || c[key] > bounds[key][1]) continue;
            const v = evaluate(c, kind);
            if (v.quality > next.quality + 1e-9) next = v;
          }
        if (next === best) break;
        best = next;
      }
      assert(moves < 30, 'Glyph search failed to settle');
      history.push({ group, kind, step: [scaleStep, offsetStep], best });
    }
    return best;
  };
  const own = search(baseline, 'own'),
    a = search(baseline, 'target'),
    b = search({ scale: 0.95, dx: 0, dy: group === 'N' ? 0.25 : 0 }, 'target'),
    best = a.quality >= b.quality ? a : b;
  assert(
    Math.abs(own.scale - 1) <= 0.025 && Math.abs(own.dx) <= 0.25 && Math.abs(own.dy) <= 0.25,
    'Own-render glyph control moved materially: ' + group + JSON.stringify(own),
  );
  const rows = [...byCard.entries()].map(([id, list]) => {
    const before = list.reduce((n, f) => n + f.target.score(baseline), 0) / list.length,
      after = list.reduce((n, f) => n + f.target.score(best), 0) / list.length;
    return { id, name: list[0].name, count: list.length, before, after, delta: after - before };
  });
  groups[group] = {
    cards: byCard.size,
    tokens: selected.length,
    baseline: evaluate(baseline, 'target'),
    own,
    selected: best,
    boundary: Object.keys(bounds).filter(
      (k) => best[k] === bounds[k][0] || best[k] === bounds[k][1],
    ),
    improved: rows.filter((r) => r.delta > 1e-7).length,
    regressed: rows.filter((r) => r.delta < -1e-7).length,
    candidates: { own: cache.own.size, target: cache.target.size },
    rows,
  };
  cardChanges.push(...rows.map((r) => ({ ...r, group })));
  console.log(
    'glyph fit',
    group,
    JSON.stringify({
      baseline: groups[group].baseline,
      own,
      best,
      improved: groups[group].improved,
      regressed: groups[group].regressed,
      boundary: groups[group].boundary,
    }),
  );
}
const outerScale = fit.data.rendererControls.scaleX,
  numeric = groups.N.selected;
const controls = {
  ...fit.data.rendererControls,
  numberScale: 0.98 * numeric.scale,
  numberDx: -0.25 * numeric.scale + numeric.dx / outerScale,
  numberDy: numeric.dy / outerScale,
  glyphs: Object.fromEntries(
    [...'WUBRG'].map((color) => {
      const f = groups[color].selected;
      return [color, { scale: f.scale, dx: f.dx / outerScale, dy: f.dy / outerScale }];
    }),
  ),
};
const pigments = fields.map(({ own, target, ...data }) => data);
await mkdir(output, { recursive: true });
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), native.data.source.rendererHash);
for (const [f, h] of tools) assert.equal(hash(await readFile(new URL(f, import.meta.url))), h);
await writeJson(path.join(output, 'fit.json'), {
  schema: 1,
  status: 'independent-glyph-proposal-not-native-adoption',
  eligibleForPublication: false,
  scope:
    'All527 normal-frame cost glyphs on250 nonfoil M21 Original cards. Shared per-color and numeric glyph scale/x/y inside fixed trial circles; fixed source-guided paper samples and filled-ink Dice, with own-render controls. X remains diagnostic-only because current colored-glyph controls exclude it. No per-card adjustment, font replacement, outline or scan-pose fit.',
  source: {
    inputsHash: inputs.sha256,
    nativeHash: native.sha256,
    scoresHash: scores.sha256,
    auditHash: audit.sha256,
    circleFitHash: fit.sha256,
    parametersHash: parameters.sha256,
    rendererHash: native.data.source.rendererHash,
    tools,
  },
  model: {
    bounds,
    maskRadiusFraction: 0.7,
    sourceTrustedInset: 0.75,
    baseline: { numberScale: 0.98, numberDx: -0.25, numberDy: 0 },
  },
  groups,
  rendererControls: controls,
  history,
  pigmentMeasurements: pigments,
  issues,
  performance: {
    prepareMs: preparedMs,
    totalMs: performance.now() - started,
    scope:
      'CPU PNG decoding, fixed ink-field extraction and cached glyph search; no browser/GPU benchmark',
  },
});
console.log(JSON.stringify({ rendererControls: controls, totalMs: performance.now() - started }));
