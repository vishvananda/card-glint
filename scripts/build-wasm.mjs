import { execFileSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
for (const [crate, name] of [
  ['renderer-wasm', 'renderer'],
  ['pixel-kernels', 'pixels'],
]) {
  execFileSync(
    'cargo',
    ['build', '--locked', '--release', '--target', 'wasm32-unknown-unknown', '-p', crate],
    { stdio: 'inherit' },
  );
  execFileSync(
    'wasm-bindgen',
    [
      `target/wasm32-unknown-unknown/release/${crate.replaceAll('-', '_')}.wasm`,
      '--target',
      'web',
      '--out-dir',
      'packages/browser/generated',
      '--out-name',
      name,
    ],
    { stdio: 'inherit' },
  );
  // Keep each module separately cacheable in library and demo builds.
  const file = `packages/browser/generated/${name}.js`;
  const source = await readFile(file, 'utf8');
  await writeFile(
    file,
    `const wasmPath = '${name}_bg.wasm';\n` +
      source.replace(
        `new URL('${name}_bg.wasm', import.meta.url)`,
        'new URL(/* @vite-ignore */ wasmPath, import.meta.url)',
      ),
  );
}
