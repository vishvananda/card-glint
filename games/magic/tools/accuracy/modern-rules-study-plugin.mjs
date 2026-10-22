import assert from 'node:assert/strict';

/** Offline text-only experiment. Current parameters are an empty object.
 * Every hook is source-bound; production code and host inputs stay untouched. */
export function modernRulesStudyPlugin() {
  const once = (source, needle, replacement) => {
    assert.equal(source.split(needle).length, 2, 'Review modern rules study hook: ' + needle);
    return source.replace(needle, replacement);
  };
  return {
    name: 'modern-rules-study',
    enforce: 'pre',
    transform(source, id) {
      let code = source;
      if (id.endsWith('/presentation/rules-wrap.ts')) {
        code = once(
          code,
          '"CardRenderer MTG MPlantin"',
          '"' +
            '$' +
            "{(globalThis as any).__modernRulesStudy?.fontFamily ?? 'CardRenderer MTG MPlantin'}\"",
        );
      } else if (id.endsWith('/presentation/rules-paint.ts')) {
        code = once(
          code,
          '    ...RULES_TYPOGRAPHY,',
          '    ...RULES_TYPOGRAPHY,\n    ...((globalThis as any).__modernRulesStudy?.typography ?? {}),',
        );
        code = once(
          code,
          '  const reference =\n',
          '  const study = (globalThis as any).__modernRulesStudy ?? {};\n' +
            '  bounds.x += study.dx ?? 0; bounds.y += study.dy ?? 0;\n' +
            '  bounds.width += study.widthDelta ?? 0; bounds.height += study.heightDelta ?? 0;\n' +
            '  const reference =\n',
        );
        assert.equal(code.split('24.5 * scale').length, 3);
        code = code.replaceAll(
          '24.5 * scale',
          '((globalThis as any).__modernRulesStudy?.maximumSize ?? 24.5) * scale',
        );
      } else return;
      return { code, map: null };
    },
  };
}
