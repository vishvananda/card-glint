import assert from 'node:assert/strict';
import { hash } from './common.mjs';
import { abuPaperTrialPlugin } from './abu-paper-trial-plugin.mjs';
/** Private trial after HSB and pinline composition; never installed in a build. */
export function abuPaperPanelTrialPlugin(proof) {
  const base = abuPaperTrialPlugin({});
  return {
    ...base,
    name: 'abu-paper-panel-native-trial',
    transform(source, id) {
      let code = base.transform(source, id);
      const file = id.split('/').at(-1);
      if (file === 'retro-dual-material.ts') {
        const needle = '            c.putImageData(pixels, 0, 0);';
        assert.equal(source.split(needle).length, 2);
        code =
          "import {reflowAbuPaperPanel} from '../../tools/accuracy/abu-paper-panel-pixels.mjs';\n" +
          source.replace(
            needle,
            '            reflowAbuPaperPanel(pixels, (plan.pinline as any)?.paperPanel);\n' +
              needle,
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
