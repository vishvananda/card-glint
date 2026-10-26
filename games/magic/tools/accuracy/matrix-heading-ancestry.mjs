// Exact history for the Matrix baseline portability fix; no new layout values.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, readdir } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { root, hash } from './common.mjs';
const RECEIPT = '875dec57b36a1c2763f3bc61dcd9a5f5906ef5164a94cc2a04e44db3bbad9ff1';
let checked;
export async function matrixHeadingDelta() {
  return (checked ??= (async () => {
    const bytes = await readFile(
      path.join(root, 'games/magic/fixtures/accuracy/8ed/heading-baseline/source-parity.json.gz'),
    );
    assert.equal(hash(bytes), RECEIPT);
    const p = JSON.parse(gunzipSync(bytes));
    assert.equal(p.schema, 1);
    assert.equal(p.status, 'complete-native-eighth-matrix-baseline-parity');
    assert.deepEqual(Object.keys(p.files).sort(), [
      'games/magic/src/data/generated-manifest.json',
      'games/magic/src/presentation/canvas-face.ts',
      'games/magic/src/presentation/canvas-text.ts',
    ]);
    for (const e of Object.values(p.files)) {
      assert.equal(hash(e.beforeSource), e.before);
      assert.equal(hash(e.afterSource), e.after);
    }
    assert.equal(p.font.sha256, '22dd30ba87941d9e785fc17510e1b14fb3ffce38f5d525af2632f66330cf82ce');
    assert.equal(p.font.unitsPerEm, 1000);
    assert.equal(p.font.hhea.descent, 167);
    assert.equal(p.font.os2Typo.descent, 167);
    const auditBytes = await readFile(path.join(root, p.audit.file));
    assert.equal(hash(auditBytes), p.audit.sha256);
    const audit = JSON.parse(gunzipSync(auditBytes));
    assert.equal(audit.definition.nativeCaptureHash, p.priorNativeHash);
    const { before, after } = p.native;
    assert.equal(hash(JSON.stringify(before, null, 2) + '\n'), p.priorNativeHash);
    assert.equal(hash(JSON.stringify(after, null, 2) + '\n'), p.freshNativeHash);
    assert.equal(before.source.inputsHash, after.source.inputsHash);
    assert.equal(after.source.rendererHash, p.afterRenderer);
    for (const capture of [before, after]) {
      assert.equal(capture.completed, 357);
      assert.equal(capture.rows.length, 357);
      assert.equal(new Set(capture.rows.map((r) => r.id)).size, 357);
      assert.deepEqual(capture.faults, []);
    }
    for (const r of after.rows) {
      const old = before.rows.find((v) => v.id === r.id),
        a = audit.rows.find((v) => v.id === r.id);
      assert(old && a);
      for (const key of ['inputHash', 'referenceHash', 'artHash']) assert.equal(r[key], old[key]);
      assert.equal(r.inputHash, a.inputHash);
      assert.equal(r.referenceHash, a.referenceHash);
      assert.equal(r.layers.face.sha256, a.nativeFaceHash);
      assert.deepEqual(r.layers, old.layers, 'Canonical Linux native raster changed: ' + r.id);
    }
    const probes = p.crossPlatform.metrics;
    assert.equal(probes.length, 4);
    assert.equal(new Set(probes.map((r) => r.platform + '/' + r.engine)).size, 4);
    const linux = probes.find((r) => r.platform === 'linux' && r.engine === 'chromium').result;
    assert.deepEqual(linux.middle.inkBounds, linux.alphabetic.inkBounds);
    const mac = probes.find((r) => r.platform === 'darwin' && r.engine === 'chromium').result;
    assert(mac.middle.inkBounds[1] > mac.alphabetic.inkBounds[1] + 20);
    assert.equal(p.crossPlatform.live.rows.length, 2);
    for (const r of p.crossPlatform.live.rows) {
      assert.notEqual(r.before, r.after);
      assert(r.changed > 0);
      assert.equal(r.outsideHeadingBands, 0);
      assert.equal(r.changedAlpha, 0);
    }
    return p;
  })());
}
/** Reverse only these exact reviewed bytes. Unknown edits retain their identity. */
export async function preMatrixHeadingSource(file, bytes) {
  const e = (await matrixHeadingDelta()).files[file];
  return e && hash(bytes) === e.after ? Buffer.from(e.beforeSource) : bytes;
}
export async function matrixHeadingHistoricalHash(directory = path.join(root, 'games/magic/src')) {
  const files = (await readdir(directory, { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
    .map((e) => path.join(e.parentPath, e.name))
    .sort();
  return hash(
    JSON.stringify(
      await Promise.all(
        files.map(async (file) => [
          path.relative(directory, file),
          hash(await preMatrixHeadingSource(path.relative(root, file), await readFile(file))),
        ]),
      ),
    ),
  );
}
