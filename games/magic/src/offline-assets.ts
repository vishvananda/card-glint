export { setAssetFetcher } from '../../../packages/browser/src/asset-fetch.js';
import { canvasAssetUrls } from './presentation/canvas-assets.js';
import { PLAIN_SECURITY_STAMP } from './presentation/security-stamp-assets.js';
import type { RenderedCardInput } from './presentation/face-layout.js';
export { decodeCanvasImage } from './presentation/canvas-assets.js';
export function magicAssetUrls(face: RenderedCardInput): string[] {
  const common = (value: RenderedCardInput): RenderedCardInput => ({
    ...value,
    rarity: 'common',
    faces: value.faces?.map(common),
  });
  return [
    ...new Set(
      [...canvasAssetUrls(face), ...canvasAssetUrls(common(face)), PLAIN_SECURITY_STAMP].filter(
        (url): url is string => Boolean(url),
      ),
    ),
  ];
}
export { canvasAssetUrls };
export const MAGIC_FONT_ASSETS = [
  {
    family: 'CardRenderer MTG Beleren',
    url: 'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/fonts/beleren-bold_P1.01.ttf',
    weight: '400 700',
    style: 'normal',
  },
  {
    family: 'CardRenderer MTG MPlantin',
    url: 'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/fonts/mplantin.woff',
    weight: '400',
    style: 'normal',
  },
  {
    family: 'CardRenderer MTG MPlantin',
    url: 'https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/fonts/mplantin-i.ttf',
    weight: '400',
    style: 'italic',
  },
  {
    family: 'CardRenderer MTG Relay',
    url: 'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/fonts/relay-medium.ttf',
    weight: '400',
    style: 'normal',
  },
  {
    family: 'CardRenderer MTG Artist Credit',
    url: 'https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/fonts/NDPMTG.ttf',
    weight: '400',
    style: 'normal',
  },
  {
    family: 'CardRenderer MTG Matrix',
    url: 'https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/fonts/matrix-b.ttf',
    weight: '700',
    style: 'normal',
  },
  {
    family: 'CardRenderer MTG Matrix Small Caps',
    url: 'https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/data/fonts/matrix-bsc.ttf',
    weight: '700',
    style: 'normal',
  },
  {
    family: 'CardRenderer MTG ModMatrix',
    url: 'https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/Magic%20-%20Fonts/ModMatrix.ttf',
    weight: '700',
    style: 'normal',
  },
  {
    family: 'CardRenderer MTG Chapter',
    url: 'https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/fonts/plantin-semibold.otf',
    weight: '550',
    style: 'normal',
  },
  {
    family: 'CardRenderer MTG Matrix',
    url: 'https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/fonts/matrix.ttf',
    weight: '400',
    style: 'normal',
  },
  {
    family: 'CardRenderer MTG Beleren Small Caps',
    url: 'https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/data/fonts/beleren-bsc.ttf',
    weight: '700',
    style: 'normal',
  },
  {
    family: 'CardRenderer MTG Goudy',
    url: 'https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/fonts/goudy-medieval.ttf',
    weight: '400',
    style: 'normal',
  },
  {
    family: 'CardRenderer MTG Historic Symbols',
    url: 'https://cdn.jsdelivr.net/gh/andrewgioia/mana@6ca9e696d3bda2519dcf3eebd96598f84ad9ddd8/fonts/mana.woff2',
    weight: '400',
    style: 'normal',
  },
] as const;
