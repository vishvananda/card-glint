import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { calibrationReport } from '../games/magic/tools/accuracy/calibration-report.mjs';

const root = 'games/magic/fixtures/accuracy/abu-054/';
const review = JSON.parse(await readFile(root + 'review.json'));
for (const [file, digest] of Object.entries(review.sourceGuards))
  assert.equal(hash(await readFile(file)), digest, 'Changed audited source: ' + file);
for (const [file, record] of Object.entries(review.files)) {
  const bytes = await readFile(root + file),
    raw = gunzipSync(bytes);
  assert.equal(hash(bytes), record.sha256, file);
  assert.equal(hash(raw), record.uncompressedSha256, file);
  assert.equal(raw.length, record.bytes, file);
}
const ledger = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/calibration-progress.json'),
);
const reports = await calibrationReport(ledger);
for (const [set, total] of [
  ['lea', 295],
  ['leb', 302],
]) {
  const data = async (suffix) =>
    JSON.parse(gunzipSync(await readFile(root + set + '-' + suffix + '.json.gz')));
  const inputs = await data('inputs'),
    replay = await data('native-replay'),
    scores = await data('scores');
  assert.equal(replay.complete, true);
  assert.equal(replay.inputHash, hash(gunzipSync(await readFile(root + set + '-inputs.json.gz'))));
  const ids = (rows) => rows.map((r) => r.id).sort();
  assert.equal(new Set(ids(inputs.entries)).size, total);
  assert.deepEqual(ids(inputs.entries), ids(replay.rows));
  assert.deepEqual(ids(inputs.entries), ids(scores.rows));
  assert.ok(inputs.entries.every((e) => e.face.wordingMode === 'original'));
  assert.ok(
    replay.rows.every((r) => r.outside === 0 && r.artworkChanged === 0 && r.silhouette === 0),
  );
  const report = reports.find((r) => r.set === set);
  assert.equal(report.inventoryReady, true);
  assert.ok(
    report.outstanding.every((r) => r.task === 'release'),
    'Unfinished ABU audit task',
  );
  const rejected = scores.rows.filter((r) => !r.normalizationAccepted);
  assert.equal(total - rejected.length, review.sets[set].score.ranked);
}
console.log(
  'ABU audit: source/evidence integrity, original wording, exhaustive replay, retained exclusions and all applicable checks pass.',
);
