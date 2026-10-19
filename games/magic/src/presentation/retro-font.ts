import { canvasFonts } from './canvas-font-registry.js';
import { fetchCardAsset } from '../fetch.js';
import { RETRO_FONT, RETRO_SYMBOL_FONT } from './retro-frame.js';
import type { CanvasFontAsset } from './canvas-fonts.js';
let ready: Promise<void> | undefined;
export const retroFontAssets: readonly CanvasFontAsset[] = [
  { family: 'CardRenderer MTG Goudy', url: RETRO_FONT, weight: '400', style: 'normal' },
  {
    family: 'CardRenderer MTG Historic Symbols',
    url: RETRO_SYMBOL_FONT,
    weight: '400',
    style: 'normal',
  },
];
export function loadRetroFont(): Promise<void> {
  if (typeof FontFace !== 'function') return Promise.resolve();
  return (ready ??= Promise.all(
    retroFontAssets.map(async ({ family, url }) => {
      if (
        [...canvasFonts()].some(
          (f) => f.family.replace(/^"|"$/g, '') === family && f.status === 'loaded',
        )
      )
        return;
      const response = await fetchCardAsset(url);
      if (!response.ok) throw Error(`Retro font unavailable: ${family}`);
      canvasFonts().add(await new FontFace(family, await response.arrayBuffer()).load());
    }),
  )
    .then(() => undefined)
    .catch((error: unknown) => {
      ready = undefined;
      throw error;
    }));
}
