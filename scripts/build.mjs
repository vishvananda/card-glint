import { build } from 'vite';
import { execFileSync } from 'node:child_process';
import { cp, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
process.chdir(fileURLToPath(new URL('../', import.meta.url)));
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
        'magic-offline-assets': 'games/magic/src/offline-assets.ts',
        kernels: 'packages/browser/src/kernels.ts',
        finish: 'packages/browser/src/finish.ts',
      },
      formats: ['es'],
      fileName: (_, name) => `${name}.js`,
    },
    cssCodeSplit: true,
    assetsInlineLimit: 0,
    rollupOptions: {
      external: (id) => id.endsWith('_bg.wasm?url'),
      output: {
        paths: (id) => (id.endsWith('_bg.wasm?url') ? `./${path.basename(id)}` : id),
      },
    },
  },
});
await mkdir('dist/lib', { recursive: true });
await cp('packages/browser/generated/renderer_bg.wasm', 'dist/lib/renderer_bg.wasm');
await cp('packages/browser/generated/pixels_bg.wasm', 'dist/lib/pixels_bg.wasm');
await cp('games/magic/fonts.css', 'dist/lib/magic.css');
execFileSync(
  process.execPath,
  [
    'node_modules/typescript/bin/tsc',
    '--project',
    'tsconfig.build.json',
    '--maxNodeModuleJsDepth',
    '1',
  ],
  { stdio: 'inherit' },
);
if (!process.argv.includes('--package-only')) {
  await build({
    configFile: false,
    root: 'examples/lab',
    base: '/card-glint/',
    resolve: { alias },
    build: { target: 'es2022', outDir: '../../dist/lab', emptyOutDir: true },
  });
  for (const name of ['renderer', 'pixels'])
    await cp(`packages/browser/generated/${name}_bg.wasm`, `dist/lab/assets/${name}_bg.wasm`);
}
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
if (!process.argv.includes('--package-only')) {
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
}
