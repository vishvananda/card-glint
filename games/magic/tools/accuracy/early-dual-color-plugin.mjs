import assert from 'node:assert/strict';
import { hash } from './common.mjs';
import { earlyFrameTrialPlugin } from './early-frame-trial-plugin.mjs';
/** Multiple source-bound materials; experimental data never enters the pack. */
export function earlyDualColorPlugin(proof) {
  const base = earlyFrameTrialPlugin({});
  return {
    ...base,
    name: 'early-dual-color-native-trial',
    transform(source, id) {
      let code = base.transform(source, id);
      if (!code) return;
      const file = id.split('/').at(-1);
      if (file === 'printing-calibration-materials.ts') {
        const input = ' input=frameStudyOriginal(input);',
          boundary = '  const fallbackAssets: string[] = [];';
        assert.equal(code.split(input).length, 2);
        assert.equal(code.split(boundary).length, 2);
        code = code.replace(
          input,
          ' const studyPigments=(input as any).__earlyFrameTrial?.pigments;\n' + input,
        );
        code = code.replace(
          boundary,
          '  if(studyPigments)Object.assign(materials,studyPigments);\n' + boundary,
        );
      }
      const item = { file, before: hash(source), after: hash(code) };
      if (proof[file]) assert.deepEqual(proof[file], item);
      proof[file] = item;
      return code;
    },
  };
}
