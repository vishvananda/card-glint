// Shared geometry search on the production-prepared ABU dual-land composites.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { root, hash, sourceHash, writeJson } from './common.mjs';
import { openBrowser } from './browser.mjs';
import { normalize } from './pixels-pure.mjs';
import { frameProfiles } from './frame-family-metrics.mjs';
const [nativeDirectory, outerFile, output] = process.argv.slice(2);
assert(output, 'Usage: early-dual-land-search.mjs NATIVE_CAPTURE OUTER_PROPOSAL OUTPUT');
const nativeBytes = await readFile(path.join(nativeDirectory, 'capture.json')),
  native = JSON.parse(nativeBytes),
  inputBytes = await readFile(path.join(nativeDirectory, 'inputs.json')),
  input = JSON.parse(inputBytes),
  outerBytes = await readFile(outerFile),
  outer = JSON.parse(outerBytes);
assert.equal(native.source.rendererHash, await sourceHash(path.join(root, 'games/magic/src')));
const entries = input.entries.filter((e) => e.material === 'L' && e.face.frameColors?.length === 2);
assert.equal(entries.length, 10);
const prepared = [];
for (const e of entries) {
  assert.equal(e.face.wordingMode, 'original');
  const row = native.rows.find((r) => r.id === e.id);
  assert(row?.accepted && e.pose.accepted);
  assert.equal(e.reference.sha256, row.referenceHash);
  const profiles = [];
  for (const [suffix, expected] of [
    ['-scan.png', row.scanHash],
    ['.png', row.renderHash],
  ]) {
    const bytes = await readFile(path.join(nativeDirectory, e.set, e.id + suffix));
    assert.equal(hash(bytes), expected);
    profiles.push(frameProfiles(normalize(PNG.sync.read(bytes))));
  }
  prepared.push({
    id: e.id,
    name: e.name,
    face: e.face,
    cohort: e.pose.cohort,
    referenceHash: row.referenceHash,
    poseHash: row.poseHash,
    scan: profiles[0],
    current: profiles[1],
  });
}
const session = await openBrowser({ entries, components: input.components }, { fonts: false });
await mkdir(output, { recursive: true });
let result;
try {
  result = await session.page.evaluate(async (entries) => {
    await import('/games/magic/src/data/eager.ts');
    const { canvasAssetUrls, loadCanvasImages } = await import(
      '/games/magic/src/presentation/canvas-assets.ts'
    );
    const { prepareEarlyHsb } = await import('/games/magic/src/presentation/early-hsb-material.ts');
    const { prepareRetroDualFrame } = await import(
      '/games/magic/src/presentation/retro-dual-material.ts'
    );
    const { retroDualFrame } = await import('/games/magic/src/presentation/retro-dual-frame.ts');
    const { calibratedFrameMaterials } = await import(
      '/games/magic/src/presentation/printing-calibration-materials.ts'
    );
    const { nativeFrameProfiles, nativeOpaqueSupport } = await import(
      '/games/magic/tools/accuracy/frame-native-profiles.mjs'
    );
    const { scoreOpaqueFamily } = await import(
      '/games/magic/tools/accuracy/frame-family-score.mjs'
    );
    const canvas = document.createElement('canvas');
    canvas.width = 732;
    canvas.height = 1020;
    const c = canvas.getContext('2d', { willReadFrequently: true }),
      sources = [];
    const sha = async (data) =>
      [...new Uint8Array(await crypto.subtle.digest('SHA-256', data))]
        .map((v) => v.toString(16).padStart(2, '0'))
        .join('');
    const rectangle = (v) => [
      (244 * (1 - v.sx) + v.dx) / 488,
      (340 * (1 - v.sy) + v.dy) / 680,
      v.sx,
      v.sy,
    ];
    const paint = (source, values) => {
      const r = rectangle(values);
      c.clearRect(0, 0, 732, 1020);
      c.drawImage(source.bitmap, r[0] * 732, r[1] * 1020, r[2] * 732, r[3] * 1020);
      return c.getImageData(0, 0, 732, 1020);
    };
    try {
      for (const entry of entries) {
        // Frame material selection is proven identical before suppressing unrelated
        // art/text/mana asset loading. Never use a final-card raster as a source.
        const face = {
          ...entry.face,
          illustration: null,
          rulesText: '',
          rulesParagraphs: [],
          manaSymbols: [],
        };
        const materials = calibratedFrameMaterials(entry.face);
        if (JSON.stringify(calibratedFrameMaterials(face)) !== JSON.stringify(materials))
          throw Error('Content changed frame materials');
        const plan = retroDualFrame(face);
        if (!plan) throw Error('Missing ABU dual plan');
        const signal = new AbortController().signal,
          raw = await loadCanvasImages(canvasAssetUrls(face), signal);
        let calibrated, dual;
        try {
          calibrated = await prepareEarlyHsb(face, raw.images, signal);
          dual = await prepareRetroDualFrame(face, calibrated.images, signal);
          const source = dual.images.get(plan.base);
          if (!source) throw Error('Missing prepared source');
          const bitmap = await createImageBitmap(source),
            probe = document.createElement('canvas');
          probe.width = bitmap.width;
          probe.height = bitmap.height;
          const p = probe.getContext('2d');
          p.drawImage(bitmap, 0, 0);
          const decodedHash = await sha(p.getImageData(0, 0, probe.width, probe.height).data);
          probe.width = probe.height = 0;
          sources.push({
            ...entry,
            bitmap,
            source: { plan, materials, width: bitmap.width, height: bitmap.height, decodedHash },
          });
        } finally {
          dual?.dispose();
          calibrated?.dispose();
          raw.dispose();
        }
      }
      const bounds = { dx: [-2, 2], dy: [-2, 2], sx: [0.992, 1.008], sy: [0.994, 1.006] };
      let support;
      for (const source of sources)
        for (const dx of bounds.dx)
          for (const dy of bounds.dy)
            for (const sx of bounds.sx)
              for (const sy of bounds.sy) {
                const part = nativeOpaqueSupport(paint(source, { dx, dy, sx, sy }));
                support = support
                  ? Object.fromEntries(
                      Object.keys(support).map((k) => [
                        k,
                        [Math.max(support[k][0], part[k][0]), Math.min(support[k][1], part[k][1])],
                      ]),
                    )
                  : part;
              }
      // Exclude all nearby original and rendered text, not just paper centers.
      support.artTop = [0, 0];
      support.rulesLeft[1] = Math.min(support.rulesLeft[1], 68 - 44);
      support.rulesRight[0] = Math.max(support.rulesRight[0], 423 - 399);
      support.rulesTop[1] = Math.min(support.rulesTop[1], 422 - 399);
      const zero = { dx: 0, dy: 0, sx: 1, sy: 1 },
        cache = new Map();
      const scores = (values) =>
        sources.map((s) =>
          scoreOpaqueFamily(s.scan, nativeFrameProfiles(paint(s, values)), support),
        );
      const baseline = scores(zero),
        training = sources.flatMap((s, i) => (s.cohort === 'calibration' ? [i] : [])),
        validation = sources.flatMap((s, i) => (s.cohort === 'validation' ? [i] : []));
      if (training.length < 5 || validation.length < 2 || baseline.some((s) => s.score === null))
        throw Error('Insufficient shared frame evidence');
      const average = (data, ids) => ids.reduce((a, i) => a + data[i].score, 0) / ids.length;
      function evaluate(values) {
        const key = JSON.stringify(values);
        if (cache.has(key)) return cache.get(key);
        for (const k of Object.keys(bounds))
          if (values[k] < bounds[k][0] - 1e-9 || values[k] > bounds[k][1] + 1e-9) return null;
        const data = scores(values);
        if (data.some((s) => s.score === null)) return null;
        const worst = Math.max(0, ...training.map((i) => baseline[i].score - data[i].score));
        const row = {
          values,
          frame: rectangle(values),
          scores: data,
          trainingMean: average(data, training),
          validationMean: average(data, validation),
          worstTrainingRegression: worst,
          objective: average(data, training) - 0.25 * worst,
        };
        cache.set(key, row);
        return row;
      }
      let best = evaluate(zero);
      for (const step of [
        { dx: 1, dy: 1, sx: 0.004, sy: 0.003 },
        { dx: 0.5, dy: 0.5, sx: 0.002, sy: 0.0015 },
        { dx: 0.25, dy: 0.25, sx: 0.001, sy: 0.00075 },
      ])
        for (let pass = 0; pass < 5; pass++) {
          let changed = false;
          for (const dimension of ['dx', 'sx', 'dy', 'sy']) {
            let next = best;
            for (const sign of [-2, -1, 1, 2]) {
              const values = {
                ...best.values,
                [dimension]: Number((best.values[dimension] + sign * step[dimension]).toFixed(8)),
              };
              const candidate = evaluate(values);
              if (candidate && candidate.objective > next.objective + 1e-8) next = candidate;
            }
            if (next !== best) {
              best = next;
              changed = true;
            }
          }
          if (!changed) break;
        }
      const apertures = sources.map((source) => {
        const image = paint(source, best.values);
        let left = 732,
          right = -1,
          top = 1020,
          bottom = -1;
        for (let y = 90; y < 576; y++)
          for (let x = 67; x < 668; x++)
            if (image.data[(y * 732 + x) * 4 + 3] < 254) {
              left = Math.min(left, x);
              right = Math.max(right, x);
              top = Math.min(top, y);
              bottom = Math.max(bottom, y);
            }
        if (right < left || bottom < top) throw Error('Missing source illustration aperture');
        return { id: source.id, left, right, top, bottom };
      });
      for (const side of ['left', 'right', 'top', 'bottom'])
        if (
          Math.max(...apertures.map((a) => a[side])) - Math.min(...apertures.map((a) => a[side])) >
          1
        )
          throw Error('Dual composites disagree about their illustration aperture');
      const left = Math.min(...apertures.map((a) => a.left)) / 1.5 - 1,
        right = (Math.max(...apertures.map((a) => a.right)) + 1) / 1.5 + 1,
        top = Math.min(...apertures.map((a) => a.top)) / 1.5 - 1,
        bottom = (Math.max(...apertures.map((a) => a.bottom)) + 1) / 1.5 + 1;
      const art = [left / 488, top / 680, (right - left) / 488, (bottom - top) / 680];
      const nativeControl = sources.map((s) => scoreOpaqueFamily(s.scan, s.current, support));
      return {
        bounds,
        art,
        apertures,
        support,
        evaluations: cache.size,
        training: training.map((i) => sources[i].id),
        validation: validation.map((i) => sources[i].id),
        baseline: evaluate(zero),
        selected: best,
        nativeControl,
        predictionControlErrors: baseline.map((s, i) => s.score - nativeControl[i].score),
        sources: sources.map(({ id, name, cohort, referenceHash, poseHash, source }) => ({
          id,
          name,
          cohort,
          referenceHash,
          poseHash,
          ...source,
        })),
      };
    } finally {
      for (const s of sources) s.bitmap.close();
      canvas.width = canvas.height = 0;
    }
  }, prepared);
  assert.deepEqual(session.faults, []);
  assert.equal(result.art?.length, 4, 'Missing common art underlap');
} finally {
  await session.close();
}
const axes = outer.materials.L.axes,
  stockMaskFrame = [
    (244 * (1 - axes.x.scale) + axes.x.shift) / 488,
    (340 * (1 - axes.y.scale) + axes.y.shift) / 680,
    axes.x.scale,
    axes.y.scale,
  ];
const material = { family: 'abu', frame: result.selected.frame, art: result.art, stockMaskFrame };
await writeJson(path.join(output, 'definition.json'), {
  schema: 1,
  ids: entries.map((e) => e.id),
  trials: [{ id: 'shared-dual-search', materials: { L: material } }],
});
await writeJson(path.join(output, 'search.json'), {
  schema: 1,
  status: 'shared-dual-source-geometry-needs-native-verification',
  scope:
    'One position/scale for all ten dual composites, selected only on eight predeclared calibration names. Two reserved names are reused development validation, not a new blind sample. Prepared plates use the production HSB and dual-material functions with identical source material selection. Fixed opaque support covers the full search envelope and clips margins to exclude nearby rules text; the upper art strip is omitted. Original affine scan poses and words remain unchanged. No per-printing geometry or final-card filter. Actual native composition is still required before adoption.',
  rendererHash: native.source.rendererHash,
  nativeCaptureHash: hash(nativeBytes),
  nativeInputsHash: hash(inputBytes),
  outerProposalHash: hash(outerBytes),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  dependencies: Object.fromEntries(
    await Promise.all(
      ['frame-native-profiles', 'frame-family-metrics', 'frame-family-score', 'pixels-pure'].map(
        async (n) => [n, hash(await readFile(new URL('./' + n + '.mjs', import.meta.url)))],
      ),
    ),
  ),
  ...result,
  material,
});
console.log(
  JSON.stringify({
    training: result.training.length,
    validation: result.validation.length,
    evaluations: result.evaluations,
    trainingBefore: result.baseline.trainingMean,
    trainingAfter: result.selected.trainingMean,
    validationBefore: result.baseline.validationMean,
    validationAfter: result.selected.validationMean,
    maximumControlError: Math.max(...result.predictionControlErrors.map(Math.abs)),
  }),
);
