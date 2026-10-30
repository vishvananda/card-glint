import { preFontGeometrySource } from '../games/magic/tools/accuracy/font-geometry-ancestry.mjs';
import { root } from '../games/magic/tools/accuracy/common.mjs';
import path from 'node:path';
import { createServer as createViteServer } from 'vite';
/** Private painter tests exercise the synchronous compatibility contract.
 * The separate lazy tests start fresh module graphs and verify preparation. */
export async function createServer(options) {
  const { fontGeometryHistory, ...viteOptions } = options;
  if (fontGeometryHistory) {
    viteOptions.plugins = [
      {
        name: 'explicit-pre-font-evidence-view',
        enforce: 'pre',
        async transform(code, id) {
          const file = path.relative(root, id.split('?')[0]);
          if (!file.startsWith('games/magic/')) return;
          const historical = await preFontGeometrySource(file, Buffer.from(code));
          return historical.toString() === code
            ? undefined
            : { code: historical.toString(), map: null };
        },
      },
      ...(viteOptions.plugins || []),
    ];
  }
  const server = await createViteServer(viteOptions);
  const load = server.ssrLoadModule.bind(server);
  let initialized;
  server.ssrLoadModule = async (...args) => {
    initialized ??= (async () => {
      await load('/games/magic/src/data/eager.ts');
      await load('/games/magic/src/data/eager-wording.ts');
    })();
    await initialized;
    return load(...args);
  };
  return server;
}

/** Exercise stale identity rejection at the compiled-data boundary. Runtime
 * payloads are immutable; corrupt a separate server before registration. */
export async function createCorruptedDataServer(tableName) {
  return createDataFixtureServer(
    `for(const profile of Object.values(data.tables[${JSON.stringify(tableName)}] ?? {})) profile.source = 'different source or geometry';`,
  );
}
export async function createDataFixtureServer(prepare) {
  return createServer({
    configFile: false,
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, hmr: false },
    plugins: [
      {
        name: 'invalid-calibration-identity-fixture',
        enforce: 'pre',
        transform(code, id) {
          if (!id.endsWith('/games/magic/src/data/eager.ts')) return;
          return code.replace(
            "import { registerSet } from './registry.js';",
            `
          import {registerSet as install} from './registry.js';
          function registerSet(data) {
            ${prepare}
            install(data);
          }
        `,
          );
        },
      },
    ],
  });
}
