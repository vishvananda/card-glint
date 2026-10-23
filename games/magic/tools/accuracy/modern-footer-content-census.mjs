// Check reviewed footer strings against the current exact-printing inputs and painter helpers.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { pathToFileURL } from 'node:url';
import { hash, sourceHash, writeJson } from './common.mjs';
import { readCensus } from './modern-publication-review.mjs';
export function checkFooterContent(actual, reviewed) {
  for (const [key, source] of [
    ['artist', 'printedArtist'],
    ['legal', 'printedLegal'],
    ['serial', 'printedSerial'],
    ['rarityMark', 'printedRarityMark'],
    ['setCode', 'printedSetCode'],
    ['language', 'printedLanguage'],
    ['finishMarker', 'printedFinishMarker'],
  ])
    assert.equal(actual[key], reviewed[source], reviewed.name + '/' + key);
}
export async function main(args) {
  const [inputFile, output] = args;
  assert(output && args.length === 2, 'Use INPUTS OUTPUT');
  const inputBytes = await readFile(inputFile),
    inputs = JSON.parse(inputBytes);
  const census = await readCensus(
    'games/magic/fixtures/accuracy/m21/current-component-census.json',
  );
  const comparison = await readCensus(
    'games/magic/fixtures/accuracy/m21/release-0612-comparison.json',
  );
  const reviewFile = 'games/magic/fixtures/accuracy/m21/footer-census-review.json';
  const reviewBytes = await readFile(reviewFile),
    review = JSON.parse(reviewBytes);
  assert.equal(hash(inputBytes), census.detail.definition.inputsHash);
  assert.equal(await sourceHash('games/magic/src'), census.detail.definition.rendererHash);
  assert.equal(inputs.entries.length, 297);
  assert.equal(review.summary.reviewed, 297);
  assert.equal(review.rows.length, 297);
  const native = new Map(census.detail.rows.map((row) => [row.id, row]));
  const scores = new Map(comparison.detail.rows.map((row) => [row.id, row]));
  const reviewed = new Map(review.rows.map((row) => [row.id, row]));
  assert.equal(reviewed.size, 297);
  const server = await createServer({
    configFile: false,
    server: { middlewareMode: true, hmr: false, ws: false },
    appType: 'custom',
  });
  const rows = [];
  try {
    await server.ssrLoadModule('/games/magic/src/data/eager.ts');
    const { printingCollectorText, printingLegalText } = await server.ssrLoadModule(
      '/games/magic/src/presentation/printing-footer.ts',
    );
    const { modernPrintingProfile } = await server.ssrLoadModule(
      '/games/magic/src/presentation/modern-printing-profile.ts',
    );
    for (const entry of inputs.entries) {
      const n = native.get(entry.id),
        s = scores.get(entry.id),
        r = reviewed.get(entry.id),
        face = entry.face;
      assert(n && s && r);
      assert.equal(face.wordingMode, 'original');
      assert.equal(hash(JSON.stringify(face)), n.inputHash);
      assert.equal(entry.reference.sha256, r.referenceHash);
      assert.equal(
        r.normalizedHash,
        s.normalizedHash,
        'Review must identify the same normalized scan',
      );
      const collector = printingCollectorText(face),
        split = /^(\d{3}(?:\/\d+)?) ([CMRUL])$/.exec(collector);
      assert(split, 'Unreviewed collector syntax');
      const profile = modernPrintingProfile(face);
      const actual = {
        artist: face.artist,
        legal: printingLegalText(face),
        serial: split[1],
        rarityMark: split[2],
        setCode: (face.collectorSetCode ?? face.setCode).toUpperCase(),
        language: (face.collectorLanguage ?? 'EN').toUpperCase(),
        finishMarker: profile?.foilStarNumbers.includes(face.collectorNumber ?? '')
          ? 'star'
          : 'bullet',
      };
      checkFooterContent(actual, r);
      rows.push({
        id: entry.id,
        name: entry.name,
        number: entry.card.collector_number,
        referenceHash: r.referenceHash,
        normalizedHash: s.normalizedHash,
        inputHash: n.inputHash,
        nativeFaceHash: n.nativeFaceHash,
        poseHash: n.poseHash,
        nonfoil: n.nonfoil,
        actual,
      });
    }
  } finally {
    await server.close();
  }
  await writeJson(output, {
    schema: 1,
    set: 'm21',
    status: 'current-footer-content-census-only',
    reviewedAt: new Date().toISOString(),
    definition: {
      rendererHash: census.detail.definition.rendererHash,
      inputsHash: hash(inputBytes),
      nativeCaptureHash: census.detail.definition.nativeCaptureHash,
      normalizationHash: census.detail.definition.normalizationHash,
      reviewFile,
      reviewHash: hash(reviewBytes),
      toolHash: hash(await readFile(new URL(import.meta.url))),
    },
    summary: {
      printings: rows.length,
      nonfoil: rows.filter((r) => r.nonfoil).length,
      foilOnly: rows.filter((r) => !r.nonfoil).length,
      fields: ['artist', 'legal', 'serial', 'rarityMark', 'setCode', 'language', 'finishMarker'],
    },
    scope:
      'Existing finite scan-content review joined to current Original inputs and actual footer helpers. This verifies strings and marks, not font shapes, position, color or set completion. Five foil-only references support wording only. Existing frozen metric/score eligibility is unchanged.',
    rows,
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href)
  await main(process.argv.slice(2));
