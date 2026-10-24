// The typography trial cannot change a pose, size, row budget or control ink.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { auditFlavorWidthStudy } from '../games/magic/tools/accuracy/abu-flavor-width-report.mjs';
import { abuPaperDelta } from '../games/magic/tools/accuracy/abu-paper-ancestry.mjs';
const prefix = 'games/magic/fixtures/accuracy/early-through-fourth/';
const nativeBytes = gunzipSync(await readFile(prefix + 'abu-paper-native.json.gz'));
const native = JSON.parse(nativeBytes);
const selected = JSON.parse(gunzipSync(await readFile(prefix + 'abu-fractional-selected.json.gz')));
await abuPaperDelta();
for (const [filename, expected] of [
  [
    'abu-flavor-glyph-width-trials.json.gz',
    '60056056722f92e78bb32443df9e8bb05fc856257bd71ab49c2d6194718af457',
  ],
  [
    'abu-flavor-wrap-width-trials.json.gz',
    '9f6e814fcb25b7233d3a4750e7381dfb66879c1b7dd2d3f7b9f4c521f7896270',
  ],
]) {
  const bytes = await readFile(prefix + filename);
  assert.equal(hash(bytes), expected);
  const artifact = JSON.parse(gunzipSync(bytes));
  const capture = artifact.capture;
  assert.equal(artifact.status, 'completed-diagnostic-not-adopted');
  assert.equal(hash(artifact.tools.study), capture.source.toolHash);
  assert.equal(
    hash(artifact.tools.plugin),
    capture.source.dependencies.find(([f]) => f === 'abu-flavor-width-plugin.mjs')[1],
  );
  assert.equal(capture.source.inputHash, native.source.inputHash);
  assert.deepEqual(
    auditFlavorWidthStudy(capture, native, selected, hash(nativeBytes), artifact.poses),
    artifact.summary,
  );
  for (const mutate of [
    (c) => c.rows.pop(),
    (c) => {
      c.rows[0].variants[0].renderHash = '0'.repeat(64);
    },
    (c) => {
      c.rows[0].variants[2].layout.size += 0.25;
    },
    (c) => {
      c.rows[0].variants[2].layout.lines[0].baseline += 0.5;
    },
    (c) => {
      c.rows[0].variants[1].proposal.rejected = true;
    },
  ]) {
    const c = structuredClone(capture);
    mutate(c);
    assert.throws(() =>
      auditFlavorWidthStudy(c, native, selected, hash(nativeBytes), artifact.poses),
    );
  }
  const moved = structuredClone(artifact.poses);
  moved[0].transform.matrix[4] += 0.5;
  assert.throws(() => auditFlavorWidthStudy(capture, native, selected, hash(nativeBytes), moved));
  const changed = structuredClone(artifact.poses);
  changed[0].normalizationHash = '0'.repeat(64);
  assert.throws(() => auditFlavorWidthStudy(capture, native, selected, hash(nativeBytes), changed));
}
console.log(
  'ABU flavor:228 flavor printings +9 regular controls,2844 native trials across two sweeps; exact baseline/pose joins, fixed size/baselines/rows, zero control changes. Neither sweep is a runtime adoption.',
);

const attribution = JSON.parse(
  await readFile(prefix + 'abu-flavor-attribution-source-review.json'),
);
assert.equal(attribution.status, 'reviewed-awaiting-printing-correction');
assert.deepEqual(attribution.cards.map((r) => r.set).sort(), ['2ed', 'lea', 'leb']);
for (const row of attribution.cards) {
  const member = native.rows.find((r) => r.id === row.id);
  assert.equal(member.name, row.name);
  assert.equal(member.referenceHash, row.referenceHash);
  assert.equal(row.field, 'flavorText');
  assert.equal(row.proposed.replace('\n', ' '), row.before);
  assert(row.proposed.includes('\n—Lewis Carroll'));
}
console.log(
  'Pearled Unicorn:three exact scan-bound attribution-break proposals retained separately from layout fits.',
);

const currentNativeBytes = gunzipSync(await readFile(prefix + 'abu-flavor-native.json.gz'));
const correctedBytes = await readFile(prefix + 'abu-flavor-wrap-corrected-trials.json.gz');
assert.equal(
  hash(correctedBytes),
  '1b97059e8595b8abc93d66594480b14fdd75c0956767b7622d7ac75878997751',
);
const corrected = JSON.parse(gunzipSync(correctedBytes));
assert.equal(corrected.capture.source.closed, true);
assert.deepEqual(
  auditFlavorWidthStudy(
    corrected.capture,
    JSON.parse(currentNativeBytes),
    selected,
    hash(currentNativeBytes),
    corrected.poses,
  ),
  corrected.summary,
);
assert.equal(
  corrected.capture.source.inputHash,
  JSON.parse(currentNativeBytes).source.afterInputHash,
);
assert.equal(hash(corrected.tools.study), corrected.capture.source.toolHash);
console.log(
  'Corrected attribution census:1422 additional native trials, same fixed-size/baseline/row safeguards; no wrap policy adopted.',
);
