// Detect native frame windows contaminated by illustration or printing content.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { nativeFrameRegions } from './native-frame-patches.mjs';
import { hash, root, sourceHash, writeJson } from './common.mjs';
const [inputFile, nativeDirectory, observationsFile, output] = process.argv.slice(2);
assert(output, 'Usage: modern-frame-native-probe.mjs INPUTS NATIVE OBSERVATIONS OUT');
const inputBytes = await readFile(inputFile),
  inputs = JSON.parse(inputBytes);
const nativeBytes = await readFile(path.join(nativeDirectory, 'capture.json')),
  native = JSON.parse(nativeBytes);
const obsBytes = await readFile(observationsFile),
  obs = JSON.parse(obsBytes);
assert.equal(native.completed, inputs.entries.length);
assert.equal(native.source.inputsHash, hash(inputBytes));
assert.equal(obs.inputHash, hash(inputBytes));
const source = {
  rendererHash: await sourceHash(path.join(root, 'games/magic/src')),
  inputsHash: hash(inputBytes),
  nativeHash: hash(nativeBytes),
  observationsHash: hash(obsBytes),
  toolHash: hash(await readFile(new URL(import.meta.url))),
};
assert.equal(
  source.rendererHash,
  native.source.rendererHash,
  'Use the same renderer as the baseline',
);
await mkdir(output, { recursive: true });
let rows = [];
try {
  const prior = JSON.parse(await readFile(path.join(output, 'probe.json')));
  assert.deepEqual(prior.source, source);
  rows = prior.rows;
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const session = await openBrowser(inputs);
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
  });
  for (const e of inputs.entries) {
    if (rows.some((r) => r.id === e.id)) continue;
    const baseline = native.rows.find((r) => r.id === e.id),
      observation = obs.rows.find((r) => r.id === e.id);
    assert(baseline && observation);
    const beforeBytes = await readFile(path.join(nativeDirectory, baseline.layers.face.file));
    assert.equal(hash(beforeBytes), baseline.layers.face.sha256);
    const probe = await session.page.evaluate(async (e) => {
      const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
      const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
      const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
      const { resolveCardProfile } = await import('/games/magic/src/presentation/profile.ts');
      const { faceFrame, faceRects, specialRules } = await import(
        '/games/magic/src/presentation/special-frames.ts'
      );
      const { printingCalibrationMaterials } = await import(
        '/games/magic/src/presentation/printing-calibration-materials.ts'
      );
      const empty = '\u200b',
        kind = faceFrame(e.face),
        rules = kind.startsWith('planeswalker')
          ? specialRules(e.face)
              .map((r) => (r.badges.length ? r.badges[0] + ': ' : '') + empty)
              .join('\n')
          : empty;
      const face = {
        ...e.face,
        name: empty,
        canonicalTypeLine: e.face.canonicalTypeLine ?? e.face.typeLine,
        artist: empty,
        rulesText: rules,
        rulesParagraphs: [{ role: 'rules', runs: [{ text: empty }] }],
      };
      if (
        JSON.stringify(resolveCardProfile(face)) !== JSON.stringify(resolveCardProfile(e.face)) ||
        faceFrame(face) !== kind ||
        JSON.stringify(faceRects(face)) !== JSON.stringify(faceRects(e.face)) ||
        JSON.stringify(printingCalibrationMaterials(face).materials) !==
          JSON.stringify(printingCalibrationMaterials(e.face).materials) ||
        printingCalibrationMaterials(face).border !== printingCalibrationMaterials(e.face).border
      )
        throw Error('Probe changed frame semantics: ' + e.name);
      const lease = await loadAccuracyImages(
        canvasAssetUrls(e.face),
        new AbortController().signal,
        e.face.illustration,
      );
      const art = lease.images.get(e.face.illustration);
      if (!art) throw Error('Missing original illustration');
      const substitute = document.createElement('canvas');
      substitute.width = art.width;
      substitute.height = art.height;
      const c = substitute.getContext('2d');
      c.fillStyle = '#ff00ff';
      c.fillRect(0, 0, art.width, art.height);
      c.fillStyle = '#00ff00';
      c.fillRect(0, 0, art.width / 2, art.height / 2);
      const images = Object.assign(new Map(lease.images), lease.images);
      images.set(e.face.illustration, substitute);
      try {
        const image = await composeCardTexture(
          { face, printingId: e.id, printedImage: null },
          'inspect',
          new AbortController().signal,
          { loadImages: async () => ({ ...lease, images, dispose() {} }) },
        );
        try {
          return { png: image.toDataURL().split(',')[1], kind };
        } finally {
          image.width = image.height = 0;
        }
      } finally {
        substitute.width = substitute.height = 0;
        lease.dispose();
      }
    }, e);
    const afterBytes = Buffer.from(probe.png, 'base64'),
      after = PNG.sync.read(afterBytes),
      before = PNG.sync.read(beforeBytes);
    assert.deepEqual([after.width, after.height], [before.width, before.height]);
    const changed = [];
    observation.partitions.forEach((p, partition) => {
      for (const region of nativeFrameRegions(before, p, observation.bounds)) {
        const [left, top, right, bottom] = region.rect;
        let pixels = 0;
        for (let y = top; y <= bottom; y++)
          for (let x = left; x <= right; x++) {
            const at = (y * before.width + x) * 4;
            if ([0, 1, 2, 3].some((k) => before.data[at + k] !== after.data[at + k])) pixels++;
          }
        if (pixels)
          changed.push({
            partition,
            side: region.side,
            along: region.along,
            pixels,
            rect: region.rect,
          });
      }
    });
    const file = e.id + '.png';
    await writeFile(path.join(output, file), afterBytes);
    rows.push({
      id: e.id,
      name: e.name,
      kind: probe.kind,
      family: observation.family,
      referenceHash: e.reference.sha256,
      inputHash: hash(JSON.stringify(e.face)),
      baselineHash: hash(beforeBytes),
      probeHash: hash(afterBytes),
      file,
      frameFieldsStable: changed.length === 0,
      changed,
    });
    await writeJson(path.join(output, 'probe.json'), {
      source,
      scope:
        'Every Original input uses unchanged native frame semantics/rectangles. Hide title, artist and ability/body strings; retain the physical type line because source-material eligibility currently uses it. Replace art with a procedural high-contrast image. Require identical material corrections and stock as well as frame semantics. Any changed reviewed frame-field pixels indicate content leakage or content-dependent native composition; this probe does not approve scan normalization or renderer calibration.',
      total: inputs.entries.length,
      completed: rows.length,
      stable: rows.filter((r) => r.frameFieldsStable).length,
      rows,
    });
    if (rows.length % 25 === 0)
      console.log(
        'native frame isolation',
        rows.length,
        '/',
        inputs.entries.length,
        'stable',
        rows.filter((r) => r.frameFieldsStable).length,
      );
  }
  assert.deepEqual(session.faults, []);
} finally {
  await session.close();
}
