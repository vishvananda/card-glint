// Native full-card verification for local frame reconstruction; no shipped overrides.
import assert from 'node:assert/strict';
import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, readJson, writeJson } from './common.mjs';
import { openBrowser } from './browser.mjs';

const platesOnly = process.argv.includes('--plates-only');
const [directory, inputsFile, componentsFile, label = 'train', candidateFile] = process.argv
  .slice(2)
  .filter((argument) => argument !== '--plates-only');
if (!componentsFile)
  throw Error('Usage: frame-reconstruction-native.mjs OUT INPUTS COMPONENTS [train|all]');
const obs = await readJson(path.join(directory, 'observations.json'));
const inputs = await readJson(inputsFile),
  components = await readJson(componentsFile);
const ids = new Set(obs.records.map((r) => r.id));
const entries = inputs.entries.filter((e) => ids.has(e.id));
const geometry = await readJson(path.join(directory, 'geometry.json'));
const manifest = candidateFile ? await readJson(candidateFile) : null;
for (const candidate of manifest?.candidates ?? []) {
  const radius = candidate.cornerRadius;
  assert(
    radius === undefined ||
      (typeof radius === 'number' && Number.isFinite(radius) && radius > 0 && radius < 0.25),
    'Candidate cornerRadius must be a finite fraction of card width between 0 and 0.25',
  );
}
const adjustment = manifest
  ? null
  : await readJson(path.join(directory, `${label}-adjustment.json`));
const sourceFiles = manifest
  ? manifest.candidates.map((candidate) => candidate.file)
  : ['inputs/sharpened-frames/alpha-white-frame.png', `${label}-reconstructed-source.png`];
assert(sourceFiles.length > 0);
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
    async ({ geometry, adjustment, sourceData, precomposed, cornerRadii, textModels }) => {
      await import('/games/magic/src/data/eager.ts');
      await import('/games/magic/src/data/eager-wording.ts');
      const { colorFrame } = await import('/games/magic/src/presentation/frame-hsb.ts');
      const candidates = [];
      const materials = [];
      const plates = [];
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
        if (precomposed) {
          materials.push(c.toDataURL());
          plates.push(c.toDataURL());
          candidates.push(await createImageBitmap(c));
          c.width = c.height = 0;
          continue;
        }
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
        plates.push(c.toDataURL());
        candidates.push(await createImageBitmap(c));
        c.width = c.height = 0;
      }
      window.frameExperiment = { candidates, materials, plates, textReplays: [] };
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
          const { prepareTextReplay } = await import(
            '/games/magic/tools/accuracy/frame-reconstruction-text-browser.mjs'
          );
          const textReplay =
            index >= 0 ? await prepareTextReplay(ctx, face, textModels[index]) : null;
          if (textReplay)
            window.frameExperiment.textReplays.push({
              name: face.name,
              index,
              ...textReplay.summary,
            });
          withRulesInk(ctx, !textReplay?.paint, () =>
            withPrintingOmissions(ctx, face, () =>
              paintAssembledFace(ctx, face, images, 680, false),
            ),
          );
          textReplay?.paint?.(images);
          const artOverlay = window.frameExperiment.artOverlays?.[index];
          if (index >= 0 && artOverlay) {
            ctx.save();
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = 'source-over';
            ctx.filter = 'none';
            ctx.shadowColor = 'transparent';
            ctx.drawImage(artOverlay, 0, 0, 488, 680);
            ctx.restore();
          }
          ctx.save();
          ctx.setTransform(c.width / 488, 0, 0, c.height / 680, 0, 0);
          ctx.globalCompositeOperation = 'destination-in';
          ctx.globalAlpha = 1;
          ctx.shadowColor = 'transparent';
          ctx.filter = 'none';
          ctx.fillStyle = '#000';
          ctx.beginPath();
          const radius =
            index >= 0 ? (cornerRadii[index] ?? faceCornerRadius(face)) : faceCornerRadius(face);
          ctx.roundRect(0, 0, 488, 680, radius * 488);
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
    {
      geometry,
      adjustment,
      sourceData,
      precomposed: Boolean(manifest),
      cornerRadii: manifest?.candidates.map((candidate) => candidate.cornerRadius ?? null) ?? [],
      textModels: manifest?.candidates.map((candidate) => candidate.textModel ?? null) ?? [],
    },
  );
  const materials = await session.page.evaluate(() => window.frameExperiment.materials);
  const plates = await session.page.evaluate(() => window.frameExperiment.plates);
  for (let i = 0; i < materials.length; i++)
    await writeFile(
      path.join(output, `material-${i}.png`),
      Buffer.from(materials[i].split(',')[1], 'base64'),
    );
  for (let i = 0; i < plates.length; i++)
    await writeFile(
      path.join(output, `render-plate-${i}.png`),
      Buffer.from(plates[i].split(',')[1], 'base64'),
    );
  const receipts = [];
  for (const [n, row] of (platesOnly ? [] : obs.records).entries()) {
    const artData = await Promise.all(
      (manifest?.candidates ?? sourceFiles.map(() => ({}))).map(async (candidate) =>
        candidate.artSource
          ? 'data:image/png;base64,' +
            (
              await readFile(path.join(directory, candidate.artSource.replace('{id}', row.id)))
            ).toString('base64')
          : null,
      ),
    );
    const outputs = await session.page.evaluate(
      async ({ face, artData }) => {
        const artOverlays = await Promise.all(
          artData.map(async (url) =>
            url ? createImageBitmap(await (await fetch(url)).blob()) : null,
          ),
        );
        window.frameExperiment.artOverlays = artOverlays;
        try {
          return await Promise.all(
            [-1, ...window.frameExperiment.candidates.keys()].map((i) =>
              window.renderExperiment(face, i),
            ),
          );
        } finally {
          for (const overlay of artOverlays) overlay?.close();
          window.frameExperiment.artOverlays = null;
        }
      },
      { face: row.face, artData },
    );
    const baseline = PNG.sync.read(await readFile(path.join(directory, row.baseline.file)));
    const replay = PNG.sync.read(Buffer.from(outputs[0].split(',')[1], 'base64'));
    assert.deepEqual(
      replay.data,
      baseline.data,
      `Native experiment pipeline changed released pixels: ${row.name}`,
    );
    for (let i = 0; i < sourceFiles.length; i++) {
      const bytes = Buffer.from(outputs[i + 1].split(',')[1], 'base64');
      await writeFile(path.join(output, `${row.id}-${i}.png`), bytes);
      receipts.push({ id: row.id, variant: i, sha256: hash(bytes) });
    }
    assert.deepEqual(session.faults, []);
    if (n % 10 === 0) console.log(`${n + 1}/${obs.records.length} ${row.name}`);
  }
  if (!platesOnly)
    await writeJson(path.join(output, 'receipt.json'), {
      label,
      nativeBaselineParity: obs.records.length,
      receipts,
      textReplays: await session.page.evaluate(() => window.frameExperiment.textReplays),
      geometryHash: hash(JSON.stringify(geometry)),
      adjustmentHash: hash(JSON.stringify(adjustment)),
      ...(manifest ? { candidates: manifest.candidates } : {}),
    });
} finally {
  await session.close();
}
