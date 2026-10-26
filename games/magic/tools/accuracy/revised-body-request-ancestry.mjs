import { preRevisedFooterSource } from './revised-footer-ancestry.mjs';
// Exact metadata-only closure of the Revised fractional layout.
// The native census proves that this does not create a new rendered revision.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, readdir } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { root, hash } from './common.mjs';
export const REVISED_REQUEST_RECEIPT =
  'eb5a722ff35bc0fb12afd6829ad604c553dc3229656c2ba154a4edd21abc8846';
const FILE = 'games/magic/fixtures/accuracy/3ed-recheck/body-request-source-delta.json.gz';
let checked;
export function revisedRequestDelta() {
  return (checked ??= (async () => {
    const z = await readFile(path.join(root, FILE));
    assert.equal(hash(z), REVISED_REQUEST_RECEIPT);
    const p = JSON.parse(gunzipSync(z));
    assert.equal(p.status, 'native-revised-layout-request-metadata-closure');
    assert.deepEqual(Object.keys(p.files).sort(), [
      'games/magic/src/data/generated-manifest.json',
      'games/magic/src/presentation/retro-rules.ts',
    ]);
    for (const e of Object.values(p.files)) {
      assert.equal(hash(e.beforeSource), e.before);
      assert.equal(hash(e.afterSource), e.after);
    }
    const rules = p.files['games/magic/src/presentation/retro-rules.ts'];
    assert.equal(
      rules.beforeSource.replace(
        'return fractionalEarlyRules(context, result, 1, { textWidth, right: 424 });',
        'return withRulesLayoutRequests(context, () =>\n    fractionalEarlyRules(context, result, 1, { textWidth, right: 424 }),\n  );',
      ),
      rules.afterSource,
      'Only request tracing may change',
    );
    const load = async (ref) => {
      const raw = await readFile(path.join(root, ref.file));
      assert.equal(hash(raw), ref.sha256);
      const bytes = gunzipSync(raw);
      assert.equal(hash(bytes), ref.contentSha256);
      return JSON.parse(bytes);
    };
    const before = await load(p.beforeNative),
      after = await load(p.afterNative);
    assert.equal(before.source.rendererHash, p.beforeRenderer);
    assert.equal(after.rendererHash, p.afterRenderer);
    assert.equal(before.source.inputHash, after.inputHash);
    assert.equal(after.status, 'complete');
    assert.deepEqual(after.faults, []);
    assert.equal(after.rows.length, 306);
    assert.equal(before.rows.length, 306);
    assert.equal(new Set(after.rows.map((r) => r.id)).size, 306);
    for (const r of after.rows) {
      const old = before.rows.find((v) => v.id === r.id);
      assert(old);
      assert.equal(r.referenceHash, old.referenceHash);
      const a = old.modes.original,
        b = r.modes.original;
      assert.equal(a.sha256, b.sha256);
      assert.equal(a.inputHash, b.inputHash);
      assert.deepEqual(a.layout, b.layout);
    }
    const a = JSON.parse(p.files['games/magic/src/data/generated-manifest.json'].beforeSource),
      b = JSON.parse(p.files['games/magic/src/data/generated-manifest.json'].afterSource);
    assert.deepEqual(a.files, b.files);
    assert.deepEqual(Object.keys(a.sources), Object.keys(b.sources));
    assert.deepEqual(
      Object.keys(a.sources).filter((f) => a.sources[f] !== b.sources[f]),
      ['games/magic/src/presentation/retro-rules.ts'],
    );
    return p;
  })());
}
export async function preRevisedRequestSource(file, bytes) {
  bytes = await preRevisedFooterSource(file, bytes);
  const e = (await revisedRequestDelta()).files[file];
  return e && hash(bytes) === e.after ? Buffer.from(e.beforeSource) : bytes;
}
export async function revisedRequestHistoricalHash(directory = path.join(root, 'games/magic/src')) {
  const files = (await readdir(directory, { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
    .map((e) => path.join(e.parentPath, e.name))
    .sort();
  return hash(
    JSON.stringify(
      await Promise.all(
        files.map(async (f) => [
          path.relative(directory, f),
          hash(await preRevisedRequestSource(path.relative(root, f), await readFile(f))),
        ]),
      ),
    ),
  );
}
