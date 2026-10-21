import test from 'node:test';
import assert from 'node:assert/strict';
import { m21PlaneswalkerRegions } from './modern-planeswalker-regions.mjs';

const card = {
  set: 'm21',
  frame: '2015',
  border_color: 'black',
  type_line: 'Legendary Planeswalker — Example',
};
const ordinary = { rulesText: '+1: First.\n−2: Second.\n−7: Third.', manaSymbols: ['2', 'U', 'U'] };
const tall = {
  rulesText: 'A static ability.\n+1: First.\n−3: Second.\n−10: Third.',
  manaSymbols: ['2', 'U', 'U'],
};

test('separates the static row from indented loyalty text and retains badges, footer and silhouette', () => {
  const regular = m21PlaneswalkerRegions('planeswalker', card, ordinary);
  const large = m21PlaneswalkerRegions('planeswalker-large', card, tall);
  assert(regular.length && large.length);
  const staticText = large.find((r) => r.part === 'static');
  const loyaltyText = large.find((r) => r.part === 'loyalty-text');
  assert(staticText.rect[0] < loyaltyText.rect[0]);
  assert(staticText.rect[1] + staticText.rect[3] <= loyaltyText.rect[1]);
  assert.equal(large.find((r) => r.part === 'starting-loyalty').lightInk, true);
  assert(large.some((r) => r.part === 'ability-badges'));
  assert.equal(large.find((r) => r.id === 'credits').verified, false);
  assert.equal(large.filter((r) => r.matte === 255).length, 4);
  for (const r of [...regular, ...large]) {
    const [x, y, width, height] = r.rect;
    assert(x >= 0 && y >= 0 && width > 0 && height > 0 && x + width <= 488 && y + height <= 680);
  }
});

test('does not silently reuse M21 windows for other sources or ability arrangements', () => {
  for (const alternate of [
    { ...card, set: 'war' },
    { ...card, frame: '2003' },
    { ...card, border_color: 'borderless' },
    { ...card, frame_effects: ['showcase'] },
    { ...card, type_line: 'Legendary Creature — Wizard' },
  ])
    assert.deepEqual(m21PlaneswalkerRegions('planeswalker', alternate, ordinary), []);
  assert.deepEqual(m21PlaneswalkerRegions('planeswalker-large', card, ordinary), []);
  assert.deepEqual(m21PlaneswalkerRegions('planeswalker', card, tall), []);
  assert.deepEqual(
    m21PlaneswalkerRegions('planeswalker-large', card, {
      rulesText: '+1: One.\n+1: Two.\n−1: Three.\n−5: Four.',
    }),
    [],
  );
  assert.deepEqual(
    m21PlaneswalkerRegions('planeswalker', card, { ...ordinary, frameTemplate: 'future' }),
    [],
  );
});
