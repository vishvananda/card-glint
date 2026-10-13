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
} from './common.mjs';
import { printingScope, referenceIssue } from './rollout-policy.mjs';
import { fetchComponents } from './components.mjs';
import { presentation } from './adapter.mjs';
import { openBrowser } from './browser.mjs';

const [action = 'prepare'] = process.argv.slice(2);
assert.ok(['prepare', 'before', 'after', 'geometry'].includes(action));
const base = `${outputRoot}/old-symbol-material`,
  planFile = `${fixtureRoot}/old-symbol-material-plan.json`,
  snapshotFile = `${cacheRoot}/rollout/old-symbol-material.json`;
if (action === 'prepare') {
  const survey = await readJson(`${cacheRoot}/rollout/old-symbol-survey.json`);
  const reviewed = await readJson(`${fixtureRoot}/old-symbol-material-review.json`);
  const sets = ['arn', 'leg', 'all', 'wth', 'exo'];
  const entries = survey.entries
    .filter((e) => sets.includes(e.card.set) || ['atq', 'drk', 'chr'].includes(e.card.set))
    .map((e) => ({
      ...e,
      cohort: sets.includes(e.card.set)
        ? 'calibration'
        : e.card.set === 'chr'
          ? 'transfer'
          : 'control',
    }));
  for (const set of sets) {
    const inventory = await readJson(`${cacheRoot}/rollout/sets/${set}.json`),
      cards = [];
    for (const page of inventory.pages)
      cards.push(...JSON.parse((await readObject(page)).toString()).data);
    for (const material of ['B', 'G', 'artifact']) {
      const card = cards.find(
        (c) =>
          printingScope(c).status === 'ordinary' &&
          !referenceIssue(c) &&
          !entries.some((e) => e.id === c.id) &&
          !reviewed.rows.some((r) => r.id === c.id) &&
          (material === 'artifact' ? /Artifact/.test(c.type_line) : c.colors.join('') === material),
      );
      assert.ok(card, `${set} lacks reserved ${material} card`);
      entries.push({
        id: card.id,
        card,
        category: 'ordinary',
        issue: null,
        cohort: 'held-out',
        reference: await cachedFetch(card.image_uris.png),
        art: await cachedFetch(card.image_uris.art_crop),
      });
    }
  }
  for (const set of ['arn', 'leg', 'all', 'wth', 'exo']) {
    const e = entries.find((e) => e.card.set === set);
    entries.push({ ...e, id: e.id + '-custom', explicitSymbol: true, cohort: 'control' });
  }
  const snapshot = { schemaVersion: 1, entries, components: await fetchComponents(entries, {}) };
  const plan = {
    schemaVersion: 1,
    scope:
      'Opaque interior details from existing pinned vectors. Five calibration cards per ARN/LEG/ALL/WTH/EXO; three unseen dark/green/artifact cards per set reserved before correction. Five Chronicles transfer printings; ATQ/DRK and explicit-symbol controls. Geometry unchanged in this material pass. Original art and symbol assets retained.',
    baselineRendererHash: await sourceHash(`${root}/games/magic/src`),
    snapshotHash: hash(JSON.stringify(snapshot)),
    cards: entries.map((e) => ({
      id: e.id,
      set: e.card.set,
      name: e.card.name,
      referenceHash: e.reference.sha256,
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
  for (const e of snapshot.entries) {
    const face = studyFace(e);
    const rendered = await session.page.evaluate(async (face) => {
      const { composeCardTexture, ordinaryTextLayout } = await import(
        '/games/magic/src/presentation/canvas-face.ts'
      );
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
      const context = document.createElement('canvas').getContext('2d');
      return { images, layout: ordinaryTextLayout(context, face) };
    }, face);
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
      layout: rendered.layout,
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
  if (entry.explicitSymbol)
    face.setSymbol = `https://cdn.jsdelivr.net/gh/andrewgioia/keyrune@256add455a043462f7b2bfa224ca71bfc66b62ab/svg/${entry.card.set}.svg`;
  return face;
}
