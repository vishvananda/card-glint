// Historical source reconstruction only. All live typography scores need review.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { root, hash } from './common.mjs';
const FILE = 'games/magic/fixtures/accuracy/font-geometry/source-history.json.gz';
const SHA = 'ad9b4b06f892b4a557e0d6b4654a1ff13f6d2a396b1516c35256ad8fbbb3eee9';
let checked;
export function fontGeometryHistory() {
  return (checked ??= (async () => {
    const bytes = await fs.readFile(path.join(root, FILE));
    assert.equal(hash(bytes), SHA, 'Changed font geometry history');
    const p = JSON.parse(gunzipSync(bytes));
    assert.equal(p.kind, 'explicit-font-geometry-visible-change');
    assert.equal(p.baseline, '74115a9bdff123f1e815db9b6cf029c7a8a677e6');
    assert.equal(p.scoreReuse, false);
    for (const [file, e] of Object.entries(p.files)) {
      assert(
        file === 'games/magic/fonts.css' ||
          file.startsWith('games/magic/src/presentation/') ||
          file.startsWith('games/magic/src/data/'),
      );
      assert.match(e.after, /^[a-f0-9]{64}$/);
      if (e.beforeSource !== null) assert.equal(hash(e.beforeSource), e.before);
    }
    return p;
  })());
}
/** Reverse these exact bytes only; foreign edits retain their actual identity. */
export async function preFontGeometrySource(file, bytes) {
  const e = (await fontGeometryHistory()).files[file];
  return e?.beforeSource !== null && e && hash(bytes) === e.after
    ? Buffer.from(e.beforeSource)
    : bytes;
}
/** Omit only exact additions from historical trees, never current score hashes. */
export async function fontGeometryHistoricalFiles(files) {
  const p = await fontGeometryHistory(),
    kept = [];
  for (const file of files) {
    const key = file.startsWith('games/') ? file : path.relative(root, file);
    const e = p.files[key];
    if (e?.beforeSource === null && hash(await fs.readFile(path.join(root, key))) === e.after)
      continue;
    kept.push(file);
  }
  return kept;
}
