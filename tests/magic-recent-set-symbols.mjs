import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createServer } from './magic-vite.mjs';
const baseline = 'efaa4a952840000e8d66f0522ebed2e6bbb2c11e';
const fixture = JSON.parse(await readFile('games/magic/fixtures/assets/recent-set-symbols.json'));
const inventory = JSON.parse(await readFile('games/magic/set-symbol-inventory.json'));
const files = ['set-symbols.ts', 'styled-set-symbols.ts'].map(
  (f) => 'games/magic/src/presentation/' + f,
);
const before = new Map(
  files.map((file) => [
    file,
    execFileSync('git', ['show', baseline + ':' + file], { encoding: 'utf8' }),
  ]),
);
const options = {
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false, ws: false },
};
const current = await createServer(options);
const parent = await createServer({
  ...options,
  plugins: [
    {
      name: 'previous-set-symbols',
      enforce: 'pre',
      transform(_code, id) {
        for (const [file, code] of before) if (id.endsWith('/' + file)) return { code, map: null };
      },
    },
  ],
});
try {
  const load = (s, file) => s.ssrLoadModule('/games/magic/src/presentation/' + file + '.ts');
  const now = await load(current, 'set-symbols'),
    old = await load(parent, 'set-symbols');
  const ink = await load(current, 'set-symbol-ink'),
    oldInk = await load(parent, 'set-symbol-ink');
  const assets = await load(current, 'assets');
  let controls = 0,
    additions = 0;
  const rarities = ['common', 'uncommon', 'rare', 'mythic', 'special', 'bonus'];
  const sources = [undefined, 'auto', 'keyrune', 'cardconjurer'];
  const codes = new Set([
    ...Object.keys(inventory.codes),
    'glint',
    'forge',
    'con',
    'p02',
    '',
    '__proto__',
  ]);
  const glyphs = before
    .get(files[0])
    .match(/const KEYRUNE_CODES = new Set\(\s*`([\s\S]*?)`/)[1]
    .trim()
    .split(/\s+/);
  for (const c of glyphs) codes.add(c);
  for (const code of codes)
    for (const rarity of rarities)
      for (const source of sources) {
        assert.equal(
          now.setSymbolVector(code, rarity, source),
          old.setSymbolVector(code, rarity, source),
          code,
        );
        assert.equal(
          ink.setSymbolFilter(code, rarity, source),
          oldInk.setSymbolFilter(code, rarity, source),
          code,
        );
        controls++;
      }
  for (const [code, entry] of Object.entries(fixture.aliases)) {
    assert(
      !['default', 'star', 'planeswalker'].includes(entry.symbol),
      'Generic placeholder aliased',
    );
    for (const rarity of rarities)
      for (const source of sources) {
        assert.equal(
          now.setSymbolVector(code, rarity, source),
          now.setSymbolVector(entry.symbol, rarity, source),
        );
        assert.equal(
          ink.setSymbolFilter(code, rarity, source),
          ink.setSymbolFilter(entry.symbol, rarity, source),
        );
        additions++;
      }
    const face = { name: 'Symbol probe', setCode: code, rarity: 'rare' };
    assert.equal(assets.faceSetSymbol(face), now.setSymbolVector(entry.symbol, 'rare'));
    assert.equal(assets.faceEtchingSymbol(face), now.setSymbolVector(entry.symbol, 'common'));
    assert.equal(
      assets.faceSetSymbol({ ...face, setSymbol: 'https://example.com/custom.svg' }),
      'https://example.com/custom.svg',
    );
    assert.equal(
      assets.faceSetSymbol({ ...face, printingElements: { setSymbol: { hidden: true } } }),
      null,
    );
    assert.equal(
      now.setSymbolVector('  ' + code.toUpperCase() + '  ', 'rare'),
      now.setSymbolVector(code, 'rare'),
    );
    assert.equal(now.setSymbolVector(code + '-made-up', 'rare'), null, 'Prefix guessing');
  }
  assert.equal(Object.keys(fixture.aliases).length, 46);
  assert.equal(now.setSymbolVector('slz', 'common'), fixture.vectors.slz.url);
  assert.equal(now.setSymbolVector('slz', 'common', 'keyrune'), null);
  assert.equal(ink.setSymbolFilter('slz', 'common'), 'none');
  assert.notEqual(ink.setSymbolFilter('slz', 'rare'), 'none');
  for (const code of Object.keys(fixture.pending)) assert.equal(now.setSymbolVector(code), null);
  const result = {
    baseline,
    controls,
    additions,
    aliases: 46,
    vectors: 1,
    scoreReuse: false,
    scope:
      'Exact symbol URLs and ink policies for previously supported codes; not a scan calibration or pixel score',
    tool: {
      file: 'tests/magic-recent-set-symbols.mjs',
      sha256: createHash('sha256')
        .update(await readFile('tests/magic-recent-set-symbols.mjs'))
        .digest('hex'),
    },
  };
  await mkdir('test-results/recent-set-symbols', { recursive: true });
  await writeFile(
    'test-results/recent-set-symbols/compatibility.json',
    JSON.stringify(result, null, 2) + '\n',
  );
  console.log(result);
} finally {
  await current.close();
  await parent.close();
}
