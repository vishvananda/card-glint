import { arnHistoricalSourceFiles } from './arn-profile-ancestry.mjs';
import { preAbuPerimeterSource } from './abu-perimeter-ancestry.mjs';
// Exact pure-data history, independent of calibration approval.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, readdir } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { root, hash } from './common.mjs';
import { validatePrintingArtistDelta } from './printing-artist-data-check.mjs';
const RECEIPT = '333e24f55e128f20b61bf572a9284e2d62497a6a34e2e1a4ffe111ce319580a4';
const FILE =
  'games/magic/fixtures/accuracy/early-through-fourth/printing-artist-data-delta.json.gz';
let checked;
export async function printingArtistDelta() {
  return (checked ??= (async () => {
    const bytes = await readFile(path.join(root, FILE));
    assert.equal(hash(bytes), RECEIPT, 'Changed artist data receipt');
    const p = JSON.parse(gunzipSync(bytes)),
      after = {};
    for (const f of Object.keys(p.files))
      after[f] = (await preAbuPerimeterSource(f, await readFile(path.join(root, f)))).toString();
    assert.deepEqual(validatePrintingArtistDelta(p, after), p.summary);
    const zip = await readFile(path.join(root, p.native.file));
    assert.equal(hash(zip), p.native.sha256);
    const raw = gunzipSync(zip);
    assert.equal(hash(raw), p.native.contentSha256);
    const n = JSON.parse(raw);
    assert.equal(n.id, p.id);
    assert.equal(n.referenceHash, p.referenceHash);
    assert.equal(n.beforeRenderer, p.beforeRenderer);
    assert.equal(n.afterRenderer, p.afterRenderer);
    assert.deepEqual(n.faults, []);
    assert.equal(n.comparisons.length, 6);
    for (const r of n.comparisons) {
      assert.equal(r.outside, 0);
      assert.equal(r.alpha, 0);
      if (r.layer === 'face') assert(r.changed > 0);
    }
    for (const d of n.definitions)
      assert.equal(d.artist, d.version === 'after' ? p.artist : p.previousArtist);
    const parentBytes = await readFile(
      path.join(
        root,
        'games/magic/fixtures/accuracy/early-through-fourth/abu-fractional-source-proof.json',
      ),
    );
    assert.equal(
      hash(parentBytes),
      '469f60094fbbcf5571dae480b829c546986d5f50ba071270847c6960eb5e1355',
    );
    const parent = JSON.parse(parentBytes),
      priorZip = await readFile(path.join(root, parent.evidence.native.file));
    assert.equal(hash(priorZip), parent.evidence.native.sha256);
    const prior = JSON.parse(gunzipSync(priorZip)).rows.find((r) => r.id === p.id);
    assert.equal(
      n.rows.find((r) => r.version === 'before' && r.mode === 'original' && r.layer === 'face')
        .sha256,
      prior.afterFaceHash,
    );
    for (const [f, digest] of Object.entries(p.sharedAssets))
      assert.equal(hash(await readFile(path.join(root, f))), digest);
    return p;
  })());
}
export async function prePrintingArtistData(file, bytes) {
  bytes = await preAbuPerimeterSource(file, bytes);
  const p = await printingArtistDelta(),
    entry = p.files[file];
  if (!entry) return bytes;
  const digest = hash(bytes);
  if (digest === entry.before) return bytes;
  assert.equal(digest, entry.after, 'Unreviewed printing artist data: ' + file);
  return Buffer.from(entry.beforeSource);
}
export async function printingArtistHistoricalHash(directory = path.join(root, 'games/magic/src')) {
  const files = (await readdir(directory, { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
    .map((e) => path.join(e.parentPath, e.name))
    .sort();
  return hash(
    JSON.stringify(
      await Promise.all(
        (await arnHistoricalSourceFiles(files)).map(async (file) => [
          path.relative(directory, file),
          hash(await prePrintingArtistData(path.relative(root, file), await readFile(file))),
        ]),
      ),
    ),
  );
}
export async function printingArtistAffected(set, task, original = false, group) {
  if (original || set?.toLowerCase() !== 'lea' || !['artist', 'fullCard', 'release'].includes(task))
    return false;
  return !group || group.printingIds?.includes((await printingArtistDelta()).id) === true;
}
