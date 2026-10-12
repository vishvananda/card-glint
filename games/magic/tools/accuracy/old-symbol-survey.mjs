import assert from 'node:assert/strict';
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
  mapLimit,
  atomicWrite,
} from './common.mjs';
import { printingScope, referenceIssue, evaluatorIssue } from './rollout-policy.mjs';
import { fetchComponents } from './components.mjs';
import { presentation } from './adapter.mjs';
import { openBrowser } from './browser.mjs';
const [action = 'before'] = process.argv.slice(2),
  file = `${cacheRoot}/rollout/old-symbol-survey.json`,
  planFile = `${fixtureRoot}/old-symbol-survey-plan.json`;
assert.ok(['fetch', 'before', 'baseline', 'after'].includes(action));
if (action === 'fetch') {
  const selections = [];
  for (const set of [
    'arn',
    'atq',
    'leg',
    'drk',
    'fem',
    'ice',
    'hml',
    'all',
    'vis',
    'wth',
    'sth',
    'exo',
    'chr',
    'por',
    'itp',
    'ced',
    'sum',
  ]) {
    const source = await readJson(`${cacheRoot}/rollout/sets/${set}.json`),
      cards = [];
    for (const page of source.pages)
      cards.push(...JSON.parse((await readObject(page)).toString()).data);
    const eligible = cards.filter(
      (c) =>
        printingScope(c).status === 'ordinary' &&
        !referenceIssue(c) &&
        !evaluatorIssue(c) &&
        !/\bLand\b/.test(c.type_line),
    );
    for (const rarity of ['common', 'uncommon', 'rare']) {
      const seen = new Set(),
        picked = [];
      for (const c of eligible.filter((c) => c.rarity === rarity)) {
        const material =
          c.colors.join('') || (/Artifact/.test(c.type_line) ? 'artifact' : 'colorless');
        if (seen.has(material)) continue;
        seen.add(material);
        picked.push(c);
        if (picked.length === (rarity === 'common' ? 1 : 2)) break;
      }
      selections.push(
        ...picked.map((card) => ({ id: card.id, card, category: 'ordinary', issue: null })),
      );
    }
  }
  const entries = await mapLimit(selections, 2, async (entry) => {
    const reference = await cachedFetch(entry.card.image_uris.png),
      art = await cachedFetch(entry.card.image_uris.art_crop),
      image = PNG.sync.read(await readObject(reference));
    assert.ok(image.width >= 700 && image.height >= 1000);
    return { ...entry, reference, art, referenceDimensions: [image.width, image.height] };
  });
  const components = await fetchComponents(entries, {}),
    snapshot = { schemaVersion: 1, entries, components };
  const plan = {
    schemaVersion: 1,
    scope:
      'First historical-symbol survey, not all-set certification. First common and first two uncommon/rare cards with distinct materials per set. Source wording is unreviewed. Geometry and body typography are not accepted from this sample. Raw references; no fitted symbol registration.',
    baselineRendererHash: await sourceHash(`${root}/games/magic/src`),
    snapshotHash: hash(JSON.stringify(snapshot)),
    cards: entries.map((e) => ({
      id: e.id,
      set: e.card.set,
      number: e.card.collector_number,
      name: e.card.name,
      rarity: e.card.rarity,
      referenceHash: e.reference.sha256,
      referenceUrl: e.reference.url,
      source: e.card.scryfall_uri,
    })),
  };
  await writeJson(file, snapshot);
  await writeJson(planFile, plan);
  console.log('Cached', entries.length, 'old symbol examples');
  process.exit(0);
}
const snapshot = await readJson(file),
  plan = await readJson(planFile),
  rendererHash = await sourceHash(`${root}/games/magic/src`),
  rows = [],
  directory = `${outputRoot}/old-symbol-survey/${action}`;
assert.equal(hash(JSON.stringify(snapshot)), plan.snapshotHash);
if (action === 'before') assert.equal(rendererHash, plan.baselineRendererHash);
const treatmentPlanFile = `${fixtureRoot}/old-symbol-treatment-plan.json`;
if (action === 'baseline') {
  const treatmentPlan = {
    schemaVersion: 1,
    scope:
      'Freeze the current painter before historical symbol treatment changes. The older v55 survey remains a separate artifact.',
    surveyPlanHash: hash(JSON.stringify(plan)),
    rendererHash,
  };
  try {
    assert.deepEqual(await readJson(treatmentPlanFile), treatmentPlan);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await writeJson(treatmentPlanFile, treatmentPlan);
  }
}
if (action === 'after') {
  const treatmentPlan = await readJson(treatmentPlanFile);
  assert.equal(treatmentPlan.surveyPlanHash, hash(JSON.stringify(plan)));
}
const session = await openBrowser(snapshot);
try {
  for (const entry of snapshot.entries) {
    const input = presentation(entry),
      variants = await session.page.evaluate(async (face) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts'),
          out = [];
        for (const tier of ['inspect', 'table']) {
          const canvas = await composeCardTexture(
            { face, printingId: null, printedImage: null },
            tier,
            new AbortController().signal,
          );
          out.push({ tier, data: canvas.toDataURL() });
          canvas.width = canvas.height = 0;
        }
        return out;
      }, input.face),
      images = {};
    for (const v of variants) {
      const bytes = Buffer.from(v.data.split(',')[1], 'base64'),
        file = `${entry.id}.${v.tier}.png`;
      await atomicWrite(`${directory}/${file}`, bytes);
      images[v.tier] = { file, sha256: hash(bytes) };
    }
    rows.push({
      id: entry.id,
      set: entry.card.set,
      number: entry.card.collector_number,
      name: entry.card.name,
      rarity: entry.card.rarity,
      referenceHash: entry.reference.sha256,
      face: input.face,
      inputHash: hash(JSON.stringify(input.face)),
      images,
    });
  }
  assert.deepEqual(session.faults, []);
  assert.equal(await sourceHash(`${root}/games/magic/src`), rendererHash);
  await writeJson(`${directory}/capture.json`, {
    rendererHash,
    planHash: hash(JSON.stringify(plan)),
    rows,
  });
} finally {
  await session.close();
}
console.log(action, rows.length);
