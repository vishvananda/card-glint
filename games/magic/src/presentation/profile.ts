import { basicLandColor } from './plate-basic-land.js';
const COLOR_ORDER = 'WUBRG';

export type FrameAssetKey =
  | 'Artifact'
  | 'B'
  | 'BG'
  | 'BR'
  | 'Colourless'
  | 'G'
  | 'Gold'
  | 'R'
  | 'RG'
  | 'U'
  | 'UB'
  | 'UG'
  | 'UR'
  | 'W'
  | 'WB'
  | 'WG'
  | 'WR'
  | 'WU';
export type BoxAssetKey = 'Artifact' | 'B' | 'Colourless' | 'G' | 'Gold' | 'Land' | 'R' | 'U' | 'W';
export type FrameColor = 'W' | 'U' | 'B' | 'R' | 'G';

export interface CardProfileInput {
  colors?: readonly string[];
  /** Printed frame palette when it differs from the card's rules colors. */
  frameColors?: readonly FrameColor[];
  typeLine?: string;
  canonicalTypeLine?: string;
  artifact?: boolean;
  land?: boolean;
  legendary?: boolean;
  creature?: boolean;
}

export interface CardProfile {
  frame: FrameAssetKey;
  boxes: BoxAssetKey;
  background: BoxAssetKey | FrameAssetKey;
  crown: BoxAssetKey | FrameAssetKey;
  pt: BoxAssetKey;
  artifact: boolean;
  land: boolean;
  legendary: boolean;
  creature: boolean;
  className: string;
}

/**
 * Bounded ordinary-card adapter used until the content sidecar supplies frame
 * traits directly. Explicit flags always win; the type-line checks only fill
 * fields that the presentation input does not expose separately.
 */
export function resolveCardProfile(input: CardProfileInput): CardProfile {
  const typeLine = input.canonicalTypeLine ?? input.typeLine ?? '';
  const artifact = input.artifact ?? /(^|\s)Artifact(?:\s|$)/i.test(typeLine);
  const land =
    input.land ?? (!/^Enchant\b/i.test(typeLine) && /(^|\s)Land(?:\s|$)/i.test(typeLine));
  const legendary =
    !/\bPlaneswalker\b/i.test(typeLine) &&
    (input.legendary ?? /(^|\s)Legendary(?:\s|$)/i.test(typeLine));
  const creature = input.creature ?? /(^|\s)Creature(?:\s|$)/i.test(typeLine);
  const colors = resolveFrameColors(input);
  const colorKey =
    colors.length === 0
      ? 'Colourless'
      : colors.length > 2
        ? 'Gold'
        : (colors.join('') as FrameAssetKey);
  const frame = (artifact || land) && colors.length === 0 ? 'Artifact' : colorKey;
  const boxes = land
    ? 'Land'
    : artifact
      ? 'Artifact'
      : colors.length > 1
        ? 'Gold'
        : (colorKey as BoxAssetKey);
  return {
    frame,
    boxes,
    background: boxes,
    // Land crowns keep the same color pair as their frame; panels stay land material.
    crown:
      land && colors.length > 0
        ? colorKey
        : artifact && colors.length > 0
          ? colors.length > 1
            ? 'Gold'
            : colorKey
          : boxes,
    pt: boxes,
    artifact,
    land,
    legendary,
    creature,
    className: `rendered-card-profile-${boxes.toLocaleLowerCase()}`,
  };
}

/** Presentation color selection never rewrites the card's semantic colors. */
export function resolveFrameColors(input: CardProfileInput): string[] {
  if (input.frameColors !== undefined) return normalizeColors(input.frameColors);
  const colors = normalizeColors(input.colors ?? []);
  const basic = basicLandColor(input);
  return colors.length === 0 && basic && input.land !== false ? [basic] : colors;
}

export function normalizeColors(colors: readonly string[]): string[] {
  return [
    ...new Set(
      colors
        .map((color) => color.toLocaleUpperCase())
        .filter((color) => COLOR_ORDER.includes(color)),
    ),
  ].sort((left, right) => COLOR_ORDER.indexOf(left) - COLOR_ORDER.indexOf(right));
}
