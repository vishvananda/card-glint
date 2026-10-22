import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { modernMaterialStudy } from './modern-material-study.mjs';

test('walker paper study keeps defaults and separates solid paper from source texture', async () => {
  const file = '/games/magic/src/presentation/special-rule-paint.ts';
  const server = await createServer({
    configFile: false,
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, hmr: false, ws: false },
    plugins: [modernMaterialStudy()],
  });
  try {
    const { specialPaperColor } = await server.ssrLoadModule(file);
    const { profileAssets } = await server.ssrLoadModule('/games/magic/src/presentation/assets.ts');
    const { resolveCardProfile } = await server.ssrLoadModule(
      '/games/magic/src/presentation/profile.ts',
    );
    const face = {
      name: 'Paper',
      setCode: 'm21',
      layout: 'planeswalker',
      typeLine: 'Planeswalker',
      colors: ['U'],
      rulesText: '+1: Example.',
    };
    const assets = profileAssets(resolveCardProfile(face), 'planeswalker');
    const base = specialPaperColor(face);
    assert.equal(base, '#d3e4ecf0');
    globalThis.__m21MaterialTrial = {
      unrelated: { hueDegrees: 0, saturationScale: 1, brightnessScale: 0.9 },
    };
    assert.equal(specialPaperColor(face), base);
    globalThis.__m21MaterialTrial = {
      [assets.background]: {
        hueDegrees: 0,
        saturationScale: 1,
        brightnessScale: 1,
        rgbScale: [1, 1, 0.95],
      },
    };
    assert.equal(specialPaperColor(face), '#d3e4e0f0');
    const other = { ...face, colors: ['W'] };
    assert.equal(specialPaperColor(other), '#eee9d9f0');
    const tall = { ...face, rulesText: 'Static.\n+1: A.\n-2: B.\n-7: C.' };
    assert.equal(specialPaperColor(tall), base);
    const source = await readFile('.' + file, 'utf8');
    assert.throws(
      () =>
        modernMaterialStudy().transform(source.replace('return colors[', 'return absent['), file),
      /walker paper study hook/,
    );
  } finally {
    delete globalThis.__m21MaterialTrial;
    await server.close();
  }
});
