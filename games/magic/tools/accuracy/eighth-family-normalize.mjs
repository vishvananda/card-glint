// Diagnostic transfer check. Does not certify a receiving set or change a painter.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, objectFile, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { metricSourceGraph } from './module-graph.mjs';
import {
  eighthScanRegistration,
  eighthPrintedContentControl,
  EIGHTH_RECOVERY_POLICY,
} from './eighth-scan-registration.mjs';
import { nativeScanFrameAnchors } from './native-scan-frame-anchors.mjs';
import { fitAffineFrameAnchors } from './scan-affine-anchor-fit.mjs';
import { SCAN_ANCHOR_WINDOWS } from './scan-frame-anchors.mjs';
const [inputFile, templateFile, donorInputFile, out] = process.argv.slice(2);
assert(out, 'Usage: eighth-family-normalize.mjs INPUTS TEMPLATE TEMPLATE_INPUTS OUT');
const read = async (f) => {
  const bytes = await readFile(f);
  return { bytes, data: JSON.parse(bytes) };
};
const inputs = await read(inputFile),
  template = await read(templateFile),
  donor = await read(donorInputFile);
assert.equal(template.data.family, 'eighth');
assert.equal(template.data.set, donor.data.set);
for (const group of Object.values(template.data.materials))
  for (const r of [...group.calibration, ...group.validation.references]) {
    const e = donor.data.entries.find((e) => e.id === r.id);
    assert(e);
    assert.equal(e.reference.sha256, r.referenceHash);
    assert.equal(hash(await readFile(objectFile(e.reference))), r.referenceHash);
  }
const fit = (raw, target, stock) => {
  if (stock === 'white') return eighthScanRegistration(raw, target);
  assert.equal(stock, 'black');
  const windows = Object.fromEntries(
    Object.entries(SCAN_ANCHOR_WINDOWS).map(([side, w]) => [
      side,
      {
        ...w,
        lo: Math.floor(target.sides[side].position - EIGHTH_RECOVERY_POLICY.halfWindow),
        hi: Math.ceil(target.sides[side].position + EIGHTH_RECOVERY_POLICY.halfWindow),
      },
    ]),
  );
  return {
    ...fitAffineFrameAnchors(nativeScanFrameAnchors(raw, stock, windows), target, undefined, {
      fixedModel: true,
    }),
    method: { policy: EIGHTH_RECOVERY_POLICY, windows, stock },
  };
};
await mkdir(out, { recursive: true });
const rows = [];
for (const e of inputs.data.entries) {
  assert(e.card.finishes.includes('nonfoil'));
  assert.equal(e.face.frameAssetFamily, 'eighth');
  const material = e.face.land
    ? 'L'
    : e.face.artifact
      ? 'A'
      : e.card.colors.length === 1
        ? e.card.colors[0]
        : 'M';
  const group = template.data.materials[material];
  assert(group, 'No donor physical target ' + material);
  const bytes = await readFile(objectFile(e.reference));
  assert.equal(hash(bytes), e.reference.sha256);
  const raw = PNG.sync.read(bytes, { checkCRC: true }),
    pose = fit(raw, group.target, e.face.borderColor);
  assert.deepEqual(fit(eighthPrintedContentControl(raw), group.target, e.face.borderColor), pose);
  let normalized;
  if (pose.accepted) {
    const im = normalize(raw, pose.transform);
    const png = new PNG({ width: im.width, height: im.height });
    png.data = Buffer.from(im.data);
    const bytes = PNG.sync.write(png),
      file = e.id + '.png';
    await writeFile(path.join(out, file), bytes);
    normalized = { file, sha256: hash(bytes) };
  }
  rows.push({
    id: e.id,
    name: e.card.name,
    material,
    stock: e.face.borderColor,
    referenceHash: e.reference.sha256,
    pose,
    normalized,
  });
}
const source = {
  inputHash: hash(inputs.bytes),
  templateHash: hash(template.bytes),
  donorInputHash: hash(donor.bytes),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  method: await metricSourceGraph(
    new URL('./eighth-scan-registration.mjs', import.meta.url).pathname,
  ),
  decoderLockHash: hash(await readFile(new URL('../../../../package-lock.json', import.meta.url))),
};
await writeJson(path.join(out, 'references.json'), {
  schema: 1,
  status: 'diagnostic-transfer-poses',
  scope:
    'Fixed donor physical targets, unchanged six-parameter fit and residual gates. Exact central-content replacement controls pass for every row. Black-stock threshold polarity is explicit; no black known-warp certification or receiving-set completion is implied.',
  source,
  rows,
});
console.log(
  JSON.stringify({
    set: inputs.data.set,
    total: rows.length,
    accepted: rows.filter((r) => r.pose.accepted).length,
    rejected: rows
      .filter((r) => !r.pose.accepted)
      .map((r) => ({ id: r.id, name: r.name, reason: r.pose.reason })),
  }),
);
