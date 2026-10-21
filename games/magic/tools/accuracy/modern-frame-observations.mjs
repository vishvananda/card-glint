// Freeze frame-only scan observations before selecting a registration template.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir } from 'node:fs/promises';
import { createServer } from 'vite';
import { PNG } from 'pngjs';
import { root, hash, objectFile, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { scanBoundaryProfiles } from './scan-boundary-profiles.mjs';
const [inputFile, outputDirectory] = process.argv.slice(2);
assert(outputDirectory, 'Usage: modern-frame-observations.mjs INPUTS OUT');
const bytes = await readFile(inputFile),
  inputs = JSON.parse(bytes);
const bounds = { left: [0, 33], right: [455, 487], top: [0, 27], bottom: [625, 634] };
const windows = (vertical, horizontal, bottom) => ({
  left: ['x', 12, 33, vertical, 8],
  right: ['x', 455, 476, vertical, 8],
  top: ['y', 9, 23, horizontal, 8],
  bottom: ['y', 625, 639, bottom, 8],
});
const partitions = [
  windows([130, 210, 290], [90, 180, 320], [70, 130, 290]),
  windows([155, 235, 315], [120, 210, 350], [90, 150, 310]),
  windows([180, 260, 340], [150, 290, 380], [110, 170, 330]),
];
for (const side of Object.keys(bounds))
  for (let a = 0; a < 3; a++)
    for (let b = a + 1; b < 3; b++)
      for (const x of partitions[a][side][3])
        for (const y of partitions[b][side][3])
          assert(Math.abs(x - y) > 16, 'Independent strip footprints must not overlap');
const tools = Object.fromEntries(
  await Promise.all(
    ['modern-frame-observations.mjs', 'scan-boundary-profiles.mjs', 'pixels-pure.mjs'].map(
      async (f) => [f, hash(await readFile(new URL(f, import.meta.url)))],
    ),
  ),
);
const methodHash = hash(JSON.stringify({ tools, bounds, partitions }));
const server = await createServer({
  configFile: false,
  root,
  server: { middlewareMode: true, hmr: false },
});
const rows = [];
await mkdir(outputDirectory, { recursive: true });
try {
  await server.ssrLoadModule('/games/magic/src/data/eager.ts');
  await server.ssrLoadModule('/games/magic/src/data/eager-wording.ts');
  const { faceFrame } = await server.ssrLoadModule(
    '/games/magic/src/presentation/special-frames.ts',
  );
  const { resolveCardProfile } = await server.ssrLoadModule(
    '/games/magic/src/presentation/profile.ts',
  );
  for (const e of inputs.entries) {
    const reference = await readFile(objectFile(e.reference));
    assert.equal(hash(reference), e.reference.sha256);
    const image = normalize(PNG.sync.read(reference, { checkCRC: true }));
    const profile = resolveCardProfile(e.face),
      kind = faceFrame(e.face);
    const family = [kind, profile.legendary ? 'crown' : 'plain', profile.frame, profile.boxes].join(
      '/',
    );
    const observations = partitions.map((p) => scanBoundaryProfiles(image, p, bounds));
    // Replace every pixel outside every selected frame strip, including the
    // complete illustration, headings and rules. Profile bytes must stay exact.
    const changed = { ...image, data: image.data.slice() },
      allowed = new Uint8Array(488 * 680);
    for (const p of partitions)
      for (const [side, [axis, , , positions, halfSpan]] of Object.entries(p)) {
        for (const along of positions)
          for (let n = bounds[side][0]; n <= bounds[side][1]; n++)
            for (let a = along - halfSpan; a <= along + halfSpan; a++)
              allowed[(axis === 'x' ? a : n) * 488 + (axis === 'x' ? n : a)] = 1;
      }
    for (let i = 0; i < allowed.length; i++)
      if (!allowed[i]) changed.data.set([i % 251, (i * 3) % 251, (i * 7) % 251, 255], i * 4);
    for (let i = 0; i < partitions.length; i++)
      assert.deepEqual(
        scanBoundaryProfiles(changed, partitions[i], bounds),
        observations[i],
        e.card.name + ': content isolation',
      );
    rows.push({
      id: e.id,
      name: e.card.name,
      number: e.card.collector_number,
      oracleId: e.card.oracle_id,
      family,
      kind,
      profile,
      referenceHash: e.reference.sha256,
      nonfoilEligible: e.card.finishes.includes('nonfoil'),
      contentIsolationPassed: true,
      profiles: observations,
    });
  }
  const groups = Object.fromEntries(
    [...new Set(rows.map((r) => r.family))].sort().map((f) => {
      let r = rows.filter((r) => r.family === f);
      return [
        f,
        {
          printings: r.length,
          names: new Set(r.map((r) => r.oracleId)).size,
          nonfoil: r.filter((r) => r.nonfoilEligible).length,
          ids: r.map((r) => r.id),
        },
      ];
    }),
  );
  await writeJson(path.join(outputDirectory, 'observations.json'), {
    schema: 1,
    set: inputs.set,
    status: 'awaiting-full-strip-visual-review-and-template-certification',
    scope:
      'Scan-only census and renderer-resolved frame-family inventory. Disjoint extraction footprints and pixel isolation are verified; these proposed windows are not yet certified as visually content-free on every printing. No pose, calibration or completion claim.',
    inputHash: hash(bytes),
    methodHash,
    tools,
    bounds,
    partitions,
    groups,
    rows,
  });
  console.log(
    JSON.stringify({
      total: rows.length,
      families: Object.keys(groups).length,
      isolated: rows.length,
      nonfoil: rows.filter((r) => r.nonfoilEligible).length,
    }),
  );
} finally {
  await server.close();
}
