import assert from 'node:assert/strict';
import path from 'node:path';
import { createServer } from './magic-vite.mjs';
import { chromium } from 'playwright';
import { alphaInkProof, preAlphaInkSource } from './magic-alpha-ink-source-guard.mjs';
import { preDarkTypeLineSource } from './magic-dark-type-line-source-guard.mjs';
await alphaInkProof();
const file = 'games/magic/src/presentation/retro-paint.ts';
const virtual = 'games/magic/src/presentation/__alpha-ink-before.ts';
const alphaAfter = 'games/magic/src/presentation/__alpha-ink-after.ts';
// Replay this immutable ink transition with its original font graph.
// Current font geometry has independent document/worker/platform checks.
const server = await createServer({
  fontGeometryHistory: true,
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { host: '127.0.0.1', port: 0, hmr: false },
  plugins: [
    {
      name: 'alpha-ink-baseline',
      resolveId(id) {
        if (id.endsWith('/__alpha-ink-before.ts')) return path.resolve(virtual);
        if (id.endsWith('/__alpha-ink-after.ts')) return path.resolve(alphaAfter);
      },
      async load(id) {
        if (id === path.resolve(virtual)) return (await preAlphaInkSource(file)).toString();
        if (id === path.resolve(alphaAfter)) return (await preDarkTypeLineSource(file)).toString();
      },
    },
  ],
});
await server.listen();
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.route('https://**/*', (route) => route.abort());
  await page.goto(server.resolvedUrls.local[0]);
  const result = await page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
    const before = await import('/games/magic/src/presentation/__alpha-ink-before.ts');
    const after = await import('/games/magic/src/presentation/__alpha-ink-after.ts');
    let changed = 0,
      controls = 0;
    for (const setCode of [
      'lea',
      'LEA',
      'leb',
      '2ed',
      '3ed',
      'arn',
      'atq',
      'drk',
      'leg',
      '4ed',
      '7ed',
    ])
      for (const color of ['W', 'U', 'B', 'R', 'G', 'A']) {
        const face = {
          name: 'Ink comparison',
          setCode,
          colors: color === 'A' ? [] : [color],
          typeLine: color === 'A' ? 'Mono Artifact' : 'Summon Example',
          artifact: color === 'A',
          rulesText: 'A filled line of rules text.\nA second italic line.',
          rulesParagraphs: [
            { role: 'rules', runs: [{ text: 'A filled line of rules text.' }] },
            { role: 'flavor', runs: [{ text: 'A second italic line.', italic: true }] },
          ],
          power: '2',
          toughness: '3',
          artist: 'Example Artist',
          securityStamp: 'none',
        };
        function draw(painter) {
          const canvas = document.createElement('canvas');
          canvas.width = 732;
          canvas.height = 1020;
          const c = canvas.getContext('2d');
          c.fillStyle = '#777';
          c.fillRect(0, 0, 732, 1020);
          c.scale(1.5, 1.5);
          painter.paintRetroFace(c, face, new Map());
          const data = c.getImageData(0, 0, 732, 1020).data;
          canvas.width = canvas.height = 0;
          return data;
        }
        const a = draw(before),
          b = draw(after);
        let difference = 0;
        for (let i = 0; i < a.length; i += 4) {
          if (a[i + 3] !== b[i + 3]) throw Error('Card silhouette changed');
          if (![0, 1, 2].some((k) => a[i + k] !== b[i + k])) continue;
          difference++;
          const x = ((i / 4) % 732) / 1.5,
            y = Math.floor(i / 4 / 732) / 1.5;
          if (
            !(
              x >= 20 &&
              x < 470 &&
              ((y >= 20 && y < 70) || (y >= 365 && y < 409) || (y >= 408 && y < 615))
            )
          )
            throw Error('Ink change escaped title/type/body');
        }
        if (setCode.toLowerCase() === 'lea') {
          if (!difference) throw Error('Alpha ink unchanged');
          changed++;
        } else {
          if (difference) throw Error('Non-Alpha printing changed: ' + setCode);
          controls++;
        }
      }
    return { changed, controls };
  });
  assert.deepEqual(result, { changed: 12, controls: 54 });
  console.log(
    'Alpha ink: 38 scan replays, 54 native controls, 66 offline scope probes; geometry and footer unchanged.',
  );
} finally {
  await browser.close();
  await server.close();
}
