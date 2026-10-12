import { openBrowser } from './browser.mjs';
import { readJson, writeJson, cacheRoot, fixtureRoot, outputRoot } from './common.mjs';
import { readPrintingText } from './printing-text.mjs';
import { presentation } from './adapter.mjs';
import { wrapping, lineText } from './typography-metrics.mjs';
const snapshot = await readJson(`${cacheRoot}/sets/4ed.json`),
  original = await readPrintingText(snapshot);
const plan = await readJson(`${fixtureRoot}/4ed/centered-width-plan.json`);
const before = await readJson(`${fixtureRoot}/centered-transfer-review.json`);
const targets = (await readJson(`${fixtureRoot}/4ed/centered-text-targets.json`)).cards;
for (const c of before.reports.find((r) => r.set === '4ed').results)
  targets[c.id] = { lines: c.scanLines };
const cards = plan.development.map((c) => {
  const e = snapshot.entries.find((e) => e.id === c.id),
    face = presentation(e, {}, original.cards).face;
  if (c.name === 'Deathgrip') {
    face.rulesParagraphs[0].runs[0].text =
      '{B}{B}: Counter target green spell. Play this ability as an interrupt.';
    face.rulesText = face.rulesParagraphs[0].runs[0].text;
  }
  return { ...c, color: e.card.colors.join('') || 'A', face };
});
const session = await openBrowser(snapshot);
let result;
try {
  result = await session.page.evaluate(
    async ({ cards }) => {
      const { centeredTrial } = await import(
        '/games/magic/tools/accuracy/centered-trial-layout.mjs'
      );
      await document.fonts.load('25px "CardRenderer MTG MPlantin"');
      const c = document.createElement('canvas').getContext('2d');
      return cards.map((card) => ({
        ...card,
        trials: Array.from({ length: 25 }, (_, i) => 260 + i * 5).map((width) => ({
          width,
          layout: centeredTrial(c, card.face, { size: 25, width, y: 406.556 }),
        })),
      }));
    },
    { cards },
  );
} finally {
  await session.close();
}
for (const c of result) {
  for (const t of c.trials)
    t.wrapping = wrapping(targets[c.id].lines, t.layout.lines.map(lineText), [c.face.rulesText]);
  console.log(
    c.color,
    c.name,
    c.trials.filter((t) => t.wrapping.exactWrapping).map((t) => t.width),
  );
}
await writeJson(`${outputRoot}/4ed/centered-width/layouts.json`, { cards: result });
