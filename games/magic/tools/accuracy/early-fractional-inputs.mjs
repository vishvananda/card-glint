// Offline, hash-bound Original inputs for the ABU fractional-metrics audit.
import assert from 'node:assert/strict';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { root, hash } from './common.mjs';
import { cachedFetch } from './cache.mjs';

export async function earlyFractionalInputs(sets) {
  assert(sets.length && sets.every((s) => ['lea', 'leb', '2ed'].includes(s)));
  const entries = [],
    sources = [];
  for (const set of sets) {
    const directory = path.join(
      root,
      'games/magic/fixtures/accuracy',
      set === '2ed' ? 'early-through-fourth' : 'abu-054',
    );
    const read = async (kind) =>
      gunzipSync(await readFile(path.join(directory, set + '-' + kind + '.json.gz')));
    const inputBytes = await read('inputs'),
      poseBytes = await read('normalization');
    const input = JSON.parse(inputBytes),
      poses = JSON.parse(poseBytes);
    assert.equal(hash(inputBytes), poses.inputHash);
    assert.equal(input.entries.length, poses.rows.length);
    sources.push({ set, inputsHash: hash(inputBytes), posesHash: hash(poseBytes) });
    for (const entry of input.entries) {
      const pose = poses.rows.find((p) => p.id === entry.id);
      assert.equal(pose.referenceHash, entry.reference.sha256);
      assert.equal(entry.face.wordingMode, 'original');
      assert.equal(entry.card.set, set);
      entries.push({ ...entry, name: entry.card.name, set, pose });
    }
  }
  const server = await createServer({
    configFile: false,
    root,
    server: { middlewareMode: true, hmr: false },
  });
  const components = [];
  try {
    await server.ssrLoadModule('/games/magic/src/data/eager.ts');
    await server.ssrLoadModule('/games/magic/src/data/eager-wording.ts');
    const { resolvePrintingWording, resolvePrintingArtist, withCardWording } =
      await server.ssrLoadModule('/games/magic/src/index.ts');
    const { canvasAssetUrls } = await server.ssrLoadModule(
      '/games/magic/src/presentation/canvas-assets.ts',
    );
    const { RETRO_FONT, RETRO_SYMBOL_FONT } = await server.ssrLoadModule(
      '/games/magic/src/presentation/retro-frame.ts',
    );
    for (const entry of entries) {
      const face = entry.face,
        paragraphs = face.rulesParagraphs ?? [];
      const text = (role) =>
        paragraphs
          .filter((p) => p.role === role)
          .map((p) => p.runs.map((r) => r.text).join(''))
          .join('\n');
      const original = { ...face, rulesText: text('rules'), flavorText: text('flavor') };
      const oracle = { typeLine: entry.card.type_line, rulesText: entry.card.oracle_text ?? '' };
      const options = { referenceSha256: entry.reference.sha256 };
      const wording = resolvePrintingWording(entry.id, { original, oracle }, options);
      const artist = resolvePrintingArtist(entry.id, face.artist, options);
      assert.notEqual(wording.provenance.status, 'reference-mismatch');
      assert.notEqual(artist.provenance.status, 'reference-mismatch');
      const selected = { ...face, ...wording.wordings.original, artist: artist.artist };
      entry.face = withCardWording(selected, { original: selected, oracle }, 'original', {
        rulesAlignment: face.rulesAlignment?.mode === 'left' ? 'left' : 'original',
        symbolStyle: 'original',
      });
      if (face.rulesAlignment?.mode === 'auto')
        entry.face.rulesAlignment = { mode: 'auto', reference: entry.face.rulesParagraphs };
      entry.correctionEvidence = { wording: wording.provenance, artist: artist.provenance };
    }
    const css = await readFile(path.join(root, 'games/magic/fonts.css'), 'utf8');
    const urls = new Set(
      [...css.matchAll(/url\('([^']+)'\)/g)]
        .map((m) => m[1])
        .concat(RETRO_FONT, RETRO_SYMBOL_FONT, ...entries.flatMap((e) => canvasAssetUrls(e.face)))
        .filter((u) => u?.startsWith('https:')),
    );
    for (const url of urls) components.push(await cachedFetch(url, { offline: true }));
  } finally {
    await server.close();
  }
  return { schema: 1, sources, entries, components };
}
