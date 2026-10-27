import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gzipSync, gunzipSync } from 'node:zlib';
import { hash, root, sourceHash } from './common.mjs';
import {
  validateFourthBasicWordData,
  fourthBasicWordPaths,
} from './fourth-basic-word-data-check.mjs';
const [snapshotFile, out] = process.argv.slice(2);
assert(snapshotFile && out?.endsWith('.gz'), 'Use BEFORE_SOURCE_SNAPSHOT OUTPUT.json.gz');
const beforeBytes = await fs.readFile(snapshotFile),
  before = JSON.parse(beforeBytes),
  base = 'games/magic/fixtures/accuracy/4ed/';
await fs.writeFile(root + '/' + base + 'basic-word-before-sources.json.gz', gzipSync(beforeBytes));
const artifacts = {};
for (const name of (await fs.readdir(root + '/' + base))
  .filter(
    (n) =>
      n.startsWith('basic-word-') && n.endsWith('.gz') && n !== 'basic-word-source-delta.json.gz',
  )
  .sort()) {
  const raw = await fs.readFile(root + '/' + base + name);
  artifacts[name] = { file: base + name, sha256: hash(raw), contentSha256: hash(gunzipSync(raw)) };
}
const read = async (name) => JSON.parse(gunzipSync(await fs.readFile(root + '/' + base + name)));
const native = await read('basic-word-native-review.json.gz'),
  fit = await read('basic-word-fine-fit.json.gz');
const files = {};
for (const file of Object.values(fourthBasicWordPaths)) {
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
  status: 'native-fourth-shared-basic-word-data',
  beforeRenderer: before.rendererHash,
  afterRenderer: await sourceHash(directory),
  inputHash: native.inputHash,
  policy: fit.shared[0].params,
  ids: native.ids,
  files,
  beforeInventory: before.inventory,
  afterInventory,
  native: artifacts['basic-word-native-review.json.gz'],
  prototype: artifacts['basic-word-shared-prototype.json.gz'],
  scores: artifacts['basic-word-current-native-scores.json.gz'],
  fit: artifacts['basic-word-fine-fit.json.gz'],
  artifacts,
  toolHash: hash(await fs.readFile(new URL(import.meta.url))),
  validatorHash: hash(
    await fs.readFile(new URL('./fourth-basic-word-data-check.mjs', import.meta.url)),
  ),
};
assert.equal(p.beforeRenderer, native.beforeRenderer);
assert.equal(p.afterRenderer, native.afterRenderer);
p.summary = validateFourthBasicWordData(p);
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
