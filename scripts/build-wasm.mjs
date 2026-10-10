import { execFileSync } from 'node:child_process';
execFileSync(
  'cargo',
  ['build', '--locked', '--release', '--target', 'wasm32-unknown-unknown', '-p', 'renderer-wasm'],
  { stdio: 'inherit' },
);
execFileSync(
  'wasm-bindgen',
  [
    'target/wasm32-unknown-unknown/release/renderer_wasm.wasm',
    '--target',
    'web',
    '--out-dir',
    'packages/browser/generated',
    '--out-name',
    'renderer',
  ],
  { stdio: 'inherit' },
);

// Keep the module separately cacheable in library and demo builds.
const fs = await import('node:fs/promises');
const file = 'packages/browser/generated/renderer.js';
const text = await fs.readFile(file, 'utf8');
await fs.writeFile(
  file,
  "const wasmPath = 'renderer_bg.wasm';\n" +
    text.replace(
      "new URL('renderer_bg.wasm', import.meta.url)",
      'new URL(/* @vite-ignore */ wasmPath, import.meta.url)',
    ),
);
