import assert from 'node:assert/strict';
import { hash } from './common.mjs';
/** Study-only controls; never installed in a library build. */
export function earlyFrameTrialPlugin(proof) {
  const once = (code, needle, value) => {
    assert.equal(code.split(needle).length, 2, 'Changed trial injection boundary: ' + needle);
    return code.replace(needle, value);
  };
  return {
    name: 'early-frame-native-trial',
    enforce: 'pre',
    transform(code, id) {
      const file = id.split('/').at(-1),
        before = code;
      if (file === 'retro-frame.ts') {
        for (const [name, field] of [
          ['retroFamily', 'family'],
          ['retroFrameRect', 'frame'],
          ['retroFrameAsset', 'asset'],
          ['retroBorderMask', 'mask'],
        ]) {
          const signature = new RegExp(
            'export function ' + name + '\\(face: RenderedCardInput\\)([^\\{]*)\\{',
          );
          const found = code.match(signature);
          assert(found, name);
          code = code.replace(
            found[0],
            found[0] +
              `\n const study=(face as any).__earlyFrameTrial; if(study?.${field})return study.${field};`,
          );
        }
        code = once(
          code,
          '    art: (earlyReprintFrame(face)?.art ??',
          '    art: ((face as any).__earlyFrameTrial?.art ?? earlyReprintFrame(face)?.art ??',
        );
      } else if (file === 'retro-paint.ts') {
        code = once(
          code,
          '  const stockWindow =\n    earlyReprintFrame(face)?.stockWindow ??',
          '  const stockWindow =\n    (face as any).__earlyFrameTrial?.stockWindow ?? earlyReprintFrame(face)?.stockWindow ??',
        );
        code = once(
          code,
          'paintRetroStockBorder(c, mask, retroPx(rect.frame), stock);',
          'paintRetroStockBorder(c, mask, retroPx((face as any).__earlyFrameTrial?.stockMaskFrame ?? rect.frame), stock);',
        );
      } else if (file === 'canvas-face.ts') {
        code = once(
          code,
          "    'canvas-face-v148',",
          "    'canvas-face-v148',\n    (face as any).__earlyFrameTrial ?? null,",
        );
      } else if (file === 'printing-calibration-materials.ts') {
        code = once(
          code,
          'export function printingCalibrationMaterials(input: RenderedCardInput) {',
          'export function printingCalibrationMaterials(input: RenderedCardInput) {\n input=frameStudyOriginal(input);',
        );
        code = once(
          code,
          'const normalized = calibrationFace(face);',
          'const normalized = calibrationFace(frameStudyOriginal(face));',
        );
        code += `\nfunction frameStudyOriginal(face: RenderedCardInput):RenderedCardInput { if(!(face as any).__earlyFrameTrial)return face; const original={...face};delete (original as any).__earlyFrameTrial;return original;}\n`;
      } else return;
      const item = { file, before: hash(before), after: hash(code) };
      if (proof[file]) assert.deepEqual(proof[file], item);
      proof[file] = item;
      return code;
    },
  };
}
