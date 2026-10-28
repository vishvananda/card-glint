import { oldFrameHistoricalSourceFiles } from './old-frame-source-ancestry.mjs';
import { preFourthFlavorSource } from './fourth-flavor-ancestry.mjs';
// Exact source projection for an inherited Ice Age default, not set validation.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { hash, root } from './common.mjs';
let checked;
export function iceDefaultsDelta() {
  return (checked ??= (async () => {
    const bytes = await fs.readFile(
      path.join(
        root,
        'games/magic/fixtures/accuracy/old-frame-defaults/ice-inheritance-source-delta.json.gz',
      ),
    );
    assert.equal(hash(bytes), '21d521a01fa911384b78e63a404f0f9055b0cf59e1cffc7e1332edfe5ee728a9');
    const p = JSON.parse(gunzipSync(bytes));
    assert.equal(p.status, 'ice-inherited-fourth-source');
    assert.equal(
      p.beforeRenderer,
      '2b78eb485524707dbbf7ffa1c2a64b6d687e48a38c4d423ae41380326b4997f5',
    );
    assert.deepEqual(Object.keys(p.files).sort(), [
      'games/magic/src/calibration/selection.ts',
      'games/magic/src/data/generated-manifest.json',
      'games/magic/src/data/load.ts',
      'games/magic/src/presentation/early-reprint-mana.ts',
      'games/magic/src/presentation/printing-calibration.ts',
      'games/magic/src/presentation/retro-details.ts',
    ]);
    for (const r of Object.values(p.files)) {
      assert.equal(hash(r.beforeSource), r.before);
      assert.equal(hash(r.afterSource), r.after);
    }
    const m = p.files['games/magic/src/data/generated-manifest.json'];
    assert.deepEqual(JSON.parse(m.beforeSource).files, JSON.parse(m.afterSource).files);
    return p;
  })());
}
export async function preIceDefaultsSource(file, bytes) {
  bytes = await preFourthFlavorSource(file, bytes);
  const r = (await iceDefaultsDelta()).files[file];
  return r && hash(bytes) === r.after ? Buffer.from(r.beforeSource) : bytes;
}
export async function iceDefaultsHistoricalHash(directory = path.join(root, 'games/magic/src')) {
  const files = (await fs.readdir(directory, { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(ts|mjs|css|json)$/.test(e.name))
    .map((e) => path.join(e.parentPath, e.name))
    .sort();
  return hash(
    JSON.stringify(
      await Promise.all(
        (await oldFrameHistoricalSourceFiles(files)).map(async (f) => [
          path.relative(directory, f),
          hash(await preIceDefaultsSource(path.relative(root, f), await fs.readFile(f))),
        ]),
      ),
    ),
  );
}
