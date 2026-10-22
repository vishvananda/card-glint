import assert from 'node:assert/strict';

// Offline source-bound material injection; production defaults are untouched.
export function modernMaterialStudy() {
  return {
    name: 'm21-material-trial',
    enforce: 'pre',
    transform(source, id) {
      if (id.endsWith('/presentation/special-rule-paint.ts')) {
        const needle = "  return colors[resolveCardProfile(face).boxes] ?? '#dededbf0';";
        assert.equal(source.split(needle).length, 2, 'Review the walker paper study hook');
        const code = source
          .replace(
            "import { componentAsset } from './assets.js';",
            "import { componentAsset, profileAssets } from './assets.js';\nimport { adjustHsb } from './hsb.js';",
          )
          .replace(
            needle,
            [
              "  const base = colors[resolveCardProfile(face).boxes] ?? '#dededbf0';",
              '  const key = profileAssets(resolveCardProfile(face), faceFrame(face)).background;',
              '  const delta = (globalThis as any).__m21MaterialTrial?.[key];',
              '  if (!delta) return base;',
              '  const rgb = [1,3,5].map(i => parseInt(base.slice(i,i+2),16)/255) as [number,number,number];',
              "  const adjusted = adjustHsb(rgb, delta).map(v => Math.round(v*255).toString(16).padStart(2,'0')).join('');",
              "  return '#' + adjusted + base.slice(7);",
            ].join('\n'),
          );
        assert(code.includes("import { adjustHsb } from './hsb.js';"));
        return { code, map: null };
      }
      if (id.endsWith('/presentation/planeswalker-material.ts')) {
        const needle =
          "  const adjustment = face.calibration === 'source' ? IDENTITY_HSB : WALKER_BACKGROUND_HSB[palette];";
        assert.equal(source.split(needle).length, 2, 'Review the walker material study hook');
        return {
          code: source.replace(
            needle,
            '  const adjustment = (globalThis as any).__m21MaterialTrial?.[sources.source] ?? ' +
              "(face.calibration === 'source' ? IDENTITY_HSB : WALKER_BACKGROUND_HSB[palette]);",
          ),
          map: null,
        };
      }
      if (!id.endsWith('/presentation/early-hsb-material.ts')) return;
      const needle = '  const symbols = new Set([';
      assert.equal(source.split(needle).length, 2);
      const addition = [
        '  for (const [url, value] of Object.entries((globalThis as any).__m21MaterialTrial ?? {})) {',
        // Walker backgrounds and procedural paper are corrected by their dedicated preparers.
        "    if (images.has(url) && !url.includes('/img/frames/planeswalker/') && !/\\/planeswalker_(?:large_)?bg\\//.test(url)) adjustments.set(url, value as FrameHsb);",
        '  }',
        needle,
      ].join('\n');
      return { code: source.replace(needle, addition), map: null };
    },
  };
}
