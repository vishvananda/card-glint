import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { hash } from './common.mjs';
import { modernManaStudy } from './modern-mana-study.mjs';
const file = 'games/magic/src/presentation/printing-mana-adjustment.ts';
const source = await readFile(file, 'utf8');
const parameters = {
  schema: 1,
  set: 'm21',
  source: { profileSourceHash: hash(source) },
  rendererControls: { scaleX: 0.98, scaleY: 0.98, spacing: 0.75, dx: -0.125, dy: -0.25 },
};
test('source-bound study rejects foreign code and invalid knobs', () => {
  const plugin = modernManaStudy(parameters);
  assert(plugin.transform(source, '/' + file).code.includes('"scaleX":0.98'));
  assert.throws(
    () => plugin.transform(source + '// edited source', '/' + file),
    /Changed mana source/,
  );
  assert.equal(plugin.transform(source, '/other.ts'), undefined);
  assert.throws(() => modernManaStudy({ ...parameters, set: 'war' }));
  assert.throws(() =>
    modernManaStudy({
      ...parameters,
      rendererControls: { ...parameters.rendererControls, scaleY: 1 },
    }),
  );
  assert.throws(() =>
    modernManaStudy({ ...parameters, rendererControls: { ...parameters.rendererControls, dy: 5 } }),
  );
});
test('only M21 normal costs change; source types, noncost cards and editor deltas stay scoped', async () => {
  const plain = await createServer({
    configFile: false,
    server: { middlewareMode: true, hmr: false, ws: false },
  });
  const study = await createServer({
    configFile: false,
    server: { middlewareMode: true, hmr: false, ws: false },
    plugins: [modernManaStudy(parameters)],
  });
  try {
    for (const server of [plain, study])
      await server.ssrLoadModule('/games/magic/src/data/eager.ts');
    const a = await plain.ssrLoadModule('/' + file),
      b = await study.ssrLoadModule('/' + file);
    const face = {
      name: 'Cost',
      setCode: 'm21',
      typeLine: 'Creature',
      colors: ['U'],
      manaSymbols: ['2', 'U'],
    };
    assert.notDeepEqual(a.printingManaDefaults(face), b.printingManaDefaults(face));
    for (const [key, value] of Object.entries(parameters.rendererControls))
      assert.equal(b.printingManaDefaults(face)[key], value);
    for (const extra of [
      { setCode: 'war' },
      { setCode: 'lea', frameStyle: 'retro' },
      { layout: 'planeswalker', typeLine: 'Planeswalker' },
      { manaSymbols: [] },
      { frameAssetFamily: 'eighth' },
    ])
      assert.deepEqual(
        b.printingManaDefaults({ ...face, ...extra }),
        a.printingManaDefaults({ ...face, ...extra }),
      );
    const delta = b.printingManaAdjustment({
      ...face,
      symbolAdjustment: { mana: { dx: 0.5, scaleX: 1.02, spacing: 0.25 } },
    });
    assert.equal(delta.dx, 0.375);
    assert.equal(delta.spacing, 1);
    assert.equal(delta.scaleX, 0.98 * 1.02);
  } finally {
    await plain.close();
    await study.close();
  }
});
