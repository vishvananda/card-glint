import assert from 'node:assert/strict';
import { hash } from './common.mjs';
import { earlyDualPinlinePlugin } from './early-dual-pinline-plugin.mjs';
/** Exact native coverage controls, not scan-colored masks or fitted per-card geometry. */
export function earlyDualPinlinePalettePlugin(proof) {
  const base = earlyDualPinlinePlugin({});
  const once = (code, needle, value) => {
    assert.equal(code.split(needle).length, 2, 'Changed palette injection boundary: ' + needle);
    return code.replace(needle, value);
  };
  return {
    ...base,
    name: 'early-dual-pinline-palette-trial',
    transform(source, id) {
      const file = id.split('/').at(-1);
      let code = base.transform(source, id);
      if (file === 'abu-dual-pinline.ts') {
        code = once(
          code,
          'width: typeof width}',
          'width: typeof width; palette?: Readonly<Record<string,Rgb>>; edge?: Rgb}',
        );
        code = once(
          code,
          'const inks = pair.map((color) => PALETTE[color]);',
          'const inks = pair.map((color) => (study?.palette ?? PALETTE)[color]);',
        );
        code = once(
          code,
          '        width: studyWidth,',
          '        width: studyWidth,\n        edge: study?.edge,',
        );
      } else if (file === 'dual-land-pinline.ts') {
        assert.equal(
          hash(source),
          '601aa408b807db1e6e0ef14464e9eeb8f570d1679db05277ac3ff30924813744',
        );
        code = once(
          source,
          'export interface DualBorderGeometry {',
          'export interface DualBorderGeometry {\n  edge?: Rgb;',
        );
        code = once(
          code,
          '? INK : colors[band === 2 ? 1 : 0]!',
          '? (geometry.edge ?? INK) : colors[band === 2 ? 1 : 0]!',
        );
      }
      if (!code) return;
      const item = { file, before: hash(source), after: hash(code) };
      if (proof[file]) assert.deepEqual(proof[file], item);
      proof[file] = item;
      return code;
    },
  };
}
