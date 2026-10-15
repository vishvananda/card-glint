import type { CardProfile, FrameAssetKey } from './profile.js';

// Left/right order follows the visible asset, not WUBRG sorting: WR and WG
// end in white, while UG starts with green. Shared tones from M21 calibration;
// BR/WB retain the previously reviewed multi-set correction.
const W = '#fbf0c5',
  U = '#ccdaf2',
  B = '#9c9995',
  R = '#edaa8d',
  G = '#dde6e2';
const PAPER: Partial<Record<FrameAssetKey, readonly [string, string]>> = {
  W: [W, W],
  U: [U, U],
  B: [B, B],
  R: [R, R],
  G: [G, G],
  WU: [W, U],
  WB: ['#f0e0b5', '#a99da8'],
  WR: [R, W],
  WG: [G, W],
  UB: [U, B],
  UR: [U, R],
  UG: [G, U],
  BR: ['#b4afb5', '#f2b096'],
  BG: [B, G],
  RG: [R, G],
};

/** Shared land-paper correction, checked across M15–FDN printings.
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
  const stops = PAPER[profile.frame];
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

/** Colorless lands reuse an artifact asset with pale rails and blue paper.
 * Filter the source paint, preserving its alpha, texture and shadow placement.
 * The two material regions need different brightness; neither touches art,
 * lettering, plates or the surrounding land background. Texture composition
 * only: no additional image decoding or pixel readback. */
export function paintLandFrame(
  context: CanvasRenderingContext2D,
  profile: CardProfile,
  inset: number,
  paint: () => void,
) {
  if (!profile.land || profile.frame !== 'Artifact') {
    paint();
    return;
  }
  const x = 34 + inset,
    width = 420 - 2 * inset;
  for (const paper of [false, true]) {
    context.save();
    context.beginPath();
    if (!paper) context.rect(0, 0, 488, 680);
    context.rect(x, 425, width, 203.5);
    context.clip('evenodd');
    context.filter = `grayscale(1) brightness(${paper ? 0.9 : 0.63})`;
    paint();
    context.restore();
  }
}
