// Historical evidence projection only. Current render/input/score hashes stay current.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { root, hash } from './common.mjs';
import {
  preRecentSymbolSource,
  recentSymbolHistoricalFiles,
} from './recent-symbol-source-ancestry.mjs';
const FILE = 'games/magic/fixtures/accuracy/color-indicators/source-proof.json.gz';
const SHA = '0e1627c31e30c1046ec5fe5edcdcfa53944908814bb93ad884ef8c7df8eb41a4';
let checked;
export function colorIndicatorAncestry() {
  return (checked ??= (async () => {
    const bytes = await readFile(path.join(root, FILE));
    assert.equal(hash(bytes), SHA, 'Changed color indicator source receipt');
    const p = JSON.parse(gunzipSync(bytes));
    assert.equal(p.schema, 1);
    assert.equal(p.kind, 'optional-color-indicators-default-painter-parity');
    assert.equal(p.baseline, 'a39f137a23a8cac7b47fcaf31c18e88b1af4f241');
    assert.equal(p.scoreReuse, false, 'Indicator printings need new scores');
    assert(p.evidence.rows.length >= 81);
    assert(
      p.evidence.rows.every((r) => r.changedDefaultBytes === 0 && r.changedIndicatorBytes > 0),
    );
    assert.equal(p.evidence.pngExport, true);
    assert.equal(p.evidence.tool.file, 'tests/magic-color-indicators-browser.mjs');
    assert.equal(
      hash(await readFile(path.join(root, p.evidence.tool.file))),
      p.evidence.tool.sha256,
      'Changed indicator differential tool',
    );
    for (const [file, e] of Object.entries(p.files)) {
      assert(
        file.startsWith('games/magic/src/') || file === 'games/magic/tools/accuracy/adapter.mjs',
      );
      assert.equal(
        hash(await preRecentSymbolSource(file, await readFile(path.join(root, file)))),
        e.after,
        'Unreviewed color indicator dependency: ' + file,
      );
      if (e.beforeSource !== null) assert.equal(hash(e.beforeSource), e.before);
    }
    return p;
  })());
}
/** Exact inactive-extension ancestry; foreign bytes never acquire an older identity. */
export async function preColorIndicatorSource(file, bytes) {
  bytes = await preRecentSymbolSource(file, bytes);
  const e = (await colorIndicatorAncestry()).files[file];
  return e && e.beforeSource !== null && hash(bytes) === e.after
    ? Buffer.from(e.beforeSource)
    : bytes;
}
export async function colorIndicatorHistoricalFiles(files) {
  const p = await colorIndicatorAncestry();
  const kept = [];
  for (const file of await recentSymbolHistoricalFiles(files)) {
    const key = file.startsWith('games/') ? file : path.relative(root, file);
    const e = p.files[key];
    if (e?.beforeSource === null && hash(await readFile(path.join(root, key))) === e.after)
      continue;
    kept.push(file);
  }
  return kept;
}
