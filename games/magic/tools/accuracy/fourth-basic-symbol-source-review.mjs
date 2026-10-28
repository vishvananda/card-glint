import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gzipSync, gunzipSync } from 'node:zlib';
import { hash, root, sourceHash } from './common.mjs';
import {
  validateFourthBasicSymbolSource,
  fourthBasicSymbolPaths,
} from './fourth-basic-symbol-source-check.mjs';
import { fourthBasicSymbolCodeEdits } from './fourth-basic-symbol-code.mjs';
const [snapshotFile, out] = process.argv.slice(2);
assert(snapshotFile && out?.endsWith('.gz'), 'Use BEFORE_SOURCE_SNAPSHOT OUTPUT.json.gz');
const beforeBytes = await fs.readFile(snapshotFile),
  before = JSON.parse(beforeBytes),
  base = 'games/magic/fixtures/accuracy/4ed/';
const artifacts = {};
for (const name of (await fs.readdir(root + '/' + base))
  .filter(
    (n) =>
      n.startsWith('basic-symbol-') &&
      n.endsWith('.gz') &&
      n !== 'basic-symbol-source-delta.json.gz',
  )
  .sort()) {
  const raw = await fs.readFile(root + '/' + base + name);
  artifacts[name] = { file: base + name, sha256: hash(raw), contentSha256: hash(gunzipSync(raw)) };
}
const read = async (name) => JSON.parse(gunzipSync(await fs.readFile(root + '/' + base + name)));
const native = await read('basic-symbol-native-review.json.gz');
const files = {};
for (const file of [
  ...Object.values(fourthBasicSymbolPaths),
  ...Object.keys(fourthBasicSymbolCodeEdits),
]) {
  const beforeSource = before.sources[file],
    afterSource = await fs.readFile(root + '/' + file, 'utf8');
  files[file] = { before: hash(beforeSource), after: hash(afterSource), beforeSource, afterSource };
}
const directory = root + '/games/magic/src';
const inventoryFiles = (await fs.readdir(directory, { recursive: true, withFileTypes: true }))
  .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
  .map((e) => path.join(e.parentPath, e.name))
  .sort();
const afterInventory = await Promise.all(
  inventoryFiles.map(async (f) => [path.relative(directory, f), hash(await fs.readFile(f))]),
);
const p = {
  schema: 1,
  set: '4ed',
  status: 'native-fourth-basic-symbol-baseline',
  beforeRenderer: before.rendererHash,
  afterRenderer: await sourceHash(directory),
  inputHash: native.inputHash,
  policy: { symbolOffsetY: -0.1 },
  ids: native.ids,
  files,
  beforeInventory: before.inventory,
  afterInventory,
  native: artifacts['basic-symbol-native-review.json.gz'],
  prototype: artifacts['basic-symbol-shared-prototype.json.gz'],
  scores: artifacts['basic-symbol-current-native-scores.json.gz'],
  artifacts,
  toolHash: hash(await fs.readFile(new URL(import.meta.url))),
  validatorHash: hash(
    await fs.readFile(new URL('./fourth-basic-symbol-source-check.mjs', import.meta.url)),
  ),
  codeEditsHash: hash(
    await fs.readFile(new URL('./fourth-basic-symbol-code.mjs', import.meta.url)),
  ),
};
assert.equal(p.beforeRenderer, native.beforeRenderer);
assert.equal(p.afterRenderer, native.afterRenderer);
p.summary = await validateFourthBasicSymbolSource(p);
const bytes = Buffer.from(JSON.stringify(p, null, 2) + '\n'),
  z = gzipSync(bytes);
await fs.writeFile(out, z);
console.log(
  JSON.stringify({
    receiptHash: hash(z),
    before: p.beforeRenderer,
    after: p.afterRenderer,
    summary: p.summary,
  }),
);
