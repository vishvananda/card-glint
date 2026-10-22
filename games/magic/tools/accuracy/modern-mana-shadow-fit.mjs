// Shared shadow registration on source-only visible arcs, with own-render bias control.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import { PNG } from 'pngjs';
import { hash, root, sourceHash, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { manaCandidateCircle } from './modern-mana-objective.mjs';
const [inputFile, nativeDirectory, scoreDirectory, auditFile, circleFile, parameterFile, output] =
  process.argv.slice(2);
assert(
  output,
  'Usage: modern-mana-shadow-fit.mjs INPUTS NATIVE SCORES AUDIT CIRCLE_FIT PARAMETERS OUT',
);
const started = performance.now();
const read = async (file) => {
  const bytes = await readFile(file);
  return { data: JSON.parse(bytes), sha256: hash(bytes) };
};
const input = await read(inputFile),
  native = await read(path.join(nativeDirectory, 'capture.json')),
  scores = await read(path.join(scoreDirectory, 'scores.json')),
  audit = await read(auditFile),
  circle = await read(circleFile),
  parameters = await read(parameterFile);
assert.equal(input.data.set, 'm21');
assert.equal(input.data.entries.length, 297);
assert.equal(native.data.completed, 297);
assert.deepEqual(native.data.faults, []);
assert.equal(native.data.source.inputsHash, input.sha256);
assert.equal(scores.data.definition.nativeCaptureHash, native.sha256);
assert.equal(audit.data.source.inputsHash, input.sha256);
assert.equal(native.data.source.manaStudy.parametersHash, parameters.sha256);
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), native.data.source.rendererHash);
const tool = hash(await readFile(new URL(import.meta.url)));
const scale = circle.data.rendererControls.scaleX;
assert.equal(scale, circle.data.rendererControls.scaleY);
assert.equal(
  parameters.data.rendererControls.scaleX,
  scale,
  'Shadow baseline needs the fitted circles',
);
assert.equal(parameters.data.rendererControls.scaleY, scale);
const costSource = await readFile(
  path.join(root, 'games/magic/src/presentation/modern-cost-mana.ts'),
  'utf8',
);
const costSourceHash = hash(costSource);
if (parameters.data.source.costSourceHash)
  assert.equal(parameters.data.source.costSourceHash, costSourceHash);
const authoredShadow = costSource.match(/shadow:\s*\[(-?[\d.]+),\s*(-?[\d.]+)\] as const/);
assert(authoredShadow, 'Review the source shadow declaration');
const baselineShadow = parameters.data.shadow ?? authoredShadow.slice(1).map(Number);
assert(baselineShadow.length === 2 && baselineShadow.every(Number.isFinite));
const current = { dx: baselineShadow[0] * scale, dy: baselineShadow[1] * scale };
function patch(image, x, y) {
  const side = 48,
    left = Math.round(x - side / 2),
    top = Math.round(y - side / 2);
  assert(left >= 0 && top >= 0 && left + side < image.width && top + side < image.height);
  const values = new Float32Array(side * side);
  for (let yy = 0; yy < side; yy++)
    for (let xx = 0; xx < side; xx++) {
      const i = ((yy + top) * image.width + xx + left) * 4;
      values[yy * side + xx] =
        0.2126 * image.data[i] + 0.7152 * image.data[i + 1] + 0.0722 * image.data[i + 2];
    }
  return { values, left, top, side };
}
function sample(p, x, y) {
  x -= p.left;
  y -= p.top;
  const ix = Math.floor(x),
    iy = Math.floor(y),
    fx = x - ix,
    fy = y - iy;
  assert(ix >= 0 && iy >= 0 && ix + 1 < p.side && iy + 1 < p.side);
  const i = iy * p.side + ix;
  return (
    (p.values[i] * (1 - fx) + p.values[i + 1] * fx) * (1 - fy) +
    (p.values[i + p.side] * (1 - fx) + p.values[i + p.side + 1] * fx) * fy
  );
}
const fields = [],
  issues = [];
for (const row of audit.data.rows.filter((r) => r.kind === 'normal')) {
  assert(row.nonfoil);
  const n = native.data.rows.find((r) => r.id === row.id),
    sc = scores.data.rows.find((r) => r.id === row.id),
    e = input.data.entries.find((e) => e.id === row.id);
  assert(n && sc && e);
  assert.equal(n.inputHash, hash(JSON.stringify(e.face)));
  const raw = await readFile(path.join(nativeDirectory, n.layers.face.file)),
    ref = await readFile(path.join(scoreDirectory, sc.normalizedReference.file));
  assert.equal(hash(raw), n.layers.face.sha256);
  assert.equal(hash(ref), sc.normalizedReference.sha256);
  const render = normalize(PNG.sync.read(raw, { checkCRC: true })),
    reference = PNG.sync.read(ref, { checkCRC: true });
  const discs = row.discs.map((d) => ({ ...d, ...manaCandidateCircle(d, circle.data.selected) }));
  for (const disc of discs) {
    const own = patch(render, disc.x, disc.y),
      target = patch(reference, disc.x, disc.y),
      rays = [];
    for (let i = 0; i < 96; i++) {
      const angle = ((i + 0.5) * Math.PI) / 48,
        ux = Math.cos(angle),
        uy = Math.sin(angle);
      const cx = disc.x + current.dx,
        cy = disc.y + current.dy;
      const inner = [cx + ux * (disc.radius - 0.75), cy + uy * (disc.radius - 0.75)],
        outer = [cx + ux * (disc.radius + 0.75), cy + uy * (disc.radius + 0.75)];
      if (Math.hypot(inner[0] - disc.x, inner[1] - disc.y) < disc.radius + 0.15) continue;
      if (
        discs.some(
          (d) =>
            d.index !== disc.index && Math.hypot(outer[0] - d.x, outer[1] - d.y) < d.radius + 0.5,
        )
      )
        continue;
      const gain = sample(own, ...outer) - sample(own, ...inner);
      if (gain < 25) continue;
      rays.push({ ux, uy, threshold: gain });
    }
    if (rays.length < 8)
      issues.push({
        id: row.id,
        name: e.card.name,
        index: disc.index,
        symbol: disc.symbol,
        rays: rays.length,
        reason: 'insufficient-source-shadow-arcs',
      });
    else
      fields.push({
        id: row.id,
        name: e.card.name,
        index: disc.index,
        symbol: disc.symbol,
        disc,
        own,
        target,
        rays,
      });
  }
}
assert.equal(fields.length + issues.length, 527);
const byCard = new Map();
for (const f of fields) {
  const list = byCard.get(f.id) ?? [];
  list.push(f);
  byCard.set(f.id, list);
}
const quality = (f, c, kind) => {
  let sum = 0;
  for (const ray of f.rays) {
    const cx = f.disc.x + c.dx,
      cy = f.disc.y + c.dy;
    const inner = [cx + ray.ux * (f.disc.radius - 0.75), cy + ray.uy * (f.disc.radius - 0.75)];
    if (Math.hypot(inner[0] - f.disc.x, inner[1] - f.disc.y) < f.disc.radius + 0.15) continue;
    const outer = [cx + ray.ux * (f.disc.radius + 0.75), cy + ray.uy * (f.disc.radius + 0.75)];
    const gain = Math.max(0, sample(f[kind], ...outer) - sample(f[kind], ...inner)),
      relative = gain / ray.threshold;
    sum += (2 * relative) / (1 + relative);
  }
  return sum / f.rays.length;
};
const cache = { own: new Map(), target: new Map() };
const evaluate = (c, kind) => {
  const key = JSON.stringify(c);
  if (cache[kind].has(key)) return cache[kind].get(key);
  const score =
    [...byCard.values()].reduce(
      (sum, list) => sum + list.reduce((n, f) => n + quality(f, c, kind), 0) / list.length,
      0,
    ) / byCard.size;
  const v = { ...c, quality: score };
  cache[kind].set(key, v);
  return v;
};
function search(kind) {
  let best = evaluate(current, kind);
  for (let dx = -2.5; dx <= 0; dx += 0.25)
    for (let dy = 0.5; dy <= 3.5; dy += 0.25) {
      const c = evaluate({ dx, dy }, kind);
      if (c.quality > best.quality) best = c;
    }
  const seed = best;
  for (let dx = -0.25; dx <= 0.25; dx += 0.0625)
    for (let dy = -0.25; dy <= 0.25; dy += 0.0625) {
      const c = { dx: seed.dx + dx, dy: seed.dy + dy };
      if (c.dx < -2.5 || c.dx > 0 || c.dy < 0.5 || c.dy > 3.5) continue;
      const v = evaluate(c, kind);
      if (v.quality > best.quality) best = v;
    }
  return best;
}
const own = search('own'),
  target = search('target');
assert(
  Math.abs(own.dx - current.dx) <= 0.5 && Math.abs(own.dy - current.dy) <= 0.5,
  'Native shadow observer has a large placement bias',
);
const selected = { dx: current.dx + target.dx - own.dx, dy: current.dy + target.dy - own.dy };
const rows = [...byCard].map(([id, list]) => {
  const before = list.reduce((s, f) => s + quality(f, current, 'target'), 0) / list.length,
    after = list.reduce((s, f) => s + quality(f, selected, 'target'), 0) / list.length;
  return {
    id,
    name: list[0].name,
    discs: list.length,
    rays: list.reduce((s, f) => s + f.rays.length, 0),
    before,
    after,
    delta: after - before,
  };
});
const out = {
  schema: 1,
  status: 'shadow-edge-proposal-requires-native-replay',
  eligibleForPublication: false,
  source: {
    inputs: input.sha256,
    native: native.sha256,
    scores: scores.sha256,
    audit: audit.sha256,
    circle: circle.sha256,
    parameters: parameters.sha256,
    costSourceHash,
    rendererHash: native.data.source.rendererHash,
    tool,
  },
  scope:
    'All527 normal-frame cost shadows remain in the census. Fixed source-visible outer-shadow arcs, directed luma gradient, fixed disc radius and normalized references. One card-balanced shared x/y fit; own-render bias is subtracted. Missing arcs are retained explicitly. No per-card transform, pigment, blur or radius fit.',
  current,
  own,
  target,
  selected,
  painterShadow: [selected.dx / scale, selected.dy / scale],
  summary: {
    cards: byCard.size,
    tokens: fields.length,
    issues: issues.length,
    sourceRays: fields.reduce((s, f) => s + f.rays.length, 0),
    before: rows.reduce((s, r) => s + r.before, 0) / rows.length,
    after: rows.reduce((s, r) => s + r.after, 0) / rows.length,
    improved: rows.filter((r) => r.delta > 1e-7).length,
    regressed: rows.filter((r) => r.delta < -1e-7).length,
  },
  boundaries: {
    own: own.dx === -2.5 || own.dx === 0 || own.dy === 0.5 || own.dy === 3.5,
    target: target.dx === -2.5 || target.dx === 0 || target.dy === 0.5 || target.dy === 3.5,
  },
  issues,
  rows,
  arcCensus: fields.map((f) => ({
    id: f.id,
    index: f.index,
    symbol: f.symbol,
    rays: f.rays.length,
  })),
  performance: {
    totalMs: performance.now() - started,
    ownCandidates: cache.own.size,
    targetCandidates: cache.target.size,
    scope:
      'CPU PNG decode, source-mask preparation and shared cached search; no browser or GPU benchmark',
  },
};
assert.equal(hash(await readFile(new URL(import.meta.url))), tool);
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), native.data.source.rendererHash);
await mkdir(output, { recursive: true });
await writeJson(path.join(output, 'fit.json'), out);
console.log(
  JSON.stringify({
    current,
    own,
    target,
    selected,
    painterShadow: out.painterShadow,
    summary: out.summary,
    boundaries: out.boundaries,
    performance: out.performance,
  }),
);
