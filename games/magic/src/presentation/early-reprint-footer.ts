import { calibrationForFace } from '../calibration/selection.js';
import type { RenderedCardInput } from './face-layout.js';
import { earlyReprintFrame } from './early-reprint-frame.js';
import { paintPrintingElement } from './printing-elements.js';
import { paintTextInk } from './text-ink.js';
import { retroStatsText } from './retro-details.js';
import { paintEarlyReprintFooterInk } from './early-reprint-footer-ink.js';

export function earlyReprintFooter(face: RenderedCardInput) {
  const frame = earlyReprintFrame(face);
  if (!frame) return undefined;
  const set = face.setCode!.toLowerCase();
  const p = calibrationForFace(face)!.footer;
  const text = calibrationForFace(face)!.footerText;
  const light =
    ['B', 'G', 'A'].includes(frame.material ?? '') ||
    (set === 'fem' && face.name === 'Ebon Stronghold');
  return {
    ...p,
    artistPrefix: text?.artistPrefix ?? 'Illus. ',
    legalGray: light ? p.legal.lightGray : p.legal.darkGray,
    // Reviewed printing defaults, never a year inferred from an arbitrary set.
    legalText:
      face.legalText === undefined
        ? (text?.legal ??
          `© ${set === 'fem' ? '1994' : '1995'} Wizards of the Coast, Inc. All rights reserved.`)
        : face.legalText,
  };
}

/** Shared printing geometry for original and Oracle wording; explicit host
 * visibility, translations, legal text and stats ink remain authoritative. */
export function paintEarlyReprintFooter(
  c: CanvasRenderingContext2D,
  face: RenderedCardInput,
): boolean {
  const profile = earlyReprintFooter(face);
  if (!profile) return false;
  const paint = (role: 'artist' | 'legal' | 'stats', text: string) => {
    const p = profile[role];
    c.save();
    try {
      c.translate(p.x, p.y);
      c.scale(p.width, 1);
      c.font = `${p.size}px "CardRenderer MTG MPlantin", Georgia`;
      c.textAlign = role === 'stats' ? 'right' : 'left';
      c.textBaseline = 'alphabetic';
      c.letterSpacing = '0px';
      const gray = 'gray' in p ? p.gray : profile.legalGray;
      c.fillStyle = `rgb(${gray},${gray},${gray})`;
      c.shadowColor = role === 'legal' ? 'transparent' : '#17140f';
      c.shadowBlur = 0;
      const max =
        role === 'stats'
          ? 132 / p.width
          : Math.max(1, ((role === 'artist' ? 386 : 445) - p.x) / p.width);
      const ink = () => paintEarlyReprintFooterInk(c, text, max, p);
      if (role === 'stats') paintTextInk(c, text, 0, 0, max, face.textInk, 'stats', ink);
      else ink();
    } finally {
      c.restore();
    }
  };
  if (face.power != null && face.toughness != null) paint('stats', retroStatsText(face));
  if (face.artist)
    paintPrintingElement(c, face, 'artist', () =>
      paint('artist', `${profile.artistPrefix}${face.artist}`),
    );
  if (profile.legalText)
    paintPrintingElement(c, face, 'legal', () => paint('legal', profile.legalText!));
  return true;
}
