import { readFile, access } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { outputRoot, writeJson, hash } from './common.mjs';
import { sampleColor, delta } from './hsb-color.mjs';

const beforeLabel = process.argv[2] ?? 'adventure-native-v2';
const afterLabel = process.argv[3];
if (!afterLabel) throw Error('Supply an uncalibrated and a calibrated capture label.');
const output = `${outputRoot}/${afterLabel}-paper-check.json`;
try {
  await access(output);
  throw Error('Paper check exists; choose a new capture.');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const load = async (label) => {
  const bytes = await readFile(`${outputRoot}/${label}/audit.json`);
  return { audit: JSON.parse(bytes), hash: hash(bytes) };
};
const before = await load(beforeLabel),
  after = await load(afterLabel);
const fitBytes = await readFile(`${outputRoot}/adventure-native-v2-paper.json`);
const fit = JSON.parse(fitBytes);
const patches = fit.patches;
const image = async (label, file) =>
  PNG.sync.read(await readFile(`${outputRoot}/${label}/${file}`));
const results = [];
for (const next of after.audit.results.filter((r) => r.registration.accepted)) {
  const old = before.audit.results.find((r) => r.id === next.id);
  if (!old || !old.registration.accepted) continue;
  if (old.wordingHash !== next.wordingHash || old.art.sha256 !== next.art.sha256)
    throw Error('Input provenance differs');
  const reference = sampleColor(await image(afterLabel, next.files.reference), patches, {
    paper: true,
  });
  const original = sampleColor(await image(beforeLabel, old.files.template), patches, {
    paper: true,
  });
  const current = sampleColor(await image(afterLabel, next.files.template), patches, {
    paper: true,
  });
  const colors = next.face.faces[1].colors ?? [];
  const material = colors.length === 1 ? colors[0] : colors.length > 1 ? 'M' : 'A';
  results.push({
    id: next.id,
    name: next.name,
    set: next.set,
    material,
    partition: fit.fits[material]?.calibration.includes(next.id) ? 'calibration' : 'held-out',
    before: delta(original.rgb, reference.rgb),
    after: delta(current.rgb, reference.rgb),
    beforeRgb: original.rgb,
    afterRgb: current.rgb,
    referenceRgb: reference.rgb,
    unchanged: original.rgb.every((v, i) => v === current.rgb[i]),
    normalizedPoseUnchanged:
      JSON.stringify(old.registration.transform) === JSON.stringify(next.registration.transform),
  });
}
const summary = {};
for (const set of ['eld', 'woe', 'clb']) {
  summary[set] = {};
  for (const partition of ['calibration', 'held-out']) {
    const rows = results.filter(
      (r) => r.set === set && r.partition === partition && 'WUBRG'.includes(r.material),
    );
    if (!rows.length) continue;
    summary[set][partition] = {
      count: rows.length,
      before: rows.reduce((n, r) => n + r.before, 0) / rows.length,
      after: rows.reduce((n, r) => n + r.after, 0) / rows.length,
      regressions: rows.filter((r) => r.after > r.before + 0.5).map((r) => r.name),
    };
  }
}
await writeJson(output, {
  schemaVersion: 1,
  createdAt: new Date().toISOString(),
  beforeLabel,
  afterLabel,
  beforeAuditHash: before.hash,
  afterAuditHash: after.hash,
  fitHash: hash(fitBytes),
  patches,
  summary,
  results,
  scope:
    'Actual rendered paper samples, not just predicted HSB medians. ELD alternating calibration; remaining ELD and all WOE/CLB reserved. CLB correction deliberately disabled. This is color error, not text or structural accuracy.',
});
console.log(JSON.stringify(summary, null, 2));
