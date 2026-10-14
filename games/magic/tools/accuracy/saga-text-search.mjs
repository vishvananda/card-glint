import { PNG } from 'pngjs';
import { readFile } from 'node:fs/promises';
import { outputRoot, readJson, writeJson } from './common.mjs';
import { openBrowser } from './browser.mjs';
import { cropGray } from './pixels-pure.mjs';
import { strongSagaInk as strongInk } from './saga-text-metrics.mjs';
import { compareRegion } from './metrics.mjs';
const dir = `${outputRoot}/saga-native-v5`,
  audit = await readJson(`${dir}/audit.json`);
const entries = audit.results.filter((r) => r.registration.accepted);
const choices = [];
for (const maximumSize of [20.7])
  for (const padding of [18, 24, 30])
    for (const bottomSpace of [0, 0.15, 0.25, 0.35])
      choices.push({ maximumSize, padding, equalCells: 0, lastLift: 0, bottomSpace });
const session = await openBrowser({ entries, components: audit.components });
const results = choices.map((options) => ({ options, cards: [] }));
// Suppress low-contrast Saga motifs; preserve dense dark glyphs independently
// of paper hue. Existing structural edge metrics then compare the result.

try {
  for (const e of entries) {
    const ref = PNG.sync.read(await readFile(`${dir}/${e.files.reference}`)),
      rect = [64, 204, 174, 364];
    const reference = strongInk(cropGray(ref, rect).gray, rect[2], rect[3]);
    const captures = await session.page.evaluate(
      async ({ face, choices }) => {
        const { loadCanvasFonts } = await import('/games/magic/src/presentation/canvas-assets.ts');
        await loadCanvasFonts();
        const { sagaRuleLayout } = await import('/games/magic/src/presentation/saga-rules.ts');
        const { paintRulesLayout } = await import('/games/magic/src/presentation/rules-paint.ts');
        const c = document.createElement('canvas');
        c.width = 488;
        c.height = 680;
        const ctx = c.getContext('2d');
        return choices.map((options) => {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, 488, 680);
          const layout = sagaRuleLayout(ctx, face, options);
          if (layout.rows.some((r) => r.layout.overflow)) return null;
          for (const row of layout.rows) paintRulesLayout(ctx, row.layout, new Map());
          return c.toDataURL();
        });
      },
      { face: e.face, choices },
    );
    for (const [i, data] of captures.entries()) {
      const image = data ? PNG.sync.read(Buffer.from(data.split(',')[1], 'base64')) : null;
      const score = image
        ? compareRegion(
            reference,
            strongInk(cropGray(image, rect).gray, rect[2], rect[3]),
            rect[2],
            rect[3],
          )
        : null;
      results[i].cards.push({ name: e.name, set: e.set, f1: score?.edgeF1?.[1] ?? 0 });
    }
    console.log(e.name);
  }
  for (const r of results) {
    for (const [key, filter] of [
      ['train', (c) => c.set === 'dom'],
      ['holdout', (c) => c.set !== 'dom'],
    ]) {
      const rows = r.cards.filter(filter);
      r[key] = rows.reduce((n, c) => n + c.f1, 0) / rows.length;
    }
  }
  results.sort((a, b) => b.train - a.train);
  await writeJson(`${outputRoot}/saga-text-search.json`, {
    method: 'strong-ink-F1@1',
    training: 'DOM',
    holdout: 'other sets',
    results,
  });
  console.log(
    results.slice(0, 8).map(({ options, train, holdout }) => ({ options, train, holdout })),
  );
} finally {
  await session.close();
}
