import type { RenderedCardInput } from './face-layout.js';
import { legendsFrame } from './legends-frame.js';

/** Shared printing typography, independent of original/Oracle wording.
 * Legends uses 36 training and 36 held-out frozen frame registrations.
 * No per-card offsets or additional horizontal stretch are applied. */
export function retroTypePlacement(face: RenderedCardInput) {
  const legends =
    (!face.borderColor || face.borderColor === 'black') && Boolean(legendsFrame(face));
  return {
    fontSize: legends ? 21.7 * 1.03 : 21.7,
    dx: legends ? -2.5 : 0,
    dy: 0,
  };
}
