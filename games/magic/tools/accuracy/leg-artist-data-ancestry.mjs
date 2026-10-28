import { oldFrameHistoricalSourceFiles } from './old-frame-source-ancestry.mjs';
import { preFourthBasicBodySource } from './fourth-basic-body-ancestry.mjs';
// Exact inert credit-data projection;this is not typography or set approval.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { root, hash } from './common.mjs';
import { validateLegArtistDataDelta } from './leg-artist-data-check.mjs';
const FILE = 'games/magic/fixtures/accuracy/leg/artist-data-source-delta.json.gz';
const RECEIPT = '151fd9a505c84ab5602e51500f6c4aef1930ee613514687b1aa588631b082987';
let checked;
export function legArtistDelta() {
  return (checked ??= (async () => {
    const z = await fs.readFile(path.join(root, FILE));
    assert.equal(hash(z), RECEIPT);
    const p = JSON.parse(gunzipSync(z));
    assert.deepEqual(validateLegArtistDataDelta(p), p.summary);
    const nz = await fs.readFile(path.join(root, p.native.file));
    assert.equal(hash(nz), p.native.sha256);
    const nb = gunzipSync(nz);
    assert.equal(hash(nb), p.native.contentSha256);
    const n = JSON.parse(nb);
    assert.equal(n.status, 'complete-native-physical-artist-isolation');
    assert.equal(n.beforeRenderer, p.beforeRenderer);
    assert.equal(n.afterRenderer, p.afterRenderer);
    assert.equal(n.originals, 310);
    assert.equal(n.nativeVariants, 1240);
    assert.equal(n.changedArtists, 40);
    for (const mode of ['original', 'oracle', 'oracle-modern'])
      assert.deepEqual(n.counts[mode], { changed: 40, unchanged: 270, keysChanged: 40 });
    assert.deepEqual(n.counts.etching, { changed: 0, unchanged: 310, keysChanged: 0 });
    for (const r of n.rows)
      for (const v of Object.values(r.modes)) {
        assert.equal(v.alpha, 0);
        assert.equal(v.outside, 0);
      }
    return p;
  })());
}
export async function preLegArtistDataSource(file, bytes) {
  bytes = await preFourthBasicBodySource(file, bytes);
  const e = (await legArtistDelta()).files[file];
  return e && hash(bytes) === e.after ? Buffer.from(e.beforeSource) : bytes;
}
export async function legArtistHistoricalHash(directory = path.join(root, 'games/magic/src')) {
  const files = (await fs.readdir(directory, { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
    .map((e) => path.join(e.parentPath, e.name))
    .sort();
  return hash(
    JSON.stringify(
      await Promise.all(
        (await oldFrameHistoricalSourceFiles(files)).map(async (f) => [
          path.relative(directory, f),
          hash(await preLegArtistDataSource(path.relative(root, f), await fs.readFile(f))),
        ]),
      ),
    ),
  );
}
export async function legArtistAffected(set, task, _original = false, group) {
  if (set?.toLowerCase() !== 'leg' || !['artist', 'fullCard', 'release'].includes(task))
    return false;
  const p = await legArtistDelta();
  return !Array.isArray(group?.printingIds) || p.ids.some((id) => group.printingIds.includes(id));
}
