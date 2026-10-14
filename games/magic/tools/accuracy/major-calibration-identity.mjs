import { readFile } from 'node:fs/promises';
import { hash } from './common.mjs';

/** Measurement and report consumers must use the same dependency identity.
 * Target data has its own content hash in addition to this algorithm hash. */
export async function calibrationMethodHash() {
  return hash(
    Buffer.concat(
      await Promise.all(
        [
          'major-calibration-identity.mjs',
          'major-calibration-metrics.mjs',
          'major-calibration-measure.mjs',
          'stock-targets.mjs',
          'old-frame-normalization.mjs',
          'plate-stock-target.mjs',
          'scan-affine-fit.mjs',
          'scan-frame-anchors.mjs',
          'scan-frame-fit.mjs',
          'pixels-pure.mjs',
          'edges.mjs',
          'metrics.mjs',
        ].map((name) => readFile(new URL(name, import.meta.url))),
      ),
    ),
  );
}
