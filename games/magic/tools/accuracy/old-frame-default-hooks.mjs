// Experimental hooks only. Default calls retain the production painter exactly.
import assert from 'node:assert/strict';
const patch = (code, from, to) => {
  assert.equal(code.split(from).length, 2, from);
  return code.replace(from, to);
};
export const oldFrameDefaultModes = ['current', 'fourth-layout', 'fourth-frame-layout'];
export function oldFrameDefaultPlugins() {
  return [
    {
      name: 'old-frame-default-donor-study',
      enforce: 'pre',
      transform(code, id) {
        const file = id.split('?')[0];
        if (file.endsWith('/calibration/selection.ts'))
          return patch(
            code,
            'export function calibrationForFace(face: RenderedCardInput) {',
            'export function calibrationForFace(face: RenderedCardInput) {\n  if ((globalThis as any).__oldFrameDonor?.profile) return (globalThis as any).__oldFrameDonor.profile;',
          );
        if (file.endsWith('/presentation/early-reprint-frame.ts'))
          return patch(
            code,
            'export function earlyReprintFrame(face: RenderedCardInput) {',
            'export function earlyReprintFrame(face: RenderedCardInput) {\n  if ((globalThis as any).__oldFrameDonor?.frame) return (globalThis as any).__oldFrameDonor.frame;',
          );
        if (file.endsWith('/presentation/early-reprint-colors.ts'))
          return patch(
            code,
            'export function earlyReprintColors(face: RenderedCardInput) {',
            'export function earlyReprintColors(face: RenderedCardInput) {\n  if ((globalThis as any).__oldFrameDonor?.mode === "fourth-layout") return undefined;',
          );
        if (file.endsWith('/presentation/early-reprint-mana.ts')) {
          for (const signature of [
            'export function earlyReprintManaTarget(face: RenderedCardInput, symbol: string) {',
            'export function earlyReprintManaInk(face: RenderedCardInput) {',
          ])
            code = patch(
              code,
              signature,
              signature + '\n  if ((globalThis as any).__oldFrameDonor) return undefined;',
            );
          return code;
        }
        if (file.endsWith('/presentation/retro-details.ts')) {
          code = patch(
            code,
            'export function retroPrintDetails(face: RenderedCardInput) {',
            'function productionRetroPrintDetails(face: RenderedCardInput) {',
          );
          return (
            code +
            `
export function retroPrintDetails(face: RenderedCardInput) {
 const actual=productionRetroPrintDetails(face);
 if (!(globalThis as any).__oldFrameDonor) return actual;
 const donor=productionRetroPrintDetails({...face,setCode:'4ed',typeLine:'Enchantment'});
 return {...donor,
   setRight:actual?.setRight, setCenterY:actual?.setCenterY,
   setHeight:actual?.setHeight,setOutline:actual?.setOutline,
   legalText:face.legalText??actual?.legalText??null};
}
`
          );
        }
      },
    },
  ];
}
