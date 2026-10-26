import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';
import { root, hash } from './common.mjs';
import { warpedFrameProfiles } from './revised-frame-pixel-fit.mjs';
import { gradientOverlap } from './frame-edge-measure.mjs';
const { PNG } = createRequire(root + '/package.json')('pngjs');
export function selectRevisedWidthTrial(trials) {
  assert(trials.length > 0);
  assert.equal(new Set(trials.map((t) => JSON.stringify([t.sx, t.dx]))).size, trials.length);
  assert(
    trials.every(
      (t) =>
        Number.isFinite(t.calibrationFit) &&
        t.calibrationFit >= 0 &&
        t.calibrationFit <= 100.000000001 &&
        Number.isFinite(t.dx) &&
        Math.abs(t.dx) <= 1.5 &&
        Number.isFinite(t.sx) &&
        t.sx >= 0.996 &&
        t.sx <= 1.004,
    ),
  );
  return trials.toSorted(
    (a, b) =>
      b.calibrationFit - a.calibrationFit ||
      Math.abs(a.sx - 1) - Math.abs(b.sx - 1) ||
      Math.abs(a.dx) - Math.abs(b.dx) ||
      a.sx - b.sx ||
      a.dx - b.dx,
  )[0];
}
export async function revisedWidthDiagnostic(posesFile, captureFile, nativeDirectory, output) {
  assert(
    posesFile && captureFile && nativeDirectory && output,
    'Usage: revised-colored-width-diagnostic.mjs POSES BASELINE_CAPTURE NATIVE_DIRECTORY OUTPUT',
  );
  const read = async (f) => {
    const b = await fs.readFile(f);
    return f.endsWith('.gz') ? gunzipSync(b) : b;
  };
  const pb = await read(posesFile),
    poses = JSON.parse(pb),
    cb = await read(captureFile),
    capture = JSON.parse(cb),
    base = path.resolve(nativeDirectory) + '/';
  assert.equal(capture.status, 'complete');
  assert.equal(capture.source.inputHash, poses.inputHash);
  const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length,
    groups = {};
  for (const [material, g] of Object.entries(poses.groups)) {
    const keys = Object.keys(g.templates),
      r0 = g.rows[0],
      c = capture.rows.find((c) => c.id === r0.id),
      b = await fs.readFile(base + c.modes.original.file),
      image = PNG.sync.read(b);
    if (hash(b) !== c.modes.original.sha256) throw Error('bad native');
    const accepted = g.rows.filter((r) => r.accepted),
      cal = accepted.filter((r) => r.cohort === 'calibration'),
      held = accepted.filter((r) => r.cohort === 'validation');
    const evaluate = (p, rs, keys) =>
      mean(rs.map((r) => mean(keys.map((k) => gradientOverlap(r.profiles[k], p[k])))));
    const trials = [];
    for (let w = -4; w <= 4; w++)
      for (let n = -12; n <= 12; n++) {
        const sx = 1 + w * 0.001,
          dx = n * 0.125,
          p = warpedFrameProfiles(image, { matrix: [sx, 0, 0, 1, dx, 0] }, ['fitLeft', 'fitRight']);
        trials.push({
          sx,
          dx,
          calibrationFit: evaluate(p, cal, ['fitLeft', 'fitRight']),
          validationFit: evaluate(p, held, ['fitLeft', 'fitRight']),
        });
      }
    const selected = selectRevisedWidthTrial(trials),
      zero = trials.find((t) => t.dx === 0 && t.sx === 1),
      p = warpedFrameProfiles(image, { matrix: [selected.sx, 0, 0, 1, selected.dx, 0] }),
      current = warpedFrameProfiles(image, {});
    const scores = accepted.map((r) => ({
      id: r.id,
      name: r.name,
      cohort: r.cohort,
      current: mean(keys.map((k) => gradientOverlap(r.profiles[k], current[k]))),
      proposed: mean(keys.map((k) => gradientOverlap(r.profiles[k], p[k]))),
    }));
    groups[material] = {
      selected,
      zero,
      trials,
      bands: Object.fromEntries(
        keys.map((k) => [
          k,
          { before: evaluate(current, accepted, [k]), after: evaluate(p, accepted, [k]) },
        ]),
      ),
      regressions: scores.filter((r) => r.proposed < r.current).map((r) => r.name),
      scores,
    };
    console.log(material, {
      selected,
      zero,
      bands: groups[material].bands,
      regressions: groups[material].regressions,
    });
    await fs.writeFile(
      output,
      JSON.stringify(
        {
          status: 'diagnostic-width-and-position-not-native-or-adopted',
          posesHash: hash(pb),
          captureHash: hash(cb),
          rendererHash: capture.source.rendererHash,
          inputHash: poses.inputHash,
          toolHash: hash(await fs.readFile(new URL(import.meta.url))),
          groups,
        },
        null,
        2,
      ) + '\n',
    );
  }

  return groups;
}
if (process.argv[1] === fileURLToPath(import.meta.url))
  await revisedWidthDiagnostic(...process.argv.slice(2));
