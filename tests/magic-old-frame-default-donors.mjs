// Verify development recommendations retain coverage limits and component regressions.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
const dir = new URL('../games/magic/fixtures/accuracy/mirage-onslaught/', import.meta.url);
const report = JSON.parse(await fs.readFile(new URL('default-donor-review.json', dir)));
const archive = JSON.parse(
  gunzipSync(await fs.readFile(new URL('default-donor-methods.json.gz', dir))),
);
const methods = Object.values(archive.files);
for (const f of methods) assert.equal(hash(f.source), f.sha256);
assert.equal(
  report.status,
  'all-34-major-old-frame-donor-pilots-complete-production-inheritance-pending',
);
assert.equal(report.sets.length, 34);
assert.equal(new Set(report.sets.map((r) => r.set)).size, 34);
assert.deepEqual(report.counts, { '4ed': 5, mir: 29, ons: 0 });
const mono = ['4ed', 'mir', 'ons'];
for (const r of report.sets) {
  assert.equal(r.status, 'development-donor-recommendation-not-installed');
  assert(
    methods.some((m) => m.sha256 === r.source.toolHash),
    'Missing exact producer snapshot',
  );
  assert(
    methods.some((m) => m.sha256 === r.source.transferToolHash),
    'Missing transfer snapshot',
  );
  assert(
    methods.some((m) => m.sha256 === r.source.hooksHash),
    'Missing hook snapshot',
  );
  assert.equal(r.sampled, r.accepted + r.rejected.length);
  assert.equal(new Set(r.rejected.map((x) => x.id)).size, r.rejected.length);
  assert.equal(r.accepted, r.groups.all.count);
  const donors = r.groups.all.donors;
  for (const k of ['current', ...mono]) {
    assert(
      Number.isFinite(donors[k].mean100) && donors[k].mean100 >= 0 && donors[k].mean100 <= 100,
    );
    assert(donors[k].matched <= r.accepted);
  }
  const ranked = [...mono].sort((a, b) => donors[b].mean100 - donors[a].mean100);
  assert.equal(r.recommended, ranked[0]);
  if (r.accepted < r.sampled * 0.7)
    assert(r.review.some((t) => t.startsWith('Low scan-normalization')));
  if (r.comparisonMode === 'frame-art-only') {
    assert(['itp', 'ath', 'rqs'].includes(r.set));
    assert.deepEqual(r.selectionWeights, { frame: 75, art: 25 });
    for (const role of ['title', 'type', 'rules', 'mana', 'symbol', 'stats'])
      assert.equal(r.components[role].count, 0);
  } else {
    const regressed = Object.entries(r.components).filter(
      ([, v]) => v.count && v.mean100[r.recommended] < v.mean100.current - 0.5,
    );
    if (regressed.length) assert(r.review.some((t) => t.startsWith('Preserve or independently')));
  }
}
console.log(
  'All34 donor pilots retain exact methods, scan rejections, frame-only limits and independent-component preservation requirements. No production defaults or set approvals are inferred.',
);
