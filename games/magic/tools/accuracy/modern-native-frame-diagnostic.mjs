// Compare native renderer frame fields with the fixed scan-only consensus.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { frameValueImage, modernValueFramePatches } from './modern-frame-value.mjs';
import { scanBoundaryProfiles } from './scan-boundary-profiles.mjs';
import { packFramePatches } from './frame-patch-profiles.mjs';
import { fitScanResidual } from './printed-plate-registration.mjs';
import { fitModernAffine } from './modern-affine-fit.mjs';
import { metricSourceGraph } from './module-graph.mjs';
const [inputFile, nativeDirectory, observationFile, templateFile, out] = process.argv.slice(2);
assert(out, 'Usage: modern-native-frame-diagnostic.mjs INPUTS NATIVE OBSERVATIONS TEMPLATES OUT');
const read = async (f) => {
  const bytes = await readFile(f);
  return { bytes, data: JSON.parse(bytes) };
};
const input = await read(inputFile),
  capture = await read(path.join(nativeDirectory, 'capture.json')),
  obs = await read(observationFile),
  templates = await read(templateFile);
assert.equal(capture.data.source.inputsHash, hash(input.bytes));
assert.equal(obs.data.inputHash, hash(input.bytes));
assert.equal(templates.data.observationsHash, hash(obs.bytes));
assert.equal(capture.data.rows.length, input.data.entries.length);
assert.equal(obs.data.rows.length, input.data.entries.length);
const source = {
  inputsHash: hash(input.bytes),
  nativeHash: hash(capture.bytes),
  observationsHash: hash(obs.bytes),
  templatesHash: hash(templates.bytes),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  graphs: {
    affine: await metricSourceGraph(new URL('./modern-affine-fit.mjs', import.meta.url).pathname),
    fields: await metricSourceGraph(new URL('./modern-frame-value.mjs', import.meta.url).pathname),
  },
};
await mkdir(out, { recursive: true });
const cases = [],
  members = [];
const shared = new Map();
for (const e of input.data.entries) {
  const row = obs.data.rows.find((r) => r.id === e.id),
    native = capture.data.rows.find((r) => r.id === e.id);
  assert(row && native && !native.issue);
  assert.equal(native.inputHash, hash(JSON.stringify(e.face)));
  const bytes = await readFile(path.join(nativeDirectory, native.layers.face.file));
  assert.equal(hash(bytes), native.layers.face.sha256);
  const image = PNG.sync.read(bytes),
    patches = row.partitions.map((p) => modernValueFramePatches(image, p, row.bounds)),
    packed = packFramePatches(patches),
    geometry = row.kind.startsWith('planeswalker')
      ? row.kind
      : (row.profile.legendary ? 'normal-crown/' : 'normal-plain/') + row.profile.boxes;
  const identity = hash(
    Buffer.concat([Buffer.from(JSON.stringify(packed.description)), packed.bytes]),
  );
  const key = geometry + '/' + identity;
  members.push({
    id: e.id,
    name: e.card.name,
    geometry,
    fieldHash: identity,
    referenceHash: e.reference.sha256,
    nativeHash: native.layers.face.sha256,
  });
  if (shared.has(key)) continue;
  const profiles = row.partitions.map((p) =>
      scanBoundaryProfiles(normalize(frameValueImage(image)), p, row.bounds),
    ),
    family = templates.data.templates[geometry];
  assert(family);
  const template = family.partitions[0].concat(family.partitions[1]);
  const fit = fitModernAffine(
    {
      profiles: profiles[0].concat(profiles[1]),
      independentProfiles: profiles[2],
      patches: patches[0].concat(patches[1]),
      independentPatches: patches[2],
      fit: fitScanResidual(profiles[0].concat(profiles[1]), template),
    },
    {
      template,
      independentTemplate: family.partitions[2],
      patchTemplate: family.patchTemplates[0].concat(family.patchTemplates[1]),
      independentPatchTemplate: family.patchTemplates[2],
      search: 'independent-axis-seed-v1',
    },
  );
  const value = {
    id: e.id,
    name: e.card.name,
    geometry,
    fieldHash: identity,
    profile: row.profile,
    fit,
  };
  shared.set(key, value);
  cases.push(value);
  console.log(
    JSON.stringify({
      name: value.name,
      geometry,
      accepted: fit.accepted,
      parameters: fit.parameters,
    }),
  );
  await writeJson(path.join(out, 'measurement.json'), {
    schema: 1,
    source,
    status: 'diagnostic-only',
    scope:
      'Native frame fields versus the scan-only consensus. Identical native fields share one computation; all printings remain in membership. This diagnoses outer-frame disagreement, not art aperture/rules/type geometry, and does not refit scan poses or install a renderer affine transform. Native-renderer-to-template fits require physical landmark review before any geometry change.',
    denominator: input.data.entries.length,
    completed: members.length,
    members,
    cases,
  });
}
await writeJson(path.join(out, 'measurement.json'), {
  schema: 1,
  source,
  status: 'diagnostic-only',
  scope:
    'Every printing retains exact native/reference membership. Identical native fields share computation. Outer-field discrepancy only; not a scan pose or renderer transform to apply. Unapproved planeswalker normalization is retained, never promoted.',
  denominator: input.data.entries.length,
  completed: members.length,
  members,
  cases,
});
