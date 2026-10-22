// Development-only source injection. Production tables and host inputs stay unchanged.
import assert from 'node:assert/strict';
import { hash } from './common.mjs';
export function modernManaStudy(parameters) {
  assert.equal(parameters.schema, 1);
  assert.equal(parameters.set, 'm21');
  const controls = parameters.rendererControls;
  const required = ['dx', 'dy', 'scaleX', 'scaleY', 'spacing'];
  const optional = ['numberScale', 'numberDx', 'numberDy', 'glyphs'];
  assert(required.every((key) => Object.hasOwn(controls, key)));
  assert(Object.keys(controls).every((key) => [...required, ...optional].includes(key)));
  assert.equal(controls.scaleX, controls.scaleY, 'Only an isotropic disc fit was measured');
  const ranges = {
    dx: [-2, 2],
    dy: [-2, 2],
    spacing: [-2, 3],
    scaleX: [0.94, 1.04],
    scaleY: [0.94, 1.04],
    numberScale: [0.88, 1.08],
    numberDx: [-1.5, 1.5],
    numberDy: [-1.5, 1.5],
  };
  for (const [key, value] of Object.entries(controls).filter(([key]) => key !== 'glyphs'))
    assert(
      Number.isFinite(value) && value >= ranges[key][0] && value <= ranges[key][1],
      'Invalid shared mana control',
    );
  if (controls.glyphs !== undefined) {
    assert(controls.glyphs && typeof controls.glyphs === 'object');
    assert(Object.keys(controls.glyphs).every((key) => ['W', 'U', 'B', 'R', 'G'].includes(key)));
    for (const delta of Object.values(controls.glyphs)) {
      assert.deepEqual(Object.keys(delta).sort(), ['dx', 'dy', 'scale']);
      assert(Number.isFinite(delta.scale) && delta.scale >= 0.9 && delta.scale <= 1.1);
      assert([delta.dx, delta.dy].every((v) => Number.isFinite(v) && Math.abs(v) <= 1.1));
    }
  }
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
