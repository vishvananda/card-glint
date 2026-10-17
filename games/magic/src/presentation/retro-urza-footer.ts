import { paintLiveText } from './live-changes.js';
import { resolveFrameColors } from './profile.js';
import type { RenderedCardInput } from './face-layout.js';
/** Shared scan-normalized Urza footer. Keep the artist and legal line's ink,
 * baseline and shadow independent; never inherit the title's Canvas shadow. */
export function paintUrzaFooter(c: CanvasRenderingContext2D, face: RenderedCardInput): boolean {
  const set = face.setCode?.toLowerCase();
  if (!['usg', 'ulg', 'uds'].includes(set ?? '') || (face.layout ?? 'normal') !== 'normal')
    return false;
  c.save();
  c.textAlign = 'center';
  c.textBaseline = 'alphabetic';
  c.shadowColor = '#17140f';
  c.shadowOffsetX = c.shadowOffsetY = 1.5 * c.getTransform().a;
  c.fillStyle = '#f2eee3';
  c.font = '19px "CardRenderer MTG MPlantin", Georgia';
  // Long supplied credits must stay outside the creature's stats box.
  const artistWidth = face.power != null && face.toughness != null ? 292 : 365;
  if (face.artist) c.fillText(`Illus. ${face.artist}`, 244, 626, artistWidth);
  if (face.power != null && face.toughness != null) {
    c.shadowColor = '#000b';
    c.font = '27.8px "CardRenderer MTG MPlantin", Georgia';
    c.textBaseline = 'middle';
    c.shadowOffsetX = c.shadowOffsetY = c.getTransform().a;
    paintLiveText(
      c,
      `${face.power}/${face.toughness}`,
      (0.8074 + 0.1367 / 2) * 488,
      (0.895 + 0.043 / 2) * 680,
      0.1367 * 488,
      face.liveChanges,
    );
  }
  c.shadowColor = 'transparent';
  c.shadowOffsetX = c.shadowOffsetY = 0;
  c.textBaseline = 'alphabetic';
  c.font = '9.5px "CardRenderer MTG MPlantin", Georgia';
  const colors = resolveFrameColors(face);
  const lightLegal =
    !/\bLand\b/.test(face.typeLine ?? '') &&
    !(colors.length === 1 && ['W', 'R'].includes(colors[0]!));
  c.fillStyle = lightLegal ? '#f2eee3' : '#17140f';
  const year = set === 'usg' ? 1998 : 1999;
  const number = face.collectorNumber
    ? ` ${face.collectorNumber}/${set === 'usg' ? 350 : 143}`
    : '';
  const legal =
    face.legalText === undefined
      ? `©1993–${year} Wizards of the Coast, Inc.${number}`
      : face.legalText;
  if (legal) c.fillText(legal, 244, 640, 365);
  c.restore();
  return true;
}
