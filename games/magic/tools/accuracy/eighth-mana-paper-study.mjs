import assert from 'node:assert/strict';
import { hash } from './common.mjs';
/** Isolated color proposal. Geometry remains public, explicit symbolAdjustment input. */
export function eighthManaPaperStudy(targets, sources) {
  for (const [s, rgb] of Object.entries(targets)) {
    assert(/^[WUBRGNX]$/.test(s));
    assert(
      Array.isArray(rgb) &&
        rgb.length === 3 &&
        rgb.every((v) => Number.isFinite(v) && v >= 0 && v <= 255),
    );
  }
  return {
    name: 'eighth-mana-paper-study',
    enforce: 'pre',
    transform(source, id) {
      if (id.endsWith('/presentation/calibration-profiles.ts')) {
        assert.equal(hash(source), sources.calibration);
        const marker =
          'export function calibratedManaTarget(face: RenderedCardInput, symbol: string): Rgb | undefined {';
        assert.equal(source.split(marker).length, 2);
        const injected = `\n  if (face.setCode?.toLowerCase()==='8ed' && face.frameAssetFamily==='eighth' && face.colorCalibration==='set-hsb-v1' && face.calibration!=='source') {
    const target=(${JSON.stringify(targets)} as Record<string,number[]>)[symbol];
    if(target)return [target[0]!/255,target[1]!/255,target[2]!/255];
  }`;
        return { code: source.replace(marker, marker + injected), map: null };
      }
      if (id.endsWith('/presentation/early-hsb-material.ts')) {
        assert.equal(hash(source), sources.material);
        const marker = "(symbol === 'X' && earlyReprintMana(face))";
        assert.equal(source.split(marker).length, 2);
        return {
          code: source.replace(
            marker,
            "(symbol === 'X' && (earlyReprintMana(face) || face.setCode?.toLowerCase()==='8ed'))",
          ),
          map: null,
        };
      }
    },
  };
}
