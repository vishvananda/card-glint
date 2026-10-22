// Development-only source injection. Production tables and host inputs stay unchanged.
import assert from 'node:assert/strict';
import { hash } from './common.mjs';
function validateControls(controls) {
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
}
export function modernManaStudy(parameters) {
  assert.equal(parameters.schema, 1);
  assert.equal(parameters.set, 'm21');
  const controls = parameters.rendererControls;
  validateControls(controls);
  if (parameters.walkerControls) validateControls(parameters.walkerControls);
  if (parameters.paperTargets) {
    assert(
      Object.keys(parameters.paperTargets).every((key) =>
        ['N', 'W', 'U', 'B', 'R', 'G'].includes(key),
      ),
    );
    for (const rgb of Object.values(parameters.paperTargets))
      assert(
        Array.isArray(rgb) &&
          rgb.length === 3 &&
          rgb.every((v) => Number.isFinite(v) && v >= 0 && v <= 255),
      );
    assert.match(parameters.source.paletteSourceHash, /^[a-f0-9]{64}$/);
  }
  if (parameters.shadow) {
    assert(Array.isArray(parameters.shadow) && parameters.shadow.length === 2);
    assert(parameters.shadow.every(Number.isFinite));
    assert(parameters.shadow[0] >= -3 && parameters.shadow[0] <= 0);
    assert(parameters.shadow[1] >= 0 && parameters.shadow[1] <= 4);
  }
  if (parameters.paperTargets || parameters.shadow || parameters.walkerControls)
    assert.match(parameters.source.costSourceHash, /^[a-f0-9]{64}$/);
  const walker = parameters.walkerControls
    ? "(face.setCode?.toLowerCase() === 'm21' && !face.frameTemplate && !face.frameAssetFamily && face.frameStyle !== 'retro' && (!face.layout || face.layout === 'normal' || face.layout === 'planeswalker') && /\\bPlaneswalker\\b/.test(face.canonicalTypeLine ?? face.typeLine ?? '') && (face.manaSymbols?.length ?? 0) > 0)"
    : 'false';
  return {
    name: 'm21-normal-mana-study',
    enforce: 'pre',
    transform(source, id) {
      if (
        id.endsWith('/presentation/modern-cost-mana.ts') &&
        (parameters.paperTargets || parameters.shadow || parameters.walkerControls)
      ) {
        assert.equal(
          hash(source),
          parameters.source.costSourceHash,
          'Changed cost material source',
        );
        const needle = '  return usesModernCostMana(face) ? MODERN : undefined;';
        assert.equal(source.split(needle).length, 2);
        const shadow = parameters.shadow
          ? ', shadow: ' + JSON.stringify(parameters.shadow) + ' as const'
          : '';
        const paper = parameters.paperTargets?.N
          ? ", ...(face.colorCalibration === 'set-hsb-v1' && face.calibration !== 'source' ? {paper: " +
            JSON.stringify(parameters.paperTargets.N) +
            ' as const} : {})'
          : '';
        return {
          code: source.replace(
            needle,
            '  return (usesModernCostMana(face) || ' +
              walker +
              ") ? (face.setCode?.toLowerCase() === 'm21' && (face.manaSymbols?.length ?? 0) > 0 ? {...MODERN" +
              shadow +
              paper +
              '} : MODERN) : undefined;',
          ),
          map: null,
        };
      }
      if (id.endsWith('/presentation/calibration-profiles.ts') && parameters.paperTargets) {
        assert.equal(
          hash(source),
          parameters.source.paletteSourceHash,
          'Changed mana palette source',
        );
        const needle = '  return MANA_PRINTING_TARGETS[key] ?? DUAL_MANA_TARGETS[key];';
        assert.equal(source.split(needle).length, 2);
        const targets = Object.fromEntries(
          Object.entries(parameters.paperTargets).map(([k, rgb]) => [k, rgb.map((v) => v / 255)]),
        );
        const early = parameters.walkerControls
          ? `  if (${walker} && face.colorCalibration === 'set-hsb-v1' && face.calibration !== 'source') return (${JSON.stringify(targets)} as Readonly<Record<string,Rgb>>)[symbol];\n`
          : '';
        const input = source.replace(
          '  if (!hasColorCalibration(face)) return undefined;',
          early + '  if (!hasColorCalibration(face)) return undefined;',
        );
        return {
          code: input.replace(
            needle,
            '  const trial: Readonly<Record<string, Rgb>> = ' +
              JSON.stringify(targets) +
              ';\n' +
              "  return face.setCode?.toLowerCase() === 'm21' && Object.hasOwn(trial, symbol) ? trial[symbol] : MANA_PRINTING_TARGETS[key] ?? DUAL_MANA_TARGETS[key];",
          ),
          map: null,
        };
      }
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
          (parameters.walkerControls
            ? `  if (${walker}) return {...MODERN_COMPONENT_MANA, ...${JSON.stringify(parameters.walkerControls)}};\n`
            : '') +
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
