import assert from 'node:assert/strict';

// Offline M21 land experiment. Production selectors and painters are unchanged.
export function modernLandLayerStudy() {
  return {
    name: 'm21-land-layer-study',
    enforce: 'pre',
    transform(source, id) {
      if (id.endsWith('/presentation/modern-printing-profile.ts')) {
        const needle = 'export function modernOrdinaryPlates(face: RenderedCardInput) {';
        assert.equal(source.split(needle).length, 2);
        return {
          code: source.replace(
            needle,
            needle +
              [
                '',
                "  if ((globalThis as any).__m21LandLayers && face.setCode?.toLowerCase() === 'm21' &&",
                "      (face.canonicalTypeLine ?? face.typeLine ?? '').includes('Land')) return {};",
              ].join('\n'),
          ),
          map: null,
        };
      }
      if (id.endsWith('/presentation/modern-land-layers.ts')) {
        const needle =
          'export function modernLandLayers(input: RenderedCardInput): readonly LandLayer[] {';
        assert.equal(source.split(needle).length, 2);
        return {
          code: source.replace(
            needle,
            needle +
              '\n  return []; // Production overlays are excluded from this historical layer experiment.',
          ),
          map: null,
        };
      }
      if (!id.endsWith('/presentation/frame-plate-paint.ts')) return;
      const needle = '  paintMountedSecurityStamp(c, face, images);';
      assert.equal(source.split(needle).length, 2);
      const addition = [
        '  const landTexture = (globalThis as any).__m21LandTexture;',
        "  if (landTexture && layer !== 'etching') {",
        '    const overlay = rasterCanvas();',
        '    overlay.width = 732; overlay.height = 1020;',
        '    try {',
        "      const m = overlay.getContext('2d');",
        "      if (!m) throw Error('Land texture composition needs Canvas2D');",
        '      m.drawImage(required(landTexture.mask),0,0,732,1020);',
        "      (globalThis as any).__m21LandTextureMask = (overlay as any).toDataURL().split(',')[1];",
        "      m.globalCompositeOperation = 'source-in';",
        '      m.drawImage(required(landTexture.source),0,0,732,1020);',
        '      const pixels = m.getImageData(0,0,732,1020);',
        '      colorFrame(pixels, landTexture.adjustment);',
        '      m.putImageData(pixels,0,0);',
        '      c.drawImage(overlay,0,0,W,H);',
        '    } finally { overlay.width = overlay.height = 0; }',
        '  }',
        '  const headers = (globalThis as any).__m21LandHeaders;',
        "  if (headers && plate.rightFrame && layer !== 'etching') {",
        '    const overlay = rasterCanvas();',
        '    overlay.width = 732; overlay.height = 1020;',
        '    try {',
        "      const m = overlay.getContext('2d');",
        "      if (!m) throw Error('Land header composition needs Canvas2D');",
        '      m.drawImage(required(headers.title),0,0,732,1020);',
        '      m.drawImage(required(headers.type),0,0,732,1020);',
        "      (globalThis as any).__m21LandHeaderMask = (overlay as any).toDataURL().split(',')[1];",
        "      m.globalCompositeOperation = 'source-in';",
        '      m.drawImage(required(headers.source),0,0,732,1020);',
        '      c.drawImage(overlay,0,0,W,H);',
        '    } finally { overlay.width = overlay.height = 0; }',
        '  }',
        needle,
      ].join('\n');
      return {
        code: "import { colorFrame } from './frame-hsb.js';\n" + source.replace(needle, addition),
        map: null,
      };
    },
  };
}
