/** Demand-loaded presentation for collection and table hosts. Await preparation
 * before synchronous geometry, asset discovery or cache-key calls. */
export * from './presentation-api.js';
export { loadMagicSet, prepareMagicCards, loadedMagicSets } from './data/load.js';
export { resolveSetPrintingWording, resolveSetPrintingArtist } from './printing/lazy.js';
import { prepareMagicCards } from './data/load.js';
import { composeCardTexture as compose } from './presentation/canvas-face.js';
/** The high-level compositor prepares all physical faces and any explicit donor
 * defaults automatically; subsequent calls reuse already loaded set data. */
export async function composeCardTexture(...args: Parameters<typeof compose>) {
  args[2].throwIfAborted();
  await prepareMagicCards([args[0].face]);
  args[2].throwIfAborted();
  return compose(...args);
}
