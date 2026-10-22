// Authored source selections keep common land texture separate from colored rails.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { PNG } from 'pngjs';
import { root, hash, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { sampleColor } from './hsb-color.mjs';
import { fitModernColorParts } from './modern-color-parts.mjs';

export function selectedColorPatches(mask, { size, side, erosion = 0 }) {
  assert(Number.isInteger(size) && size > 0);
  assert(Number.isInteger(erosion) && erosion >= 0);
  assert(side === undefined || side === 'left' || side === 'right');
  const patches = [];
  for (let y = erosion; y + size + erosion <= mask.height; y += size)
    for (let x = erosion; x + size + erosion <= mask.width; x += size) {
      if (
        (side === 'left' && x + size > mask.width * 0.45) ||
        (side === 'right' && x < mask.width * 0.55)
      )
        continue;
      let selected = true;
      for (let yy = y - erosion; yy < y + size + erosion && selected; yy++)
        for (let xx = x - erosion; xx < x + size + erosion; xx++)
          if (mask.data[(yy * mask.width + xx) * 4 + 3] < 250) {
            selected = false;
            break;
          }
      if (selected) patches.push([x, y, size, size]);
    }
  return patches;
}

async function main() {
  const [inputFile, nativeDir, scoreDir, maskFile, output] = process.argv.slice(2);
  assert(output, 'Usage: modern-land-role-fit.mjs INPUTS NATIVE SCORES MASKS OUT');
  const read = async (file) => {
    const bytes = await readFile(file);
    return { value: JSON.parse(bytes), sha256: hash(bytes) };
  };
  const [input, native, scores, maskMeta] = await Promise.all([
    read(inputFile),
    read(path.join(nativeDir, 'capture.json')),
    read(path.join(scoreDir, 'scores.json')),
    read(maskFile),
  ]);
  assert.equal(native.value.source.inputsHash, input.sha256);
  assert.equal(scores.value.definition.inputsHash, input.sha256);
  assert.equal(scores.value.definition.nativeCaptureHash, native.sha256);
  assert.equal(input.value.set, 'm21');
  assert.equal(native.value.completed, input.value.entries.length);
  assert.deepEqual(native.value.faults, []);
  const objects = process.env.MAGIC_ACCURACY_CACHE;
  assert(objects, 'Set MAGIC_ACCURACY_CACHE to the shared content cache');
  const masks = {};
  for (const name of ['frame', 'pinline']) {
    const asset = maskMeta.value.rows.find((r) => r.name === name);
    assert(asset);
    const bytes = await readFile(path.join(objects, 'objects', asset.sha256));
    assert.equal(hash(bytes), asset.sha256);
    masks[name] = { asset, image: normalize(PNG.sync.read(bytes, { checkCRC: true })) };
  }
  const patches = {
    frame: selectedColorPatches(masks.frame.image, { size: 5, erosion: 1 }),
    left: selectedColorPatches(masks.pinline.image, { size: 2, side: 'left' }),
    right: selectedColorPatches(masks.pinline.image, { size: 2, side: 'right' }),
    both: selectedColorPatches(masks.pinline.image, { size: 2 }),
  };
  assert(patches.frame.length > 3 && patches.left.length > 3 && patches.right.length > 3);
  const server = await createServer({
    configFile: false,
    root,
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, hmr: false, ws: false },
  });
  const common = { rows: [] },
    colors = new Map();
  try {
    await server.ssrLoadModule('/games/magic/src/data/eager.ts');
    const { framePlate } = await server.ssrLoadModule(
      '/games/magic/src/presentation/frame-plates.ts',
    );
    const math = await server.ssrLoadModule('/games/magic/src/presentation/hsb.ts');
    const { model } = JSON.parse(
      await readFile('games/magic/fixtures/accuracy/early-hsb-plan.json'),
    );
    for (const e of input.value.entries) {
      const n = native.value.rows.find((r) => r.id === e.id);
      const r = scores.value.rows.find((r) => r.id === e.id);
      assert(n && r && !n.issue && r.poseAccepted && r.nonfoilEligible);
      assert.equal(n.inputHash, hash(JSON.stringify(e.face)));
      const plate = framePlate(e.face);
      assert(plate && /\/m15\/new\/l[wubrgm]?\.png$/.test(plate.frame));
      const a = await readFile(path.join(nativeDir, n.layers.face.file));
      const b = await readFile(path.join(scoreDir, r.normalizedReference.file));
      assert.equal(hash(a), n.layers.face.sha256);
      assert.equal(hash(b), r.normalizedReference.sha256);
      const source = normalize(PNG.sync.read(a, { checkCRC: true }));
      const ref = PNG.sync.read(b, { checkCRC: true });
      assert.deepEqual([ref.width, ref.height], [488, 680]);
      const bind = {
        id: e.id,
        name: e.card.name,
        number: e.card.collector_number,
        inputHash: n.inputHash,
        renderHash: n.layers.face.sha256,
        referenceHash: e.reference.sha256,
        poseHash: r.poseHash,
        normalizedReferenceHash: r.normalizedReference.sha256,
      };
      const sample = (name) => ({
        source: sampleColor(source, patches[name], { tileSize: name === 'frame' ? 5 : 2 }),
        reference: sampleColor(ref, patches[name], { tileSize: name === 'frame' ? 5 : 2 }),
      });
      common.rows.push({ ...bind, parts: { frame: sample('frame') } });
      for (const [url, side] of plate.rightFrame
        ? [
            [plate.frame, 'left'],
            [plate.rightFrame, 'right'],
          ]
        : [[plate.frame, 'both']]) {
        if (!colors.has(url)) colors.set(url, { rows: [] });
        colors.get(url).rows.push({ ...bind, side, parts: { pinline: sample(side) } });
      }
    }
    await writeJson(output, {
      schema: 1,
      status: 'source-role-fit-proposal-not-adopted',
      eligibleForPublication: false,
      scope:
        'Fixed authored source alpha selections, eroded common texture tiles and pure left/right pinline halves. No new scan fit, card-specific palette or geometry adjustment.',
      source: {
        inputs: input.sha256,
        native: native.sha256,
        scores: scores.sha256,
        masks: maskMeta.sha256,
        tool: hash(await readFile(new URL(import.meta.url))),
      },
      patches: Object.fromEntries(Object.entries(patches).map(([k, v]) => [k, v.length])),
      common: {
        ...common,
        parts: fitModernColorParts(common, { frame: true }, model, 0.005, math),
      },
      colors: Object.fromEntries(
        [...colors].map(([url, g]) => [
          url,
          { ...g, parts: fitModernColorParts(g, { pinline: true }, model, 0.005, math) },
        ]),
      ),
    });
  } finally {
    await server.close();
  }
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)
)
  await main();
