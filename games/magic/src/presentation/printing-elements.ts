import type { RenderedCardInput } from './face-layout.js';

export type PrintingElement = 'artist' | 'legal' | 'collector' | 'manaCost' | 'setSymbol';
export interface PrintingElementOverride {
  /** Omitted follows the preset. Hidden is explicit and survives preset changes. */
  hidden?: boolean;
  /** Translation in the painter's canonical 488 × 680 face coordinates. */
  offset?: readonly [number, number];
}
export type PrintingElements = Partial<Record<PrintingElement, PrintingElementOverride>>;
const names = new Set(['artist', 'legal', 'collector', 'manaCost', 'setSymbol']);
export function validatePrintingElements(face: RenderedCardInput): void {
  if (face.printingElements === undefined) return;
  if (
    !face.printingElements ||
    typeof face.printingElements !== 'object' ||
    Array.isArray(face.printingElements)
  )
    throw Error('Printing elements must be an object');
  if (!Object.keys(face.printingElements).length) return;
  if (
    face.faces?.length ||
    (face.layout && !['normal', 'token'].includes(face.layout)) ||
    (face.frameTemplate && face.frameTemplate !== 'future') ||
    /\b(Saga|Class|Planeswalker|Battle)\b/.test(face.typeLine ?? '') ||
    /^Level up\b/m.test(face.rulesText ?? '')
  )
    throw Error('Printing element controls require an ordinary face or Futureshifted template.');
  for (const [name, value] of Object.entries(face.printingElements)) {
    if (!names.has(name) || !value || typeof value !== 'object' || Array.isArray(value))
      throw Error('Invalid printing element');
    for (const key of Object.keys(value))
      if (!['hidden', 'offset'].includes(key)) throw Error('Unknown printing element option');
    if (value.hidden !== undefined && typeof value.hidden !== 'boolean')
      throw Error('Invalid element visibility');
    if (
      value.offset !== undefined &&
      (!Array.isArray(value.offset) ||
        value.offset.length !== 2 ||
        !value.offset.every((n: number) => Number.isFinite(n) && Math.abs(n) <= 100))
    )
      throw Error('Printing offset must be within 100 reference pixels');
  }
}
/** Scoped semantic groups, not global Canvas interception or post-raster repair.
 * Preserve the painter's font/color/shadow and restore state even on failure. */
export function paintPrintingElement(
  c: CanvasRenderingContext2D,
  face: RenderedCardInput,
  element: PrintingElement,
  paint: () => void,
): void {
  const option = face.printingElements?.[element];
  if (option?.hidden) return;
  if (!option?.offset) return paint();
  c.save();
  try {
    c.translate(...option.offset);
    paint();
  } finally {
    c.restore();
  }
}
