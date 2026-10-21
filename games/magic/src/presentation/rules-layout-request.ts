import type { CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';
import type { RulesParagraph } from './face-layout.js';
import type { RulesLayout, RulesTypography, layoutRules } from './rules-layout.js';

interface RulesLayoutRequest {
  readonly paragraphs: readonly RulesParagraph[];
  readonly bounds: Parameters<typeof layoutRules>[2];
  readonly maximumSize: number;
  readonly minimumSize: number;
  readonly typography: RulesTypography;
}
const requests = new WeakMap<RulesLayout, RulesLayoutRequest>();
const traced = new WeakMap<CanvasContext, number>();
const copyRequest: unique symbol = Symbol('prepared-rules-request');
type PreparedLayout = RulesLayout & {
  [copyRequest]?: { request: RulesLayoutRequest; x: number; top: number };
};

/** Only opted-in profile layouts carry metadata through object spreads. The
 * symbol is private and omitted by JSON; it does not change glyph pixels. */
export function rememberRulesLayoutRequest(
  context: CanvasContext,
  layout: RulesLayout,
  request: RulesLayoutRequest,
): void {
  requests.set(layout, request);
  if (traced.has(context))
    Object.defineProperty(layout, copyRequest, {
      value: { request, x: layout.x, top: layout.top },
      enumerable: true,
    });
}
export function rulesLayoutRequest(layout: RulesLayout): RulesLayoutRequest | undefined {
  const direct = requests.get(layout);
  if (direct) return direct;
  const prepared = (layout as PreparedLayout)[copyRequest];
  if (!prepared) return undefined;
  const { request, x, top } = prepared;
  const dx = layout.x - x,
    dy = layout.top - top;
  return {
    ...request,
    bounds: {
      ...request.bounds,
      x: request.bounds.x + dx,
      y: request.bounds.y + dy,
      verticalLimits: request.bounds.verticalLimits
        ? [request.bounds.verticalLimits[0] + dy, request.bounds.verticalLimits[1] + dy]
        : undefined,
    },
  };
}

/** Synchronous and context-local; exception/nesting cleanup prevents one card
 * from changing the layout metadata policy of a neighboring preparation. */
export function withRulesLayoutRequests<T extends RulesLayout | null>(
  context: CanvasContext,
  run: () => T,
): T {
  const previous = traced.get(context) ?? 0;
  traced.set(context, previous + 1);
  try {
    return run();
  } finally {
    if (previous) traced.set(context, previous);
    else traced.delete(context);
  }
}
