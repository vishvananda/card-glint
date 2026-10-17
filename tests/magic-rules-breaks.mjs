import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createServer } from 'vite';
import { chromium } from 'playwright';

const replay = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/early-expansion-dash-native.json'),
);
assert.equal(replay.native.rows.length, 316);
assert.equal(replay.native.rows.filter((r) => r.changedPixels > 0).length, 3);
for (const row of replay.native.rows) {
  assert.equal(row.outsideChanged, 0, row.name);
  assert.equal(row.beforeHash === row.renderHash, row.changedPixels === 0, row.name);
}
assert.equal(replay.changes.filter((r) => r.status === 'unscored-rejected-pose').length, 1);
for (const row of replay.changes.filter((r) => r.status === 'measured-improvement')) {
  assert.ok(row.textFit.after > row.textFit.before, row.name);
  assert.ok(row.component.after > row.component.before, row.name);
}
assert.equal(
  createHash('sha256')
    .update(await readFile('games/magic/src/presentation/rules-wrap.ts'))
    .digest('hex'),
  replay.sourceExtension['rules-wrap.ts'].after,
  'Native wrapping evidence needs replay after changing the wrapper',
);

const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { host: '127.0.0.1', port: 0, hmr: false },
});
await server.listen();
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(server.resolvedUrls.local[0]);
  const result = await page.evaluate(async () => {
    const { layoutRules } = await import('/games/magic/src/presentation/rules-layout.ts');
    const c = document.createElement('canvas').getContext('2d');
    const check = (value, message) => {
      if (!value) throw Error(message);
    };
    const text = (line) => line.runs.map((r) => r.text).join('');
    const fit = (runs, width, balanceLines = false) =>
      layoutRules(c, [{ role: 'rules', runs }], { x: 0, y: 0, width, height: 400 }, 24, 24, {
        leading: 1,
        paragraphGap: 0,
        flavorGap: 0,
        balanceLines,
      });
    const prefixes = [
      [{ text: 'a creature—' }],
      [{ text: 'a creature—', italic: true }],
      [{ text: 'a creature' }, { text: '—', italic: true }],
      [{ text: 'a ' }, { text: 'creature', italic: true }, { text: '—' }],
    ];
    let cases = 0;
    for (const prefix of prefixes) {
      const width = fit(prefix, 1000).lines[0].width + 0.01;
      const runs = [...prefix, { text: 'comes {T}\nNext', italic: true }];
      const saved = JSON.stringify(runs);
      for (const balance of [false, true]) {
        const result = fit(runs, width, balance);
        check(!result.overflow, 'Dash fixture overflowed');
        check(text(result.lines[0]) === 'a creature—', 'Inline dash did not stay on first line');
        check(text(result.lines[1]).startsWith('comes'), 'Dash tail lost or gained ink');
        check(text(result.lines.at(-1)) === 'Next', 'Hard break lost');
        const flat = result.lines.flatMap((l) => l.runs);
        check(flat.filter((r) => r.symbol).length === 1, 'Symbol duplicated or lost');
        check(
          flat.some((r) => r.italic && r.text.includes('comes')),
          'Italic tail lost',
        );
        check(
          flat
            .map((r) => r.text)
            .join('')
            .replaceAll(' ', '') === 'acreature—comesTNext',
          'Text changed',
        );
        check(JSON.stringify(runs) === saved, 'Caller runs mutated');
        cases++;
      }
    }
    for (const runs of [[{ text: '—Author' }], [{ text: '—' }, { text: 'Author', italic: true }]]) {
      const result = fit(runs, 1);
      check(
        result.overflow && result.lines.length === 1 && text(result.lines[0]) === '—Author',
        'Leading attribution dash orphaned',
      );
    }
    const whole = [{ text: 'a creature—comes' }];
    const unbroken = fit(whole, 1000);
    c.font = '24px "CardRenderer MTG MPlantin", Georgia';
    check(
      unbroken.lines.length === 1 && text(unbroken.lines[0]) === whole[0].text,
      'Unused break changed text',
    );
    check(
      Math.abs(unbroken.lines[0].width - c.measureText(whole[0].text).width) < 1e-6,
      'Unused break lost contiguous shaping',
    );
    const width = c.measureText('a dis-').width + 0.01;
    const soft = fit([{ text: 'a dis\u00adcard' }], width);
    check(
      text(soft.lines[0]) === 'a dis-' && text(soft.lines[1]) === 'card',
      'Supplied soft hyphen changed',
    );
    const plain = fit([{ text: 'a discard' }], width);
    check(!plain.lines.some((l) => text(l).includes('-')), 'Invented a discretionary hyphen');
    return { cases };
  });
  assert.equal(result.cases, 8);
  console.log(
    'Inline dash breaks preserve styles, symbols, hard breaks, shaping and attribution prefixes.',
  );
} finally {
  await browser.close();
  await server.close();
}
