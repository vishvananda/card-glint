// Prepare immutable inputs for an offline shared-frame experiment. No downloads.
import assert from 'node:assert/strict';
import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, objectFile, readJson, root, sourceHash, writeJson } from './common.mjs';
import { openBrowser } from './browser.mjs';

const [inputsFile, posesFile, componentsFile, set, material, directory] = process.argv.slice(2);
if (!directory)
  throw Error('Usage: frame-reconstruction-input.mjs INPUTS POSES COMPONENTS SET MATERIAL OUT');
await mkdir(directory, { recursive: true });
const inputs = await readJson(inputsFile),
  poses = await readJson(posesFile),
  components = await readJson(componentsFile),
  entries = inputs.entries.filter((e) => e.card.set === set && e.material === material);
assert.ok(entries.length >= 6, 'Insufficient independent cards');
const records = [];
for (const e of entries) {
  const pose = poses.rows.find((r) => r.id === e.id);
  assert.ok(pose, 'Missing frozen pose');
  assert.equal(pose.referenceHash, e.reference.sha256);
  const file = objectFile(e.reference),
    bytes = await readFile(file);
  assert.equal(hash(bytes), e.reference.sha256, 'Reference bytes changed');
  const image = PNG.sync.read(bytes, { checkCRC: true });
  // A deterministic reconstruction-only split; prior studies have inspected
  // these names. Do not present this as fresh validation of the whole pipeline.
  const holdout = parseInt(hash(e.card.oracle_id ?? e.card.name).slice(0, 8), 16) % 5 === 0;
  records.push({
    id: e.id,
    name: e.card.name,
    oracleId: e.card.oracle_id,
    reference: { ...e.reference, file, width: image.width, height: image.height },
    cohort: !pose.accepted ? 'review' : holdout ? 'validation' : 'calibration',
    normalization: pose,
    source: e.card.scryfall_uri,
    face: e.face,
  });
}
const session = await openBrowser({ entries, components });
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
    await document.fonts.ready;
  });
  const face = {
    ...entries[0].face,
    name: '',
    typeLine: '',
    manaSymbols: [],
    rulesText: '',
    rulesParagraphs: [],
    flavorText: '',
    artist: '',
    power: null,
    toughness: null,
    illustration: null,
  };
  const data = await session.page.evaluate(async (face) => {
    const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
    const canvas = await composeCardTexture(
      { face, printingId: null, printedImage: null },
      'inspect',
      new AbortController().signal,
    );
    try {
      return canvas.toDataURL();
    } finally {
      canvas.width = canvas.height = 0;
    }
  }, face);
  assert.deepEqual(session.faults, []);
  const bytes = Buffer.from(data.split(',')[1], 'base64');
  await writeFile(path.join(directory, 'released-frame.png'), bytes);
  await mkdir(path.join(directory, 'released-cards'), { recursive: true });
  for (const record of records) {
    const full = await session.page.evaluate(async (face) => {
      const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
      const canvas = await composeCardTexture(
        { face, printingId: null, printedImage: null },
        'inspect',
        new AbortController().signal,
      );
      try {
        return canvas.toDataURL();
      } finally {
        canvas.width = canvas.height = 0;
      }
    }, record.face);
    assert.deepEqual(session.faults, []);
    const fullBytes = Buffer.from(full.split(',')[1], 'base64');
    record.baseline = { file: `released-cards/${record.id}.png`, sha256: hash(fullBytes) };
    await writeFile(path.join(directory, record.baseline.file), fullBytes);
  }
  await writeJson(path.join(directory, 'observations.json'), {
    schema: 1,
    set,
    material,
    records,
    validationKind: 'held-out-from-reconstruction; previously-inspected-development-scans',
    inputHash: hash(await readFile(inputsFile)),
    poseHash: hash(await readFile(posesFile)),
    poseMethodHash: poses.codeHash,
    poseTemplateHash: poses.templateHash,
    baseline: {
      image: 'released-frame.png',
      sha256: hash(bytes),
      version: (
        await readJson(path.join(process.env.MAGIC_NATIVE_SOURCE_ROOT ?? root, 'package.json'))
      ).version,
      sourceHash: await sourceHash(
        path.join(process.env.MAGIC_NATIVE_SOURCE_ROOT ?? root, 'games/magic/src'),
      ),
      browser: await session.browser.version(),
      face,
    },
  });
  console.log(
    JSON.stringify({
      cards: records.length,
      validation: records.filter((r) => r.cohort === 'validation').length,
      rejected: records.filter((r) => !r.normalization.accepted).length,
    }),
  );
} finally {
  await session.close();
}
