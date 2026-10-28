import { oldFrameHistoricalSourceFiles } from './old-frame-source-ancestry.mjs';
// Authenticate exact source history only. This does not certify a whole footer.
import { preRevisedBlackPaperSource } from './revised-black-paper-ancestry.mjs';
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, readdir } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { root, hash } from './common.mjs';
export const REVISED_FOOTER_RECEIPT =
  '7fed141f3b5c05bc6b3429f39cbdc2bf1cc3f3715ba47c7eef9b8a3423a2e7aa';
const FILE = 'games/magic/fixtures/accuracy/3ed-recheck/footer-source-delta.json.gz';
let checked;
export function revisedFooterDelta() {
  return (checked ??= (async () => {
    const z = await readFile(path.join(root, FILE));
    assert.equal(hash(z), REVISED_FOOTER_RECEIPT);
    const p = JSON.parse(gunzipSync(z));
    assert.equal(p.status, 'native-revised-footer-geometry-adoption');
    assert.deepEqual(
      Object.keys(p.files)
        .filter((f) => f.startsWith('games/magic/src/'))
        .sort(),
      [
        'games/magic/src/data/generated-manifest.json',
        'games/magic/src/presentation/canvas-face.ts',
        'games/magic/src/presentation/revised-lettering.ts',
      ],
    );
    for (const e of Object.values(p.files)) {
      assert.equal(hash(e.beforeSource), e.before);
      assert.equal(hash(e.afterSource), e.after);
    }
    assert.equal(p.originals, 306);
    assert.equal(p.nativeVariants, 1224);
    assert.deepEqual(p.counts, { changed: 843, unchanged: 381 });
    assert.equal(p.acceptedRegionalCards, 223);
    const a = JSON.parse(p.files['games/magic/src/data/generated-manifest.json'].beforeSource),
      b = JSON.parse(p.files['games/magic/src/data/generated-manifest.json'].afterSource);
    assert.deepEqual(a.files, b.files);
    assert.deepEqual(Object.keys(a.sources), Object.keys(b.sources));
    assert.deepEqual(
      Object.keys(a.sources)
        .filter((f) => a.sources[f] !== b.sources[f])
        .sort(),
      [
        'games/magic/src/presentation/canvas-face.ts',
        'games/magic/src/presentation/revised-lettering.ts',
      ],
    );
    return p;
  })());
}
export async function preRevisedFooterSource(file, bytes) {
  bytes = await preRevisedBlackPaperSource(file, bytes);
  const e = (await revisedFooterDelta()).files[file];
  return e && hash(bytes) === e.after ? Buffer.from(e.beforeSource) : bytes;
}
export async function revisedFooterHistoricalHash(directory = path.join(root, 'games/magic/src')) {
  const files = (await readdir(directory, { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
    .map((e) => path.join(e.parentPath, e.name))
    .sort();
  return hash(
    JSON.stringify(
      await Promise.all(
        (await oldFrameHistoricalSourceFiles(files)).map(async (f) => [
          path.relative(directory, f),
          hash(await preRevisedFooterSource(path.relative(root, f), await readFile(f))),
        ]),
      ),
    ),
  );
}
export function revisedFooterAffected(set, task, originalInput = false, group = {}) {
  if (originalInput || set?.toLowerCase() !== '3ed') return false;
  if (['land', 'basic-land'].includes(group.kind)) return false;
  if (task === 'stats' && group.applicable?.stats === false) return false;
  return ['artist', 'footer', 'stats', 'fullCard', 'release'].includes(task);
}
