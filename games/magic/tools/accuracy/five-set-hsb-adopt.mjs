import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { PNG } from 'pngjs';
import {
  root,
  outputRoot,
  fixtureRoot,
  readJson,
  writeJson,
  atomicWrite,
  hash,
} from './common.mjs';
import { cachedFetch } from './cache.mjs';
import { openBrowser } from './browser.mjs';
import { normalize } from './pixels-pure.mjs';
import { sampleColor, delta, median } from './hsb-color.mjs';

const directory = outputRoot + '/five-set-hsb',
  report = await readJson(fixtureRoot + '/five-set-hsb-results.json'),
  selection = await readJson(directory + '/selection.json'),
  server = await createServer({
    configFile: false,
    root,
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, hmr: false },
  });
const { calibratedDualFrameProfile } = await server.ssrLoadModule(
  '/games/magic/src/presentation/calibration-profiles.ts',
);
const { canvasAssetUrls } = await server.ssrLoadModule(
  '/games/magic/src/presentation/canvas-assets.ts',
);
const identity = { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 };
const browser = await openBrowser({ entries: [], components: [] }, { fonts: false });
const profiles = {},
  results = [];
try {
  for (const g of report.groups) {
    if (g.flags.some((f) => !f.startsWith('frame-') && !f.startsWith('paper-'))) {
      results.push({ key: g.key, status: 'review-only', flags: g.flags });
      continue;
    }
    const saved = selection.groups.find((s) => s.key === g.key),
      face = {
        ...saved.face,
        name: '',
        rulesText: '',
        rulesParagraphs: [],
        manaSymbols: [],
        artist: '',
        illustration: null,
        power: undefined,
        toughness: undefined,
        collectorNumber: '',
        colorCalibration: undefined,
      },
      previous = calibratedDualFrameProfile({ ...face, colorCalibration: 'set-hsb-v1' }),
      accepted = Object.fromEntries(
        ['frame', 'paper'].map((c) => [c, !g.flags.some((f) => f.startsWith(c + '-'))]),
      );
    if (!accepted.frame && !accepted.paper) {
      results.push({ key: g.key, status: 'review-only', flags: g.flags });
      continue;
    }
    // Each material is independently gated. Rejected paper keeps its approved
    // correction (or identity), even when the frame passes, and vice versa.
    const adjustment = Object.fromEntries(
      ['frame', 'paper'].map((c) => [
        c,
        accepted[c] ? g.adjustments[c] : (previous?.[c] ?? identity),
      ]),
    );
    const materials = { [g.source.frame]: { ...adjustment, mask: g.mask } };
    if (g.source.assets.pt) materials[g.source.assets.pt] = adjustment.paper;
    if (g.source.family === 'components') {
      materials[g.source.assets.background] = adjustment.frame;
      materials[g.source.assets.boxes] = adjustment.paper;
      materials[g.source.assets.crown] = adjustment.frame;
    }
    const assets = await Promise.all(
      canvasAssetUrls(face)
        .filter(Boolean)
        .map((url) => cachedFetch(url)),
    );
    browser.addAssets(assets);
    const png = await browser.page.evaluate(
      async ({ face, materials }) => {
        const { loadCanvasImages, canvasAssetUrls } = await import(
          '/games/magic/src/presentation/canvas-assets.ts'
        );
        const { colorFrame } = await import('/games/magic/src/presentation/frame-hsb.ts');
        const { paintAssembledFace } = await import('/games/magic/src/presentation/canvas-face.ts');
        const loaded = await loadCanvasImages(canvasAssetUrls(face), new AbortController().signal),
          images = new Map(loaded.images),
          owned = [];
        const canvas = document.createElement('canvas');
        try {
          for (const [url, adjustment] of Object.entries(materials)) {
            const source = images.get(url);
            if (!source) continue;
            canvas.width = source.width;
            canvas.height = source.height;
            const c = canvas.getContext('2d', { willReadFrequently: true });
            c.drawImage(source, 0, 0);
            const pixels = c.getImageData(0, 0, canvas.width, canvas.height);
            colorFrame(pixels, adjustment);
            c.putImageData(pixels, 0, 0);
            const bitmap = await createImageBitmap(canvas);
            owned.push(bitmap);
            images.set(url, bitmap);
          }
          canvas.width = 732;
          canvas.height = 1020;
          const c = canvas.getContext('2d');
          c.scale(1.5, 1.5);
          paintAssembledFace(c, face, images, 680, false);
          return canvas.toDataURL();
        } finally {
          owned.forEach((b) => b.close());
          loaded.dispose();
          canvas.width = canvas.height = 0;
        }
      },
      { face, materials },
    );
    const bytes = Buffer.from(png.split(',')[1], 'base64'),
      image = normalize(PNG.sync.read(bytes));
    await atomicWrite(directory + '/' + g.key.replaceAll('/', '-') + '-candidate.png', bytes);
    const flags = [],
      measurements = {};
    for (const c of ['frame', 'paper']) {
      const color = sampleColor(image, g.patches[c], { paper: c === 'paper', tileSize: 16 });
      const rows = g.rows
        .filter((r) => r.cohort === 'validation')
        .map((r) => ({
          id: r.id,
          before: r.components[c].before,
          after: delta(color.rgb, r.components[c].referenceRgb),
        }));
      measurements[c] = {
        before: median(rows.map((r) => r.before)),
        after: median(rows.map((r) => r.after)),
        worstRegression: Math.max(...rows.map((r) => r.after - r.before)),
        rows,
      };
      if (
        accepted[c] &&
        (measurements[c].after > measurements[c].before + 0.15 ||
          measurements[c].worstRegression > 2)
      )
        flags.push(c + '-raster-regression');
      if (
        accepted[c] &&
        g.validation[c].previous != null &&
        measurements[c].after > g.validation[c].previous + 0.25
      )
        flags.push(c + '-raster-previous-regression');
      if (accepted[c] && Math.abs(measurements[c].after - g.validation[c].after) > 0.5)
        flags.push(c + '-raster-fit-mismatch');
    }
    if (!flags.length) profiles[g.key] = { source: g.source.source, materials };
    results.push({
      key: g.key,
      status: flags.length
        ? 'review-only'
        : accepted.frame && accepted.paper
          ? 'admitted'
          : 'partial',
      accepted,
      retained: g.flags,
      flags,
      adjustments: adjustment,
      mask: g.mask,
      rasterHash: hash(bytes),
      assets: assets.map((a) => ({ url: a.url, sha256: a.sha256 })),
      measurements,
    });
    console.log(g.key, results.at(-1).status, flags.join(','));
  }
  assert.deepEqual(browser.faults, []);
} finally {
  await browser.close();
  await server.close();
}
await writeJson(fixtureRoot + '/five-set-hsb-adoption.json', {
  version: 1,
  fitHash: hash(JSON.stringify(report)),
  policy:
    'Independent frame/paper admission with approved-or-identity fallback; candidate asset pixels recolored, resampled and composited before identical held-out gates. No fit to validation cards.',
  results,
});
await atomicWrite(
  root + '/games/magic/src/presentation/printing-color-profiles.ts',
  `import type { FrameHsb } from './frame-hsb.js';\nexport interface PrintingColorProfile { source: string; materials: Readonly<Record<string, FrameHsb>>; }\n/** Generated by five-set-hsb-adopt.mjs; source and geometry guarded. */\nexport const PRINTING_COLOR_PROFILES: Readonly<Record<string, PrintingColorProfile>> = ${JSON.stringify(profiles, null, 2)};\n`,
);
console.log('Adopted', Object.keys(profiles).length, 'shared material profiles.');
