import { build } from 'vite';
import { execFileSync } from 'node:child_process';
import { cp, mkdir } from 'node:fs/promises';
import path from 'node:path';
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
        kernels: 'packages/browser/src/kernels.ts',
        finish: 'packages/browser/src/finish.ts',
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
await cp('docs/images/showcase.mp4', 'dist/lab/media/showcase.mp4');
