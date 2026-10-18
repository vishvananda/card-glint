import type { RenderedCardInput } from './face-layout.js';
import { earlyReprintFrame } from './early-reprint-frame.js';
import { paintPrintingElement } from './printing-elements.js';
import { paintTextInk } from './text-ink.js';
import { retroStatsText } from './retro-details.js';
import { paintEarlyReprintFooterInk } from './early-reprint-footer-ink.js';

const profiles = {
  fem: {
    artist: { x: 48.5, y: 630.5, size: 20, width: 0.96, shadow: 2, trim: 0.3, gray: 225 },
    legal: {
      x: 48,
      y: 645,
      size: 13,
      width: 1.015,
      shadow: 0,
      trim: 0,
      lightGray: 194,
      darkGray: 29,
    },
    stats: { x: 452, y: 631, size: 28, width: 0.99, shadow: 1.5, trim: 0.3, gray: 218 },
  },
  '4ed': {
    artist: { x: 43, y: 626.5, size: 19, width: 1, shadow: 1.25, trim: 0.2, gray: 238 },
    legal: {
      x: 41.25,
      y: 640.5,
      size: 11,
      width: 1,
      shadow: 0,
      trim: 0,
      lightGray: 205,
      darkGray: 42,
    },
    stats: { x: 451.75, y: 634.5, size: 27, width: 1.03, shadow: 1, trim: 0.3, gray: 238 },
  },
  chr: {
    artist: { x: 42, y: 626.5, size: 19, width: 0.995, shadow: 1.25, trim: 0.2, gray: 227 },
    legal: {
      x: 41.75,
      y: 640.5,
      size: 11,
      width: 1,
      shadow: 0,
      trim: 0,
      lightGray: 186,
      darkGray: 45,
    },
    stats: { x: 451.5, y: 634.5, size: 27.5, width: 1, shadow: 1.25, trim: 0.3, gray: 229 },
  },
} as const;

export function earlyReprintFooter(face: RenderedCardInput) {
  const frame = earlyReprintFrame(face);
  if (!frame) return undefined;
  const set = face.setCode!.toLowerCase() as keyof typeof profiles;
  const p = profiles[set];
  const light =
    ['B', 'G', 'A'].includes(frame.material ?? '') ||
    (set === 'fem' && face.name === 'Ebon Stronghold');
  return {
    ...p,
    legalGray: light ? p.legal.lightGray : p.legal.darkGray,
    // Reviewed printing defaults, never a year inferred from an arbitrary set.
    legalText:
      face.legalText === undefined
        ? `© ${set === 'fem' ? '1994' : '1995'} Wizards of the Coast, Inc. All rights reserved.`
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
    paintPrintingElement(c, face, 'artist', () => paint('artist', `Illus. ${face.artist}`));
  if (profile.legalText)
    paintPrintingElement(c, face, 'legal', () => paint('legal', profile.legalText!));
  return true;
}
