import { preFourthNonbasicSource } from './fourth-nonbasic-ancestry.mjs';
// Exact data history is separate from any component or complete-set approval.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { root, hash } from './common.mjs';
import { validateFourthBasicBodyData } from './fourth-basic-body-data-check.mjs';
const FILE = 'games/magic/fixtures/accuracy/4ed/basic-body-source-delta.json.gz';
const RECEIPT = '0659d134ad2c5b2aac22bb2a4914cefc504b5ee1242c96f5f2525fb84a130867';
let checked;
export function fourthBasicBodyDelta() {
  return (checked ??= (async () => {
    const z = await fs.readFile(path.join(root, FILE));
    assert.equal(hash(z), RECEIPT);
    const p = JSON.parse(gunzipSync(z));
    assert.deepEqual(validateFourthBasicBodyData(p), p.summary);
    const nz = await fs.readFile(path.join(root, p.native.file));
    assert.equal(hash(nz), p.native.sha256);
    const raw = gunzipSync(nz);
    assert.equal(hash(raw), p.native.contentSha256);
    const n = JSON.parse(raw);
    assert.equal(n.status, 'complete-native-fourth-basic-body-isolation');
    assert.equal(n.beforeRenderer, p.beforeRenderer);
    assert.equal(n.afterRenderer, p.afterRenderer);
    assert.equal(n.originals, 378);
    assert.equal(n.nativeVariants, 1512);
    assert.deepEqual(n.ids, p.ids);
    assert.equal(n.rows.length, 378);
    assert.equal(new Set(n.rows.map((r) => r.id)).size, 378);
    assert.equal(n.counts.original.changed, 15);
    assert.equal(n.counts.oracle.changed, 0);
    assert.equal(n.counts['oracle-modern'].changed, 0);
    for (const r of n.rows)
      for (const [mode, v] of Object.entries(r.modes)) {
        assert.equal(v.outside, 0);
        assert.equal(v.alpha, 0);
        if (v.before !== v.after) assert(r.basic && (mode === 'original' || mode === 'etching'));
        if (r.basic && mode === 'original') assert.equal(v.prototypeHash, v.after);
      }
    return p;
  })());
}
export async function preFourthBasicBodySource(file, bytes) {
  bytes = await preFourthNonbasicSource(file, bytes);
  const e = (await fourthBasicBodyDelta()).files[file];
  return e && hash(bytes) === e.after ? Buffer.from(e.beforeSource) : bytes;
}
export async function fourthBasicBodyAffected(set, task, original = false, group) {
  if (set?.toLowerCase() !== '4ed' || original || !['rules', 'fullCard', 'release'].includes(task))
    return false;
  const p = await fourthBasicBodyDelta();
  return !Array.isArray(group?.printingIds) || p.ids.some((id) => group.printingIds.includes(id));
}

export async function fourthBasicBodyHistoricalHash(
  directory = path.join(root, 'games/magic/src'),
) {
  const files = (await fs.readdir(directory, { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
    .map((e) => path.join(e.parentPath, e.name))
    .sort();
  return hash(
    JSON.stringify(
      await Promise.all(
        files.map(async (f) => [
          path.relative(directory, f),
          hash(await preFourthBasicBodySource(path.relative(root, f), await fs.readFile(f))),
        ]),
      ),
    ),
  );
}
