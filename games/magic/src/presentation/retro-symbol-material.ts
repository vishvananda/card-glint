import type { RenderedCardInput } from './face-layout.js';

export type RetroSymbolPalette = readonly [string, string, string];

/** Exodus bridge: white outside rim/windows, dark common ink or pale metallic
 * center with darker sides. Shared printing treatment, not scan-specific HSB.
 * Caller-supplied symbols retain their own original paint path. */
export function retroSymbolPalette(face: RenderedCardInput): RetroSymbolPalette | null {
  if (face.setSymbol || face.setCode?.toLowerCase() !== 'exo') return null;
  return face.rarity === 'uncommon'
    ? ['#7f9196', '#cdd7da', '#7c8d92']
    : face.rarity === 'rare'
      ? ['#8e7934', '#d3bd66', '#91803b']
      : ['#4a5251', '#252b2b', '#555e5d'];
}
