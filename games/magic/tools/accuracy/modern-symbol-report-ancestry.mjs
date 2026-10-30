// The historical report-tool checksum is provenance, not a new pixel metric.
// Reconstruct only this exact reviewed metadata delta; unknown edits stay raw.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { root, hash } from './common.mjs';
let checked;
export async function preModernSymbolReportSource(file, bytes) {
  const p = await (checked ??= (async () => {
    const packed = await fs.readFile(
      path.join(
        root,
        'games/magic/fixtures/accuracy/modern-symbol-placement/report-compatibility.json.gz',
      ),
    );
    assert.equal(hash(packed), '093d67f0850d6af4017af8bebf6b6935720e1009b3438fc7d624c80ce18820a5');
    const p = JSON.parse(gunzipSync(packed));
    assert.equal(p.schema, 1);
    assert.equal(p.kind, 'original-calibration-report-compatibility');
    assert.equal(p.file, 'games/magic/tools/accuracy/calibration-report.mjs');
    assert.equal(hash(p.beforeSource), p.before);
    return p;
  })());
  return file === p.file && hash(bytes) === p.after ? Buffer.from(p.beforeSource) : bytes;
}
