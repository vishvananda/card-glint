import { preArnProfileSource, arnHistoricalSourceFiles } from './arn-profile-ancestry.mjs';
// PR #11 only changes validation of an explicit, previously rejected profile.
// Project these exact reviewed bytes for historical audits; never relax a painter guard.
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { root, hash } from './common.mjs';
const RECEIPT = '154016934d90305438adb151b49c95a00d26f3f3dcf626c18c96b70703d2ca70';
let checked, runtimeChecked;
export async function printingProfileGuardDelta() {
  return (checked ??= (async () => {
    const bytes = await readFile(
      path.join(root, 'games/magic/fixtures/accuracy/printing-profile-guard-072.json.gz'),
    );
    assert.equal(hash(bytes), RECEIPT, 'Changed printing profile guard receipt');
    const p = JSON.parse(gunzipSync(bytes));
    assert.equal(p.schema, 1);
    assert.equal(p.kind, 'named-eighth-profile-guard');
    assert.deepEqual(Object.keys(p.files).sort(), [
      'games/magic/src/data/generated-manifest.json',
      'games/magic/src/presentation/printing-presets.ts',
      'games/magic/src/presentation/printing-style-schema.ts',
      'games/magic/tools/accuracy/abu-flow-ancestry.mjs',
      'games/magic/tools/accuracy/calibration-report.mjs',
    ]);
    for (const entry of Object.values(p.files)) {
      assert.equal(hash(entry.beforeSource), entry.before);
      assert.match(entry.after, /^[a-f0-9]{64}$/);
    }
    return p;
  })());
}
export async function prePrintingProfileGuardSource(file, bytes) {
  bytes = await preArnProfileSource(file, bytes);
  const p = await printingProfileGuardDelta(),
    entry = p.files[file];
  if (!entry) return bytes;
  const digest = hash(bytes);
  if (digest === entry.before) return bytes;
  // Other historical bytes retain their identity for the next ancestry guard.
  if (digest !== entry.after) return bytes;
  return Buffer.from(entry.beforeSource);
}
/** Entire projected tree still has to match. Added modules and unrelated edits invalidate it. */
export async function printingProfileGuardHistoricalHash(
  directory = path.join(root, 'games/magic/src'),
) {
  const files = (await readdir(directory, { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
    .map((e) => path.join(e.parentPath, e.name))
    .sort();
  return hash(
    JSON.stringify(
      await Promise.all(
        (await arnHistoricalSourceFiles(files)).map(async (file) => [
          path.relative(directory, file),
          hash(
            await prePrintingProfileGuardSource(path.relative(root, file), await readFile(file)),
          ),
        ]),
      ),
    ),
  );
}
/** Ledger entries describe successful implicit/default renders, not the newly accepted choices. */
export async function printingProfileGuardRuntimeCompatible(directory, expected) {
  if (directory !== 'games/magic/src') return false;
  const p = await printingProfileGuardDelta();
  if (expected !== p.beforeRenderer) return false;
  return (await (runtimeChecked ??= printingProfileGuardHistoricalHash())) === expected;
}
