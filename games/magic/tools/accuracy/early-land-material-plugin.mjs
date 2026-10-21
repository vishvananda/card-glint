import assert from 'node:assert/strict';
import { hash } from './common.mjs';
import { earlyDualPinlinePalettePlugin } from './early-dual-pinline-palette-plugin.mjs';
/** Study-only source-bound land materials and independent full-frame outline source. */
export function earlyLandMaterialPlugin(proof) {
  const base = earlyDualPinlinePalettePlugin({});
  return {
    ...base,
    name: 'early-land-material-native-trial',
    transform(source, id) {
      const file = id.split('/').at(-1);
      let code = base.transform(source, id);
      if (file === 'retro-dual-frame.ts') {
        assert.equal(
          hash(source),
          'a174c92dd19cb19ed6851c5f694245dfcafe1bbdd2e86468937321f1e94515d3',
        );
        const needle =
          '    outline: `${root}${abuLandOutlineColor(colors, face.setCode)!.toLowerCase()}l.png`,';
        assert.equal(source.split(needle).length, 2);
        code = source.replace(
          needle,
          '    outline: (face as any).__earlyFrameTrial?.outline ?? `${root}${abuLandOutlineColor(colors, face.setCode)!.toLowerCase()}l.png`,',
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
