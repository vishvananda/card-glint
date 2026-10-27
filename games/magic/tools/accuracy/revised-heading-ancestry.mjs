// Exact source history for the Revised heading font, ink and shared geometry.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, readdir } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { root, hash } from './common.mjs';
export const REVISED_HEADING_RECEIPT =
  'c33375ec0f000cae58ab6366ee601a99ddb6b6d1fa7a2054e96e4ec69b79a321';
const FILE = 'games/magic/fixtures/accuracy/3ed-recheck/heading-source-delta.json.gz';
let checked;
export function revisedHeadingDelta() {
  return (checked ??= (async () => {
    const z = await readFile(path.join(root, FILE));
    assert.equal(hash(z), REVISED_HEADING_RECEIPT);
    const p = JSON.parse(gunzipSync(z));
    assert.equal(p.status, 'native-revised-heading-adoption');
    assert.deepEqual(Object.keys(p.files).sort(), [
      'games/magic/src/data/generated-manifest.json',
      'games/magic/src/presentation/canvas-face.ts',
      'games/magic/src/presentation/canvas-fonts.ts',
      'games/magic/src/presentation/retro-paint.ts',
      'games/magic/src/presentation/revised-lettering.ts',
      'games/magic/tools/accuracy/calibration-report.mjs',
    ]);
    for (const e of Object.values(p.files)) {
      assert.equal(hash(e.beforeSource), e.before);
      assert.equal(hash(e.afterSource), e.after);
    }
    assert.equal(p.originals, 306);
    assert.equal(p.nativeVariants, 1224);
    for (const mode of ['original', 'oracle', 'oracle-modern'])
      assert.deepEqual(p.counts[mode], { changed: 281, unchanged: 25, keysChanged: 281 });
    assert.deepEqual(p.counts.etching, { changed: 0, unchanged: 306, keysChanged: 0 });
    return p;
  })());
}
export async function preRevisedHeadingSource(file, bytes) {
  const e = (await revisedHeadingDelta()).files[file];
  return e && hash(bytes) === e.after ? Buffer.from(e.beforeSource) : bytes;
}
export async function revisedHeadingHistoricalHash(directory = path.join(root, 'games/magic/src')) {
  const files = (await readdir(directory, { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
    .map((e) => path.join(e.parentPath, e.name))
    .sort();
  return hash(
    JSON.stringify(
      await Promise.all(
        files.map(async (f) => [
          path.relative(directory, f),
          hash(await preRevisedHeadingSource(path.relative(root, f), await readFile(f))),
        ]),
      ),
    ),
  );
}
export function revisedHeadingAffected(set, task, originalInput = false, group) {
  return (
    !originalInput &&
    set?.toLowerCase() === '3ed' &&
    ['headings', 'fullCard', 'release'].includes(task) &&
    !['land', 'basic-land'].includes(group?.kind)
  );
}
