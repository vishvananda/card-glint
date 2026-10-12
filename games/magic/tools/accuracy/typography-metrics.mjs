import { inkEdges } from './edges.mjs';
import { cropGray } from './pixels.mjs';

export const normalizedText = (text) =>
  text.normalize('NFKC').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s/g, '');
export const lineText = (line) =>
  line.runs.map((run) => (run.symbol ? `{${run.text}}` : run.text)).join('');
const mean = (values) => (values.length ? values.reduce((a, b) => a + b, 0) / values.length : null);

function breaks(lines) {
  let offset = 0;
  return lines.slice(0, -1).map((text) => (offset += normalizedText(text).length));
}

/** Hard paragraph breaks come from the input and must not inflate wrapping agreement. */
export function wrapping(expected, actual, paragraphs) {
  if (normalizedText(expected.join('')) !== normalizedText(actual.join('')))
    return { status: 'content-mismatch' };
  const hard = new Set(breaks(paragraphs));
  const a = breaks(expected).filter((p) => !hard.has(p));
  const b = breaks(actual).filter((p) => !hard.has(p));
  const matching = b.filter((p) => a.includes(p)).length;
  return {
    status: 'measured',
    softBreakF1: a.length + b.length ? (2 * matching) / (a.length + b.length) : 1,
    expectedLines: expected.length,
    actualLines: actual.length,
    lineCountError: actual.length - expected.length,
    exactWrapping:
      expected.length === actual.length &&
      expected.every((t, i) => normalizedText(t) === normalizedText(actual[i])),
  };
}

/** Read actual ink near each reported baseline; never move a scan or a rendered line. */
export function renderedLineBounds(image, layout, rect = [35, 428, 420, 198]) {
  const [rx, ry, rw, rh] = rect;
  const region = cropGray(image, rect);
  const { ink } = inkEdges(region.gray, region.width, region.height);
  return layout.lines.map((line, i) => {
    const size = Math.max(...line.runs.map((r) => r.size ?? layout.size));
    const before = layout.lines[i - 1],
      after = layout.lines[i + 1];
    const minY = Math.max(
      ry,
      Math.floor(line.baseline - size * 0.8),
      before ? Math.ceil((before.baseline + line.baseline) / 2 - size * 0.25) : ry,
    );
    const maxY = Math.min(
      ry + rh - 1,
      Math.ceil(line.baseline + size * 0.24),
      after ? Math.floor((after.baseline + line.baseline) / 2 - size * 0.25) : ry + rh - 1,
    );
    let left = Infinity,
      top = Infinity,
      right = -1,
      bottom = -1;
    for (let y = minY; y <= maxY; y++)
      for (
        let x = Math.max(rx, Math.floor((line.x ?? layout.x) - 2));
        x <= Math.min(rx + rw - 1, Math.ceil((line.x ?? layout.x) + line.width + 2));
        x++
      )
        if (ink[(y - ry) * region.width + x - rx]) {
          left = Math.min(left, x);
          right = Math.max(right, x);
          top = Math.min(top, y);
          bottom = Math.max(bottom, y);
        }
    return right < 0 ? null : [left, top, right - left + 1, bottom - top + 1];
  });
}

export function typographyMetrics(target, card, image) {
  const actual = card.layout.lines.map(lineText);
  const paragraphs = card.face.rulesParagraphs.map((p) => p.runs.map((r) => r.text).join(''));
  const result = wrapping(
    target.lines.map((l) => l.text),
    actual,
    paragraphs,
  );
  if (result.status !== 'measured') return result;
  const bounds = renderedLineBounds(
    image,
    card.layout,
    card.frame?.startsWith('retro-') ? [59, 413, 373, 188] : undefined,
  );
  const expectedBounds = target.lines.map((l) => l.inkBounds);
  const used = new Set();
  const pairs = actual.flatMap((text, i) => {
    const j = target.lines.findIndex(
      (l, j) => !used.has(j) && normalizedText(l.text) === normalizedText(text),
    );
    if (j < 0 || !bounds[i]) return [];
    used.add(j);
    return [{ expected: expectedBounds[j], actual: bounds[i] }];
  });
  const extent = (boxes) => {
    const present = boxes.filter(Boolean);
    return present.length
      ? [Math.min(...present.map((b) => b[1])), Math.max(...present.map((b) => b[1] + b[3]))]
      : null;
  };
  const a = extent(expectedBounds),
    b = extent(bounds);
  return {
    ...result,
    matchedLines: pairs.length,
    blockEdgeMae: a && b ? (Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])) / 2 : null,
    matchedLineTopMae: mean(pairs.map((p) => Math.abs(p.actual[1] - p.expected[1]))),
    matchedLineWidthMae: mean(pairs.map((p) => Math.abs(p.actual[2] - p.expected[2]))),
    lines: actual.map((text, i) => ({ text, inkBounds: bounds[i] })),
  };
}
