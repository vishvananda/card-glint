import type { RenderedCardInput } from './face-layout.js';
import type { layoutRules, RulesLayout } from './rules-layout.js';
import { framePlate } from './frame-plates.js';
import { usesPlanarFrameGeometry } from './planar-frame-geometry.js';

/** Shared PLC spacing after ordinary wrapping. A reflow trial enlarged dense
 * passages and regressed held-out cards; retain the original size and breaks.
 * Frame-only scan poses are comparison inputs and never enter this function. */
export function planarRulesSpacing(
  face: RenderedCardInput,
  original: RulesLayout,
  bounds: Parameters<typeof layoutRules>[2],
): RulesLayout {
  if (
    face.setCode?.toLowerCase() !== 'plc' ||
    face.frameAssetFamily !== 'eighth' ||
    face.frameTemplate ||
    (face.layout && face.layout !== 'normal')
  )
    return original;
  const plate = framePlate(face);
  if (!plate || !usesPlanarFrameGeometry(face, plate.frame) || !original.lines.length)
    return original;
  let advance = 0;
  const lines = original.lines.map((line, i) => {
    if (i) {
      const previous = original.lines[i - 1]!;
      const size = previous.runs[0]?.size ?? original.size;
      const gap = line.baseline - previous.baseline - size;
      const factor =
        previous.role === 'rules' && line.role === 'flavor' ? 0.625 / 0.9 : 0.4375 / 0.45;
      advance += size * (0.965 - 1) + gap * (factor - 1);
    }
    return {
      ...line,
      x: (line.x ?? original.x) + 2.25,
      baseline: line.baseline + advance,
      inkBounds: [
        line.inkBounds[0] + 2.25,
        line.inkBounds[1] + advance,
        line.inkBounds[2],
        line.inkBounds[3],
      ] as const,
    };
  });
  const first = lines[0]!,
    last = lines.at(-1)!;
  const height = last.inkBounds[1] + last.inkBounds[3] - first.inkBounds[1];
  const top = bounds.y + Math.max(0, (bounds.height - height) / 2);
  const offset = top - first.inkBounds[1];
  const shifted = lines.map((line) => ({
    ...line,
    baseline: line.baseline + offset,
    inkBounds: [
      line.inkBounds[0],
      line.inkBounds[1] + offset,
      line.inkBounds[2],
      line.inkBounds[3],
    ] as const,
  }));
  if (
    height > bounds.height + 0.01 ||
    shifted.some((line) =>
      bounds.exclusions?.some(([x, y, w, h]) => {
        const [lx, ly, lw, lh] = line.inkBounds;
        return lx < x + w && lx + lw > x && ly < y + h && ly + lh > y;
      }),
    )
  )
    return original;
  return { ...original, x: original.x + 2.25, top, height, lines: shifted };
}
