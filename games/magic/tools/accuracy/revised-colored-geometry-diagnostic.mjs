// Synthetic canonical-window shifts select candidates; native trials must verify them.
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
const [posesFile, captureFile, nativeDirectory, output] = process.argv.slice(2);
if (!posesFile || !captureFile || !nativeDirectory || !output)
  throw Error(
    'Usage: revised-colored-geometry-diagnostic.mjs POSES CAPTURE NATIVE_DIRECTORY OUTPUT',
  );
const { root } = await import('./common.mjs');
const { PNG } = createRequire(root + '/package.json')('pngjs');
const { hash } = await import(root + '/games/magic/tools/accuracy/common.mjs'),
  { warpedFrameProfiles } = await import(
    root + '/games/magic/tools/accuracy/revised-frame-pixel-fit.mjs'
  ),
  { gradientOverlap } = await import(root + '/games/magic/tools/accuracy/frame-edge-measure.mjs');
const read = async (file) => {
  const bytes = await fs.readFile(file);
  return file.endsWith('.gz') ? gunzipSync(bytes) : bytes;
};
const pb = await read(posesFile),
  poses = JSON.parse(pb),
  cb = await read(captureFile),
  capture = JSON.parse(cb),
  base = path.resolve(nativeDirectory) + '/';
if (capture.status !== 'complete' || capture.source.inputHash !== poses.inputHash)
  throw Error('Wrong or incomplete native corpus');
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length,
  groups = {};
for (const [material, g] of Object.entries(poses.groups)) {
  const keys = Object.keys(g.templates),
    row = g.rows[0],
    c = capture.rows.find((c) => c.id === row.id),
    b = await fs.readFile(base + c.modes.original.file),
    image = PNG.sync.read(b);
  if (hash(b) !== c.modes.original.sha256) throw Error('bad native');
  const current = warpedFrameProfiles(image, {});
  let exact = 0;
  for (const r of g.rows) {
    const c = capture.rows.find((c) => c.id === r.id),
      b = await fs.readFile(base + c.modes.original.file);
    if (hash(b) !== c.modes.original.sha256) throw Error('bad native');
    const p = warpedFrameProfiles(PNG.sync.read(b), {});
    if (JSON.stringify(p) !== JSON.stringify(current))
      throw Error('frame-window pixels vary by card:' + r.name);
    exact++;
  }
  const trials = [];
  for (let n = -12; n <= 12; n++) {
    const dx = n * 0.25,
      p = warpedFrameProfiles(image, { tx: dx }),
      scores = g.rows
        .filter((r) => r.accepted)
        .map((r) => ({
          id: r.id,
          name: r.name,
          cohort: r.cohort,
          fit: mean(['fitLeft', 'fitRight'].map((k) => gradientOverlap(r.profiles[k], p[k]))),
          all: mean(keys.map((k) => gradientOverlap(r.profiles[k], p[k]))),
        }));
    trials.push({
      dx,
      calibrationFit: mean(scores.filter((r) => r.cohort === 'calibration').map((r) => r.fit)),
      validationFit: mean(scores.filter((r) => r.cohort === 'validation').map((r) => r.fit)),
      scores,
    });
  }
  const selected = trials.toSorted(
      (a, b) => b.calibrationFit - a.calibrationFit || Math.abs(a.dx) - Math.abs(b.dx),
    )[0],
    zero = trials.find((t) => t.dx === 0);
  groups[material] = {
    windowParity: exact,
    trials,
    selectedDx: selected.dx,
    before: zero.calibrationFit,
    after: selected.calibrationFit,
    validationBefore: zero.validationFit,
    validationAfter: selected.validationFit,
    regressions: selected.scores
      .filter((s) => s.all < zero.scores.find((o) => o.id === s.id).all)
      .map((s) => s.name),
  };
  console.log(material, { ...groups[material], trials: undefined });
}
await fs.writeFile(
  output,
  JSON.stringify(
    {
      status: 'synthetic-window-shift-diagnostic-only-not-native-renderer',
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
