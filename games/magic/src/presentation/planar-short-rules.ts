import { type CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import type { RenderedCardInput, RulesParagraph } from './face-layout.js';
import { framePlate } from './frame-plates.js';
import { usesPlanarFrameGeometry } from './planar-frame-geometry.js';
import { layoutRules, type RulesLayout } from './rules-layout.js';

/** A small size reduction can remove a stray final word from a short passage.
 * Long flavor endings retain their cadence. This policy is shared by content,
 * never selected by printing ID or by a scan during rendering. */
export function planarShortRules(
  context: CanvasContext,
  face: RenderedCardInput,
  paragraphs: readonly RulesParagraph[],
  original: RulesLayout,
  bounds: Parameters<typeof layoutRules>[2],
): RulesLayout {
  if (
    face.setCode?.toLowerCase() !== 'plc' ||
    face.frameAssetFamily !== 'eighth' ||
    face.frameTemplate ||
    (face.layout && face.layout !== 'normal') ||
    original.size !== 24.5 ||
    original.lines.length > 5
  )
    return original;
  const plate = framePlate(face);
  if (!plate || !usesPlanarFrameGeometry(face, plate.frame)) return original;
  // Match the existing measured PLC spacing, but retain its fit and its exact
  // raster unless a short tail disappears at the first safe smaller size.
  const typography = {
    leading: 0.965,
    paragraphGap: 0.4375,
    flavorGap: 0.625,
    flavorSeparator: false,
  };
  const placement = { ...bounds, x: original.x };
  const hasShortTail = (size: number) =>
    paragraphs.some((paragraph) => {
      // Explicit line breaks are host wording, not automatic wrapping.
      if (paragraph.runs.some((run) => run.text.includes('\n'))) return false;
      const block = layoutRules(
        context,
        [paragraph],
        { ...placement, height: 1000, exclusions: [] },
        size,
        size,
        typography,
      );
      const last = block.lines.at(-1);
      if (block.lines.length < 2 || !last || last.width >= bounds.width * 0.35) return false;
      return (
        paragraph.role === 'rules' ||
        (last.runs
          .map((run) => run.text)
          .join('')
          .trim()
          .match(/\S+/g)?.length ?? 0) === 1
      );
    });
  if (!hasShortTail(original.size)) return original;
  for (let size = original.size - 0.25; size >= original.size - 2; size -= 0.25) {
    const candidate = layoutRules(context, paragraphs, placement, size, size, typography);
    if (
      !candidate.overflow &&
      candidate.lines.length < original.lines.length &&
      !hasShortTail(size)
    )
      return candidate;
  }
  return original;
}
