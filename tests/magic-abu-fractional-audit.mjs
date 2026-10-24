import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash, sourceHash } from '../games/magic/tools/accuracy/common.mjs';
import {
  abuFractionalAncestry,
  preAbuFractionalSource,
  abuFractionalAffected,
  abuFractionalRuntimeCompatible,
} from '../games/magic/tools/accuracy/abu-fractional-ancestry.mjs';
const proof = await abuFractionalAncestry();
assert.equal(await sourceHash('games/magic/src'), proof.afterRenderer);
assert.notEqual(
  proof.capturedRenderer,
  proof.afterRenderer,
  'Retain the recorded metadata-only transition',
);
for (const [file, entry] of Object.entries(proof.files)) {
  const current = await readFile(file),
    before = await preAbuFractionalSource(file, current);
  assert.equal(hash(current), entry.after);
  assert.equal(hash(before), entry.before);
  assert.deepEqual(await preAbuFractionalSource(file, before), before);
  await assert.rejects(
    preAbuFractionalSource(
      file,
      Buffer.concat([current, Buffer.from('\n// unknown source edit\n')]),
    ),
    /Unreviewed ABU fractional source/,
  );
}
for (const set of ['lea', 'leb', '2ed']) {
  for (const task of ['rules', 'flavor', 'fullCard', 'release']) {
    assert(abuFractionalAffected(set, task));
    assert.equal(
      await abuFractionalRuntimeCompatible('games/magic/src', proof.beforeRenderer, set, task),
      false,
      'Old runtime cannot approve changed Original text',
    );
    assert.equal(
      abuFractionalAffected(set, task, true),
      false,
      'Reviewed original data did not change',
    );
  }
  for (const task of [
    'frameGeometry',
    'frameColor',
    'manaGeometry',
    'headings',
    'artist',
    'footer',
    'stats',
  ])
    assert(
      await abuFractionalRuntimeCompatible('games/magic/src', proof.beforeRenderer, set, task),
    );
}
for (const set of ['8ed', 'm21', '3ed', '4ed'])
  assert(
    await abuFractionalRuntimeCompatible('games/magic/src', proof.beforeRenderer, set, 'fullCard'),
  );
assert.equal(
  await abuFractionalRuntimeCompatible('games/magic/src', '0'.repeat(64), '8ed', 'fullCard'),
  false,
);
const selected = JSON.parse(gunzipSync(await readFile(proof.evidence.selected.file)));
assert.equal(selected.summary.inventory, 899);
assert.equal(selected.summary.accepted, 896);
assert.equal(selected.summary.addedRows, 0);
assert.equal(selected.summary.fontSizeChanges, 17);
assert.equal(selected.status, 'complete-development-census');
for (const set of ['lea', 'leb', '2ed'])
  assert(selected.sets[set].after100 > selected.sets[set].before100);
for (const name of ['Mana Vault', 'Hypnotic Specter', 'Living Wall']) {
  const r = selected.rows.find((r) => r.set === '2ed' && r.name === name);
  assert.equal(r.afterLayout.size, 15.5);
  assert(r.score.delta100 > 25);
}
const simulacrum = selected.rows.find((r) => r.set === '2ed' && r.name === 'Simulacrum');
assert.equal(simulacrum.afterLayout.size, 15.25);
assert.equal(simulacrum.afterLayout.lines.length, 6);
const shadow = selected.rows.find((r) => r.set === 'lea' && r.name === 'Nether Shadow');
assert.equal(shadow.afterLayout.lines.length, 7);
assert(shadow.score.delta100 > 0);
console.log(
  'ABU audit:899native faces,0added rows, typed source restoration, explicit metadata close and unaffected-component reuse pass.',
);
