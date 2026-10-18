import { createServer as createViteServer } from 'vite';
/** Private painter tests exercise the synchronous compatibility contract.
 * The separate lazy tests start fresh module graphs and verify preparation. */
export async function createServer(options) {
  const server = await createViteServer(options);
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
