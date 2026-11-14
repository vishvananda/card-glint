// Historical source identity only. Newly supported symbols require new scores.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { root, hash } from './common.mjs';
const FILE = 'games/magic/fixtures/assets/recent-symbol-source-proof.json.gz';
const SHA = '8f4f44b9e9cebc608d0215f52eae5c17fc6e1ed1c1c9326a259881cd6811811d';
let checked;
export function recentSymbolHistory() {
  return (checked ??= (async () => {
    const bytes = await readFile(path.join(root, FILE));
    assert.equal(hash(bytes), SHA, 'Changed recent-symbol source receipt');
    const p = JSON.parse(gunzipSync(bytes));
    assert.equal(p.schema, 1);
    assert.equal(p.kind, 'recent-set-symbol-resolution');
    assert.equal(p.baseline, 'efaa4a952840000e8d66f0522ebed2e6bbb2c11e');
    assert.equal(p.scoreReuse, false);
    assert.equal(p.evidence.controls, 10248);
    assert.equal(p.evidence.additions, 1104);
    assert.equal(
      hash(await readFile(path.join(root, p.evidence.tool.file))),
      p.evidence.tool.sha256,
    );
    for (const [file, entry] of Object.entries(p.files)) {
      assert(
        file.startsWith('games/magic/src/presentation/') ||
          file === 'games/magic/src/data/generated-manifest.json',
      );
      assert.equal(
        hash(await readFile(path.join(root, file))),
        entry.after,
        'Unreviewed recent-symbol dependency: ' + file,
      );
      if (entry.beforeSource !== null) assert.equal(hash(entry.beforeSource), entry.before);
    }
    return p;
  })());
}
export async function preRecentSymbolSource(file, bytes) {
  const entry = (await recentSymbolHistory()).files[file];
  return entry?.beforeSource !== null && entry && hash(bytes) === entry.after
    ? Buffer.from(entry.beforeSource)
    : bytes;
}
export async function recentSymbolHistoricalFiles(files) {
  const p = await recentSymbolHistory(),
    kept = [];
  for (const file of files) {
    const key = file.startsWith('games/') ? file : path.relative(root, file),
      entry = p.files[key];
    if (entry?.beforeSource === null && hash(await readFile(path.join(root, key))) === entry.after)
      continue;
    kept.push(file);
  }
  return kept;
}
