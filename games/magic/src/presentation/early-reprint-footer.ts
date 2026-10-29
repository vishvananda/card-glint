import { inheritedOldFrameDefault } from '../calibration/old-frame-defaults.js';
import { paintEarlyExpansionStatsInk } from './early-expansion-stats.js';
import { type CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import { calibrationForFace } from '../calibration/selection.js';
import type { RenderedCardInput } from './face-layout.js';
import { earlyReprintFrame } from './early-reprint-frame.js';
import { paintPrintingElement } from './printing-elements.js';
import { paintTextInk } from './text-ink.js';
import { retroStatsText } from './retro-details.js';
import { paintEarlyReprintFooterInk } from './early-reprint-footer-ink.js';
import { paintSolidArtist } from './solid-artist.js';

export function earlyReprintFooter(face: RenderedCardInput) {
  if (inheritedOldFrameDefault(face)) return undefined;
  const frame = earlyReprintFrame(face);
  if (!frame) return undefined;
  const set = face.setCode!.toLowerCase();
  const p = calibrationForFace(face)!.footer;
  const light = p.legal.lightMaterials
    ? p.legal.lightMaterials.some(
        (m) => frame.material === m || frame.material?.startsWith(m + '-'),
      )
    : ['B', 'G', 'A'].includes(frame.material ?? '') ||
      (set === 'fem' && face.name === 'Ebon Stronghold');
  return {
    ...p,
    legalGray: light ? p.legal.lightGray : p.legal.darkGray,
    // Reviewed printing defaults, never a year inferred from an arbitrary set.
    legalText:
      face.legalText === undefined
        ? (p.legal.defaultText ??
          `© ${set === 'fem' ? '1994' : '1995'} Wizards of the Coast, Inc. All rights reserved.`)
        : face.legalText,
  };
}

/** Shared printing geometry for original and Oracle wording; explicit host
 * visibility, translations, legal text and stats ink remain authoritative. */
export function paintEarlyReprintFooter(c: CanvasContext, face: RenderedCardInput): boolean {
  const profile = earlyReprintFooter(face);
  if (!profile) return false;
  const paint = (
    role: 'artist' | 'legal' | 'stats',
    text: string,
    override?: { x: number; width: number; maxWidth: number; align: 'left' },
  ) => {
    const p = { ...profile[role], ...override };
    c.save();
    try {
      c.translate(p.x, p.y);
      c.scale(p.width, 1);
      const weight =
        role === 'stats' && profile.stats.weight !== undefined ? profile.stats.weight + ' ' : '';
      c.font = weight + `${p.size}px "CardRenderer MTG MPlantin", Georgia`;
      c.textAlign =
        role === 'artist'
          ? (profile.artist.align ?? 'left')
          : role === 'stats'
            ? 'right'
            : (profile.legal.align ?? 'left');
      if (override) c.textAlign = override.align;
      c.textBaseline =
        role === 'artist'
          ? (profile.artist.baseline ?? 'alphabetic')
          : role === 'stats'
            ? (profile.stats.baseline ?? 'alphabetic')
            : 'alphabetic';
      c.letterSpacing = '0px';
      const gray = 'gray' in p ? p.gray : profile.legalGray;
      const tint =
        role === 'artist' ? profile.artist.tint : role === 'stats' ? profile.stats.tint : undefined;
      const rgb = tint ? tint.map((value) => Math.round(value * gray)) : [gray, gray, gray];
      c.fillStyle = 'rgb(' + rgb.join(',') + ')';
      c.shadowColor = role === 'legal' ? 'transparent' : '#17140f';
      c.shadowBlur = 0;
      const max = override
        ? override.maxWidth / p.width
        : role === 'legal' && profile.legal.maxWidth !== undefined
          ? profile.legal.maxWidth / p.width
          : role === 'artist' && profile.artist.maxWidth !== undefined
            ? profile.artist.maxWidth / p.width
            : role === 'stats'
              ? 132 / p.width
              : Math.max(1, ((role === 'artist' ? 386 : 445) - p.x) / p.width);
      const ink = () =>
        role === 'artist' && profile.artist.inkStyle === 'separate-shadow'
          ? paintSolidArtist(c, text, 0, 0, max, p, c.fillStyle)
          : paintEarlyReprintFooterInk(c, text, max, p);
      if (role === 'stats' && profile.stats.inkStyle === 'separate-shadow')
        paintEarlyExpansionStatsInk(
          c,
          // Preserve the expansion painter's visible MPlantin minus glyph.
          text.replaceAll('-', '–'),
          max,
          { ...p, shadowTrim: profile.stats.shadowTrim ?? 0 },
          face.textInk,
          c.fillStyle,
        );
      else if (role === 'stats') paintTextInk(c, text, 0, 0, max, face.textInk, 'stats', ink);
      else ink();
    } finally {
      c.restore();
    }
  };
  if (face.power != null && face.toughness != null) paint('stats', retroStatsText(face));
  if (face.artist)
    paintPrintingElement(c, face, 'artist', () =>
      paint('artist', `${profile.artist.prefix ?? 'Illus. '}${face.artist}`),
    );
  if (profile.legal.collectorTotal !== undefined) {
    const total =
      face.collectorTotal === undefined ? profile.legal.collectorTotal : face.collectorTotal;
    const number = face.collectorNumber?.trim();
    const collector = number ? number + (total ? '/' + total : '') : '';
    const legal = profile.legalText ?? '';
    const prefix = legal + (legal && collector ? ' ' : '');
    const p = profile.legal;
    c.save();
    let advance: number, width: number;
    try {
      c.font = `${p.size}px "CardRenderer MTG MPlantin", Georgia`;
      c.letterSpacing = '0px';
      advance = c.measureText(prefix).width;
      width = c.measureText(prefix + collector).width;
    } finally {
      c.restore();
    }
    const sx = Math.min(p.width, (p.maxWidth ?? 440) / Math.max(1, width));
    const align = p.align ?? 'left';
    const start =
      p.x - (align === 'center' ? (width * sx) / 2 : align === 'right' ? width * sx : 0);
    // Measure the complete line once. Hiding either component preserves the
    // other's position, and host offsets remain in canonical face pixels.
    if (legal)
      paintPrintingElement(c, face, 'legal', () =>
        paint('legal', legal, { x: start, width: sx, maxWidth: 488, align: 'left' }),
      );
    if (collector)
      paintPrintingElement(c, face, 'collector', () =>
        paint('legal', collector, {
          x: start + advance * sx,
          width: sx,
          maxWidth: 488,
          align: 'left',
        }),
      );
  } else if (profile.legalText)
    paintPrintingElement(c, face, 'legal', () => paint('legal', profile.legalText!));
  return true;
}
