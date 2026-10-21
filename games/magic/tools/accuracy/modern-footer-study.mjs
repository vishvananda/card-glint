import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { openBrowser } from './browser.mjs';
import { modernFooterStudyPlugin } from './modern-footer-study-plugin.mjs';
import { cachedFetch } from './cache.mjs';
import { root, hash, sourceHash } from './common.mjs';
const [inputFile, nativeDirectory, scoreDirectory, planFile, out, option] = process.argv.slice(2);
assert(
  out && (option === undefined || option === '--fetch-fonts'),
  'Usage: modern-footer-study.mjs INPUTS NATIVE SCORES PLAN OUT [--fetch-fonts]',
);
const read = async (f) => JSON.parse(await fs.readFile(f));
const inputs = await read(inputFile),
  scores = await read(scoreDirectory + '/scores.json'),
  plan = await read(planFile),
  native = await read(nativeDirectory + '/capture.json');
assert(inputs.entries.length && inputs.entries.every((e) => e.face.wordingMode === 'original'));
const part = plan.part,
  base = plan.base ?? {};
assert.equal(plan.schema, 1);
assert(['collector', 'artist', 'legal'].includes(part));
const parameters = new Set([
  'collectorFamily',
  'collectorSize',
  'collectorTracking',
  'collectorOffset',
  'artistSize',
  'artistTracking',
  'artistOffset',
  'legalSize',
  'legalTracking',
  'legalOffset',
]);
function validate(value) {
  assert(value && typeof value === 'object' && !Array.isArray(value));
  for (const [k, v] of Object.entries(value)) {
    assert(parameters.has(k), 'Unknown footer parameter ' + k);
    if (k === 'collectorFamily') assert(['CardRenderer MTG Relay', 'Study M21 Gotham'].includes(v));
    else if (k.endsWith('Offset'))
      assert(
        Array.isArray(v) &&
          v.length === 2 &&
          v.every((x) => Number.isFinite(x) && Math.abs(x) <= 20),
      );
    else assert(Number.isFinite(v) && (k.endsWith('Size') ? v >= 6 && v <= 24 : Math.abs(v) <= 2));
  }
}
validate(base);
assert(Array.isArray(plan.variants) && plan.variants.length > 0 && plan.variants.length <= 128);
const variants = plan.variants.map((v) => {
    validate(v);
    return { ...base, ...v };
  }),
  offsets = plan.offsets;
assert(Array.isArray(offsets) && offsets.length > 0 && offsets.length <= 256);
for (const v of offsets)
  assert(
    Array.isArray(v) && v.length === 2 && v.every((x) => Number.isFinite(x) && Math.abs(x) <= 20),
  );
assert.equal(scores.rows.length, inputs.entries.length);
assert.equal(native.rows.length, inputs.entries.length);
const manifest = await read(root + '/games/magic/assets.json');
const gotham = await cachedFetch(manifest.CONJURER_ROOT + '/data/fonts/gotham-medium.ttf', {
  offline: option !== '--fetch-fonts',
});
const rects =
  part === 'collector'
    ? [
        [28, 632, 150, 15],
        [28, 648, 61, 18],
      ]
    : part === 'artist'
      ? [[88, 648, 185, 18]]
      : [[277, 632, 181, 34]];
const injection = modernFooterStudyPlugin(),
  plugin = injection.plugin;
await fs.mkdir(out, { recursive: true });
const session = await openBrowser(
  { ...inputs, components: [...inputs.components, gotham] },
  { plugins: [plugin] },
);
let rows = [];
const source = {
  inputsHash: hash(await fs.readFile(inputFile)),
  scoresHash: hash(await fs.readFile(scoreDirectory + '/scores.json')),
  rendererHash: await sourceHash(root + '/games/magic/src'),
  toolHash: hash(await fs.readFile(new URL(import.meta.url))),
  pluginHash: hash(await fs.readFile(new URL('./modern-footer-study-plugin.mjs', import.meta.url))),
  planHash: hash(await fs.readFile(planFile)),
};
source.nativeCaptureHash = hash(await fs.readFile(nativeDirectory + '/capture.json'));
assert.equal(native.source.inputsHash, source.inputsHash);
assert.equal(native.source.rendererHash, source.rendererHash);
assert.equal(scores.definition.inputsHash, source.inputsHash);
assert.equal(scores.definition.nativeCaptureHash, source.nativeCaptureHash);
for (const items of [inputs.entries, native.rows, scores.rows])
  assert.equal(
    new Set(items.map((r) => r.id)).size,
    inputs.entries.length,
    'Require a unique complete census',
  );
const definition = {
  source,
  baselinePolicy:
    'Unmodified current-renderer footer is scored separately from phase variants. Native glyph parity must pass for every input before this study can be considered reproducible.',
  legalRegionPolicy:
    'The known physical footer row selects a fixed semantic region; do not compare long artist names against copyright. Stats/loyalty uses y646..666, others y632..649.',
  fonts: [gotham],
  part,
  base,
  variants,
  offsets,
  rects,
  scope:
    'Original every-printing census. Native footer fonts rendered once per size/tracking candidate in one cached browser; translations scored on prepared filled-ink masks. Fixed comparison-only scan poses, no pose fitting. Nonfoil ordinary frames choose the shared proposal; planeswalkers/foil-only sources remain diagnostic and in the denominator. These are regional proposals, not renderer adoption or set certification.',
};
const definitionHash = hash(JSON.stringify(definition));
try {
  const prior = await read(out + '/results.json');
  assert.equal(
    prior.definitionHash,
    definitionHash,
    'Use a fresh output after source, plan or data changes',
  );
  assert.equal(prior.rowsHash, hash(JSON.stringify(prior.rows)), 'Changed checkpoint rows');
  rows = prior.rows;
} catch (e) {
  if (e.code !== 'ENOENT') throw e;
}
await fs.writeFile(out + '/plan.json', JSON.stringify(definition, null, 2) + '\n');
const save = async (extra) =>
  fs.writeFile(
    out + '/results.json',
    JSON.stringify(
      {
        definition,
        definitionHash,
        diagnosticOnly: true,
        eligibleForPublication: false,
        completed: rows.length,
        rowsHash: hash(JSON.stringify(rows)),
        rows,
        ...extra,
      },
      null,
      2,
    ) + '\n',
  );
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    const { loadCanvasFonts } = await import('/games/magic/src/presentation/canvas-assets.ts');
    await loadCanvasFonts();
  });
  await session.page.evaluate(async (url) => {
    const font = new FontFace('Study M21 Gotham', `url("${url}")`);
    document.fonts.add(await font.load());
  }, gotham.url);
  for (const e of inputs.entries) {
    const n = native.rows.find((r) => r.id === e.id);
    assert.equal(n.inputHash, hash(JSON.stringify(e.face)));
    assert.equal(n.referenceHash, e.reference.sha256);
    const original = await fs.readFile(nativeDirectory + '/' + n.layers.face.file);
    assert.equal(hash(original), n.layers.face.sha256);
    const cardRects =
      part === 'legal'
        ? [
            [
              277,
              (e.face.power != null && e.face.toughness != null) || e.face.loyalty != null
                ? 646
                : 632,
              181,
              (e.face.power != null && e.face.toughness != null) || e.face.loyalty != null
                ? 20
                : 17,
            ],
          ]
        : rects;
    const s = scores.rows.find((r) => r.id === e.id),
      png = await fs.readFile(scoreDirectory + '/' + s.normalizedReference.file);
    assert.equal(hash(png), s.normalizedReference.sha256);
    assert.equal(s.referenceHash, e.reference.sha256);
    const prior = rows.find((r) => r.id === e.id);
    if (prior) {
      assert.equal(prior.inputHash, n.inputHash);
      assert.equal(prior.poseHash, s.poseHash);
      assert.equal(prior.referenceHash, e.reference.sha256);
      assert.equal(prior.scores.length, variants.length * offsets.length);
      assert(prior.scores.every((v) => Number.isFinite(v) && v >= 0 && v <= 1));
      continue;
    }
    const result = await session.page.evaluate(
      async ({ face, png, original, variants, offsets, rects, part }) => {
        const { paintModernFooter } = await import(
          '/games/magic/src/presentation/modern-footer.ts'
        );
        const canvas = document.createElement('canvas');
        canvas.width = 732;
        canvas.height = 90;
        const c = canvas.getContext('2d', { willReadFrequently: true });
        const scan = document.createElement('canvas');
        scan.width = 488;
        scan.height = 680;
        const sc = scan.getContext('2d', { willReadFrequently: true });
        const image = new Image();
        image.src = 'data:image/png;base64,' + png;
        await image.decode();
        sc.drawImage(image, 0, 0);
        const pixels = sc.getImageData(0, 626, 488, 60).data;
        const points = [];
        for (const [x, y, w, h] of rects)
          for (let cy = y; cy < y + h; cy++)
            for (let cx = x; cx < x + w; cx++) points.push([cx, cy - 626]);
        const bright = (data) => {
          const a = points
            .map(([x, y]) =>
              Math.max(
                data[(y * 488 + x) * 4],
                data[(y * 488 + x) * 4 + 1],
                data[(y * 488 + x) * 4 + 2],
              ),
            )
            .sort((a, b) => a - b);
          return [a[Math.floor(a.length * 0.15)], a[Math.floor(a.length * 0.995)]];
        };
        const [lo, hi] = bright(pixels);
        if (hi - lo < 12) throw Error('Deficient footer signal');
        const target = points.map(([x, y]) =>
            Math.max(
              0,
              Math.min(
                1,
                ((Math.max(
                  pixels[(y * 488 + x) * 4],
                  pixels[(y * 488 + x) * 4 + 1],
                  pixels[(y * 488 + x) * 4 + 2],
                ) -
                  lo) /
                  (hi - lo) -
                  0.2) /
                  0.6,
              ),
            ),
          ),
          targetNorm = target.reduce((a, v) => a + v * v, 0),
          scores = [];
        const { calibratedPrintingStock } = await import(
          '/games/magic/src/presentation/printing-calibration-materials.ts'
        );
        const { cardStock } = await import('/games/magic/src/presentation/face-layout.ts');
        const stock =
          calibratedPrintingStock(face) ?? cardStock(face.setCode, face.borderColor).border;
        const toCanonical = (data) => {
          const out = new Uint8ClampedArray(488 * 60 * 4);
          for (let y = 0; y < 60; y++)
            for (let x = 0; x < 488; x++) {
              const sx = x * 1.5 + 0.25,
                sy = y * 1.5 + 0.25,
                ix = Math.floor(sx),
                iy = Math.floor(sy),
                fx = sx - ix,
                fy = sy - iy;
              for (let k = 0; k < 4; k++) {
                const at = (a, b) => data[(b * 732 + a) * 4 + k];
                out[(y * 488 + x) * 4 + k] = Math.round(
                  (at(ix, iy) * (1 - fx) + at(ix + 1, iy) * fx) * (1 - fy) +
                    (at(ix, iy + 1) * (1 - fx) + at(ix + 1, iy + 1) * fx) * fy,
                );
              }
            }
          return out;
        };
        const paint = (variant, hidden) => {
          globalThis.__m21FooterCandidate = variant;
          c.resetTransform();
          c.fillStyle = stock;
          c.fillRect(0, 0, 732, 90);
          c.scale(1.5, 1.5);
          c.translate(0, -626);
          const named = Object.fromEntries(
            ['collector', 'artist', 'legal'].map((k) => [
              k,
              { ...face.printingElements?.[k], offset: variant[k + 'Offset'] ?? [0, 0] },
            ]),
          );
          for (const k of hidden) named[k] = { hidden: true };
          paintModernFooter(c, { ...face, printingElements: named });
          return c.getImageData(0, 0, 732, 90).data;
        };
        const baseline = paint({}, []),
          controlCanvas = document.createElement('canvas');
        controlCanvas.width = 732;
        controlCanvas.height = 1020;
        const control = controlCanvas.getContext('2d', { willReadFrequently: true }),
          controlImage = new Image();
        controlImage.src = 'data:image/png;base64,' + original;
        await controlImage.decode();
        control.drawImage(controlImage, 0, 0);
        const controlPixels = control.getImageData(0, 939, 732, 90).data;
        let checkedGlyphPixels = 0,
          baselineGlyphPixelMismatches = 0;
        for (const [x, y, w, h] of rects)
          for (let ny = Math.ceil((y - 626) * 1.5); ny < Math.floor((y + h - 626) * 1.5); ny++)
            for (let nx = Math.ceil(x * 1.5); nx < Math.floor((x + w) * 1.5); nx++) {
              const at = (ny * 732 + nx) * 4;
              if (baseline[at] > 128) {
                checkedGlyphPixels++;
                if ([0, 1, 2, 3].some((k) => baseline[at + k] !== controlPixels[at + k]))
                  baselineGlyphPixelMismatches++;
              }
            }
        const shifted = (data, x, y) => {
          if (x < 0 || x >= 487 || y < 0 || y >= 59) return 0;
          const ix = Math.floor(x),
            iy = Math.floor(y),
            fx = x - ix,
            fy = y - iy;
          const at = (x, y) => data[(y * 488 + x) * 4];
          const v =
            (at(ix, iy) * (1 - fx) + at(ix + 1, iy) * fx) * (1 - fy) +
            (at(ix, iy + 1) * (1 - fx) + at(ix + 1, iy + 1) * fx) * fy;
          return Math.max(0, Math.min(1, ((v - 9) / (255 - 9) - 0.2) / 0.6));
        };
        const score = (data, dx, dy) => {
          let dot = 0,
            norm = 0;
          for (let i = 0; i < points.length; i++) {
            const [x, y] = points[i],
              v = shifted(data, x - dx, y - dy);
            dot += v * target[i];
            norm += v * v;
          }
          return (2 * dot) / (norm + targetNorm);
        };
        const hidden =
          part === 'collector' ? ['artist'] : part === 'artist' ? ['collector', 'legal'] : [];
        const currentRendererScore = score(toCanonical(paint({}, hidden)), 0, 0);
        for (const variant of variants) {
          const data = toCanonical(paint(variant, hidden));
          for (const [dx, dy] of offsets) scores.push(score(data, dx, dy));
        }
        delete globalThis.__m21FooterCandidate;
        return {
          scores,
          currentRendererScore,
          targetInk: targetNorm,
          checkedGlyphPixels,
          baselineGlyphPixelMismatches,
        };
      },
      {
        face: e.face,
        png: png.toString('base64'),
        original: original.toString('base64'),
        variants,
        offsets,
        rects: cardRects,
        part,
      },
    );
    rows.push({
      id: e.id,
      name: e.card.name,
      referenceHash: e.reference.sha256,
      inputHash: hash(JSON.stringify(e.face)),
      poseHash: s.poseHash,
      nonfoil: s.nonfoilEligible,
      poseAccepted: s.poseAccepted,
      geometry: s.geometry,
      rects: cardRects,
      ...result,
    });
    if (rows.length % 25 === 0) {
      await save({ status: 'running' });
      console.log(part, rows.length, '/', inputs.entries.length);
    }
  }
  assert.deepEqual(session.faults, []);
  assert.equal(
    hash(injection.sourceText),
    hash(await fs.readFile(root + '/games/magic/src/presentation/modern-footer.ts')),
  );
  const ordinary = rows.filter(
    (r) => r.nonfoil && r.poseAccepted && !r.geometry.startsWith('planeswalker'),
  );
  assert(ordinary.length, 'No accepted ordinary nonfoil poses for shared parameter selection');
  const ranks = variants
    .flatMap((variant, v) =>
      offsets.map((offset, o) => ({
        variant,
        offset,
        index: v * offsets.length + o,
        ordinaryMean:
          ordinary.reduce((n, r) => n + r.scores[v * offsets.length + o], 0) / ordinary.length,
      })),
    )
    .sort((a, b) => b.ordinaryMean - a.ordinaryMean);
  const selected = ranks[0],
    proposal = { ...selected.variant, [part + 'Offset']: selected.offset };
  await save({
    status: 'regional-proposal-only',
    ordinary: ordinary.length,
    rank: ranks.slice(0, 20),
  });
  assert(
    rows.every((r) => r.checkedGlyphPixels > 0 && r.baselineGlyphPixelMismatches === 0),
    'Native baseline parity failed; retain the report but do not adopt candidates',
  );
  console.log(
    'Baseline native glyph parity',
    rows.reduce((n, r) => n + r.baselineGlyphPixelMismatches, 0),
    '/',
    rows.reduce((n, r) => n + r.checkedGlyphPixels, 0),
  );
  await fs.writeFile(out + '/proposal.json', JSON.stringify(proposal, null, 2) + '\n');
  console.log(JSON.stringify({ part, ordinary: ordinary.length, selected, proposal }));
} finally {
  await session.close();
}
