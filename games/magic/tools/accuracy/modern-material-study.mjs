import assert from 'node:assert/strict';

// Offline source-bound material injection; production defaults are untouched.
export function modernMaterialStudy() {
  return {
    name: 'm21-material-trial',
    enforce: 'pre',
    transform(source, id) {
      if (!id.endsWith('/presentation/early-hsb-material.ts')) return;
      const needle = '  const symbols = new Set([';
      assert.equal(source.split(needle).length, 2);
      const addition = [
        '  for (const [url, value] of Object.entries((globalThis as any).__m21MaterialTrial ?? {})) {',
        '    if (images.has(url)) adjustments.set(url, value as FrameHsb);',
        '  }',
        needle,
      ].join('\n');
      return { code: source.replace(needle, addition), map: null };
    },
  };
}
