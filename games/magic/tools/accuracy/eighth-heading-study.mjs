// Development-only parameters applied before the real painter measures text.
import assert from 'node:assert/strict';
import { hash } from './common.mjs';
export function eighthHeadingStudy(parameters, expectedSource) {
  for (const role of ['title', 'type']) {
    const p = parameters[role];
    assert(p && Object.keys(p).sort().join(',') === 'dx,dy,size,width');
    assert([p.dx, p.dy, p.size, p.width].every(Number.isFinite));
    assert(Math.abs(p.dx) <= 12 && Math.abs(p.dy) <= 12);
    assert(p.size >= 0.85 && p.size <= 1.15 && p.width >= 0.85 && p.width <= 1.15);
  }
  return {
    name: 'eighth-measured-heading-trial',
    enforce: 'pre',
    transform(source, id) {
      if (!id.endsWith('/presentation/canvas-text.ts')) return;
      assert.equal(hash(source), expectedSource, 'Heading painter changed after trial was frozen');
      const marker =
        "  if (!(width > 0)) throw Error('Magic title/type plate has no text space.');";
      assert.equal(source.split(marker).length, 2);
      const injected = `  const study = (globalThis as typeof globalThis & { __eighthHeadingStudy?: { name: string; typeLine: string } }).__eighthHeadingStudy;
  const proposed = ${JSON.stringify(parameters)};
  const p = family === 'CardRenderer MTG Matrix' && study
    ? text === study.name ? proposed.title : text === study.typeLine ? proposed.type : undefined
    : undefined;
  if (p) { x += p.dx; y += p.dy; size *= p.size; widthScale *= p.width; }
`;
      return { code: source.replace(marker, injected + marker), map: null };
    },
  };
}
