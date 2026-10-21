import assert from 'node:assert/strict';

/** A source-bound experiment: preserve measured component lettering, cost
 * materials and P/T while replacing only the ordinary frame source. */
export function modernPlateControlsStudy() {
  const replace = (source, before, after, label) => {
    assert.equal(source.split(before).length, 2, 'Review retained plate control: ' + label);
    return source.replace(before, after);
  };
  return {
    name: 'modern-plate-retained-controls',
    enforce: 'pre',
    transform(source, id) {
      let code = source;
      if (id.endsWith('/presentation/modern-cost-mana.ts')) {
        code = replace(
          code,
          'face.frameAssetFamily === undefined &&',
          "(face.frameAssetFamily === undefined || face.frameAssetFamily === 'm15-accurate') &&",
          'cost assets',
        );
      } else if (id.endsWith('/presentation/frame-plates.ts')) {
        code = replace(
          code,
          'import { FACE_RECTS, cardStock,',
          'import { FACE_RECTS, FACE_TEXT, cardStock,',
          'geometry constants',
        );
        code = "import { profileAssets } from './assets.js';\n" + code;
        code = replace(
          code,
          '    pt: shifted\n',
          '    pt: !eighth ? profileAssets(profile).pt : shifted\n',
          'badge asset',
        );
        code = replace(
          code,
          'stats: planarGeometry ? planarBadgeRect(stats, shifted) : stats,',
          'stats: eighth ? (planarGeometry ? planarBadgeRect(stats, shifted) : stats) : FACE_RECTS.stats,',
          'badge geometry',
        );
        code = replace(
          code,
          'right: (eighth ? 0.9147 : 1864 / 2010) - (eighth ? 2 : 1) / 488,',
          'right: eighth ? 0.9147 - 2 / 488 : FACE_RECTS.title[0] + FACE_RECTS.title[2] - FACE_TEXT.plateRight / 488,',
          'cost right',
        );
        code = replace(
          code,
          'center: title[1] + title[3] / 2 + (eighth ? 1 : -4) / 680,',
          'center: eighth ? title[1] + title[3] / 2 + 1 / 680 : FACE_RECTS.title[1] + FACE_RECTS.title[3] / 2 + FACE_TEXT.manaLift / (2 * 680),',
          'cost baseline',
        );
        code = replace(
          code,
          'size: eighth ? 22 : 23.4,',
          'size: eighth ? 22 : FACE_TEXT.manaSize,',
          'cost size',
        );
        code = replace(
          code,
          '      gap: 1.5,',
          '      gap: eighth ? 1.5 : FACE_TEXT.manaGap,',
          'cost spacing',
        );
      } else if (id.endsWith('/presentation/frame-plate-paint.ts')) {
        code = replace(
          code,
          '  FACE_WIDTH as W,',
          '  FACE_RECTS,\n  FACE_TEXT,\n  FACE_WIDTH as W,',
          'text constants',
        );
        code = replace(
          code,
          'const [tx, ty, tw, th] = px(rects.title),',
          'const [titleX, ty, tw, th] = px(eighth ? rects.title : FACE_RECTS.title),\n    tx = titleX + (eighth ? 0 : FACE_TEXT.plateLeft + 1),',
          'title position',
        );
        code = replace(
          code,
          "if (eighth) c.translate(...titleTranslation(face, 'eighth'));",
          "c.translate(...titleTranslation(face, eighth ? 'eighth' : 'modern'));\n  if (!eighth) c.letterSpacing = \`\${FACE_TEXT.titleTracking}px\`;",
          'title offset and tracking',
        );
        code = replace(
          code,
          '    ty + th / 2,\n    cost.length ? adjustedMana[0] - tx - 8 : tw,',
          '    ty + th / 2 + (eighth ? 0 : 1),\n    eighth ? (cost.length ? adjustedMana[0] - tx - 8 : tw) : adjustedMana[0] - tx - (cost.length ? FACE_TEXT.titleGap : 0),',
          'title width and baseline',
        );
        code = replace(
          code,
          'c.font = \`bold 25px "\${family}", Georgia\`;',
          'c.font = \`bold \${FACE_TEXT.statsFont}px "\${family}", Georgia\`;',
          'stats size',
        );
        code = replace(
          code,
          '      sx + sw * 0.52,\n      sy + sh * 0.52,\n      sw * 0.85,',
          '      sx + sw / 2,\n      sy + FACE_TEXT.statsLine / 2 + 2,\n      sw,',
          'stats ink placement',
        );
      } else return;
      return { code, map: null };
    },
  };
}
