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
            'alphaTextLayout(context, face, baseRetroTextLayout(context, face))',
            'baseRetroTextLayout(context, face)',
          );
      },
    },
  ],
});
let browser;
try {
  const sizeReviews = JSON.parse(
    await readFile('games/magic/fixtures/accuracy/lea/text-size-review.json'),
  ).exceptions.filter((r) => r.set === 'lea');
  await server.listen();
  browser = await chromium.launch();
  const page = await browser.newPage();
  await page.route('https://**/*', (r) => r.abort());
  await page.goto(server.resolvedUrls.local[0]);
  const result = await page.evaluate(async (sizeReviews) => {
    await import('/games/magic/src/data/eager.ts');
    const { retroTextLayout: before } = await import(
      '/games/magic/src/presentation/__alpha-text-before.ts'
    );
    const { retroTextLayout: after } = await import('/games/magic/src/presentation/retro-rules.ts');
    const { reviewedSmallOriginal } = await import(
      '/games/magic/src/presentation/alpha-typography.ts'
    );
    const { alphaRulesLayout } = await import('/games/magic/src/presentation/alpha-rules.ts');
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
          if (!['lea', 'leb'].includes(setCode)) {
            if (JSON.stringify(a) !== JSON.stringify(b)) throw Error('Non-ABU layout changed');
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
    let printedSizeCases = 0;
    for (const review of sizeReviews) {
      const original = {
        name: review.name,
        setCode: 'lea',
        wordingMode: 'original',
        frameStyle: 'retro',
        typeLine: review.name === 'Mana Vault' ? 'Mono Artifact' : 'Summon Specter',
        rulesParagraphs: review.paragraphs,
      };
      if (!reviewedSmallOriginal(original, review.paragraphs)) throw Error('Missing reviewed size');
      if (after(ctx, original).size !== 15.5) throw Error('Original small face was lost');
      const oracle = { ...original, wordingMode: 'oracle' };
      if (reviewedSmallOriginal(oracle, review.paragraphs))
        throw Error('Size exception leaked to Oracle');
      if (
        JSON.stringify(after(ctx, oracle)) !==
        JSON.stringify(alphaRulesLayout(ctx, oracle, before(ctx, oracle)))
      )
        throw Error('Existing Oracle fitting changed');
      if (reviewedSmallOriginal({ ...original, name: 'Custom card' }, review.paragraphs))
        throw Error('Exception leaked to a custom title');
      if (reviewedSmallOriginal(original, [{ role: 'rules', runs: [{ text: 'Draw a card.' }] }]))
        throw Error('Exception applied to changed wording');
      if (reviewedSmallOriginal({ ...original, setCode: '3ed' }, review.paragraphs))
        throw Error('Exception leaked to another printing');
      printedSizeCases++;
    }
    const legacy = after(ctx, {
      ...face,
      rulesParagraphs: undefined,
      rulesAlignment: undefined,
      rulesText: 'Draw three cards.',
    });
    if (!legacy.lines.length) throw Error('Legacy rulesText was discarded');
    return { changed, controls, fallbacks, printedSizeCases };
  }, sizeReviews);
  assert.ok(result.changed > 0);
  assert.equal(result.controls, 20);
  assert.ok(result.fallbacks > 0);
  assert.equal(result.printedSizeCases, 2);
  console.log(result);
} finally {
  await browser?.close();
  await server.close();
}
