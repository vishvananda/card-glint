import {
  type CanvasContext,
  rasterCanvas,
} from '../../../../packages/browser/src/canvas-raster.js';
import type { FaceRect, RenderedCardInput } from './face-layout.js';

/** Shared normal-frame enlargement; preserve the shield's aspect and center. */
export const NORMAL_CORE_SYMBOL_SCALE = 1.1;

/** These pinned Keyrune shields encode the letters as transparent holes. Other
 * set glyphs and caller-provided artwork must keep their own topology. */
export function hasCoreSetShield(face: Pick<RenderedCardInput, 'setCode' | 'setSymbol'>): boolean {
  return !face.setSymbol && ['m19', 'm20', 'm21'].includes(face.setCode?.toLowerCase() ?? '');
}

/** Static face preparation only: retain the existing stencil, make its letter
 * holes opaque, and add a shield rim. No pixel readback or extra asset fetch. */
export function paintCoreSetSymbol(
  context: CanvasContext,
  image: ImageBitmap,
  rarity: string | undefined,
  x: number,
  y: number,
  width: number,
  height: number,
  crop: FaceRect,
  rim = 1,
): void {
  const common = !rarity || rarity === 'common';
  const layer = rasterCanvas();
  const padding = 2,
    resolution = 4;
  layer.width = Math.ceil((width + padding * 2) * resolution);
  layer.height = Math.ceil((height + padding * 2) * resolution);
  const c = layer.getContext('2d')!;
  c.scale(resolution, resolution);
  c.translate(padding, padding);
  c.drawImage(
    image,
    crop[0] * image.width,
    crop[1] * image.height,
    crop[2] * image.width,
    crop[3] * image.height,
    0,
    0,
    width,
    height,
  );
  c.globalCompositeOperation = 'source-in';
  const palette: readonly [string, string, string, string] =
    rarity === 'mythic'
      ? ['#9c2408', '#e97816', '#ffbf46', '#a73312']
      : rarity === 'uncommon'
        ? ['#506b80', '#a5c3d4', '#ccdce4', '#708898']
        : ['#766326', '#c3af5c', '#eee1a0', '#907b36'];
  const gradient = c.createLinearGradient(0, height * 0.65, width, height * 0.35);
  gradient.addColorStop(0, palette[0]);
  gradient.addColorStop(0.35, palette[1]);
  gradient.addColorStop(0.6, palette[2]);
  gradient.addColorStop(1, palette[3]);
  c.fillStyle = common ? '#111111' : gradient;
  c.fillRect(0, 0, width, height);
  // Convex backplate follows the common core-shield envelope. It supplies the
  // opaque letter ink behind the unchanged SVG stencil; it is not a new glyph.
  c.beginPath();
  c.moveTo(width * 0.046, 0);
  c.lineTo(width * 0.953, 0);
  c.bezierCurveTo(
    width * 1.016,
    height * 0.38,
    width * 1.016,
    height * 0.62,
    width * 0.953,
    height,
  );
  c.lineTo(width * 0.046, height);
  c.bezierCurveTo(-width * 0.017, height * 0.62, -width * 0.017, height * 0.38, width * 0.046, 0);
  c.closePath();
  c.globalCompositeOperation = 'destination-over';
  c.fillStyle = common ? '#f8f8f5' : '#111111';
  c.fill();
  c.globalCompositeOperation = 'source-over';
  c.strokeStyle = common ? '#f8f8f5' : '#111111';
  c.lineWidth = rim;
  c.stroke();
  context.drawImage(
    layer,
    x - padding,
    y - padding,
    layer.width / resolution,
    layer.height / resolution,
  );
  layer.width = layer.height = 0;
}
