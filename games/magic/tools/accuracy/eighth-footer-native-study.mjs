import assert from 'node:assert/strict';
import { hash } from './common.mjs';
export function eighthFooterStudy(p, sourceHash) {
  for (const role of ['artist', 'stats']) {
    const v = p[role];
    assert(v);
    assert(Object.keys(v).sort().join(',') === 'dx,dy,height,width');
    assert([v.dx, v.dy, v.height, v.width].every(Number.isFinite));
    assert(
      Math.abs(v.dx) <= 4 &&
        Math.abs(v.dy) <= 4 &&
        v.height >= 0.9 &&
        v.height <= 1.1 &&
        v.width >= 0.9 &&
        v.width <= 1.1,
    );
  }
  return {
    name: 'eighth-footer-native-study',
    enforce: 'pre',
    transform(source, id) {
      if (!id.endsWith('/presentation/eighth-footer.ts')) return;
      assert.equal(hash(source), sourceHash);
      const stats = "    transformPlanarFooter(c, face, source, 'stats');";
      const artist = '      c.fillText(face.artist!, x, baseline, right - x);';
      assert.equal(source.split(stats).length, 2);
      assert.equal(source.split(artist).length, 2);
      const a = p.artist,
        t = p.stats;
      return {
        code: source
          .replace(
            stats,
            stats +
              `\n    c.translate(${407 + t.dx}, ${627 + t.dy}); c.scale(${t.width}, ${t.height}); c.translate(-407,-627);`,
          )
          .replace(
            artist,
            `      c.translate(${a.dx}, ${a.dy}); c.translate(x,baseline); c.scale(${a.width},${a.height}); c.translate(-x,-baseline);\n` +
              artist,
          ),
        map: null,
      };
    },
  };
}
