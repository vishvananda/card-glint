// Verify the installed ABU policy against every measured native trial.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { root, hash, sourceHash, writeJson, objectFile } from './common.mjs';
import { normalize, cropGray } from './pixels-pure.mjs';
import { nativeGrayCrop } from './abu-type-objective.mjs';
import { TextFilledObjective } from './text-filled-objective.mjs';
const [studyDirectory, referenceRoot, out, denseArgument, selectionFile] = process.argv.slice(2);
const direct = denseArgument === '--direct';
const denseDirectory = direct ? undefined : denseArgument;
assert(out, 'Usage: abu-fractional-native.mjs TIERED_STUDY REFERENCE_ROOT OUT');
const inputBytes = await readFile(path.join(studyDirectory, 'inputs.json'));
const studyBytes = await readFile(path.join(studyDirectory, 'study.json'));
const inputs = JSON.parse(inputBytes),
  study = JSON.parse(studyBytes);
assert(
  direct ? ['tiered', 'baseline'].includes(study.source.policy) : study.source.policy === 'tiered',
);
assert.equal(study.completed, 899);
assert.equal(study.inventory, 899);
assert.equal(study.source.inputsHash, hash(JSON.stringify(inputs)));
assert.deepEqual(study.faults, []);
let dense;
if (denseDirectory) {
  const bytes = await readFile(path.join(denseDirectory, 'study.json'));
  dense = JSON.parse(bytes);
  assert.equal(dense.completed, 3);
  assert.equal(dense.inventory, 3);
  assert.equal(dense.source.rendererHash, study.source.rendererHash);
  assert.deepEqual(dense.faults, []);
  dense.evidenceHash = hash(bytes);
  for (const row of dense.rows) {
    const old = study.rows.find((r) => r.id === row.id);
    assert.equal(old.referenceHash, row.referenceHash);
    assert.equal(old.poseHash, row.poseHash);
    assert.equal(old.variants[0].renderHash, row.variants[0].renderHash);
  }
}
let entries = inputs.entries;
if (selectionFile) {
  const ids = JSON.parse(await readFile(selectionFile));
  entries = entries.filter((e) => ids.includes(e.id));
  assert.equal(entries.length, ids.length);
}
const source = {
  mode: direct ? 'native-direct' : 'prototype-verification',
  census: !selectionFile,

  denseStudyHash: dense?.evidenceHash ?? null,
  beforeRenderer: study.source.rendererHash,
  afterRenderer: await sourceHash(path.join(root, 'games/magic/src')),
  inputsHash: hash(inputBytes),
  studyHash: hash(studyBytes),
  tool: hash(await readFile(new URL(import.meta.url))),
};
const session = await openBrowser(inputs, {
  plugins: [
    {
      name: 'reference-keys',
      enforce: 'pre',
      transform(code, id) {
        if (id !== root + 'games/magic/src/presentation/retro-rules.ts') return;
        const needle = '  return result;\n}\nfunction baseRetroTextLayout';
        assert.equal(code.split(needle).length, 2);
        return code.replace(
          needle,
          '  (globalThis as any).__nativeAbuLayout=result;\n  return result;\n}\nfunction baseRetroTextLayout',
        );
      },
      config() {
        return { server: { fs: { allow: [root, referenceRoot] } } };
      },
    },
  ],
});
const rows = [];
await mkdir(out, { recursive: true });
try {
  source.browser = session.browser.version();
  await session.page.evaluate(async (referenceRoot) => {
    for (const base of ['', '/@fs' + referenceRoot]) {
      await import(/* @vite-ignore */ base + '/games/magic/src/data/eager.ts');
      await import(/* @vite-ignore */ base + '/games/magic/src/data/eager-wording.ts');
    }
    globalThis.__abuInstalled = await import('/games/magic/src/presentation/canvas-face.ts');
    globalThis.__abuReference = await import(
      /* @vite-ignore */ '/@fs' + referenceRoot + '/games/magic/src/presentation/canvas-face.ts'
    );
    globalThis.__abuAssets = await import('/games/magic/tools/accuracy/abu-assets.mjs');
  }, referenceRoot);
  for (const entry of entries) {
    const expected = study.rows.find((r) => r.id === entry.id);
    assert(expected);
    const candidate = (dense?.rows.find((r) => r.id === entry.id) ?? expected).variants.at(-1);
    if (!direct) assert.equal(candidate.id, 'fractional-tiered');
    const result = await session.page.evaluate(async (entry) => {
      const signal = new AbortController().signal;
      const face = await globalThis.__abuInstalled.composeCardTexture(
        { face: entry.face, printingId: entry.id, printedImage: null },
        'inspect',
        signal,
        {
          loadImages: (urls, signal) =>
            globalThis.__abuAssets.loadAccuracyImages(urls, signal, entry.face.illustration),
        },
      );
      try {
        const keys = [];
        for (const wordingMode of ['original', 'oracle'])
          for (const layer of ['face', 'etching']) {
            const input = {
              face: { ...entry.face, wordingMode },
              printingId: entry.id,
              printedImage: null,
              ...(layer === 'etching' ? { layer } : {}),
            };
            const before = globalThis.__abuReference.cardTextureKey(input, 'inspect');
            const after = globalThis.__abuInstalled.cardTextureKey(input, 'inspect');
            keys.push({ wordingMode, layer, before, after });
          }
        return {
          png: face.toDataURL().split(',')[1],
          keys,
          layout: globalThis.__nativeAbuLayout ?? null,
        };
      } finally {
        face.width = face.height = 0;
      }
    }, entry);
    const bytes = Buffer.from(result.png, 'base64');
    if (!direct)
      assert.equal(
        hash(bytes),
        candidate.renderHash,
        'Installed candidate differs: ' + entry.set + '/' + entry.name,
      );
    const oldBytes = await readFile(path.join(studyDirectory, entry.set, entry.id, 'current.png'));
    assert.equal(hash(oldBytes), expected.variants[0].renderHash);
    const a = PNG.sync.read(oldBytes),
      b = PNG.sync.read(bytes);
    let outside = 0,
      alpha = 0,
      changed = 0;
    for (let p = 0; p < 732 * 1020; p++) {
      const i = p * 4,
        x = (p % 732) / 1.5,
        y = Math.floor(p / 732) / 1.5;
      if (a.data[i + 3] !== b.data[i + 3]) alpha++;
      if ([0, 1, 2, 3].some((k) => a.data[i + k] !== b.data[i + k])) {
        changed++;
        if (x < 50 || x > 452 || y < 400 || y > 605) outside++;
      }
    }
    assert.equal(outside, 0);
    assert.equal(alpha, 0);
    const keys = result.keys.map((k) => ({
      wordingMode: k.wordingMode,
      layer: k.layer,
      before: hash(k.before),
      after: hash(k.after),
      changed: k.before !== k.after,
    }));
    assert(
      keys.every((k) => k.changed === (k.wordingMode === 'original' && k.layer === 'face')),
      'Cache scope: ' + entry.name,
    );
    let scores;
    if (direct) {
      const referenceBytes = await readFile(objectFile(entry.reference));
      assert.equal(hash(referenceBytes), entry.reference.sha256);
      const scan = normalize(PNG.sync.read(referenceBytes), entry.pose.transform);
      const rect = [54, 405, 390, 197],
        gray = cropGray(scan, rect).gray;
      const objective = new TextFilledObjective(
        gray,
        390,
        197,
        new Uint8Array(gray.length).fill(1),
      );
      const before = objective.score(nativeGrayCrop(a, rect)),
        after = objective.score(nativeGrayCrop(b, rect));
      scores = {
        before100: before.score * 100,
        after100: after.score * 100,
        delta100: (after.score - before.score) * 100,
        before,
        after,
      };
    }
    rows.push({
      id: entry.id,
      set: entry.set,
      name: entry.name,
      referenceHash: entry.reference.sha256,
      poseHash: expected.poseHash,
      beforeFaceHash: expected.variants[0].renderHash,
      afterFaceHash: hash(bytes),
      prototypeMatch: !direct,
      sourceBound: direct,
      accepted: entry.pose.accepted,
      scores,
      beforeLayout: expected.variants[0].layout,
      afterLayout: result.layout,
      outside,
      alpha,
      changed,
      keys,
    });
    if (rows.length % 20 === 0 || rows.length === entries.length)
      await writeJson(path.join(out, 'proof.json'), {
        schema: 1,
        source,
        faults: session.faults,
        completed: rows.length,
        denominator: entries.length,
        rows,
      });
    await writeFile(path.join(out, entry.id + '.png'), bytes);
    console.log(entry.set, rows.length + '/' + entries.length, entry.name);
  }
  assert.deepEqual(session.faults, []);
  assert.equal(source.afterRenderer, await sourceHash(path.join(root, 'games/magic/src')));
} finally {
  await session.close();
}
