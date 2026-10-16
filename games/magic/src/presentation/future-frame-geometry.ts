import type { RenderedCardInput } from './face-layout.js';
import { futureTreatment } from './future-frame.js';
import { resolveCardProfile, resolveFrameColors } from './profile.js';

/** Shared source-plate geometry, measured against frozen scan-only poses.
 * See fixtures/accuracy/future-normalization.json. Clear CC plates share the
 * opaque CC mesh: their translucent color does not choose another transform. */
function mapping(face: RenderedCardInput) {
  const full = futureTreatment(face) === 'full-art',
    profile = resolveCardProfile(face),
    mse =
      !full &&
      (profile.land ||
        (futureTreatment(face) === 'regular' &&
          !profile.artifact &&
          resolveFrameColors(face).length === 0));
  const [sx, sy, tx, ty] = full
    ? [0.9967, 0.9995, -2.125, -0.85]
    : mse
      ? [0.9976, 0.997, -1.925, -0.3]
      : [0.9867, 0.9929, 0, -0.175];
  const source = full || mse ? [0, 680] : [0, 85, 370, 385, 416, 430, 610, 680],
    offsets = full || mse ? [0, 0] : [0, 0, 1, 1, 1.45, 1.45, 0, 0];
  return {
    sx: sx!,
    tx: tx!,
    source,
    target: source.map((y, i) => 340 + (y - 340) * sy! + ty! + offsets[i]!),
  };
}

/** Static preparation only. Continuous bands preserve the type-box height
 * while correcting the outer stock. Integer physical-pixel clips tile the
 * output without partially covered seams; each band samples the whole plate.
 * No pixel readback or animation-time work is needed. */
export function calibrateFutureFrame(source: HTMLCanvasElement, face: RenderedCardInput) {
  const target = document.createElement('canvas');
  target.width = source.width;
  target.height = source.height;
  const c = target.getContext('2d')!,
    m = mapping(face),
    factor = source.height / 680;
  try {
    for (let i = 0; i < m.source.length - 1; i++) {
      const y = m.source[i]!,
        nextY = m.source[i + 1]!,
        toY = m.target[i]!,
        nextToY = m.target[i + 1]!,
        scaleY = (nextToY - toY) / (nextY - y),
        top = Math.round(toY * factor),
        bottom = Math.round(nextToY * factor);
      c.save();
      c.beginPath();
      c.rect(0, top, target.width, bottom - top);
      c.clip();
      c.transform(
        m.sx,
        0,
        0,
        scaleY,
        (244 * (1 - m.sx) + m.tx) * factor,
        (toY - scaleY * y) * factor,
      );
      c.drawImage(source, 0, 0);
      c.restore();
    }
    return target;
  } catch (error) {
    target.width = target.height = 0;
    throw error;
  }
}
