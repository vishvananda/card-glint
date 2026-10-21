import assert from 'node:assert/strict';
import { modernFooterStudyPlugin } from './modern-footer-study-plugin.mjs';

/** Offline full-face experiment only. Production files and host inputs stay unchanged. */
export function modernPrototypePlugin() {
  const footer = modernFooterStudyPlugin();
  return {
    name: 'modern-calibration-prototype',
    enforce: 'pre',
    async transform(source, id) {
      if (id.endsWith('/presentation/modern-footer.ts')) {
        const changed = await footer.plugin.transform(source, id);
        const needle = '  const study = (globalThis as any).__m21FooterCandidate ?? {};\n';
        assert.equal(changed.code.split(needle).length, 2);
        return {
          code: changed.code.replace(
            needle,
            needle +
              `  face = {...face, printingElements: Object.fromEntries(['collector','artist','legal'].map(key => {
  const previous = face.printingElements?.[key as 'artist'], delta = study[key+'Offset'] ?? [0,0];
  return [key,{...previous,offset:[(previous?.offset?.[0] ?? 0)+delta[0],(previous?.offset?.[1] ?? 0)+delta[1]]}];
}))};\n`,
          ),
          map: null,
        };
      }
      if (!id.endsWith('/presentation/plate-basic-land.ts')) return;
      const needle = '  c.drawImage(glyph, 166, 440, 156, 156);';
      assert.equal(source.split(needle).length, 2, 'Review the large-symbol prototype adapter');
      return {
        code: source.replace(
          needle,
          `  const adjustment = (globalThis as any).__m21LargeLandStudy?.[basicLandColor(face) ?? ''];
  const geometry = adjustment?.geometry;
  c.drawImage(glyph,
    geometry ? 244 + (166-244)*geometry.scaleX + geometry.dx : 166,
    geometry ? 518 + (440-518)*geometry.scaleY + geometry.dy : 440,
    geometry ? 156*geometry.scaleX : 156,
    geometry ? 156*geometry.scaleY : 156);`,
        ),
        map: null,
      };
    },
  };
}
