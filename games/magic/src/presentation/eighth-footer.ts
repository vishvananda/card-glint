import { printingCollectorText, printingLegalText } from './printing-footer.js';
import { resolveCardProfile } from './profile.js';
import { CONJURER_ROOT } from './styled-set-symbols.js';
import type { RenderedCardInput } from './face-layout.js';
import type { CanvasImages } from './canvas-assets.js';
import { transformPlanarFooter, planarStatsFont } from './planar-footer.js';

function lightCredit(face: RenderedCardInput): boolean {
  return ['B', 'Colourless', 'Land'].includes(resolveCardProfile(face).boxes);
}

export function eighthArtistBrush(face: RenderedCardInput): string | null {
  if (face.frameAssetFamily !== 'eighth' || !face.artist) return null;
  return `${CONJURER_ROOT}/img/manaSymbols/${lightCredit(face) ? 'whitebrush' : 'brush'}.svg`;
}

/** The imported small-caps font maps '*' to a dot. Printed variable stats use
 * a five-point star, including inside expressions such as 1+*. Keep that symbol
 * independent of the font's legacy character encoding. */
function paintStats(c: CanvasRenderingContext2D, text: string): void {
  if (!text.includes('*')) {
    c.fillText(text, 407, 627, 78);
    return;
  }
  const runs = text.split(/(\*)/).filter(Boolean);
  const widths = runs.map((run) => (run === '*' ? 15 : c.measureText(run).width));
  const width = widths.reduce((sum, v) => sum + v, 0);
  c.save();
  c.translate(407, 0);
  c.scale(Math.min(1, 78 / width), 1);
  c.textAlign = 'left';
  let x = -width / 2;
  for (const [i, run] of runs.entries()) {
    if (run === '*') {
      c.beginPath();
      for (let point = 0; point < 10; point++) {
        const angle = -Math.PI / 2 + (point * Math.PI) / 5;
        const radius = point % 2 ? 3.1 : 7.5;
        const px = x + 7.5 + radius * Math.cos(angle);
        const py = 622 + radius * Math.sin(angle);
        if (point === 0) c.moveTo(px, py);
        else c.lineTo(px, py);
      }
      c.closePath();
      c.fill();
    } else c.fillText(run, x, 627);
    x += widths[i]!;
  }
  c.restore();
}

/** Eighth-family footer ink, independent of badge/frame geometry. Prepared
 * once with the face; source brushes and fonts use the normal asset caches. */
export function paintEighthFooter(
  c: CanvasRenderingContext2D,
  face: RenderedCardInput,
  images: CanvasImages,
  source = '',
): void {
  c.save();
  c.shadowColor = 'transparent';
  c.shadowOffsetX = c.shadowOffsetY = 0;
  c.letterSpacing = '0px';
  if (face.power != null && face.toughness != null) {
    c.save();
    transformPlanarFooter(c, face, source, 'stats');
    const shifted = face.frameTreatment === 'colorshifted';
    c.fillStyle = shifted ? '#fff' : '#17140f';
    if (shifted) {
      c.shadowColor = '#000';
      c.shadowOffsetX = -0.0021 * 488;
      c.shadowOffsetY = 0.0015 * 680;
    }
    const statsFont = planarStatsFont(face, source);
    c.font = `700 29px "${statsFont ?? 'CardRenderer MTG Matrix Small Caps'}", Georgia`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    const text = `${face.power}/${face.toughness}`;
    if (statsFont) c.fillText(text, 407, 627, 78);
    else paintStats(c, text);
    c.restore();
  }
  const set = face.setCode?.toLowerCase();
  const x = set === '8ed' ? 75 : set === '9ed' ? 79 : 77;
  const early = set === '8ed' || set === '9ed';
  const baseline = early ? 633 : 634;
  c.fillStyle = lightCredit(face) ? '#fff' : '#17140f';
  c.textBaseline = 'alphabetic';
  c.textAlign = 'left';
  const brushUrl = eighthArtistBrush(face);
  if (brushUrl) {
    c.save();
    transformPlanarFooter(c, face, source, 'artist');
    const brush = images.get(brushUrl);
    if (!brush) throw Error(`Eighth Edition artist brush unavailable: ${brushUrl}`);
    c.drawImage(brush, 36.5, baseline - 10, x - 39, 13.5);
    c.font = `700 ${early ? 17.5 : 18}px "CardRenderer MTG Matrix", Georgia`;
    // Keep long credits out of the badge; do not silently remove their wording.
    const right = face.power != null && face.toughness != null ? 350 : 448;
    c.fillText(face.artist!, x, baseline, right - x);
    c.restore();
  }
  const legal = printingLegalText(face),
    number = printingCollectorText(face, false);
  const line = [legal, number].filter(Boolean).join(' ');
  if (line) {
    c.save();
    transformPlanarFooter(c, face, source, 'legal');
    c.font = '10px "CardRenderer MTG MPlantin", Georgia';
    c.fillText(line, 36.5, baseline + 13, 409);
    c.restore();
  }
  c.restore();
}
