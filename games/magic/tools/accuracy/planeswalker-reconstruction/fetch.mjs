import { cachedFetch, readObject } from '../cache.mjs';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { root as libraryRoot } from '../common.mjs';
const root = process.argv[2];
if (!root) throw Error('Pass an external experiment directory');
const options = { offline: process.argv.includes('--offline') };
await mkdir(root, { recursive: true });
const q =
  't:planeswalker c:u frame:2015 game:paper lang:en -is:promo -is:fullart (set:m15 or set:soi or set:xln or set:m19 or set:m20 or set:m21 or set:war or set:znr)';
const url =
  'https://api.scryfall.com/cards/search?' +
  new URLSearchParams({ q, unique: 'prints', order: 'released', dir: 'asc' });
const page = await cachedFetch(url, options);
const data = JSON.parse(await readObject(page));
if (data.has_more) throw Error('Audit additional pages before changing the frozen cohort');
const eligible = (c) =>
  c.nonfoil &&
  c.highres_image &&
  c.lang === 'en' &&
  c.image_status === 'highres_scan' &&
  c.layout === 'normal' &&
  c.colors.join('') === 'U' &&
  ['rare', 'mythic'].includes(c.rarity) &&
  !c.frame_effects?.length &&
  c.oracle_text.split('\n').length === 3;
const cards = data.data.filter(eligible),
  excluded = data.data
    .filter((c) => !eligible(c))
    .map((c) => ({
      id: c.id,
      name: c.name,
      set: c.set,
      number: c.collector_number,
      reason: 'Outside the ordinary nonfoil three-ability rare/mythic blue frame family',
    }));
await writeFile(
  root + '/inventory.json',
  JSON.stringify({ schema: 1, query: q, page, cards, excluded }, null, 2) + '\n',
);
const manifest = JSON.parse(await readFile(libraryRoot + '/games/magic/assets.json'));
await mkdir(root + '/source', { recursive: true });
await mkdir(root + '/scans', { recursive: true });
const assets = {};
for (const group of ['planeswalker_bg', 'planeswalker_frames', 'planeswalker_boxes']) {
  const url = manifest.RENDERER_COMPONENT_ROOT + '/img/' + group + '/U.webp';
  const asset = await cachedFetch(url, options);
  await writeFile(root + '/source/' + group + '.webp', await readObject(asset));
  assets[group] = asset;
}
const records = [];
for (const c of cards) {
  const reference = await cachedFetch(c.image_uris.png, options);
  await writeFile(root + '/scans/' + c.id + '.png', await readObject(reference));
  records.push({
    id: c.id,
    name: c.name,
    set: c.set,
    number: c.collector_number,
    cohort: ['soi', 'm20'].includes(c.set) ? 'validation' : 'calibration',
    card: c,
    reference,
  });
}
const printedTypeReviews = {};
for (const r of records)
  if (
    ['99713bb4-186f-42b6-aa66-e94ec8858e6a', '20d5521d-e9f1-49e0-aa13-8e6de794cb12'].includes(r.id)
  )
    printedTypeReviews[r.id] = {
      name: r.name,
      referenceSha256: r.reference.sha256,
      typeLine: 'Planeswalker – Jace',
      reason: 'Physical scan lacks Legendary; retain provider metadata separately.',
    };
await writeFile(
  root + '/inputs.json',
  JSON.stringify({ schema: 1, assets, records, excluded, printedTypeReviews }, null, 2) + '\n',
);
console.log(JSON.stringify({ cards: records.length, excluded: excluded.length, query: q }));
