// Study-only ink weight, through the production cached material preparation.
import assert from 'node:assert/strict';
import { hash } from './common.mjs';
import { earlyManaTrialPlugin } from './early-mana-trial-plugin.mjs';
export function earlyManaInkPlugin(proof) {
  const base = earlyManaTrialPlugin(proof);
  return {
    ...base,
    name: 'early-native-mana-ink-trial',
    transform(source, id) {
      if (!id.split('?')[0].includes('/games/magic/src/presentation/')) return;
      if (id.split('?')[0].endsWith('/historical-mana.ts')) {
        const needle = '  return asset && ink ? { ...asset, inkExpansion: ink.pixels } : asset;';
        assert.equal(source.split(needle).length, 2, 'Historical mana ink boundary changed');
        let code = source.replace(
          needle,
          `  const trial = (face as any).__earlyManaTrial;
  const amount = trial?.inkExpansion?.[symbol];
  if (asset && amount !== undefined) {
    if (!Number.isFinite(amount) || amount < 0 || amount > 1) throw Error('Invalid trial ink expansion');
    return { ...asset, inkExpansion: amount };
  }
${needle}`,
        );
        const paperBoundary =
          'export function historicalManaPaperSample(face: RenderedCardInput, symbol: string) {';
        assert.equal(code.split(paperBoundary).length, 2, 'Historical mana paper boundary changed');
        code = code.replace(
          paperBoundary,
          paperBoundary +
            `
  if (((face as any).__earlyManaTrial?.inkExpansion?.[symbol] ?? 0) > 0) return 'opaque-percentile';`,
        );
        const item = { before: hash(source), after: hash(code) };
        if (proof['historical-mana.ts']) assert.deepEqual(proof['historical-mana.ts'], item);
        proof['historical-mana.ts'] = item;
        return code;
      }
      return base.transform(source, id);
    },
  };
}
