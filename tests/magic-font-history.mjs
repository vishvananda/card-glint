import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {
  fontGeometryHistory,
  preFontGeometrySource,
  fontGeometryHistoricalFiles,
} from '../games/magic/tools/accuracy/font-geometry-ancestry.mjs';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
const p = await fontGeometryHistory();
assert.equal(p.scoreReuse, false, 'Font geometry changes cannot reuse typography scores');
assert(Object.keys(p.files).length >= 50);
let additions = 0;
for (const [file, e] of Object.entries(p.files)) {
  const current = await fs.readFile(file);
  assert.equal(hash(current), e.after, 'Unreviewed font source: ' + file);
  const old = await preFontGeometrySource(file, current);
  if (e.beforeSource !== null) {
    assert.equal(hash(old), e.before);
    assert.deepEqual(await fontGeometryHistoricalFiles([file]), [file]);
  } else {
    additions++;
    assert.deepEqual(old, current);
    assert.deepEqual(await fontGeometryHistoricalFiles([file]), []);
  }
  const foreign = Buffer.concat([current, Buffer.from('\n// foreign font change\n')]);
  assert.deepEqual(await preFontGeometrySource(file, foreign), foreign);
}
assert.equal(additions, 2);
console.log(
  'Exact historical source reconstruction rejects foreign bytes; live typography and scores keep their new identities.',
);
