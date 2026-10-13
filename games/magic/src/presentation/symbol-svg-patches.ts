import patches from '../../symbol-svg-patches.json' with { type: 'json' };
import { CONJURER_ROOT } from './styled-set-symbols.js';

const ROOT = `${CONJURER_ROOT}/img/setSymbols/official/`;
const sources: Readonly<Record<string, { sha256: string; recipe: string }>> = patches.sources;

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
  if (root.localName !== 'svg' || doc.querySelector('parsererror') || !gradient)
    throw Error(`Unexpected pinned symbol SVG: ${url}`);
  const set = (element: Element, attributes: Record<string, string>) => {
    for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
  };
  if (patch.recipe === 'white-outer-rim') {
    if (paths.length !== 3) throw Error('Unexpected rimmed symbol topology.');
    paths[0]!.setAttribute('fill', '#fff');
  } else if (patch.recipe === 'm15') {
    if (paths.length !== 6) throw Error('Unexpected M15 path topology.');
    // Metallic field, black lettering/inset line, and an independent black rim.
    // SVG viewport clipping keeps the stroke inside the original viewport.
    set(paths[0]!, { fill: `url(#${gradient.id})`, stroke: '#000', 'stroke-width': '8' });
    for (const path of paths.slice(1)) path.setAttribute('fill', '#000');
  } else if (patch.recipe === '8ed' || patch.recipe === '9ed') {
    if (paths.length !== 4) throw Error('Unexpected numeric shield path topology.');
    const panels = paths[2]!,
      transform = panels.parentElement?.getAttribute('transform');
    if (!transform) throw Error('Missing numeric shield coordinate transform.');
    // The numeral lives in root coordinates; preserve the panel gradient's
    // appearance when applying it outside its transformed group.
    const metal = gradient.cloneNode(true) as Element;
    set(metal, {
      id: 'glint-root-metal',
      gradientTransform: `${transform} ${gradient.getAttribute('gradientTransform') ?? ''}`,
    });
    gradient.after(metal);
    paths[0]!.setAttribute('fill', '#000');
    set(paths[3]!, {
      fill: 'url(#glint-root-metal)',
      stroke: '#000',
      'stroke-width': patch.recipe === '8ed' ? '9' : '12',
      'paint-order': 'stroke fill',
    });
    if (patch.recipe === '8ed') {
      // Only the front card has a dark interior; the side cards stay metallic.
      const contours = panels.getAttribute('d')?.match(/[Mm][^Mm]+/g);
      if (contours?.length !== 3) throw Error('Unexpected Eighth Edition card panels.');
      const center = panels.cloneNode() as Element;
      set(center, {
        d: contours[0]!,
        style: `fill:#000;stroke:url(#${gradient.id});stroke-width:1.4`,
      });
      panels.after(center);
    }
  } else throw Error(`Unknown symbol SVG patch recipe: ${patch.recipe}`);
  root.setAttribute('data-card-glint-patch', patches.revision);
  return new Blob([new XMLSerializer().serializeToString(doc)], { type: 'image/svg+xml' });
}
