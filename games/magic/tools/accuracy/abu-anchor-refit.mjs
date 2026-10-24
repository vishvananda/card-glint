// Verify coherent corner disagreements without moving the renderer.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { gunzipSync, gzipSync } from 'node:zlib';
import { PNG } from 'pngjs';
import { hash, objectFile } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { scanBoundaryProfiles } from './scan-boundary-profiles.mjs';
import { measurePrintedCorners, validatePrintedCorners } from './scan-corner-certification.mjs';
import { profileMatrix, profileSupport } from './scan-gradient-fit.mjs';
import { fitVerticalAnchors } from './scan-vertical-anchors.mjs';
const [inputFile, auditFile, output] = process.argv.slice(2);
assert(output, 'Usage: abu-anchor-refit.mjs INPUTS CORNER_AUDIT OUT_DIR');
const ib = await readFile(inputFile),
  inputs = JSON.parse(ib),
  ab = await readFile(auditFile),
  audit = JSON.parse(gunzipSync(ab));
assert.equal(hash(ib), audit.source.inputHash);
const sb = await readFile(audit.source.seedFile);
assert.equal(hash(sb), audit.source.seedHash);
const seed = JSON.parse(sb),
  rows = [];
await mkdir(output, { recursive: true });
for (const flagged of audit.rows.filter((r) => r.coherentVertical)) {
  const e = inputs.entries.find((e) => e.id === flagged.id);
  assert.equal(hash(JSON.stringify(e.pose)), flagged.poseHash);
  const bytes = await readFile(objectFile(e.reference));
  assert.equal(hash(bytes), flagged.referenceHash);
  const image = PNG.sync.read(bytes),
    canonical = normalize(image);
  const tb = gunzipSync(
      await readFile('games/magic/fixtures/accuracy/abu-054/' + e.set + '-templates.json.gz'),
    ),
    t = JSON.parse(tb);
  assert.equal(hash(JSON.stringify(t)), e.pose.templateHash);
  const profiles = t.groups.map((g) => scanBoundaryProfiles(canonical, g, t.bounds));
  const templates = [
    t.templates[e.material],
    t.independent[e.material],
    t.certification[e.material],
  ];
  const group = audit.groups[e.set + '/' + e.material];
  const targets = group.corners;
  const proposal = fitVerticalAnchors({
    parameters: e.pose.parameters,
    groups: profiles,
    templates,
    corners: flagged.corners,
    targets,
  });
  const shapeTemplate = {
    ...seed,
    corners: seed.corners.map((c, i) => ({ ...c, point: targets[i].point })),
  };
  const check = (parameters) => {
    const transform = { matrix: profileMatrix(parameters) },
      evidence = measurePrintedCorners(image, transform, shapeTemplate);
    const certificate = validatePrintedCorners(evidence, shapeTemplate);
    const supports = profiles.map((p, i) => profileSupport(p, templates[i], parameters));
    return {
      evidence,
      certificate,
      threeSides: supports.map((s) => ({
        left: s.sides.left,
        right: s.sides.right,
        top: s.sides.top,
      })),
      accepted:
        certificate.accepted &&
        supports.every(
          (s) => ['left', 'right', 'top'].every((k) => s.sides[k] >= 0.6) && s.sides.top >= 0.9,
        ),
    };
  };
  const before = check(e.pose.parameters),
    after = check(proposal.parameters);
  const negative = [];
  for (const key of ['tx', 'ty', 'sy', 'sx'])
    for (const sign of [-1, 1]) {
      const q = {
        ...proposal.parameters,
        [key]: proposal.parameters[key] + sign * (key === 'sx' || key === 'sy' ? 0.006 : 2),
      };
      const test = check(q);
      negative.push({ kind: key, sign, accepted: test.accepted });
    }
  assert(
    negative.every((n) => !n.accepted),
    'A displaced pose passed an anchor control',
  );
  for (const version of ['before', 'after']) {
    const transform = version === 'before' ? e.pose.transform : proposal.transform;
    await writeFile(
      path.join(output, e.id + '-' + version + '-scan.png'),
      PNG.sync.write(normalize(image, transform)),
    );
  }
  rows.push({
    id: e.id,
    set: e.set,
    name: e.name,
    material: e.material,
    referenceHash: e.reference.sha256,
    priorPoseHash: flagged.poseHash,
    templateHash: e.pose.templateHash,
    targetGroup: e.set + '/' + e.material,
    target: targets,
    proposal,
    before,
    after,
    negative,
    status:
      proposal.numericalPass && after.accepted
        ? 'numerically-supported-anchor-proposal'
        : 'rejected-anchor-proposal',
  });
  console.log(e.set, e.name, rows.at(-1).status, proposal.checks);
}
const result = {
  schema: 1,
  status: 'independent-source-anchor-refit-proposals',
  scope:
    'Coherent printed-corner disagreements only. Three source-boundary groups and two printed marks constrain vertical scale/translation; renderer, fonts, art and paper parameters are fixed. Exact raw corner remeasurement and eight displaced-pose controls are retained per case. No live templates or normalization acceptance are changed by this proposal artifact.',
  source: {
    inputHash: hash(ib),
    auditHash: hash(ab),
    toolHash: hash(await readFile(new URL(import.meta.url))),
    kernelHash: hash(await readFile(new URL('./scan-vertical-anchors.mjs', import.meta.url))),
  },
  rows,
};
await writeFile(path.join(output, 'proposals.json'), JSON.stringify(result, null, 2) + '\n');
await writeFile(
  path.join(output, 'proposals.json.gz'),
  gzipSync(Buffer.from(JSON.stringify(result) + '\n'), { mtime: 0 }),
);
console.log(
  rows.map((r) => ({
    name: r.name,
    status: r.status,
    before: r.before.certificate.accepted,
    after: r.after.certificate.accepted,
    parameters: r.proposal.parameters,
  })),
);
