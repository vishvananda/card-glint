import { fetchCardAsset } from '../fetch.js';
import { RETRO_FONT } from './retro-frame.js';
let ready: Promise<void> | undefined;
export function loadRetroFont(): Promise<void> {
  if (typeof FontFace !== 'function') return Promise.resolve();
  return (ready ??= fetchCardAsset(RETRO_FONT)
    .then(async (response) => {
      if (!response.ok) throw Error('Retro font unavailable');
      const font = await new FontFace(
        'CardRenderer MTG Goudy',
        await response.arrayBuffer(),
      ).load();
      document.fonts.add(font);
    })
    .catch(() => {
      ready = undefined;
    }));
}
