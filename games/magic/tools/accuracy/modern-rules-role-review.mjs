// Whole native before/after audit. No Chromium, no scan re-registration and no
// external downloads. Scan/reference/input/native hashes are checked before use.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { createServer } from 'vite';
import { hash, root, sourceHash, writeJson } from './common.mjs';
import { nativeGrayCrop } from './abu-type-objective.mjs';
import { RulesRoleObjective, roleFitDecision } from './modern-rules-role-objective.mjs';

const [inputFile, beforeDirectory, afterDirectory, scoresDirectory, output] = process.argv.slice(2);
assert(output, 'Usage: modern-rules-role-review.mjs INPUTS BEFORE AFTER SCORES OUTPUT');
const json = async (file) => {
  const raw = await readFile(file);
  return { data: JSON.parse(raw), sha256: hash(raw) };
};
const inputs = await json(inputFile),
  before = await json(path.join(beforeDirectory, 'capture.json')),
  after = await json(path.join(afterDirectory, 'capture.json')),
  scores = await json(path.join(scoresDirectory, 'scores.json'));
for (const capture of [before, after]) {
  assert.equal(capture.data.source.inputsHash, inputs.sha256);
  assert.equal(capture.data.completed, 297);
  assert.deepEqual(capture.data.faults, []);
  assert.equal(new Set(capture.data.rows.map((r) => r.id)).size, 297);
}
assert.equal(scores.data.definition.inputsHash, inputs.sha256);
assert.equal(scores.data.definition.nativeCaptureHash, before.sha256);
assert.equal(scores.data.rows.length, 297);
assert.equal(inputs.data.set, 'm21');
assert.equal(
  await sourceHash(path.join(root, 'games/magic/src')),
  before.data.source.rendererHash,
  'Current semantic mask geometry changed',
);
assert.equal(after.data.source.rendererHash, before.data.source.rendererHash);
for (const key of ['packMetadata', 'rasterHelpers'])
  assert.deepEqual(after.data.source[key], before.data.source[key]);
const methodFiles = [
  'modern-rules-role-review.mjs',
  'modern-rules-role-objective.mjs',
  'text-filled-objective.mjs',
  'edges.mjs',
  'abu-type-objective.mjs',
];
const methods = await Promise.all(
  methodFiles.map(async (file) => [file, hash(await readFile(new URL(file, import.meta.url)))]),
);

const decoded = async (directory, asset) => {
  const raw = await readFile(path.join(directory, asset.file));
  assert.equal(hash(raw), asset.sha256);
  return PNG.sync.read(raw, { checkCRC: true });
};
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
const [rx, ry, w, h] = [39, 430, 410, 200],
  rows = [];
try {
  await server.ssrLoadModule('/games/magic/src/data/eager.ts');
  const { plateBasicSymbol } = await server.ssrLoadModule(
    '/games/magic/src/presentation/plate-basic-land.ts',
  );
  const { faceRects, faceFrame } = await server.ssrLoadModule(
    '/games/magic/src/presentation/special-frames.ts',
  );
  const { mountedSecurityStamp } = await server.ssrLoadModule(
    '/games/magic/src/presentation/security-stamp-paint.ts',
  );
  const beforeById = new Map(before.data.rows.map((r) => [r.id, r])),
    afterById = new Map(after.data.rows.map((r) => [r.id, r])),
    scoresById = new Map(scores.data.rows.map((r) => [r.id, r]));
  for (const entry of inputs.data.entries) {
    const face = entry.face,
      a = beforeById.get(entry.id),
      b = afterById.get(entry.id),
      reference = scoresById.get(entry.id);
    assert(a && b && reference);
    assert.equal(face.wordingMode, 'original');
    for (const row of [a, b]) {
      assert.equal(row.inputHash, hash(JSON.stringify(face)));
      assert.equal(row.referenceHash, entry.reference.sha256);
    }
    assert.equal(reference.referenceHash, entry.reference.sha256);
    const row = {
      id: entry.id,
      name: entry.card.name,
      number: entry.card.collector_number,
      inputHash: a.inputHash,
      referenceHash: a.referenceHash,
      beforeFaceHash: a.layers.face.sha256,
      afterFaceHash: b.layers.face.sha256,
      normalizedHash: reference.normalizedReference.sha256,
    };
    if (
      face.frameStyle === 'retro' ||
      face.frameTemplate ||
      faceFrame(face) !== 'normal' ||
      plateBasicSymbol(face) ||
      (face.layout && face.layout !== 'normal')
    )
      rows.push({ ...row, status: 'separate-basic-or-special-frame' });
    else {
      const scan = await decoded(scoresDirectory, reference.normalizedReference);
      assert.equal(scan.width, 488);
      assert.equal(scan.height, 680);
      const gray = Float32Array.from({ length: w * h }, (_, i) => {
        const k = ((Math.floor(i / w) + ry) * 488 + (i % w) + rx) * 4;
        return 0.2126 * scan.data[k] + 0.7152 * scan.data[k + 1] + 0.0722 * scan.data[k + 2];
      });
      const mask = new Uint8Array(w * h).fill(1);
      const exclude = ([x, y, sw, sh]) => {
        for (
          let py = Math.max(0, Math.floor(y - ry - 2));
          py < Math.min(h, Math.ceil(y + sh - ry + 2));
          py++
        )
          for (
            let px = Math.max(0, Math.floor(x - rx - 2));
            px < Math.min(w, Math.ceil(x + sw - rx + 2));
            px++
          )
            mask[py * w + px] = 0;
      };
      if (face.power != null && face.toughness != null)
        exclude(faceRects(face).stats.map((v, i) => v * (i % 2 ? 680 : 488)));
      const stamp = mountedSecurityStamp(face);
      if (stamp) exclude(stamp.rect);
      const paragraphs = face.rulesParagraphs;
      assert(Array.isArray(paragraphs));
      const objective = new RulesRoleObjective(gray, w, h, mask, {
        rules: paragraphs.some((p) => p.role === 'rules'),
        flavor: paragraphs.some((p) => p.role === 'flavor'),
      });
      const images = await Promise.all(
        [
          [beforeDirectory, a],
          [afterDirectory, b],
        ].map(async ([d, r]) => {
          const image = await decoded(d, r.layers.face);
          assert.equal(image.width, 732);
          assert.equal(image.height, 1020);
          return nativeGrayCrop(image, [rx, ry, w, h]);
        }),
      );
      const [oldFit, newFit] = images.map((g) => objective.score(g));
      rows.push({
        ...row,
        status: objective.status,
        before: oldFit,
        after: newFit,
        decision: roleFitDecision(oldFit, newFit),
      });
    }
  }
  const changed = rows.filter((r) => r.beforeFaceHash !== r.afterFaceHash);
  assert.deepEqual(
    await Promise.all(
      methodFiles.map(async (file) => [file, hash(await readFile(new URL(file, import.meta.url)))]),
    ),
    methods,
    'Role audit methods changed during execution',
  );
  assert.equal(rows.filter((r) => r.status === 'separate-basic-or-special-frame').length, 29);
  const report = {
    schema: 1,
    set: 'm21',
    status: 'role-preservation-diagnostic-not-production-adoption',
    definition: {
      inputsHash: inputs.sha256,
      beforeHash: before.sha256,
      afterHash: after.sha256,
      scoresHash: scores.sha256,
      region: [rx, ry, w, h],
      methods,
    },
    policy: {
      tolerance: 0.005,
      minimumGain: 0.05,
      note: 'Fixed reference-only divider with3px exclusion; no role can regress more than0.5/100 while another improves. At least one role must gain5/100. Neither role may worsen its scan line-count error. Missing/ambiguous dividers need review, never inferred from candidate.',
    },
    summary: {
      printings: rows.length,
      changed: changed.length,
      accepted: changed.filter((r) => r.decision?.accepted).length,
      statuses: Object.fromEntries(
        [...new Set(rows.map((r) => r.status))].map((s) => [
          s,
          rows.filter((r) => r.status === s).length,
        ]),
      ),
      changedReasons: Object.fromEntries(
        [...new Set(changed.map((r) => r.decision?.reason))].map((s) => [
          s,
          changed.filter((r) => r.decision?.reason === s).length,
        ]),
      ),
    },
    rows,
  };
  await writeJson(output, report);
  console.log(JSON.stringify(report.summary));
} finally {
  await server.close();
}
