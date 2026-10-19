import assert from 'node:assert/strict';
import { readFile, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';
import { readJson, writeJson, hash, root } from './common.mjs';

const [inputFile, posesDirectory, outputDirectory] = process.argv.slice(2);
if (!outputDirectory) throw Error('Usage: abu-refresh-inputs.mjs INPUTS POSES OUT');
const input = await readJson(inputFile),
  poses = await readJson(path.join(posesDirectory, 'normalization.json'));
assert.equal(poses.inputHash, hash(await readFile(inputFile)));
const server = await createServer({
  configFile: false,
  root,
  server: { middlewareMode: true, hmr: false },
});
const { resolvePrintingWording, resolvePrintingArtist } = await server.ssrLoadModule(
  '/games/magic/src/index.ts',
);
const entries = [];
try {
  for (const e of input.entries) {
    const p = poses.rows.find((p) => p.id === e.id);
    assert.equal(p.referenceHash, e.reference.sha256);
    assert.equal(p.material, e.material);
    assert.equal(e.card.set, poses.set);
    const face = e.face,
      paragraphs = face.rulesParagraphs ?? [];
    assert.equal(face.wordingMode, 'original', 'Calibration inputs must use original wording');
    const text = (role) =>
      paragraphs
        .filter((p) => p.role === role)
        .map((p) => p.runs.map((r) => r.text).join(''))
        .join('\n');
    const original = {
      name: face.name,
      typeLine: face.typeLine,
      rulesText: text('rules'),
      flavorText: text('flavor'),
      rulesParagraphs: paragraphs,
      manaSymbols: face.manaSymbols,
      power: face.power,
      toughness: face.toughness,
    };
    const wording = resolvePrintingWording(
      e.id,
      { original, oracle: { typeLine: e.card.type_line, rulesText: e.card.oracle_text ?? '' } },
      { referenceSha256: e.reference.sha256 },
    );
    const artist = resolvePrintingArtist(e.id, face.artist, {
      referenceSha256: e.reference.sha256,
    });
    assert.notEqual(wording.provenance.status, 'reference-mismatch');
    assert.notEqual(artist.provenance.status, 'reference-mismatch');
    const updated = { ...face, ...wording.wordings.original, artist: artist.artist };
    // The size/centering reference must follow reviewed wording too. Keeping
    // old reference runs would silently fit a different passage than we paint.
    if (face.rulesAlignment?.mode === 'auto')
      updated.rulesAlignment = { mode: 'auto', reference: updated.rulesParagraphs };
    entries.push({
      ...e,
      face: updated,
      correctionEvidence: { wording: wording.provenance, artist: artist.provenance },
      refreshedFaceChanged: JSON.stringify(updated) !== JSON.stringify(face),
    });
  }
} finally {
  await server.close();
}
assert.equal(entries.length, poses.rows.length);
await mkdir(path.join(outputDirectory, 'normalization'), { recursive: true });
const output = { ...input, inputRevision: 'reviewed-abu-printing-inputs-v2', entries };
const outputFile = path.join(outputDirectory, 'inputs.json');
await writeJson(outputFile, output);
const reused = {
  ...poses,
  inputHash: hash(await readFile(outputFile)),
  reusedFrom: {
    inputHash: poses.inputHash,
    normalizationHash: hash(JSON.stringify(poses)),
    scope:
      'Printing corrections only. Every printing ID, set, material and scan hash is identical; comparison-only poses and certification are reused unchanged.',
  },
};
await writeJson(path.join(outputDirectory, 'normalization', 'normalization.json'), reused);
await copyFile(
  path.join(posesDirectory, 'templates.json'),
  path.join(outputDirectory, 'normalization', 'templates.json'),
);
console.log({
  cards: entries.length,
  changed: entries.filter((e) => e.refreshedFaceChanged).length,
  posesReused: poses.rows.length,
});
