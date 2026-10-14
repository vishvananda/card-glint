import { readFile, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createServer } from 'vite';
import { PNG } from 'pngjs';
import {
  root,
  cacheRoot,
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
import { specialFrameSides, specialFrameInput } from './special-frame-input.mjs';
import { normalize, savePng } from './pixels.mjs';
import { aftermathRegistration } from './aftermath-registration.mjs';
import { sagaTextMetric } from './saga-text-metrics.mjs';

const baseline = process.argv.includes('--baseline');
const baselineLabel = 'aftermath-v0216-input-v2';
const sourceRoot = process.env.MAGIC_CAPTURE_ROOT ?? root;
const label =
  process.argv.find((a, i) => i > 1 && !a.startsWith('--')) ??
  (baseline ? baselineLabel : 'aftermath-native-v3');
const output = `${outputRoot}/${label}`;
try {
  await access(`${output}/audit.json`);
  throw Error('Capture exists; choose a new label.');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const entries = [],
  sources = [];
for (const set of ['akh', 'hou']) {
  const snapshot = await readJson(`${cacheRoot}/rollout/sets/${set}.json`);
  const cards = (
    await Promise.all(snapshot.pages.map(async (p) => JSON.parse(await readObject(p)).data))
  ).flat();
  const selected = cards.filter(
    (c) =>
      c.lang === 'en' &&
      c.finishes.includes('nonfoil') &&
      !c.promo &&
      !c.full_art &&
      c.border_color === 'black' &&
      c.layout === 'split' &&
      /^Aftermath\b/m.test(c.card_faces?.[1]?.oracle_text ?? '') &&
      !(c.frame_effects ?? []).some((e) =>
        ['showcase', 'extendedart', 'borderless', 'inverted'].includes(e),
      ),
  );
  const wording = await cachedFetch(`https://mtgjson.com/api/v5/${set.toUpperCase()}.json`);
  const data = JSON.parse(await readObject(wording)).data;
  sources.push({ set, pages: snapshot.pages, wording });
  for (const card of selected) {
    const side = specialFrameSides(card)[0];
    const [reference, art] = await Promise.all([
      cachedFetch(side.images.png),
      cachedFetch(side.images.art_crop),
    ]);
    const input = specialFrameInput(card, side, reference, art, data.cards);
    input.face.collectorNumber = `${card.collector_number.padStart(3, '0')}/${data.baseSetSize}`;
    input.face.legalText = `™ & © ${data.releaseDate.slice(0, 4)} Wizards of the Coast`;
    entries.push({
      id: card.id,
      name: card.name,
      set,
      card,
      reference,
      art,
      ...input,
      wordingHash: wording.sha256,
    });
  }
  console.log('Cached', set, selected.length);
}
const rendererHash = await sourceHash(`${sourceRoot}/games/magic/src`);
const resolver = await createServer({
  configFile: false,
  root: sourceRoot,
  server: { middlewareMode: true },
});
const { canvasAssetUrls } = await resolver.ssrLoadModule(
  '/games/magic/src/presentation/canvas-assets.ts',
);
const css = await readFile(`${sourceRoot}/games/magic/fonts.css`, 'utf8');
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
const previous = baseline ? null : await readJson(`${outputRoot}/${baselineLabel}/audit.json`);
const session = await openBrowser({ entries, components }, { sourceRoot });
const results = [];
try {
  for (const e of entries) {
    const result = await session.page.evaluate(
      async ({ face, baseline }) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
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
        let rules = null;
        if (!baseline) {
          const { aftermathRules } = await import(
            '/games/magic/src/presentation/aftermath-paint.ts'
          );
          rules = face.faces.map((half, i) => aftermathRules(ctx, half, Boolean(i)));
        }
        const data = c.toDataURL();
        canvas.width = canvas.height = c.width = c.height = 0;
        return { data, rules };
      },
      { face: e.face, baseline },
    );
    const bytes = Buffer.from(result.data.split(',')[1], 'base64'),
      render = PNG.sync.read(bytes);
    const raw = normalize(PNG.sync.read(await readObject(e.reference)));
    let registration = null,
      aligned = raw,
      scores = null;
    if (!baseline) {
      const plate = (half) =>
        components.find((c) =>
          c.url.endsWith(
            '/aftermath/' + (half.colors.length > 1 ? 'm' : half.colors[0].toLowerCase()) + '.png',
          ),
        );
      const a = plate(e.face.faces[0]),
        b = plate(e.face.faces[1]);
      if (!a || !b) throw Error('Missing native template');
      const template = normalize(PNG.sync.read(await readObject(a))),
        bottom = normalize(PNG.sync.read(await readObject(b)));
      template.data.set(bottom.data.subarray(373 * 488 * 4), 373 * 488 * 4);
      registration = {
        ...aftermathRegistration(raw, template),
        templateHashes: [a.sha256, b.sha256],
      };
      if (registration.accepted) {
        aligned = normalize(raw, registration.transform);
        const old = previous.results.find((r) => r.id === e.id);
        if (
          old.wordingHash !== e.wordingHash ||
          old.reference.sha256 !== e.reference.sha256 ||
          old.art.sha256 !== e.art.sha256 ||
          JSON.stringify(old.face) !== JSON.stringify(e.face)
        )
          throw Error('Baseline inputs changed');
        const before = PNG.sync.read(
          await readFile(`${outputRoot}/${baselineLabel}/${old.files.render}`),
        );
        const regions = {
          title: [40, 32, 320, 37],
          rules: [40, 280, 405, 80],
          title2: [412, 384, 42, 150],
          rules2: [37, 386, 179, 240],
        };
        scores = Object.fromEntries(
          Object.entries(regions).map(([key, rect]) => [
            key,
            {
              before: sagaTextMetric(aligned, before, rect),
              after: sagaTextMetric(aligned, render, rect),
            },
          ]),
        );
      }
    }
    await atomicWrite(`${output}/${e.id}-render.png`, bytes);
    await savePng(`${output}/${e.id}-reference.png`, aligned);
    results.push({
      ...e,
      registration,
      scores,
      rules: result.rules,
      renderHash: hash(bytes),
      files: { render: `${e.id}-render.png`, reference: `${e.id}-reference.png` },
    });
    console.log(
      e.name,
      baseline ? 'baseline' : registration.accepted ? 'aligned' : registration.reason,
    );
  }
  if (session.faults.length) throw Error(session.faults.join('\n'));
  if (rendererHash !== (await sourceHash(`${sourceRoot}/games/magic/src`)))
    throw Error('Renderer changed during capture');
  await writeJson(`${output}/audit.json`, {
    schemaVersion: 1,
    createdAt: new Date().toISOString(),
    sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: sourceRoot,
      encoding: 'utf8',
    }).trim(),
    rendererHash,
    fontHash: hash(css),
    studyHash: await sourceHash(`${root}/games/magic/tools/accuracy`),
    sources,
    components,
    baseline: previous?.rendererHash ?? null,
    results,
  });
} finally {
  await session.close();
}
