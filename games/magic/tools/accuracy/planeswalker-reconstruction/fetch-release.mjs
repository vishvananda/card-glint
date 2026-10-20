import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { cachedFetch, readObject } from '../cache.mjs';
import { root as repository } from '../common.mjs';
const root = process.argv[2];
if (!root) throw Error('Pass external study directory');
await mkdir(root + '/source', { recursive: true });
await mkdir(root + '/scans', { recursive: true });
const manifest = JSON.parse(await readFile(repository + '/games/magic/assets.json'));
const sources = {};
for (const family of ['regular', 'tall'])
  for (const name of ['W', 'U', 'B', 'R', 'G', 'M', 'A', ...(family === 'tall' ? ['L'] : [])]) {
    const file = family === 'regular' ? 'planeswalkerFrame' + name : 'planeswalkerTall' + name;
    const url = manifest.CONJURER_ROOT + '/img/frames/planeswalker/' + family + '/' + file + '.png';
    const asset = await cachedFetch(url);
    const key = family + '-' + name;
    sources[key] = asset;
    await writeFile(root + '/source/' + key + '.png', await readObject(asset));
  }
for (const family of ['regular', 'tall']) {
  const file = family === 'regular' ? 'planeswalkerMaskType' : 'planeswalkerTallMaskType';
  const asset = await cachedFetch(
    manifest.CONJURER_ROOT + '/img/frames/planeswalker/' + family + '/' + file + '.png',
  );
  sources[family + '-type-mask'] = asset;
  await writeFile(root + '/source/' + family + '-type-mask.png', await readObject(asset));
}
let url =
  'https://api.scryfall.com/cards/search?' +
  new URLSearchParams({
    q: 't:planeswalker frame:2015 game:paper lang:en -is:promo -is:fullart -is:showcase -is:extendedart',
    unique: 'prints',
    order: 'released',
    dir: 'asc',
  });
const cards = [],
  pages = [];
while (url) {
  const asset = await cachedFetch(url);
  pages.push(asset);
  const page = JSON.parse(await readObject(asset));
  cards.push(...page.data);
  url = page.has_more ? page.next_page : null;
}
const eligible = cards.filter(
  (c) =>
    c.nonfoil &&
    c.highres_image &&
    c.image_status === 'highres_scan' &&
    c.layout === 'normal' &&
    !c.frame_effects?.length &&
    !c.oversized,
);
const preferredSets = [
  'm15',
  'm19',
  'm20',
  'm21',
  'war',
  'soi',
  'xln',
  'dom',
  'bfz',
  'emn',
  'ori',
  'frf',
];
const bucket = (c) => (c.colors.length === 0 ? 'A' : c.colors.length > 1 ? 'M' : c.colors[0]);
const family = (c) =>
  c.oracle_text.split('\n').filter((s) => s.trim()).length > 3 ? 'tall' : 'regular';
const blueIds = [
  '99713bb4-186f-42b6-aa66-e94ec8858e6a',
  '20d5521d-e9f1-49e0-aa13-8e6de794cb12',
  'b75f56f2-88fd-44ba-ad02-56ea3391f173',
  'e5e12371-f05c-41cf-92ca-7cb17c2f7f1a',
  '6adb7d73-4482-4930-8497-cffd169b57e2',
  '0240f9eb-e1b2-4b41-94b0-b00ad2850825',
];
const selected = [];
for (const f of ['regular', 'tall'])
  for (const b of ['W', 'U', 'B', 'R', 'G', 'M', 'A']) {
    let pool = eligible.filter((c) => bucket(c) === b && family(c) === f);
    pool.sort((a, b) => {
      const rank = (c) => {
        const p = preferredSets.indexOf(c.set);
        return p < 0 ? 100 : p;
      };
      return rank(a) - rank(b) || a.released_at.localeCompare(b.released_at);
    });
    const chosen = [],
      sets = new Set(),
      names = new Set();
    const limit = f === 'regular' ? 6 : 3;
    if (b === 'U' && f === 'regular')
      for (const id of blueIds) {
        const c = pool.find((c) => c.id === id);
        if (c) {
          chosen.push(c);
          sets.add(c.set);
          names.add(c.name);
        }
      }
    for (const c of pool) {
      if (chosen.length >= limit) break;
      if (chosen.some((a) => a.id === c.id) || sets.has(c.set) || names.has(c.name)) continue;
      chosen.push(c);
      sets.add(c.set);
      names.add(c.name);
    }
    for (const c of pool) {
      if (chosen.length >= limit) break;
      if (chosen.some((a) => a.id === c.id) || names.has(c.name)) continue;
      chosen.push(c);
      names.add(c.name);
    }
    for (const c of pool) {
      if (chosen.length >= limit) break;
      if (chosen.some((a) => a.id === c.id)) continue;
      chosen.push(c);
    }
    for (const [i, card] of chosen.entries()) {
      const reference = await cachedFetch(card.image_uris.png),
        art = await cachedFetch(card.image_uris.art_crop);
      await writeFile(root + '/scans/' + card.id + '.png', await readObject(reference));
      selected.push({
        id: card.id,
        name: card.name,
        set: card.set,
        number: card.collector_number,
        palette: b,
        family: f,
        cohort: i % 3 === 2 ? 'validation' : 'calibration',
        card,
        reference,
        art,
      });
    }
    console.log(f, b, chosen.map((c) => c.set + ':' + c.name).join(' | '));
  }
await writeFile(
  root + '/inputs.json',
  JSON.stringify(
    {
      schema: 1,
      query: pages.map((p) => p.url),
      pages,
      sources,
      records: selected,
      policy:
        'Ordinary nonfoil high-resolution standard/tall planeswalkers; prefer distinct names and sets, frozen before image inspection; every third selection reserved; all seven physical palettes',
    },
    null,
    2,
  ) + '\n',
);
