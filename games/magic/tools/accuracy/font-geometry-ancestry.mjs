// Historical source reconstruction only. All live typography scores need review.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { root, hash, sourceHash } from './common.mjs';
const FILE = 'games/magic/fixtures/accuracy/font-geometry/source-history.json.gz';
const SHA = 'a2bfb8c0a629aaea7f7ece8a2be824457b74b1828fdf7ac18359723f0accb163';
let checked;
export function fontGeometryHistory() {
  return (checked ??= (async () => {
    const bytes = await fs.readFile(path.join(root, FILE));
    assert.equal(hash(bytes), SHA, 'Changed font geometry history');
    const p = JSON.parse(gunzipSync(bytes));
    assert.equal(p.kind, 'explicit-font-geometry-visible-change');
    assert.equal(p.baseline, '74115a9bdff123f1e815db9b6cf029c7a8a677e6');
    assert.equal(p.scoreReuse, false);
    for (const [file, e] of Object.entries(p.files)) {
      assert(
        file === 'games/magic/fonts.css' ||
          file.startsWith('games/magic/src/presentation/') ||
          file.startsWith('games/magic/src/data/') ||
          file.startsWith('games/magic/tools/accuracy/'),
      );
      assert.match(e.after, /^[a-f0-9]{64}$/);
      if (e.beforeSource !== null) assert.equal(hash(e.beforeSource), e.before);
    }
    return p;
  })());
}
/** Reverse these exact bytes only; foreign edits retain their actual identity. */
export async function preFontGeometrySource(file, bytes) {
  const e = (await fontGeometryHistory()).files[file];
  if (!e || e.beforeSource === null || hash(bytes) !== e.after) return bytes;
  return Buffer.from(e.beforeSource);
}
/** Omit only exact additions from historical trees, never current score hashes. */
export async function fontGeometryHistoricalFiles(files) {
  const p = await fontGeometryHistory(),
    kept = [];
  for (const file of files) {
    const key = file.startsWith('games/') ? file : path.relative(root, file);
    const e = p.files[key];
    if (e?.beforeSource === null && hash(await fs.readFile(path.join(root, key))) === e.after)
      continue;
    kept.push(file);
  }
  return kept;
}

/** Evidence reconstruction has a separate identity from the current renderer. */
export async function fontGeometryHistoricalHash(directory) {
  const files = (await fs.readdir(directory, { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
    .map((e) => path.join(e.parentPath, e.name))
    .sort();
  return hash(
    JSON.stringify(
      await Promise.all(
        (await fontGeometryHistoricalFiles(files)).map(async (file) => [
          path.relative(directory, file),
          hash(await preFontGeometrySource(path.relative(root, file), await fs.readFile(file))),
        ]),
      ),
    ),
  );
}
/** Unknown edits must also reject old score reuse, rather than disappear into history. */
export async function fontGeometryRequiresReview() {
  try {
    await fs.access(path.join(root, 'games/magic/src/presentation/font-geometry.ts'));
    return true;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return false;
  }
}

/** Non-text regions and original source wording have independent evidence. */
export function fontGeometryTaskAffected(task, original = false) {
  return (
    !original &&
    [
      'manaGeometry',
      'manaColor',
      'headings',
      'rules',
      'flavor',
      'artist',
      'footer',
      'stats',
      'specialComponents',
      'fullCard',
      'release',
    ].includes(task)
  );
}

let regionalParent;
export async function fontGeometryRegionalParent(actual, task, original = false) {
  if (fontGeometryTaskAffected(task, original)) return actual;
  regionalParent ??= (async () => {
    const directory = path.join(root, 'games/magic/src');
    const current = await sourceHash(directory);
    const before = await fontGeometryHistoricalHash(directory);
    // Independently measured from the archived 0.7.9 tree. Foreign files/edits
    // survive projection and must never receive this regional-only reuse.
    return before === '24c7c50b47c4dbb2de59be6b617a80be9d7567982eb1bdd9650e34d861312c44'
      ? { current, before }
      : null;
  })();
  const match = await regionalParent;
  return match && match.current === actual ? match.before : actual;
}
