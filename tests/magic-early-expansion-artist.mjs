import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
try {
  const { paintEarlyExpansionArtist } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-expansion-artist.ts',
  );
  const untouched = new Proxy(
    {},
    {
      get() {
        throw Error('Out-of-scope artist touched canvas');
      },
    },
  );
  for (const setCode of [undefined, 'lea', 'leb', '2ed', '3ed', 'leg', '4ed', '8ed', 'm21'])
    assert.equal(paintEarlyExpansionArtist(untouched, { setCode, artist: 'Test Artist' }), false);
  for (const setCode of ['arn', 'atq', 'drk'])
    assert.equal(paintEarlyExpansionArtist(untouched, { setCode, artist: '' }), false);
  console.log('Early artist painting leaves out-of-scope and empty-credit canvases untouched.');
} finally {
  await server.close();
}
