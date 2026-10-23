import assert from 'node:assert/strict';
import { openBrowser } from '../games/magic/tools/accuracy/browser.mjs';
const session = await openBrowser({ entries: [], components: [] }, { fonts: false });
try {
  const result = await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    const { plateBasicSymbol, paintBasicLandSymbol } = await import(
      '/games/magic/src/presentation/plate-basic-land.ts'
    );
    const check = (value, message) => {
      if (!value) throw Error(message);
    };
    const canvas = document.createElement('canvas');
    canvas.width = 732;
    canvas.height = 1020;
    const c = canvas.getContext('2d');
    const glyph = await createImageBitmap(new ImageData(2, 2));
    const face = {
      name: 'Plains',
      setCode: 'm21',
      frameStyle: 'modern',
      canonicalTypeLine: 'Basic Land — Plains',
      typeLine: 'Basic Land — Plains',
      rulesText: 'W',
    };
    const images = new Map([[plateBasicSymbol(face), glyph]]);
    const calls = [];
    c.drawImage = () =>
      calls.push({
        color: c.shadowColor,
        dx: c.shadowOffsetX,
        dy: c.shadowOffsetY,
        blur: c.shadowBlur,
      });
    const close = (a, b) => Math.abs(a - b) < 1e-7;
    c.shadowColor = '#123456';
    c.shadowBlur = 9;
    c.shadowOffsetX = 7;
    c.shadowOffsetY = 8;
    for (const scale of [0.5, 1, 1.5]) {
      c.setTransform(scale, 0, 0, scale, 0, 0);
      check(paintBasicLandSymbol(c, face, images), 'Basic should paint');
      const actual = calls.at(-1);
      check(
        close(actual.dx, (-2 / 3) * scale) &&
          close(actual.dy, 2 * scale) &&
          close(actual.blur, (2 / 3) * scale),
        'Shadow must use canonical units at ' + scale,
      );
      check(
        c.shadowOffsetX === 7 &&
          c.shadowOffsetY === 8 &&
          c.shadowBlur === 9 &&
          c.shadowColor === '#123456',
        'Preparation must restore shadow state',
      );
    }
    c.setTransform(0, 1, -1, 0, 0, 0);
    paintBasicLandSymbol(c, face, images);
    check(
      close(calls.at(-1).dx, -2) && close(calls.at(-1).dy, -2 / 3),
      'Cast vector follows the raster transform',
    );
    for (const other of [
      { ...face, setCode: 'war', calibration: 'printing' },
      { ...face, frameAssetFamily: 'eighth' },
    ]) {
      c.setTransform(1.5, 0, 0, 1.5, 0, 0);
      paintBasicLandSymbol(c, other, images);
      const old = calls.at(-1);
      check(
        old.dx === -1.5 && old.dy === 1.5 && old.blur === 1.5,
        'Unreviewed source/set must preserve the previous shadow',
      );
    }
    paintBasicLandSymbol(c, { ...face, setCode: 'war' }, images);
    check(
      close(calls.at(-1).dx, -1) && close(calls.at(-1).dy, 3) && close(calls.at(-1).blur, 1),
      'Compatible inherited source must use canonical shadow',
    );
    const count = calls.length;
    check(
      !paintBasicLandSymbol(c, { ...face, rulesText: 'Draw a card.' }, images) &&
        calls.length === count,
      'Custom rules must not acquire a basic glyph/shadow',
    );
    glyph.close();
    return {
      tiers: 3,
      rotation: true,
      retainedDefaults: 2,
      customRules: true,
      scope:
        'Canvas device-unit semantics and source/set scope; native scan fidelity has a separate receipt.',
    };
  });
  assert.deepEqual(session.faults, []);
  console.log(JSON.stringify(result));
} finally {
  await session.close();
}
