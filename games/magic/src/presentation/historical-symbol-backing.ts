import manifest from '../../assets.json' with { type: 'json' };

/** White details already enclosed by the pinned Keyrune outlines. Keep genuine
 * openings transparent (ARN hilt, ALL pole gap, EXO arch). Indices refer to
 * absolute, closed subpaths in the existing SVG, never a newly drawn contour.
 * The source vectors remain external; this module contains no copied paths. */
const DETAILS: Readonly<Record<string, { count: number; white: readonly number[] }>> = {
  arn: { count: 6, white: [2] },
  leg: { count: 6, white: [0, 1, 2, 3, 4] },
  hml: { count: 5, white: [3] },
  vis: { count: 2, white: [1] },
  all: { count: 5, white: [0, 1, 2] },
  wth: { count: 8, white: [0, 1, 2, 3, 4, 5, 6] },
  exo: { count: 6, white: [0, 1, 2, 3, 4] },
  ice2: { count: 16, white: [0] },
  por: { count: 21, white: Array.from({ length: 20 }, (_, index) => index) },
  tmp: { count: 2, white: [1] },
};

/** Internal decoded-image key only; this suffix is never fetched. */
export const historicalBackingKey = (url: string) => `${url}#opaque-print-details-v1`;

export const hasHistoricalBacking = (url: string): boolean =>
  Object.keys(DETAILS).some((key) => url === `${manifest.KEYRUNE_ROOT}/${key}.svg`);

/** Derive a white-detail bitmap during asset preparation. Only exact pinned
 * vectors qualify; custom URLs and all original source bitmaps are unchanged.
 * Closed-subpath validation makes a changed source fail instead of filling an
 * arbitrary hole. No raster mask readback or per-frame work is involved. */
export async function historicalBackingBlob(url: string, blob: Blob): Promise<Blob | null> {
  const code = Object.keys(DETAILS).find((key) => url === `${manifest.KEYRUNE_ROOT}/${key}.svg`);
  if (!code) return null;
  const document = new DOMParser().parseFromString(await blob.text(), 'image/svg+xml');
  const root = document.documentElement,
    paths = document.querySelectorAll('path'),
    d = paths[0]?.getAttribute('d') ?? '',
    parts = d.match(/M[^M]*/g) ?? [],
    detail = DETAILS[code]!;
  if (
    root.localName !== 'svg' ||
    document.querySelector('parsererror') ||
    paths.length !== 1 ||
    parts.length !== detail.count ||
    parts.some((part) => /m/.test(part) || !/[zZ]\s*$/.test(part))
  )
    throw new Error(`Unexpected pinned ${code} symbol paths.`);
  const white = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  white.setAttribute('d', detail.white.map((index) => parts[index]!).join(''));
  white.setAttribute('fill', '#fff');
  root.replaceChildren(white);
  return new Blob([new XMLSerializer().serializeToString(document)], { type: 'image/svg+xml' });
}
