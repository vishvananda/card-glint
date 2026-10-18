import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { PNG } from 'pngjs';
import { measureCornerRadius } from '../games/magic/tools/accuracy/corner-radius.mjs';
import { checkSetProfile } from '../games/magic/tools/accuracy/set-profile-check.mjs';
import { searchCalibration } from '../games/magic/tools/accuracy/calibration-search.mjs';
import { validateCalibrationStudy } from '../games/magic/tools/accuracy/calibration-evidence.mjs';

const circle = new PNG({ width: 200, height: 280 });
for (let y = 0; y < 280; y++)
  for (let x = 0; x < 200; x++) {
    const r = 9,
      dx = Math.max(r - Math.min(x + 0.5, 199.5 - x), 0),
      dy = Math.max(r - Math.min(y + 0.5, 279.5 - y), 0);
    circle.data[(y * 200 + x) * 4 + 3] = Math.round(
      Math.max(0, Math.min(1, 0.5 - (Math.hypot(dx, dy) - r))) * 255,
    );
  }
const measured = measureCornerRadius(circle);
assert.ok(Math.abs(measured.best.radius - 0.045) < 0.001);
assert.ok(measured.proposed.alphaMAE < measured.previous.alphaMAE);
assert.throws(
  () => measureCornerRadius({ width: 200, height: 280, data: Buffer.alloc(200 * 280 * 4, 255) }),
  /No transparent/,
);

const optimum = await searchCalibration(
  { x: 0, y: 0 },
  [
    { key: 'x', min: -4, max: 4, steps: [1, 0.5, 0.25] },
    { key: 'y', min: -4, max: 4, steps: [1, 0.5, 0.25] },
  ],
  (p) => -((p.x - 1.75) ** 2 + (p.y + 2.5) ** 2),
);
assert.deepEqual(optimum.values, { x: 1.75, y: -2.5 });
assert.equal(optimum.exhausted, false);
assert.deepEqual(optimum.boundary, []);
const bounded = await searchCalibration(
  { x: 0 },
  [{ key: 'x', min: -1, max: 1, steps: [0.5] }],
  (p) => p.x,
);
assert.deepEqual(bounded.boundary, ['x']);
await assert.rejects(
  () => searchCalibration({ x: 0 }, [{ key: 'x', min: 0, max: 1, steps: [0.1] }], () => NaN),
  /Non-finite/,
);

const study = JSON.parse(
  await readFile('games/magic/tools/accuracy/calibration-study-example.json'),
);
validateCalibrationStudy(study);
const sample = study.entries[0];
sample.normalization = {
  accepted: true,
  referenceHash: sample.reference.sha256,
  templateHash: '1'.repeat(64),
  methodHash: '2'.repeat(64),
  transform: { matrix: [1, 0, 0, 1, 0, 0] },
};
validateCalibrationStudy(study);
const bad = structuredClone(study);
bad.entries[0].face.wordingMode = 'oracle';
assert.throws(() => validateCalibrationStudy(bad));
bad.entries[0].face.wordingMode = 'original';
bad.entries[0].wordingEvidence.rules = 'oracle';
assert.throws(() => validateCalibrationStudy(bad));
const leak = structuredClone(study);
leak.entries.push({ ...sample, id: '00000000-0000-0000-0000-000000000002', cohort: 'validation' });
assert.throws(() => validateCalibrationStudy(leak), /leaked/);
const wording = structuredClone(study);
wording.entries[0].regions[0].fields = ['type'];
assert.throws(() => validateCalibrationStudy(wording), /Unreviewed/);

const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true },
});
try {
  const { faceCornerRadius } = await server.ssrLoadModule(
    '/games/magic/src/presentation/face-silhouette.ts',
  );
  const { cardTextureKey } = await server.ssrLoadModule(
    '/games/magic/src/presentation/canvas-face.ts',
  );
  const { setCalibrationProfiles } = await server.ssrLoadModule(
    '/games/magic/src/calibration/profiles.ts',
  );
  const { printingManaDefaults } = await server.ssrLoadModule(
    '/games/magic/src/presentation/printing-mana-adjustment.ts',
  );
  const manifest = JSON.parse(await readFile('games/magic/assets.json'));
  const { calibratedBodyLayout } = await server.ssrLoadModule(
    '/games/magic/src/calibration/body.ts',
  );
  const context = {
    font: '20px serif',
    save() {},
    restore() {},
    measureText(text) {
      const size = Number(this.font.match(/([0-9.]+)px/)[1]);
      return {
        width: text.length * size * 0.5,
        actualBoundingBoxAscent: size * 0.8,
        actualBoundingBoxDescent: size * 0.2,
        actualBoundingBoxLeft: 0,
        actualBoundingBoxRight: text.length * size * 0.5,
      };
    },
  };
  const body = {
    bounds: { x: 70, y: 420, width: 348, height: 175 },
    maximumSize: 22,
    minimumSize: 15,
    typography: { leading: 1, paragraphGap: 0.25, flavorGap: 0.8 },
    centered: { maxCharacters: 100, maxLines: 3, maximumSize: 25 },
  };
  const short = [{ role: 'rules', runs: [{ text: 'Flying' }] }];
  const long = [{ role: 'rules', runs: [{ text: 'Long rules '.repeat(40) }] }];
  const centered = calibratedBodyLayout(context, { name: 'Test' }, body, short, short);
  assert.equal(centered.size, 25);
  const left = calibratedBodyLayout(
    context,
    { name: 'Test', rulesAlignment: { mode: 'left' } },
    body,
    short,
    short,
  );
  assert.equal(left.size, 22);
  assert.ok(centered.lines[0].x > left.lines[0].x);
  const originalReference = calibratedBodyLayout(
    context,
    { name: 'Test', wordingMode: 'oracle' },
    body,
    long,
    short,
  );
  const oracleReference = calibratedBodyLayout(
    context,
    { name: 'Test', wordingMode: 'oracle' },
    body,
    long,
    long,
  );
  assert.ok(originalReference.lines.length > 3);
  assert.ok(oracleReference.size <= 22);

  for (const [set, profile] of Object.entries(setCalibrationProfiles)) {
    const { review } = await server.ssrLoadModule(`/games/magic/src/calibration/sets/${set}.ts`);
    checkSetProfile(profile, review, manifest);
    const stale = structuredClone(profile);
    stale.frames.W.frame[0] += 0.001;
    assert.throws(() => checkSetProfile(stale, review, manifest), /Stale color/);
  }
  for (const setCode of ['leb', '2ed', '3ed', '4ed', 'fem', 'chr', '7ed', '8ed', 'm21', 'fdn'])
    assert.equal(faceCornerRadius({ name: 'Probe', setCode }), 0.045);
  assert.equal(faceCornerRadius({ name: 'Probe', setCode: 'LEA' }), 0.058);
  assert.equal(faceCornerRadius({ name: 'Probe', setCode: 'lea', frameStyle: 'modern' }), 0.045);
  assert.equal(faceCornerRadius({ name: 'Probe', frameStyle: 'retro' }), 0.045);
  const face = {
    name: 'Profile probe',
    setCode: 'fem',
    typeLine: 'Summon Creature',
    colors: ['W'],
    symbolStyle: 'original',
  };
  const input = { face, printingId: null, printedImage: null };
  const key = cardTextureKey(input, 'inspect');
  const p = setCalibrationProfiles.fem,
    prior = p.mana.geometry.dx,
    revision = p.revision;
  try {
    p.mana.geometry.dx += 0.25;
    p.revision++;
    assert.equal(printingManaDefaults(face).dx, prior + 0.25);
    assert.notEqual(cardTextureKey(input, 'inspect'), key);
  } finally {
    p.mana.geometry.dx = prior;
    p.revision = revision;
  }
  assert.equal(cardTextureKey(input, 'inspect'), key);
} finally {
  await server.close();
}
console.log(
  'Corner policy, one-file values/cache identity, frozen study inputs, failure gates and bounded search pass.',
);
