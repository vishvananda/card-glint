// Observe the production painter's filled glyphs without changing its output.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { hash, writeJson } from './common.mjs';
import { openBrowser } from './browser.mjs';
import { eighthHeadingStudy } from './eighth-heading-study.mjs';
const [nativeDirectory, out, studyFile] = process.argv.slice(2);
assert(out, 'Usage: printing-lettering-masks.mjs NATIVE OUT [EIGHTH_HEADINGS]');
const inputBytes = await readFile(path.join(nativeDirectory, 'inputs.json')),
  inputs = JSON.parse(inputBytes);
const captureBytes = await readFile(path.join(nativeDirectory, 'capture.json')),
  capture = JSON.parse(captureBytes);
assert.equal(capture.completed, inputs.entries.length);
assert.equal(capture.source.inputsHash, hash(inputBytes));
assert.deepEqual(capture.faults, []);
await mkdir(out, { recursive: true });
const studyBytes = studyFile ? await readFile(studyFile) : null;
const study = studyBytes ? JSON.parse(studyBytes) : null;
if (study) {
  assert.equal(study.inputsHash, hash(inputBytes));
  assert.equal(study.rendererHash, capture.source.rendererHash);
  assert.equal(hash(studyBytes), capture.source.studyHash);
  assert.equal(inputs.set, '8ed');
}
const session = await openBrowser(inputs, {
    plugins: study ? [eighthHeadingStudy(study.headings, study.painterHash)] : [],
  }),
  rows = [];
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
  });
  for (const e of inputs.entries) {
    const prior = capture.rows.find((r) => r.id === e.id);
    assert.equal(prior.inputHash, hash(JSON.stringify(e.face)));
    const result = await session.page.evaluate(
      async ({ e, study }) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const lease = await loadAccuracyImages(
          canvasAssetUrls(e.face),
          new AbortController().signal,
          e.face.illustration,
        );
        const proto = CanvasRenderingContext2D.prototype,
          original = proto.fillText;
        const masks = {},
          calls = [];
        proto.fillText = function (text, x, y, maxWidth) {
          let role;
          if (this.canvas.width === 732 && this.canvas.height === 1020) {
            if (this.font.includes('Matrix') && text === e.face.name) role = 'title';
            else if (this.font.includes('Matrix') && text === e.face.typeLine) role = 'type';
            else if (this.font.includes('Matrix') && text === e.face.artist) role = 'artist';
            else if (this.font.includes('Matrix') && text === e.face.power + '/' + e.face.toughness)
              role = 'stats';
            else if (
              this.font.includes('MPlantin') &&
              parseFloat(this.font.replace(/^italic /, '')) > 12
            )
              role = 'rules';
            else if (this.font.includes('MPlantin') && y > 630 && parseFloat(this.font) < 12)
              role = 'legal';
          }
          if (role) {
            const canvas = (masks[role] ??= Object.assign(document.createElement('canvas'), {
              width: 732,
              height: 1020,
            }));
            const c = canvas.getContext('2d');
            c.save();
            c.setTransform(this.getTransform());
            for (const key of [
              'font',
              'textAlign',
              'textBaseline',
              'letterSpacing',
              'wordSpacing',
              'fontKerning',
              'textRendering',
            ])
              c[key] = this[key];
            c.fillStyle = 'white';
            const args = maxWidth === undefined ? [text, x, y] : [text, x, y, maxWidth];
            original.apply(c, args);
            c.restore();
            calls.push({
              role,
              text,
              x,
              y,
              maxWidth,
              font: this.font,
              baseline: this.textBaseline,
              matrix: Array.from(this.getTransform().toFloat64Array()),
            });
          }
          return original.apply(this, arguments);
        };
        globalThis.__eighthHeadingStudy = study
          ? { name: e.face.name, typeLine: e.face.typeLine }
          : undefined;
        let face;
        try {
          face = await composeCardTexture(
            { face: e.face, printingId: e.id, printedImage: null },
            'inspect',
            new AbortController().signal,
            { loadImages: async () => ({ ...lease, dispose() {} }) },
          );
          return {
            face: face.toDataURL().split(',')[1],
            masks: Object.fromEntries(
              Object.entries(masks).map(([k, c]) => [k, c.toDataURL().split(',')[1]]),
            ),
            calls,
          };
        } finally {
          delete globalThis.__eighthHeadingStudy;
          proto.fillText = original;
          lease.dispose();
          if (face) face.width = face.height = 0;
          for (const c of Object.values(masks)) c.width = c.height = 0;
        }
      },
      { e, study: Boolean(study) },
    );
    assert.equal(
      hash(Buffer.from(result.face, 'base64')),
      prior.layers.face.sha256,
      'Instrumented painter changed face: ' + e.card.name,
    );
    const layers = {};
    for (const [role, png] of Object.entries(result.masks)) {
      const bytes = Buffer.from(png, 'base64'),
        file = e.id + '-' + role + '.png';
      await writeFile(path.join(out, file), bytes);
      layers[role] = { file, sha256: hash(bytes) };
    }
    rows.push({
      id: e.id,
      name: e.card.name,
      inputHash: prior.inputHash,
      controlFaceHash: prior.layers.face.sha256,
      layers,
      calls: result.calls,
    });
    await writeJson(path.join(out, 'masks.json'), {
      schema: 1,
      set: inputs.set,
      source: {
        inputsHash: hash(inputBytes),
        captureHash: hash(captureBytes),
        studyHash: studyBytes ? hash(studyBytes) : null,
        toolHash: hash(await readFile(new URL(import.meta.url))),
      },
      completed: rows.length,
      rows,
    });
    if (rows.length % 25 === 0) console.log(rows.length, '/', inputs.entries.length);
  }
  assert.deepEqual(session.faults, []);
} finally {
  await session.close();
}
console.log(JSON.stringify({ completed: rows.length, unchangedFaces: rows.length }));
