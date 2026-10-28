import assert from 'node:assert/strict';
import { format } from 'prettier';

/** Reviewed additive symbol-placement control; default text and drawing stay exact. */
export const fourthBasicSymbolCodeEdits = {
  'games/magic/src/presentation/rules-layout.ts': [
    [
      '  fractionalMetrics?: boolean;\n  size: number;',
      '  fractionalMetrics?: boolean;\n  /** Whole-symbol vertical shift in symbol diameters; text does not reflow. */\n  symbolOffsetY?: number;\n  size: number;',
    ],
    [
      '  textWidth?: number;\n  leading: number;',
      '  textWidth?: number;\n  /** Whole-symbol vertical shift in symbol diameters; positive moves down. */\n  symbolOffsetY?: number;\n  leading: number;',
    ],
    [
      '  const minimumFlavor = typography.flavorOrphanMinCharacters ?? 0;',
      "  if (!Number.isFinite(typography.symbolOffsetY ?? 0) || Math.abs(typography.symbolOffsetY ?? 0) > 0.5)\n    throw Error('Magic inline symbol offset must be finite and within half a diameter.');\n  const minimumFlavor = typography.flavorOrphanMinCharacters ?? 0;",
    ],
    [
      '        ...(typography.fractionalMetrics ? { fractionalMetrics: true } : {}),\n        size,',
      '        ...(typography.fractionalMetrics ? { fractionalMetrics: true } : {}),\n        ...(typography.symbolOffsetY === undefined ? {} : { symbolOffsetY: typography.symbolOffsetY }),\n        size,',
    ],
  ],
  'games/magic/src/presentation/rules-paint.ts': [
    [
      '          line.baseline - run.size * 0.72,',
      '          line.baseline - run.size * 0.72 + run.size * 0.8 * (layout.symbolOffsetY ?? 0),',
    ],
  ],
  'games/magic/src/calibration/editor.ts': [
    [
      '      (body.typography.textWidth ?? 1) <= 0',
      '      (body.typography.textWidth ?? 1) <= 0 ||\n      !Number.isFinite(body.typography.symbolOffsetY ?? 0) ||\n      Math.abs(body.typography.symbolOffsetY ?? 0) > 0.5',
    ],
    [
      '      (classes.typography.textWidth ?? 1) <= 0)',
      '      (classes.typography.textWidth ?? 1) <= 0 ||\n      !Number.isFinite(classes.typography.symbolOffsetY ?? 0) ||\n      Math.abs(classes.typography.symbolOffsetY ?? 0) > 0.5)',
    ],
  ],
  'games/magic/src/calibration/editor-controls.ts': [
    [
      "        const offset = key === 'centerOffset';\n        const ratio = key === 'textWidth' || key === 'leading';",
      "        const offset = key === 'centerOffset';\n        const symbol = key === 'symbolOffsetY';\n        const ratio = key === 'textWidth' || key === 'leading' || symbol;",
    ],
    [
      '          offset ? -24 : ratio ? 0.5 : 0,\n          offset ? 24 : ratio ? 2 : 30,',
      '          symbol ? -0.5 : offset ? -24 : ratio ? 0.5 : 0,\n          symbol ? 0.5 : offset ? 24 : ratio ? 2 : 30,',
    ],
    [
      "          key === 'centerOffset' ? -20 : 0,\n          key === 'centerOffset' ? 20 : 3,",
      "          key === 'symbolOffsetY' ? -0.5 : key === 'centerOffset' ? -20 : 0,\n          key === 'symbolOffsetY' ? 0.5 : key === 'centerOffset' ? 20 : 3,",
    ],
  ],
};

export async function reviewedFourthBasicSymbolCode(file, before) {
  const edits = fourthBasicSymbolCodeEdits[file];
  assert(edits, 'Unreviewed runtime module ' + file);
  let source = before;
  for (const [old, replacement] of edits) {
    assert.equal(source.split(old).length, 2, 'Ambiguous reviewed source edit ' + file);
    source = source.replace(old, replacement);
  }
  return format(source, { parser: 'typescript', singleQuote: true, printWidth: 100 });
}
