// Apply frozen scan-only targets; renderer pixels never enter registration.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, objectFile, writeJson } from './common.mjs';
import { metricSourceGraph } from './module-graph.mjs';
import { normalize } from './pixels-pure.mjs';
import { scanFrameAnchors } from './scan-frame-anchors.mjs';
import { fitScanFrame } from './scan-frame-fit.mjs';
import {
  eighthScanRegistration,
  eighthPrintedContentControl,
} from './eighth-scan-registration.mjs';
const [inputFile, templateFile, out, method] = process.argv.slice(2);
assert([undefined, '--eighth-native-affine'].includes(method), 'Unknown scan method');
assert(out, 'Usage: printing-calibration-normalize.mjs INPUTS TEMPLATE OUT');
const bytes = await readFile(inputFile),
  inputs = JSON.parse(bytes);
const templateBytes = await readFile(templateFile),
  template = JSON.parse(templateBytes);
assert.equal(template.set, inputs.set);
assert.equal(
  template.family,
  'eighth',
  'Only the reviewed Eighth strip geometry is supported here',
);
const byId = new Map(inputs.entries.map((e) => [e.id, e]));
for (const group of Object.values(template.materials)) {
  assert.equal(group.kind, 'printed-frame-target');
  for (const r of [...group.calibration, ...group.validation.references]) {
    const e = byId.get(r.id);
    assert(e, 'Missing frozen template member ' + r.id);
    assert.equal(e.reference.sha256, r.referenceHash, 'Changed template reference ' + r.id);
  }
}
// Freeze the pure numerical graph separately from the CLI's PNG decoder.
const methodGraph = await metricSourceGraph(
  new URL(method ? './eighth-scan-registration.mjs' : './scan-frame-fit.mjs', import.meta.url)
    .pathname,
);
const preprocessingGraph = await metricSourceGraph(
  new URL('./pixels-pure.mjs', import.meta.url).pathname,
);
const decoderLockHash = hash(
  await readFile(new URL('../../../../package-lock.json', import.meta.url)),
);
const rows = [];
await mkdir(out, { recursive: true });
for (const e of inputs.entries) {
  assert.equal(e.face.wordingMode, 'original');
  assert(e.card.finishes.includes('nonfoil'));
  const key = e.face.land
    ? 'L'
    : e.face.artifact
      ? 'A'
      : e.card.colors.length === 1
        ? e.card.colors[0]
        : 'M';
  const group = template.materials[key];
  assert(group, 'No measured target ' + key);
  const raw = await readFile(objectFile(e.reference));
  assert.equal(hash(raw), e.reference.sha256);
  const source = PNG.sync.read(raw);
  assert.equal(e.face.borderColor, 'white', 'This Eighth scan corpus uses white stock');
  const fit = method
    ? eighthScanRegistration(source, group.target)
    : fitScanFrame(scanFrameAnchors(normalize(source), e.face.borderColor), group.target);
  if (method) {
    assert.deepEqual(
      eighthScanRegistration(eighthPrintedContentControl(source), group.target),
      fit,
      e.card.name + ': central printed content affected physical registration',
    );
  }
  rows.push({
    id: e.id,
    name: e.card.name,
    number: e.card.collector_number,
    referenceHash: e.reference.sha256,
    family: template.family,
    geometry: key,
    nonfoilEligible: true,
    ...(method ? { contentIsolationPassed: true } : {}),
    ...fit,
  });
  if (rows.length % 25 === 0) console.log(rows.length, '/', inputs.entries.length);
}
const source = {
  methodGraph,
  preprocessingGraph,
  decoderLockHash,
  inputHash: hash(bytes),
  templateHash: hash(templateBytes),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  mode: method ?? 'legacy-frozen-frame-target',
  scope:
    'Complete nonfoil census; fixed physical scan targets and disjoint fit/validation strips. Scan matrices are comparison-only.',
};
await writeJson(path.join(out, 'normalization.json'), {
  schema: 1,
  set: inputs.set,
  source,
  summary: {
    total: inputs.entries.length,
    completed: rows.length,
    accepted: rows.filter((r) => r.accepted).length,
  },
  rows,
});
console.log(
  JSON.stringify({
    total: rows.length,
    accepted: rows.filter((r) => r.accepted).length,
    rejected: rows
      .filter((r) => !r.accepted)
      .map((r) => ({ id: r.id, name: r.name, reason: r.reason })),
  }),
);
