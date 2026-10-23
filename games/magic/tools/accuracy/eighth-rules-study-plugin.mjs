import assert from 'node:assert/strict';
/** Study only: retain the current set ceiling unless a trial replaces it. */
export function eighthRulesStudyPlugin() {
  return {
    name: 'eighth-rules-budget-study',
    enforce: 'pre',
    transform(source, id) {
      if (!id.endsWith('/presentation/rules-paint.ts')) return;
      const current = `  const baseline = measuredOrdinaryTextLayout(
    context,
    face,
    height,
    scale,
    undefined,
    (eighth?.maximumSize ?? 24.5) * scale,
  );`;
      const modern = '  const baseline = measuredOrdinaryTextLayout(context, face, height, scale);';
      if (source.includes(current)) {
        assert.equal(source.split(current).length, 2);
        source = source.replace(current, modern);
      } else assert.equal(source.split(modern).length, 2);
      const marker = 'maximumSize = 24.5 * scale,';
      assert.equal(source.split(marker).length, 2);
      const fallback = source.includes('const eighth = eighthPrintingProfile(face)?.rules;')
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
