import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createServer } from './magic-vite.mjs';
import { tables } from '../games/magic/tools/set-data-tables.mjs';
const server = await createServer({
  configFile: false,
  server: { middlewareMode: true },
  appType: 'custom',
});
const rows = [];
const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
try {
  const { table } = await server.ssrLoadModule('/games/magic/src/data/registry.ts');
  for (const { file, names } of tables) {
    const original = await server.ssrLoadModule('/games/magic/src/presentation/' + file + '.ts');
    for (const name of names) {
      const expected = original[name],
        actual = Object.fromEntries(Object.entries(table(name)));
      assert.deepEqual(actual, expected, name);
      const canonical = (value) =>
        Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)));
      rows.push({ name, entries: Object.keys(expected).length, sha256: hash(canonical(actual)) });
    }
  }
  for (const code of ['fem', '4ed', 'chr']) {
    const { profile } = await server.ssrLoadModule(
      '/games/magic/src/calibration/sets/' + code + '.ts',
    );
    assert.deepEqual(table('setCalibrationProfiles')[code], profile);
    rows.push({ name: 'profile/' + code, entries: 1, sha256: hash(profile) });
  }
  for (const [file, name] of [
    ['printing-blackpoint-values', 'printingBlackPoints'],
    ['printing-stock-values', 'printingStocks'],
  ]) {
    const expected = JSON.parse(await readFile('games/magic/src/presentation/' + file + '.json'));
    for (const set of new Set(expected.map((r) => r.set)))
      assert.deepEqual(
        table(name)[set],
        expected.filter((r) => r.set === set),
      );
    rows.push({ name, entries: expected.length, sha256: hash(expected) });
  }
  const evidence = JSON.parse(
    await readFile('games/magic/fixtures/accuracy/printing-review-catalog.json'),
  );
  const { reviewDetails } = await server.ssrLoadModule('/games/magic/src/printing/review.ts');
  let reviews = 0;
  for (const [name, source] of [
    ['printingCorrections', evidence.wording],
    ['artistCredits', evidence.artists],
  ])
    for (const [id, value] of Object.entries(source)) {
      const list = Array.isArray(value) ? value : [value],
        actual = table(name)[id],
        loaded = Array.isArray(actual) ? actual : [actual];
      assert.equal(list.length, loaded.length);
      for (let i = 0; i < list.length; i++) {
        const { reason, ...expected } = list[i];
        const { evidence, ...fields } = loaded[i];
        const { reason: compactReason, ...identity } = reviewDetails(loaded[i]);
        assert.deepEqual({ ...fields, ...identity }, expected, id);
        reviews++;
      }
    }
  const result = {
    schema: 1,
    scope:
      'Exact value parity with every authoritative typed calibration table and every reviewed correction, excluding intentionally removed review prose.',
    tables: rows.length,
    entries: rows.reduce((n, r) => n + r.entries, 0),
    reviewGroups: reviews,
    rows,
  };
  if (process.argv.includes('--record'))
    await writeFile(
      'games/magic/fixtures/accuracy/delivery-data-parity.json',
      JSON.stringify(result, null, 2) + '\n',
    );
  console.log(
    `Exact data parity: ${rows.length} tables, ${result.entries} entries, ${reviews} correction groups.`,
  );
} finally {
  await server.close();
}
