// Bind isolated copyright trials and the final native ink correction, without image pixels.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { root, hash, sourceHash } from './common.mjs';
const [study, out] = process.argv.slice(2);
assert(out, 'Use STUDY_DIRECTORY NEW_ARCHIVE');
const read = async (f) => JSON.parse(await fs.readFile(path.join(study, f)));
const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
const sets = {};
for (const code of ['mir', 'ons']) {
  const before = await read(code + '-legal-audit-075.json');
  const final = await read(code + '-legal-final-075.json');
  const native = await read(code + '-installed-native-v4/capture.json');
  assert.equal(final.source.rendererHash, rendererHash);
  assert.equal(native.source.rendererHash, rendererHash);
  assert.equal(
    final.source.nativeHash,
    hash(await fs.readFile(path.join(study, code + '-installed-native-v4/capture.json'))),
  );
  const ids = new Set(final.rows.map((r) => r.id));
  assert.equal(ids.size, final.rows.length);
  assert(
    final.rows.some((r) => r.material === 'L'),
    'Land footer was not checked',
  );
  const current = (r) => r.roles.legal.trials.find((t) => t.id === 'current').score;
  const mean = (rows, id) =>
    rows.reduce((s, r) => s + r.roles.legal.trials.find((t) => t.id === id).score, 0) / rows.length;
  const cohort = {};
  for (const name of ['calibration', 'validation']) {
    const rows = final.rows.filter((r) => r.cohort === name);
    assert(rows.length >= 7);
    const ranked = final.rows[0].roles.legal.trials
      .map((t) => ({ id: t.id, score: mean(rows, t.id) }))
      .sort((a, b) => b.score - a.score);
    cohort[name] = { count: rows.length, current: mean(rows, 'current'), best: ranked[0] };
  }
  for (const trial of final.rows[0].roles.legal.trials) {
    const cal = mean(
      final.rows.filter((r) => r.cohort === 'calibration'),
      trial.id,
    );
    const val = mean(
      final.rows.filter((r) => r.cohort === 'validation'),
      trial.id,
    );
    assert(
      !(cal > cohort.calibration.current + 0.002 && val > cohort.validation.current + 0.002),
      'A shared copyright candidate improves both cohorts and needs review',
    );
  }
  const amendments = native.rows.filter((r) => r.footerRevision);
  for (const r of amendments) {
    assert.equal(code, 'mir');
    assert.equal(r.key, 'M');
    assert.equal(r.footerRevision.kind, 'mir-gold-light-copyright');
    assert(r.footerRevision.changedPixels > 0);
    const [l, t, rr, b] = r.footerRevision.bounds;
    assert(l >= 70 && rr < 665 && t >= 946 && b < 979);
  }
  assert.equal(
    amendments.length,
    code === 'mir'
      ? await read('mir-inputs-reviewed-artist-v1.json').then(
          (i) => i.entries.filter((e) => e.material === 'M').length,
        )
      : 0,
  );
  const gold = final.rows.filter((r) => r.material === 'M');
  if (code === 'mir') {
    assert.equal(gold.length, 2);
    for (const r of gold) {
      const old = before.rows.find((p) => p.id === r.id);
      assert(old);
      assert(current(r) > current(old) + 0.2);
    }
  }
  sets[code] = {
    before,
    final,
    cohort,
    nativeCaptureHash: hash(
      await fs.readFile(path.join(study, code + '-installed-native-v4/capture.json')),
    ),
    amendments: amendments.map((r) => ({
      id: r.id,
      name: r.name,
      nativeHash: r.sha256,
      ...r.footerRevision,
    })),
  };
  console.log(code, JSON.stringify(cohort), 'copyright amendments', amendments.length);
}
const methods = {};
for (const name of [
  'old-frame-footer-review.mjs',
  'old-frame-heading-study.mjs',
  'old-frame-installed-capture.mjs',
]) {
  const f = 'games/magic/tools/accuracy/' + name,
    source = await fs.readFile(path.join(root, f), 'utf8');
  methods[f] = { sha256: hash(source), source };
}
const p = {
  schema: 1,
  status: 'native-footer-audit',
  rendererHash,
  methods,
  sets,
  scope:
    'Copyright geometry trials use fixed original inputs and frame-only scan poses. Retain shared geometry: no candidate materially improves both cohorts. Mirage gold copyright ink is light in both scan examples; the complete native census confines all changes to that copyright strip. All other native pixels remain exact. Trials reuse development scans; they are not published whole-card scores.',
};
const bytes = gzipSync(JSON.stringify(p) + '\n', { level: 9, mtime: 0 });
await fs.writeFile(out, bytes, { flag: 'wx' });
console.log('Footer review', hash(bytes), bytes.length);
