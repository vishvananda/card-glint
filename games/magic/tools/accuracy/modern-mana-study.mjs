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
  const normal =
    "(face.setCode?.toLowerCase() === 'm21' && usesModernCostMana(face) && !/\\bPlaneswalker\\b/.test(face.canonicalTypeLine ?? face.typeLine ?? '') && (face.manaSymbols?.length ?? 0) > 0)";
  const patch = (source, expected, message, needle, replacement) => {
    assert.equal(hash(source), expected, message);
    assert.equal(source.split(needle).length, 2, message + '; review study hook');
    return { code: source.replace(needle, replacement), map: null };
  };
  return {
    name: 'm21-normal-mana-study',
    enforce: 'pre',
    transform(source, id) {
      if (
        id.endsWith('/presentation/modern-cost-mana.ts') &&
        (parameters.paperTargets || parameters.shadow || parameters.walkerControls)
      ) {
        const needle = 'export function modernCostMana(face: RenderedCardInput) {';
        const shadow = parameters.shadow
          ? ', shadow: ' + JSON.stringify(parameters.shadow) + ' as const'
          : '';
        const paper = parameters.paperTargets?.N
          ? ", ...(face.colorCalibration === 'set-hsb-v1' && face.calibration !== 'source' ? {paper: " +
            JSON.stringify(parameters.paperTargets.N) +
            ' as const} : {})'
          : '';
        return patch(
          source,
          parameters.source.costSourceHash,
          'Changed cost material source',
          needle,
          needle +
            '\n const base = modernCostManaStudyBase(face);\n return (' +
            normal +
            ' || ' +
            walker +
            ') ? {...(base ?? MODERN)' +
            shadow +
            paper +
            '} : base;\n}\n' +
            'function modernCostManaStudyBase(face: RenderedCardInput) {',
        );
      }
      if (id.endsWith('/presentation/calibration-profiles.ts') && parameters.paperTargets) {
        const needle =
          'export function calibratedManaTarget(face: RenderedCardInput, symbol: string): Rgb | undefined {';
        const targets = Object.fromEntries(
          Object.entries(parameters.paperTargets).map(([k, rgb]) => [k, rgb.map((v) => v / 255)]),
        );
        return patch(
          source,
          parameters.source.paletteSourceHash,
          'Changed mana palette source',
          needle,
          needle +
            '\n const trial: Readonly<Record<string,Rgb>> = ' +
            JSON.stringify(targets) +
            ';\n' +
            " if (face.setCode?.toLowerCase() === 'm21' && (hasColorCalibration(face) || " +
            walker +
            ") && face.colorCalibration === 'set-hsb-v1' && face.calibration !== 'source' && Object.hasOwn(trial,symbol)) return trial[symbol];\n" +
            ' return calibratedManaTargetStudyBase(face,symbol);\n}\n' +
            'function calibratedManaTargetStudyBase(face: RenderedCardInput, symbol: string): Rgb | undefined {',
        );
      }
      if (!id.endsWith('/presentation/printing-mana-adjustment.ts')) return;
      const needle = "  const set = face.setCode?.toLowerCase() ?? '';";
      return patch(
        source,
        parameters.source.profileSourceHash,
        'Changed mana source',
        needle,
        needle +
          '\n' +
          (parameters.walkerControls
            ? '  if (' +
              walker +
              ') return {...MODERN_COMPONENT_MANA, ...' +
              JSON.stringify(parameters.walkerControls) +
              '};\n'
            : '') +
          '  if (' +
          normal +
          ') return {...MODERN_COMPONENT_MANA, ...' +
          JSON.stringify(controls) +
          '};',
      );
    },
  };
}
