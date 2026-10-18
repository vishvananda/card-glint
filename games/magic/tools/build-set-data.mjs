import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
/** Generate per-set browser payloads without changing authoritative calibration files. */
import { createServer } from 'vite';
import { readFile, writeFile, mkdir, readdir, rm } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { format } from 'prettier';
import { tables } from './set-data-tables.mjs';
const check = process.argv.includes('--check');
const root = new URL('../src/', import.meta.url),
  output = new URL('data/', root);
// A fresh source checkout has no generated payloads. Bootstrap only the tiny
// views needed while evaluating the authoritative typed calibration modules.
if (!check) {
  await mkdir(output, { recursive: true });
  for (const [file, content] of [
    [
      'scopes.ts',
      'export const availableSets: string[] = []; export const profileSets: string[] = []; export const fixedTableSets: Readonly<Record<string,string>> = {};',
    ],
    [
      'tables.ts',
      "import {table} from './registry.js';\n" +
        tables
          .flatMap((t) =>
            t.names.map(
              (n) =>
                `export const ${n}=table<typeof import('../presentation/${t.file}.js').${n}>('${n}');`,
            ),
          )
          .join('\n'),
    ],
  ]) {
    try {
      await readFile(new URL(file, output));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      await writeFile(new URL(file, output), content);
    }
  }
}
const server = await createServer({
  configFile: false,
  server: { middlewareMode: true },
  appType: 'custom',
});
const shards = new Map();
const shard = (code) => {
  assert.match(code, /^[a-z0-9]{2,8}$/);
  if (!shards.has(code)) shards.set(code, { set: code, tables: {} });
  return shards.get(code);
};
const put = (code, name, key, value) => ((shard(code).tables[name] ??= {})[key] = value);
const emitted = {};
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
const relative = (file) =>
  path.relative(process.cwd(), fileURLToPath(file)).split(path.sep).join('/');
const write = async (file, value) => {
  const content = await format(value, { parser: 'typescript', singleQuote: true, printWidth: 100 });
  emitted[relative(file)] = digest(content);
  if (check) assert.equal(await readFile(file, 'utf8'), content, 'Regenerate ' + file);
  else await writeFile(file, content);
};
try {
  const generated = [];
  for (const { file, names, set } of tables) {
    const source = await server.ssrLoadModule('/games/magic/src/presentation/' + file + '.ts');
    for (const name of names) {
      for (const [key, value] of Object.entries(source[name]))
        put(set ?? key.split(/[/-]/)[0].toLowerCase(), name, key, value);
      generated.push(
        `export const ${name} = table<typeof import('../presentation/${file}.js').${name}>('${name}');`,
      );
    }
  }
  for (const code of ['fem', '4ed', 'chr']) {
    const { profile } = await server.ssrLoadModule(
      '/games/magic/src/calibration/sets/' + code + '.ts',
    );
    put(code, 'setCalibrationProfiles', code, profile);
  }
  for (const [file, name] of [
    ['printing-blackpoint-values', 'printingBlackPoints'],
    ['printing-stock-values', 'printingStocks'],
  ]) {
    const values = JSON.parse(await readFile(new URL('presentation/' + file + '.json', root)));
    for (const code of new Set(values.map((r) => r.set)))
      put(
        code,
        name,
        code,
        values.filter((r) => r.set === code),
      );
  }
  // Detailed review notes remain in fixtures, not executable browser payloads.
  const reviews = JSON.parse(
    await readFile(new URL('../fixtures/accuracy/printing-review-catalog.json', root)),
  );
  const sources = [
    ...new Set(
      [...Object.values(reviews.wording).flat(), ...Object.values(reviews.artists)].map(
        (r) => r.source,
      ),
    ),
  ].sort();
  const compact = ({ source, reason, ...value }) => ({
    ...value,
    evidence: sources.indexOf(source),
  });
  for (const [id, rows] of Object.entries(reviews.wording))
    put(reviews.sets[id], 'printingCorrections', id, rows.map(compact));
  for (const [id, row] of Object.entries(reviews.artists))
    put(reviews.sets[id], 'artistCredits', id, compact(row));
  const groups = { calibration: new Map(), wording: new Map() };
  for (const [code, data] of [...shards].sort())
    for (const kind of Object.keys(groups)) {
      const selected = Object.fromEntries(
        Object.entries(data.tables).filter(
          ([name]) =>
            (kind === 'wording') === ['printingCorrections', 'artistCredits'].includes(name),
        ),
      );
      if (Object.keys(selected).length)
        groups[kind].set(code, { set: code, kind, tables: selected });
    }
  for (const [kind, group] of Object.entries(groups)) {
    const directory = kind === 'calibration' ? 'sets' : 'wording';
    await mkdir(new URL(directory + '/', output), { recursive: true });
    for (const [code, data] of group)
      await write(
        new URL(directory + '/' + code + '.ts', output),
        "// Generated by build-set-data.mjs; edit the authoritative set profile or evidence.\nimport type { SetData } from '../registry.js';\nconst data: SetData = " +
          JSON.stringify(data) +
          ';\nexport default data;\n',
      );
    for (const file of await readdir(new URL(directory + '/', output))) {
      if (!file.endsWith('.ts') || group.has(file.slice(0, -3))) continue;
      assert.ok(!check, 'Obsolete generated payload: ' + file);
      const path = new URL(directory + '/' + file, output);
      assert.ok((await readFile(path, 'utf8')).startsWith('// Generated by build-set-data.mjs;'));
      await rm(path);
    }
    const entry = kind === 'calibration' ? 'eager' : 'eager-wording';
    // A compatibility import stays one request, rather than eagerly requesting
    // every dynamic chunk. Lazy consumers do not reference this aggregate.
    await write(
      new URL(entry + '.ts', output),
      "// Generated compatibility aggregate.\nimport {registerSet} from './registry.js';\n" +
        [...group.values()].map((data) => 'registerSet(' + JSON.stringify(data) + ');').join('\n') +
        '\n',
    );
  }
  await write(
    new URL('tables.ts', output),
    "// Generated views; values load once per set.\nimport { table } from './registry.js';\n" +
      generated.join('\n') +
      '\n',
  );
  await write(
    new URL('review-metadata.ts', output),
    `// Identity metadata only; full notes remain in fixtures/accuracy/printing-review-catalog.json.\nexport const printingCorrectionRevision=${JSON.stringify(reviews.revision)};\nexport const artistCreditRevision=${JSON.stringify(reviews.artistRevision)};\nexport const reviewSources=${JSON.stringify(sources)};\n`,
  );
  const codes = [...groups.calibration.keys()].sort();
  await write(
    new URL('scopes.ts', output),
    `// Set ownership for detecting unprepared synchronous queries.\nexport const availableSets = ${JSON.stringify(codes)};\nexport const profileSets: readonly string[] = ${JSON.stringify(
      [...shards]
        .filter(([, data]) => data.tables.setCalibrationProfiles)
        .map(([code]) => code)
        .sort(),
    )};\nexport const fixedTableSets: Readonly<Record<string,string>> = ${JSON.stringify(Object.fromEntries(tables.filter((t) => t.set).flatMap((t) => t.names.map((n) => [n, t.set]))))};\n`,
  );
  await write(
    new URL('loaders.ts', output),
    '// Literal imports preserve separate cacheable calibration and wording chunks.\n' +
      Object.entries(groups)
        .map(
          ([kind, group]) =>
            'export const ' +
            (kind === 'calibration' ? 'setLoaders' : 'wordingLoaders') +
            ' = {\n' +
            [...group.keys()]
              .map(
                (c) =>
                  JSON.stringify(c) +
                  ":()=>import('./" +
                  (kind === 'calibration' ? 'sets' : 'wording') +
                  '/' +
                  c +
                  ".js'),",
              )
              .join('\n') +
            '\n};\n',
        )
        .join('\n'),
  );
  const manifestFile = new URL('generated-manifest.json', output);
  const sourceHashes = {};
  for (const file of (await readdir(root, { recursive: true }))
    .filter((f) => /\.(ts|json)$/.test(f))
    .sort()) {
    const url = new URL(file, root),
      name = relative(url);
    if (emitted[name] || url.href === manifestFile.href) continue;
    sourceHashes[name] = digest(await readFile(url));
  }
  for (const url of [
    new URL(import.meta.url),
    new URL('set-data-tables.mjs', import.meta.url),
    new URL('../assets.json', import.meta.url),
    new URL('../fixtures/accuracy/printing-review-catalog.json', import.meta.url),
  ])
    sourceHashes[relative(url)] = digest(await readFile(url));
  const manifest = await format(
    JSON.stringify({ schema: 1, files: emitted, sources: sourceHashes }),
    {
      parser: 'json',
      printWidth: 100,
    },
  );
  if (check)
    assert.equal(await readFile(manifestFile, 'utf8'), manifest, 'Regenerate set data manifest');
  else await writeFile(manifestFile, manifest);
  console.log(
    `Generated ${codes.length} per-set payloads from ${tables.length} table sources and ${Object.keys(reviews.wording).length} wording reviews.`,
  );
} finally {
  await server.close();
}
