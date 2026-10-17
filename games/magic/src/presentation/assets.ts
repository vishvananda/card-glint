import type { RenderedCardInput } from './face-layout.js';
import manifest from '../../assets.json' with { type: 'json' };
import type { SingleFrame } from './special-frames.js';
import type { CardProfile } from './profile.js';
import { setSymbolVector } from './set-symbols.js';
import { chroniclesSymbol } from './chronicles-symbols.js';
import { isStyledSetSymbol } from './styled-set-symbols.js';

export const RENDERER_COMPONENT_ROOT = manifest.RENDERER_COMPONENT_ROOT;

export interface CardProfileAssets {
  background: string;
  frame: string;
  boxes: string;
  nameplate: string;
  crown: string;
  pt: string;
}

export function profileAssets(
  profile: CardProfile,
  kind: SingleFrame = 'normal',
): CardProfileAssets {
  const ordinary = ['normal', 'adventure', 'leveler'].includes(kind);
  const folder =
    kind === 'saga' ? 'saga' : kind === 'planeswalker-large' ? 'planeswalker_large' : kind;
  const boxes =
    ordinary && profile.land && /^[WUBRG]$/.test(profile.frame)
      ? profile.frame
      : ['saga', 'class'].includes(kind) && profile.boxes === 'Colourless'
        ? 'Land'
        : kind.startsWith('planeswalker') && profile.boxes === 'Artifact'
          ? 'Colourless'
          : profile.boxes;
  return {
    background: componentAsset(
      ordinary ? 'bg' : kind === 'class' ? 'saga_bg' : `${folder}_bg`,
      kind.startsWith('planeswalker') && boxes === 'Land'
        ? 'Colourless'
        : ordinary
          ? profile.boxes
          : boxes,
    ),
    frame: componentAsset(
      ['normal', 'leveler'].includes(kind) ? 'frames' : `${folder}_frames`,
      kind === 'adventure'
        ? 'WUBRG'.includes(profile.frame)
          ? profile.frame
          : 'W'
        : kind === 'class'
          ? profile.frame === 'WU'
            ? 'UW'
            : profile.frame.length === 2
              ? 'Gold'
              : profile.frame
          : kind === 'saga' && profile.frame === 'Colourless'
            ? 'Land'
            : kind.startsWith('planeswalker') && ['Artifact', 'Land'].includes(profile.frame)
              ? 'Colourless'
              : profile.frame,
    ),
    boxes: componentAsset(kind.startsWith('planeswalker') ? 'planeswalker_boxes' : 'boxes', boxes),
    nameplate: componentAsset('nameplates', profile.boxes),
    crown: componentAsset('legendary-crowns', profile.crown),
    pt: kind.startsWith('planeswalker')
      ? componentAsset('planeswalker', 'Loyalty')
      : componentAsset('pt-boxes', profile.pt),
  };
}

export function manaSymbolAsset(symbol: string): string | null {
  const normalized = symbol.replace(/^\{|\}$/g, '').toLocaleUpperCase();
  const key =
    normalized === '∞' ? 'INFINITY' : normalized === '½' ? 'HALF' : normalized.replaceAll('/', '');
  return /^[A-Z0-9]+$/.test(key) ? componentAsset('symbols', key) : null;
}

export function setSymbolAsset(
  setCode: string,
  rarity?: string,
  source?: RenderedCardInput['setSymbolSource'],
): string | null {
  return setSymbolVector(setCode, rarity, source);
}

export function componentAsset(group: string, name: string): string {
  const directory =
    group === 'legendary-crowns'
      ? 'legendary_crowns'
      : group === 'pt-boxes'
        ? 'pt_boxes'
        : group === 'nameplates'
          ? 'boxes'
          : group;
  const extension = group === 'symbols' ? 'svg' : 'webp';
  return `${RENDERER_COMPONENT_ROOT}/img/${directory}/${encodeURIComponent(name)}.${extension}`;
}

/** Explicit symbols support custom sets without changing their printed names. */
export function faceSetSymbol(face: RenderedCardInput, rarity = face.rarity): string | null {
  if (face.printingElements?.setSymbol?.hidden) return null;
  const set = face.setCode?.trim().toLowerCase() ?? '';
  return (
    face.setSymbol ??
    setSymbolAsset(
      set === 'chr' ? (chroniclesSymbol(face.name) ?? '') : set,
      rarity,
      face.setSymbolSource,
    )
  );
}

/** Rarity colors belong to the printed icon, not its etched/embossed contours.
 * Preset symbol-code overrides resolve to explicit styled URLs; normalize those
 * too, while preserving unrelated host-owned symbols and historical identities. */
export function faceEtchingSymbol(face: RenderedCardInput): string | null {
  if (face.printingElements?.setSymbol?.hidden) return null;
  if (isStyledSetSymbol(face.setSymbol)) {
    const code = new URL(face.setSymbol!).pathname.match(/\/([^/]+)-[curms]\.svg$/)?.[1];
    if (code) return setSymbolAsset(code, 'common', 'cardconjurer');
  }
  return faceSetSymbol(face, 'common');
}
