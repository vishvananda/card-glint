import assert from 'node:assert/strict';
import { hash } from './common.mjs';
export function abuDualArtTrialPlugin(proof) {
  const once = (s, n, r) => {
    assert.equal(s.split(n).length, 2, 'Art trial hook changed');
    return s.replace(n, r);
  };
  return {
    name: 'abu-dual-art-height-trial',
    enforce: 'pre',
    transform(source, id) {
      const file = id.split('/').at(-1);
      let code;
      if (file === 'retro-frame.ts') {
        code = once(
          source,
          '? [0.116, 0.1043, 0.7654, 0.441]',
          "? [0.116, 0.1043, 0.7654, 0.441 - (['lea','leb'].includes(face.setCode?.toLowerCase()??'') && retroDualFrame(face) ? ((globalThis as any).__abuArtBottom??0)/680 : 0)]",
        );
      } else if (file === 'retro-dual-material.ts') {
        code = once(
          source,
          "          'abu-dual-frame-v4',",
          "          'abu-dual-frame-v4',\n          ...((globalThis as any).__abuArtBottom===null?[]:['art-height-trial',(globalThis as any).__abuArtBottom]),",
        );
        code =
          "import {reflowAbuDualArt} from '../../tools/accuracy/abu-dual-art-pixels.mjs';\n" +
          once(
            code,
            '            c.putImageData(pixels, 0, 0);',
            '            if (reflowPaper) reflowAbuDualArt(pixels,(globalThis as any).__abuArtBottom??0);\n            c.putImageData(pixels, 0, 0);',
          );
      } else return;
      const item = { before: hash(source), after: hash(code) };
      if (proof[file]) assert.deepEqual(proof[file], item);
      proof[file] = item;
      return code;
    },
  };
}
