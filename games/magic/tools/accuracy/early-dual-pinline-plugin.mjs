import assert from 'node:assert/strict';
import { hash } from './common.mjs';
import { earlyDualColorPlugin } from './early-dual-color-plugin.mjs';
/** Study-only shared pinline geometry, through the actual cached material pipeline. */
export function earlyDualPinlinePlugin(proof) {
  const base = earlyDualColorPlugin({});
  const once = (code, needle, value) => {
    assert.equal(code.split(needle).length, 2, 'Changed pinline injection boundary: ' + needle);
    return code.replace(needle, value);
  };
  return {
    ...base,
    name: 'early-dual-pinline-native-trial',
    transform(source, id) {
      const file = id.split('/').at(-1);
      let code = base.transform(source, id);
      if (file === 'abu-dual-pinline.ts') {
        assert.equal(
          hash(source),
          '0d3da0d20e86645b196828c3a83dd8c6d0f8c2d0f5280dd8dd26e74d92714100',
        );
        code = once(
          source,
          'colorAbuDualPinline(pixels: ImageData, colors: readonly string[]): void {',
          'colorAbuDualPinline(pixels: ImageData, colors: readonly string[], study?: {box: typeof ABU_DUAL_BOX; width: typeof width}): void {',
        );
        const split = code.indexOf('  if (colors.length !== 2) return;');
        assert(split > 0);
        const header = code.slice(0, split),
          body = code.slice(split);
        code =
          header +
          '  const studyBox = study?.box ?? ABU_DUAL_BOX;\n  const studyWidth = study?.width ?? width;\n' +
          body
            .replaceAll('ABU_DUAL_BOX', 'studyBox')
            .replace('        width,', '        width: studyWidth,');
      } else if (file === 'retro-dual-material.ts') {
        code = once(
          source,
          "          'abu-dual-frame-v3',",
          "          'abu-dual-frame-v3',\n          (face as any).__earlyFrameTrial?.pinline ?? null,",
        );
        code = once(
          code,
          'colorAbuDualPinline(pixels, retroLandColors(face));',
          'colorAbuDualPinline(pixels, retroLandColors(face), (face as any).__earlyFrameTrial?.pinline);',
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
