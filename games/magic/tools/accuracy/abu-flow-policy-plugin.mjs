// Study-only shared flow rules. No renderer files or per-card scan poses are changed.
import assert from 'node:assert/strict';
import { hash } from './common.mjs';
export function abuFlowPolicyPlugin(proof) {
  const once = (s, a, b) => {
    assert.equal(s.split(a).length, 2, 'Flow-policy hook changed: ' + a);
    return s.replace(a, b);
  };
  return {
    name: 'abu-flow-policy',
    enforce: 'pre',
    transform(source, id) {
      const file = id.split('/').at(-1);
      let code;
      if (file === 'retro-rules.ts') {
        code = once(
          source,
          'precise.lines.length <= legacy.lines.length',
          'precise.lines.length <= ((globalThis as any).__abuFlow?.smallSeven && legacy.size < 19 ? Math.max(7,legacy.lines.length) : legacy.lines.length)',
        );
      } else if (file === 'early-text-tiers.ts') {
        code = once(
          source,
          '  options = { ...reviewedOriginalTextLayout(face, reference), ...options };',
          '  const reviewed={...reviewedOriginalTextLayout(face,reference)};\n  if ((globalThis as any).__abuFlow?.zeroCentered) delete reviewed.centeredDy;\n  options={...reviewed,...options};',
        );
        code = once(
          code,
          "    const blocks = paragraphs.map((p) => ({ ...p, align: p.align ?? 'center' }));",
          "    const keyword=(globalThis as any).__abuFlow?.keyword && paragraphs.length===2 && paragraphs.every(p=>p.role==='rules') && paragraphs[0]!.runs.map(r=>r.text).join('').length<=15;\n    const blocks = paragraphs.map((p) => ({ ...p, align: keyword ? 'left' as const : p.align ?? 'center' }));",
        );
        code = once(
          code,
          'width: options.largeFitWidth ?? options.centeredWidth ?? 340,',
          'width: options.largeFitWidth ?? options.centeredWidth ?? (keyword ? 374 : 340),',
        );
        code = once(
          code,
          'width: options.centeredWidth ?? 348,',
          'width: options.centeredWidth ?? (keyword ? 374 : 348),',
        );
        code = once(
          code,
          'textWidth: options.denseWidth ?? 0.98',
          'textWidth: options.denseWidth ?? ((globalThis as any).__abuFlow?.denseOne ? 1 : 0.98)',
        );
      } else return;
      const item = { before: hash(source), after: hash(code) };
      if (proof[file]) assert.deepEqual(proof[file], item);
      proof[file] = item;
      return code;
    },
  };
}
