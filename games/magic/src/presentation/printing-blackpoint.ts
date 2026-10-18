import { table } from '../data/registry.js';
const stockFamilies =
  table<Readonly<Record<string, typeof import('./printing-stock-values.json')>>>('printingStocks');
import type { RenderedCardInput } from './face-layout.js';
import type { FrameHsb } from './frame-hsb.js';

/** Each binding includes the pinned source and the complete pre-existing color
 * adjustment. A changed source or HSB fit must be measured again. */
export interface PrintingBlackPointProfile {
  set: string;
  stock: string | null;
  materials: readonly {
    url: string;
    adjustment: string;
    lift: readonly number[] | null;
    bakedStock?: boolean;
    stockMask?: string;
  }[];
}
export interface PrintingStockSource {
  url: string;
  geometry: string;
  mask?: string;
}
const stockRgb = (stock: string): readonly [number, number, number] => {
  const value = parseInt(stock.slice(1), 16);
  return [(value >> 16) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
};
const bindings =
  table<Readonly<Record<string, readonly PrintingBlackPointProfile[]>>>('printingBlackPoints');

/** Asset discovery may request a stock mask before the exact material is known.
 * Actual painting additionally verifies the measured material binding below. */
export function hasPrintingStockCandidate(face: RenderedCardInput): boolean {
  return (
    (face.colorCalibration === 'set-hsb-v1' || face.colorCalibration === 'early-hsb-v1') &&
    (!face.borderColor || face.borderColor === 'black') &&
    (bindings[face.setCode?.toLowerCase() ?? ''] ?? []).some(
      (p) => p.set === face.setCode?.toLowerCase() && p.stock !== null,
    )
  );
}

export function printingBlackPointMaterials(
  face: RenderedCardInput,
  materials: Readonly<Record<string, FrameHsb>>,
  stockSource?: PrintingStockSource,
): { materials: Readonly<Record<string, FrameHsb>>; stock?: string } {
  if (!['set-hsb-v1', 'early-hsb-v1'].includes(face.colorCalibration ?? '')) return { materials };
  const profiles = bindings[face.setCode?.toLowerCase() ?? ''] ?? [];
  if (!profiles.length) return { materials };
  let stock: string | undefined;
  const result = { ...materials };
  for (const [url, original] of Object.entries(materials)) {
    const serialized = JSON.stringify(original);
    for (const profile of profiles) {
      const entry = profile.materials.find((m) => m.url === url && m.adjustment === serialized);
      if (!entry) continue;
      if (profile.stock && hasPrintingStockCandidate(face)) stock = profile.stock;
      if (entry.bakedStock && stock) {
        const value = parseInt(stock.slice(1), 16);
        result[url] = {
          ...original,
          outerStockMaskSource: entry.stockMask,
          outerStock: [(value >> 16) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255],
        };
      }
      if (!entry.lift || original.blackPoint) continue;
      const [r, g, b] = entry.lift;
      if (entry.lift.length !== 3 || r === undefined || g === undefined || b === undefined)
        throw new Error('Invalid printing black-point binding');
      result[url] = {
        ...result[url]!,
        blackPoint: { lift: [r / 255, g / 255, b / 255], transition: 96 / 255 },
      };
    }
  }
  if (stockSource && hasPrintingStockCandidate(face)) {
    const family = (stockFamilies[face.setCode?.toLowerCase() ?? ''] ?? []).find(
      (p) =>
        p.set === face.setCode?.toLowerCase() &&
        stockSource.geometry === p.geometry &&
        stockSource.url.startsWith(p.prefix) &&
        (p.family === 'retro'
          ? /^[wubrgacml]{1,2}\.png$/.test(stockSource.url.slice(p.prefix.length))
          : /^(W|U|B|R|G|WU|WB|WR|WG|UB|UR|UG|BR|BG|RG|Artifact|Gold|Colourless)\.webp$/.test(
              stockSource.url.slice(p.prefix.length),
            )),
    );
    if (family) {
      stock = family.stock;
      if (stockSource.mask)
        result[stockSource.url] = {
          ...(result[stockSource.url] ?? { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 }),
          outerStock: stockRgb(stock),
          outerStockMaskSource: stockSource.mask,
        };
    }
  }
  return { materials: result, ...(stock ? { stock } : {}) };
}
