import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { createServer } from './magic-vite.mjs';

const server = await createServer({
  configFile: false,
  server: { host: '127.0.0.1', port: 0, hmr: false },
});
await server.listen();
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(server.resolvedUrls.local[0]);
  const result = await page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    const { layoutRules } = await import('/games/magic/src/presentation/rules-layout.ts');
    const { paintRulesLayout } = await import('/games/magic/src/presentation/rules-paint.ts');
    const {
      describeSetCalibration,
      createSetCalibrationCandidate,
      resolveSetCalibrationCandidate,
    } = await import('/games/magic/src/calibration/editor.ts');
    const check = (ok, msg) => {
      if (!ok) throw Error(msg);
    };
    const canvas = document.createElement('canvas');
    canvas.width = 488;
    canvas.height = 680;
    const c = canvas.getContext('2d'),
      paragraphs = [{ role: 'rules', runs: [{ text: '{T}: Add {W} to your mana pool.' }] }];
    const bounds = { x: 62.5, y: 414, width: 360, height: 184 };
    const typography = {
      leading: 1,
      paragraphGap: 0,
      flavorGap: 0,
      textWidth: 1.01,
      flavorSeparator: false,
      centerOffset: -12.5,
    };
    const make = (extra = {}) =>
      layoutRules(c, paragraphs, bounds, 25, 25, { ...typography, ...extra });
    const baseline = make(),
      zero = make({ symbolOffsetY: 0 }),
      up = make({ symbolOffsetY: -0.1 });
    const strip = (value) => {
      const clone = structuredClone(value);
      delete clone.symbolOffsetY;
      return clone;
    };
    check(JSON.stringify(baseline) === JSON.stringify(strip(zero)), 'Explicit zero reflowed text');
    check(JSON.stringify(baseline) === JSON.stringify(strip(up)), 'Offset reflowed text');
    const paint = (layout) => {
      c.clearRect(0, 0, 488, 680);
      const words = [],
        symbols = [];
      const original = c.fillText;
      c.fillText = function (text, x, y, ...rest) {
        words.push({ text, x, y, font: this.font });
        return original.call(this, text, x, y, ...rest);
      };
      try {
        paintRulesLayout(c, layout, new Map(), (context, symbol, x, y, size) => {
          symbols.push({ symbol, x, y, size });
          context.beginPath();
          context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
          context.fill();
        });
      } finally {
        c.fillText = original;
      }
      return { words, symbols, png: canvas.toDataURL() };
    };
    const a = paint(baseline),
      b = paint(zero),
      d = paint(up);
    check(JSON.stringify(a) === JSON.stringify(b), 'Unset and zero rendering differ');
    check(JSON.stringify(a.words) === JSON.stringify(d.words), 'Words moved with symbols');
    check(a.symbols.length === 2 && d.symbols.length === 2, 'Missing symbol call');
    a.symbols.forEach((s, i) => {
      const r = d.symbols[i];
      check(
        s.x === r.x && s.size === r.size && s.symbol === r.symbol,
        'Symbol shape/size/x changed',
      );
      check(Math.abs(r.y - s.y + s.size * 0.1) < 1e-10, 'Incorrect diameter-relative offset');
    });
    for (const symbolOffsetY of [NaN, Infinity, -Infinity, -0.501, 0.501]) {
      let rejected = false;
      try {
        make({ symbolOffsetY });
      } catch {
        rejected = true;
      }
      check(rejected, 'Invalid offset accepted');
    }
    make({ symbolOffsetY: -0.5 });
    make({ symbolOffsetY: 0.5 });
    const description = describeSetCalibration('4ed');
    check(description.revision === 7, 'Wrong reviewed profile revision');
    for (const color of ['W', 'U', 'B', 'R', 'G']) {
      const id = 'body.L-' + color + '.typography.symbolOffsetY';
      const control = description.controls.find((c) => c.id === id);
      check(
        control?.value === -0.1 && control.min === -0.5 && control.max === 0.5,
        'Missing signed offset control ' + id,
      );
    }
    const id = 'body.L-W.typography.symbolOffsetY';
    const candidate = createSetCalibrationCandidate('4ed', description.revision, { [id]: -0.05 });
    check(
      resolveSetCalibrationCandidate(candidate).body['L-W'].typography.symbolOffsetY === -0.05,
      'Offset candidate ignored',
    );
    check(
      describeSetCalibration('4ed').controls.find((c) => c.id === id).value === -0.1,
      'Editor mutated original profile',
    );
    for (const [revision, value] of [
      [6, -0.05],
      [7, -0.51],
      [7, 0.51],
      [7, NaN],
    ]) {
      let rejected = false;
      try {
        createSetCalibrationCandidate('4ed', revision, { [id]: value });
      } catch {
        rejected = true;
      }
      check(rejected, 'Invalid/stale editor value accepted');
    }
    return {
      words: a.words.length,
      symbols: a.symbols.length,
      canonicalDy: d.symbols[0].y - a.symbols[0].y,
    };
  });
  assert.equal(result.symbols, 2);
  assert.equal(result.canonicalDy, -2);
  console.log(
    'Inline symbol offset: exact unset/zero pixels, unchanged words and layout, diameter-relative placement, bounded signed editor controls, invalid values and stale revisions reject.',
  );
} finally {
  await browser.close();
  await server.close();
}
