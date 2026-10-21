import { createServer } from 'vite';
import { PNG } from 'pngjs';
import { cachedFetch } from './cache.mjs';
// Verify an installed printing profile through the public native painter.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { openBrowser } from './browser.mjs';
import { hash, sourceHash, root, writeJson } from './common.mjs';
const [study, out] = process.argv.slice(2);
assert(out, 'Usage: early-profile-adoption-native.mjs CANDIDATE_NATIVE OUTPUT');
const raw = await Promise.all(
  ['capture.json', 'inputs.json'].map((f) => readFile(path.join(study, f))),
);
const [capture, inputs] = raw.map((b) => JSON.parse(b));
assert.equal(capture.completed, 302);
assert.equal(inputs.entries.length, 302);
// Discover both symbol modes before painting. Frozen Original snapshots do
// not necessarily list the modern glyph assets needed by Oracle variants.
const preflight = await createServer({
  root,
  configFile: false,
  server: { middlewareMode: true },
  optimizeDeps: { noDiscovery: true },
});
const inventory = new Map((inputs.components ?? []).map((a) => [a.url, a]));
try {
  await preflight.ssrLoadModule('/games/magic/src/data/eager.ts');
  await preflight.ssrLoadModule('/games/magic/src/data/eager-wording.ts');
  const { fromScryfallCard } = await preflight.ssrLoadModule(
    '/games/magic/src/presentation/scryfall-card.ts',
  );
  const { canvasAssetUrls } = await preflight.ssrLoadModule(
    '/games/magic/src/presentation/canvas-assets.ts',
  );
  const { resolvePrintingArtist } = await preflight.ssrLoadModule(
    '/games/magic/src/printing/artist.ts',
  );
  inputs.entries = inputs.entries.map((e) => {
    const resolved = resolvePrintingArtist(e.id, e.face.artist, {
      referenceSha256: e.reference.sha256,
    });
    assert.notEqual(resolved.provenance.status, 'reference-mismatch');
    return {
      ...e,
      controlFace: e.face,
      face: { ...e.face, artist: resolved.artist },
      artistProvenance: resolved.provenance,
    };
  });
  const changes = inputs.entries.filter((e) => e.face.artist !== e.controlFace.artist);
  assert.equal(changes.length, 13, 'Unexpected printing-credit change count');
  const urls = new Set();
  for (const e of inputs.entries)
    for (const style of ['modern', 'original']) {
      const f = fromScryfallCard(e.card, {
        wording: 'oracle',
        symbolStyle: style,
        illustrations: [e.face.illustration],
      });
      for (const url of canvasAssetUrls(f)) if (url?.startsWith('https:')) urls.add(url);
    }
  for (const url of [...urls].sort()) {
    const asset = await cachedFetch(url, { offline: true });
    if (inventory.has(url)) assert.equal(inventory.get(url).sha256, asset.sha256);
    inventory.set(url, asset);
  }
} finally {
  await preflight.close();
}
inputs.components = [...inventory.values()].sort((a, b) => a.url.localeCompare(b.url));
const source = {
  componentInventoryHash: hash(JSON.stringify(inputs.components)),
  rendererHash: await sourceHash(path.join(root, 'games/magic/src')),
  candidateCaptureHash: hash(raw[0]),
  inputsHash: hash(raw[1]),
  resolvedInputsHash: hash(JSON.stringify(inputs)),
  artistCorrections: inputs.entries
    .filter((e) => e.face.artist !== e.controlFace.artist)
    .map((e) => ({
      id: e.id,
      before: e.controlFace.artist,
      after: e.face.artist,
      referenceHash: e.reference.sha256,
    })),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  scope:
    'Actual installed profile, no runtime injection. All 302 historical Original controls must match the measured complete candidate. Public artist corrections change only 13 Original credits, confined to the footer; body and etching remain exact. Oracle variants retain complete Scryfall wording and physical printing credits with independent symbol choices. Fixed scans and poses are retained, never refitted.',
};
await mkdir(out, { recursive: true });
await writeJson(path.join(out, 'inputs.json'), inputs);
let rows = [];
try {
  const prior = JSON.parse(await readFile(path.join(out, 'capture.json')));
  assert.deepEqual(prior.source, source);
  rows = prior.rows;
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const session = await openBrowser(inputs);
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
  });
  for (const e of inputs.entries) {
    if (rows.some((r) => r.id === e.id)) continue;
    const expected = capture.rows.find((r) => r.id === e.id);
    const result = await session.page.evaluate(async (e) => {
      const { fromScryfallCard } = await import('/games/magic/src/presentation/scryfall-card.ts');
      const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
      const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
      const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
      const { retroTextLayout } = await import('/games/magic/src/presentation/retro-rules.ts');
      const faces = { 'control-original': e.controlFace, original: e.face };
      for (const style of ['modern', 'original'])
        faces['oracle-' + style] = {
          ...fromScryfallCard(e.card, {
            wording: 'oracle',
            symbolStyle: style,
            illustrations: [e.face.illustration],
          }),
          artist: e.face.artist,
        };
      const urls = [...new Set(Object.values(faces).flatMap(canvasAssetUrls))];
      const lease = await loadAccuracyImages(
        urls,
        new AbortController().signal,
        e.face.illustration,
      );
      for (const url of urls.filter(Boolean))
        if (!lease.images.has(url)) throw Error('Undecoded native asset: ' + url);
      const result = {};
      try {
        for (const [variant, face] of Object.entries(faces)) {
          const layers = {};
          let body;
          for (const layer of ['face', 'etching']) {
            const image = await composeCardTexture(
              {
                face,
                printingId: e.id,
                printedImage: null,
                layer: layer === 'face' ? undefined : 'etching',
              },
              'inspect',
              new AbortController().signal,
              { loadImages: async () => ({ ...lease, dispose() {} }) },
            );
            try {
              layers[layer] = image.toDataURL().split(',')[1];
              if (layer === 'face') {
                const l = retroTextLayout(image.getContext('2d'), face);
                body = l
                  ? {
                      size: l.size,
                      overflow: l.overflow,
                      horizontalScale: l.horizontalScale ?? 1,
                      lines: l.lines.map((v) => ({
                        role: v.role,
                        text: v.runs.map((r) => r.text).join(''),
                        baseline: v.baseline,
                        inkBounds: v.inkBounds,
                      })),
                    }
                  : null;
              }
            } finally {
              image.width = image.height = 0;
            }
          }
          result[variant] = { face, body, layers };
        }
      } finally {
        lease.dispose();
      }
      return result;
    }, e);
    const variants = {};
    for (const [variant, values] of Object.entries(result)) {
      const rasters = {};
      await mkdir(path.join(out, variant), { recursive: true });
      for (const [layer, data] of Object.entries(values.layers)) {
        const bytes = Buffer.from(data, 'base64');
        rasters[layer] = hash(bytes);
        await writeFile(
          path.join(out, variant, e.id + (layer === 'face' ? '' : '-etching') + '.png'),
          bytes,
        );
      }
      if (variant === 'control-original') {
        assert.deepEqual(rasters, expected.rasters.candidate, 'Installed pixels differ: ' + e.name);
        assert.deepEqual(values.body, expected.body.candidate, 'Installed body differs: ' + e.name);
        assert.deepEqual(values.face, e.controlFace);
      } else if (variant === 'original') {
        assert.deepEqual(
          values.body,
          expected.body.candidate,
          'Artist correction reflowed body: ' + e.name,
        );
        assert.equal(rasters.etching, expected.rasters.candidate.etching);
        assert.deepEqual(values.face, e.face);
        if (e.face.artist === e.controlFace.artist)
          assert.deepEqual(rasters, expected.rasters.candidate);
        else {
          const a = PNG.sync.read(Buffer.from(result['control-original'].layers.face, 'base64'));
          const b = PNG.sync.read(Buffer.from(values.layers.face, 'base64'));
          assert.equal(a.width, b.width);
          assert.equal(a.height, b.height);
          let changed = 0,
            outside = 0;
          for (let y = 0; y < b.height; y++)
            for (let x = 0; x < b.width; x++) {
              const i = (y * b.width + x) * 4;
              assert.equal(a.data[i + 3], b.data[i + 3]);
              if (![0, 1, 2].some((k) => a.data[i + k] !== b.data[i + k])) continue;
              changed++;
              if (x < 25 * 1.5 || x > 425 * 1.5 || y < 600 * 1.5 || y > 660 * 1.5) outside++;
            }
          assert(changed > 0, 'Changed credit did not change pixels: ' + e.name);
          assert.equal(outside, 0, 'Credit change escaped footer: ' + e.name);
        }
      } else {
        assert.equal(values.face.wordingMode, 'oracle');
        assert.equal(values.face.rulesText, e.card.oracle_text ?? '');
        assert.equal(values.face.typeLine, e.card.type_line);
        assert.equal(
          values.face.artist,
          e.face.artist,
          'Oracle must preserve physical printing credit',
        );
      }
      variants[variant] = {
        rasters,
        body: values.body,
        input: values.face,
        inputHash: hash(JSON.stringify(values.face)),
      };
    }
    rows.push({
      id: e.id,
      name: e.name,
      referenceHash: e.reference.sha256,
      poseHash: expected.poseHash,
      scanHash: expected.scanHash,
      variants,
    });
    await writeJson(path.join(out, 'capture.json'), {
      schema: 2,
      source,
      denominator: 302,
      completed: rows.length,
      rows,
    });
    console.log(rows.length + '/302 ' + e.name);
  }
  assert.deepEqual(session.faults, []);
} finally {
  await session.close();
}
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), source.rendererHash);
const overflow = rows.flatMap((r) =>
  Object.entries(r.variants)
    .filter(([, v]) => v.body?.overflow)
    .map(([variant]) => ({ name: r.name, variant })),
);
await writeJson(path.join(out, 'summary.json'), {
  source,
  cards: rows.length,
  nativeFaces: rows.length * 3,
  controlFaces: rows.length,
  historicalOriginalPixelMatches: rows.length,
  unchangedOriginalFaces: rows.filter(
    (r) => r.variants.original.rasters.face === r.variants['control-original'].rasters.face,
  ).length,
  artistOnlyOriginalChanges: source.artistCorrections.length,
  overflow,
});
console.log(JSON.stringify({ completed: rows.length, overflow }));
assert.deepEqual(overflow, [], 'Native text overflow');
