import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { PNG } from 'pngjs';
import {
  cacheRoot,
  outputRoot,
  fixtureRoot,
  root,
  readJson,
  writeJson,
  hash,
  atomicWrite,
  sourceHash,
} from './common.mjs';
import { openBrowser } from './browser.mjs';
import { normalize, cropGray } from './pixels.mjs';
import { compareRegion, median } from './metrics.mjs';
import { measureScanFrame, scanTranslation } from './scan-translation.mjs';

const [set, action = 'compare'] = process.argv.slice(2);
assert.ok(['war', 'm15'].includes(set));
assert.ok(['capture', 'compare'].includes(action));
const baselineDirectory = `${outputRoot}/${set}/symbol-topology-all-after`,
  baselineBytes = await readFile(`${baselineDirectory}/capture.json`),
  baseline = JSON.parse(baselineBytes),
  symbolPlan = await readJson(`${fixtureRoot}/set-symbol-topology-plan.json`),
  directory = `${outputRoot}/${set}/normal-title`,
  development =
    set === 'war' ? ['79', '81', '86', '4', '40', '76', '113', '149', '185', '237'] : [],
  ids = new Set(symbolPlan.sets[set].reserved.map((r) => r.id)),
  cards = baseline.results.filter((r) => development.includes(r.collectorNumber) || ids.has(r.id));
assert.ok(cards.every((r) => r.frame === 'normal' && !r.issue));
await mkdir(directory, { recursive: true });

if (action === 'capture') {
  const rendererHash = await sourceHash(`${root}/games/magic/src`),
    rows = [];
  const session = await openBrowser(await readJson(`${cacheRoot}/sets/${set}.json`));
  try {
    for (const card of cards) {
      const variants = await session.page.evaluate(async (face) => {
        const api = await import('/games/magic/src/presentation/canvas-face.ts'),
          { FACE_TEXT } = await import('/games/magic/src/presentation/face-layout.ts'),
          { loadCanvasImages, canvasAssetUrls } = await import(
            '/games/magic/src/presentation/canvas-assets.ts'
          );
        const prepared = await loadCanvasImages(
            canvasAssetUrls(face),
            new AbortController().signal,
          ),
          out = [];
        try {
          for (const size of [24, 26]) {
            // Only this isolated capture page mutates the module's policy.
            FACE_TEXT.normalTitleFont = size;
            for (const tier of ['inspect', 'table']) {
              const canvas = await api.composeCardTexture(
                { face, printingId: null, printedImage: null },
                tier,
                new AbortController().signal,
                { loadImages: async () => ({ images: prepared.images, dispose() {} }) },
              );
              out.push({ size, tier, data: canvas.toDataURL('image/png') });
              canvas.width = canvas.height = 0;
            }
          }
        } finally {
          prepared.dispose();
        }
        return out;
      }, card.face);
      for (const variant of variants) {
        const bytes = Buffer.from(variant.data.split(',')[1], 'base64'),
          file = `${card.id}.${variant.size}.${variant.tier}.png`;
        if (variant.size === 24)
          assert.equal(hash(bytes), card.images[variant.tier].sha256, 'Baseline painter parity');
        await atomicWrite(`${directory}/${file}`, bytes);
        rows.push({
          id: card.id,
          size: variant.size,
          tier: variant.tier,
          file,
          sha256: hash(bytes),
        });
      }
      console.log(`${set}: title capture ${card.collectorNumber} ${card.name}`);
    }
    assert.deepEqual(session.faults, []);
    assert.equal(await sourceHash(`${root}/games/magic/src`), rendererHash);
    await writeJson(`${directory}/capture.json`, {
      rendererHash,
      baselineHash: hash(baselineBytes),
      rows,
    });
  } finally {
    await session.close();
  }
}

const captureBytes = await readFile(`${directory}/capture.json`),
  capture = JSON.parse(captureBytes),
  profile = await readJson(`${fixtureRoot}/scan-normalization-${set}-profile.json`);
assert.equal(capture.baselineHash, hash(baselineBytes));
const rows = [];
for (const card of cards) {
  const refBytes = await readFile(`${baselineDirectory}/${card.images.reference.file}`);
  assert.equal(hash(refBytes), card.images.reference.sha256);
  const source = PNG.sync.read(refBytes),
    raw = normalize(source),
    registration = /Legendary/.test(card.face.typeLine)
      ? null
      : scanTranslation(measureScanFrame(raw), profile.template),
    aligned = registration ? normalize(source, registration.transform) : raw,
    count = card.face.manaSymbols.length,
    // Frozen v53 title geometry; exclude all mana and preserve the complete
    // width available to name fitting, including unusually long card names.
    manaWidth = count * (0.03556 * 1.35 * 488) + Math.max(0, count - 1) * (0.00378 * 488),
    right = Math.floor(
      (0.05669 + 0.88662 - 0.01575) * 488 - manaWidth - (count ? 0.02362 * 488 : 0),
    ),
    rect = [38, 33, right - 38, 32],
    scores = {};
  assert.ok(rect[2] > 0);
  for (const tier of ['inspect', 'table']) {
    const native = [],
      bySize = {};
    for (const size of [24, 26]) {
      const asset = capture.rows.find(
        (r) => r.id === card.id && r.size === size && r.tier === tier,
      );
      assert.ok(asset);
      const bytes = await readFile(`${directory}/${asset.file}`);
      assert.equal(hash(bytes), asset.sha256);
      const png = PNG.sync.read(bytes);
      native.push(png);
      const b = cropGray(normalize(png), rect);
      bySize[size] = Object.fromEntries(
        [
          ['raw', raw],
          ['normalized', aligned],
        ].map(([mode, image]) => {
          const a = cropGray(image, rect),
            m = compareRegion(a.gray, b.gray, a.width, a.height);
          return [
            mode,
            {
              edgeF1: m.edgeF1?.[1] ?? null,
              meanDistance: m.meanDistance,
              censusSimilarity: m.censusSimilarity,
            },
          ];
        }),
      );
    }
    assert.equal(native[0].width, native[1].width);
    assert.equal(native[0].height, native[1].height);
    for (let y = 0; y < native[0].height; y++)
      for (let x = 0; x < native[0].width; x++) {
        const cx = (x * 488) / native[0].width,
          cy = (y * 680) / native[0].height;
        if (cx >= 37 && cx <= 453 && cy >= 30 && cy <= 68) continue;
        const i = (y * native[0].width + x) * 4;
        for (let c = 0; c < 4; c++)
          assert.equal(native[0].data[i + c], native[1].data[i + c], 'Pixel changed outside title');
      }
    scores[tier] = { before: bySize[24], after: bySize[26], unchangedOutsideTitle: true };
  }
  rows.push({
    id: card.id,
    number: card.collectorNumber,
    name: card.name,
    cohort: development.includes(card.collectorNumber) ? 'development' : 'validation',
    referenceHash: card.images.reference.sha256,
    rect,
    registration,
    scores,
  });
}
const summary = {};
for (const cohort of ['development', 'validation']) {
  const selected = rows.filter((r) => r.cohort === cohort);
  if (!selected.length) continue;
  summary[cohort] = { cards: selected.length };
  for (const tier of ['inspect', 'table'])
    for (const mode of ['raw', 'normalized']) {
      const deltas = selected.map(
        (r) => r.scores[tier].after[mode].edgeF1 - r.scores[tier].before[mode].edgeF1,
      );
      summary[cohort][`${tier}-${mode}`] = {
        before: median(selected.map((r) => r.scores[tier].before[mode].edgeF1)),
        after: median(selected.map((r) => r.scores[tier].after[mode].edgeF1)),
        gains: deltas.filter((d) => d > 0.02).length,
        regressions: deltas.filter((d) => d < -0.02).length,
      };
    }
}
await writeJson(`${fixtureRoot}/normal-title-${set}-measurement.json`, {
  schemaVersion: 1,
  baselineHash: hash(baselineBytes),
  captureHash: hash(captureBytes),
  rendererHash: capture.rendererHash,
  studyHash: hash(await readFile(new URL(import.meta.url))),
  methods: Object.fromEntries(
    await Promise.all(
      ['scan-translation', 'pixels', 'edges', 'metrics'].map(async (name) => [
        name,
        hash(await readFile(new URL(`./${name}.mjs`, import.meta.url))),
      ]),
    ),
  ),
  profileHash: hash(JSON.stringify(profile)),
  scope:
    'Normal-frame title size 24→26, identical fonts/tracking/placement and body. Complete available title space excludes mana. Raw and frozen-frame-normalized scores at both tiers; all native pixels outside title unchanged. Symbol-study validation cohorts are additional typography checks, not unseen scans.',
  summary,
  rows,
});
console.log(JSON.stringify(summary));
