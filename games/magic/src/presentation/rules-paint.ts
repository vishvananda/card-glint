import type { CanvasImages } from './canvas-assets.js';
import { paintMana } from './canvas-text.js';
import { FACE_HEIGHT, FACE_WIDTH, type RenderedCardInput } from './face-layout.js';
import { faceRects } from './special-frames.js';
import { layoutRules, rulesFont, type RulesLayout } from './rules-layout.js';

export function ordinaryTextLayout(
  context: CanvasRenderingContext2D,
  face: RenderedCardInput,
  height = FACE_HEIGHT,
  scale = 1,
): RulesLayout {
  const rects = faceRects(face);
  const [x, y, width, h] = rects.rules;
  const paragraphs =
    face.rulesParagraphs ??
    (face.rulesText ?? '')
      .split('\n')
      .filter(Boolean)
      .map((text) => ({ role: 'rules' as const, runs: [{ text }] }));
  return layoutRules(
    context,
    face.rulesAlignment?.mode === 'left'
      ? paragraphs.map((p) => ({ ...p, align: 'left' as const }))
      : paragraphs,
    {
      x: x * FACE_WIDTH + 3.5,
      y: y * height + 7,
      width: width * FACE_WIDTH - 9.5,
      height: h * height - 8,
      // Fit actual line ink around the existing power/toughness plate. Short
      // final lines can use the lower left area without being painted over.
      exclusions:
        face.power != null && face.toughness != null
          ? [
              [
                rects.stats[0] * FACE_WIDTH - 2,
                rects.stats[1] * height - 2,
                rects.stats[2] * FACE_WIDTH + 4,
                rects.stats[3] * height + 4,
              ],
            ]
          : [],
    },
    24.5 * scale,
    15 * scale,
  );
}

export function paintRulesLayout(
  context: CanvasRenderingContext2D,
  layout: RulesLayout,
  images: CanvasImages,
  paintSymbol: typeof paintMana = paintMana,
  inkInsetEm = 0,
) {
  if (layout.overflow) throw Error('Magic rules text does not fit the available area.');
  context.save();
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
  context.fillStyle = '#17140f';
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
    ink.fillStyle = '#17140f';
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
        ink.fillText(run.text, x, line.baseline);
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
          ink.strokeText(run.text, x, line.baseline);
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
