// Finish review metadata without pretending it changes the painted profile.
import assert from 'node:assert/strict';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';
import { format } from 'prettier';
import { root, hash, writeJson } from './common.mjs';
const [set, nativeDirectory, reviewFile, output] = process.argv.slice(2);
assert(
  output && /^[a-z0-9]{2,8}$/.test(set),
  'Usage: early-profile-review-metadata.mjs SET NATIVE REVIEW_JSON OUT',
);
const directory = path.join(root, 'games/magic/src'),
  file = 'calibration/sets/' + set + '.ts';
const listing = async () =>
  await Promise.all(
    (await readdir(directory, { recursive: true, withFileTypes: true }))
      .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
      .map((e) => path.join(e.parentPath, e.name))
      .sort()
      .map(async (f) => [path.relative(directory, f), hash(await readFile(f))]),
  );
const beforeMap = await listing(),
  beforeTreeHash = hash(JSON.stringify(beforeMap));
const native = JSON.parse(await readFile(path.join(nativeDirectory, 'capture.json')));
assert.equal(beforeTreeHash, native.source.rendererHash);
const beforeSource = await readFile(path.join(directory, file), 'utf8'),
  review = JSON.parse(await readFile(reviewFile));
assert.equal(review.revision, 2);
assert.equal(review.pending.length, 0);
assert(review.evidence.length && review.scope.trim());
const locate = (text) => {
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  assert.equal(source.parseDiagnostics.length, 0);
  for (const statement of source.statements)
    if (ts.isVariableStatement(statement))
      for (const d of statement.declarationList.declarations)
        if (d.name.getText(source) === 'review') {
          let object = d.initializer;
          while (ts.isAsExpression(object) || ts.isSatisfiesExpression(object))
            object = object.expression;
          assert(ts.isObjectLiteralExpression(object));
          return [object.getStart(source), object.end];
        }
  throw Error('Missing literal review export');
};
const [a, b] = locate(beforeSource);
const afterSource = await format(
  beforeSource.slice(0, a) + JSON.stringify(review) + beforeSource.slice(b),
  { parser: 'typescript', singleQuote: true, printWidth: 100, trailingComma: 'all' },
);
const [c, d] = locate(afterSource);
assert.equal(
  beforeSource.slice(0, a) + '{}' + beforeSource.slice(b),
  afterSource.slice(0, c) + '{}' + afterSource.slice(d),
  'Changes extend beyond review metadata',
);
const manifestPath = path.join(directory, 'data/generated-manifest.json'),
  manifestBeforeBytes = await readFile(manifestPath),
  manifestBefore = JSON.parse(manifestBeforeBytes);
await writeFile(path.join(directory, file), afterSource);
execFileSync(process.execPath, ['games/magic/tools/build-set-data.mjs'], {
  cwd: root,
  stdio: 'pipe',
});
const manifestAfterBytes = await readFile(manifestPath),
  manifestAfter = JSON.parse(manifestAfterBytes);
assert.deepEqual(
  manifestBefore.files,
  manifestAfter.files,
  'Review metadata changed a runtime payload',
);
const manifestChanges = Object.keys(manifestBefore.sources).filter(
  (f) => manifestBefore.sources[f] !== manifestAfter.sources[f],
);
assert.deepEqual(manifestChanges, ['games/magic/src/' + file]);
const afterMap = await listing(),
  beforeByFile = new Map(beforeMap),
  afterByFile = new Map(afterMap);
assert.deepEqual([...beforeByFile.keys()], [...afterByFile.keys()]);
const changedFiles = [...beforeByFile.keys()].filter(
  (f) => beforeByFile.get(f) !== afterByFile.get(f),
);
assert.deepEqual(changedFiles, [file, 'data/generated-manifest.json'].sort());
await writeJson(output, {
  schema: 1,
  set,
  scope:
    'Exact review-export-only change. The profile declaration, every other source file, and every generated runtime payload are unchanged. This proof bridges source provenance only; it never approves changed calibration values.',
  beforeTreeHash,
  afterTreeHash: hash(JSON.stringify(afterMap)),
  beforeMap,
  afterMap,
  changedFiles,
  beforeSource,
  afterSource,
  manifestBefore: manifestBeforeBytes.toString(),
  manifestAfter: manifestAfterBytes.toString(),
  nativeCaptureHash: hash(await readFile(path.join(nativeDirectory, 'capture.json'))),
  toolHash: hash(await readFile(new URL(import.meta.url))),
});
console.log({ set, changedFiles, payloadsUnchanged: Object.keys(manifestBefore.files).length });
