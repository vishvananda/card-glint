import { readFile, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createServer } from 'vite';
import { PNG } from 'pngjs';
import { root, outputRoot, writeJson, atomicWrite, sourceHash, hash, mapLimit } from './common.mjs';
import { cachedFetch, readObject } from './cache.mjs';
import { openBrowser } from './browser.mjs';
import { normalize, savePng } from './pixels.mjs';
import { prepareRegistration } from './prepare-registration.mjs';
import { sagaTextMetric } from './saga-text-metrics.mjs';

const baselineLabel = 'prepare-v0219-input-v2';
const baselineBytes = await readFile(`${outputRoot}/${baselineLabel}/audit.json`);
const baseline = JSON.parse(baselineBytes);
const label = process.argv[2] ?? 'prepare-native-v1';
const selectedNumbers = process.argv
  .find((a) => a.startsWith('--numbers='))
  ?.slice(10)
  .split(',');
const entries = baseline.results.filter(
  (r) => !selectedNumbers || selectedNumbers.includes(r.face.collectorNumber),
);
if (!entries.length) throw Error('Empty Prepared cohort.');
const inputChanges = [];
const output = `${outputRoot}/${label}`;
try {
  await access(`${output}/audit.json`);
  throw Error('Capture exists; choose a new label.');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const rendererHash = await sourceHash(`${root}/games/magic/src`);
const studyHash = await sourceHash(`${root}/games/magic/tools/accuracy`);
const resolver = await createServer({ configFile: false, root, server: { middlewareMode: true } });
const { canvasAssetUrls } = await resolver.ssrLoadModule(
  '/games/magic/src/presentation/canvas-assets.ts',
);
const css = await readFile(`${root}/games/magic/fonts.css`, 'utf8');
const urls = [
  ...new Set([
    ...[...css.matchAll(/url\('([^']+)'\)/g)].map((m) => m[1]),
    ...entries.flatMap((e) => canvasAssetUrls(e.face).filter((u) => u?.startsWith('https://'))),
  ]),
];
await resolver.close();
const components = await mapLimit(urls, 3, (url) => cachedFetch(url));
const session = await openBrowser({ entries, components });
const results = [];
const regions = {
  permanent: [39, 428, 203, 199],
  spell: [250, 497, 204, 108],
  spellHeader: [250, 432, 205, 60],
};
const withoutStats = (image, face) => {
  if (face.power == null || face.toughness == null) return image;
  const data = new Uint8Array(image.data);
  for (let y = 599; y < 653; y++)
    for (let x = 366; x < 464; x++) data.set([255, 255, 255, 255], (y * 488 + x) * 4);
  return { width: image.width, height: image.height, data };
};
try {
  for (const entry of entries) {
    const capture = await session.page.evaluate(async (face) => {
      const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
      const { canvasAssetUrls, loadCanvasImages } = await import(
        '/games/magic/src/presentation/canvas-assets.ts'
      );
      const { paintPrepareFrame } = await import('/games/magic/src/presentation/prepare-paint.ts');
      const { prepareRuleLayouts } = await import('/games/magic/src/presentation/prepare-rules.ts');
      const { faceFrame, faceRects } = await import(
        '/games/magic/src/presentation/special-frames.ts'
      );
      const full = await composeCardTexture(
        { face, printingId: null, printedImage: null },
        'inspect',
        new AbortController().signal,
      );
      const small = document.createElement('canvas');
      small.width = 488;
      small.height = 680;
      const c = small.getContext('2d');
      c.drawImage(full, 0, 0, 488, 680);
      const render = small.toDataURL(),
        rules = prepareRuleLayouts(c, face);
      const assets = await loadCanvasImages(canvasAssetUrls(face), new AbortController().signal);
      try {
        c.clearRect(0, 0, 488, 680);
        paintPrepareFrame(c, face, assets.images);
      } finally {
        assets.dispose();
      }
      const template = small.toDataURL();
      // Material tone must not change the frame anchor being measured. Keep
      // a separate uncalibrated frame target; paper diagnostics use template.
      const anchorAssets = await loadCanvasImages(
        canvasAssetUrls(face),
        new AbortController().signal,
      );
      try {
        c.clearRect(0, 0, 488, 680);
        paintPrepareFrame(c, { ...face, colorCalibration: undefined }, anchorAssets.images);
      } finally {
        anchorAssets.dispose();
      }
      const anchorTemplate = small.toDataURL();
      full.width = full.height = small.width = small.height = 0;
      return {
        render,
        template,
        anchorTemplate,
        rules,
        frame: faceFrame(face),
        rects: faceRects(face),
      };
    }, entry.face);
    const bytes = Buffer.from(capture.render.split(',')[1], 'base64'),
      render = PNG.sync.read(bytes);
    const templateBytes = Buffer.from(capture.template.split(',')[1], 'base64');
    const anchorBytes = Buffer.from(capture.anchorTemplate.split(',')[1], 'base64');
    const raw = normalize(PNG.sync.read(await readObject(entry.reference)));
    const registration = {
      ...prepareRegistration(raw, PNG.sync.read(anchorBytes)),
      templateHash: hash(anchorBytes),
    };
    const aligned = registration.accepted ? normalize(raw, registration.transform) : raw;
    const old = PNG.sync.read(
      await readFile(`${outputRoot}/${baselineLabel}/${entry.files.render}`),
    );
    const metricReference = withoutStats(aligned, entry.face);
    const scores = registration.accepted
      ? Object.fromEntries(
          Object.entries(regions).map(([key, rect]) => [
            key,
            {
              before: sagaTextMetric(
                metricReference,
                withoutStats(old, entry.face),
                rect,
                key === 'spellHeader',
              ),
              after: sagaTextMetric(
                metricReference,
                withoutStats(render, entry.face),
                rect,
                key === 'spellHeader',
              ),
            },
          ]),
        )
      : null;
    const files = {
      render: `${entry.id}-render.png`,
      reference: `${entry.id}-reference.png`,
      template: `${entry.id}-template.png`,
      anchor: `${entry.id}-anchor.png`,
    };
    await atomicWrite(`${output}/${files.render}`, bytes);
    await atomicWrite(`${output}/${files.template}`, templateBytes);
    await atomicWrite(`${output}/${files.anchor}`, anchorBytes);
    await savePng(`${output}/${files.reference}`, aligned);
    results.push({
      ...entry,
      frame: capture.frame,
      rects: capture.rects,
      registration,
      scores,
      rules: capture.rules,
      renderHash: hash(bytes),
      files,
    });
    console.log(entry.set, entry.name, registration.accepted ? 'aligned' : registration.reason);
  }
  if (session.faults.length) throw Error(session.faults.join('\n'));
  if (rendererHash !== (await sourceHash(`${root}/games/magic/src`)))
    throw Error('Renderer changed during capture');
  await writeJson(`${output}/audit.json`, {
    schemaVersion: 1,
    createdAt: new Date().toISOString(),
    sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
    rendererHash,
    studyHash,
    fontHash: hash(css),
    baselineHash: hash(baselineBytes),
    baselineLabel,
    inputChanges,
    sources: baseline.sources,
    components,
    regions,
    polarity: { permanent: 'dark', spell: 'dark', spellHeader: 'light' },
    results,
  });
} finally {
  await session.close();
}
