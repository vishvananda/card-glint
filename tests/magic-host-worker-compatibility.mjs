import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import {
  compatibleHostWorkerSource,
  hostWorkerCompatibilityProof,
} from '../games/magic/tools/accuracy/host-worker-compatibility.mjs';

// Type erasure and these two document-backed helper calls are the only allowed
// changes in ordinary painters. Do not normalize away drawing commands.
function browserJavaScript(source) {
  return ts
    .transpile(source, {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      removeComments: true,
    })
    .replace(/import[^;]*?from ['"][^'"]*\/(?:canvas-raster|canvas-font-registry)\.js['"];\n/g, '')
    .replaceAll('rasterCanvas()', 'document.createElement("canvas")')
    .replaceAll('canvasFonts()', 'document.fonts')
    .replaceAll("document.createElement('canvas')", 'document.createElement("canvas")')
    .replaceAll(/\s/g, '');
}
const wrappers = new Set([
  'packages/browser/src/canvas-raster.ts',
  'games/magic/src/index.ts',
  'games/magic/src/presentation/canvas-face.ts',
  'games/magic/src/presentation/security-stamp-hologram.ts',
]);
const proof = await hostWorkerCompatibilityProof();
let same = 0,
  hostOnly = 0;
for (const [file, change] of Object.entries(proof.files)) {
  const bytes = await readFile(file);
  assert.equal(hash(bytes), change.after, file);
  const before = await compatibleHostWorkerSource(file, bytes);
  assert.equal(hash(before), change.before, file);
  if (change.review === 'host-finish-outside-flat') {
    assert.ok(file.startsWith('packages/browser/src/'));
    hostOnly++;
  } else if (!wrappers.has(file)) {
    let source = bytes.toString();
    if (file.endsWith('/future-frame-paint.ts')) {
      // This callback receives only composed canvases or leased ImageBitmaps.
      // Widen canvas cleanup to OffscreenCanvas; the browser branch is identical.
      source = source.replace(
        '!(image instanceof ImageBitmap)',
        'image instanceof HTMLCanvasElement',
      );
    }
    assert.equal(browserJavaScript(source), browserJavaScript(before.toString()), file);
    same++;
  }
  const changed = Buffer.concat([bytes, Buffer.from('// later edit')]);
  assert.deepEqual(
    await compatibleHostWorkerSource(file, changed),
    changed,
    'Later edits must not inherit a historical identity',
  );
}
assert.equal(wrappers.size, 4);
console.log(
  JSON.stringify({
    ordinaryPaintersWithIdenticalBrowserJavaScript: same,
    wrappersCoveredByBrowserAndHostMaskReplays: wrappers.size,
    hostFinishOrExportModulesOutsideFlatScoring: hostOnly,
  }),
);
