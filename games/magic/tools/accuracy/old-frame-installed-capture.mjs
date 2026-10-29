// Actual installed, lazy-loaded pack output must equal the full native candidate.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { fetchComponents } from './components.mjs';
import { hash, root, sourceHash, writeJson } from './common.mjs';
const [inputFile, profileFile, candidateDirectory, out, previousProfileFile] =
  process.argv.slice(2);
assert(out, 'Use INPUTS PROFILE CANDIDATE_DIRECTORY NEW_OUTPUT');
await fs.mkdir(out);
const [ib, pb, cb] = await Promise.all(
  [inputFile, profileFile, path.join(candidateDirectory, 'capture.json')].map((f) =>
    fs.readFile(f),
  ),
);
const [input, profile, capture] = [ib, pb, cb].map((b) => JSON.parse(b));
assert.equal(capture.source.inputHash, hash(ib));
let previousProfile;
if (previousProfileFile) {
  const old = await fs.readFile(previousProfileFile);
  previousProfile = JSON.parse(old);
  assert.equal(input.set, 'mir');
  assert.equal(capture.source.profileHash, hash(old));
  assert.deepEqual(previousProfile.footer.legal.lightMaterials, ['U', 'B', 'G', 'A']);
  const amended = structuredClone(previousProfile);
  amended.footer.legal.lightMaterials = ['U', 'B', 'G', 'M', 'A'];
  assert.deepEqual(profile, amended, 'Only the scan-reviewed gold copyright ink may change');
} else assert.equal(capture.source.profileHash, hash(pb));
assert(capture.complete && !capture.faults.length);
assert.equal(capture.rows.length, input.entries.length);
const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
const toolHash = hash(await fs.readFile(new URL(import.meta.url)));
const components = await fetchComponents(input.entries, { offline: true }, (e) => e.face);
const session = await openBrowser({ ...input, components });
const rows = [];
try {
  await session.page.evaluate(
    async ({ set, profile }) => {
      const { loadMagicSet, loadPrintingSet } = await import('/games/magic/src/data/load.ts');
      await loadMagicSet(set);
      await loadPrintingSet(set);
      const { setCalibrationProfile } = await import('/games/magic/src/calibration/profiles.ts');
      if (JSON.stringify(setCalibrationProfile(set)) !== JSON.stringify(profile))
        throw Error('Installed lazy profile differs from the candidate');
    },
    { set: input.set, profile },
  );
  for (const e of input.entries) {
    const previous = capture.rows.find((r) => r.id === e.id);
    assert.equal(previous.inputHash, hash(JSON.stringify(e.face)));
    assert.equal(previous.referenceHash, e.reference.sha256);
    assert.equal(path.basename(previous.file), previous.file);
    const expected = await fs.readFile(path.join(candidateDirectory, previous.file));
    assert.equal(hash(expected), previous.sha256);
    const result = await session.page.evaluate(async (e) => {
      const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
      let canvas;
      try {
        canvas = await composeCardTexture(
          { face: e.face, printingId: e.id, printedImage: null },
          'inspect',
          new AbortController().signal,
        );
        return {
          png: canvas.toDataURL().split(',')[1],
          width: canvas.width,
          height: canvas.height,
        };
      } finally {
        if (canvas) canvas.width = canvas.height = 0;
      }
    }, e);
    const png = Buffer.from(result.png, 'base64');
    let footerRevision;
    if (previousProfile && e.material === 'M') {
      const a = PNG.sync.read(expected),
        b = PNG.sync.read(png);
      assert.equal(a.width, b.width);
      assert.equal(a.height, b.height);
      let changed = 0;
      const bounds = [a.width, a.height, -1, -1];
      for (let y = 0; y < a.height; y++)
        for (let x = 0; x < a.width; x++) {
          const i = (y * a.width + x) * 4;
          if (a.data.subarray(i, i + 4).equals(b.data.subarray(i, i + 4))) continue;
          assert(
            x >= 70 && x < 665 && y >= 946 && y < 979,
            e.name + ': non-copyright pixel changed',
          );
          changed++;
          bounds[0] = Math.min(bounds[0], x);
          bounds[1] = Math.min(bounds[1], y);
          bounds[2] = Math.max(bounds[2], x);
          bounds[3] = Math.max(bounds[3], y);
        }
      assert(changed > 0);
      footerRevision = {
        kind: 'mir-gold-light-copyright',
        previousNativeHash: previous.sha256,
        changedPixels: changed,
        bounds,
      };
    } else assert.equal(hash(png), previous.sha256, e.name + ': installed native output differs');
    const file = 'candidate-' + e.id + '.png';
    await fs.writeFile(path.join(out, file), png);
    rows.push({
      ...previous,
      profileHash: hash(JSON.stringify(profile)),
      ...(footerRevision ? { footerRevision } : {}),
      file,
      sha256: hash(png),
      width: result.width,
      height: result.height,
    });
    if (rows.length % 50 === 0) console.log(input.set, rows.length, 'installed native faces exact');
  }
  assert.deepEqual(session.faults, []);
  assert.equal(rendererHash, await sourceHash(path.join(root, 'games/magic/src')));
  assert.equal(toolHash, hash(await fs.readFile(new URL(import.meta.url))));
  await writeJson(path.join(out, 'capture.json'), {
    schema: 1,
    complete: true,
    set: input.set,
    source: {
      ...capture.source,
      rendererHash,
      toolHash,
      candidateCaptureHash: hash(cb),
      profileHash: hash(pb),
      ...(previousProfileFile ? { footerRevision: 'mir-gold-light-copyright' } : {}),
      installed: true,
      lazy: true,
    },
    scope:
      'Real public per-set data loader with no painter/profile hooks. Every face is byte-identical to the tested candidate, except the explicitly reviewed Mirage gold copyright ink amendment whose pixel differences must stay inside the copyright strip.',
    rows,
    faults: [],
  });
} finally {
  await session.close();
}
