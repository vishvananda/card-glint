// Actual native production ink expansion; no mask-scale prediction or new scan pose.
import assert from 'node:assert/strict';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { earlyManaInkPlugin } from './early-mana-ink-plugin.mjs';
import { root, sourceHash, hash, writeJson } from './common.mjs';
const [native, auditFile, definitionFile, currentFile, correctedDirectory, output] =
  process.argv.slice(2);
assert(
  output,
  'Usage: early-mana-ink-study.mjs NATIVE AUDIT NUMBER_DEFINITION CURRENT_INPUTS CORRECTED_HEADER OUT',
);
const raw = await Promise.all(
  [
    path.join(native, 'capture.json'),
    path.join(native, 'inputs.json'),
    auditFile,
    definitionFile,
    currentFile,
    path.join(correctedDirectory, 'review.json'),
  ].map((f) => readFile(f)),
);
const [capture, inputs, audit, definition, current, corrected] = raw.map((b) => JSON.parse(b));
assert.equal(definition.nativeCaptureHash, hash(raw[0]));
assert.equal(definition.nativeInputsHash, hash(raw[1]));
assert.equal(definition.auditHash, hash(raw[2]));
assert.equal(current.entries.length, inputs.entries.length);
const changedInputs = [];
for (const e of inputs.entries) {
  const c = current.entries.find((c) => c.id === e.id);
  assert(c);
  assert.equal(c.reference.sha256, e.reference.sha256);
  assert.equal(c.art.sha256, e.art.sha256);
  const fields = Object.keys({ ...e.face, ...c.face }).filter(
    (k) => !isDeepStrictEqual(e.face[k], c.face[k]),
  );
  if (fields.length) {
    assert.deepEqual(fields, ['manaSymbols']);
    assert.equal(e.name, 'Drain Life');
    assert.deepEqual(c.face.manaSymbols, ['1', 'B']);
    changedInputs.push(e.id);
  }
}
assert.equal(changedInputs.length, 1);
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), capture.source.rendererHash);
const profile = structuredClone(definition.candidates.find((c) => c.id === 'number-fit').profile);
profile.inkExpansion = { R: 0.4 };
const entries = inputs.entries
  .filter((e) => audit.rows.some((r) => r.id === e.id))
  .map((e) => ({ ...e, face: current.entries.find((c) => c.id === e.id).face }));
assert.equal(entries.length, 277);
const candidates = [{ id: 'current' }, { id: 'joint-fit', profile }];
await mkdir(output);
const transformed = {},
  rows = [];
const session = await openBrowser(
  { ...inputs, entries },
  { plugins: [earlyManaInkPlugin(transformed)] },
);
const source = {
  schema: 1,
  rendererHash: capture.source.rendererHash,
  nativeCaptureHash: hash(raw[0]),
  nativeInputsHash: hash(raw[1]),
  auditHash: hash(raw[2]),
  definitionHash: hash(raw[3]),
  currentInputsHash: hash(raw[4]),
  correctedHeaderHash: hash(raw[5]),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  pluginHash: hash(await readFile(new URL('./early-mana-ink-plugin.mjs', import.meta.url))),
  basePluginHash: hash(await readFile(new URL('./early-mana-trial-plugin.mjs', import.meta.url))),
  browser: session.browser.version(),
  scope:
    'All 277 original Unlimited costs, unchanged native painter and frozen frame-only scan poses. Current reviewed printing inputs including corrected Drain Life 1B. One joint palette/disc/glyph/numeral profile and R-only ink expansion. No per-card render fitting, runtime adoption, holdout or whole-card certification.',
};
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
  });
  for (const e of entries) {
    assert.equal(e.face.wordingMode, 'original');
    const prior = audit.rows.find((r) => r.id === e.id);
    const correctedRow = corrected.rows.find((r) => r.id === e.id);
    const expectedHash = correctedRow
      ? correctedRow.correctedFaceHash
      : capture.rows.find((r) => r.id === e.id).renderHash;
    const br = capture.rows.find((r) => r.id === e.id);
    const ar = audit.rows.find((r) => r.id === e.id);
    assert.equal(br.poseHash, hash(JSON.stringify(e.pose.transform)));
    assert.equal(ar.poseHash, br.poseHash);
    const beforeBytes = await readFile(
      correctedRow
        ? path.join(correctedDirectory, e.id + '-corrected.png')
        : path.join(native, e.set, e.id + '.png'),
    );
    assert.equal(hash(beforeBytes), expectedHash);
    const before = PNG.sync.read(beforeBytes);
    const rasters = await session.page.evaluate(
      async ({ e, candidates }) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const lease = await loadAccuracyImages(
          canvasAssetUrls(e.face),
          new AbortController().signal,
          e.face.illustration,
        );
        try {
          const result = [];
          for (const candidate of candidates) {
            const image = await composeCardTexture(
              {
                face: candidate.profile
                  ? { ...e.face, __earlyManaTrial: candidate.profile }
                  : e.face,
                printingId: e.id,
                printedImage: null,
              },
              'inspect',
              new AbortController().signal,
              { loadImages: async () => ({ ...lease, dispose() {} }) },
            );
            try {
              result.push(image.toDataURL().split(',')[1]);
            } finally {
              image.width = image.height = 0;
            }
          }
          return result;
        } finally {
          lease.dispose();
        }
      },
      { e, candidates },
    );
    const trials = [];
    for (let j = 0; j < rasters.length; j++) {
      const bytes = Buffer.from(rasters[j], 'base64'),
        im = PNG.sync.read(bytes);
      assert.deepEqual([im.width, im.height], [732, 1020]);
      if (!j) assert.equal(hash(bytes), expectedHash, 'Zero expansion changed ' + e.name);
      let changed = 0,
        outside = 0,
        alphaChanged = 0,
        headingChanged = 0;
      const left = Math.floor(432 - (e.face.manaSymbols.length - 1) * 28 - 19),
        top = 25,
        width = 458 - left,
        height = 43;
      for (let p = 0; p < 732 * 1020; p++) {
        const i = p * 4,
          x = p % 732,
          y = Math.floor(p / 732);
        if (before.data[i + 3] !== im.data[i + 3]) alphaChanged++;
        if (![0, 1, 2, 3].some((k) => before.data[i + k] !== im.data[i + k])) continue;
        changed++;
        if (
          !(
            (x >= left * 1.5 &&
              x < (left + width) * 1.5 &&
              y >= top * 1.5 &&
              y < (top + height) * 1.5) ||
            (x >= 53 * 1.5 && x < 445 * 1.5 && y >= 404 * 1.5 && y < 603 * 1.5)
          )
        ) {
          if (x >= 29 * 1.5 && x < 437 * 1.5 && y >= 29 * 1.5 && y < 70 * 1.5) headingChanged++;
          else outside++;
        }
      }
      assert.equal(outside, 0);
      assert.equal(alphaChanged, 0);
      if (j) assert(changed > 0, 'Inactive ink control ' + e.name);
      const file = e.id + '-' + candidates[j].id + '.png';
      await writeFile(path.join(output, file), bytes);
      trials.push({
        id: candidates[j].id,
        faceHash: hash(bytes),
        file,
        changed,
        outside,
        alphaChanged,
        headingChanged,
      });
    }
    rows.push({
      id: e.id,
      name: e.name,
      symbol: prior.symbol,
      cohort: prior.cohort,
      referenceHash: br.referenceHash,
      scanHash: br.scanHash,
      poseHash: br.poseHash,
      rect: [
        Math.floor(432 - (e.face.manaSymbols.length - 1) * 28 - 19),
        25,
        458 - Math.floor(432 - (e.face.manaSymbols.length - 1) * 28 - 19),
        43,
      ],
      currentInputChanged: changedInputs.includes(e.id),
      trials,
    });
    await writeJson(path.join(output, 'capture.json'), {
      source,
      transformed,
      candidates,
      changedInputs,
      total: entries.length,
      completed: rows.length,
      rows,
    });
    console.log(rows.length + '/' + entries.length, e.name);
  }
  assert.deepEqual(session.faults, []);
} finally {
  await session.close();
}
