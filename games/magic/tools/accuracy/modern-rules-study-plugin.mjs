import assert from 'node:assert/strict';
import { eighthRulesStudyPlugin } from './eighth-rules-study-plugin.mjs';

/** Offline text-only experiment. Current parameters are an empty object.
 * Every hook is source-bound; production code and host inputs stay untouched. */
export function modernRulesStudyPlugin() {
  const once = (source, needle, replacement) => {
    assert.equal(source.split(needle).length, 2, 'Review modern rules study hook: ' + needle);
    return source.replace(needle, replacement);
  };
  return {
    name: 'modern-rules-study',
    enforce: 'pre',
    transform(source, id) {
      let code = source;
      if (
        id.endsWith('/presentation/rules-paint.ts') &&
        /const baseline = measuredOrdinaryTextLayout\(\n/.test(code)
      )
        code = eighthRulesStudyPlugin().transform(code, id).code;
      if (id.endsWith('/presentation/rules-wrap.ts')) {
        code = once(
          code,
          '"CardRenderer MTG MPlantin"',
          '"' +
            '$' +
            "{(globalThis as any).__modernRulesStudy?.fontFamily ?? 'CardRenderer MTG MPlantin'}\"",
        );
      } else if (id.endsWith('/presentation/rules-layout.ts')) {
        code = once(
          code,
          '        let paragraphSize = size;',
          '        const roleStudy = typography.fractionalMetrics ? ((globalThis as any).__modernRulesStudy ?? {}) : {};\n' +
            "        const paragraphWidth = textWidth * (paragraph.role === 'flavor' ? (roleStudy.flavorWidth ?? 1) : (roleStudy.rulesWidth ?? 1));\n" +
            "        let paragraphSize = size * (paragraph.role === 'flavor' ? (roleStudy.flavorSize ?? 1) : (roleStudy.rulesSize ?? 1));",
        );
        const widths = /^([ ]+)textWidth,$/gm;
        assert.equal([...code.matchAll(widths)].length, 2, 'Review paragraph wrap widths');
        code = code.replace(widths, '$1paragraphWidth,');
      } else if (id.endsWith('/presentation/rules-paint.ts')) {
        code =
          "import { printingQuotes } from '/games/magic/tools/accuracy/modern-rules-typography-study.mjs';\n" +
          code;
        code = once(code, '  const paragraphs =\n', '  let paragraphs =\n');
        code = once(
          code,
          '  const baseline = measuredOrdinaryTextLayout(context, face, height, scale);',
          "  const budgetStudy = (globalThis as any).__modernRulesStudy ?? {};\n  let baseline;\n  if (budgetStudy.consistentBudget && rules) {\n    baseline = measuredOrdinaryTextLayout(context, face, height, scale,\n      {...rules, leading: RULES_TYPOGRAPHY.leading, paragraphGap: RULES_TYPOGRAPHY.paragraphGap},\n      (rules.maximumSize ?? 24.5) * scale);\n  } else if (budgetStudy.preciseLegacyBudget && rules) {\n    context.save();\n    try {\n      context.textRendering = 'geometricPrecision';\n      context.fontKerning = 'normal';\n      baseline = measuredOrdinaryTextLayout(context, face, height, scale);\n    } finally { context.restore(); }\n  } else baseline = measuredOrdinaryTextLayout(context, face, height, scale);",
        );
        code =
          "import { orphanParagraphCap } from '/games/magic/tools/accuracy/modern-rules-orphan-study.mjs';\n" +
          code;
        code = once(
          code,
          '    flavorSeparator: face.frameAssetFamily',
          '    ...((globalThis as any).__modernRulesStudy?.typography ?? {}),\n    flavorSeparator: face.frameAssetFamily',
        );
        code = once(
          code,
          '  const reference =\n',
          '  const study = (globalThis as any).__modernRulesStudy ?? {};\n' +
            '  bounds.x += study.dx ?? 0; bounds.y += study.dy ?? 0;\n' +
            '  bounds.width += study.widthDelta ?? 0; bounds.height += study.heightDelta ?? 0;\n' +
            '  if (study.smartQuotes && calibration) paragraphs = paragraphs.map(paragraph => ({ ...paragraph, runs: paragraph.runs.map(run => ({ ...run, text: printingQuotes(run.text) })) }));\n' +
            landEntryStudy +
            '  if (study.orphanFill && calibration) maximumSize = orphanParagraphCap(context, paragraphs, bounds, maximumSize, typography, study.orphanFill, study.orphanScope);\n' +
            '  const reference =\n',
        );
        code = once(
          code,
          'rules.capAtBaseSize ? baseline.size : (rules.maximumSize ?? 24.5) * scale',
          'rules.capAtBaseSize ? baseline.size : ((globalThis as any).__modernRulesStudy?.maximumSize ?? rules.maximumSize ?? 24.5) * scale',
        );
        code = once(
          code,
          'rules.preserveLineCount ? baseline.lines.length || undefined : undefined',
          '(globalThis as any).__modernRulesStudy?.ignoreLegacyLineBudget ? undefined : (rules.preserveLineCount ? baseline.lines.length || undefined : undefined)',
        );
      } else return;
      return { code, map: null };
    },
  };
}

// Proposal only: preserve the current legacy line budget and reduce an entry
// clause by its wording, rather than fitting separate values to individual scans.
const landEntryStudy = `
  if (study.fitLandEntryClause && calibration && face.land) {
    const first = paragraphs.find(p => p.role === 'rules')?.runs.map(r => r.text).join('') ?? '';
    const phrase = first.match(/^(.* enters the battlefield) tapped[.]$/)?.[1];
    if (phrase) {
      context.save();
      try {
        context.textRendering = 'geometricPrecision';
        context.fontKerning = 'normal';
        for (; maximumSize > 15 * scale; maximumSize -= .25 * scale) {
          context.font = rulesFont(maximumSize, false);
          if (context.measureText(phrase).width * (typography.textWidth ?? 1) <= bounds.width)
            break;
        }
      } finally { context.restore(); }
    }
  }
`;
