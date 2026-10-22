import assert from 'node:assert/strict';
export function walkerTextStudy() {
  return {
    name: 'm21-walker-text-study',
    enforce: 'pre',
    transform(source, id) {
      if (!id.endsWith('/presentation/planeswalker-rules.ts')) return;
      let code = source;
      const once = (a, b) => {
        assert.equal(code.split(a).length, 2, 'Changed walker rule source: ' + a);
        code = code.replace(a, b);
      };
      once(
        '  const abilities = specialRules(face),',
        '  const trial = (globalThis as any).__m21WalkerText ?? {};\n  const abilities = specialRules(face),',
      );
      once('    y = rect[1] * FACE_HEIGHT,', '    y = rect[1] * FACE_HEIGHT + (trial.dy ?? 0),');
      once(
        '    width = rect[2] * FACE_WIDTH,',
        '    width = rect[2] * FACE_WIDTH + (trial.width ?? 0),',
      );
      once(
        '    height = rect[3] * FACE_HEIGHT - (large ? 24 : sparse ? 4 : 16),',
        '    height = rect[3] * FACE_HEIGHT - (large ? 24 : sparse ? 4 : 16) + (trial.height ?? 0),',
      );
      once(
        '  const typography = large ? { ...RULES_TYPOGRAPHY, leading: 0.9 } : RULES_TYPOGRAPHY;',
        '  const typography = {...RULES_TYPOGRAPHY, leading: trial.leading ?? (large ? 0.9 : RULES_TYPOGRAPHY.leading)};',
      );
      once(
        '      : PLANESWALKER_RULE_GEOMETRY.staticTextLeft,',
        '      : PLANESWALKER_RULE_GEOMETRY.staticTextLeft) + (trial.dx ?? 0),',
      );
      once('    left: row.badges.length', '    left: (row.badges.length');
      once(
        '  let font = large ? 17.5 : sparse ? 24 : 19,',
        '  let font = (large ? 17.5 : sparse ? 24 : 19) + (trial.size ?? 0),',
      );
      return { code, map: null };
    },
  };
}
