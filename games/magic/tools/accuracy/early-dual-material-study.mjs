import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { openBrowser } from './browser.mjs';
import { hash, sourceHash, root } from './common.mjs';
const [base, candidateFile, out] = process.argv.slice(2);
assert(out, 'Usage: dual-material-study.mjs INSTALLED_NATIVE CANDIDATES OUT');
const inputBytes = await fs.readFile(path.join(base, 'inputs.json'));
const input = JSON.parse(inputBytes),
  candidates = JSON.parse(await fs.readFile(candidateFile));
const selected = input.entries.filter((e) => e.face.land && e.face.frameColors?.length === 2);
assert.equal(selected.length, 10);
const module = 'games/magic/src/calibration/profiles.ts',
  moduleHash = hash(await fs.readFile(path.join(root, module)));
const needle = 'return profileSets.includes(set) ? setCalibrationProfiles[set] : undefined;';
const source = {
  rendererHash: await sourceHash(path.join(root, 'games/magic/src')),
  inputsHash: hash(inputBytes),
  candidateHash: hash(await fs.readFile(candidateFile)),
  toolHash: hash(await fs.readFile(new URL(import.meta.url))),
  moduleHash,
};
await fs.mkdir(out, { recursive: true });
const session = await openBrowser(input, {
  plugins: [
    {
      name: 'dual-material-data-study',
      enforce: 'pre',
      transform(code, id) {
        if (!id.endsWith('/' + module)) return;
        assert.equal(hash(code), moduleHash);
        assert.equal(code.split(needle).length, 2);
        return code.replace(
          needle,
          "return set === '2ed' && (globalThis as any).__dualMaterialProfile ? (globalThis as any).__dualMaterialProfile : profileSets.includes(set) ? setCalibrationProfiles[set] : undefined;",
        );
      },
    },
  ],
});
const rows = [];
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
  });
  for (const e of selected) {
    const results = await session.page.evaluate(
      async ({ e, candidates }) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const urls = [];
        for (const candidate of candidates) {
          globalThis.__dualMaterialProfile = candidate.profile;
          urls.push(...canvasAssetUrls(e.face));
        }
        delete globalThis.__dualMaterialProfile;
        const lease = await loadAccuracyImages(
            urls,
            new AbortController().signal,
            e.face.illustration,
          ),
          results = [];
        try {
          for (const candidate of candidates) {
            globalThis.__dualMaterialProfile = candidate.profile;
            const image = await composeCardTexture(
              { face: e.face, printingId: e.id, printedImage: null },
              'inspect',
              new AbortController().signal,
              { loadImages: async () => ({ ...lease, dispose() {} }) },
            );
            try {
              results.push({ name: candidate.name, png: image.toDataURL().split(',')[1] });
            } finally {
              image.width = image.height = 0;
            }
          }
        } finally {
          delete globalThis.__dualMaterialProfile;
          lease.dispose();
        }
        return results;
      },
      { e, candidates },
    );
    for (const result of results) {
      const png = Buffer.from(result.png, 'base64');
      await fs.mkdir(path.join(out, result.name), { recursive: true });
      await fs.writeFile(path.join(out, result.name, e.id + '.png'), png);
      result.hash = hash(png);
      delete result.png;
      result.values = candidates.find((c) => c.name === result.name).parameters ?? {};
    }
    assert.equal(
      results[0].hash,
      hash(await fs.readFile(path.join(base, 'original', e.id + '.png'))),
      'Baseline drift ' + e.name,
    );
    rows.push({
      id: e.id,
      name: e.name,
      referenceHash: e.reference.sha256,
      poseHash: hash(JSON.stringify(e.pose.transform)),
      variants: results,
    });
    await fs.writeFile(
      path.join(out, 'capture.json'),
      JSON.stringify(
        {
          source,
          scope:
            'Data-only native source/material candidates at fixed Original inputs and scan poses; no adoption.',
          rows,
        },
        null,
        2,
      ) + '\n',
    );
    console.log(e.name, 'baseline exact');
  }
  assert.equal(session.faults.length, 0);
} finally {
  await session.close();
}
