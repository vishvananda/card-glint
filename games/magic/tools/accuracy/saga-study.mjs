import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { PNG } from 'pngjs';
import {
  root,
  outputRoot,
  readJson,
  writeJson,
  atomicWrite,
  sourceHash,
  hash,
  mapLimit,
} from './common.mjs';
import { cachedFetch, readObject } from './cache.mjs';
import { openBrowser } from './browser.mjs';
import { sagaRegistration } from './saga-registration.mjs';
import { normalize, savePng } from './pixels.mjs';
import { cropGray } from './pixels-pure.mjs';
import { sagaTextMetric } from './saga-text-metrics.mjs';
import { compareRegion } from './metrics.mjs';
const baseline = `${outputRoot}/special-frames-v0215`;
const input = await readJson(`${baseline}/audit.json`);
const entries = input.results.filter((r) => r.frame === 'saga');
for (const e of entries) {
  const source = input.sources.find((s) => s.set === e.set);
  const set = JSON.parse(await readObject(source.wording)).data;
  const original = set.cards.find((c) => c.uuid === e.originals[0].uuid);
  const year = set.releaseDate.slice(0, 4);
  e.face = {
    ...e.face,
    typeLine: e.face.typeLine.replace(' – ', ' — '),
    collectorNumber: `${String(original.number).padStart(3, '0')}/${set.baseSetSize}`,
    legalText: `™ & © ${year} Wizards of the Coast`,
  };
  if (e.side === 'a') {
    const reverse = set.cards.find(
      (c) => c.identifiers?.scryfallId === original.identifiers.scryfallId && c.side === 'b',
    );
    if (reverse?.power != null && reverse.toughness != null)
      e.face.reverseStats = { power: reverse.power, toughness: reverse.toughness };
  }
}
const output = `${outputRoot}/${process.argv[2] ?? 'saga-native-v1'}`;
const rendererHash = await sourceHash(`${root}/games/magic/src`);
const resolver = await createServer({ configFile: false, root, server: { middlewareMode: true } });
const { sagaFrameAsset } = await resolver.ssrLoadModule(
  '/games/magic/src/presentation/saga-frame.ts',
);
const { canvasAssetUrls } = await resolver.ssrLoadModule(
  '/games/magic/src/presentation/canvas-assets.ts',
);
const css = await readFile(`${root}/games/magic/fonts.css`, 'utf8');
const urls = [
  ...new Set(
    [...css.matchAll(/url\('([^']+)'\)/g)]
      .map((m) => m[1])
      .concat(
        entries.flatMap((e) => canvasAssetUrls(e.face).filter((u) => u?.startsWith('https://'))),
      ),
  ),
];
await resolver.close();
const components = await mapLimit(urls, 3, (url) => cachedFetch(url));
const session = await openBrowser({ entries, components });
const results = [];
try {
  for (const e of entries) {
    const result = await session.page.evaluate(async (face) => {
      const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
      const { sagaRuleLayout } = await import('/games/magic/src/presentation/saga-rules.ts');
      const canvas = await composeCardTexture(
        { face, printingId: null, printedImage: null },
        'inspect',
        new AbortController().signal,
      );
      const c = document.createElement('canvas');
      c.width = 488;
      c.height = 680;
      const ctx = c.getContext('2d');
      ctx.drawImage(canvas, 0, 0, 488, 680);
      const r = { data: c.toDataURL(), rules: sagaRuleLayout(ctx, face) };
      canvas.width = canvas.height = c.width = c.height = 0;
      return r;
    }, e.face);
    const bytes = Buffer.from(result.data.split(',')[1], 'base64'),
      render = PNG.sync.read(bytes);
    const raw = PNG.sync.read(await readFile(`${baseline}/${e.files.reference}`));
    const old = PNG.sync.read(await readFile(`${baseline}/${e.files.render}`));
    const frameSource = components.find((a) => a.url === sagaFrameAsset(e.face));
    if (!frameSource) throw Error('Missing native frame source');
    const template = normalize(PNG.sync.read(await readObject(frameSource)));
    const fit = { ...sagaRegistration(raw, template), templateHash: frameSource.sha256 };
    const aligned = fit.accepted ? normalize(raw, fit.transform) : raw;
    await atomicWrite(`${output}/${e.id}-render.png`, bytes);
    await savePng(`${output}/${e.id}-reference.png`, aligned);
    const regions = {
      reminder: [41, 80, 197, 118],
      chapters: [63, 204, 175, 362],
      title: [40, 32, 330, 35],
      type: [40, 576, 354, 38],
    };
    const scores = fit.accepted
      ? Object.fromEntries(
          Object.entries(regions).map(([k, rect]) => [
            k,
            {
              before: compareRegion(
                cropGray(aligned, rect).gray,
                cropGray(old, rect).gray,
                rect[2],
                rect[3],
              ),
              after: compareRegion(
                cropGray(aligned, rect).gray,
                cropGray(render, rect).gray,
                rect[2],
                rect[3],
              ),
            },
          ]),
        )
      : null;
    results.push({
      ...e,
      registration: fit,
      rules: result.rules,
      scores,
      textScores: fit.accepted
        ? Object.fromEntries(
            Object.entries(regions).map(([key, rect]) => [
              key,
              {
                before: sagaTextMetric(aligned, old, rect),
                after: sagaTextMetric(aligned, render, rect),
              },
            ]),
          )
        : null,
      renderHash: hash(bytes),
      files: { render: `${e.id}-render.png`, reference: `${e.id}-reference.png` },
    });
    console.log(e.name, fit.accepted ? 'aligned' : fit.reason);
  }
  if (session.faults.length) throw Error(session.faults.join('\n'));
  if (rendererHash !== (await sourceHash(`${root}/games/magic/src`)))
    throw Error('Renderer changed during capture');
  await writeJson(`${output}/audit.json`, {
    schemaVersion: 1,
    rendererHash,
    fontHash: hash(css),
    studyHash: await sourceHash(`${root}/games/magic/tools/accuracy`),
    baseline: input.rendererHash,
    createdAt: new Date().toISOString(),
    components,
    results,
  });
} finally {
  await session.close();
}
