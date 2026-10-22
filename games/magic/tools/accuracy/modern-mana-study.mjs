// Development-only source injection. Production tables and host inputs stay unchanged.
import assert from 'node:assert/strict';
import { hash } from './common.mjs';
export function modernManaStudy(parameters) {
  assert.equal(parameters.schema, 1);
  assert.equal(parameters.set, 'm21');
  const controls = parameters.rendererControls;
  assert.deepEqual(Object.keys(controls).sort(), ['dx', 'dy', 'scaleX', 'scaleY', 'spacing']);
  assert.equal(controls.scaleX, controls.scaleY, 'Only an isotropic disc fit was measured');
  const ranges = {
    dx: [-2, 2],
    dy: [-2, 2],
    spacing: [-2, 3],
    scaleX: [0.94, 1.04],
    scaleY: [0.94, 1.04],
  };
  for (const [key, value] of Object.entries(controls))
    assert(
      Number.isFinite(value) && value >= ranges[key][0] && value <= ranges[key][1],
      'Invalid shared mana control',
    );
  return {
    name: 'm21-normal-mana-study',
    enforce: 'pre',
    transform(source, id) {
      if (!id.endsWith('/presentation/printing-mana-adjustment.ts')) return;
      assert.equal(
        hash(source),
        parameters.source.profileSourceHash,
        'Changed mana source; review study hook',
      );
      const needle =
        '  if (usesModernCostMana(face)) return { ...MODERN_COMPONENT_MANA, ...MODERN_MANA_OVERRIDES[set] };';
      assert.equal(source.split(needle).length, 2);
      return {
        code: source.replace(
          needle,
          '  if (usesModernCostMana(face)) return { ...MODERN_COMPONENT_MANA, ...MODERN_MANA_OVERRIDES[set], ' +
            "...(set === 'm21' && (face.manaSymbols?.length ?? 0) > 0 ? " +
            JSON.stringify(controls) +
            ' : {}) };',
        ),
        map: null,
      };
    },
  };
}
