import assert from 'node:assert/strict';
import { hash } from './common.mjs';
import { earlyManaTrialPlugin } from './early-mana-trial-plugin.mjs';
export function earlyManaRetainedPlugin(proof) {
  const base = earlyManaTrialPlugin(proof);
  return {
    ...base,
    name: 'early-native-mana-retained-trial',
    transform(source, id) {
      if (!id.includes('/games/magic/src/presentation/')) return;
      const prior = base.transform(source, id);
      if (prior) return prior;
      const file = id.split('/').at(-1);
      let needle, replacement;
      if (file === 'retro-paint.ts') {
        needle = 'const costAdjustment = printingManaAdjustment(face);';
        replacement =
          'const costAdjustment = {...printingManaAdjustment(face)}; (globalThis as any).__abuManaAdjustment?.(costAdjustment);';
      } else if (file === 'printing-elements.ts') {
        needle = '  const option = face.printingElements?.[element];';
        replacement =
          '  if ((globalThis as any).__abuManaCapture?.(c,element,paint)) return;\n' + needle;
      } else if (file === 'canvas-text.ts') {
        needle = "  if (symbol === 'W' && images.originalWhiteGlyph) {";
        replacement = '  (globalThis as any).__manaStudyImages?.(images);\n' + needle;
      } else return;
      assert.equal(source.split(needle).length, 2, 'Changed mana retained boundary: ' + file);
      const code = source.replace(needle, replacement),
        item = { before: hash(source), after: hash(code) };
      if (proof[file]) assert.deepEqual(proof[file], item);
      proof[file] = item;
      return code;
    },
  };
}
