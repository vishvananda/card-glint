import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { cachedFetch, readObject } from './cache.mjs';
import {
  cacheRoot,
  fixtureRoot,
  outputRoot,
  root,
  readJson,
  writeJson,
  sourceHash,
  hash,
  atomicWrite,
  mapLimit,
} from './common.mjs';
import { printingScope, referenceIssue } from './rollout-policy.mjs';
import { fetchComponents } from './components.mjs';
import { presentation } from './adapter.mjs';
import { openBrowser } from './browser.mjs';

const [action = 'prepare'] = process.argv.slice(2);
assert.ok(['prepare', 'before', 'variant', 'candidate', 'after'].includes(action));
const base = `${outputRoot}/ice-symbol`,
  planFile = `${fixtureRoot}/ice-symbol-plan.json`,
  snapshotFile = `${cacheRoot}/rollout/ice-symbol.json`;
if (action === 'prepare') {
  const prior = await readJson(`${cacheRoot}/rollout/old-symbol-survey.json`),
    reviewed = await readJson(`${fixtureRoot}/old-symbol-material-review.json`),
    variants = await readJson(`${cacheRoot}/rollout/ice-symbol-variants.json`),
    inventory = await readJson(`${cacheRoot}/rollout/sets/ice.json`),
    cards = [];
  for (const page of inventory.pages)
    cards.push(...JSON.parse((await readObject(page)).toString()).data);
  const eligible = cards.filter((c) => printingScope(c).status === 'ordinary'),
    excluded = cards
      .filter((c) => printingScope(c).status !== 'ordinary')
      .map((c) => ({ id: c.id, name: c.name, reason: printingScope(c) })),
    calibration = new Set([
      ...prior.entries.filter((e) => e.card.set === 'ice').map((e) => e.id),
      ...reviewed.rows.filter((e) => e.set === 'ice').map((e) => e.id),
    ]);
  // Expand the previously reviewed W/U/B/G/artifact sample before fitting.
  for (const material of ['R', 'gold', 'land']) {
    const card = eligible.find(
      (c) =>
        !referenceIssue(c) &&
        (material === 'land'
          ? /Land/.test(c.type_line)
          : material === 'gold'
            ? c.colors.length > 1
            : c.colors.join('') === material),
    );
    assert.ok(card);
    calibration.add(card.id);
  }
  const entries = await mapLimit(eligible, 2, async (card) => {
    const issue = referenceIssue(card);
    if (issue) return { id: card.id, card, category: 'ordinary', issue, cohort: 'unavailable' };
    const cached = prior.entries.find((e) => e.id === card.id);
    const entry = {
      id: card.id,
      card,
      category: 'ordinary',
      issue: null,
      cohort: calibration.has(card.id) ? 'calibration' : 'validation',
      reference: cached?.reference ?? (await cachedFetch(card.image_uris.png)),
      art: cached?.art ?? (await cachedFetch(card.image_uris.art_crop)),
    };
    console.log('cached', card.name);
    return entry;
  });
  for (const set of ['fem', 'hml', 'all', 'exo'])
    entries.push({ ...prior.entries.find((e) => e.card.set === set), cohort: 'control' });
  const sample = entries.find((e) => e.cohort === 'calibration');
  entries.push({ ...sample, id: sample.id + '-custom', explicitSymbol: true, cohort: 'control' });
  entries.push({ ...sample, id: sample.id + '-modern', modernFrame: true, cohort: 'control' });
  const snapshot = {
    schemaVersion: 1,
    entries,
    excluded,
    totalPrintings: cards.length,
    ordinaryPrintings: eligible.length,
    components: [
      ...(await fetchComponents(
        entries.map((e) => (e.modernFrame ? { ...e, card: { ...e.card, frame: '2015' } } : e)),
        {},
      )),
      ...variants.assets,
    ],
  };
  const plan = {
    schemaVersion: 1,
    scope:
      'Complete ordinary Ice Age inventory. Eight previously reviewed printings plus first red, gold and land cards form eleven calibration examples; all remaining printings reserved for validation. Four adjacent-set controls, an explicit-symbol control and a modern-frame control. Compare existing pinned snowflake variants then shared visible bounds. Raw scan metrics, no fitted internal-frame transform or per-card placement. Oracle wording is unverified; no text-layout certification.',
    baselineRendererHash: await sourceHash(`${root}/games/magic/src`),
    snapshotHash: hash(JSON.stringify(snapshot)),
    cards: entries.map((e) => ({
      id: e.id,
      set: e.card.set,
      name: e.card.name,
      referenceHash: e.reference?.sha256 ?? null,
      issue: e.issue,
      inputHash: hash(JSON.stringify(studyFace(e))),
      cohort: e.cohort,
    })),
  };
  try {
    await readJson(planFile);
    throw Error('Plan already frozen');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  await writeJson(snapshotFile, snapshot);
  await writeJson(planFile, plan);
  console.log('Prepared', entries.length);
  process.exit(0);
}
const frozen = await readJson(planFile),
  snapshot = await readJson(snapshotFile),
  rendererHash = await sourceHash(`${root}/games/magic/src`);
assert.equal(hash(JSON.stringify(snapshot)), frozen.snapshotHash);
if (action === 'before') assert.equal(rendererHash, frozen.baselineRendererHash);
const session = await openBrowser(snapshot),
  rows = [];
try {
  for (const e of snapshot.entries.filter(
    (e) =>
      !e.issue &&
      (!['variant', 'candidate'].includes(action) || ['calibration', 'control'].includes(e.cohort)),
  )) {
    const face = studyFace(e);
    let rendered;
    try {
      rendered = await session.page.evaluate(async (face) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const images = [];
        for (const tier of ['inspect', 'table']) {
          const canvas = await composeCardTexture(
            { face, printingId: null, printedImage: null },
            tier,
            new AbortController().signal,
          );
          images.push({ tier, data: canvas.toDataURL() });
          canvas.width = canvas.height = 0;
        }
        const { retroPx, retroRects } = await import(
          '/games/magic/src/presentation/retro-frame.ts'
        );
        const { retroSymbolGeometry } = await import(
          '/games/magic/src/presentation/retro-symbol-geometry.ts'
        );
        const context = document.createElement('canvas').getContext('2d');
        context.font = '21.7px "CardRenderer MTG MPlantin", Georgia';
        const [x, y, w, h] = retroPx(retroRects(face).type),
          g = retroSymbolGeometry(face),
          before = w - 48,
          after = g ? Math.min(before, g.right - g.width - x - 6) : before,
          measuredWidth = context.measureText(face.typeLine).width;
        return {
          images,
          clearance: {
            typeLine: face.typeLine,
            measuredWidth,
            beforeMaximum: before,
            afterMaximum: after,
            needsCompression: after < before && measuredWidth > after,
            typeRegion: [x - 2, y - 1, w, h + 2],
          },
        };
      }, face);
    } catch (error) {
      if (!String(error).includes('Magic rules text does not fit the available area.')) throw error;
      rows.push({
        ...frozen.cards.find((c) => c.id === e.id),
        number: e.card.collector_number,
        face,
        failure: 'rules-text-overflow',
        images: {},
      });
      console.log(action, 'UNAVAILABLE', e.card.name);
      continue;
    }
    const images = {};
    for (const image of rendered.images) {
      const bytes = Buffer.from(image.data.split(',')[1], 'base64'),
        file = `${e.id}.${image.tier}.png`;
      PNG.sync.read(bytes, { checkCRC: true });
      await atomicWrite(`${base}/${action}/${file}`, bytes);
      images[image.tier] = { file, sha256: hash(bytes) };
    }
    rows.push({
      ...frozen.cards.find((c) => c.id === e.id),
      number: e.card.collector_number,
      face,
      clearance: rendered.clearance,
      images,
    });
    console.log(action, e.card.set, e.card.name);
  }
  assert.deepEqual(session.faults, []);
  assert.equal(await sourceHash(`${root}/games/magic/src`), rendererHash);
  await writeJson(`${base}/${action}/capture.json`, {
    rendererHash,
    planHash: hash(JSON.stringify(frozen)),
    methodHash: hash(await readFile(new URL(import.meta.url))),
    rows,
  });
} finally {
  await session.close();
}

function studyFace(entry) {
  const face = presentation(entry).face;
  if (entry.modernFrame) face.frameStyle = 'modern';
  if (entry.explicitSymbol)
    face.setSymbol = `https://cdn.jsdelivr.net/gh/andrewgioia/keyrune@256add455a043462f7b2bfa224ca71bfc66b62ab/svg/${entry.card.set}.svg`;
  return face;
}
