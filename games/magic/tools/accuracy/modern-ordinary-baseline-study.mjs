import assert from 'node:assert/strict';
import { hash } from './common.mjs';

/** Development-only control: same current renderer, with the newly adopted
 * ordinary plate selector disabled. No inputs, wording or other styles change. */
export function modernOrdinaryBaselineStudy() {
  return {
    name: 'm21-component-source-baseline',
    enforce: 'pre',
    transform(source, id) {
      if (!id.endsWith('/presentation/modern-printing-profile.ts')) return;
      const marker = 'export function modernOrdinaryPlates(';
      assert.equal(source.split(marker).length, 2);
      const start = source.indexOf(marker);
      assert.equal(
        hash(source.slice(start)),
        'df68dda0a4126df9fe0d39413f95a1f58fda215968e6cfea9460a6f8cb7603af',
        'Review changed ordinary plate selector before rebuilding the baseline',
      );
      return {
        code:
          source.slice(0, start) +
          'export function modernOrdinaryPlates(_face: RenderedCardInput) { return undefined; }\n',
        map: null,
      };
    },
  };
}
