// Offline native comparison hooks. A missing legacy policy must stay null.
import assert from 'node:assert/strict';
import { hash } from './common.mjs';
export function threeDonorPlugins(transformed = {}) {
  return [
    {
      name: 'three-donor-native-profile-trial',
      enforce: 'pre',
      transform(code, id) {
        if (id.endsWith('/games/magic/src/calibration/selection.ts')) {
          const needle = 'export function calibrationForFace(face: RenderedCardInput) {';
          assert.equal(code.split(needle).length, 2);
          const after = code.replace(
            needle,
            needle +
              '\n  if ((globalThis as any).__threeDonor?.profile?.set === face.setCode) return (globalThis as any).__threeDonor.profile;',
          );
          transformed.selection = { before: hash(code), after: hash(after) };
          return after;
        }
        if (id.endsWith('/games/magic/src/presentation/retro-details.ts')) {
          const needle = 'export function retroPrintDetails(face: RenderedCardInput) {';
          assert.equal(code.split(needle).length, 2);
          const after =
            code.replace(needle, 'function originalDonorStudyDetails(face: RenderedCardInput) {') +
            '\nexport function retroPrintDetails(face: RenderedCardInput) {\n' +
            ' const actual=originalDonorStudyDetails(face);\n' +
            ' const trial=(globalThis as any).__threeDonor;\n' +
            ' if (!trial || trial.skipDetails) return actual;\n' +
            ' const donor=originalDonorStudyDetails({...face,setCode:trial.donor,typeLine:"Enchantment"});\n' +
            ' if (!donor) return null;\n' +
            ' return {...donor,setRight:actual?.setRight,setCenterY:actual?.setCenterY,setHeight:actual?.setHeight,setOutline:actual?.setOutline,legalText:face.legalText??actual?.legalText??null};\n}\n';
          transformed.details = { before: hash(code), after: hash(after) };
          return after;
        }
      },
    },
  ];
}
