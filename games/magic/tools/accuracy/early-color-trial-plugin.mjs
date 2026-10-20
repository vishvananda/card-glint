import assert from 'node:assert/strict';
import { hash } from './common.mjs';
import { earlyFrameTrialPlugin } from './early-frame-trial-plugin.mjs';
/** Source-local material candidates layered onto the geometry-only study plugin. */
export function earlyColorTrialPlugin(proof) {
  const base = earlyFrameTrialPlugin({});
  return {
    ...base,
    name: 'early-frame-color-native-trial',
    transform(source, id) {
      let code = base.transform(source, id);
      if (!code) return;
      const file = id.split('/').at(-1);
      if (file === 'printing-calibration-materials.ts') {
        const input = ' input=frameStudyOriginal(input);';
        const materials = '  const fallbackAssets: string[] = [];';
        assert.equal(code.split(input).length, 2);
        assert.equal(code.split(materials).length, 2);
        code = code.replace(
          input,
          ' const studyPigment=(input as any).__earlyFrameTrial?.pigment;\n' + input,
        );
        code = code.replace(
          materials,
          '  if(studyPigment)materials[studyPigment.asset]=studyPigment.adjustment;\n' + materials,
        );
      }
      const item = { file, before: hash(source), after: hash(code) };
      if (proof[file]) assert.deepEqual(proof[file], item);
      proof[file] = item;
      return code;
    },
  };
}
