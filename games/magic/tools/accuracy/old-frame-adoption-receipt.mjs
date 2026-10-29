import { format } from 'prettier';
import { createServer } from 'vite';
// Bundle exact source ancestry and native installation evidence, without artwork.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync, gzipSync } from 'node:zlib';
import { root, hash, sourceHash } from './common.mjs';
const [study, beforeRoot, output] = process.argv.slice(2);
assert(output, 'Use STUDY_DIRECTORY BEFORE_SOURCE_ROOT NEW_RECEIPT');
await fs.access(output).then(
  () => {
    throw Error('Receipt exists');
  },
  (e) => {
    if (e.code !== 'ENOENT') throw e;
  },
);
const read = async (file) => JSON.parse(await fs.readFile(path.join(study, file)));
const snapshot = JSON.parse(
  gunzipSync(await fs.readFile(path.join(study, 'mir-ons-before-promotion-075.json.gz'))),
);
const beforeRenderer = await sourceHash(path.join(beforeRoot, 'games/magic/src'));
const afterRenderer = await sourceHash(path.join(root, 'games/magic/src'));
assert.equal(beforeRenderer, '8070c1de1259548470c4b7735a442936f0d215f9a4783eb9ab9f5dd675ed3f83');
const current = (
  await fs.readdir(path.join(root, 'games/magic/src'), { recursive: true, withFileTypes: true })
)
  .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
  .map((e) => path.relative(root, path.join(e.parentPath, e.name)))
  .sort();
const extras = [
  'games/magic/tools/build-set-data.mjs',
  'games/magic/tools/accuracy/old-frame-source-ancestry.mjs',
  'games/magic/tools/accuracy/calibration-report.mjs',
  'games/magic/fixtures/accuracy/printing-review-catalog.json',
  'games/magic/fixtures/accuracy/review-source-index.json',
  'games/magic/fixtures/accuracy/mir/annotations-zz-calibration-075.json',
  'games/magic/fixtures/accuracy/ons/annotations-zz-calibration-075.json',
];
const previous = current
  .filter((f) => Object.hasOwn(snapshot, f))
  .map((f) => [path.relative('games/magic/src', f), hash(snapshot[f])]);
assert.equal(hash(JSON.stringify(previous)), beforeRenderer, 'Parent snapshot differs');
const files = {};
for (const file of [...new Set([...Object.keys(snapshot), ...current, ...extras])].sort()) {
  const afterSource = await fs.readFile(path.join(root, file), 'utf8');
  let beforeSource = snapshot[file];
  if (beforeSource === undefined) {
    try {
      beforeSource = await fs.readFile(path.join(beforeRoot, file), 'utf8');
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
      beforeSource = null;
    }
  }
  if (beforeSource === afterSource) continue;
  files[file] = {
    before: beforeSource === null ? null : hash(beforeSource),
    after: hash(afterSource),
    beforeSource,
  };
}
const controls = await read('adoption-foreign-native-v7.json');
assert.equal(controls.afterHash, afterRenderer);
assert.equal(controls.beforeHash, beforeRenderer);
const completed = await read('default-installed-v4/complete.json');
assert(completed.complete);
assert.equal(completed.rendererHash, afterRenderer);
const sets = await Promise.all(
  completed.sets.map((code) => read('default-installed-v4/' + code + '.json')),
);
for (const set of sets) {
  assert.equal(set.source.rendererHash, afterRenderer);
  assert(set.afterMean100 >= set.beforeMean100, set.set + ': default score regressed');
  assert(set.rows.every((r) => r.footerUnchanged));
}
const sum = (k) => sets.reduce((a, s) => a + s[k], 0);
const printings = {};
for (const set of ['mir', 'ons']) {
  const native = await read(set + '-installed-native-v3/capture.json');
  const original = await read(set + '-public-source-parity-v5.json');
  assert.equal(native.source.rendererHash, afterRenderer);
  assert.equal(original.source.renderer, afterRenderer);
  printings[set] = { native, original };
}
// Final pigment selection must reproduce the frozen color-only prototypes.
// Everything without a selected pigment change must stay byte-identical.
const prototypes = await read('default-colors-v1/capture.json');
const paletteServer = await createServer({
  configFile: false,
  server: { middlewareMode: true, hmr: false },
});
let choices;
try {
  choices = (
    await paletteServer.ssrLoadModule('/games/magic/src/calibration/old-frame-default-values.ts')
  ).oldFrameDefaults;
} finally {
  await paletteServer.close();
}
const pigmentParity = [];
for (const set of sets) {
  const previous = await read('default-installed-v1/' + set.set + '.json');
  const choice = choices[set.set];
  for (const row of set.rows) {
    if (choice.pigment?.[row.material]) {
      pigmentParity.push({
        id: row.id,
        set: set.set,
        status: 'native-pigment-supplement',
        sha256: row.sha256,
      });
      continue;
    }
    const mode = choice.materialPalettes?.[row.material] ?? choice.palette;
    let expected, status;
    if (mode) {
      expected = prototypes.rows.find((r) => r.id === row.id && r.variant === mode)?.sha256;
      status = expected ? 'exact-color-prototype' : 'rejected-reference-no-color-prototype';
      if (!expected) assert.equal(row.status, 'rejected-normalization');
    } else {
      expected = previous.rows.find((r) => r.id === row.id)?.sha256;
      assert(expected);
      status = 'unchanged-previous-native';
    }
    if (expected)
      assert.equal(row.sha256, expected, row.name + ': color choice changed other native content');
    pigmentParity.push({ id: row.id, set: set.set, status, sha256: row.sha256 });
  }
}
const tools = {};
for (const name of [
  'old-frame-installed-default-study.mjs',
  'old-frame-installed-capture.mjs',
  'old-frame-public-source-parity.mjs',
  'old-frame-adoption-controls.mjs',
  'old-frame-adoption-receipt.mjs',
  'old-frame-default-color-study.mjs',
  'old_frame_default_color_review.py',
  'old_frame_default_color_refit.py',
  'old_frame_default_color_native_review.py',
]) {
  const f = 'games/magic/tools/accuracy/' + name;
  tools[f] = hash(await fs.readFile(path.join(root, f)));
}
assert.equal(
  controls.source.toolHash,
  tools['games/magic/tools/accuracy/old-frame-adoption-controls.mjs'],
);
assert.equal(
  completed.toolHash,
  tools['games/magic/tools/accuracy/old-frame-installed-default-study.mjs'],
);
for (const p of Object.values(printings)) {
  assert.equal(
    p.native.source.toolHash,
    tools['games/magic/tools/accuracy/old-frame-installed-capture.mjs'],
  );
  assert.equal(
    p.original.source.tool,
    tools['games/magic/tools/accuracy/old-frame-public-source-parity.mjs'],
  );
}
const data = {
  schema: 1,
  kind: 'mir-ons-and-major-old-frame-default-adoption',
  beforeRenderer,
  afterRenderer,
  scope:
    'Exact production installation and immutable shared defaults. Native Original faces equal the reviewed complete candidates; all pilot faces preserve target footer commands. This receipt preserves historical source identity for unaffected sets. It does not approve inherited defaults as independent set calibrations, certify rejected scan poses or publish a release.',
  affectedSets: ['mir', 'ons', ...sets.map((s) => s.set).filter((s) => s !== 'ice')].sort(),
  files,
  tools,
  controls,
  printings,
  defaults: {
    sets,
    total: sum('total'),
    measured: sum('measured'),
    rejected: sum('rejected'),
    footerUnchanged: sum('footerUnchanged'),
  },
  pigments: {
    nativeParity: pigmentParity,
    choices: await read('default-color-review-v1.json'),
    supplement: await read('default-7ed-pigment-refit-v1.json'),
    native: await read('default-7ed-pigment-native-v2.json'),
  },
};
assert.equal(data.defaults.total, 778);
assert.equal(data.defaults.measured, 526);
assert.equal(
  data.pigments.native.tool,
  tools['games/magic/tools/accuracy/old_frame_default_color_native_review.py'],
);
const bytes = gzipSync(JSON.stringify(data, null, 2) + '\n', { level: 9, mtime: 0 });
await fs.writeFile(output, bytes, { flag: 'wx' });
const latest = JSON.parse(
  await fs.readFile(
    path.join(root, 'games/magic/fixtures/accuracy/mirage-onslaught/latest-native-candidates.json'),
  ),
);
const initial = JSON.parse(
  await fs.readFile(
    path.join(root, 'games/magic/fixtures/accuracy/mirage-onslaught/component-fit-study.json'),
  ),
);
const review = {
  schema: 1,
  status: 'installed-native-calibrations-release-pending',
  plannedVersion: '0.7.5',
  rendererHash: afterRenderer,
  receipt: hash(bytes),
  scope:
    'All ordinary Original native faces have been installed and replayed. Structural indices are out of100; artist/footer checks remain separate from the structural metric. Seven scans retain rejected normalization and receive no fabricated score. Shared defaults are measured starting points, not independent calibrations.',
  sets: Object.fromEntries(
    ['mir', 'ons'].map((set) => [
      set,
      {
        printings: printings[set].native.rows.length,
        scored: latest.sets[set].summary.measured,
        rejected: latest.sets[set].rejected,
        before100: initial.sets[set].baseline074.structuralMean100,
        after100: latest.sets[set].summary.structuralMean100,
        components: latest.sets[set].summary.components,
        materials: latest.sets[set].materials,
        metricReuse:
          'Exact complete-native-candidate pixel identity, unchanged scan poses and metric graph',
      },
    ]),
  ),
  defaults: sets.map((s) => ({
    set: s.set,
    geometry: choices[s.set].donor,
    palette: choices[s.set].palette ?? choices[s.set].donor,
    sampled: s.total,
    scored: s.measured,
    rejected: s.rejected,
    before100: s.beforeMean100,
    after100: s.afterMean100,
    preserved: choices[s.set].retain,
    targetFooterPreserved: s.footerUnchanged,
  })),
  pending: [
    'Bind the current ledger and score revision, including rejected-reference explanations.',
    'Finish historical regression checks and publish0.7.5 with the Lab update.',
  ],
};
await fs.writeFile(
  path.join(path.dirname(output), 'installed-review.json'),
  await format(JSON.stringify(review), { parser: 'json', printWidth: 100 }),
  { flag: 'wx' },
);

console.log(
  JSON.stringify(
    {
      receipt: hash(bytes),
      beforeRenderer,
      afterRenderer,
      files: Object.keys(files).length,
      sets: sets.length,
      total: sum('total'),
      measured: sum('measured'),
      bytes: bytes.length,
    },
    null,
    2,
  ),
);
