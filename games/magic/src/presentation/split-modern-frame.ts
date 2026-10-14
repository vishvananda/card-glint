import type { CanvasImages } from './canvas-assets.js';
import type { FaceRect, RenderedCardInput } from './face-layout.js';
import { resolveFrameColors } from './profile.js';
import { CONJURER_ROOT } from './styled-set-symbols.js';
import { PLAIN_SECURITY_STAMP } from './security-stamp-assets.js';

export const MODERN_SPLIT_WIDTH = 310.216;
export const MODERN_SPLIT_GEOMETRY = {
  frame: [52, 20, 298, 449] as FaceRect,
  title: [70, 40, 261, 26] as FaceRect,
  art: [65, 76.5, 270, 183.8] as FaceRect,
  type: [70, 265, 261, 23] as FaceRect,
  rules: [74, 301, 255, 160] as FaceRect,
  artistY: 0,
  legalY: 0,
};
const root = `${CONJURER_ROOT}/img/frames/m15/split`;
const mse =
  'https://cdn.jsdelivr.net/gh/MagicSetEditorPacks/Full-Magic-Pack@16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-m15-split-fusable.mse-style';
export const HYBRID_SPLIT_LABELS = [
  `${mse}/namebox/texture/normal/c.png`,
  `${mse}/typebox/texture/normal/c.png`,
] as const;
const plateRoot = (face: RenderedCardInput) =>
  `${root}${face.layout?.endsWith('-fuse') ? '/fuse' : ''}`;
export function modernSplitPlate(face: RenderedCardInput): string {
  const colors = resolveFrameColors(face);
  return `${plateRoot(face)}/${colors.length > 1 ? 'm' : (colors[0]?.toLowerCase() ?? 'a')}.png`;
}
export function isHybridSplit(face: RenderedCardInput): boolean {
  const cost = face.manaSymbols ?? [];
  return (
    cost.some((symbol) => /^[WUBRG]\/[WUBRG]$/.test(symbol)) &&
    !cost.some((symbol) => /^[WUBRG]$/.test(symbol))
  );
}
export function modernSplitAssets(face: RenderedCardInput): string[] {
  const colors = resolveFrameColors(face);
  return [
    modernSplitPlate(face),
    ...(colors.length === 2
      ? colors.map((color) => `${plateRoot(face)}/${color.toLowerCase()}.png`)
      : []),
    ...(colors.length === 2 && isHybridSplit(face) ? HYBRID_SPLIT_LABELS : []),
    ...(['rare', 'mythic'].includes(face.rarity ?? '') ? [PLAIN_SECURITY_STAMP] : []),
  ];
}
// Derived full plates are larger than the old MSE panels. Keep a separate
// bounded LRU without retaining borrowed source bitmaps after preparation.
const prepared = new Map<string, HTMLCanvasElement>();
const identities = new WeakMap<ImageBitmap, number>();
let sequence = 0,
  preparedBytes = 0;
const sourceId = (image: ImageBitmap) => {
  if (!identities.has(image)) identities.set(image, ++sequence);
  return identities.get(image)!;
};
function labelPath(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  bulge: number,
) {
  c.moveTo(x + bulge, y);
  c.lineTo(x + w - bulge, y);
  c.quadraticCurveTo(x + w + bulge * 0.25, y + h / 2, x + w - bulge, y + h);
  c.lineTo(x + bulge, y + h);
  c.quadraticCurveTo(x - bulge * 0.25, y + h / 2, x + bulge, y);
  c.closePath();
}
/** High-resolution plates retain texture. Only the label interiors and colored
 * pinlines differ between hybrid and gold; prepare once per decoded source set. */
export function modernSplitImage(face: RenderedCardInput, images: CanvasImages): CanvasImageSource {
  const required = (url: string) => {
    const image = images.get(url);
    if (!image) throw Error(`Modern split asset unavailable: ${url}`);
    return image;
  };
  const base = required(modernSplitPlate(face)),
    colors = resolveFrameColors(face);
  if (colors.length !== 2) return base;
  if ('WUBRG'.indexOf(colors[1]!) - 'WUBRG'.indexOf(colors[0]!) > 2) colors.reverse();
  const hybrid = isHybridSplit(face),
    sources = [
      ...colors.map((color) => required(`${plateRoot(face)}/${color.toLowerCase()}.png`)),
      ...(hybrid ? HYBRID_SPLIT_LABELS.map(required) : [base]),
    ];
  const key =
    colors.join('') + (hybrid ? '-hybrid-' : '-gold-') + [base, ...sources].map(sourceId).join('/');
  const cached = prepared.get(key);
  if (cached) {
    prepared.delete(key);
    prepared.set(key, cached);
    return cached;
  }
  const canvas = document.createElement('canvas');
  canvas.width = base.width;
  canvas.height = base.height;
  const c = canvas.getContext('2d')!;
  c.scale(canvas.width / 488, canvas.height / 680);
  c.translate(0, 680);
  c.rotate(-Math.PI / 2);
  const draw = (image: ImageBitmap) => {
    c.save();
    c.translate(680, 0);
    c.rotate(Math.PI / 2);
    c.drawImage(image, 0, 0, 488, 680);
    c.restore();
  };
  const fuse = face.layout?.endsWith('-fuse') ?? false;
  draw(base);
  for (const offset of [0, MODERN_SPLIT_WIDTH]) {
    c.save();
    c.beginPath();
    if (hybrid) c.rect(offset + 50, 0, MODERN_SPLIT_WIDTH, 488);
    else {
      labelPath(c, offset + 57.5, 29, 286, 47, 9);
      c.rect(offset + 64, 74, 273, fuse ? 362 : 394);
      labelPath(c, offset + 57.5, 260, 286, 34, 7);
    }
    if (fuse) {
      for (const [y, h] of [
        [29, 47],
        [260, 34],
      ]) {
        c.moveTo(334, y!);
        c.lineTo(356, y! + h! / 2);
        c.lineTo(378, y!);
        c.lineTo(378, y! + h!);
        c.lineTo(356, y! + h! / 2);
        c.lineTo(334, y! + h!);
        c.closePath();
      }
    }
    c.clip();
    draw(sources[0]!);
    // Cross-fade the second plate without transparent paint erasing the first.
    const overlay = document.createElement('canvas');
    overlay.width = canvas.width;
    overlay.height = canvas.height;
    const o = overlay.getContext('2d')!;
    o.drawImage(sources[1]!, 0, 0, overlay.width, overlay.height);
    o.globalCompositeOperation = 'destination-in';
    const gradient = o.createLinearGradient(
      0,
      ((680 - offset - 175) / 680) * overlay.height,
      0,
      ((680 - offset - 230) / 680) * overlay.height,
    );
    gradient.addColorStop(0, '#0000');
    gradient.addColorStop(1, '#000');
    o.fillStyle = gradient;
    o.fillRect(0, 0, overlay.width, overlay.height);
    c.save();
    c.translate(680, 0);
    c.rotate(Math.PI / 2);
    c.drawImage(overlay, 0, 0, 488, 680);
    c.restore();
    c.restore();
    overlay.width = overlay.height = 0;
    c.save();
    c.beginPath();
    labelPath(c, offset + 62.5, 34.5, 276, 37.5, 7);
    labelPath(c, offset + 62.5, 265, 276, 24, 5);
    if (fuse) {
      for (const [y, h] of [
        [35, 37],
        [265, 24],
      ]) {
        c.moveTo(332, y!);
        c.lineTo(349, y! + h! / 2);
        c.lineTo(332, y! + h!);
        c.closePath();
        c.moveTo(380, y!);
        c.lineTo(363, y! + h! / 2);
        c.lineTo(380, y! + h!);
        c.closePath();
      }
    }
    c.clip();
    if (hybrid) {
      // Crop the interior texture, retaining the higher-resolution plate's
      // pinline and black outline. Source bounds come from the MSE layers.
      c.drawImage(sources[2]!, 22, 7, 196, 19, offset + 62.5, 34.5, 276, 37.5);
      c.drawImage(sources[3]!, 22, 192, 196, 11, offset + 62.5, 265, 276, 24);
    } else draw(sources[2]!);
    c.restore();
  }
  const bytes = canvas.width * canvas.height * 4;
  for (const [oldKey, old] of prepared) {
    if (preparedBytes + bytes <= 16 * 1024 * 1024) break;
    preparedBytes -= old.width * old.height * 4;
    prepared.delete(oldKey);
    old.width = old.height = 0;
  }
  if (bytes <= 16 * 1024 * 1024) {
    prepared.set(key, canvas);
    preparedBytes += bytes;
  }
  return canvas;
}
