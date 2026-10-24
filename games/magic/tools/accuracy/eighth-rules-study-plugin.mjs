import assert from 'node:assert/strict';
/** Study only: retain the current set ceiling unless a trial replaces it. */
export function eighthRulesStudyPlugin() {
  return {
    name: 'eighth-rules-budget-study',
    enforce: 'pre',
    transform(source, id) {
      if (id.endsWith('/presentation/rules-layout.ts')) {
        const rows = '          rows.length > 2 &&';
        const minimum = '            trialSize >= paragraphSize * 0.94;';
        assert.equal(source.split(rows).length, 2);
        assert.equal(source.split(minimum).length, 2);
        return {
          code: source
            .replace(
              rows,
              '          rows.length > ((globalThis as any).__modernRulesStudy?.eighthFlavorOrphans ? 1 : 2) &&',
            )
            .replace(
              minimum,
              '            trialSize >= paragraphSize * ((globalThis as any).__modernRulesStudy?.eighthFlavorOrphans ? .9 : .94);',
            ),
          map: null,
        };
      }
      if (!id.endsWith('/presentation/rules-paint.ts')) return;
      let current = `  const baseline = measuredOrdinaryTextLayout(
    context,
    face,
    height,
    scale,
    undefined,
    (eighth?.maximumSize ?? 24.5) * scale,
  );`;
      if (source.includes('(eighthMaximum ?? 24.5)'))
        current = current.replace('(eighth?.maximumSize ?? 24.5)', '(eighthMaximum ?? 24.5)');
      const modern = '  const baseline = measuredOrdinaryTextLayout(context, face, height, scale);';
      if (source.includes(current)) {
        assert.equal(source.split(current).length, 2);
        source = source.replace(current, modern);
      } else assert.equal(source.split(modern).length, 2);
      if (source.includes('  const shortLines =')) {
        const hook = '    eighthPrintingProfile(face)?.rules.shortCenterLines ??';
        assert.equal(source.split(hook).length, 2);
        source = source.replace(
          hook,
          '    (globalThis as any).__modernRulesStudy?.centerShortLines ??\n' + hook,
        );
      } else {
        const core = "['10e', 'm10', 'm11', 'm12', 'm13', 'm14']";
        assert.equal(source.split(core).length, 2);
        source = source.replace(
          core,
          "((globalThis as any).__modernRulesStudy?.centerShortLines ? ['8ed','9ed','10e','m10','m11','m12','m13','m14'] : " +
            core +
            ')',
        );
        const lines = '      3,\n      { ...typography, balanceLines: true },';
        assert.equal(source.split(lines).length, 2);
        source = source.replace(
          lines,
          '      (globalThis as any).__modernRulesStudy?.centerShortLines ?? 3,\n      { ...typography, balanceLines: true },',
        );
      }
      // The compact readability trial has an explicit ceiling as well.
      const compactCeiling = '        (eighthMaximum ?? 24.5) * scale,';
      if (source.includes(compactCeiling))
        source = source.replace(
          compactCeiling,
          '        ((globalThis as any).__modernRulesStudy?.maximumSize ?? eighthMaximum ?? 24.5) * scale,',
        );
      const marker = 'maximumSize = 24.5 * scale,';
      assert.equal(source.split(marker).length, 2);
      const fallback = source.includes('const eighthMaximum = eighthRulesMaximum(face);')
        ? 'eighthRulesMaximum(face) ?? 24.5'
        : source.includes('const eighth = eighthPrintingProfile(face)?.rules;')
          ? 'eighthPrintingProfile(face)?.rules.maximumSize ?? 24.5'
          : '24.5';
      return {
        code: source.replace(
          marker,
          'maximumSize = ((globalThis as any).__modernRulesStudy?.maximumSize ?? ' +
            fallback +
            ') * scale,',
        ),
        map: null,
      };
    },
  };
}
