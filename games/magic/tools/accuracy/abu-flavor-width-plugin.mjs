// Study-only hooks: production source files are never written.
import assert from 'node:assert/strict';
import { hash } from './common.mjs';
export function abuFlavorWidthPlugin(transformed) {
  const once = (code, needle, replacement) => {
    assert.equal(code.split(needle).length, 2, 'Flavor-width study hook changed: ' + needle);
    return code.replace(needle, replacement);
  };
  return {
    name: 'abu-native-flavor-width-study',
    enforce: 'pre',
    transform(source, id) {
      const file = id.split('/').at(-1);
      let code;
      if (file === 'retro-rules.ts')
        code = once(
          source,
          '  return result;',
          '  return (globalThis as any).__abuFlavorApply?.(context, result) ?? result;',
        );
      else if (file === 'rules-layout.ts')
        code = once(
          source,
          '        let paragraphSize = size;',
          "        (globalThis as any).__abuFlavorRole = paragraph.role === 'flavor';\n        let paragraphSize = size;",
        );
      else if (file === 'rules-wrap.ts') {
        code = once(
          source,
          '    context.font = rulesFont(size, piece.italic);',
          '    const glyphWidth = textWidth * ((globalThis as any).__abuFlavorReflow && (globalThis as any).__abuFlavorRole && piece.italic ? (globalThis as any).__abuFlavorScale : 1);\n    context.font = rulesFont(size, piece.italic);',
        );
        for (const [a, b] of [
          [
            '...(piece.symbol || textWidth === 1 ? {} : { textWidth })',
            '...(piece.symbol || glyphWidth === 1 ? {} : { textWidth: glyphWidth })',
          ],
          ['metrics.width * textWidth', 'metrics.width * glyphWidth'],
          [
            '-metrics.actualBoundingBoxLeft * textWidth',
            '-metrics.actualBoundingBoxLeft * glyphWidth',
          ],
          [
            'metrics.actualBoundingBoxRight * textWidth',
            'metrics.actualBoundingBoxRight * glyphWidth',
          ],
        ])
          code = once(code, a, b);
      } else return;
      if (file === 'rules-layout.ts')
        code = once(
          code,
          '          bounds.width,\n          paragraphSize,',
          '          bounds.width + ((globalThis as any).__abuFlavorReflow && (globalThis as any).__abuFlavorRole ? ((globalThis as any).__abuFlavorWrapDelta ?? 0) : 0),\n          paragraphSize,',
        );
      const proof = { before: hash(source), after: hash(code) };
      if (transformed[file]) assert.deepEqual(transformed[file], proof);
      transformed[file] = proof;
      return code;
    },
  };
}
