import { preAbuArtSource } from './abu-art-ancestry.mjs';
import { abuPaperAffected } from './abu-paper-ancestry.mjs';
import { abuRasterAffected } from './abu-raster-ancestry.mjs';
import { abuPerimeterAffected } from './abu-perimeter-ancestry.mjs';
import {
  prePrintingArtistData,
  printingArtistHistoricalHash,
  printingArtistAffected,
} from './printing-artist-data-ancestry.mjs';
// Historical source reconstruction only; changed ABU rules never reuse old fits.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash, root } from './common.mjs';
const RECEIPT = '469f60094fbbcf5571dae480b829c546986d5f50ba071270847c6960eb5e1355';
let checked;
let runtimeChecked;
export async function abuFractionalAncestry() {
  return (checked ??= (async () => {
    const bytes = await readFile(
      path.join(
        root,
        'games/magic/fixtures/accuracy/early-through-fourth/abu-fractional-source-proof.json',
      ),
    );
    assert.equal(hash(bytes), RECEIPT, 'Changed ABU fractional source receipt');
    const p = JSON.parse(bytes);
    assert.deepEqual(p.affectedSets, ['lea', 'leb', '2ed']);
    for (const [file, e] of Object.entries(p.files))
      assert.equal(
        hash(await preAbuArtSource(file, await readFile(path.join(root, file)))),
        e.after,
        'Unreviewed ABU fractional source: ' + file,
      );
    for (const [name, ref] of Object.entries(p.evidence)) {
      const compressed = await readFile(path.join(root, ref.file));
      assert.equal(hash(compressed), ref.sha256);
      const raw = gunzipSync(compressed);
      assert.equal(hash(raw), ref.contentSha256);
      const data = JSON.parse(raw);
      if (name === 'native') {
        assert.equal(data.completed, 899);
        assert.equal(data.denominator, 899);
        assert.equal(data.rows.length, 899);
        assert.equal(new Set(data.rows.map((r) => r.id)).size, 899);
        assert.deepEqual(data.faults, []);
        assert.equal(data.source.beforeRenderer, p.beforeRenderer);
        assert.equal(data.source.afterRenderer, p.capturedRenderer);
        for (const r of data.rows) {
          assert(r.sourceBound && !r.prototypeMatch);
          assert(r.afterLayout.lines.length <= r.beforeLayout.lines.length);
          assert.equal(r.outside, 0);
          assert.equal(r.alpha, 0);
          assert.equal(r.keys.length, 4);
          for (const k of r.keys)
            assert.equal(k.changed, k.wordingMode === 'original' && k.layer === 'face');
        }
      } else if (name === 'metadata') {
        assert.equal(data.status, 'verified-generated-metadata-only');
        assert.equal(data.capturedRenderer, p.capturedRenderer);
        assert.equal(data.currentRenderer, p.afterRenderer);
        assert.equal(
          hash(
            await prePrintingArtistData(
              data.manifest.file,
              await readFile(path.join(root, data.manifest.file)),
            ),
          ),
          data.manifest.afterSha256,
        );
        assert(data.manifest.generatedDataUnchanged && data.manifest.runtimeImports === 0);
      } else if (name === 'unaffected') {
        assert.deepEqual(data.faults, []);
        assert.equal(data.source.beforeRenderer, p.beforeRenderer);
        assert.equal(data.source.afterRenderer, p.capturedRenderer);
        assert(data.cases.length >= 200);
        assert.equal(data.rows.length, data.cases.length * 6);
        for (const r of data.rows)
          assert.deepEqual(r.before, r.after, 'Changed unrelated native layout');
      }
    }
    const tool = await readFile(path.join(root, p.nativeTool.file));
    assert.equal(hash(tool), p.nativeTool.sha256);
    assert.equal(hash(gunzipSync(tool)), p.nativeTool.contentSha256);
    return p;
  })());
}
export async function preAbuFractionalSource(file, bytes) {
  bytes = await prePrintingArtistData(file, bytes);
  const p = await abuFractionalAncestry(),
    e = p.files[file];
  if (!e) return bytes;
  const digest = hash(bytes);
  if (digest === e.before || e.historicalHashes.includes(digest)) return bytes;
  assert.equal(digest, e.after, 'Unreviewed ABU fractional source: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) ?? [];
  for (const edit of e.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(hash(before), e.before);
  return before;
}
export function abuFractionalAffected(set, task, original = false) {
  return (
    !original &&
    ['lea', 'leb', '2ed'].includes(set?.toLowerCase()) &&
    ['rules', 'flavor', 'fullCard', 'release'].includes(task)
  );
}
export async function abuFractionalRuntimeCompatible(
  directory,
  expected,
  set,
  task,
  original = false,
  group,
) {
  if (directory !== 'games/magic/src') return false;
  const p = await abuFractionalAncestry();
  if (![p.beforeRenderer, p.afterRenderer].includes(expected)) return false;
  if (expected === p.beforeRenderer && abuFractionalAffected(set, task, original)) return false;
  if (await printingArtistAffected(set, task, original, group)) return false;
  if (await abuPerimeterAffected(set, task, original, group)) return false;
  if (await abuRasterAffected(set, task, original, group)) return false;
  if (await abuPaperAffected(set, task, original, group)) return false;
  return (
    (await (runtimeChecked ??= printingArtistHistoricalHash(path.join(root, directory)))) ===
    p.afterRenderer
  );
}
