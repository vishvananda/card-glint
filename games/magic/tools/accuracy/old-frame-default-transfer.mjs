// A pure development transfer. Printing facts remain owned by the target.
import assert from 'node:assert/strict';
export function transferOldFrameDefault(donor, target, stock) {
  assert(['4ed', 'mir', 'ons'].includes(donor.set));
  assert(['black', 'white'].includes(target.borderColor));
  assert(/^#[a-f\d]{6}$/i.test(stock));
  const profile = structuredClone(donor);
  profile.set = target.setCode;
  profile.border = target.borderColor;
  delete profile.setSymbols;
  delete profile.setSymbolSource;
  delete profile.landMaterials;
  delete profile.dualLand;
  if (profile.footer?.legal) {
    delete profile.footer.legal.defaultText;
    delete profile.footer.legal.collectorTotal;
  }
  for (const color of Object.values(profile.colors))
    if (color) {
      color.stock = stock;
      if (target.borderColor === 'black' && color.adjustment.outerStock) {
        const n = parseInt(stock.slice(1), 16);
        color.adjustment.outerStock = [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
      }
    }
  return profile;
}
