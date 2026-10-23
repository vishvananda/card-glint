import assert from 'node:assert/strict';
export function eighthRulesStudyPlugin() {
  return {
    name: 'eighth-rules-budget-study',
    enforce: 'pre',
    transform(source, id) {
      if (!id.endsWith('/presentation/rules-paint.ts')) return;
      const marker = 'maximumSize = 24.5 * scale,';
      assert.equal(source.split(marker).length, 2);
      return {
        code: source.replace(
          marker,
          'maximumSize = ((globalThis as any).__modernRulesStudy?.maximumSize ?? 24.5) * scale,',
        ),
        map: null,
      };
    },
  };
}
