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
assert.ok(['prepare', 'before', 'after'].includes(action));
const base = `${outputRoot}/land-palette`,
  planFile = `${fixtureRoot}/land-palette-plan.json`,
  snapshotFile = `${cacheRoot}/rollout/land-palette.json`;
if (action === 'prepare') {
  const cycle = [
    'Bloodfell Caves',
    'Blossoming Sands',
    'Dismal Backwater',
    'Jungle Hollow',
    'Rugged Highlands',
    'Scoured Barrens',
    'Swiftwater Cliffs',
    'Thornwood Falls',
    'Tranquil Cove',
    'Wind-Scarred Crag',
  ];
  const selection = {
    m21: [
      ...cycle,
      'Animal Sanctuary',
      'Alpine Houndmaster',
      'Conclave Mentor',
      'Lorescale Coatl',
      'Watcher of the Spheres',
      'Experimental Overload',
      'Chromatic Orrery',
    ],
    fdn: [...cycle, 'Soulstone Sanctuary'],
    m15: ['Battlefield Forge', 'Radiant Fountain'],
    m19: ['Detection Tower'],
    m20: ['Cryptic Caves'],
  };
  const entries = [];
  for (const [set, names] of Object.entries(selection)) {
    const inventory = await readJson(`${cacheRoot}/rollout/sets/${set}.json`),
      cards = [];
    for (const page of inventory.pages)
      cards.push(...JSON.parse((await readObject(page)).toString()).data);
    for (const name of names) {
      const card = cards.find(
        (c) => c.name === name && printingScope(c).status === 'ordinary' && !referenceIssue(c),
      );
      assert.ok(card, `${set} ${name} unavailable`);
      const control =
        !/Land/.test(card.type_line) || ['Bloodfell Caves', 'Scoured Barrens'].includes(name);
      entries.push({
        id: card.id,
        card,
        category: 'ordinary',
        issue: null,
        cohort: control
          ? 'control'
          : set === 'fdn' || set === 'm20' || name === 'Radiant Fountain'
            ? 'held-out'
            : 'calibration',
        reference: await cachedFetch(card.image_uris.png),
        art: await cachedFetch(card.image_uris.art_crop),
      });
    }
  }
  const snapshot = { schemaVersion: 1, entries, components: await fetchComponents(entries, {}) };
  const plan = {
    schemaVersion: 1,
    scope:
      'Eight additional dual-land palettes plus neutral land rails/paper. M21 cycle, M15 Battlefield Forge and M19 Detection Tower calibration; FDN cycle and neutral lands from M15/M20/FDN reserved. Previously corrected BR/WB and six nonland frame users are unchanged controls. Shared palette corrections only; original assets retained. Raw material patches, no per-scan tuning.',
    baselineRendererHash: await sourceHash(`${root}/games/magic/src`),
    snapshotHash: hash(JSON.stringify(snapshot)),
    cards: entries.map((e) => ({
      id: e.id,
      set: e.card.set,
      name: e.card.name,
      referenceHash: e.reference.sha256,
      inputHash: hash(JSON.stringify(presentation(e).face)),
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
    const face = presentation(e).face;
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
