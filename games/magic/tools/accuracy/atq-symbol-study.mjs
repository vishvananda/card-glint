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

const action = process.argv[2] ?? 'prepare';
assert.ok(['prepare', 'before', 'candidate', 'after'].includes(action));
const base = `${outputRoot}/atq-symbol`,
  planFile = `${fixtureRoot}/atq-symbol-plan.json`,
  snapshotFile = `${cacheRoot}/rollout/atq-symbol.json`;
if (action === 'prepare') {
  try {
    await readJson(planFile);
    throw Error('Plan already frozen');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const prior = await readJson(`${cacheRoot}/rollout/old-symbol-survey.json`),
    inventory = await readJson(`${cacheRoot}/rollout/sets/atq.json`),
    cards = [];
  for (const page of inventory.pages)
    cards.push(...JSON.parse((await readObject(page)).toString()).data);
  const eligible = cards.filter((c) => printingScope(c).status === 'ordinary'),
    excluded = cards
      .filter((c) => printingScope(c).status !== 'ordinary')
      .map((c) => ({ id: c.id, name: c.name, reason: printingScope(c) })),
    calibration = new Set(prior.entries.filter((e) => e.card.set === 'atq').map((e) => e.id));
  // Add B/R/G, artifacts and lands before viewing/fitting their geometry.
  for (const number of ['15', '16', '22', '24', '29', '31', '36', '42', '59', '80a', '80b']) {
    const card = eligible.find((c) => c.collector_number === number);
    assert.ok(card && !referenceIssue(card));
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
    console.log('cached', card.name, card.collector_number);
    return entry;
  });
  for (const set of ['arn', 'leg', 'drk', 'exo', 'ice']) {
    const e = prior.entries.find((e) => e.card.set === set);
    assert.ok(e);
    entries.push({ ...e, cohort: 'control' });
  }
  const chrInventory = await readJson(`${cacheRoot}/rollout/sets/chr.json`),
    chrCards = [];
  for (const page of chrInventory.pages)
    chrCards.push(...JSON.parse((await readObject(page)).toString()).data);
  const inherited = chrCards.find((c) => c.name === "Feldon's Cane");
  assert.ok(inherited && !referenceIssue(inherited));
  entries.push({
    id: inherited.id,
    card: inherited,
    category: 'ordinary',
    issue: null,
    reference: await cachedFetch(inherited.image_uris.png),
    art: await cachedFetch(inherited.image_uris.art_crop),
    cohort: 'control',
  });
  const sample = entries.find((e) => e.cohort === 'calibration');
  entries.push({ ...sample, id: sample.id + '-custom', explicitSymbol: true, cohort: 'control' });
  entries.push({ ...sample, id: sample.id + '-modern', modernFrame: true, cohort: 'control' });
  const snapshot = {
    schemaVersion: 1,
    entries,
    excluded,
    totalPrintings: cards.length,
    ordinaryPrintings: eligible.length,
    components: await fetchComponents(
      entries.map((e) => (e.modernFrame ? { ...e, card: { ...e.card, frame: '2015' } } : e)),
      {},
    ),
  };
  const plan = {
    schemaVersion: 1,
    scope:
      'Complete ordinary Antiquities inventory, explicit Oracle wording with original symbols. Sixteen calibration printings frozen across W/U/B/R/G/artifact/land before measurement; remaining 86 reserved for validation. Five adjacent sets, one inherited Chronicles, explicit-symbol and modern-frame controls. Native symbol bounds and raw region scores, no per-scan fitting or original-text certification.',
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
    (e) => !e.issue && (action !== 'candidate' || ['calibration', 'control'].includes(e.cohort)),
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
  face.wordingMode = 'oracle';
  face.symbolStyle = 'original';
  if (entry.modernFrame) face.frameStyle = 'modern';
  if (entry.explicitSymbol)
    face.setSymbol = `https://cdn.jsdelivr.net/gh/andrewgioia/keyrune@256add455a043462f7b2bfa224ca71bfc66b62ab/svg/${entry.card.set}.svg`;
  return face;
}
