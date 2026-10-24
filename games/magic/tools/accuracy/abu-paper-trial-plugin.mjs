import assert from 'node:assert/strict';
import { hash } from './common.mjs';
import { earlyFrameTrialPlugin } from './early-frame-trial-plugin.mjs';
/** Expose native constants and pass study-only pinline geometry to preparation. */
export function abuPaperTrialPlugin(proof) {
  const base = earlyFrameTrialPlugin({});
  return {
    ...base,
    name: 'abu-paper-pinline-native-trial',
    transform(source, id) {
      const file = id.split('/').at(-1);
      let code = base.transform(source, id);
      if (file === 'retro-dual-frame.ts') {
        const needle = '    pinline: undefined,';
        assert.equal(source.split(needle).length, 2);
        code = source.replace(needle, '    pinline: (face as any).__earlyFrameTrial?.pinline,');
      } else if (file === 'abu-dual-pinline.ts') {
        code =
          source +
          '\nexport function studyAbuPinline(){ return {box:ABU_DUAL_BOX,width,palette:PALETTE}; }\n';
      }
      if (!code) return;
      const item = { file, before: hash(source), after: hash(code) };
      if (proof[file]) assert.deepEqual(proof[file], item);
      proof[file] = item;
      return code;
    },
  };
}
