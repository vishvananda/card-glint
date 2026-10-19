import assert from 'node:assert/strict';
import path from 'node:path';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { readJson, hash, writeJson } from './common.mjs';
import { normalizedReference } from './abu-reference-cache.mjs';
import { blur } from './edges.mjs';
import { cropGray } from './pixels-pure.mjs';

const [inputFile, posesDirectory, alphaInputFile, outputDirectory] = process.argv.slice(2);
if (!outputDirectory)
  throw Error('Usage: scan-type-crops.mjs INPUTS POSES REVIEWED_ALPHA_INPUTS OUT');
const input = await readJson(inputFile),
  alpha = await readJson(alphaInputFile),
  poses = await readJson(path.join(posesDirectory, 'normalization.json'));
assert.equal(poses.inputHash, hash(await readFile(inputFile)));
const types = new Map();
for (const e of alpha.entries) {
  const key = e.card.oracle_id ?? e.card.name;
  if (types.has(key)) assert.equal(types.get(key), e.face.typeLine);
  types.set(key, e.face.typeLine);
}
await mkdir(outputDirectory, { recursive: true });
const manifest = [],
  rows = [];
for (const e of input.entries) {
  const pose = poses.rows.find((r) => r.id === e.id);
  const { image } = await normalizedReference(e, pose, path.join(posesDirectory, 'rasters'));
  const rect = [40, 362, 410, 44],
    { gray, width, height } = cropGray(image, rect),
    smooth = blur(gray, width, height, 1),
    zoom = 3,
    crop = new PNG({ width: width * zoom, height: height * zoom });
  for (let y = 0; y < crop.height; y++)
    for (let x = 0; x < crop.width; x++) {
      const v = Math.round(smooth[Math.floor(y / zoom) * width + Math.floor(x / zoom)]),
        i = (y * crop.width + x) * 4;
      crop.data.set([v, v, v, 255], i);
    }
  const file = path.resolve(outputDirectory, e.id + '.png');
  await writeFile(file, PNG.sync.write(crop));
  manifest.push({ id: e.id, file });
  const reviewed = e.wordingEvidence?.type === 'scan-reviewed';
  const inherited = types.get(e.card.oracle_id ?? e.card.name);
  rows.push({
    id: e.id,
    name: e.card.name,
    referenceHash: e.reference.sha256,
    poseHash: hash(JSON.stringify(pose)),
    normalizationAccepted: pose.accepted,
    current: e.face.typeLine,
    proposal: reviewed
      ? e.face.typeLine
      : (inherited ?? (e.card.name === 'Circle of Protection: Black' ? 'Enchantment' : null)),
    proposalSource: reviewed
      ? 'existing-reviewed-printing'
      : inherited
        ? 'reviewed-alpha-analogue-needs-beta-verification'
        : 'needs-reference-review',
  });
}
await writeJson(path.join(outputDirectory, 'ocr-manifest.json'), manifest);
await writeJson(path.join(outputDirectory, 'type-proposals.json'), {
  schema: 1,
  inputHash: poses.inputHash,
  normalizationHash: hash(JSON.stringify(poses)),
  scope: 'Proposals only. OCR and scan review are required before creating a printing correction.',
  rows,
});
console.log('reference type crops', rows.length);
