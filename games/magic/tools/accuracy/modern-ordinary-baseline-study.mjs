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
        '966d7d689600a9b8314c58c235b4ae06c79e76674cf64ebeb1e17235b1a3b6d4',
        'Review changed ordinary plate selector before rebuilding the baseline',
      );
      // The material-identity helper remains exported. With selection disabled,
      // it also reports no palette override, matching the component baseline.
      const end = source.indexOf('\n/** Material identity', start);
      assert(end > start, 'Missing reviewed artifact-paper identity helper');
      return {
        code:
          source.slice(0, start) +
          'export function modernOrdinaryPlates(_face: RenderedCardInput) { return undefined; }\n' +
          source.slice(end),
        map: null,
      };
    },
  };
}
