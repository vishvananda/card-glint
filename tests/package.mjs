import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import os from 'node:os';
import { build } from 'vite';
const root = process.cwd(),
  temporary = await mkdtemp(path.join(os.tmpdir(), 'card-glint-consumer-'));
try {
  const packed = JSON.parse(
    execFileSync('npm', ['pack', '--json', '--pack-destination', temporary], { encoding: 'utf8' }),
  )[0];
  await writeFile(
    path.join(temporary, 'package.json'),
    JSON.stringify({ name: 'consumer', private: true, type: 'module' }),
  );
  execFileSync(
    'npm',
    [
      'install',
      '--ignore-scripts',
      '--no-audit',
      '--no-fund',
      path.join(temporary, packed.filename),
    ],
    { cwd: temporary, stdio: 'pipe' },
  );
  await writeFile(
    path.join(temporary, 'index.ts'),
    `
import { createRenderer, IDENTITY, type CardDocument } from 'card-glint';
import { showcase } from 'card-glint/showcase';
import wasmUrl from 'card-glint/renderer.wasm?url';
export async function example(canvas: HTMLCanvasElement) {
  const renderer = await createRenderer({ canvas, wasmUrl });
  const cards: CardDocument[] = [{id:1,revision:1,recipe:showcase.describe({name:'Compass',subtitle:'Instrument',theme:'orbit',charge:3,serial:'001',illustration:'/art/orbit.svg',rules:'Find a path.'},'table')}];
  renderer.upsertCards(cards);
  await renderer.ready(1, 1);
  renderer.render({ viewProjection: IDENTITY });
  renderer.dispose();
}
`,
  );
  await writeFile(
    path.join(temporary, 'assets.d.ts'),
    `declare module '*.wasm?url' { const url: string; export default url; }\n`,
  );
  execFileSync(
    process.execPath,
    [
      path.join(root, 'node_modules/typescript/bin/tsc'),
      '--noEmit',
      '--strict',
      '--target',
      'ES2022',
      '--module',
      'NodeNext',
      '--moduleResolution',
      'NodeNext',
      'index.ts',
      'assets.d.ts',
    ],
    { cwd: temporary, stdio: 'inherit' },
  );
  await build({
    configFile: false,
    root: temporary,
    build: {
      target: 'es2022',
      assetsInlineLimit: 0,
      rollupOptions: { input: path.join(temporary, 'index.ts'), preserveEntrySignatures: 'strict' },
    },
  });
  const manifest = JSON.parse(await readFile('package.json', 'utf8'));
  console.log(
    `${manifest.name}: tarball ${packed.size} bytes; independent TypeScript and Vite consumer passed.`,
  );
} finally {
  await rm(temporary, { recursive: true, force: true });
}
