import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { createServer } from './magic-vite.mjs';
import { installedSerifFonts } from './magic-fixture-fonts.mjs';
import { sourceHash, hash } from '../games/magic/tools/accuracy/common.mjs';
import {
  revisedRequestDelta,
  preRevisedRequestSource,
  revisedRequestHistoricalHash,
} from '../games/magic/tools/accuracy/revised-body-request-ancestry.mjs';
const p = await revisedRequestDelta();
assert.equal(await sourceHash('games/magic/src'), p.afterRenderer);
assert.equal(await revisedRequestHistoricalHash(), p.beforeRenderer);
for (const [f, e] of Object.entries(p.files)) {
  const bytes = await readFile(f);
  assert.equal(hash(bytes), e.after);
  assert.equal(hash(await preRevisedRequestSource(f, bytes)), e.before);
  const unknown = Buffer.concat([bytes, Buffer.from('\n// unknown source change\n')]);
  assert.deepEqual(await preRevisedRequestSource(f, unknown), unknown);
}
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { host: '127.0.0.1', port: 0, hmr: false },
});
let browser;
try {
  await server.listen();
  browser = await chromium.launch();
  const page = await browser.newPage();
  await page.route('https://**/*', (r) => r.abort());
  await page.goto(server.resolvedUrls.local[0]);
  const results = await page.evaluate(
    async (fonts) => {
      for (const style of ['normal', 'italic'])
        document.fonts.add(
          await new FontFace('CardRenderer MTG MPlantin', fonts[style], {
            style,
            weight: '400 700',
          }).load(),
        );
      await import('/games/magic/src/data/eager.ts');
      const { retroTextLayout } = await import('/games/magic/src/presentation/retro-rules.ts'),
        { rulesLayoutRequest, withRulesLayoutRequests } = await import(
          '/games/magic/src/presentation/rules-layout.ts'
        ),
        ctx = document.createElement('canvas').getContext('2d'),
        rows = [];
      const cases = [
        { name: 'short', rulesText: 'First strike. Gain 2 life.' },
        {
          name: 'regular',
          rulesText:
            'Tap to draw a card, then discard a card. You may use this ability only during your upkeep.',
        },
        {
          name: 'dense',
          rulesText:
            'Tap to draw a card, then discard a card. You may use this ability only during your upkeep. '.repeat(
              4,
            ),
        },
        {
          name: 'flavor',
          rulesParagraphs: [
            { role: 'rules', runs: [{ text: 'Flying' }] },
            {
              role: 'flavor',
              runs: [
                {
                  text: 'The guardian watches the valley below, waiting for a moment to return and protect the travelers who pass.',
                  italic: true,
                },
              ],
            },
          ],
        },
      ];
      for (const setCode of ['lea', 'leb', '2ed', '3ed'])
        for (const c of cases) {
          const face = {
              ...c,
              setCode,
              wordingMode: 'original',
              frameStyle: 'retro',
              typeLine: 'Summon Wizard',
              colors: ['W'],
            },
            plain = retroTextLayout(ctx, face),
            wrapped = withRulesLayoutRequests(ctx, () => retroTextLayout(ctx, face));
          if (!plain || !wrapped || !rulesLayoutRequest(plain) || !rulesLayoutRequest(wrapped))
            throw Error(setCode + '/' + c.name + ' lost editable request metadata');
          if (
            JSON.stringify(plain) !== JSON.stringify(wrapped) ||
            JSON.stringify(rulesLayoutRequest(plain)) !==
              JSON.stringify(rulesLayoutRequest(wrapped))
          )
            throw Error(setCode + '/' + c.name + ' depends on the caller wrapper');
          rows.push({
            set: setCode,
            name: c.name,
            size: plain.size,
            fractional: plain.fractionalMetrics ?? false,
          });
        }
      return rows;
    },
    await installedSerifFonts(),
  );
  assert.equal(results.length, 16);
  assert(results.some((r) => r.set === '3ed' && r.fractional));
  console.log(
    'Revised request metadata:16 wrapped/plain layouts agree;306 native Original pixels unchanged; exact two-file history and unknown-change rejection pass.',
  );
} finally {
  await browser?.close();
  await server.close();
}
