import type { CanvasImages } from './canvas-assets.js';
import type { RenderedCardInput } from './face-layout.js';
import { resolveFrameColors } from './profile.js';
import { prepareAdventurePaper } from './adventure-paper.js';
import {
  ADVENTURE_ROOT,
  ADVENTURE_LEFT_MASK,
  ADVENTURE_PINLINE_MASK,
  ADVENTURE_NEUTRAL_PAPER,
  adventureAssets,
  adventureHybrid,
  adventurePlate,
} from './adventure-frame.js';

const cache = new Map<string, HTMLCanvasElement>();
const ids = new WeakMap<ImageBitmap, number>();
let nextId = 0,
  bytes = 0;
const id = (source: ImageBitmap) => {
  if (!ids.has(source)) ids.set(source, ++nextId);
  return ids.get(source)!;
};
/** Cached during preparation. Alpha masks preserve the native book fold;
 * paper RGB calibration runs only on a cache miss. No mask readback or
 * ownership of the borrowed source bitmaps crosses into this cache. */
export function adventureFrameImage(
  face: RenderedCardInput,
  images: CanvasImages,
): CanvasImageSource {
  const spell = face.faces?.[1];
  if (!spell) throw Error('Adventure spell is missing.');
  const required = (url: string) => {
    const image = images.get(url);
    if (!image) throw Error(`Adventure asset unavailable: ${url}`);
    return image;
  };
  const sources = adventureAssets(face).map(required);
  const key = JSON.stringify([
    face.setCode,
    face.colorCalibration,
    face.colors,
    face.frameColors,
    face.manaSymbols,
    spell.colors,
    spell.frameColors,
    spell.manaSymbols,
    sources.map(id),
  ]);
  const cached = cache.get(key);
  if (cached) {
    cache.delete(key);
    cache.set(key, cached);
    return cached;
  }
  const base = required(adventurePlate(face));
  const canvas = document.createElement('canvas');
  canvas.width = base.width;
  canvas.height = base.height;
  const c = canvas.getContext('2d')!,
    w = canvas.width,
    h = canvas.height;
  const scratch = () => {
    const s = document.createElement('canvas');
    s.width = w;
    s.height = h;
    return s;
  };
  const pair = (input: RenderedCardInput, page: boolean) => {
    const s = scratch(),
      o = s.getContext('2d')!,
      colors = resolveFrameColors(input);
    o.drawImage(required(adventurePlate(input)), 0, 0, w, h);
    if (page && colors.length === 1) prepareAdventurePaper(s, face, colors[0]!);
    if (colors.length === 2) {
      if ('WUBRG'.indexOf(colors[1]!) - 'WUBRG'.indexOf(colors[0]!) > 2) colors.reverse();
      o.drawImage(required(`${ADVENTURE_ROOT}/${colors[0]!.toLowerCase()}.png`), 0, 0, w, h);
      if (page) prepareAdventurePaper(s, face, colors[0]!);
      const second = scratch(),
        sc = second.getContext('2d')!;
      sc.drawImage(required(`${ADVENTURE_ROOT}/${colors[1]!.toLowerCase()}.png`), 0, 0, w, h);
      if (page) prepareAdventurePaper(second, face, colors[1]!);
      sc.globalCompositeOperation = 'destination-in';
      const blend = sc.createLinearGradient(
        w * (page ? 0.22 : 0.43),
        0,
        w * (page ? 0.36 : 0.57),
        0,
      );
      blend.addColorStop(0, '#0000');
      blend.addColorStop(1, '#000');
      sc.fillStyle = blend;
      sc.fillRect(0, 0, w, h);
      o.drawImage(second, 0, 0);
      second.width = second.height = 0;
    }
    return s;
  };
  c.drawImage(base, 0, 0);
  if (resolveFrameColors(face).length === 2) {
    const colored = pair(face, false),
      o = colored.getContext('2d')!;
    if (!adventureHybrid(face)) {
      o.globalCompositeOperation = 'destination-in';
      o.drawImage(required(ADVENTURE_PINLINE_MASK), 0, 0, w, h);
    }
    c.drawImage(colored, 0, 0);
    colored.width = colored.height = 0;
  }
  const inset = pair(spell, true),
    ink = inset.getContext('2d')!;
  ink.globalCompositeOperation = 'destination-in';
  ink.drawImage(required(ADVENTURE_LEFT_MASK), 0, 0, w, h);
  c.save();
  if (adventureHybrid(spell)) c.filter = 'grayscale(1)';
  c.drawImage(inset, 0, 0);
  c.restore();
  inset.width = inset.height = 0;
  if (adventureHybrid(face)) {
    c.save();
    c.scale(w / 488, h / 680);
    c.beginPath();
    for (const [y, height] of [
      [34, 34],
      [388, 28],
    ]) {
      c.moveTo(38, y!);
      c.lineTo(450, y!);
      c.quadraticCurveTo(461, y! + height! / 2, 450, y! + height!);
      c.lineTo(38, y! + height!);
      c.quadraticCurveTo(29, y! + height! / 2, 38, y!);
      c.closePath();
    }
    c.clip();
    for (const [y, height] of [
      [34, 34],
      [388, 28],
    ])
      c.drawImage(required(ADVENTURE_NEUTRAL_PAPER), 22, 7, 196, 19, 29, y!, 432, height!);
    c.restore();
  }
  const cost = w * h * 4;
  for (const [oldKey, old] of cache) {
    if (bytes + cost <= 16 * 1024 * 1024) break;
    bytes -= old.width * old.height * 4;
    cache.delete(oldKey);
    old.width = old.height = 0;
  }
  if (cost <= 16 * 1024 * 1024) {
    cache.set(key, canvas);
    bytes += cost;
  }
  return canvas;
}
