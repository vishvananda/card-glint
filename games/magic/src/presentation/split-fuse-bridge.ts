import {
  type CanvasContext,
  type CanvasRaster,
  rasterCanvas,
} from '../../../../packages/browser/src/canvas-raster.js';
import manifest from '../../assets.json' with { type: 'json' };
import { resolveFrameColors } from './profile.js';
import { splitSourceMask } from './split-materials.js';
import type { RenderedCardInput } from './face-layout.js';
import type { CanvasImages } from './canvas-assets.js';

// jsDelivr intermittently returns 404 for these tiny bridge assets even at the
// pinned commit. Use the same immutable files directly from their source.
const root = manifest.MSE_SPLIT_BRIDGE_ROOT;
function bridgeParts(face: RenderedCardInput, index: number) {
  const colors = resolveFrameColors(face);
  if (colors.length === 2 && 'WUBRG'.indexOf(colors[1]!) - 'WUBRG'.indexOf(colors[0]!) > 2)
    colors.reverse();
  const edge = (index ? colors[0] : colors.at(-1))?.toLowerCase() ?? 'c';
  return {
    color: `${root}/${edge}bridge.png`,
    gold: colors.length > 1 ? `${root}/mbridge.png` : null,
    mask: colors.length > 1 ? `${root}/bridgemask.png` : null,
  };
}
export function splitFuseBridgeAssets(face: RenderedCardInput) {
  return (face.faces ?? []).flatMap((half, i) => Object.values(bridgeParts(half, i)));
}

/** MSE's 2003 Fuse plates stop at the shared panel join. Its dedicated bridge
 * supplies the original paper, gold/colored rim and shadows across that gap. */
export function paintSplitFuseBridge(
  context: CanvasContext,
  face: RenderedCardInput,
  images: CanvasImages,
) {
  const required = (url: string) => {
    const image = images.get(url);
    if (!image) throw Error(`Fuse bridge asset unavailable: ${url}`);
    return image;
  };
  const halves = face.faces!.map((half, i) => {
    const parts = bridgeParts(half, i),
      color = required(parts.color),
      canvas = rasterCanvas();
    canvas.width = color.width;
    canvas.height = color.height;
    const c = canvas.getContext('2d')!;
    c.drawImage(color, 0, 0);
    if (parts.gold && parts.mask) {
      c.globalCompositeOperation = 'destination-in';
      c.drawImage(splitSourceMask(required(parts.mask)), 0, 0, canvas.width, canvas.height);
      c.globalCompositeOperation = 'destination-over';
      c.drawImage(required(parts.gold), 0, 0, canvas.width, canvas.height);
    }
    return canvas;
  });
  const [left, right] = halves as [CanvasRaster, CanvasRaster];
  const r = right.getContext('2d')!;
  r.globalCompositeOperation = 'destination-in';
  const gradient = r.createLinearGradient(0, 0, right.width, 0);
  gradient.addColorStop(0, '#0000');
  gradient.addColorStop(1, '#000');
  r.fillStyle = gradient;
  r.fillRect(0, 0, right.width, right.height);
  context.save();
  context.translate(0, 680);
  context.rotate(-Math.PI / 2);
  const bounds = [
    (253 * 680) / 523,
    (306 * 488) / 375,
    (16 * 680) / 523,
    (30 * 488) / 375,
  ] as const;
  context.drawImage(left, ...bounds);
  context.drawImage(right, ...bounds);
  context.restore();
  for (const canvas of halves) canvas.width = canvas.height = 0;
}
