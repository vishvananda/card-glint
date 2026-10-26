import type { FaceRect, RenderedCardInput } from './face-layout.js';
import { resolveCardProfile, resolveFrameColors } from './profile.js';
import { isRevisedLand } from './revised-land-frame.js';

type Material = 'W' | 'U' | 'B' | 'R' | 'G' | 'A';
interface Geometry {
  readonly x: readonly [scale: number, shift: number];
  readonly y: readonly [scale: number, shift: number];
  readonly aperture: FaceRect;
}

/** Shared printing geometry from eight calibration scans per material, with
 * independent scan-only registration. Values never contain a per-card pose.
 * Apertures are measured in the pinned Fourth source assets, including their
 * alpha feather and a one-source-pixel guard against an uncovered art seam. */
const geometry: Readonly<Record<Material, Geometry>> = {
  W: {
    x: [1.009125, 0.15625],
    y: [1.008625, 3.8125],
    aperture: [0.10133333333333333, 0.08714285714285715, 0.7946666666666666, 0.4561904761904762],
  },
  U: {
    x: [1.01075, -0.421875],
    y: [1.009125, 4.1875],
    aperture: [0.104, 0.08761904761904762, 0.7926666666666666, 0.4552380952380952],
  },
  B: {
    x: [1.012375, -0.265625],
    y: [1.010375, 6.65625],
    aperture: [0.10533333333333333, 0.08523809523809524, 0.7913333333333333, 0.45476190476190476],
  },
  R: {
    x: [1.010625, 0.46875],
    y: [1.010625, 4.75],
    aperture: [0.10333333333333333, 0.08857142857142856, 0.794, 0.4542857142857143],
  },
  G: {
    x: [1.01025, -0.578125],
    y: [1.00775, 4.671875],
    aperture: [0.104, 0.08714285714285715, 0.7913333333333333, 0.4552380952380952],
  },
  A: {
    x: [1.0095, -0.59375],
    y: [1.0095, 4.75],
    aperture: [0.10533333333333333, 0.08952380952380952, 0.792, 0.45285714285714285],
  },
};

function material(face: RenderedCardInput): Material | null {
  if (
    face.setCode?.toLowerCase() !== '3ed' ||
    face.frameTemplate ||
    face.frameStyle === 'modern' ||
    (face.borderColor && face.borderColor !== 'white') ||
    isRevisedLand(face) ||
    (face.layout && face.layout !== 'normal') ||
    /\b(Saga|Class|Planeswalker|Battle)\b/.test(face.typeLine ?? '')
  )
    return null;
  // Match retroFrameAsset: artifact type owns the plate, reviewed frame colors
  // own visible colored frames (including green-frame Serendib Efreet).
  if (resolveCardProfile(face).artifact) return 'A';
  const colors = resolveFrameColors(face);
  if (colors.length !== 1) return null;
  const color = colors[0];
  return color === 'W' || color === 'U' || color === 'B' || color === 'R' || color === 'G'
    ? color
    : null;
}

export function revisedFrameRect(face: RenderedCardInput): FaceRect | null {
  const key = material(face);
  if (!key) return null;
  const {
    x: [sx, dx],
    y: [sy, dy],
  } = geometry[key];
  return [
    (244 + (0.012 * 488 - 244) * sx + dx) / 488,
    (340 + (0.01 * 680 - 340) * sy + dy) / 680,
    0.974 * sx,
    0.982 * sy,
  ];
}

export function revisedArtRect(face: RenderedCardInput): FaceRect | null {
  const key = material(face),
    frame = revisedFrameRect(face);
  if (!key || !frame) return null;
  const [x, y, width, height] = geometry[key].aperture;
  return [frame[0] + x * frame[2], frame[1] + y * frame[3], width * frame[2], height * frame[3]];
}

export function usesRevisedFrameGeometry(face: RenderedCardInput): boolean {
  return material(face) !== null;
}
