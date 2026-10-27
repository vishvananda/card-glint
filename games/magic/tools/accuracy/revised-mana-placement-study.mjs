// Native retained-callback search of cost position/pitch; glyphs and color stay fixed.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { root, hash, sourceHash, objectFile, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { openBrowser } from './browser.mjs';
import { earlyManaRetainedPlugin } from './early-mana-retained-plugin.mjs';
const [inputFile, poseFile, nativeDirectory, ringFile, output, mode = 'pilot'] =
  process.argv.slice(2);
assert(
  output && ['pilot', 'full'].includes(mode),
  'Usage: revised-mana-placement-study.mjs INPUTS POSES NATIVE RINGS NEW_OUTPUT [pilot|full]',
);
const files = [inputFile, poseFile, path.join(nativeDirectory, 'capture.json'), ringFile],
  bytes = await Promise.all(files.map((f) => fs.readFile(f))),
  [inputs, poses, capture, rings] = bytes.map((b) => JSON.parse(b)),
  rendererHash = await sourceHash(path.join(root, 'games/magic/src')),
  modules = [
    'abu-mana-study-browser.mjs',
    'abu-type-objective.mjs',
    'pixels-pure.mjs',
    'scan-transform.mjs',
    'metrics.mjs',
    'early-mana-retained-plugin.mjs',
    'early-mana-trial-plugin.mjs',
    'edges.mjs',
    'browser.mjs',
    'abu-assets.mjs',
  ],
  identities = async () =>
    Object.fromEntries(
      await Promise.all(
        modules.map(async (n) => [n, hash(await fs.readFile(new URL(n, import.meta.url)))]),
      ),
    ),
  moduleHashes = await identities(),
  toolHash = hash(await fs.readFile(new URL(import.meta.url))),
  proof = {},
  rows = [],
  candidates = [
    { name: 'current', delta: {} },
    ...[-0.25, 0, 0.25, 0.5, 0.75, 1].flatMap((dx) =>
      [-0.25, 0, 0.25].flatMap((dy) =>
        [-0.125, 0, 0.125].flatMap((spacing) =>
          dx || dy || spacing
            ? [{ name: 'placement/' + [dx, dy, spacing].join('/'), delta: { dx, dy, spacing } }]
            : [],
        ),
      ),
    ),
  ];
assert.equal(inputs.set, '3ed');
assert.equal(capture.rendererHash, rendererHash);
assert.equal(rings.rendererHash, rendererHash);
assert.equal(capture.status, 'complete');
assert.equal(capture.inputHash, hash(bytes[0]));
assert.equal(rings.sources.inputs, hash(bytes[0]));
assert.equal(rings.sources.poses, hash(bytes[1]));
assert.equal(rings.sources.capture, hash(bytes[2]));
await fs.writeFile(output, JSON.stringify({ status: 'running' }), { flag: 'wx' });
const session = await openBrowser(
  { ...inputs, components: [...(inputs.components ?? []), ...capture.extraAssets] },
  { plugins: [earlyManaRetainedPlugin(proof)] },
);
try {
  for (const material of ['W', 'U', 'B', 'R', 'G', 'A']) {
    const eligible = rings.rows.filter((r) => r.material === material && r.discs.length),
      selected =
        mode === 'full'
          ? eligible
          : ['calibration', 'validation'].flatMap((cohort) =>
              eligible
                .filter((r) => r.cohort === cohort)
                .sort((a, b) => hash('placement/' + a.id).localeCompare(hash('placement/' + b.id)))
                .slice(0, cohort === 'calibration' ? 3 : 2),
            );
    for (const r of selected) {
      const e = inputs.entries.find((e) => e.id === r.id),
        p = poses.groups[material].rows.find((p) => p.id === r.id),
        n = capture.rows.find((n) => n.id === r.id),
        refBytes = await fs.readFile(objectFile(e.reference));
      assert(p.accepted);
      assert.equal(hash(refBytes), r.referenceHash);
      assert.equal(hash(JSON.stringify(p.transform)), r.poseHash);
      assert.equal(r.nativeHash, n.modes.original.sha256);
      const scan = normalize(PNG.sync.read(refBytes), p.transform),
        url =
          'data:image/png;base64,' +
          PNG.sync
            .write({ width: 488, height: 680, data: Buffer.from(scan.data) })
            .toString('base64'),
        value = await session.page.evaluate(
          async ({ e, url, candidates }) => {
            const { measure } = await import(
                '/games/magic/tools/accuracy/abu-mana-study-browser.mjs'
              ),
              v = await measure(e, url, candidates),
              b = Uint8Array.from(atob(v.nativePng), (v) => v.charCodeAt(0)),
              fullHash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', b))]
                .map((v) => v.toString(16).padStart(2, '0'))
                .join('');
            delete v.nativePng;
            return { ...v, fullHash };
          },
          { e, url, candidates },
        );
      assert.equal(value.fullHash, n.modes.original.sha256);
      assert.equal(value.parity, 0);
      assert.equal(value.regionParity, 0);
      assert.equal(value.candidateParity, 0);
      assert.equal(value.scores.length, candidates.length);
      rows.push({
        id: e.id,
        name: e.name,
        material,
        cohort: r.cohort,
        referenceHash: r.referenceHash,
        poseHash: r.poseHash,
        nativeHash: r.nativeHash,
        ...value,
      });
      console.log('Native cost placement', rows.length, e.name);
    }
  }
  const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length,
    groups = Object.fromEntries(
      ['all', 'W', 'U', 'B', 'R', 'G', 'A'].map((material) => {
        const rs = rows.filter((r) => material === 'all' || r.material === material),
          cal = rs.filter((r) => r.cohort === 'calibration'),
          objective = (i) =>
            mean(cal.map((r) => r.scores[i])) -
            0.25 * Math.max(0, ...cal.map((r) => r.scores[0] - r.scores[i]));
        let index = 0;
        for (let i = 1; i < candidates.length; i++) if (objective(i) > objective(index)) index = i;
        const summary = Object.fromEntries(
          ['all', 'calibration', 'validation'].map((cohort) => {
            const list = rs.filter((r) => cohort === 'all' || r.cohort === cohort),
              d = list.map((r) => r.scores[index] - r.scores[0]);
            return [
              cohort,
              {
                cards: list.length,
                before100: 100 * mean(list.map((r) => r.scores[0])),
                after100: 100 * mean(list.map((r) => r.scores[index])),
                gains: d.filter((v) => v > 0).length,
                losses: d.filter((v) => v < 0).length,
                worstLoss100: 100 * Math.max(0, ...d.map((v) => -v)),
              },
            ];
          }),
        );
        return [
          material,
          { index, candidate: candidates[index], calibrationObjective: objective(index), summary },
        ];
      }),
    );
  assert.deepEqual(session.faults, []);
  assert.equal(await sourceHash(path.join(root, 'games/magic/src')), rendererHash);
  assert.deepEqual(await identities(), moduleHashes);
  assert.equal(hash(await fs.readFile(new URL(import.meta.url))), toolHash);
  await writeJson(output, {
    schema: 1,
    status: 'native-cost-placement-' + mode + '-not-adopted',
    scope:
      'Fixed accepted frame poses and Original wording. Cost callbacks and a changed public-control sentinel must reproduce native full-card pixels exactly. Only dx/dy/spacing vary; disc size, glyphs,numerals and pigments stay fixed. Edge objective measures the row; independent circle data remains separate. Calibration-only mean-minus-quarter-worst-loss selector; validation names are reused development data. No runtime defaults or certification changes.',
    rendererHash,
    toolHash,
    modules: moduleHashes,
    sources: Object.fromEntries(files.map((f, i) => [path.basename(f), hash(bytes[i])])),
    proof,
    mode,
    candidates,
    groups,
    rows,
    faults: session.faults,
  });
  console.log(JSON.stringify(groups));
} finally {
  await session.close();
}
