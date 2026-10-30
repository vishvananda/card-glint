import { paintFontText, setFont } from './font-geometry.js';
import { type CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import type { AbilityEmblem } from '../emblems.js';
import { FACE_HEIGHT, FACE_WIDTH, type RenderedCardInput } from './face-layout.js';
import { POWER_TOUGHNESS_LAYOUT } from './power-toughness-layout.js';
import { paintAbilityEmblem } from './canvas-ability-emblem.js';

/** The same projected status drawings used by native cards, including inspection. */
export function paintCardStatus(
  context: CanvasContext,
  emblems: readonly AbilityEmblem[],
  stats?: Pick<RenderedCardInput, 'power' | 'toughness'>,
  plate?: ImageBitmap,
  inspection = false,
) {
  const size = FACE_WIDTH * 0.105,
    gap = FACE_WIDTH * 0.015;
  const columns = Math.floor((FACE_WIDTH * 0.9) / (size + gap));
  emblems.forEach((emblem, index) => {
    context.save();
    context.translate(
      FACE_WIDTH * 0.05 + (index % columns) * (size + gap),
      FACE_HEIGHT * 0.13 + Math.floor(index / columns) * (size + gap),
    );
    context.fillStyle = '#17201fed';
    context.strokeStyle = '#c6af7977';
    context.lineWidth = 1;
    context.beginPath();
    context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.translate(size * 0.14, size * 0.14);
    context.scale((size * 0.72) / 24, (size * 0.72) / 24);
    context.strokeStyle = '#f3e9cf';
    context.lineWidth = 1.8;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    paintAbilityEmblem(context, emblem);
    context.restore();
  });
  if (stats?.power == null || stats.toughness == null) return;
  context.save();
  // Match the native badge's bounds. Keeping its translucent plate in the
  // face texture gives the entire badge the same reflection as the card.
  const layout = POWER_TOUGHNESS_LAYOUT[inspection ? 'inspect' : 'table'];
  const width = FACE_WIDTH * layout.width,
    height = FACE_HEIGHT * layout.height;
  const x = FACE_WIDTH * (1 - layout.right - layout.width),
    y = FACE_HEIGHT * (1 - layout.bottom - layout.height);
  if (plate) context.drawImage(plate, x, y, width, height);
  else {
    context.fillStyle = '#eee5cf';
    context.strokeStyle = '#746854';
    context.lineWidth = 2;
    context.beginPath();
    context.roundRect(
      x + width * (inspection ? 0.14 : 0.1),
      y + height * (inspection ? 0.19 : 0.18),
      width * (inspection ? 0.72 : 0.8),
      height * (inspection ? 0.62 : 0.64),
      height * 0.12,
    );
    context.fill();
    context.stroke();
  }
  setFont(
    context,
    `bold ${FACE_WIDTH * (inspection ? 0.0625 : 0.13)}px "CardRenderer MTG Beleren", Georgia, serif`,
  );
  context.fillStyle = '#17140f';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  paintFontText(
    context,
    `${stats.power}/${stats.toughness}`,
    x + width / 2,
    inspection ? y + height / 2 - FACE_WIDTH * 0.01 : y + height * 0.48,
    width * 0.72,
  );
  context.restore();
}
