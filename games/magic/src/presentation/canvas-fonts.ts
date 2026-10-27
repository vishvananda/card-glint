import fontCss from '../../fonts.css?raw';
import { revisedTypeFontAsset } from './revised-lettering.js';
import { retroFontAssets } from './retro-font.js';

export interface CanvasFontAsset {
  family: string;
  url: string;
  weight: string;
  style: string;
}

export const canvasFontAssets: readonly CanvasFontAsset[] = [
  ...[...fontCss.matchAll(/@font-face\s*\{([^}]+)\}/g)].map(([, block]) => ({
    family: /font-family:\s*'([^']+)'/.exec(block!)![1]!,
    url: /src:\s*url\('([^']+)'\)/.exec(block!)![1]!,
    weight: /font-weight:\s*([^;]+)/.exec(block!)?.[1]?.trim() ?? '400',
    style: /font-style:\s*([^;]+)/.exec(block!)?.[1]?.trim() ?? 'normal',
  })),
  ...retroFontAssets,
  revisedTypeFontAsset,
];
