import type { CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import catalog from './font-geometry.json' with { type: 'json' };

interface FontGeometry {
  readonly family: string;
  readonly weight: string;
  readonly style: string;
  readonly unitsPerEm: number;
  readonly ascent: number;
  readonly descent: number;
  readonly anchors: Readonly<Record<CanvasTextBaseline, number>>;
  readonly glyphs: Readonly<Record<string, readonly number[] | undefined>>;
}
interface FontRun {
  readonly geometry: FontGeometry;
  readonly size: number;
}
const faces: readonly FontGeometry[] = catalog;
const runs = new Map<string, FontRun | null>();
const reference = new WeakMap<FontGeometry, Map<string, TextMetrics>>();
const REFERENCE_SIZE = 1000;
const extents = new WeakMap<FontGeometry, Map<string, readonly [number, number] | null>>();

/** Frame coordinates own their anchor. A font family never changes it. */
export const FONT_GEOMETRY_REVISION = 'explicit-font-geometry-v1';

function fontRun(font: string): FontRun | undefined {
  if (runs.has(font)) return runs.get(font) ?? undefined;
  const family = /["'](CardRenderer MTG [^"']+)["']/.exec(font)?.[1];
  if (!family) return undefined;
  const size = Number(/([\d.]+)px\b/.exec(font)?.[1]);
  if (!(size > 0 && Number.isFinite(size))) throw Error('Invalid Magic font size');
  const style = /\b(?:italic|oblique)\b/.test(font) ? 'italic' : 'normal';
  const weight = /\bbold\b/.test(font)
    ? 700
    : Number(/(?:^|\s)([1-9]\d{1,2})(?=\s)/.exec(font)?.[1] ?? 400);
  const familyFaces = faces.filter((face) => face.family === family);
  const styled = familyFaces.filter((face) => face.style === style);
  const candidates = styled.length ? styled : familyFaces;
  const rank = (face: FontGeometry) => {
    const [minimum = 400, maximum = minimum] = face.weight.split(' ').map(Number);
    if (weight >= minimum && weight <= maximum) return 0;
    if (weight >= 400 && weight <= 500) {
      if (minimum > weight && minimum <= 500) return minimum - weight;
      if (maximum < weight) return 1000 + weight - maximum;
      return 2000 + minimum - weight;
    }
    return weight < 400
      ? maximum < weight
        ? weight - maximum
        : 1000 + minimum - weight
      : minimum > weight
        ? minimum - weight
        : 1000 + weight - maximum;
  };
  const geometry = [...candidates].sort((a, b) => rank(a) - rank(b))[0];
  if (!geometry) throw Error('Magic font has no reviewed geometry: ' + family);
  const run = { geometry, size };
  if (runs.size >= 256) runs.clear();
  runs.set(font, run);
  return run;
}

function inkExtents(geometry: FontGeometry, text: string): readonly [number, number] | undefined {
  let cache = extents.get(geometry);
  if (!cache) extents.set(geometry, (cache = new Map()));
  if (cache.has(text)) return cache.get(text) ?? undefined;
  let bottom = 0,
    top = 0;
  for (const character of text) {
    const code = character.codePointAt(0);
    const value = code === undefined ? undefined : geometry.glyphs[String(code)];
    const low = value?.[0],
      high = value?.[1];
    if (low === undefined || high === undefined) {
      if (cache.size >= 2048) cache.clear();
      cache.set(text, null);
      // Host-provided characters outside this font retain native fallback ink.
      return undefined;
    }
    bottom = Math.min(bottom, low);
    top = Math.max(top, high);
  }
  const value = [bottom / geometry.unitsPerEm, top / geometry.unitsPerEm] as const;
  if (cache.size >= 2048) cache.clear();
  cache.set(text, value);
  return value;
}

/** Measurement and painting use the same fractional advances. Alphabetic is the
 * only native baseline used for known pack fonts; all other anchors are numbers
 * from the reviewed font record. This also works in a worker FontFaceSet. */
function withFontRun<T>(context: CanvasContext, run: FontRun, operation: (offset: number) => T): T {
  const baseline = context.textBaseline ?? 'alphabetic',
    rendering = context.textRendering,
    kerning = context.fontKerning;
  const offset = run.geometry.anchors[baseline] * run.size;
  context.textBaseline = 'alphabetic';
  context.textRendering = 'geometricPrecision';
  context.fontKerning = 'normal';
  try {
    return operation(offset);
  } finally {
    context.textBaseline = baseline;
    context.textRendering = rendering;
    context.fontKerning = kerning;
  }
}

function referenceMetrics(context: CanvasContext, text: string, run: FontRun): TextMetrics {
  const scale = run.size / REFERENCE_SIZE;
  const font = context.font;
  const letter = context.letterSpacing;
  const word = context.wordSpacing;
  const spacing = (value: string) =>
    /^-?[\d.]+px$/.test(value) ? String(Number.parseFloat(value) / scale) + 'px' : value;
  const referenceFont = font.replace(/[\d.]+px\b/, String(REFERENCE_SIZE) + 'px');
  const letterSpacing = spacing(letter),
    wordSpacing = spacing(word);
  const key = JSON.stringify([
    referenceFont,
    letterSpacing,
    wordSpacing,
    context.direction,
    context.textAlign,
    context.fontStretch,
    context.fontVariantCaps,
    text,
  ]);
  let cache = reference.get(run.geometry);
  if (!cache) reference.set(run.geometry, (cache = new Map()));
  const previous = cache.get(key);
  if (previous) return previous;
  context.font = referenceFont;
  context.letterSpacing = letterSpacing;
  context.wordSpacing = wordSpacing;
  try {
    const metrics = context.measureText(text);
    if (cache.size >= 4096) cache.clear();
    cache.set(key, metrics);
    return metrics;
  } finally {
    context.font = font;
    context.letterSpacing = letter;
    context.wordSpacing = word;
  }
}

export function measureFontText(context: CanvasContext, text: string): TextMetrics {
  const run = fontRun(context.font);
  if (!run) return context.measureText(text);
  return withFontRun(context, run, (offset) => {
    const native = referenceMetrics(context, text, run);
    const scale = run.size / REFERENCE_SIZE;
    const ink = inkExtents(run.geometry, text);
    const overrides: Readonly<Record<string, number>> = {
      width: native.width * scale,
      actualBoundingBoxLeft: native.actualBoundingBoxLeft * scale,
      actualBoundingBoxRight: native.actualBoundingBoxRight * scale,
      actualBoundingBoxAscent:
        (ink ? ink[1] * run.size : native.actualBoundingBoxAscent * scale) - offset,
      actualBoundingBoxDescent:
        (ink ? -ink[0] * run.size : native.actualBoundingBoxDescent * scale) + offset,
      fontBoundingBoxAscent: run.geometry.ascent * run.size - offset,
      fontBoundingBoxDescent: run.geometry.descent * run.size + offset,
      emHeightAscent: run.geometry.ascent * run.size - offset,
      emHeightDescent: run.geometry.descent * run.size + offset,
      alphabeticBaseline: -offset,
      hangingBaseline: -run.geometry.anchors.hanging * run.size - offset,
      ideographicBaseline: -run.geometry.anchors.ideographic * run.size - offset,
    };
    return new Proxy(native, {
      get(target, property) {
        return typeof property === 'string' && Object.hasOwn(overrides, property)
          ? overrides[property]
          : Reflect.get(target, property, target);
      },
    });
  });
}

function paint(
  context: CanvasContext,
  text: string,
  x: number,
  y: number,
  width: number | undefined,
  stroke: boolean,
): void {
  const draw = (offset: number) => {
    if (stroke) {
      if (width === undefined) context.strokeText(text, x, y + offset);
      else context.strokeText(text, x, y + offset, width);
    } else if (width === undefined) context.fillText(text, x, y + offset);
    else context.fillText(text, x, y + offset, width);
  };
  const run = fontRun(context.font);
  if (run)
    withFontRun(context, run, (offset) => {
      const canonicalWidth =
        (referenceMetrics(context, text, run).width * run.size) / REFERENCE_SIZE;
      const nativeWidth = context.measureText(text).width;
      const scale = canonicalWidth > 0 && nativeWidth > 0 ? canonicalWidth / nativeWidth : 1;
      if (Math.abs(scale - 1) < 0.000001) return draw(offset);
      // Normalize only the tiny advance-rounding difference. Retain the actual
      // font size, baseline, stroke width and vertical glyph rasterization.
      context.save();
      context.scale(scale, 1);
      try {
        if (stroke) {
          if (width === undefined) context.strokeText(text, x / scale, y + offset);
          else context.strokeText(text, x / scale, y + offset, width / scale);
        } else if (width === undefined) context.fillText(text, x / scale, y + offset);
        else context.fillText(text, x / scale, y + offset, width / scale);
      } finally {
        context.restore();
      }
    });
  else draw(0);
}

export function paintFontText(
  context: CanvasContext,
  text: string,
  x: number,
  y: number,
  width?: number,
): void {
  paint(context, text, x, y, width, false);
}
export function strokeFontText(
  context: CanvasContext,
  text: string,
  x: number,
  y: number,
  width?: number,
): void {
  paint(context, text, x, y, width, true);
}
