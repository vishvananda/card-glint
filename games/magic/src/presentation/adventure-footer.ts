import { paintTextInk } from './text-ink.js';
import { SECURITY_STAMP_RECTS } from './security-stamp-geometry.js';
import { hasOvalSecurityStamp } from './security-stamp-policy.js';
import type { CanvasImages } from './canvas-assets.js';
import type { RenderedCardInput } from './face-layout.js';
import { ADVENTURE_RECTS, adventurePt } from './adventure-frame.js';
import { SAGA_STAMP } from './saga-frame.js';

/** Known native Adventure families default to their printed collector style.
 * Hosts can select a style explicitly for reprints and custom cards. */
export function adventureCollectorText(face: RenderedCardInput) {
  const rarity = (face.rarity ?? 'common')[0]!.toUpperCase();
  const number = face.collectorNumber ?? '';
  const format =
    face.collectorFormat ??
    (face.setCode?.toLowerCase() === 'woe' ? 'rarity-first' : 'number-first');
  if (format === 'number-first') return `${number} ${rarity}`.trim();
  const serial = number.split('/')[0]!.replace(/^(\d+)/, (n) => n.padStart(4, '0'));
  return `${rarity} ${serial}`.trim();
}

export function paintAdventureFooter(
  c: CanvasRenderingContext2D,
  face: RenderedCardInput,
  images: CanvasImages,
) {
  const hasStats = face.power != null && face.toughness != null;
  if (hasStats) {
    const pt = images.get(adventurePt(face));
    if (!pt) throw Error('Adventure power/toughness plate is unavailable.');
    const [x, y, w, h] = ADVENTURE_RECTS.stats;
    c.drawImage(pt, x * 488, y * 680, w * 488, h * 680);
    c.fillStyle = '#17140f';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.font = '700 25px "CardRenderer MTG Beleren Small Caps", Georgia';
    paintTextInk(c, `${face.power}/${face.toughness}`, 420, 627, 77, face.textInk);
  }
  if (hasOvalSecurityStamp(face)) {
    const stamp = images.get(SAGA_STAMP);
    if (!stamp) throw Error('Adventure authenticity stamp is unavailable.');
    c.drawImage(stamp, ...SECURITY_STAMP_RECTS.saga);
  }
  c.fillStyle = '#fff';
  c.textAlign = 'left';
  c.textBaseline = 'alphabetic';
  c.font = '11px "CardRenderer MTG Relay", sans-serif';
  c.fillText(adventureCollectorText(face), 32, 645);
  c.fillText(`${face.setCode?.toUpperCase() ?? ''} • EN`, 32, 658);
  if (face.artist) {
    c.font = '11px "CardRenderer MTG Artist Credit", serif';
    c.fillText('a', 93, 658);
    c.font = '700 11px "CardRenderer MTG Beleren Small Caps", serif';
    c.fillText(face.artist, 108, 658, 210);
  }
  if (face.legalText) {
    c.textAlign = 'right';
    c.font = '10px "CardRenderer MTG MPlantin", Georgia';
    c.fillText(face.legalText, 454, 658, 182);
  }
}

let font: Promise<void> | null = null;
export function loadAdventureFont(): Promise<void> {
  return (font ??= document.fonts
    .load('700 25px "CardRenderer MTG Beleren Small Caps"')
    .then((fonts) => {
      if (!fonts.length || fonts.some((f) => f.status !== 'loaded'))
        throw Error('Inset card footer lettering needs card-glint/magic/fonts.css.');
    })
    .catch((error: unknown) => {
      font = null;
      throw error;
    }));
}
