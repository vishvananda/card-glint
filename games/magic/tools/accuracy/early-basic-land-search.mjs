// Shared basic-land source search. Scan poses and source asset bytes stay fixed.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { root, hash, sourceHash, writeJson } from './common.mjs';
import { openBrowser } from './browser.mjs';
import { normalize } from './pixels-pure.mjs';
import { frameProfiles } from './frame-family-metrics.mjs';
const [nativeDirectory, familyDirectory, geometryDirectory, output] = process.argv.slice(2);
assert(
  output,
  'Usage: early-basic-land-search.mjs NATIVE_CAPTURE SOURCE_FAMILY LAND_GEOMETRY OUTPUT',
);
const nativeBytes = await readFile(path.join(nativeDirectory, 'capture.json')),
  native = JSON.parse(nativeBytes),
  inputBytes = await readFile(path.join(nativeDirectory, 'inputs.json')),
  input = JSON.parse(inputBytes),
  familyBytes = await readFile(path.join(familyDirectory, 'family-study.json')),
  family = JSON.parse(familyBytes),
  geometryBytes = await readFile(path.join(geometryDirectory, 'study.json')),
  geometry = JSON.parse(geometryBytes);
assert.equal(native.source.rendererHash, await sourceHash(path.join(root, 'games/magic/src')));
assert.equal(family.rendererHash, native.source.rendererHash);
assert.equal(geometry.nativeCaptureHash, hash(nativeBytes));
const components = family.assets.filter((a) => a.key.endsWith('L') && a.family === 'abu');
assert.equal(components.length, 5);
const session = await openBrowser({ entries: [], components }, { fonts: false }),
  groups = [];
await mkdir(output, { recursive: true });
try {
  await session.page.evaluate(async () => {
    const { normalize } = await import('/games/magic/tools/accuracy/pixels-pure.mjs');
    const { frameProfiles } = await import('/games/magic/tools/accuracy/frame-family-metrics.mjs');
    const { opaqueSupport, scoreOpaqueFamily } = await import(
      '/games/magic/tools/accuracy/frame-family-score.mjs'
    );
    const { loadCanvasImages } = await import('/games/magic/src/presentation/canvas-assets.ts');
    globalThis.landSearch = async ({ asset, references }) => {
      const lease = await loadCanvasImages([asset.url], new AbortController().signal);
      try {
        const bitmap = lease.images.get(asset.url),
          canvas = document.createElement('canvas');
        canvas.width = 732;
        canvas.height = 1020;
        const c = canvas.getContext('2d', { willReadFrequently: true });
        const rect = (v) => [
          (244 * (1 - v.sx) + v.dx) / 488,
          (340 * (1 - v.sy) + v.dy) / 680,
          v.sx,
          v.sy,
        ];
        function paint(v) {
          const r = rect(v);
          c.clearRect(0, 0, 732, 1020);
          c.drawImage(bitmap, r[0] * 732, r[1] * 1020, r[2] * 732, r[3] * 1020);
          return normalize(c.getImageData(0, 0, 732, 1020));
        }
        const bounds = { dx: [-2, 2], dy: [-2, 2], sx: [0.992, 1.008], sy: [0.994, 1.006] };
        const envelope = [];
        for (const dx of bounds.dx)
          for (const dy of bounds.dy)
            for (const sx of bounds.sx)
              for (const sy of bounds.sy) envelope.push(paint({ dx, dy, sx, sy }));
        const support = opaqueSupport(envelope);
        // On short land names a descender can enter the upper art strip.
        // Do not let missing lettering in the source plate select its geometry.
        support.artTop = [0, 0];
        const cache = new Map();
        const zero = { dx: 0, dy: 0, sx: 1, sy: 1 };
        function scores(v) {
          const candidate = frameProfiles(paint(v));
          return references.map((r) => scoreOpaqueFamily(r.scan, candidate, support));
        }
        const baseline = scores(zero);
        if (baseline.some((s) => s.score === null)) throw Error('Insufficient opaque frame signal');
        function evaluate(v) {
          const key = JSON.stringify(v);
          if (cache.has(key)) return cache.get(key);
          for (const k of Object.keys(bounds))
            if (v[k] < bounds[k][0] - 1e-9 || v[k] > bounds[k][1] + 1e-9) return null;
          const data = scores(v);
          if (data.some((s) => s.score === null)) return null;
          const mean = data.reduce((a, b) => a + b.score, 0) / data.length;
          const worst = Math.max(0, ...data.map((s, i) => baseline[i].score - s.score));
          const row = {
            values: v,
            frame: rect(v),
            mean,
            worstRegression: worst,
            objective: mean - 0.25 * worst,
            scores: data,
          };
          cache.set(key, row);
          return row;
        }
        let best = evaluate(zero);
        for (const step of [
          { dx: 1, dy: 1, sx: 0.004, sy: 0.003 },
          { dx: 0.5, dy: 0.5, sx: 0.002, sy: 0.0015 },
          { dx: 0.25, dy: 0.25, sx: 0.001, sy: 0.00075 },
        ]) {
          for (let pass = 0; pass < 5; pass++) {
            let improved = false;
            for (const k of ['dx', 'sx', 'dy', 'sy']) {
              let next = best;
              for (const sign of [-2, -1, 1, 2]) {
                const v = {
                  ...best.values,
                  [k]: Number((best.values[k] + sign * step[k]).toFixed(8)),
                };
                const result = evaluate(v);
                if (result && result.objective > next.objective + 1e-8) next = result;
              }
              if (next !== best) {
                best = next;
                improved = true;
              }
            }
            if (!improved) break;
          }
        }
        // Exact current native profiles expose differences between source-only
        // predictions and the full painter before any candidate is adopted.
        const nativeControl = references.map((r) => scoreOpaqueFamily(r.scan, r.current, support));
        const parity = baseline.map((s, i) => Math.abs(s.score - nativeControl[i].score));
        canvas.width = canvas.height = 0;
        return {
          bounds,
          support,
          evaluations: cache.size,
          baseline: evaluate(zero),
          selected: best,
          nativeControl,
          predictionControlError: parity,
        };
      } finally {
        lease.dispose();
      }
    };
  });
  for (const group of geometry.groups) {
    const references = [];
    for (const identity of group.ids) {
      const row = native.rows.find((r) => r.id === identity.id);
      assert(row?.accepted);
      for (const field of ['referenceHash', 'poseHash']) assert.equal(identity[field], row[field]);
      const files = [row.id + '-scan.png', row.id + '.png'],
        profiles = [];
      for (const [i, file] of files.entries()) {
        const bytes = await readFile(path.join(nativeDirectory, '2ed', file));
        assert.equal(hash(bytes), i ? row.renderHash : row.scanHash);
        profiles.push(frameProfiles(normalize(PNG.sync.read(bytes))));
      }
      references.push({ id: row.id, scan: profiles[0], current: profiles[1] });
    }
    const asset = components.find((a) => a.key === group.key);
    const result = await session.page.evaluate((data) => globalThis.landSearch(data), {
      asset,
      references,
    });
    const prior = group.candidates.find((c) => c.family === 'abu');
    const art = Object.fromEntries(
      ['left', 'right', 'top', 'bottom'].map((side) => {
        const axis = ['left', 'right'].includes(side) ? 'x' : 'y',
          scale = result.selected.values[axis === 'x' ? 'sx' : 'sy'],
          shift = result.selected.values[axis === 'x' ? 'dx' : 'dy'],
          center = axis === 'x' ? 244 : 340;
        return [side, prior.source.art[side].position * scale + center * (1 - scale) + shift];
      }),
    );
    const recipe = {
      family: 'abu',
      asset: asset.url,
      mask: prior.mask,
      frame: result.selected.frame,
      stockMaskFrame: prior.stockMaskFrame,
      art: [
        (art.left - 1) / 488,
        (art.top - 1) / 680,
        (art.right - art.left + 2) / 488,
        (art.bottom - art.top + 2) / 680,
      ],
    };
    groups.push({
      key: group.key,
      name: group.name,
      identities: group.ids,
      source: { url: asset.url, sha256: asset.sha256 },
      ...result,
      recipe,
    });
    await writeJson(path.join(output, group.key + '-definition.json'), {
      schema: 1,
      ids: references.map((r) => r.id),
      trials: [{ id: 'shared-search', materials: { L: recipe } }],
    });
    console.log(
      group.key,
      result.evaluations,
      'predicted',
      result.baseline.mean.toFixed(4),
      '->',
      result.selected.mean.toFixed(4),
      'control error',
      Math.max(...result.predictionControlError).toFixed(5),
    );
  }
  assert.deepEqual(session.faults, []);
} finally {
  await session.close();
}
await writeJson(path.join(output, 'search.json'), {
  schema: 1,
  status: 'basic-land-shared-source-search-needs-native-verification',
  scope:
    'One bounded source transform per basic-land color on all three development illustrations. The source family was selected in the preceding family comparison. No blind validation is claimed. Mean frame-only signed-gradient/census score minus one quarter worst individual loss; fixed opaque support covers the entire search envelope. Upper art strip is omitted to exclude heading descenders. Original scan transforms, words and source bytes are frozen. Full native renders must verify predictions before promotion.',
  nativeCaptureHash: hash(nativeBytes),
  nativeInputsHash: hash(inputBytes),
  familyStudyHash: hash(familyBytes),
  geometryHash: hash(geometryBytes),
  rendererHash: native.source.rendererHash,
  toolHash: hash(await readFile(new URL(import.meta.url))),
  dependencies: Object.fromEntries(
    await Promise.all(
      ['frame-family-metrics', 'frame-family-score', 'pixels-pure'].map(async (n) => [
        n,
        hash(await readFile(new URL('./' + n + '.mjs', import.meta.url))),
      ]),
    ),
  ),
  groups,
});
