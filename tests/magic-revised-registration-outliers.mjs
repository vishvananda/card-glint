import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
const root = new URL('../games/magic/fixtures/accuracy/3ed-recheck/', import.meta.url),
  expected = JSON.parse(await fs.readFile(new URL('registration-outliers.json', root))),
  poseBytes = gunzipSync(
    await fs.readFile(new URL('vertical-interior-normalization.json.gz', root)),
  ),
  poses = JSON.parse(poseBytes),
  directory = await fs.mkdtemp(path.join(os.tmpdir(), 'magic-registration-outliers-'));
try {
  assert.equal(hash(poseBytes), expected.posesHash);
  const input = path.join(directory, 'poses.json'),
    output = path.join(directory, 'queue.json');
  await fs.writeFile(input, poseBytes);
  execFileSync(
    process.execPath,
    ['games/magic/tools/accuracy/revised-registration-outliers.mjs', input, output],
    { stdio: 'pipe' },
  );
  assert.deepEqual(JSON.parse(await fs.readFile(output)), expected);
  assert.equal(expected.status, 'registration-outlier-review-queue-not-accepted');
  assert.deepEqual(expected.summary.byQueue, {
    'independent-displacement-review': 33,
    'profile-shape-review': 13,
    'search-boundary-review': 1,
    'parent-registration-review': 11,
  });
  const all = Object.values(poses.groups).flatMap((g) => g.rows),
    rejected = all.filter((r) => !r.accepted);
  assert.equal(rejected.length, 58);
  assert.deepEqual(expected.rows.map((r) => r.id).sort(), rejected.map((r) => r.id).sort());
  for (const r of expected.rows) {
    const p = rejected.find((p) => p.id === r.id);
    assert.equal(r.accepted, false);
    assert.equal(r.referenceHash, p.referenceHash);
    assert.deepEqual(r.diagnosticTransform, p.transform);
    if (r.queue === 'profile-shape-review') {
      assert(p.parentAccepted && p.bounded);
      assert(r.verification.every((b) => Math.abs(b.shift) <= 0.5));
      assert(!p.fitPassed || !p.independentPassed);
    }
  }
} finally {
  await fs.rm(directory, { recursive: true, force: true });
}
console.log(
  'All58 frozen registration rejections receive a reproducible review reason;13 shape-only cases remain unaccepted and poses are unchanged.',
);
