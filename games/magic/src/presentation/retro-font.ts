import { fetchCardAsset } from '../fetch.js';
import { RETRO_FONT, RETRO_SYMBOL_FONT } from './retro-frame.js';
let ready: Promise<void> | undefined;
const fonts = [
  ['CardRenderer MTG Goudy', RETRO_FONT],
  ['CardRenderer MTG Historic Symbols', RETRO_SYMBOL_FONT],
] as const;
export function loadRetroFont(): Promise<void> {
  if (typeof FontFace !== 'function') return Promise.resolve();
  return (ready ??= Promise.all(
    fonts.map(async ([family, url]) => {
      if (
        [...document.fonts].some(
          (f) => f.family.replace(/^"|"$/g, '') === family && f.status === 'loaded',
        )
      )
        return;
      const response = await fetchCardAsset(url);
      if (!response.ok) throw Error(`Retro font unavailable: ${family}`);
      document.fonts.add(await new FontFace(family, await response.arrayBuffer()).load());
    }),
  )
    .then(() => undefined)
    .catch((error: unknown) => {
      ready = undefined;
      throw error;
    }));
}
