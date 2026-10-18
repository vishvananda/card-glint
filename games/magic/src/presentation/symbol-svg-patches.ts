import patches from '../../symbol-svg-patches.json' with { type: 'json' };
import { CONJURER_ROOT } from './styled-set-symbols.js';

const ROOT = `${CONJURER_ROOT}/img/setSymbols/official/`;
interface SymbolPatch {
  sha256: string;
  recipe: string;
  pathCount?: number;
  fill?: string;
  outline?: { stroke: string; width: number };
}
const sources: Readonly<Record<string, SymbolPatch>> = patches.sources;

function policy(url: string) {
  if (!url.startsWith(ROOT) || !url.endsWith('.svg')) return undefined;
  const key = url.slice(ROOT.length, -4);
  return Object.hasOwn(sources, key) ? sources[key] : undefined;
}

export function hasSymbolSvgPatch(url: string): boolean {
  return Boolean(policy(url));
}

/** Rewrite the pinned source once before decode. No vector paths are vendored;
 * the checksum gates both the topology and the locally edited attributes. */
export async function patchSymbolSvg(url: string, blob: Blob): Promise<Blob> {
  const patch = policy(url);
  if (!patch) return blob;
  const bytes = await blob.arrayBuffer(),
    digest = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)),
    hash = [...digest].map((byte) => byte.toString(16).padStart(2, '0')).join('');
  if (hash !== patch.sha256) throw Error(`Unexpected pinned symbol checksum: ${url}`);
  const doc = new DOMParser().parseFromString(new TextDecoder().decode(bytes), 'image/svg+xml'),
    root = doc.documentElement,
    paths = [...root.querySelectorAll('path')],
    gradient = root.querySelector('linearGradient, radialGradient');
  if (
    root.localName !== 'svg' ||
    doc.querySelector('parsererror') ||
    (!gradient && patch.recipe !== 'remove-outer-white')
  )
    throw Error(`Unexpected pinned symbol SVG: ${url}`);
  const set = (element: Element, attributes: Record<string, string>) => {
    for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
  };
  if (patch.recipe === 'remove-outer-white') {
    // The first silhouette is the oversized exterior rim. LEG's separate
    // white interior details remain intact; DRK has only a filled crescent.
    if (
      paths.length !== patch.pathCount ||
      !/fill:\s*#ffffff\b/i.test(paths[0]!.getAttribute('style') ?? '')
    )
      throw Error('Unexpected monochrome symbol topology.');
    paths[0]!.remove();
    if (patch.fill) paths[1]!.setAttribute('fill', patch.fill);
  } else if (patch.recipe === 'white-outer-rim') {
    if (paths.length !== 3) throw Error('Unexpected rimmed symbol topology.');
    paths[0]!.setAttribute('fill', '#fff');
  } else if (patch.recipe === 'm15') {
    if (paths.length !== 6) throw Error('Unexpected M15 path topology.');
    // Metallic field, black lettering/inset line, and an independent black rim.
    // SVG viewport clipping keeps the stroke inside the original viewport.
    set(paths[0]!, { fill: `url(#${gradient!.id})`, stroke: '#000', 'stroke-width': '8' });
    for (const path of paths.slice(1)) path.setAttribute('fill', '#000');
  } else if (patch.recipe === '8ed' || patch.recipe === '9ed') {
    if (paths.length !== 4) throw Error('Unexpected numeric shield path topology.');
    const panels = paths[2]!,
      transform = panels.parentElement?.getAttribute('transform');
    if (!transform) throw Error('Missing numeric shield coordinate transform.');
    paths[0]!.setAttribute('fill', '#000');
    paths[3]!.setAttribute('fill', '#000');
    // Eighth keeps all three metallic card faces and their original black
    // frame/numeral. Only Ninth adds a metallic outline around its black 9.
    if (patch.recipe === '9ed') {
      // The numeral lives in root coordinates; preserve the panel gradient's
      // appearance when applying it outside its transformed group.
      const metal = gradient!.cloneNode(true) as Element;
      set(metal, {
        id: 'glint-root-metal',
        gradientTransform: `${transform} ${gradient!.getAttribute('gradientTransform') ?? ''}`,
      });
      gradient!.after(metal);
      set(paths[3]!, {
        stroke: 'url(#glint-root-metal)',
        'stroke-width': '12',
        'paint-order': 'stroke fill',
      });
    }
  } else throw Error(`Unknown symbol SVG patch recipe: ${patch.recipe}`);
  root.setAttribute('data-card-glint-patch', patches.revision);
  return new Blob([new XMLSerializer().serializeToString(doc)], { type: 'image/svg+xml' });
}

/** Prepared alternative for dark paper, never a second network request. */
export const symbolOutlineKey = (url: string) => `${url}#printed-outline-v1`;

export async function outlinedSymbolBlob(url: string, patched: Blob): Promise<Blob | null> {
  const outline = policy(url)?.outline;
  if (!outline) return null;
  const doc = new DOMParser().parseFromString(await patched.text(), 'image/svg+xml'),
    root = doc.documentElement,
    paths = [...root.querySelectorAll('path')];
  if (
    root.localName !== 'svg' ||
    doc.querySelector('parsererror') ||
    root.getAttribute('data-card-glint-patch') !== patches.revision ||
    paths.length !== 1
  )
    throw Error(`Unexpected prepared symbol outline: ${url}`);
  const path = paths[0]!;
  path.setAttribute('stroke', outline.stroke);
  path.setAttribute('stroke-width', String(outline.width));
  path.setAttribute('stroke-linejoin', 'round');
  path.setAttribute('paint-order', 'stroke fill');
  return new Blob([new XMLSerializer().serializeToString(doc)], { type: 'image/svg+xml' });
}
