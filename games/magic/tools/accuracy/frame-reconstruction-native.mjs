// Native full-card verification for local frame reconstruction; no shipped overrides.
import assert from 'node:assert/strict';
import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, readJson, writeJson } from './common.mjs';
import { openBrowser } from './browser.mjs';

const [directory, inputsFile, componentsFile, label = 'train'] = process.argv.slice(2);
if (!componentsFile)
  throw Error('Usage: frame-reconstruction-native.mjs OUT INPUTS COMPONENTS [train|all]');
const obs = await readJson(path.join(directory, 'observations.json'));
const inputs = await readJson(inputsFile),
  components = await readJson(componentsFile);
const ids = new Set(obs.records.map((r) => r.id));
const entries = inputs.entries.filter((e) => ids.has(e.id));
const geometry = await readJson(path.join(directory, 'geometry.json'));
const adjustment = await readJson(path.join(directory, `${label}-adjustment.json`));
const sourceFiles = [
  'inputs/sharpened-frames/alpha-white-frame.png',
  `${label}-reconstructed-source.png`,
];
const sourceData = await Promise.all(
  sourceFiles.map(
    async (file) =>
      'data:image/png;base64,' + (await readFile(path.join(directory, file))).toString('base64'),
  ),
);
const session = await openBrowser({ entries, components });
const output = path.join(directory, `${label}-native`);
await mkdir(output, { recursive: true });
try {
  await session.page.evaluate(
    async ({ geometry, adjustment, sourceData }) => {
      await import('/games/magic/src/data/eager.ts');
      await import('/games/magic/src/data/eager-wording.ts');
      const { colorFrame } = await import('/games/magic/src/presentation/frame-hsb.ts');
      const candidates = [];
      const materials = [];
      const inverse = (knots, value) => {
        let i = 1;
        while (i < knots.length - 1 && knots[i][1] < value) i++;
        const [a, b] = [knots[i - 1], knots[i]];
        return a[0] + ((value - a[1]) * (b[0] - a[0])) / (b[1] - a[1]);
      };
      for (const url of sourceData) {
        const image = await createImageBitmap(await (await fetch(url)).blob());
        const c = document.createElement('canvas');
        c.width = image.width;
        c.height = image.height;
        const ctx = c.getContext('2d');
        ctx.drawImage(image, 0, 0);
        image.close();
        const data = ctx.getImageData(0, 0, c.width, c.height);
        colorFrame(data, adjustment);
        ctx.putImageData(data, 0, 0);
        materials.push(c.toDataURL());
        const result = ctx.createImageData(c.width, c.height);
        for (let y = 0; y < c.height; y++)
          for (let x = 0; x < c.width; x++) {
            const sx = Math.max(
              0,
              Math.min(
                c.width - 1,
                ((inverse(geometry.knots.x, ((x + 0.5) * 488) / c.width - 0.5) + 0.5) * c.width) /
                  488 -
                  0.5,
              ),
            );
            const sy = Math.max(
              0,
              Math.min(
                c.height - 1,
                ((inverse(geometry.knots.y, ((y + 0.5) * 680) / c.height - 0.5) + 0.5) * c.height) /
                  680 -
                  0.5,
              ),
            );
            const x0 = Math.floor(sx),
              y0 = Math.floor(sy),
              x1 = Math.min(x0 + 1, c.width - 1),
              y1 = Math.min(y0 + 1, c.height - 1),
              fx = sx - x0,
              fy = sy - y0;
            // Premultiplied sampling is required at the transparent art aperture.
            const positions = [
              (y0 * c.width + x0) * 4,
              (y0 * c.width + x1) * 4,
              (y1 * c.width + x0) * 4,
              (y1 * c.width + x1) * 4,
            ];
            const weights = [(1 - fx) * (1 - fy), fx * (1 - fy), (1 - fx) * fy, fx * fy];
            const a = positions.reduce((v, p, i) => v + data.data[p + 3] * weights[i], 0),
              p = (y * c.width + x) * 4;
            result.data[p + 3] = Math.round(a);
            for (let k = 0; k < 3; k++)
              result.data[p + k] = a
                ? Math.round(
                    positions.reduce(
                      (v, p, i) => v + data.data[p + k] * data.data[p + 3] * weights[i],
                      0,
                    ) / a,
                  )
                : 0;
          }
        ctx.putImageData(result, 0, 0);
        candidates.push(await createImageBitmap(c));
        c.width = c.height = 0;
      }
      window.frameExperiment = { candidates, materials };
      window.renderExperiment = async (face, index) => {
        const { composeCardTexture, paintAssembledFace } = await import(
          '/games/magic/src/presentation/canvas-face.ts'
        );
        // Warm the exact font/material paths used by the public composer.
        const warm = await composeCardTexture(
          { face, printingId: null, printedImage: null },
          'inspect',
          new AbortController().signal,
        );
        const { canvasAssetUrls, loadCanvasImages } = await import(
          '/games/magic/src/presentation/canvas-assets.ts'
        );
        const { prepareEarlyHsb } = await import(
          '/games/magic/src/presentation/early-hsb-material.ts'
        );
        const { prepareRetroDualFrame } = await import(
          '/games/magic/src/presentation/retro-dual-material.ts'
        );
        const { prepareManaNumerals } = await import(
          '/games/magic/src/presentation/mana-numeral.ts'
        );
        const { retroFrameAsset } = await import('/games/magic/src/presentation/retro-frame.ts');
        const { faceCornerRadius } = await import(
          '/games/magic/src/presentation/face-silhouette.ts'
        );
        const { withRulesInk } = await import('/games/magic/src/presentation/rules-visibility.ts');
        const { withPrintingOmissions } = await import(
          '/games/magic/src/presentation/printing-omissions.ts'
        );
        const signal = new AbortController().signal,
          loaded = await loadCanvasImages(canvasAssetUrls(face), signal);
        let calibrated, dual, numerals;
        try {
          calibrated = await prepareEarlyHsb(face, loaded.images, signal);
          dual = await prepareRetroDualFrame(face, calibrated.images, signal);
          numerals = await prepareManaNumerals(face, dual.images, signal);
          const images = Object.assign(new Map(numerals.images), numerals.images);
          if (index >= 0)
            images.set(retroFrameAsset(face), window.frameExperiment.candidates[index]);
          const c = document.createElement('canvas');
          c.width = warm.width;
          c.height = warm.height;
          const ctx = c.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.scale(c.width / 488, c.height / 680);
          ctx.fillStyle = '#090806';
          ctx.fillRect(0, 0, 488, 680);
          withRulesInk(ctx, true, () =>
            withPrintingOmissions(ctx, face, () =>
              paintAssembledFace(ctx, face, images, 680, false),
            ),
          );
          ctx.save();
          ctx.setTransform(c.width / 488, 0, 0, c.height / 680, 0, 0);
          ctx.globalCompositeOperation = 'destination-in';
          ctx.globalAlpha = 1;
          ctx.shadowColor = 'transparent';
          ctx.filter = 'none';
          ctx.fillStyle = '#000';
          ctx.beginPath();
          ctx.roundRect(0, 0, 488, 680, faceCornerRadius(face) * 488);
          ctx.fill();
          ctx.restore();
          const result = c.toDataURL();
          c.width = c.height = 0;
          return result;
        } finally {
          numerals?.dispose();
          dual?.dispose();
          calibrated?.dispose();
          loaded.dispose();
          warm.width = warm.height = 0;
        }
      };
    },
    { geometry, adjustment, sourceData },
  );
  const materials = await session.page.evaluate(() => window.frameExperiment.materials);
  for (let i = 0; i < materials.length; i++)
    await writeFile(
      path.join(output, `material-${i}.png`),
      Buffer.from(materials[i].split(',')[1], 'base64'),
    );
  const receipts = [];
  for (const [n, row] of obs.records.entries()) {
    const outputs = await session.page.evaluate(
      async (face) => Promise.all([-1, 0, 1].map((i) => window.renderExperiment(face, i))),
      row.face,
    );
    const baseline = PNG.sync.read(await readFile(path.join(directory, row.baseline.file)));
    const replay = PNG.sync.read(Buffer.from(outputs[0].split(',')[1], 'base64'));
    assert.deepEqual(
      replay.data,
      baseline.data,
      `Native experiment pipeline changed released pixels: ${row.name}`,
    );
    for (let i = 0; i < 2; i++) {
      const bytes = Buffer.from(outputs[i + 1].split(',')[1], 'base64');
      await writeFile(path.join(output, `${row.id}-${i}.png`), bytes);
      receipts.push({ id: row.id, variant: i, sha256: hash(bytes) });
    }
    assert.deepEqual(session.faults, []);
    if (n % 10 === 0) console.log(`${n + 1}/${obs.records.length} ${row.name}`);
  }
  await writeJson(path.join(output, 'receipt.json'), {
    label,
    nativeBaselineParity: obs.records.length,
    receipts,
    geometryHash: hash(JSON.stringify(geometry)),
    adjustmentHash: hash(JSON.stringify(adjustment)),
  });
} finally {
  await session.close();
}
