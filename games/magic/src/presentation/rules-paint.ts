import { rulesInkVisible } from './rules-visibility.js';
import type { CanvasImages } from './canvas-assets.js';
import { paintMana } from './canvas-text.js';
import { FACE_HEIGHT, FACE_WIDTH, type RenderedCardInput } from './face-layout.js';
import { faceRects } from './special-frames.js';
import {
  layoutRules,
  rulesFont,
  RULES_TYPOGRAPHY,
  type RulesLayout,
  type MeasuredRun,
} from './rules-layout.js';
import { shortCenteredRules } from './short-centered-rules.js';
import { mountedSecurityStamp } from './security-stamp-paint.js';
import { hasFlavorSeparator } from './flavor-separator.js';
import { planarRulesSpacing, planarRulesStatsRect } from './planar-rules.js';
import { planarShortRules } from './planar-short-rules.js';

export function ordinaryTextLayout(
  context: CanvasRenderingContext2D,
  face: RenderedCardInput,
  height = FACE_HEIGHT,
  scale = 1,
): RulesLayout {
  const rects = faceRects(face);
  const planarStats = planarRulesStatsRect(face);
  const statsRect = planarStats ?? rects.stats;
  const typography = {
    ...RULES_TYPOGRAPHY,
    flavorSeparator: face.frameAssetFamily === 'eighth' ? false : hasFlavorSeparator(face.setCode),
  };
  const [x, y, width, h] = rects.rules;
  const paragraphs =
    face.rulesParagraphs ??
    (face.rulesText ?? '')
      .split('\n')
      .filter(Boolean)
      .map((text) => ({ role: 'rules' as const, runs: [{ text }] }));
  const stamp = mountedSecurityStamp(face);
  const bounds: Parameters<typeof layoutRules>[2] = {
    x: x * FACE_WIDTH + (face.frameAssetFamily ? 0 : 3.5),
    y: y * height + (face.frameAssetFamily ? 0 : 7),
    width: width * FACE_WIDTH - (face.frameAssetFamily ? 0 : 9.5),
    height: h * height - (face.frameAssetFamily ? 0 : 8),
    // Fit actual line ink around the existing power/toughness plate. Short
    // final lines can use the lower left area without being painted over.
    exclusions: [
      ...(face.power != null && face.toughness != null
        ? [
            [
              statsRect[0] * FACE_WIDTH - 2,
              statsRect[1] * height - 2,
              statsRect[2] * FACE_WIDTH + 4,
              statsRect[3] * height + 4,
            ] as const,
          ]
        : []),
      ...(stamp
        ? [
            [
              stamp.rect[0] - 1,
              ((stamp.rect[1] - 1) * height) / FACE_HEIGHT,
              stamp.rect[2] + 2,
              ((stamp.rect[3] + 2) * height) / FACE_HEIGHT,
            ] as const,
          ]
        : []),
    ],
  };
  const reference =
    face.rulesAlignment?.mode === 'auto'
      ? (face.rulesAlignment.reference ?? paragraphs)
      : paragraphs;
  // These core sets retain centered short rules-only passages. Eighth/Ninth
  // scans are left aligned; do not infer this policy from the 2003 frame alone.
  if (
    face.rulesAlignment?.mode !== 'left' &&
    ['10e', 'm10', 'm11', 'm12', 'm13', 'm14'].includes(face.setCode?.toLowerCase() ?? '') &&
    reference.every((p) => p.role === 'rules')
  ) {
    const centered = shortCenteredRules(
      context,
      paragraphs,
      reference,
      bounds,
      24.5 * scale,
      15 * scale,
      3,
      { ...typography, balanceLines: true },
    );
    if (centered) return centered;
  }
  const fittedParagraphs =
    face.rulesAlignment?.mode === 'left'
      ? paragraphs.map((p) => (p.role === 'rules' ? { ...p, align: 'left' as const } : p))
      : paragraphs;
  let layout = layoutRules(context, fittedParagraphs, bounds, 24.5 * scale, 15 * scale, typography);
  // Longer Oracle wording may exceed the original printing's minimum size.
  // Keep all text and measured P/T clearance before using the PLC spacing pass.
  if (layout.overflow && planarStats)
    layout = layoutRules(context, fittedParagraphs, bounds, layout.size, 12 * scale, typography);
  return planarShortRules(
    context,
    face,
    fittedParagraphs,
    planarRulesSpacing(face, layout, bounds),
    bounds,
  );
}

export function paintRulesLayout(
  context: CanvasRenderingContext2D,
  layout: RulesLayout,
  images: CanvasImages,
  paintSymbol: typeof paintMana = paintMana,
  inkInsetEm = 0,
  color = '#17140f',
) {
  if (!rulesInkVisible(context)) return;
  if (layout.overflow) throw Error('Magic rules text does not fit the available area.');
  context.save();
  if (layout.horizontalScale) context.scale(layout.horizontalScale, 1);
  context.textAlign = 'left';
  context.textBaseline = 'alphabetic';
  context.letterSpacing = '0px';
  for (const y of layout.separators) {
    const gradient = context.createLinearGradient(layout.x, y, layout.x + layout.width, y);
    gradient.addColorStop(0, '#17140f00');
    gradient.addColorStop(0.15, '#17140f55');
    gradient.addColorStop(0.85, '#17140f55');
    gradient.addColorStop(1, '#17140f00');
    context.fillStyle = gradient;
    context.fillRect(layout.x, y, layout.width, 0.6);
  }
  context.fillStyle = color;
  // Optical weight adjustment belongs to face composition, never the draw loop.
  // Remove a narrow outline from a separate text layer so frame texture survives.
  const layer = inkInsetEm > 0 ? document.createElement('canvas') : null;
  if (layer) {
    layer.width = context.canvas.width;
    layer.height = context.canvas.height;
  }
  const ink = layer ? layer.getContext('2d') : context;
  if (!ink) throw Error('Missing rules text context');
  if (layer) {
    ink.setTransform(context.getTransform());
    ink.textAlign = 'left';
    ink.textBaseline = 'alphabetic';
    ink.letterSpacing = '0px';
    ink.fillStyle = color;
  }
  for (const line of layout.lines) {
    let x = line.x ?? layout.x;
    for (const run of line.runs) {
      if (run.symbol)
        paintSymbol(
          context,
          run.text,
          x + run.size * 0.025,
          line.baseline - run.size * 0.72,
          run.size * 0.8,
          images,
        );
      else {
        ink.font = rulesFont(run.size, run.italic);
        paintScaledText(ink, run, x, line.baseline, false);
      }
      x += run.width;
    }
  }
  if (layer) {
    ink.globalCompositeOperation = 'destination-out';
    ink.lineJoin = 'round';
    for (const line of layout.lines) {
      let x = line.x ?? layout.x;
      for (const run of line.runs) {
        if (!run.symbol) {
          ink.font = rulesFont(run.size, run.italic);
          ink.lineWidth = run.size * inkInsetEm * 2;
          paintScaledText(ink, run, x, line.baseline, true);
        }
        x += run.width;
      }
    }
    context.resetTransform();
    context.drawImage(layer, 0, 0);
    layer.width = layer.height = 0;
  }
  context.restore();
}

/** Scale letter ink locally; the caller advances with the matching measured width. */
function paintScaledText(
  context: CanvasRenderingContext2D,
  run: MeasuredRun,
  x: number,
  y: number,
  stroke: boolean,
) {
  const scale = run.textWidth ?? 1;
  if (scale === 1) {
    if (stroke) context.strokeText(run.text, x, y);
    else context.fillText(run.text, x, y);
    return;
  }
  context.save();
  context.translate(x, y);
  context.scale(scale, 1);
  if (stroke) context.strokeText(run.text, 0, 0);
  else context.fillText(run.text, 0, 0);
  context.restore();
}
