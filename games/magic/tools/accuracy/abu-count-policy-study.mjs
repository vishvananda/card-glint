import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { openBrowser } from './browser.mjs';
import { cachedFetch } from './cache.mjs';
import { readJson, writeJson, hash, root } from './common.mjs';
const [inputFile, output] = process.argv.slice(2);
if (!output) throw Error('Usage: abu-count-policy-study.mjs INPUTS OUT');
const input = await readJson(inputFile);
const ssr = await createServer({
  configFile: false,
  root,
  server: { middlewareMode: true, hmr: false },
});
const { RETRO_FONT, RETRO_SYMBOL_FONT } = await ssr.ssrLoadModule(
  '/games/magic/src/presentation/retro-frame.ts',
);
await ssr.close();
const css = await readFile('games/magic/fonts.css', 'utf8');
const urls = [
  ...new Set(
    [...css.matchAll(/url\('([^']+)'\)/g)].map((m) => m[1]).concat(RETRO_FONT, RETRO_SYMBOL_FONT),
  ),
];
const components = [];
for (const url of urls)
  if (url.startsWith('https:')) components.push(await cachedFetch(url, { offline: true }));
const session = await openBrowser(
  { entries: [], components },
  {
    plugins: [
      {
        name: 'count-policy-base-layout',
        enforce: 'pre',
        transform(source, id) {
          if (id.endsWith('/retro-rules.ts'))
            return source.replace(
              'function baseRetroTextLayout(',
              'export function baseRetroTextLayout(',
            );
        },
      },
    ],
  },
);
try {
  const rows = await session.page.evaluate(async (entries) => {
    const { loadCanvasFonts } = await import('/games/magic/src/presentation/canvas-assets.ts');
    const { loadRetroFont } = await import('/games/magic/src/presentation/retro-font.ts');
    await Promise.all([loadCanvasFonts(), loadRetroFont()]);
    const { countLayout } = await import('/games/magic/tools/accuracy/abu-count-layout.mjs');
    const { baseRetroTextLayout } = await import('/games/magic/src/presentation/retro-rules.ts');
    await import('/games/magic/src/data/eager.ts');
    const canvas = document.createElement('canvas'),
      c = canvas.getContext('2d');
    const variants = [
      { mediumSize: 22.5 },
      { mediumSize: 22 },
      { mediumSize: 21.5 },
      { mediumSize: 21 },
      { mediumSize: 20.5 },
    ];
    return entries.map((e) => {
      const layouts = variants.map((options) => {
        const l = countLayout(c, e.face, options, baseRetroTextLayout(c, e.face));
        return {
          options,
          size: l.size,
          overflow: l.overflow,
          lines: l.lines.map((l) => ({
            x: l.x,
            baseline: l.baseline,
            text: l.runs.map((r) => r.text).join(''),
          })),
        };
      });
      const l = countLayout(c, e.face, {}, baseRetroTextLayout(c, e.face));
      return {
        id: e.id,
        name: e.card.name,
        material: e.material,
        variants: layouts,
        size: l.size,
        overflow: l.overflow,
        lines: l.lines.map((l) => ({
          x: l.x,
          baseline: l.baseline,
          text: l.runs.map((r) => r.text).join(''),
        })),
      };
    });
  }, input.entries);
  if (session.faults.length) throw Error(session.faults.join('\n'));
  await writeJson(output, {
    inputHash: hash(await readFile(inputFile)),
    policyHash: hash(await readFile(new URL('abu-count-layout.mjs', import.meta.url))),
    rows,
  });
  console.log({
    cards: rows.length,
    overflow: rows.filter((r) => r.overflow).map((r) => r.name),
    tiers: Object.fromEntries(
      [15.5, 22.5, 33].map((s) => [s, rows.filter((r) => r.size === s).length]),
    ),
  });
} finally {
  await session.close();
}
