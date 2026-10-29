// Regional production-painter trials. No frame or scan pose is fitted here.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { openBrowser } from './browser.mjs';
import { cachedFetch } from './cache.mjs';
import { hash, root, sourceHash, objectFile, writeJson } from './common.mjs';
import { PNG } from 'pngjs';
import { normalize } from './pixels-pure.mjs';

const [inputFile, posesFile, cohortFile, developmentFile, out, definitionFile] =
  process.argv.slice(2);
assert(out, 'Use INPUTS POSES COHORTS PRIOR_DEVELOPMENT_NAMES NEW_OUTPUT');
await fs.mkdir(out);
const raw = await Promise.all(
  [inputFile, posesFile, cohortFile, developmentFile].map((f) => fs.readFile(f)),
);
const [input, poses, cohorts, development] = raw.map((b) => JSON.parse(b));
const prior = new Set(development.map((r) => r.name));
assert.equal(input.set, 'ons');
assert.equal(poses.inputHash, hash(raw[0]));
const toolHash = hash(await fs.readFile(new URL(import.meta.url)));
const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
const definitionBytes = definitionFile ? await fs.readFile(definitionFile) : undefined;
const definition = definitionBytes ? JSON.parse(definitionBytes) : undefined;
const entries = input.entries.filter(
  (e) =>
    e.face.power != null &&
    e.face.toughness != null &&
    (!definition?.calibrationOnly ||
      (!prior.has(e.name) && cohorts.rows.find((r) => r.id === e.id)?.cohort === 'calibration')),
);
const region = [374, 604, 80, 42];
const parameters = [{ id: 'released', weight: null, size: 28, width: 1.03, trim: 0.3, gray: 238 }];
for (const weight of [400, 700])
  for (const size of [27.5, 28, 28.5])
    for (const width of [1.01, 1.03, 1.05])
      parameters.push({
        id: [weight, size, width].join('-'),
        weight,
        size,
        width,
        trim: 0,
        gray: 250,
      });
if (definition) {
  assert(Array.isArray(definition.parameters) && definition.parameters[0]?.id === 'released');
  parameters.splice(0, parameters.length, ...definition.parameters);
}
const css = await fs.readFile(path.join(root, 'games/magic/fonts.css'), 'utf8');
const fonts = await Promise.all(
  [...new Set([...css.matchAll(/url\('([^']+)'\)/g)].map((m) => m[1]))].map((url) =>
    cachedFetch(url, { offline: true }),
  ),
);
const module = 'games/magic/src/calibration/profiles.ts';
const source = await fs.readFile(path.join(root, module), 'utf8');
const needle = 'return profileSets.includes(set) ? setCalibrationProfiles[set] : undefined;';
assert.equal(source.split(needle).length, 2);
const session = await openBrowser(
  { ...input, components: [...input.components, ...fonts] },
  {
    plugins: [
      {
        name: 'regional-stats-profile',
        enforce: 'pre',
        transform(code, id) {
          if (!id.endsWith('/' + module)) return;
          assert.equal(hash(code), hash(source));
          return code.replace(
            needle,
            'return (globalThis as any).__statsProfile?.set === set ? (globalThis as any).__statsProfile : profileSets.includes(set) ? setCalibrationProfiles[set] : undefined;',
          );
        },
      },
    ],
  },
);
const rows = [];
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    for (const weight of [400, 700])
      await document.fonts.load(weight + ' 28px "CardRenderer MTG MPlantin"');
  });
  for (const e of entries) {
    const pose = poses.rows.find((r) => r.id === e.id),
      cohort = cohorts.rows.find((r) => r.id === e.id);
    assert.equal(pose?.referenceHash, e.reference.sha256);
    if (!pose.accepted) {
      rows.push({ id: e.id, name: e.name, status: 'alignment-review' });
      continue;
    }
    const reference = await fs.readFile(objectFile(e.reference));
    assert.equal(hash(reference), e.reference.sha256);
    const scan = normalize(PNG.sync.read(reference), pose.transform);
    const cropped = new PNG({ width: region[2], height: region[3] });
    PNG.bitblt(
      { ...scan, data: Buffer.from(scan.data) },
      cropped,
      region[0],
      region[1],
      region[2],
      region[3],
      0,
      0,
    );
    const scanFile = e.id + '-scan.png';
    await fs.writeFile(path.join(out, scanFile), PNG.sync.write(cropped));
    const captures = await session.page.evaluate(
      async ({ e, parameters, region }) => {
        const { profile } = await import('/games/magic/src/calibration/sets/ons.ts');
        const { paintEarlyReprintFooter } = await import(
          '/games/magic/src/presentation/early-reprint-footer.ts'
        );
        const c = document.createElement('canvas');
        c.width = region[2] * 1.5;
        c.height = region[3] * 1.5;
        const context = c.getContext('2d');
        const result = [];
        for (const p of parameters) {
          globalThis.__statsProfile = {
            ...profile,
            footer: { ...profile.footer, stats: { ...profile.footer.stats, ...p } },
          };
          if (p.weight === null) delete globalThis.__statsProfile.footer.stats.weight;
          context.resetTransform();
          context.clearRect(0, 0, c.width, c.height);
          context.scale(1.5, 1.5);
          context.translate(-region[0], -region[1]);
          const face = {
            ...e.face,
            artist: '',
            legalText: '',
            collectorNumber: '',
            textInk: { stats: [{ start: 0, color: '#fff' }] },
          };
          if (!paintEarlyReprintFooter(context, face))
            throw Error('Missing ordinary footer adapter');
          result.push({ id: p.id, png: c.toDataURL().split(',')[1] });
        }
        c.width = c.height = 0;
        return result;
      },
      { e, parameters, region },
    );
    for (const cap of captures)
      await fs.writeFile(
        path.join(out, e.id + '-' + cap.id + '.png'),
        Buffer.from(cap.png, 'base64'),
      );
    rows.push({
      id: e.id,
      name: e.name,
      material: e.material,
      power: e.face.power,
      toughness: e.face.toughness,
      cohort: prior.has(e.name) ? 'reused-development' : cohort.cohort,
      status: 'measured',
      inputHash: hash(JSON.stringify(e.face)),
      referenceHash: e.reference.sha256,
      poseHash: hash(JSON.stringify(pose.transform)),
      scanFile,
      captures: captures.map((c) => ({ parameter: c.id, file: e.id + '-' + c.id + '.png' })),
    });
    if (rows.length % 25 === 0) console.log(rows.length, '/', entries.length);
  }
  assert.deepEqual(session.faults, []);
} finally {
  await session.close();
}
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), rendererHash);
assert.equal(hash(await fs.readFile(new URL(import.meta.url))), toolHash);
await writeJson(path.join(out, 'study.json'), {
  schema: 1,
  status: 'regional-stats-candidates-not-adopted',
  source: {
    rendererHash,
    ...(definitionBytes ? { definition: hash(definitionBytes) } : {}),
    inputs: hash(raw[0]),
    poses: hash(raw[1]),
    cohorts: hash(raw[2]),
    priorDevelopment: hash(raw[3]),
    tool: toolHash,
  },
  scope:
    'Original printing inputs; frozen scan-only poses. Production footer paints isolated white ink at native scale, without frame texture or shadow. Prior eight development names are explicitly reused; remaining name cohorts are reserved for this study, not unseen to earlier set work. Placement trials are comparison-only and cannot alter the stored scan transforms.',
  region,
  parameters,
  rows,
});
console.log('Completed', rows.length, 'creatures');
