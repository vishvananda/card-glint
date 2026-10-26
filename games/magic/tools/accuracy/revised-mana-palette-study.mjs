// Forward palette trials on frozen, scan-aligned Revised circles.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { root, hash, sourceHash, objectFile, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { nativeRgbaCrop } from './native-rgba-crop.mjs';
import { manaGlyphMask } from './mana-glyph-metrics.mjs';
import { median, quantile, delta } from './hsb-color.mjs';
import { openBrowser } from './browser.mjs';
const [inputFile, poseFile, nativeDirectory, ringFile, definitionFile, output] =
  process.argv.slice(2);
assert(
  output,
  'Usage: revised-mana-palette-study.mjs INPUTS POSES NATIVE RINGS DEFINITION NEW_OUTPUT',
);
const paths = [
    inputFile,
    poseFile,
    path.join(nativeDirectory, 'capture.json'),
    ringFile,
    definitionFile,
  ],
  bytes = await Promise.all(paths.map((p) => fs.readFile(p))),
  [inputs, poses, capture, ring, definition] = bytes.map((b) => JSON.parse(b)),
  rendererHash = await sourceHash(path.join(root, 'games/magic/src')),
  sources = Object.fromEntries(paths.map((p, i) => [path.basename(p), hash(bytes[i])])),
  rect = [200, 25, 260, 43],
  proof = {},
  rows = [];
assert.equal(capture.rendererHash, rendererHash);
assert.equal(capture.inputHash, hash(bytes[0]));
assert.equal(capture.status, 'complete');
assert.equal(definition.status, 'forward-palette-proposals-not-adopted');
assert.equal(definition.candidates[0].name, 'current');
const selected = new Set();
for (const symbol of ['W', 'U', 'B', 'R', 'G', 'N'])
  for (const [cohort, limit] of [
    ['calibration', 6],
    ['validation', 4],
  ]) {
    const eligible = ring.rows
      .filter(
        (r) =>
          r.cohort === cohort &&
          r.discs.some(
            (d) => d.accepted && (symbol === 'N' ? /^\d+$/.test(d.symbol) : d.symbol === symbol),
          ),
      )
      .sort((a, b) => hash(symbol + '/' + a.id).localeCompare(hash(symbol + '/' + b.id)));
    for (const r of eligible.slice(0, limit)) selected.add(r.id);
  }
const plugin = {
  name: 'revised-native-palette-forward',
  enforce: 'pre',
  transform(source, id) {
    if (!id.endsWith('/games/magic/src/presentation/printing-calibration-materials.ts')) return;
    const needle =
      'export const calibratedManaTarget = (face: RenderedCardInput, symbol: string) => {';
    assert.equal(source.split(needle).length, 2);
    const code = source.replace(
      needle,
      needle +
        '\n  const trial=(globalThis as any).__revisedPalette; if(trial && face.setCode?.toLowerCase()==="3ed") { if(symbol==="INK" && trial.ink)return trial.ink; if(trial.paper?.[symbol])return trial.paper[symbol]; }\n',
    );
    const v = { before: hash(source), after: hash(code) };
    if (proof.source) assert.deepEqual(proof.source, v);
    proof.source = v;
    return code;
  },
};
const session = await openBrowser(
  { ...inputs, components: [...(inputs.components ?? []), ...capture.extraAssets] },
  { plugins: [plugin] },
);
const rgb = (im, x, y) => {
  const left = Math.floor(x),
    top = Math.floor(y),
    fx = x - left,
    fy = y - top;
  assert(left >= 0 && top >= 0 && left + 1 < im.width && top + 1 < im.height);
  return [0, 1, 2].map((c) => {
    const a = (top * im.width + left) * 4 + c;
    return (
      (im.data[a] * (1 - fx) + im.data[a + 4] * fx) * (1 - fy) +
      (im.data[a + im.width * 4] * (1 - fx) + im.data[a + (im.width + 1) * 4] * fx) * fy
    );
  });
};
const average = (a) => a.reduce((s, v) => s + v, 0) / a.length;
const trim = (a) => {
  const v = a.slice().sort((a, b) => a - b);
  return average(v.slice(Math.floor(v.length * 0.1), Math.ceil(v.length * 0.9)));
};
const tone = (a, role) =>
  [0, 1, 2].map((c) =>
    role === 'paper'
      ? trim(a.map((v) => v[c]))
      : quantile(
          a.map((v) => v[c]),
          0.2,
        ),
  );
await fs.writeFile(output, JSON.stringify({ status: 'running' }), { flag: 'wx' });
try {
  for (const id of selected) {
    const e = inputs.entries.find((e) => e.id === id),
      r = ring.rows.find((r) => r.id === id),
      n = capture.rows.find((n) => n.id === id),
      p = Object.values(poses.groups)
        .flatMap((g) => g.rows)
        .find((p) => p.id === id),
      sb = await fs.readFile(objectFile(e.reference)),
      nb = await fs.readFile(path.join(nativeDirectory, n.modes.original.file));
    assert(p.accepted);
    assert.equal(hash(sb), r.referenceHash);
    assert.equal(hash(JSON.stringify(p.transform)), r.poseHash);
    assert.equal(hash(nb), n.modes.original.sha256);
    const ref = normalize(PNG.sync.read(sb), p.transform),
      native = PNG.sync.read(nb),
      current = normalize(native),
      expected = nativeRgbaCrop(native, rect),
      discs = [
        ...new Map(
          r.discs
            .filter((d) => d.accepted)
            .map((d) => [/^\d+$/.test(d.symbol) ? 'N' : d.symbol, d]),
        ).values(),
      ];
    const captured = await session.page.evaluate(
      async ({ e, candidates, rect }) => {
        await import('/games/magic/src/data/eager.ts');
        await import('/games/magic/src/data/eager-wording.ts');
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts'),
          { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts'),
          { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs'),
          { nativeRgbaCrop } = await import('/games/magic/tools/accuracy/native-rgba-crop.mjs'),
          signal = new AbortController().signal,
          lease = await loadAccuracyImages(canvasAssetUrls(e.face), signal, e.face.illustration),
          out = [];
        try {
          for (const candidate of candidates) {
            globalThis.__revisedPalette = candidate.name === 'current' ? undefined : candidate;
            const c = await composeCardTexture(
              { face: e.face, printingId: e.id, printedImage: null },
              'inspect',
              signal,
              {
                loadImages: async () => ({ ...lease, dispose() {} }),
              },
            );
            try {
              const data = nativeRgbaCrop(
                c
                  .getContext('2d', { willReadFrequently: true })
                  .getImageData(0, 0, c.width, c.height),
                rect,
              ).data;
              out.push({
                name: candidate.name,
                data: Array.from(data),
                png: candidate.name === 'current' ? c.toDataURL().split(',')[1] : null,
              });
            } finally {
              c.width = c.height = 0;
            }
          }
        } finally {
          delete globalThis.__revisedPalette;
          lease.dispose();
        }
        return out;
      },
      { e, candidates: definition.candidates, rect },
    );
    assert.equal(hash(Buffer.from(captured[0].png, 'base64')), n.modes.original.sha256);
    assert.deepEqual(new Uint8Array(captured[0].data), expected.data);
    const record = {
      id,
      name: e.name,
      cohort: r.cohort,
      referenceHash: r.referenceHash,
      poseHash: r.poseHash,
      nativeHash: n.modes.original.sha256,
      discs: [],
    };
    for (const d of discs) {
      const symbol = /^\d+$/.test(d.symbol) ? 'N' : d.symbol,
        mask = manaGlyphMask(current, d.circles.render, false, {
          normalizeBounds: false,
          thresholdFraction: 0.48,
        });
      assert.equal(mask.status, 'measured');
      const points = { paper: [], ink: [] };
      for (let y = 3; y < 37; y++)
        for (let x = 3; x < 37; x++) {
          if (Math.hypot(x - 20, y - 20) > 18 * 0.82) continue;
          let any = false,
            all = true;
          for (let dy = -2; dy <= 2; dy++)
            for (let dx = -2; dx <= 2; dx++) {
              if (dx * dx + dy * dy > 4) continue;
              const bit = mask.ink[(y + dy) * 40 + x + dx];
              any ||= !!bit;
              all &&= !!bit;
            }
          const role = !any ? 'paper' : all ? 'ink' : null;
          if (role) points[role].push([x, y]);
        }
      if (points.paper.length < 8 || points.ink.length < 8) continue;
      const sample = (im, c, point, offset = [0, 0]) =>
          rgb(
            im,
            c.x + ((point[0] - 20) * 2 * c.radius) / 36 - offset[0],
            c.y + ((point[1] - 20) * 2 * c.radius) / 36 - offset[1],
          ),
        reference = Object.fromEntries(
          Object.entries(points).map(([role, ps]) => [
            role,
            tone(
              ps.map((p) => sample(ref, d.circles.scan, p)),
              role,
            ),
          ]),
        ),
        trials = captured.map((c) => {
          const image = { width: rect[2], height: rect[3], data: c.data },
            colors = Object.fromEntries(
              Object.entries(points).map(([role, ps]) => [
                role,
                tone(
                  ps.map((p) => sample(image, d.circles.render, p, rect.slice(0, 2))),
                  role,
                ),
              ]),
            ),
            error = Object.fromEntries(
              ['paper', 'ink'].map((role) => [
                role,
                delta(
                  reference[role].map((v) => v / 255),
                  colors[role].map((v) => v / 255),
                ),
              ]),
            );
          return { name: c.name, colors, error, balanced: (error.paper + error.ink) / 2 };
        });
      record.discs.push({
        symbol,
        printedSymbol: d.symbol,
        reference,
        counts: { paper: points.paper.length, ink: points.ink.length },
        trials,
      });
    }
    rows.push(record);
    if (rows.length % 10 === 0) console.log('Native palette fit', rows.length, '/', selected.size);
  }
  const groups = {};
  for (const symbol of ['all', 'W', 'U', 'B', 'R', 'G', 'N'])
    for (const cohort of ['all', 'calibration', 'validation']) {
      const ds = rows
        .filter((r) => cohort === 'all' || r.cohort === cohort)
        .flatMap((r) => r.discs)
        .filter((d) => symbol === 'all' || d.symbol === symbol);
      groups[symbol + '/' + cohort] = definition.candidates.map((c) => {
        const a = ds.map((d) => d.trials.find((t) => t.name === c.name));
        return {
          name: c.name,
          discs: a.length,
          paper: average(a.map((t) => t.error.paper)),
          ink: average(a.map((t) => t.error.ink)),
          balanced: average(a.map((t) => t.balanced)),
          median: median(a.map((t) => t.balanced)),
        };
      });
    }
  assert.deepEqual(session.faults, []);
  assert.equal(await sourceHash(path.join(root, 'games/magic/src')), rendererHash);
  await writeJson(output, {
    schema: 1,
    status: 'forward-native-palette-study-not-adopted',
    scope:
      'Deterministic six calibration/four reused development-validation names per symbol. Separate eroded ink/paper objectives; no per-scan recoloring. Baseline native PNG and regional RGBA parity exact. Trial preparation uses production material caches. Not whole-set certification.',
    rendererHash,
    sources,
    toolHash: hash(await fs.readFile(new URL(import.meta.url))),
    proof,
    definition,
    groups,
    rows,
    faults: session.faults,
  });
  console.log(JSON.stringify(groups['all/all']));
} finally {
  await session.close();
}
