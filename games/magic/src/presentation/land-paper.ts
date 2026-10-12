import type { CardProfile } from './profile.js';

/** Shared BR/WB land-paper correction, checked across M15–FDN printings.
 * These pinned frame assets have nearly white paper. Multiply only its interior
 * so the existing grain and inset shadows survive; the colored rails, plates,
 * lettering and nonland uses of the same assets retain their original paint.
 * Values are shared by palette, not fitted to individual cards or scans. */
export function paintLandPaper(
  context: CanvasRenderingContext2D,
  profile: CardProfile,
  inset: number,
) {
  if (!profile.land) return;
  const stops =
    profile.frame === 'BR'
      ? ['#b4afb5', '#f2b096']
      : profile.frame === 'WB'
        ? ['#f0e0b5', '#a99da8']
        : null;
  if (!stops) return;
  // Paper interior in the existing ordinary frame. The inset follows the
  // frame's horizontal adjustment; its colored outer border stays untouched.
  const x = 34 + inset,
    width = 420 - 2 * inset;
  const gradient = context.createLinearGradient(x, 0, x + width, 0);
  gradient.addColorStop(0, stops[0]!);
  gradient.addColorStop(0.35, stops[0]!);
  gradient.addColorStop(0.65, stops[1]!);
  gradient.addColorStop(1, stops[1]!);
  context.save();
  context.globalCompositeOperation = 'multiply';
  context.fillStyle = gradient;
  context.fillRect(x, 425, width, 203.5);
  context.restore();
}
