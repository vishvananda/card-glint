import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { openBrowser } from './browser.mjs';
import { hash, root, sourceHash, writeJson } from './common.mjs';
const [inputFile, captureFile, fitFile, out] = process.argv.slice(2);
assert(out, 'Use INPUTS NATIVE_CAPTURE WORD_FIT NEW_OUTPUT_DIRECTORY');
const raw = await Promise.all([inputFile, captureFile, fitFile].map((f) => fs.readFile(f)));
const [input, capture, fit] = raw.map((b) => JSON.parse(b));
const rendererHash = await sourceHash(root + '/games/magic/src');
assert.equal(capture.rendererHash, rendererHash);
assert.equal(fit.rendererHash, rendererHash);
assert.equal(capture.inputHash, hash(raw[0]));
assert.equal(fit.inputHash, hash(raw[0]));
const policy = fit.shared[0].params;
const entries = input.entries.filter(
  (e) =>
    ['4ed', 'ice'].includes(e.card.set) &&
    ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest'].includes(e.name),
);
assert.equal(entries.length, 20);
assert.equal(entries.filter((e) => e.card.set === '4ed').length, 15);
await fs.mkdir(out);
const rows = [];
for (const mode of ['current', 'shared']) {
  const session = await openBrowser(
    { ...input, components: [...input.components, ...(capture.extraAssets ?? [])] },
    {
      plugins:
        mode === 'current'
          ? []
          : [
              {
                name: 'data-only-fourth-basic-word-proposal',
                enforce: 'pre',
                transform(code, id) {
                  if (!id.split('?')[0].endsWith('/data/registry.ts')) return;
                  assert.equal(code.split('freeze(data);').length, 2);
                  return code.replace(
                    'freeze(data);',
                    'globalThis.__basicWordProposal?.(data); freeze(data);',
                  );
                },
              },
            ],
    },
  );
  try {
    await session.page.evaluate(
      async ({ mode, policy }) => {
        if (mode === 'shared')
          globalThis.__basicWordProposal = (data) => {
            if (data.set !== '4ed' || data.kind !== 'calibration') return;
            const p = data.tables.setCalibrationProfiles['4ed'];
            p.revision++;
            for (const color of ['W', 'U', 'B', 'R', 'G']) {
              const b = p.body['L-' + color];
              b.bounds.x += policy.dx;
              b.typography.centerOffset += policy.dy;
              b.typography.textWidth = policy.textWidth;
              b.maximumSize = policy.size;
              b.centered.maximumSize = policy.size;
            }
          };
        await import('/games/magic/src/data/eager.ts');
        await import('/games/magic/src/data/eager-wording.ts');
      },
      { mode, policy },
    );
    for (const e of entries) {
      const rendered = await session.page.evaluate(async (e) => {
        const { composeCardTexture, cardTextureKey } = await import(
          '/games/magic/src/presentation/canvas-face.ts'
        );
        const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const signal = new AbortController().signal,
          lease = await loadAccuracyImages(canvasAssetUrls(e.face), signal, e.face.illustration),
          card = { face: e.face, printingId: e.id, printedImage: null };
        try {
          const image = await composeCardTexture(card, 'inspect', signal, {
            loadImages: async () => ({ ...lease, dispose() {} }),
          });
          try {
            return { png: image.toDataURL().split(',')[1], key: cardTextureKey(card, 'inspect') };
          } finally {
            image.width = image.height = 0;
          }
        } finally {
          lease.dispose();
        }
      }, e);
      const bytes = Buffer.from(rendered.png, 'base64'),
        previous = capture.rows.find((r) => r.id === e.id).modes.original;
      const file = e.id + '-' + mode + '.png';
      if (mode === 'current') {
        assert.equal(hash(bytes), previous.sha256, e.name + ' baseline changed');
        assert.equal(hash(rendered.key), previous.keyHash, e.name + ' key changed');
        await fs.link(path.join(path.dirname(captureFile), previous.file), path.join(out, file));
        rows.push({
          id: e.id,
          set: e.card.set,
          name: e.name,
          inputHash: hash(JSON.stringify(e.face)),
          referenceHash: e.reference.sha256,
          modes: {},
        });
      } else await fs.writeFile(path.join(out, file), bytes);
      rows.find((r) => r.id === e.id).modes[mode] = {
        file,
        sha256: hash(bytes),
        keyHash: hash(rendered.key),
      };
      console.log(mode, e.card.set, e.name, e.card.collector_number);
    }
    assert.deepEqual(session.faults, []);
  } finally {
    await session.close();
  }
}
assert.equal(await sourceHash(root + '/games/magic/src'), rendererHash);
await writeJson(path.join(out, 'study.json'), {
  schema: 1,
  status: 'shared-basic-word-native-prototype',
  scope:
    'Data-only shared word-fit proposal for all five basic-land plates; fifteen Fourth and five inherited Ice Age Original controls. No per-printing geometry. Actual default controls reproduce native PNGs and cache keys exactly before the profile table is altered in an isolated browser. No production source edits.',
  rendererHash,
  inputHash: hash(raw[0]),
  captureHash: hash(raw[1]),
  fitHash: hash(raw[2]),
  toolHash: hash(await fs.readFile(new URL(import.meta.url))),
  policy,
  rows,
});
