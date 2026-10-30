import assert from 'node:assert/strict';
import { openBrowser } from '../games/magic/tools/accuracy/browser.mjs';
import { installedSerifFonts } from './magic-fixture-fonts.mjs';
const session = await openBrowser({ entries: [], components: [] }, { fonts: false });
try {
  const result = await session.page.evaluate(
    async (fonts) => {
      for (const [family, style] of [
        ['CardRenderer MTG MPlantin', 'normal'],
        ['CardRenderer MTG MPlantin', 'italic'],
        ['CardRenderer MTG Beleren', 'normal'],
      ])
        document.fonts.add(
          await new FontFace(family, fonts[style], { style, weight: '400 700' }).load(),
        );
      await import('/games/magic/src/data/eager.ts');
      const { layoutRules, rulesLayoutRequest } = await import(
        '/games/magic/src/presentation/rules-layout.ts'
      );
      const { paintRulesLayout, ordinaryTextLayout } = await import(
        '/games/magic/src/presentation/rules-paint.ts'
      );
      const { paintModernStatsText } = await import(
        '/games/magic/src/presentation/modern-stats-text.ts'
      );
      const check = (x, label) => {
        if (!x) throw Error(label);
      };
      const canvas = document.createElement('canvas');
      canvas.width = 732;
      canvas.height = 1020;
      const c = canvas.getContext('2d', { willReadFrequently: true });
      c.textRendering = 'auto';
      c.fontKerning = 'auto';
      const measured = [],
        painted = [],
        originalMeasure = c.measureText.bind(c),
        originalPaint = c.fillText.bind(c);
      c.measureText = (...a) => {
        measured.push({ rendering: c.textRendering, kerning: c.fontKerning, font: c.font });
        return originalMeasure(...a);
      };
      c.fillText = (...a) => {
        painted.push({
          text: a[0],
          rendering: c.textRendering,
          kerning: c.fontKerning,
          font: c.font,
        });
        return originalPaint(...a);
      };
      const paragraphs = [
        {
          role: 'rules',
          runs: [
            {
              text: 'Draw a card. Then draw another card. Put a card from your hand on top of your library.',
            },
          ],
        },
      ];
      const bounds = { x: 40, y: 430, width: 220, height: 190 };
      const typography = { leading: 1, paragraphGap: 0.4, flavorGap: 0.9, fractionalMetrics: true };
      const first = layoutRules(c, paragraphs, bounds, 28, 10, typography);
      check(
        !first.overflow && first.lines.length > 2,
        'Need a useful independent wrap-budget control',
      );
      const limited = layoutRules(c, paragraphs, bounds, 28, 10, {
        ...typography,
        maximumLines: first.lines.length - 1,
      });
      check(!limited.overflow, 'Limited layout must fit');
      check(
        limited.lines.length < first.lines.length && limited.size < first.size,
        'Line budget must reduce font size',
      );
      check(limited.fractionalMetrics === true, 'Paint must retain measurement mode');
      check(
        limited.lines.some((l) =>
          l.runs.some((r) => Math.abs(r.width - Math.round(r.width)) > 1e-4),
        ),
        'Preserve actual fractional advances',
      );
      const content = (l) =>
        l.lines
          .flatMap((l) => l.runs.map((r) => r.text))
          .join('')
          .replace(/\s/g, '');
      check(content(first) === content(limited), 'Line fitting must retain all text');
      check(
        measured.every((m) => m.rendering === 'geometricPrecision' && m.kerning === 'normal'),
        'All fit measurements must share precise font state',
      );
      check(
        c.textRendering === 'auto' && c.fontKerning === 'auto',
        'Measurement state must restore',
      );
      const request = rulesLayoutRequest(limited);
      const repeat = layoutRules(
        c,
        request.paragraphs,
        request.bounds,
        request.maximumSize,
        request.minimumSize,
        request.typography,
      );
      check(
        JSON.stringify(repeat) === JSON.stringify(limited),
        'Request replay must preserve precise fitting and line budget',
      );
      paintRulesLayout(c, limited, new Map());
      check(
        painted.every((m) => m.rendering === 'geometricPrecision' && m.kerning === 'normal'),
        'Painting must use matching font state',
      );
      check(c.textRendering === 'auto' && c.fontKerning === 'auto', 'Paint state must restore');
      for (const maximumLines of [0, -1, 1.5, NaN]) {
        let threw = false;
        try {
          layoutRules(c, paragraphs, bounds, 28, 10, { ...typography, maximumLines });
        } catch (e) {
          threw = /positive integer/.test(e.message);
        }
        check(threw, 'Reject invalid line limit ' + maximumLines);
      }
      const face = {
        name: 'Original wording control',
        setCode: 'm21',
        frameStyle: 'modern',
        typeLine: 'Instant',
        rulesText: 'Draw a card.',
        rulesParagraphs: [{ role: 'rules', runs: [{ text: 'Draw a card.' }] }],
      };
      const original = ordinaryTextLayout(c, face);
      const withReference = ordinaryTextLayout(c, {
        ...face,
        rulesAlignment: { mode: 'auto', reference: paragraphs },
      });
      check(
        JSON.stringify(original) === JSON.stringify(withReference),
        'Other wording must not select Original font size',
      );
      check(
        rulesLayoutRequest(original).typography.maximumLines >= 1,
        'M21 must retain a content-derived wrap budget',
      );
      check(
        rulesLayoutRequest(original).typography.fractionalMetrics === true,
        'M21 rules use precise metrics',
      );
      const oracle = ordinaryTextLayout(c, {
        ...face,
        rulesText: paragraphs[0].runs[0].text,
        rulesParagraphs: paragraphs,
      });
      check(
        content(oracle) === paragraphs[0].runs[0].text.replace(/\s/g, ''),
        'Oracle must independently fit its own text',
      );
      for (const setCode of ['lea', '8ed', 'war']) {
        const other = ordinaryTextLayout(c, { ...face, setCode, calibration: 'printing' });
        check(!other.fractionalMetrics, 'Unrelated rules must retain their font policy ' + setCode);
        check(
          rulesLayoutRequest(other).typography.maximumLines === undefined,
          'No donated line budget ' + setCode,
        );
      }
      c.font = 'bold 30px "CardRenderer MTG Beleren", Georgia';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      const previous = c.font;
      painted.length = 0;
      paintModernStatsText(c, '2/3', 420, 625, 80, { ...face, typeLine: 'Creature' });
      check(
        painted.length === 1 &&
          Math.abs(Number(/([\d.]+)px/.exec(painted[0].font)[1]) - 29.1) <= 1 / 128,
        'P/T shared size must apply once',
      );
      check(painted[0].rendering === 'geometricPrecision', 'P/T precise raster mode');
      check(c.font === previous && c.textRendering === 'auto', 'P/T font/state must restore');
      painted.length = 0;
      paintModernStatsText(c, '*/4', 420, 625, 80, { ...face, typeLine: 'Creature' });
      check(
        painted.length === 1 &&
          painted[0].text === '*/4' &&
          painted[0].font.includes('"CardRenderer MTG Beleren"') &&
          !painted[0].font.includes('2016'),
        'Variable P/T must retain the reviewed existing font and characters',
      );

      painted.length = 0;
      paintModernStatsText(c, '2/3', 420, 625, 80, {
        ...face,
        setCode: 'war',
        calibration: 'printing',
        typeLine: 'Creature',
      });
      check(
        painted.length === 1 &&
          painted[0].font === previous &&
          painted[0].rendering === 'geometricPrecision',
        'Unrelated P/T retains its font and size under shared precise rasterization',
      );
      return {
        unboundedLines: first.lines.length,
        budgetLines: limited.lines.length,
        unboundedSize: first.size,
        budgetSize: limited.size,
        scope:
          'Installed substitute fonts test fractional-state consistency, content-derived line budgets, retained wording, invalid inputs and exact-set P/T scope; no scan-fidelity claim.',
      };
    },
    await installedSerifFonts(),
  );
  assert.deepEqual(session.faults, []);
  console.log(JSON.stringify(result));
} finally {
  await session.close();
}
