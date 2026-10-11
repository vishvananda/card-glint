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
  const [x, y, width, h] = faceRects(face).rules;
  const paragraphs =
    face.rulesParagraphs ??
    (face.rulesText ?? '')
      .split('\n')
      .filter(Boolean)
      .map((text) => ({ role: 'rules' as const, runs: [{ text }] }));
  const statsInset = face.power != null && face.toughness != null ? 8 : 0;
  return layoutRules(
    context,
    paragraphs,
    {
      x: x * FACE_WIDTH + 3.5,
      y: y * height + 5,
      width: width * FACE_WIDTH - 13,
      height: h * height - 12 - statsInset,
    },
    24 * scale,
    15 * scale,
  );
}

export function paintRulesLayout(
  context: CanvasRenderingContext2D,
  layout: RulesLayout,
  images: CanvasImages,
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
  for (const line of layout.lines) {
    let x = layout.x;
    for (const run of line.runs) {
      if (run.symbol)
        paintMana(
          context,
          run.text,
          x + layout.size * 0.025,
          line.baseline - layout.size * 0.72,
          layout.size * 0.8,
          images,
        );
      else {
        context.font = rulesFont(layout.size, run.italic);
        context.fillText(run.text, x, line.baseline);
      }
      x += run.width;
    }
  }
  context.restore();
}
