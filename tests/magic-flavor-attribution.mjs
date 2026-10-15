import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { chromium } from 'playwright';
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
    const { retroTextLayout } = await import('/games/magic/src/presentation/retro-rules.ts');
    const { ordinaryTextLayout } = await import('/games/magic/src/presentation/rules-paint.ts');
    const { paintRevisedStats } = await import(
      '/games/magic/src/presentation/revised-lettering.ts'
    );
    const c = document.createElement('canvas');
    c.width = 488;
    c.height = 680;
    const ctx = c.getContext('2d');
    const check = (ok, message) => {
      if (!ok) throw Error(message);
    };
    const bounds = { x: 70, y: 400, width: 160, height: 220 };
    const rules = { role: 'rules', runs: [{ text: 'Choose one — draw a card.' }] };
    let cases = 0;
    for (const dash of ['—', '–', '--']) {
      const paragraphs = [
        rules,
        {
          role: 'flavor',
          runs: [
            { text: 'A remembered quotation.\n' + dash, italic: true },
            { text: 'A person with a very long name', italic: false },
          ],
        },
      ];
      const snapshot = JSON.stringify(paragraphs);
      const layout = layoutRules(ctx, paragraphs, bounds, 22, 22, {
        leading: 1,
        paragraphGap: 0.2,
        flavorGap: 0.7,
        flavorAttribution: 'right',
      });
      const start = layout.lines.findIndex((l) =>
        l.runs
          .map((r) => r.text)
          .join('')
          .startsWith(dash),
      );
      check(start >= 0 && start < layout.lines.length - 1, 'Attribution should wrap');
      for (const line of layout.lines.slice(start))
        check(
          Math.abs(line.x + line.width - 230) < 0.01,
          'Every attribution continuation must end at right margin',
        );
      check(layout.lines[0].x === 70, 'Rules dash is not an attribution');
      check(
        layout.lines[start].runs[0].italic && layout.lines.at(-1).runs.at(-1).italic === false,
        'Mixed attribution styling changed',
      );
      check(snapshot === JSON.stringify(paragraphs), 'Caller input mutated');
      check(layout.separators.length === 1, 'Attribution added a flavor separator');
      for (const align of ['center', 'left', 'right']) {
        const layout = layoutRules(
          ctx,
          [{ role: 'flavor', align, runs: [{ text: dash + 'Author' }] }],
          bounds,
          22,
          22,
        );
        const line = layout.lines[0];
        const expected =
          70 +
          (align === 'right' ? 160 - line.width : align === 'center' ? (160 - line.width) / 2 : 0);
        check(Math.abs(line.x - expected) < 0.01, 'Explicit paragraph alignment changed');
      }
      cases++;
    }
    const face = {
      name: 'Example',
      typeLine: 'Creature',
      rulesAlignment: { mode: 'left' },
      rulesParagraphs: [
        rules,
        { role: 'flavor', runs: [{ text: 'A remembered quotation.', italic: true }] },
        { role: 'flavor', runs: [{ text: '--Author', italic: true }] },
      ],
    };
    for (const setCode of [
      '3ed',
      '4ed',
      'all',
      'mir',
      '5ed',
      'tmp',
      '6ed',
      '7ed',
      'scg',
      'por',
      '8ed',
      'm21',
    ]) {
      const f = { ...face, setCode };
      const layout = setCode === 'm21' ? ordinaryTextLayout(ctx, f) : retroTextLayout(ctx, f);
      const last = layout.lines.at(-1);
      const right = ['mir', '5ed', 'tmp', '6ed', '7ed', 'scg', 'por'].includes(setCode);
      check(
        Math.abs(last.x - layout.x - (right ? layout.width - last.width : 0)) < 0.01,
        'Incorrect printing-specific attribution alignment: ' + setCode,
      );
      const explicit = {
        ...f,
        rulesParagraphs: f.rulesParagraphs.map((p, i) => (i === 2 ? { ...p, align: 'right' } : p)),
      };
      const forced =
        setCode === 'm21' ? ordinaryTextLayout(ctx, explicit) : retroTextLayout(ctx, explicit);
      const credit = forced.lines.at(-1);
      check(
        Math.abs(credit.x + credit.width - forced.x - forced.width) < 0.01,
        'Rules centering choice must not erase explicit flavor alignment',
      );
    }
    // Interior coverage catches the edge-only masks that made Revised stats hollow.
    ctx.textBaseline = 'middle';
    paintRevisedStats(ctx, '8/8', 600);
    const actual = ctx.getImageData(0, 0, 488, 680).data;
    ctx.clearRect(0, 0, 488, 680);
    ctx.font = '27.25px "CardRenderer MTG MPlantin", Georgia';
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fff';
    ctx.fillText('8/8', 451, 611, 130);
    const mask = ctx.getImageData(0, 0, 488, 680).data;
    let opaque = 0,
      filled = 0;
    for (let i = 0; i < mask.length; i += 4)
      if (mask[i + 3] > 245) {
        opaque++;
        if (actual[i + 3] > 245 && actual[i] > 140) filled++;
      }
    check(
      opaque > 30 && filled / opaque > 0.95,
      'Revised P/T stroke interiors must contain solid gray ink',
    );
    return { cases, opaque, filled };
  });
  assert.equal(result.cases, 3);
  console.log(
    'Flavor attributions follow reviewed set policies and preserve explicit alignment/styles; Revised stats have solid interiors.',
    result,
  );
} finally {
  await browser.close();
  await server.close();
}
