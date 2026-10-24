import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { createServer } from './magic-vite.mjs';
import { installedSerifFonts } from './magic-fixture-fonts.mjs';
import { preAbuFractionalSource } from '../games/magic/tools/accuracy/abu-fractional-ancestry.mjs';

const virtual = path.resolve('games/magic/src/presentation/__abu-fractional-before.ts');
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { host: '127.0.0.1', port: 0, hmr: false },
  plugins: [
    {
      name: 'abu-fractional-reference',
      resolveId(id) {
        if (id.endsWith('/__abu-fractional-before.ts')) return virtual;
        if (id.endsWith('/__abu-tiers-before.ts'))
          return path.resolve('games/magic/src/presentation/__abu-tiers-before.ts');
      },
      async load(id) {
        if (id === virtual) {
          const bytes = await preAbuFractionalSource(
            'games/magic/src/presentation/retro-rules.ts',
            await readFile('games/magic/src/presentation/retro-rules.ts'),
          );
          return bytes.toString().replace("'./early-text-tiers.js'", "'./__abu-tiers-before.ts'");
        }
        if (id.endsWith('/__abu-tiers-before.ts'))
          return (
            await preAbuFractionalSource(
              'games/magic/src/presentation/early-text-tiers.ts',
              await readFile('games/magic/src/presentation/early-text-tiers.ts'),
            )
          ).toString();
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
  const result = await page.evaluate(
    async (fonts) => {
      for (const style of ['normal', 'italic'])
        document.fonts.add(
          await new FontFace('CardRenderer MTG MPlantin', fonts[style], {
            style,
            weight: '400 700',
          }).load(),
        );
      await import('/games/magic/src/data/eager.ts');
      const { retroTextLayout: before } = await import(
        '/games/magic/src/presentation/__abu-fractional-before.ts'
      );
      const { retroTextLayout: after } = await import(
        '/games/magic/src/presentation/retro-rules.ts'
      );
      const { rulesLayoutRequest, withRulesLayoutRequests } = await import(
        '/games/magic/src/presentation/rules-layout.ts'
      );
      const { paintRulesLayout } = await import('/games/magic/src/presentation/rules-paint.ts');
      const canvas = document.createElement('canvas');
      canvas.width = 732;
      canvas.height = 1020;
      const c = canvas.getContext('2d');
      c.textRendering = 'auto';
      c.fontKerning = 'auto';
      const check = (a, m) => {
        if (!a) throw Error(m);
      };
      const cases = [
        { name: 'Short printing', rulesText: 'Draw three cards.' },
        {
          name: 'Regular printing',
          rulesText:
            'Whenever this creature attacks, defending player may pay two mana. If that player does not, draw a card. You may then discard a card from your hand. This ability can be used only once each turn.',
        },
        {
          name: 'Small printing',
          rulesText:
            'At the beginning of your upkeep, put a counter on this artifact. Remove a counter from this artifact to prevent the next damage dealt to a target creature. '.repeat(
              3,
            ),
        },
        {
          name: 'Flavor printing',
          rulesParagraphs: [
            { role: 'rules', runs: [{ text: 'Flying' }] },
            {
              role: 'flavor',
              runs: [
                {
                  text: 'The guardian watches the valley below, waiting for a moment to return to the plains and protect the travelers who pass.',
                  italic: true,
                },
              ],
            },
          ],
        },
      ];
      let changed = 0,
        precise = 0,
        unaffected = 0,
        originals = 0;
      for (const setCode of ['lea', 'leb', '2ed', '3ed', '4ed', 'leg', '8ed', 'm21'])
        for (const wordingMode of ['original', 'oracle'])
          for (const input of cases) {
            const face = {
              ...input,
              setCode,
              wordingMode,
              frameStyle: 'retro',
              typeLine: 'Summon Spirit',
              colors: ['W'],
            };
            const a = withRulesLayoutRequests(c, () => before(c, face));
            const b = withRulesLayoutRequests(c, () => after(c, face));
            check(a && b, 'Missing body');
            const content = (l) =>
              l.lines
                .flatMap((l) => l.runs.map((r) => r.text))
                .join('')
                .replace(/\s/g, '');
            check(content(a) === content(b), 'Text lost: ' + setCode + '/' + input.name);
            if (
              !['lea', 'leb', '2ed'].includes(setCode) ||
              wordingMode === 'oracle' ||
              a.size >= 30
            ) {
              check(
                JSON.stringify(a) === JSON.stringify(b),
                'Unrelated layout changed: ' + setCode + '/' + wordingMode + '/' + input.name,
              );
              unaffected++;
            } else {
              originals++;
              check(!b.overflow, 'Original overflow');
              check(
                (b.size <= a.size && b.size >= a.size - 0.5) ||
                  (setCode === '2ed' && b.size < 19 && (face.rulesText?.length ?? 0) > 274),
                'Metrics must preserve the printing size class except the reviewed dense-selection repair',
              );
              if (JSON.stringify(a) !== JSON.stringify(b)) changed++;
              if (b.fractionalMetrics) {
                precise++;
                check(
                  rulesLayoutRequest(b)?.typography.fractionalMetrics === true,
                  'Request lost precise advances',
                );
                const states = [],
                  proto = CanvasRenderingContext2D.prototype,
                  old = proto.fillText;
                proto.fillText = function (...args) {
                  states.push([this.textRendering, this.fontKerning]);
                  return old.apply(this, args);
                };
                try {
                  paintRulesLayout(c, b, new Map());
                } finally {
                  proto.fillText = old;
                }
                check(
                  states.length &&
                    states.every(([m, k]) => m === 'geometricPrecision' && k === 'normal'),
                  'Painting used different metrics',
                );
              }
            }
            check(c.textRendering === 'auto' && c.fontKerning === 'auto', 'Context metrics leaked');
          }
      check(changed > 0 && precise > 0, 'Vacuous fractional control');
      return { changed, precise, unaffected, originals };
    },
    await installedSerifFonts(),
  );
  console.log('ABU fractional text:', result);
} finally {
  await browser?.close();
  await server.close();
}
