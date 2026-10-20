// Source-local study controls for the production cached mana preparation path.
import assert from 'node:assert/strict';
import { hash } from './common.mjs';
export function earlyManaTrialPlugin(proof) {
  return {
    name: 'early-native-mana-profile-trial',
    enforce: 'pre',
    transform(source, id) {
      const file = id.split('/').at(-1);
      let code = source;
      const once = (needle, replacement) => {
        assert.equal(code.split(needle).length, 2, 'Mana study boundary changed: ' + needle);
        code = code.replace(needle, replacement);
      };
      if (file === 'early-reprint-mana.ts') {
        for (const [signature, value] of [
          ['export function earlyReprintMana(face: RenderedCardInput): boolean {', 'true'],
          [
            'export function earlyReprintManaDefaults(face: RenderedCardInput) {',
            'trial.geometry ?? {}',
          ],
          [
            'export function earlyReprintManaTarget(face: RenderedCardInput, symbol: string) {',
            "trial.paper[symbol === 'X' ? 'N' : symbol]",
          ],
          ['export function earlyReprintManaInk(face: RenderedCardInput) {', 'trial.ink'],
        ])
          once(
            signature,
            signature +
              '\n const trial=(face as any).__earlyManaTrial; if(trial)return ' +
              value +
              ';',
          );
      } else if (file === 'canvas-face.ts') {
        once(
          "    'canvas-face-v148',",
          "    'canvas-face-v148',\n    (face as any).__earlyManaTrial ?? null,",
        );
      } else return;
      const item = { before: hash(source), after: hash(code) };
      if (proof[file]) assert.deepEqual(proof[file], item);
      proof[file] = item;
      return code;
    },
  };
}
