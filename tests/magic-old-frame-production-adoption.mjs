import { arnSymbolRoleRuntimeParent } from '../games/magic/tools/accuracy/arn-symbol-role-ancestry.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  oldFrameAdoptionDelta,
  preOldFrameAdoptionSource,
  oldFrameAdoptionHistoricalFiles,
  oldFrameAdoptionRuntimeParent,
  oldFrameAdoptionAffected,
} from '../games/magic/tools/accuracy/old-frame-adoption-ancestry.mjs';
import { oldFrameSourceRuntimeCompatible } from '../games/magic/tools/accuracy/old-frame-source-ancestry.mjs';
import { sourceHash, hash, root } from '../games/magic/tools/accuracy/common.mjs';
const p = await oldFrameAdoptionDelta();
const review = JSON.parse(
  await fs.readFile('games/magic/fixtures/accuracy/mirage-onslaught/installed-review.json'),
);
assert.equal(review.rendererHash, p.afterRenderer);
assert.equal(
  review.receipt,
  hash(
    await fs.readFile('games/magic/fixtures/accuracy/mirage-onslaught/production-adoption.json.gz'),
  ),
);
assert.equal(review.defaults.length, 34);
assert.equal(review.sets.mir.printings + review.sets.ons.printings, 701);

assert.equal(
  await arnSymbolRoleRuntimeParent(await sourceHash(path.join(root, 'games/magic/src')), 'mir'),
  p.afterRenderer,
  'Production adoption source is not current',
);
const files = (
  await fs.readdir(path.join(root, 'games/magic/src'), { recursive: true, withFileTypes: true })
)
  .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
  .map((e) => path.join(e.parentPath, e.name))
  .sort();
const parent = [];
for (const file of await oldFrameAdoptionHistoricalFiles(files)) {
  const key = path.relative(root, file);
  parent.push([
    path.relative(path.join(root, 'games/magic/src'), file),
    hash(await preOldFrameAdoptionSource(key, await fs.readFile(file))),
  ]);
}
assert.equal(
  hash(JSON.stringify(parent)),
  p.beforeRenderer,
  'Historical parent no longer reconstructs exactly',
);
for (const [file, e] of Object.entries(p.files)) {
  const bytes = await fs.readFile(path.join(root, file));
  const projected = await preOldFrameAdoptionSource(file, bytes);
  assert.equal(hash(projected), e.beforeSource === null ? e.after : e.before, file);
  const foreign = Buffer.concat([bytes, Buffer.from('\n// unreviewed edit\n')]);
  assert.equal(
    await preOldFrameAdoptionSource(file, foreign),
    foreign,
    'Foreign bytes were hidden',
  );
  assert.equal(await preOldFrameAdoptionSource(file + '.unknown', bytes), bytes);
}
for (const set of [
  'lea',
  'leb',
  '2ed',
  '3ed',
  'arn',
  'atq',
  'leg',
  'drk',
  'fem',
  '4ed',
  'chr',
  'ice',
  '8ed',
  'm21',
]) {
  assert.equal(await oldFrameAdoptionRuntimeParent(p.afterRenderer, set), p.beforeRenderer);
  assert.equal(
    await oldFrameSourceRuntimeCompatible('games/magic/src', p.beforeRenderer, set),
    set !== 'arn',
    set,
  );
}
for (const set of p.affectedSets) {
  assert.equal(await oldFrameAdoptionRuntimeParent(p.afterRenderer, set), p.afterRenderer);
  assert.equal(
    await oldFrameSourceRuntimeCompatible('games/magic/src', p.beforeRenderer, set),
    false,
  );
  assert(await oldFrameAdoptionAffected(set, 'fullCard'));
  assert(await oldFrameAdoptionAffected(set, 'frameColor'));
  assert.equal(await oldFrameAdoptionAffected(set, 'normalization'), false);
  assert.equal(await oldFrameAdoptionAffected(set, 'references'), false);
  assert.equal(await oldFrameAdoptionAffected(set, 'rules', true), ['mir', 'ons'].includes(set));
}
assert.equal(await oldFrameAdoptionRuntimeParent(p.afterRenderer), p.afterRenderer);
assert.equal(await oldFrameAdoptionRuntimeParent('f'.repeat(64), 'lea'), 'f'.repeat(64));
for (const row of p.pigments.native.rows) {
  assert.equal(row.artChanged, 0);
  for (const field of Object.values(row.metrics))
    assert(field.adopted.pairedDeltaE < field.previous.pairedDeltaE, row.name);
}
assert.equal(
  Object.values(p.printings).reduce((n, s) => n + s.native.rows.length, 0),
  701,
);
console.log(
  'Production adoption: all701 native candidates,778 footer controls,34 starting defaults and exact scoped history; foreign edits and changed-set score reuse are rejected.',
);
