import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
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
import { fetchComponents } from './components.mjs';
import { presentation } from './adapter.mjs';
import { openBrowser } from './browser.mjs';

const [action = 'before'] = process.argv.slice(2);
assert.ok(['before', 'after'].includes(action));
const base = `${outputRoot}/land-paper`,
  planFile = `${fixtureRoot}/land-paper-plan.json`;
const entries = [];
for (const set of ['m15', 'm19', 'm20', 'm21', 'iko', 'dmu', 'fdn']) {
  const snapshot = await readJson(`${cacheRoot}/sets/${set}-window-era.json`);
  entries.push(
    ...snapshot.entries.filter(
      (e) =>
        !e.issue &&
        /^(Bloodfell Caves|Caves of Koilos|Cinder Barrens|Forsaken Sanctuary|Battlefield Forge|Detection Tower)$/.test(
          e.card.name,
        ),
    ),
  );
}
const m21 = await readJson(`${cacheRoot}/sets/m21.json`);
entries.push(
  ...m21.entries.filter((e) =>
    ['Dire Fleet Warmonger', 'Indulging Patrician'].includes(e.card.name),
  ),
);
assert.equal(entries.length, 12);
const rendererHash = await sourceHash(`${root}/games/magic/src`);
const plan = {
  schemaVersion: 1,
  scope:
    'Six reported BR/WB land printings for calibration; two different M19 lands held out; four unrelated-frame/nonland controls. Frozen cached sources, no per-scan adjustment. Original frame assets retained.',
  baselineRendererHash: rendererHash,
  cards: entries.map((e) => ({
    id: e.id,
    set: e.card.set,
    name: e.card.name,
    referenceHash: e.reference.sha256,
    inputHash: hash(JSON.stringify(presentation(e).face)),
    cohort: /^(Bloodfell Caves|Caves of Koilos)$/.test(e.card.name)
      ? 'calibration'
      : /^(Cinder Barrens|Forsaken Sanctuary)$/.test(e.card.name)
        ? 'held-out'
        : 'control',
  })),
};
if (action === 'before') {
  try {
    assert.deepEqual(await readJson(planFile), plan);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await writeJson(planFile, plan);
  }
}
const frozen = await readJson(planFile);
assert.deepEqual(plan.cards, frozen.cards);
const components = await fetchComponents(entries, {}),
  session = await openBrowser({ entries, components }),
  rows = [];
try {
  for (const e of entries) {
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
      // Validate the capture before keeping it as comparison evidence.
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
console.log(action, rows.length);
