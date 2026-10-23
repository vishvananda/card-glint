import assert from 'node:assert/strict';
import { createServer } from './magic-vite.mjs';
const server = await createServer({
  configFile: false,
  server: { middlewareMode: true, hmr: false },
});
try {
  await server.ssrLoadModule('/games/magic/src/data/eager.ts');
  const { modernHeadingFamily, prepareModernTypeText, shapeModernHeading, MODERN_HEADING_FAMILY } =
    await server.ssrLoadModule('/games/magic/src/presentation/modern-heading-font.ts');
  const { paintFittedText } = await server.ssrLoadModule(
    '/games/magic/src/presentation/canvas-text.ts',
  );
  const base = { name: 'Mountain', typeLine: 'Basic Land — Mountain', setCode: 'm21' };
  assert.equal(modernHeadingFamily(base), MODERN_HEADING_FAMILY);
  assert.equal(modernHeadingFamily({ ...base, calibration: 'source' }), MODERN_HEADING_FAMILY);
  for (const extra of [
    { setCode: 'lea' },
    { setCode: 'war', calibration: 'printing' },
    { frameStyle: 'retro' },
    { frameAssetFamily: 'eighth' },
    { frameTemplate: 'future' },
    { layout: 'saga', calibration: 'printing' },
    { faces: [{ name: 'Other' }], calibration: 'printing' },
  ])
    assert.equal(modernHeadingFamily({ ...base, ...extra }), undefined);
  for (const [input, expected] of [
    ['Mountain', 'Mountai\ue009'],
    ['Ugin, the Spirit Dragon', 'Ugin, the Spirit Drago\ue009'],
    ['Planeswalker — Ugin', 'Planeswalker — Ugi\ue009'],
    ['Creature — Angel', 'Creature — A\ue009gel'],
    ['Legendary', 'Legendary'],
    ['Liliana', 'Liliana'],
    ['Ugin,', 'Ugin,'],
  ]) {
    assert.equal(shapeModernHeading(input, MODERN_HEADING_FAMILY), expected);
    assert.equal(shapeModernHeading(input, 'CardRenderer MTG Beleren'), input);
    assert.equal(shapeModernHeading(expected, MODERN_HEADING_FAMILY), expected);
    assert.equal(expected.length, input.length, 'Ink-span indices remain stable');
  }
  const ordinary = { textRendering: 'auto', fontKerning: 'auto' };
  prepareModernTypeText(ordinary, { ...base, setCode: 'war', calibration: 'printing' }, 'plate');
  assert.deepEqual(ordinary, { textRendering: 'auto', fontKerning: 'auto' });
  for (const source of ['plate', 'components', 'walker']) {
    const context = { textRendering: 'auto', fontKerning: 'auto' };
    const fit = prepareModernTypeText(context, base, source);
    assert.equal(context.textRendering, 'geometricPrecision');
    assert.equal(context.fontKerning, 'normal');
    assert(fit.size > 0 && fit.width > 0);
    assert.deepEqual(
      prepareModernTypeText(context, { ...base, calibration: 'source' }, source),
      fit,
    );
  }
  const measured = [],
    painted = [];
  const context = {
    save() {},
    restore() {},
    measureText(text) {
      measured.push(text);
      return { width: text.length * 5 };
    },
    fillText(text) {
      painted.push(text);
    },
  };
  paintFittedText(context, base.name, 1, 2, 400, 20, true, 1, MODERN_HEADING_FAMILY);
  assert.deepEqual(measured, ['Mountai\ue009']);
  assert.deepEqual(painted, measured, 'Measure and paint the same shaped heading');
  assert.equal(base.name, 'Mountain');
  assert.match(context.font, /20px "CardRenderer MTG Beleren 2016"/);
} finally {
  await server.close();
}
console.log('Modern contextual heading scope, punctuation, measurement and wording passed.');
