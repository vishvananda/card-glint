import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { magic, faceFrame, faceRects, resolveCardProfile, retroFamily } from '../dist/lib/magic.js';

const creature = {
  name: 'Example Adept',
  typeLine: 'Creature — Human Wizard',
  colors: ['U'],
  manaSymbols: ['2', 'U'],
  rulesText: 'When this creature enters, draw a card.',
  power: '2',
  toughness: '2',
};
const walker = {
  name: 'Example Wanderer',
  typeLine: 'Legendary Planeswalker — Example',
  colors: ['U'],
  loyalty: '3',
  rulesText:
    '+1: Draw a card.\n−2: Return target creature to its owner’s hand.\n−7: Draw seven cards.',
};
assert.equal(faceFrame(walker), 'planeswalker');
assert.equal(
  faceFrame({ ...walker, rulesText: walker.rulesText + '\n0: Scry 1.' }),
  'planeswalker-large',
);
assert.equal(resolveCardProfile({ typeLine: 'Legendary Land', colors: ['R', 'U'] }).crown, 'UR');
assert.equal(
  resolveCardProfile({ typeLine: 'Legendary Artifact — Equipment', colors: ['R'] }).crown,
  'R',
);
assert.equal(retroFamily({ ...creature, setCode: 'LEA' }), 'abu');
assert.notDeepEqual(faceRects(walker).rules, faceRects(creature).rules);
const fixtures = [
  creature,
  walker,
  { ...walker, rulesText: walker.rulesText + '\n0: Scry 1.' },
  { ...creature, frameStyle: 'retro', setCode: 'LEA' },
  { ...creature, frameStyle: 'retro', setCode: '4ED' },
  { ...creature, frameStyle: 'retro', setCode: '7ED' },
  {
    name: 'Example Chronicle',
    typeLine: 'Enchantment — Saga',
    colors: ['G'],
    rulesText: 'I — Draw a card.\nII, III — Create a 1/1 green Saproling creature token.',
  },
  {
    name: 'Example Class',
    typeLine: 'Enchantment — Class',
    colors: ['U'],
    rulesText:
      'When this enchantment enters, draw a card.\n{1}{U}: Level 2\nCreatures you control have flying.',
  },
  {
    ...creature,
    layout: 'split',
    faces: [
      {
        name: 'Ember',
        typeLine: 'Instant',
        colors: ['R'],
        rulesText: 'Deal 2 damage to target creature.',
      },
      { name: 'Thought', typeLine: 'Sorcery', colors: ['U'], rulesText: 'Draw a card.' },
    ],
  },
  {
    ...creature,
    layout: 'adventure',
    faces: [
      creature,
      {
        name: 'Find a Path',
        typeLine: 'Sorcery — Adventure',
        colors: ['U'],
        rulesText: 'Draw a card.',
      },
    ],
  },
];
for (const face of fixtures) {
  const before = JSON.stringify(face);
  const recipe = magic.describe(face, 'inspect');
  assert.equal(JSON.stringify(face), before, 'Recipes must not mutate input');
  assert.equal(recipe.color.key, magic.describe(face, 'inspect').color.key);
  const changed = structuredClone(face);
  changed.name += ' II';
  if (changed.faces) changed.faces[0].name += ' II';
  assert.notEqual(recipe.color.key, magic.describe(changed, 'inspect').color.key);
  for (const rect of recipe.artWindows) assert.ok(rect.every(Number.isFinite));
}

const root = path.resolve('dist/lib');
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/') return res.end('<!doctype html><title>Magic pack test</title>');
    const file = path.resolve(root, '.' + url.pathname);
    if (!file.startsWith(root + '/')) throw Error('Outside package');
    res.setHeader(
      'Content-Type',
      file.endsWith('.js') ? 'text/javascript' : 'application/octet-stream',
    );
    res.end(await readFile(file));
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch({ args: ['--no-sandbox'] });
try {
  const page = await browser.newPage();
  // No external art/font downloads in CI. Geometry and painting use original
  // synthetic bitmaps; real frame fidelity is checked separately in the host.
  await page.route('https://**/*', (route) => route.fulfill({ status: 404, body: '' }));
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  const result = await page.evaluate(async (fixtures) => {
    const { magic, opticalDocument } = await import('/magic.js');
    const bitmap = document.createElement('canvas');
    bitmap.width = 64;
    bitmap.height = 64;
    const ctx = bitmap.getContext('2d');
    ctx.fillStyle = '#164d65';
    ctx.fillRect(0, 0, 64, 64);
    let leases = 0,
      released = 0;
    const host = {
      images: async (refs) => {
        leases++;
        return { value: new Map(refs.map((ref) => [ref.url, bitmap])), release: () => released++ };
      },
    };
    const sizes = [];
    for (const face of fixtures)
      for (const tier of ['table', 'inspect']) {
        const recipe = magic.describe(face, tier);
        const canvas = await recipe.color.paint(host, new AbortController().signal);
        sizes.push([canvas.width, canvas.height]);
        if (
          !canvas.getContext('2d').getImageData(canvas.width / 2, canvas.height / 2, 1, 1).data[3]
        )
          throw Error('Blank painted face');
      }
    const optical = opticalDocument(1, 1, fixtures[0], 'silver');
    return {
      sizes,
      leases,
      released,
      stage: optical.layers[0].stage,
      tone: optical.recipe.overlayFoil.tone,
      edges: optical.recipe.edges.length,
    };
  }, fixtures);
  assert.deepEqual(
    result.sizes,
    fixtures.flatMap(() => [
      [244, 340],
      [732, 1020],
    ]),
  );
  assert.equal(result.leases, result.released, 'Release every image lease');
  assert.equal(result.stage, 'over-finish');
  assert.equal(result.tone, 'silver');
  assert.equal(result.edges, 0);
  console.log(
    `${fixtures.length} Magic layouts painted at both tiers; profiles, immutable recipes, lease release and optical layering passed.`,
  );
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
