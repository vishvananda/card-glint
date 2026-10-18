import type { RulesParagraph } from './face-layout.js';
import { wrapRules, type MeasuredRun } from './rules-wrap.js';
import { flavorAttribution } from './flavor-attribution.js';
export { rulesFont, type MeasuredRun } from './rules-wrap.js';

export interface RulesLine {
  x?: number;
  runs: MeasuredRun[];
  width: number;
  baseline: number;
  role: RulesParagraph['role'];
  inkBounds: readonly [number, number, number, number];
}
export interface RulesLayout {
  size: number;
  x: number;
  top: number;
  width: number;
  height: number;
  overflow: boolean;
  lines: RulesLine[];
  separators: number[];
}
interface RulesLayoutRequest {
  readonly paragraphs: readonly RulesParagraph[];
  readonly bounds: Parameters<typeof layoutRules>[2];
  readonly maximumSize: number;
  readonly minimumSize: number;
  readonly typography: RulesTypography;
}
// Side metadata leaves the public layout/pixel shape unchanged and expires
// with the prepared layout. Used only when an opted-in proposal reflows text.
const requests = new WeakMap<RulesLayout, RulesLayoutRequest>();
export const rulesLayoutRequest = (layout: RulesLayout) => requests.get(layout);
export interface RulesTypography {
  /** Positive horizontal letter scale. Does not scale mana discs or line height. */
  textWidth?: number;
  leading: number;
  paragraphGap: number;
  flavorGap: number;
  flavorOrphans?: boolean;
  /** Only enable for printings whose dash-prefixed credits use right alignment. */
  flavorAttribution?: 'right';
  flavorSeparator?: boolean;
  balanceLines?: boolean;
  /** Balance centered passages while keeping adjacent left-aligned rules greedy. */
  balanceCenteredOnly?: boolean;
  /** Optical shift from vertical centering, constrained to the text box. */
  centerOffset?: number;
}
/** Shared ordinary-frame policy. Calibration fixtures never enter the painter. */
export const RULES_TYPOGRAPHY: Readonly<RulesTypography> = {
  leading: 1,
  paragraphGap: 0.45,
  flavorGap: 0.9,
};

/** Pure measured layout in reference pixels. Oversize words/blocks remain explicit errors. */
export function layoutRules(
  context: CanvasRenderingContext2D,
  paragraphs: readonly RulesParagraph[],
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
    /** Absolute ink limits can tighten a panel without moving its optical center. */
    verticalLimits?: readonly [number, number];
    exclusions?: readonly (readonly [number, number, number, number])[];
  },
  maximumSize = 24,
  minimumSize = 15,
  typography: RulesTypography = RULES_TYPOGRAPHY,
): RulesLayout {
  const textWidth = typography.textWidth ?? 1;
  if (!Number.isFinite(textWidth) || textWidth <= 0)
    throw Error('Magic rules text width must be finite and positive.');
  context.save();
  context.letterSpacing = '0px';
  context.textBaseline = 'alphabetic';
  context.textAlign = 'left';
  try {
    const blocks =
      typography.flavorAttribution === 'right' ? paragraphs.flatMap(flavorAttribution) : paragraphs;
    let layout: RulesLayout;
    let size = maximumSize;
    do {
      const lines: RulesLine[] = [],
        separators: number[] = [];
      let baseline = 0,
        previous: RulesParagraph['role'] | undefined;
      for (const paragraph of blocks) {
        let paragraphSize = size;
        let rows = wrapRules(
          context,
          paragraph.runs,
          bounds.width,
          paragraphSize,
          typography.balanceLines &&
            (!typography.balanceCenteredOnly || paragraph.align === 'center'),
          textWidth,
        );
        // Avoid a short orphan line in long flavor passages when a small size
        // reduction can remove it. Two-line quotations keep their intended cadence.
        if (
          paragraph.role === 'flavor' &&
          typography.flavorOrphans !== false &&
          rows.length > 2 &&
          rows.at(-1)!.reduce((n, run) => n + run.width, 0) < bounds.width * 0.3
        ) {
          for (
            let trialSize = paragraphSize - 0.25;
            trialSize >= paragraphSize * 0.94;
            trialSize -= 0.25
          ) {
            const trial = wrapRules(
              context,
              paragraph.runs,
              bounds.width,
              trialSize,
              typography.balanceLines &&
                (!typography.balanceCenteredOnly || paragraph.align === 'center'),
              textWidth,
            );
            if (trial.length < rows.length) {
              paragraphSize = trialSize;
              rows = trial;
              break;
            }
          }
        }
        if (!rows.length) continue;
        if (previous) {
          if (previous === 'rules' && paragraph.role === 'flavor') {
            baseline += size * typography.flavorGap;
          } else if (previous !== 'flavor' || paragraph.role !== 'flavor')
            baseline += size * typography.paragraphGap;
        }
        for (const runs of rows) {
          const ascent = Math.max(0, ...runs.map((run) => run.ascent));
          const descent = Math.max(0, ...runs.map((run) => run.descent));
          const width = runs.reduce((n, r) => n + r.width, 0);
          const x =
            bounds.x +
            (paragraph.align === 'right'
              ? bounds.width - width
              : paragraph.align === 'center'
                ? (bounds.width - width) / 2
                : 0);
          let cursor = 0,
            left = Infinity,
            right = -Infinity;
          for (const run of runs) {
            left = Math.min(left, cursor + run.inkLeft);
            right = Math.max(right, cursor + run.inkRight);
            cursor += run.width;
          }
          lines.push({
            x,
            runs,
            role: paragraph.role,
            baseline,
            width,
            inkBounds: [
              x + (runs.length ? left : 0),
              baseline - ascent,
              runs.length ? right - left : 0,
              ascent + descent,
            ],
          });
          baseline += paragraphSize * typography.leading;
        }
        previous = paragraph.role;
      }
      if (typography.flavorSeparator !== false) {
        for (let i = 1; i < lines.length; i++) {
          const above = lines[i - 1]!,
            below = lines[i]!;
          if (above.role !== 'rules' || below.role !== 'flavor') continue;
          // The cursor already includes a line advance. Position the separator
          // in the measured ink gap, not relative to the next baseline. This
          // also handles italic flavor fitted at a different font size.
          const bottom = above.inkBounds[1] + above.inkBounds[3];
          separators.push((bottom + below.inkBounds[1]) / 2 - 0.3);
        }
      }
      const inkTop = lines[0]?.inkBounds[1] ?? 0;
      const last = lines.at(-1)?.inkBounds;
      const inkHeight = last ? last[1] + last[3] - inkTop : 0;
      const spareHeight = Math.max(0, bounds.height - inkHeight);
      const preferredTop =
        bounds.y +
        Math.max(0, Math.min(spareHeight, spareHeight / 2 + (typography.centerOffset ?? 0)));
      const topLimit = Math.max(bounds.y, bounds.verticalLimits?.[0] ?? bounds.y);
      const bottomLimit = Math.min(
        bounds.y + bounds.height,
        bounds.verticalLimits?.[1] ?? bounds.y + bounds.height,
      );
      const offset = Math.max(topLimit, Math.min(bottomLimit - inkHeight, preferredTop)) - inkTop;
      layout = {
        size,
        x: bounds.x,
        top: inkTop + offset,
        width: bounds.width,
        height: inkHeight,
        overflow:
          inkHeight > bottomLimit - topLimit + 0.01 ||
          lines.some((line) => line.width > bounds.width + 0.01),
        lines: lines.map((line) => ({
          ...line,
          baseline: line.baseline + offset,
          inkBounds: [
            line.inkBounds[0],
            line.inkBounds[1] + offset,
            line.inkBounds[2],
            line.inkBounds[3],
          ],
        })),
        separators: separators.map((y) => y + offset),
      };
      layout.overflow ||= layout.lines.some((line) =>
        bounds.exclusions?.some(([x, y, w, h]) => {
          const [left, top, width, height] = line.inkBounds;
          return left < x + w && left + width > x && top < y + h && top + height > y;
        }),
      );
      if (!layout.overflow || size <= minimumSize) break;
      size = Math.max(minimumSize, size - 0.25);
    } while (true);
    requests.set(layout, { paragraphs, bounds, maximumSize, minimumSize, typography });
    return layout;
  } finally {
    context.restore();
  }
}
