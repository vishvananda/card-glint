// Historical evidence projection only. Current render/input/score hashes stay current.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { root, hash } from './common.mjs';
const FILE = 'games/magic/fixtures/accuracy/color-indicators/source-proof.json.gz';
const SHA = '237b169e673eb2da90c8da30d2990d8997a9e8295990219f8b0c2708a8941124';
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
    for (const [file, e] of Object.entries(p.files)) {
      assert(
        file.startsWith('games/magic/src/') || file === 'games/magic/tools/accuracy/adapter.mjs',
      );
      assert.equal(
        hash(await readFile(path.join(root, file))),
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
  const e = (await colorIndicatorAncestry()).files[file];
  return e && e.beforeSource !== null && hash(bytes) === e.after
    ? Buffer.from(e.beforeSource)
    : bytes;
}
export async function colorIndicatorHistoricalFiles(files) {
  const p = await colorIndicatorAncestry();
  const kept = [];
  for (const file of files) {
    const key = file.startsWith('games/') ? file : path.relative(root, file);
    const e = p.files[key];
    if (e?.beforeSource === null && hash(await readFile(path.join(root, key))) === e.after)
      continue;
    kept.push(file);
  }
  return kept;
}
