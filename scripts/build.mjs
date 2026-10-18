import { build } from 'vite';
import { execFileSync } from 'node:child_process';
import { cp, mkdir } from 'node:fs/promises';
import path from 'node:path';
execFileSync(process.execPath, ['games/magic/tools/build-set-data.mjs'], { stdio: 'inherit' });
const alias = { '@card-glint/browser': path.resolve('packages/browser/src/index.ts') };
await build({
  configFile: false,
  resolve: { alias },
  build: {
    target: 'es2022',
    outDir: 'dist/lib',
    emptyOutDir: true,
    lib: {
      entry: {
        browser: 'packages/browser/src/index.ts',
        showcase: 'games/showcase/src/index.ts',
        magic: 'games/magic/src/index.ts',
        'magic-presentation': 'games/magic/src/presentation.ts',
        'magic-lazy': 'games/magic/src/lazy.ts',
        'magic-printing': 'games/magic/src/printing/lazy.ts',
        'magic-calibration': 'games/magic/src/calibration-api.ts',
        kernels: 'packages/browser/src/kernels.ts',
        finish: 'packages/browser/src/finish.ts',
        canvas: 'packages/browser/src/canvas.ts',
      },
      formats: ['es'],
      fileName: (_, name) => `${name}.js`,
    },
    cssCodeSplit: true,
    assetsInlineLimit: 0,
  },
});
await mkdir('dist/lib', { recursive: true });
await cp('packages/browser/generated/renderer_bg.wasm', 'dist/lib/renderer_bg.wasm');
await cp('packages/browser/generated/pixels_bg.wasm', 'dist/lib/pixels_bg.wasm');
await cp('games/magic/fonts.css', 'dist/lib/magic.css');
execFileSync('npx', ['tsc', '--project', 'tsconfig.build.json'], { stdio: 'inherit' });
await build({
  configFile: false,
  root: 'examples/lab',
  base: '/card-glint/',
  resolve: { alias },
  build: { target: 'es2022', outDir: '../../dist/lab', emptyOutDir: true },
});

await cp('packages/browser/generated/renderer_bg.wasm', 'dist/lab/assets/renderer_bg.wasm');

await mkdir('dist/types/packages/browser/generated', { recursive: true });
await cp(
  'packages/browser/generated/renderer.d.ts',
  'dist/types/packages/browser/generated/renderer.d.ts',
);

await cp(
  'packages/browser/generated/pixels.d.ts',
  'dist/types/packages/browser/generated/pixels.d.ts',
);

await cp('games/showcase/assets.json', 'dist/types/games/showcase/assets.json');
await cp('games/magic/assets.json', 'dist/types/games/magic/assets.json');
await cp('games/showcase/art', 'dist/lab/art', { recursive: true });
await cp('examples/cdn', 'dist/lab/cdn', { recursive: true });
await mkdir('dist/lab/media', { recursive: true });
for (const group of ['foils', 'living'])
  for (const extension of ['gif', 'mp4'])
    await cp(
      `docs/images/showcase-${group}.${extension}`,
      `dist/lab/media/showcase-${group}.${extension}`,
    );
// Keep existing links from prior releases working.
await cp('docs/images/showcase-foils.mp4', 'dist/lab/media/showcase.mp4');

// Optional Magic pack prototype; separate from the original-asset-only showcase.
await cp('dist/lib', 'dist/lab/presets', { recursive: true });
await cp('games/showcase/art', 'dist/lab/presets/art', { recursive: true });
for (const file of ['printing-presets.html', 'printing-presets-example.js'])
  await cp('examples/standalone/' + file, 'dist/lab/presets/' + file);
