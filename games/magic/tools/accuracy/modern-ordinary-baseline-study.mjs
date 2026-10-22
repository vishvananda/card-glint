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
        'dd1ec695b339b1661daa2c554a6028462191eb18e486bd7b7426b1166efa8269',
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
