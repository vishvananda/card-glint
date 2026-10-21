import type { RenderedCardInput } from './face-layout.js';
import { resolveFrameColors } from './profile.js';

/** Semantic land colors survive original type lines such as just “Land”. */
export function retroLandColors(face: RenderedCardInput): string[] {
  return face.frameColors
    ? resolveFrameColors(face)
    : [
        ['Plains', 'W'],
        ['Island', 'U'],
        ['Swamp', 'B'],
        ['Mountain', 'R'],
        ['Forest', 'G'],
      ]
        .filter(([type]) =>
          new RegExp(String.raw`\b${type}\b`).test(face.canonicalTypeLine ?? face.typeLine ?? ''),
        )
        .map(([, color]) => color!);
}
