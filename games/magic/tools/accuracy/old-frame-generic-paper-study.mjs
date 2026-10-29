// Sample every original generic-cost disc after frozen frame normalization.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';
import { PNG } from 'pngjs';
import { hash, root, objectFile, sourceHash, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
const [inputFile, poseFile, cohortFile, out] = process.argv.slice(2);
assert(out, 'Use INPUTS POSES COHORTS NEW_REPORT');
await fs.access(out).then(
  () => {
    throw Error('Report exists');
  },
  (e) => {
    if (e.code !== 'ENOENT') throw e;
  },
);
const raw = await Promise.all([inputFile, poseFile, cohortFile].map((f) => fs.readFile(f)));
const [input, poses, cohorts] = raw.map((b) => JSON.parse(b));
assert.equal(input.set, 'ons');
assert.equal(poses.inputHash, hash(raw[0]));
const source = await sourceHash(path.join(root, 'games/magic/src')),
  toolHash = hash(await fs.readFile(new URL(import.meta.url)));
const modules = [
  'retro-frame.ts',
  'retro-mana.ts',
  'retro-paint.ts',
  'symbol-adjustment.ts',
  'printing-mana-adjustment.ts',
];
const geometryHashes = Object.fromEntries(
  await Promise.all(
    modules.map(async (f) => [
      f,
      hash(await fs.readFile(path.join(root, 'games/magic/src/presentation', f))),
    ]),
  ),
);
const server = await createServer({
  root,
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
const rows = [],
  unavailable = [];
let original;
try {
  await server.ssrLoadModule('/games/magic/src/data/eager.ts');
  const { retroManaPlacement } = await server.ssrLoadModule(
    '/games/magic/src/presentation/retro-mana.ts',
  );
  const { retroRects, retroPx } = await server.ssrLoadModule(
    '/games/magic/src/presentation/retro-frame.ts',
  );
  const { printingManaAdjustment } = await server.ssrLoadModule(
    '/games/magic/src/presentation/printing-mana-adjustment.ts',
  );
  const { spacedManaBounds, adjustedSymbolBounds } = await server.ssrLoadModule(
    '/games/magic/src/presentation/symbol-adjustment.ts',
  );
  original = (await server.ssrLoadModule('/games/magic/src/calibration/sets/ons.ts')).profile.mana
    .paper.N;
  for (const e of input.entries) {
    const cost = e.face.manaSymbols ?? [];
    if (!cost.some((s) => /^(?:\d+|X)$/.test(s))) continue;
    const pose = poses.rows.find((r) => r.id === e.id);
    if (!pose?.accepted) {
      unavailable.push({ id: e.id, reason: 'alignment-review' });
      continue;
    }
    assert.equal(pose.referenceHash, e.reference.sha256);
    const bytes = await fs.readFile(objectFile(e.reference));
    assert.equal(hash(bytes), e.reference.sha256);
    const image = normalize(PNG.sync.read(bytes), pose.transform);
    const [x, y, w, h] = retroPx(retroRects(e.face).title),
      m = retroManaPlacement(e.face),
      a = printingManaAdjustment(e.face);
    const size = m?.[3] ?? 23.4,
      pitch = m?.[2] ?? 25.1,
      gap = pitch - size,
      total = cost.length * pitch;
    const left = m ? m[0] + size / 2 - total + gap : x + w - total;
    const top = m ? m[1] - size / 2 : y + h / 2 - size / 2;
    const rawBounds = [left, top, total - gap, size],
      spaced = spacedManaBounds(rawBounds, cost.length, a),
      adjusted = adjustedSymbolBounds(spaced, a);
    const sx = adjusted[2] / spaced[2],
      sy = adjusted[3] / spaced[3];
    for (let index = 0; index < cost.length; index++) {
      if (!/^(?:\d+|X)$/.test(cost[index])) continue;
      const cx =
        adjusted[0] +
        (left +
          index * pitch -
          (cost.length - 1 - index) * (a?.spacing ?? 0) +
          size / 2 -
          spaced[0]) *
          sx;
      const cy = adjusted[1] + (top + size / 2 - spaced[1]) * sy;
      const rx = (size / 2) * sx,
        ry = (size / 2) * sy;
      const pixels = [];
      for (let yy = Math.ceil(cy - 0.7 * ry); yy <= cy + 0.7 * ry; yy++)
        for (let xx = Math.ceil(cx - 0.7 * rx); xx <= cx + 0.7 * rx; xx++) {
          if (((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2 > 0.49) continue;
          const at = (yy * image.width + xx) * 4;
          if (image.data[at + 3] !== 255) continue;
          pixels.push([0, 1, 2].map((k) => image.data[at + k]));
        }
      assert(pixels.length >= 50);
      const light = (p) => p[0] * 0.2126 + p[1] * 0.7152 + p[2] * 0.0722;
      pixels.sort((a, b) => light(a) - light(b));
      const sample = pixels.slice(
        Math.floor(pixels.length * 0.65),
        Math.floor(pixels.length * 0.9),
      );
      const rgb = [0, 1, 2].map((k) => sample.reduce((n, p) => n + p[k], 0) / sample.length);
      rows.push({
        id: e.id,
        name: e.name,
        material: e.material,
        symbol: cost[index],
        index,
        cohort: cohorts.rows.find((c) => c.id === e.id).cohort,
        referenceHash: e.reference.sha256,
        poseHash: hash(JSON.stringify(pose.transform)),
        geometry: { cx, cy, rx, ry },
        rgb,
      });
    }
  }
} finally {
  await server.close();
}
const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
const distance = (a, b) => Math.hypot(...a.map((v, k) => v - b[k]));
const groups = {};
for (const material of new Set(rows.map((r) => r.material))) {
  const selected = rows.filter((r) => r.material === material);
  const cards = [...new Set(selected.map((r) => r.id))].map((id) => {
    const rr = selected.filter((r) => r.id === id);
    return { ...rr[0], rgb: [0, 1, 2].map((k) => median(rr.map((r) => r.rgb[k]))) };
  });
  const cal = cards.filter((r) => r.cohort === 'calibration');
  assert(cal.length >= 3, 'Sparse material ' + material);
  const target = [0, 1, 2].map((k) => Math.round(median(cal.map((r) => r.rgb[k]))));
  const summaries = {};
  for (const cohort of ['calibration', 'validation']) {
    const rr = cards.filter((r) => r.cohort === cohort);
    assert(rr.length >= 3);
    const before = rr.map((r) =>
        distance(
          r.rgb,
          original.map((v) => v * 255),
        ),
      ),
      after = rr.map((r) => distance(r.rgb, target));
    summaries[cohort] = {
      names: rr.length,
      before: median(before),
      after: median(after),
      regressions: after.filter((v, i) => v > before[i]).length,
    };
  }
  groups[material] = { target, cohorts: summaries };
}
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), source);
assert.equal(hash(await fs.readFile(new URL(import.meta.url))), toolHash);
await writeJson(out, {
  schema: 1,
  status: 'generic-paper-candidates-not-adopted',
  set: input.set,
  source: {
    renderer: source,
    tool: toolHash,
    input: hash(raw[0]),
    poses: hash(raw[1]),
    cohorts: hash(raw[2]),
    geometry: geometryHashes,
  },
  scope:
    'Every numeric and X casting-cost disc; centers, pitch and elliptical radii resolve the production geometry and shared adjustments. Frozen scan-only poses; 70% inner radii and fixed 65–90% luminance sample exclude numeral ink. Targets use calibration-name medians only; repeated cost tokens have one name weight. Earlier exploratory cohort summaries were viewed, so validation is explicitly reused-development, not independent.',
  original: original.map((v) => v * 255),
  groups,
  rows,
  unavailable,
});
console.log(
  JSON.stringify({
    tokens: rows.length,
    names: new Set(rows.map((r) => r.id)).size,
    groups,
    unavailable,
  }),
);
