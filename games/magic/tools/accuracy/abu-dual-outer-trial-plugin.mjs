import assert from 'node:assert/strict';
import { hash } from './common.mjs';
/** Diagnostic perimeter-only redraw. Interior frame/art coordinates stay fixed. */
export function abuDualOuterTrialPlugin(proof) {
  return {
    name: 'abu-dual-outer-native-trial',
    enforce: 'pre',
    transform(source, id) {
      if (id.split('/').at(-1) !== 'retro-paint.ts') return;
      const boundary = '    c.drawImage(frame, ...retroPx(rect.frame));';
      assert.equal(source.split(boundary).length, 2);
      const code = source.replace(
        boundary,
        boundary +
          `
    const outerTrial=(face as any).__earlyFrameTrial?.outerFrame;
    if(outerTrial){
      c.save();
      c.beginPath();
      c.rect(0,0,488,680);
      c.rect(45,45,398,587);
      c.clip('evenodd');
      const savedFilter=c.filter;
      c.filter='none';
      c.fillStyle=stock;
      c.fillRect(0,0,488,680);
      c.filter=savedFilter;
      c.drawImage(frame,...retroPx(outerTrial));
      c.restore();
    }`,
      );
      const row = { file: 'retro-paint.ts', before: hash(source), after: hash(code) };
      if (proof.outerPaint) assert.deepEqual(proof.outerPaint, row);
      proof.outerPaint = row;
      return code;
    },
  };
}
