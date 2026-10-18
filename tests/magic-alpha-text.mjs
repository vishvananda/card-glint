import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { createServer } from './magic-vite.mjs';
const virtual = path.resolve('games/magic/src/presentation/__alpha-text-before.ts');
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { host: '127.0.0.1', port: 0, hmr: false },
  plugins: [
    {
      name: 'alpha-text-baseline',
      resolveId(id) {
        if (id.endsWith('/__alpha-text-before.ts')) return virtual;
      },
      async load(id) {
        if (id === virtual)
          return (await readFile('games/magic/src/presentation/retro-rules.ts', 'utf8')).replace(
            'alphaRulesLayout(context, face, baseRetroTextLayout(context, face))',
            'baseRetroTextLayout(context, face)',
          );
      },
    },
  ],
});
let browser;
try {
  await server.listen();
  browser = await chromium.launch();
  const page = await browser.newPage();
  await page.route('https://**/*', (r) => r.abort());
  await page.goto(server.resolvedUrls.local[0]);
  const result = await page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    const { retroTextLayout: before } = await import(
      '/games/magic/src/presentation/__alpha-text-before.ts'
    );
    const { retroTextLayout: after } = await import('/games/magic/src/presentation/retro-rules.ts');
    const canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d');
    const cases = [
      [{ role: 'rules', runs: [{ text: 'Destroy all creatures.' }] }],
      [
        { role: 'rules', runs: [{ text: 'Flying' }] },
        {
          role: 'flavor',
          runs: [{ text: 'A winged guardian watches the mountains below.', italic: true }],
        },
      ],
      [
        {
          role: 'rules',
          runs: [
            {
              text: 'At the beginning of your upkeep, draw a card. When this creature attacks, other creatures you control gain flying until end of turn.',
            },
          ],
        },
      ],
      [
        {
          role: 'rules',
          runs: [
            {
              text: 'This very long passage retains every word and must remain safely inside the frame. '.repeat(
                8,
              ),
            },
          ],
        },
      ],
      [],
    ];
    let changed = 0,
      controls = 0,
      fallbacks = 0;
    for (const setCode of ['lea', 'leb', '2ed', '3ed'])
      for (const wordingMode of ['original', 'oracle'])
        for (const rulesParagraphs of cases) {
          const face = {
            name: 'Typography',
            setCode,
            wordingMode,
            rulesParagraphs,
            typeLine: 'Sorcery',
            colors: ['W'],
            frameStyle: 'retro',
          };
          const a = before(ctx, face),
            b = after(ctx, face);
          if (setCode !== 'lea') {
            if (JSON.stringify(a) !== JSON.stringify(b)) throw Error('Non-Alpha layout changed');
            controls++;
          } else if (JSON.stringify(a) !== JSON.stringify(b)) {
            changed++;
            if (b.overflow) throw Error('Adjustment overflowed');
            for (const line of b.lines) {
              const [x, y, w, h] = line.inkBounds;
              const s = b.horizontalScale ?? 1;
              if (x * s < 48 || (x + w) * s > 448 || y + h > (wordingMode === 'oracle' ? 590 : 600))
                throw Error('Ink escapes safe bounds');
            }
          } else fallbacks++;
        }
    const face = {
      name: 'Left',
      setCode: 'lea',
      typeLine: 'Sorcery',
      colors: ['W'],
      wordingMode: 'original',
      rulesAlignment: { mode: 'left' },
      rulesText: 'Draw three cards.',
    };
    const left = after(ctx, face);
    if (left.lines.some((l) => l.x !== left.x)) throw Error('Explicit left alignment changed');
    return { changed, controls, fallbacks };
  });
  assert.ok(result.changed > 0);
  assert.equal(result.controls, 30);
  assert.ok(result.fallbacks > 0);
  console.log(result);
} finally {
  await browser?.close();
  await server.close();
}
