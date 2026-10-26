// Exact source history for the Revised black-symbol paper sampler.
// Historical projection permits reuse; it does not certify current components.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, readdir } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { root, hash } from './common.mjs';
export const REVISED_BLACK_PAPER_RECEIPT =
  '8a3682b156ba7b10e095b3eeb45298429986ed2562e02d73ce91ac0e5c419f5e';
const FILE = 'games/magic/fixtures/accuracy/3ed-recheck/black-paper-source-delta.json.gz';
let checked;
export function revisedBlackPaperDelta() {
  return (checked ??= (async () => {
    const z = await readFile(path.join(root, FILE));
    assert.equal(hash(z), REVISED_BLACK_PAPER_RECEIPT);
    const p = JSON.parse(gunzipSync(z));
    assert.equal(p.status, 'native-revised-black-paper-adoption');
    assert.deepEqual(
      Object.keys(p.files)
        .filter((f) => f.startsWith('games/magic/src/'))
        .sort(),
      [
        'games/magic/src/data/eager.ts',
        'games/magic/src/data/generated-manifest.json',
        'games/magic/src/data/sets/3ed.ts',
        'games/magic/src/presentation/canvas-face.ts',
        'games/magic/src/presentation/historical-mana.ts',
        'games/magic/src/presentation/mana-printing-profiles.ts',
      ],
    );
    for (const e of Object.values(p.files)) {
      assert.equal(hash(e.beforeSource), e.before);
      assert.equal(hash(e.afterSource), e.after);
    }
    assert.equal(p.originals, 306);
    assert.equal(p.nativeVariants, 1224);
    assert.deepEqual(p.counts, {
      original: { changed: 54, unchanged: 252, keysChanged: 54 },
      oracle: { changed: 51, unchanged: 255, keysChanged: 54 },
      'oracle-modern': { changed: 0, unchanged: 306, keysChanged: 0 },
      etching: { changed: 0, unchanged: 306, keysChanged: 0 },
    });
    const a = JSON.parse(p.files['games/magic/src/data/generated-manifest.json'].beforeSource),
      b = JSON.parse(p.files['games/magic/src/data/generated-manifest.json'].afterSource);
    assert.deepEqual(Object.keys(a.files), Object.keys(b.files));
    assert.deepEqual(Object.keys(a.sources), Object.keys(b.sources));
    assert.deepEqual(
      Object.keys(a.sources)
        .filter((f) => a.sources[f] !== b.sources[f])
        .sort(),
      [
        'games/magic/src/presentation/canvas-face.ts',
        'games/magic/src/presentation/historical-mana.ts',
        'games/magic/src/presentation/mana-printing-profiles.ts',
      ],
    );
    return p;
  })());
}
export async function preRevisedBlackPaperSource(file, bytes) {
  const e = (await revisedBlackPaperDelta()).files[file];
  return e && hash(bytes) === e.after ? Buffer.from(e.beforeSource) : bytes;
}
export async function revisedBlackPaperHistoricalHash(
  directory = path.join(root, 'games/magic/src'),
) {
  const files = (await readdir(directory, { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
    .map((e) => path.join(e.parentPath, e.name))
    .sort();
  return hash(
    JSON.stringify(
      await Promise.all(
        files.map(async (f) => [
          path.relative(directory, f),
          hash(await preRevisedBlackPaperSource(path.relative(root, f), await readFile(f))),
        ]),
      ),
    ),
  );
}
export function revisedBlackPaperAffected(set, task, originalInput = false) {
  return (
    !originalInput &&
    set?.toLowerCase() === '3ed' &&
    ['manaGeometry', 'manaColor', 'rules', 'flavor', 'fullCard', 'release'].includes(task)
  );
}
