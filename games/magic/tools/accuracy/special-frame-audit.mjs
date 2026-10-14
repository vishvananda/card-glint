import { readFile, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { PNG } from 'pngjs';
import { createServer } from 'vite';
import {
  cacheRoot,
  outputRoot,
  root,
  hash,
  readJson,
  writeJson,
  atomicWrite,
  sourceHash,
  mapLimit,
} from './common.mjs';
import { cachedFetch, readObject } from './cache.mjs';
import { openBrowser } from './browser.mjs';
import { specialFrameSides, specialFrameInput } from './special-frame-input.mjs';
import { normalize, savePng } from './pixels.mjs';
import { registerMajorFrame } from './major-calibration-metrics.mjs';

const adventure = process.argv.includes('--adventure');
const cohort = adventure
  ? { eld: null, woe: null, clb: null }
  : {
      dom: null, // All ordinary original Dominaria Sagas, not a hand-picked subset.
      thb: ['Medomai’s Prophecy', 'Elspeth Conquers Death'],
      khm: ["The Trickster-God's Heist"],
      mh2: ["Urza's Saga"],
      dmu: ['The Cruelty of Gix'],
      neo: ['Fable of the Mirror-Breaker // Reflection of Kiki-Jiki'],
      apc: ['Fire // Ice'],
      dgm: ['Wear // Tear'],
      akh: ['Dusk // Dawn'],
      isd: ['Delver of Secrets // Insectile Aberration'],
      znr: ['Bala Ged Recovery // Bala Ged Sanctuary'],
      dsk: ["Dollmaker's Shop // Porcelain Gallery"],
    };
const output = `${outputRoot}/${process.argv[2] ?? 'special-frames-v0215'}`;
try {
  await access(`${output}/audit.json`);
  throw Error('Audit already exists. Choose a new output label; preserve the baseline.');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const rendererHash = await sourceHash(`${root}/games/magic/src`);
const studyHash = await sourceHash(`${root}/games/magic/tools/accuracy`);
const fontHash = hash(await readFile(`${root}/games/magic/fonts.css`));
const entries = [],
  sources = [];
const simple = (text) => text.replaceAll('’', "'");
for (const [set, names] of Object.entries(cohort)) {
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
      !(c.frame_effects ?? []).some((e) =>
        ['showcase', 'extendedart', 'inverted', 'borderless'].includes(e),
      ) &&
      (names
        ? names.map(simple).includes(simple(c.name))
        : c.layout === (adventure ? 'adventure' : 'saga')),
  );
  if (names && selected.length !== names.length) throw Error(`Incomplete/duplicate cohort: ${set}`);
  const wording = await cachedFetch(`https://mtgjson.com/api/v5/${set.toUpperCase()}.json`);
  const data = JSON.parse(await readObject(wording)).data;
  const records = data.cards;
  sources.push({ set, pages: snapshot.pages, wording });
  for (const card of selected) {
    for (const side of specialFrameSides(card)) {
      const [reference, art] = await Promise.all([
        cachedFetch(side.images.png),
        cachedFetch(side.images.art_crop),
      ]);
      const input = specialFrameInput(card, side, reference, art, records);
      if (adventure) {
        const number = card.collector_number.padStart(3, '0');
        input.face.collectorNumber =
          Number(card.collector_number) <= data.baseSetSize
            ? `${number}/${data.baseSetSize}`
            : number;
        input.face.legalText = `™ & © ${data.releaseDate.slice(0, 4)} Wizards of the Coast`;
      }
      entries.push({
        id: `${card.id}-${side.key}`,
        card,
        name: side.data.name,
        side: side.key,
        reference,
        art,
        ...input,
        wordingHash: wording.sha256,
      });
    }
  }
  console.log('Cached', set, selected.length, 'printings');
}
const resolver = await createServer({ configFile: false, root, server: { middlewareMode: true } });
const { canvasAssetUrls } = await resolver.ssrLoadModule(
  '/games/magic/src/presentation/canvas-assets.ts',
);
const css = await readFile(`${root}/games/magic/fonts.css`, 'utf8');
const fontUrls = [...css.matchAll(/url\('([^']+)'\)/g)].map((m) => m[1]);
const requested = new Map(
  entries.map((e) => [e.id, canvasAssetUrls(e.face).filter((u) => u?.startsWith('https://'))]),
);
await resolver.close();
const missingAssets = [];
const components = (
  await mapLimit([...new Set([...fontUrls, ...[...requested.values()].flat()])], 3, async (url) => {
    try {
      return await cachedFetch(url);
    } catch (error) {
      if (!String(error).includes('Asset HTTP 404:') || fontUrls.includes(url)) throw error;
      missingAssets.push({ url, issue: String(error) });
      console.log('Missing component:', url);
      return null;
    }
  })
).filter(Boolean);
const session = await openBrowser({ entries, components });
// Reproduce the production loader's 404 fallback explicitly. Do not replace
// unavailable components with different assets or silently certify the raster.
for (const { url } of missingAssets)
  await session.page.route(url, (route) => route.fulfill({ status: 404, body: '' }));
const results = [];
try {
  for (const entry of entries) {
    const result = {
      id: entry.id,
      name: entry.name,
      set: entry.card.set,
      side: entry.side,
      layout: entry.card.layout,
      source: entry.card.scryfall_uri,
      reference: entry.reference,
      art: entry.art,
      face: entry.face,
      originals: entry.originals,
      wordingHash: entry.wordingHash,
      missingAssets: missingAssets.filter((a) => requested.get(entry.id).includes(a.url)),
    };
    try {
      const capture = await session.page.evaluate(async (face) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { faceFrame, specialRuleRows, faceRects } = await import(
          '/games/magic/src/presentation/special-frames.ts'
        );
        const canvas = await composeCardTexture(
          { face, printingId: null, printedImage: null },
          'inspect',
          new AbortController().signal,
        );
        const frame = faceFrame(face);
        const small = document.createElement('canvas');
        small.width = 488;
        small.height = 680;
        small.getContext('2d').drawImage(canvas, 0, 0, 488, 680);
        const output = {
          data: small.toDataURL(),
          frame,
          rows: frame === 'saga' ? specialRuleRows(face) : null,
          rects: faceRects(face),
        };
        canvas.width = canvas.height = small.width = small.height = 0;
        return output;
      }, entry.face);
      const bytes = Buffer.from(capture.data.split(',')[1], 'base64');
      const baseline = PNG.sync.read(bytes),
        raw = normalize(PNG.sync.read(await readObject(entry.reference)));
      const fit = adventure
        ? { accepted: false, reason: 'unvalidated-adventure-template' }
        : registerMajorFrame(
            raw,
            baseline,
            capture.frame === 'saga' ? 'saga' : 'component',
            'black',
          );
      result.registration = fit;
      result.frame = capture.frame;
      result.rows = capture.rows;
      result.rects = capture.rects;
      result.renderHash = hash(bytes);
      result.files = { render: `${entry.id}-render.png`, reference: `${entry.id}-reference.png` };
      await atomicWrite(`${output}/${result.files.render}`, bytes);
      await savePng(`${output}/${result.files.reference}`, raw);
      // Failed outer-frame fits remain visibly unaligned and have no score.
      result.score = null;
      if (fit.accepted && fit.transform) {
        result.files.aligned = `${entry.id}-aligned.png`;
        await savePng(
          `${output}/${result.files.aligned}`,
          normalize(PNG.sync.read(await readObject(entry.reference)), fit.transform),
        );
      }
    } catch (error) {
      result.issue = String(error);
    }
    results.push(result);
    console.log(
      results.length,
      entry.name,
      result.issue ?? result.registration.reason ?? result.registration.accepted,
    );
  }
  if (session.faults.length) throw Error(session.faults.join('\n'));
  if (rendererHash !== (await sourceHash(`${root}/games/magic/src`)))
    throw Error('Renderer changed during capture');
  await writeJson(`${output}/audit.json`, {
    schemaVersion: 1,
    createdAt: new Date().toISOString(),
    sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: root,
      encoding: 'utf8',
    }).trim(),
    rendererHash,
    studyHash,
    fontHash,
    browser: await session.browser.version(),
    sources,
    components,
    missingAssets,
    results,
  });
} finally {
  await session.close();
}
console.log('Audit saved to', output);
if (results.some((r) => r.issue)) process.exitCode = 1;
