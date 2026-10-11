import { extraRuleBlocks } from './extra-rules.js';
import { FACE_TEXT, type RenderedCardInput } from './face-layout.js';
import { paintRules, rulesLines } from './canvas-text.js';
import type { CanvasImages } from './canvas-assets.js';

export function paintExtraRules(
  context: CanvasRenderingContext2D,
  face: RenderedCardInput,
  images: CanvasImages,
) {
  for (const block of extraRuleBlocks(face)) {
    const { x, y, width, height, font } = block;
    context.save();
    context.textAlign = 'left';
    context.fillStyle = block.fill ?? 'transparent';
    if (block.kind === 'level') {
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + width * 0.72, y);
      context.lineTo(x + width, y + height / 2);
      context.lineTo(x + width * 0.72, y + height);
      context.lineTo(x, y + height);
      context.closePath();
      context.fill();
      context.strokeStyle = '#0008';
      context.lineWidth = 1;
      context.stroke();
    } else if (block.fill) context.fillRect(x, y, width, height);
    const image = block.asset ? images.get(block.asset) : null;
    if (image) context.drawImage(image, x, y, width, height);
    context.beginPath();
    context.rect(x, y, width, height);
    context.clip();
    context.fillStyle = block.color ?? '#17140f';
    if (['stats', 'level'].includes(block.kind)) {
      context.font = `${font}px "CardRenderer MTG Beleren", Georgia`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      const lines = block.text.split('\n');
      lines.forEach((line, i) =>
        context.fillText(
          line,
          x + width * (block.kind === 'level' ? 0.43 : 0.5),
          y + height / 2 + (i - (lines.length - 1) / 2) * font,
          width * 0.85,
        ),
      );
    } else if (block.align === 'right') {
      context.font = `${font}px "CardRenderer MTG MPlantin", Georgia`;
      context.textAlign = 'right';
      context.textBaseline = 'middle';
      context.fillText(block.text, x + width, y + height / 2, width);
    } else {
      context.font = `${block.italic ? 'italic ' : ''}${font}px "CardRenderer MTG MPlantin", Georgia`;
      const textHeight =
        rulesLines(context, block.text, width, font).length * font +
        (block.text.split('\n').length - 1) * FACE_TEXT.paragraphGap;
      paintRules(
        context,
        block.text,
        x,
        y + Math.max(0, (height - textHeight) / 2),
        width,
        { size: font, italic: !!block.italic },
        images,
      );
    }
    context.restore();
  }
}
