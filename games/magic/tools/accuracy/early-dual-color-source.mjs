// Capture text-free prepared dual materials at the accepted common geometry.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir, writeFile, access } from 'node:fs/promises';
import { openBrowser } from './browser.mjs';
import { root, hash, sourceHash, writeJson } from './common.mjs';
const [nativeDirectory, definitionFile, output] = process.argv.slice(2);
assert(output, 'Usage: early-dual-color-source.mjs NATIVE_CAPTURE DUAL_DEFINITION OUTPUT');
const nativeBytes = await readFile(path.join(nativeDirectory, 'capture.json')),
  inputBytes = await readFile(path.join(nativeDirectory, 'inputs.json')),
  definitionBytes = await readFile(definitionFile),
  native = JSON.parse(nativeBytes),
  input = JSON.parse(inputBytes),
  definition = JSON.parse(definitionBytes);
assert.equal(native.source.rendererHash, await sourceHash(path.join(root, 'games/magic/src')));
assert.equal(definition.trials.length, 1);
const material = definition.trials[0].materials.L;
assert.equal(material.family, 'abu');
const entries = input.entries.filter((e) => definition.ids.includes(e.id));
assert.equal(entries.length, 10);
assert(entries.every((e) => e.face.wordingMode === 'original' && e.face.frameColors.length === 2));
assert.equal(new Set(entries.map((e) => e.id)).size, 10);
try {
  await access(path.join(output, 'capture.json'));
  throw Error('Completed diagnostic output already exists');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
await mkdir(output, { recursive: true });
const session = await openBrowser({ ...input, entries }, { fonts: false });
const rows = [];
try {
  for (const e of entries) {
    const baseline = native.rows.find((r) => r.id === e.id);
    assert(baseline?.accepted && e.pose.accepted);
    assert.equal(baseline.referenceHash, e.reference.sha256);
    const scanBytes = await readFile(path.join(nativeDirectory, e.set, e.id + '-scan.png'));
    assert.equal(hash(scanBytes), baseline.scanHash);
    const result = await session.page.evaluate(
      async ({ face, material }) => {
        await import('/games/magic/src/data/eager.ts');
        const { canvasAssetUrls, loadCanvasImages } = await import(
          '/games/magic/src/presentation/canvas-assets.ts'
        );
        const { prepareEarlyHsb } = await import(
          '/games/magic/src/presentation/early-hsb-material.ts'
        );
        const { prepareRetroDualFrame } = await import(
          '/games/magic/src/presentation/retro-dual-material.ts'
        );
        const { retroDualFrame } = await import(
          '/games/magic/src/presentation/retro-dual-frame.ts'
        );
        const { calibratedFrameMaterials } = await import(
          '/games/magic/src/presentation/printing-calibration-materials.ts'
        );
        const reduced = {
          ...face,
          illustration: null,
          rulesText: '',
          rulesParagraphs: [],
          manaSymbols: [],
        };
        const materials = calibratedFrameMaterials(face);
        if (JSON.stringify(materials) !== JSON.stringify(calibratedFrameMaterials(reduced)))
          throw Error('Content changes frame materials');
        const plan = retroDualFrame(face);
        if (!plan || JSON.stringify(plan) !== JSON.stringify(retroDualFrame(reduced)))
          throw Error('Content changes dual plan');
        const signal = new AbortController().signal;
        const raw = await loadCanvasImages(canvasAssetUrls(reduced), signal);
        let calibrated, dual;
        try {
          calibrated = await prepareEarlyHsb(reduced, raw.images, signal);
          dual = await prepareRetroDualFrame(reduced, calibrated.images, signal);
          const source = dual.images.get(plan.base);
          if (!source) throw Error('Prepared dual source absent');
          const canvas = Object.assign(document.createElement('canvas'), {
            width: 732,
            height: 1020,
          });
          const c = canvas.getContext('2d');
          if (!c) throw Error('Canvas2D unavailable');
          c.drawImage(
            source,
            material.frame[0] * 732,
            material.frame[1] * 1020,
            material.frame[2] * 732,
            material.frame[3] * 1020,
          );
          const png = canvas.toDataURL().split(',')[1];
          c.clearRect(0, 0, 732, 1020);
          const stripeMask = raw.images.get(plan.mask);
          if (!stripeMask) throw Error('Dual stripe mask absent');
          c.drawImage(
            stripeMask,
            material.frame[0] * 732,
            material.frame[1] * 1020,
            material.frame[2] * 732,
            material.frame[3] * 1020,
          );
          return {
            png,
            maskPng: canvas.toDataURL().split(',')[1],
            plan,
            materials,
            width: source.width,
            height: source.height,
          };
        } finally {
          dual?.dispose();
          calibrated?.dispose();
          raw.dispose();
        }
      },
      { face: e.face, material },
    );
    const png = Buffer.from(result.png, 'base64');
    const mask = Buffer.from(result.maskPng, 'base64');
    delete result.png;
    delete result.maskPng;
    if (rows.length) assert.equal(hash(mask), rows[0].maskHash, 'Shared stripe mask changed');
    else await writeFile(path.join(output, 'stripe-mask.png'), mask);
    await writeFile(path.join(output, e.id + '.png'), png);
    rows.push({
      id: e.id,
      name: e.name,
      colors: e.face.frameColors,
      cohort: e.pose.cohort,
      referenceHash: e.reference.sha256,
      poseHash: baseline.poseHash,
      scanHash: baseline.scanHash,
      cleanHash: hash(png),
      maskHash: hash(mask),
      ...result,
    });
    console.log(e.name);
  }
  assert.deepEqual(session.faults, []);
  await writeJson(path.join(output, 'capture.json'), {
    schema: 1,
    set: '2ed',
    scope:
      'Ten text-free prepared native dual composites at the accepted shared geometry. Original full-card inputs, independent fixed scan poses, source plans and material decisions are retained. This is color-diagnostic input, not an adopted palette, runtime profile or whole-card validation.',
    rendererHash: native.source.rendererHash,
    nativeCaptureHash: hash(nativeBytes),
    nativeInputsHash: hash(inputBytes),
    definitionHash: hash(definitionBytes),
    toolHash: hash(await readFile(new URL(import.meta.url))),
    dependencies: await Promise.all(
      ['browser.mjs', 'common.mjs'].map(async (f) => [
        f,
        hash(await readFile(new URL(f, import.meta.url))),
      ]),
    ),
    material,
    rows,
  });
} finally {
  await session.close();
}
