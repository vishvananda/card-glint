// Replay only changed printed header values with the frozen native painter.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { isDeepStrictEqual } from 'node:util';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { root, sourceHash, hash, writeJson } from './common.mjs';
import { normalize, cropGray } from './pixels-pure.mjs';
import { JsTextObjective, nativeGrayCrop } from './abu-type-objective.mjs';
import { earlyManaTrialPlugin } from './early-mana-trial-plugin.mjs';
const [nativeDirectory, currentFile, profileDefinition, out] = process.argv.slice(2);
assert(out, 'Usage: early-header-input-review.mjs NATIVE CURRENT_INPUTS PROFILE_DEFINITION OUT');
const raw = await Promise.all(
  [
    path.join(nativeDirectory, 'capture.json'),
    path.join(nativeDirectory, 'inputs.json'),
    currentFile,
    profileDefinition,
  ].map((f) => readFile(f)),
);
const [capture, inputs, current, definition] = raw.map((b) => JSON.parse(b));
assert.equal(capture.source.rendererHash, await sourceHash(path.join(root, 'games/magic/src')));
assert.deepEqual(current.entries.map((e) => e.id).sort(), inputs.entries.map((e) => e.id).sort());
const assets = new Map(inputs.components.map((c) => [c.url, c.sha256]));
for (const a of current.components) assert.equal(assets.get(a.url), a.sha256);
const changes = [];
for (const e of inputs.entries) {
  const after = current.entries.find((x) => x.id === e.id);
  assert.equal(e.reference.sha256, after.reference.sha256);
  assert.equal(e.art.sha256, after.art.sha256);
  const fields = Object.keys({ ...e.face, ...after.face })
    .filter((k) => !isDeepStrictEqual(e.face[k], after.face[k]))
    .sort();
  if (fields.length) {
    assert.deepEqual(fields, ['manaSymbols'], 'Broader wording replay required: ' + e.name);
    changes.push({ before: e, after: { ...after, pose: e.pose, set: e.set, name: e.name } });
  }
}
assert(changes.length > 0);
await mkdir(out);
const transformed = {},
  session = await openBrowser(
    { ...inputs, entries: changes.map((c) => c.before) },
    { plugins: [earlyManaTrialPlugin(transformed)] },
  ),
  rows = [];
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
  });
  for (const { before, after } of changes) {
    const c = capture.rows.find((r) => r.id === before.id);
    assert(
      before.pose.accepted &&
        before.face.wordingMode === 'original' &&
        after.face.wordingMode === 'original',
    );
    assert.equal(c.poseHash, hash(JSON.stringify(before.pose.transform)));
    const profiles = [
      before.face,
      after.face,
      { ...after.face, __earlyManaTrial: definition.candidates.at(-1).profile },
    ];
    const values = await session.page.evaluate(
      async ({ entry, profiles }) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const lease = await loadAccuracyImages(
            profiles.flatMap(canvasAssetUrls),
            new AbortController().signal,
            entry.face.illustration,
          ),
          result = [];
        try {
          for (const face of profiles) {
            const im = await composeCardTexture(
              { face, printingId: entry.id, printedImage: null },
              'inspect',
              new AbortController().signal,
              { loadImages: async () => ({ ...lease, dispose() {} }) },
            );
            try {
              result.push(im.toDataURL().split(',')[1]);
            } finally {
              im.width = im.height = 0;
            }
          }
        } finally {
          lease.dispose();
        }
        return result;
      },
      { entry: before, profiles },
    );
    const bytes = values.map((s) => Buffer.from(s, 'base64')),
      images = bytes.map((b) => PNG.sync.read(b));
    assert.equal(hash(bytes[0]), c.renderHash);
    let changed = 0,
      outsideHeader = 0,
      bodyChanged = 0,
      alphaChanged = 0;
    for (let p = 0; p < 732 * 1020; p++) {
      const at = p * 4,
        x = p % 732,
        y = Math.floor(p / 732);
      if (images[0].data[at + 3] !== images[1].data[at + 3]) alphaChanged++;
      if (![0, 1, 2, 3].some((k) => images[0].data[at + k] !== images[1].data[at + k])) continue;
      changed++;
      if (!(x >= 43.5 && x < 687 && y >= 37.5 && y < 105)) outsideHeader++;
      if (x >= 79.5 && x < 667.5 && y >= 606 && y < 904.5) bodyChanged++;
    }
    assert(changed > 0);
    assert.equal(outsideHeader, 0);
    assert.equal(bodyChanged, 0);
    assert.equal(alphaChanged, 0);
    const scanBytes = await readFile(
      path.join(nativeDirectory, before.set, before.id + '-scan.png'),
    );
    assert.equal(hash(scanBytes), c.scanHash);
    // Fixed union window penalizes the removed extra symbol instead of cropping it away.
    const maxCount = Math.max(before.face.manaSymbols.length, after.face.manaSymbols.length),
      left = Math.floor(432 - (maxCount - 1) * 28 - 19),
      rect = [left, 25, 458 - left, 43];
    const objective = new JsTextObjective(
      cropGray(normalize(PNG.sync.read(scanBytes)), rect).gray,
      rect[2],
      rect[3],
    );
    const scores = images.map((im) => objective.score(nativeGrayCrop(im, rect))[0]);
    for (const [i, label] of [
      [1, 'corrected'],
      [2, 'prototype'],
    ])
      await writeFile(path.join(out, before.id + '-' + label + '.png'), bytes[i]);
    rows.push({
      id: before.id,
      name: before.name,
      set: before.set,
      referenceHash: c.referenceHash,
      poseHash: c.poseHash,
      beforeMana: before.face.manaSymbols,
      afterMana: after.face.manaSymbols,
      beforeFaceHash: c.renderHash,
      correctedFaceHash: hash(bytes[1]),
      prototypeFaceHash: hash(bytes[2]),
      changed,
      outsideHeader,
      bodyChanged,
      alphaChanged,
      rect,
      scores,
    });
  }
  assert.deepEqual(session.faults, []);
  await writeJson(path.join(out, 'review.json'), {
    schema: 1,
    set: '2ed',
    status: 'original-cost-header-correction-native-verified',
    scope:
      'Only changed original mana-symbol inputs are replayed by the same frozen native painter. Every previous face hash and fixed scan pose is checked. Corrected control changes are confined to the header; body pixels and alpha are unchanged. The cost objective uses one fixed union window so the removed extra symbol is penalized. Oracle data is not edited. The optional prototype is separate from the semantic correction and does not certify a full runtime profile.',
    rendererHash: capture.source.rendererHash,
    currentInputProducerHash: current.rendererHash,
    sources: Object.fromEntries(
      ['nativeCapture', 'nativeInputs', 'currentInputs', 'profileDefinition'].map((k, i) => [
        k,
        hash(raw[i]),
      ]),
    ),
    toolHash: hash(await readFile(new URL(import.meta.url))),
    pluginHash: hash(await readFile(new URL('./early-mana-trial-plugin.mjs', import.meta.url))),
    transformed,
    unchangedProvidedFaces: inputs.entries.length - changes.length,
    rows,
  });
  console.log(JSON.stringify({ status: 'original-header-input-correction-verified', rows }));
} finally {
  await session.close();
}
