// Offline replay of optional scan certificates. Does not change renderer values.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { root, readJson, writeJson, hash, objectFile } from './common.mjs';
import {
  measurePrintedCorners,
  validatePrintedCorners,
  certifyUniformBottomRecovery,
} from './scan-corner-certification.mjs';
import { normalize } from './pixels-pure.mjs';
import { scanBoundaryProfiles } from './scan-boundary-profiles.mjs';
import { profileSupport, profileMatrix } from './scan-gradient-fit.mjs';
import { gunzipSync } from 'node:zlib';
const [study, out] = process.argv.slice(2);
assert(out, 'Usage: audit-corner-recovery.mjs NATIVE_STUDY OUT');
const input = await readJson(path.join(study, 'current/inputs.json')),
  native = await readJson(path.join(study, 'current/capture.json'));
const templateFile = path.join(
    root,
    'games/magic/fixtures/accuracy/early-through-fourth/alpha-bottom-corners.json',
  ),
  tb = await readFile(templateFile),
  template = JSON.parse(tb);
const oldTemplateBytes = gunzipSync(
    await readFile(path.join(root, 'games/magic/fixtures/accuracy/abu-054/lea-templates.json.gz')),
  ),
  old = JSON.parse(oldTemplateBytes);
const entries = input.entries.filter((e) => e.set === 'lea' && e.material === 'B'),
  rows = [];
assert.equal(entries.length, 46);
const negative = {};
for (const name of ['x:-2', 'x:2', 'y:-2', 'y:2', 'blank', 'square'])
  negative[name] = { total: 0, passed: 0 };
const run = (image, pose) => {
  const evidence = measurePrintedCorners(image, pose.transform, template);
  return {
    evidence,
    certificate: validatePrintedCorners(evidence, template),
    recovery: certifyUniformBottomRecovery(pose, evidence, template),
  };
};
const start = performance.now();
for (const e of entries) {
  const rawBytes = await readFile(objectFile(e.reference));
  assert.equal(hash(rawBytes), e.reference.sha256);
  const raw = PNG.sync.read(rawBytes),
    pose = e.pose,
    result = run(raw, pose);
  const current = native.rows.find((r) => r.id === e.id);
  assert(current);
  const alignedBytes = await readFile(path.join(study, 'current/lea', e.id + '-scan.png'));
  assert.equal(hash(alignedBytes), current.scanHash);
  const aligned = PNG.sync.read(alignedBytes);
  // An already aligned native raster must produce the same evidence as direct
  // small-window raw-source sampling; this also checks pixel-center conventions.
  const direct = measurePrintedCorners(aligned, {}, template);
  let parity = 0;
  for (let i = 0; i < 2; i++)
    for (const k of ['x', 'y', 'contrast', 'shape'])
      if (result.evidence.corners[i].detected && direct.corners[i].detected)
        parity = Math.max(parity, Math.abs(result.evidence.corners[i][k] - direct.corners[i][k]));
  assert(parity < 1e-8, 'Raw/native sampling differs: ' + e.name);
  const full = normalize(raw),
    profiles = old.groups.map((w) => scanBoundaryProfiles(full, w, old.bounds));
  for (const axis of ['x', 'y'])
    for (const delta of [-2, 2]) {
      const p = {
        ...pose.parameters,
        [axis === 'x' ? 'tx' : 'ty']: pose.parameters[axis === 'x' ? 'tx' : 'ty'] + delta,
      };
      const supports = profiles.map((v, i) =>
        profileSupport(v, [old.templates.B, old.independent.B, old.certification.B][i], p, {
          residuals: true,
        }),
      );
      const changed = {
        ...pose,
        accepted: false,
        parameters: p,
        transform: { matrix: profileMatrix(p) },
        fit: supports[0],
        validation: supports[1],
        certification: supports[2],
      };
      const r = run(raw, changed).recovery;
      const k = axis + ':' + delta;
      negative[k].total++;
      negative[k].passed += Number(r.accepted);
    }
  for (const kind of ['blank', 'square']) {
    const changed = { ...aligned, data: Buffer.from(aligned.data) };
    for (const c of template.corners) {
      const round = (v) => {
          const n = Math.floor(v);
          return v - n === 0.5 ? n + (n % 2) : Math.round(v);
        },
        [l, t, r, b] = c.window.map((v) => round(v * 1.5));
      for (let y = t; y < b; y++)
        for (let x = l; x < r; x++) {
          const i = (y * changed.width + x) * 4;
          changed.data[i] = changed.data[i + 1] = changed.data[i + 2] = 27;
          changed.data[i + 3] = 255;
        }
      if (kind === 'square') {
        const x0 = Math.round(c.point[0] * 1.5) - 2,
          y0 = Math.round(c.point[1] * 1.5) - 2;
        for (let y = y0; y < y0 + 5; y++)
          for (let x = x0; x < x0 + 5; x++) {
            const i = (y * changed.width + x) * 4;
            changed.data[i] = changed.data[i + 1] = changed.data[i + 2] = 240;
          }
      }
    }
    const v = measurePrintedCorners(changed, {}, template);
    const recovery = certifyUniformBottomRecovery({ ...pose, accepted: false }, v, template);
    negative[kind].total++;
    negative[kind].passed += Number(recovery.accepted);
  }
  rows.push({
    id: e.id,
    name: e.name,
    cohort: pose.cohort,
    referenceHash: e.reference.sha256,
    poseHash: hash(JSON.stringify(pose.transform)),
    oldAccepted: pose.accepted,
    accepted: pose.accepted || result.recovery.accepted,
    rawNativeParity: parity,
    ...result,
  });
}
for (const v of Object.values(negative)) assert.equal(v.passed, 0, 'A negative certificate passed');
const recovered = rows.filter((r) => !r.oldAccepted && r.accepted);
assert.deepEqual(recovered.map((r) => r.name).sort(), ['Deathlace', 'Nether Shadow', 'Pestilence']);
const value = {
  schema: 1,
  scope:
    'Same renderer, scans and frozen poses. Source-frame corner certification is optional and additive only for old-rejected uniform Alpha black frames with three independently supported edges. No pose or rendering pixels change. Existing accepted cases retain their original path. This receipt is an offline audit; client/server integration and current-generation scoring remain separate work.',
  templateHash: hash(tb),
  oldTemplateHash: hash(oldTemplateBytes),
  sourceCaptureHash: hash(await readFile(path.join(study, 'current/capture.json'))),
  tools: await Promise.all(
    [
      'audit-corner-recovery.mjs',
      'scan-corner-certification.mjs',
      'scan-transform.mjs',
      'scan-boundary-profiles.mjs',
      'scan-gradient-fit.mjs',
    ].map(async (f) => [f, hash(await readFile(new URL(f, import.meta.url)))]),
  ),
  summary: {
    total: rows.length,
    oldAccepted: rows.filter((r) => r.oldAccepted).length,
    accepted: rows.filter((r) => r.accepted).length,
    recovered: recovered.map((r) => r.name),
    changedPoses: 0,
    changedRendererPixels: 0,
    negative,
    wallMs: performance.now() - start,
    timingScope:
      'Includes scan PNG decoding, disk reads and diagnostic controls; no GPU work or browser.',
  },
  rows,
};
await writeJson(out, value);
console.log(JSON.stringify(value.summary));
