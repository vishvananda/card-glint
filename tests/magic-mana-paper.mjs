import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
try {
  const { opaqueManaPaper } = await server.ssrLoadModule(
    '/games/magic/src/presentation/mana-glyph-paper.ts',
  );
  // The upper-center pixel may belong to the skull. Recover its paper from the
  // opaque source population, while excluding bright antialiased edge noise.
  const pixels = new Uint8ClampedArray(400 * 4);
  for (let i = 0; i < 400; i++) pixels.set(i < 240 ? [0, 0, 0, 255] : [146, 124, 118, 255], i * 4);
  pixels.set([255, 255, 255, 127], 399 * 4);
  assert.deepEqual(opaqueManaPaper(pixels), [146, 124, 118]);
  assert.equal(pixels[0], 0, 'Sampling must not repaint its source.');
  assert.throws(() => opaqueManaPaper(new Uint8ClampedArray()), /Invalid mana/);
  assert.throws(() => opaqueManaPaper(new Uint8ClampedArray(3)), /Invalid mana/);
  assert.throws(
    () => opaqueManaPaper(new Uint8ClampedArray([255, 255, 255, 128])),
    /no opaque paper/,
  );

  const { historicalManaAsset, historicalManaPaperSample } = await server.ssrLoadModule(
    '/games/magic/src/presentation/historical-mana.ts',
  );
  const face = {
    name: 'Preparation scope',
    setCode: 'drk',
    typeLine: 'Summon Goblins',
    colors: ['B', 'R'],
    frameStyle: 'retro',
    borderColor: 'black',
    symbolStyle: 'original',
  };
  for (const [symbol, amount] of [
    ['B', 0.2],
    ['R', 0.4],
  ]) {
    assert.equal(historicalManaAsset(face, symbol).inkExpansion, amount);
    assert.equal(historicalManaPaperSample(face, symbol), 'opaque-percentile');
    assert.equal(
      historicalManaPaperSample({ ...face, setCode: 'DRK' }, symbol),
      'opaque-percentile',
    );
    assert.equal(
      historicalManaPaperSample({ ...face, wordingMode: 'oracle' }, symbol),
      'opaque-percentile',
    );
    for (const override of [
      { frameStyle: 'modern' },
      { frameTemplate: 'future' },
      { layout: 'split' },
      { legendary: true },
      { borderColor: 'white' },
      { symbolStyle: 'modern' },
      { symbolStyle: undefined, wordingMode: 'oracle' },
    ]) {
      assert.equal(historicalManaPaperSample({ ...face, ...override }, symbol), undefined);
      assert.equal(historicalManaAsset({ ...face, ...override }, symbol)?.inkExpansion, undefined);
    }
  }
  for (const symbol of ['W', 'U', 'G', '2'])
    assert.equal(historicalManaPaperSample(face, symbol), undefined);
  assert.equal(historicalManaAsset({ ...face, setCode: 'leb' }, 'R').inkExpansion, 0.4);
  assert.equal(historicalManaPaperSample({ ...face, setCode: 'leb' }, 'R'), undefined);
  for (const setCode of ['arn', 'atq', 'leg', '3ed', '8ed', 'm21'])
    for (const symbol of ['B', 'R']) {
      assert.equal(historicalManaPaperSample({ ...face, setCode }, symbol), undefined);
      assert.equal(historicalManaAsset({ ...face, setCode }, symbol)?.inkExpansion, undefined);
    }
  console.log('Opaque mana paper sampling and printing/source scope passed.');
} finally {
  await server.close();
}
