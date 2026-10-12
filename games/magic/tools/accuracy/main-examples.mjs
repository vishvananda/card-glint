import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, realpath } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { cachedFetch } from './cache.mjs';
import {
  root,
  outputRoot,
  cacheRoot,
  fixtureRoot,
  readJson,
  writeJson,
  atomicWrite,
  hash,
  sourceHash,
} from './common.mjs';
import { readPng, normalize, cropGray, savePng } from './pixels.mjs';
import { compareRegion } from './metrics.mjs';
import { regions } from './regions.mjs';
import { mainPage } from './main-page.mjs';

const mainRoot = await realpath(path.resolve(process.argv[2] ?? ''));
if (!process.argv[2] || mainRoot === root) throw Error('Supply an isolated main checkout');
const mainCommit = execFileSync('git', ['rev-parse', 'HEAD'], {
  cwd: mainRoot,
  encoding: 'utf8',
}).trim();
assert.equal(
  mainCommit,
  execFileSync('git', ['rev-parse', 'main'], { cwd: root, encoding: 'utf8' }).trim(),
);
assert.equal(
  execFileSync('git', ['status', '--porcelain', '--untracked-files=no'], {
    cwd: mainRoot,
    encoding: 'utf8',
  }).trim(),
  '',
);
const out = path.join(outputRoot, 'main-review');
const selections = [
  [
    '3ed',
    'revised-centered-final',
    '152',
    'Revised uses larger centered type with 30.25px baseline spacing. Both printed lines match; original wording is identical in both rendered columns.',
    ['body'],
  ],
  [
    '3ed',
    'revised-centered-final',
    '202',
    'The Revised policy matches both printed lines. Existing font strokes are heavier than the scan; the shared frame alignment is unchanged.',
    ['body'],
  ],
  [
    '3ed',
    'revised-centered-final',
    '15',
    'Larger type and balanced lines reproduce the two-line printing. A shared 348px text box also prevents excess wrapping on longer single-line passages.',
    ['body'],
  ],
  [
    '3ed',
    'revised-symbols',
    '274',
    'The diagonal-T tap mark now matches Revised’s symbol identity using the existing font. All three printed lines match. Font stroke weight and the exact symbol outline remain useful review details.',
    ['body'],
  ],
  [
    '4ed',
    'centered',
    '137',
    'Larger centered rules text with balanced line lengths. The shared 344px width preserves the three printed lines; the narrower trial incorrectly added a fourth.',
    ['body'],
  ],
  [
    '4ed',
    'centered',
    '28',
    'The shared Fourth Edition typography policy matches all three printed lines, using the original wording on both sides.',
    ['body'],
  ],
  [
    '4ed',
    'centered',
    '46',
    'Remaining review case: centering and size improve, but “gets” still starts the second line instead of ending the first. No scan-specific line break is supplied to the painter.',
    ['body'],
  ],
  [
    '4ed',
    'centered',
    '165',
    'Title, mana, credits and stats; the text now sits inside the black panel and uses the printed line breaks.',
    ['title', 'mana', 'body', 'footer', 'stats'],
  ],
  [
    '4ed',
    'centered',
    '3',
    'Original printed wording and Summon Mob type on both sides. Corrected body inset and paragraph spacing, plus mana, credits and wide stats.',
    ['mana', 'body', 'footer', 'stats'],
  ],
  [
    'mir',
    'text-insets',
    '29',
    'The white-frame text box is 10 canonical pixels wider; all seven printed lines now match with the same fonts. Gray bevel on the left/bottom is baked into the frame asset and remains flagged.',
    ['type', 'body', 'footer'],
  ],
  [
    'mir',
    'retro-basics',
    '91',
    'Text layout, mana row, historic tap and outlined set symbol.',
    ['mana', 'body', 'set-symbol', 'footer'],
  ],
  [
    'tmp',
    'retro-basics',
    '290',
    'Historic tap, set-symbol outline, text and legal line.',
    ['body', 'set-symbol', 'footer'],
  ],
  [
    'tmp',
    'retro-basics',
    '335',
    'Historical Land type and centered mana sentence replace the large symbol.',
    ['type', 'body'],
  ],
];
const examples = [];
const visibleFraction = (bytes) => {
  const pixels = PNG.sync.read(bytes);
  let visible = 0;
  for (let i = 3; i < pixels.data.length; i += 4) if (pixels.data[i] > 0) visible++;
  return visible / (pixels.width * pixels.height);
};
const fontAssets = [];
for (const source of [mainRoot, root]) {
  const css = await readFile(path.join(source, 'games/magic/fonts.css'), 'utf8');
  for (const [, url] of css.matchAll(/url\('([^']+)'\)/g)) fontAssets.push(await cachedFetch(url));
}
const rendererHashes = await Promise.all(
  [mainRoot, root].map((r) => sourceHash(path.join(r, 'games/magic/src'))),
);
const fontHashes = await Promise.all(
  [mainRoot, root].map(async (r) => hash(await readFile(path.join(r, 'games/magic/fonts.css')))),
);
for (const set of new Set(selections.map((s) => s[0]))) {
  const snapshot = await readJson(path.join(cacheRoot, 'sets', `${set}.json`));
  snapshot.components = [...snapshot.components, ...fontAssets];
  const profile = await readJson(path.join(fixtureRoot, set, 'alignment.json'));
  const entries = [];
  for (const [, run, number, note, metricRegions] of selections.filter((s) => s[0] === set)) {
    const capture = await readJson(path.join(outputRoot, set, run, 'capture.json'));
    const card = capture.results.find((c) => c.collectorNumber === number);
    assert.ok(card && !card.issue);
    assert.equal(
      card.contentStatus,
      'scan-reviewed',
      'Comparison examples require printed wording',
    );
    assert.equal(hash(JSON.stringify(card.face)), card.inputHash);
    const reference = path.join(outputRoot, set, run, card.images.reference.file);
    assert.equal(hash(await readFile(reference)), card.images.reference.sha256);
    const transform = profile.frameFamilies[card.frame]?.transform ?? {};
    const aligned = normalize(await readPng(reference), transform);
    const scanFile = `${set}-${number}.scan.png`;
    await savePng(path.join(out, scanFile), aligned);
    entries.push({
      set,
      card,
      note,
      metricRegions,
      aligned,
      alignment: { profileHash: hash(JSON.stringify(profile)), transform },
      images: { scan: scanFile },
      captures: {},
    });
  }
  for (const [side, sourceRoot] of [
    ['main', mainRoot],
    ['branch', root],
  ]) {
    const session = await openBrowser(snapshot, { sourceRoot });
    try {
      for (const entry of entries) {
        const capture = () =>
          session.page.evaluate(async (face) => {
            const { composeCardTexture } = await import(
              '/games/magic/src/presentation/canvas-face.ts'
            );
            const { loadCanvasImages } = await import(
              '/games/magic/src/presentation/canvas-assets.ts'
            );
            const canvas = await composeCardTexture(
              { face, printingId: null, printedImage: null },
              'inspect',
              new AbortController().signal,
              {
                loadImages: async (urls, signal) => {
                  const loaded = await loadCanvasImages(urls, signal);
                  const missing = urls.filter((u) => u && !loaded.images.has(u));
                  if (missing.length) {
                    loaded.dispose();
                    throw Error('Missing assets: ' + missing.join(', '));
                  }
                  return loaded;
                },
              },
            );
            const data = canvas.toDataURL('image/png');
            const fonts = [...document.fonts].map((f) => ({
              family: f.family,
              style: f.style,
              status: f.status,
            }));
            canvas.width = canvas.height = 0;
            return { data, fonts };
          }, entry.card.face);
        let captured = await capture();
        let bytes = Buffer.from(captured.data.split(',')[1], 'base64');
        let attempts = 1;
        if (visibleFraction(bytes) <= 0.9) {
          // Empty pixels are a capture failure, never a fidelity score. Retry
          // once in a fresh document and retain this fact in the provenance.
          await session.page.reload({ waitUntil: 'load' });
          captured = await capture();
          bytes = Buffer.from(captured.data.split(',')[1], 'base64');
          attempts++;
        }
        const failedFonts = captured.fonts.filter((f) => f.status === 'error');
        assert.ok(side === 'main' || failedFonts.length === 0, 'Branch fonts must load');
        assert.ok(
          failedFonts.every(
            (f) => f.family === 'CardRenderer MTG MPlantin' && f.style === 'italic',
          ),
          'Unexpected failed font',
        );
        const file = `${set}-${entry.card.collectorNumber}.${side}.png`;
        assert.ok(
          visibleFraction(bytes) > 0.9,
          `Empty or incomplete ${side} capture for ${entry.card.name}; do not score it`,
        );
        await atomicWrite(path.join(out, file), bytes);
        entry.images[side] = file;
        entry.captures[side] = {
          sha256: hash(bytes),
          attempts,
          fonts: captured.fonts,
          browser: await session.browser.version(),
        };
      }
      assert.deepEqual(session.faults, []);
    } finally {
      await session.close();
    }
  }
  for (const entry of entries) {
    assert.equal(entry.captures.main.browser, entry.captures.branch.browser);
    const scores = [];
    for (const region of regions(entry.card).filter((r) => entry.metricRegions.includes(r.id))) {
      const target = cropGray(entry.aligned, region.rect),
        values = [];
      for (const side of ['main', 'branch']) {
        const image = normalize(await readPng(path.join(out, entry.images[side]))),
          crop = cropGray(image, region.rect);
        values.push(
          compareRegion(target.gray, crop.gray, crop.width, crop.height, region.lightInk)
            .edgeF1?.[1] ?? null,
        );
      }
      scores.push({ region: region.id, rect: region.rect, values });
    }
    examples.push({
      set,
      id: entry.card.id,
      name: entry.card.name,
      number: entry.card.collectorNumber,
      source: entry.card.source,
      inputHash: entry.card.inputHash,
      referenceHash: entry.card.images.reference.sha256,
      alignment: entry.alignment,
      contentStatus: entry.card.contentStatus,
      face: entry.card.face,
      reviewCase: ['Mtenda Herder', 'Righteousness', 'Sol Ring'].includes(entry.card.name),
      note: entry.note,
      images: entry.images,
      captures: entry.captures,
      scores,
    });
  }
}
assert.deepEqual(
  rendererHashes,
  await Promise.all([mainRoot, root].map((r) => sourceHash(path.join(r, 'games/magic/src')))),
  'Renderer changed during capture',
);
examples.sort((a, b) => Number(a.reviewCase) - Number(b.reviewCase));
const report = {
  schemaVersion: 1,
  mainCommit,
  branchCommit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  rendererHashes,
  fontHashes,
  metricSource: await sourceHash(
    new URL('.', import.meta.url),
    /^(?:compare(?:-worker)?|common|summary|alignment|frame-boundaries|pixels|edges|metrics|regions)\.mjs$/,
  ),
  note: 'Selected examples with scan-reviewed wording, not an exhaustive main-branch ranking. Remaining soft-break differences, font weight, historic tap glyph, gray text-box bevel and set-symbol shape remain flagged. Identical per-card face inputs, cached artwork and frame bytes. Each revision uses its own unmodified font stylesheet and renderer. Fixed shared reference alignment; inspection tier only. Main font failures, if present, are recorded rather than silently repaired.',
  examples,
};
await writeJson(path.join(out, 'comparison.json'), report);
await mainPage(report, out);
console.log(
  JSON.stringify(
    {
      mainCommit,
      rendererHashes,
      examples: examples.map((c) => ({ name: c.name, scores: c.scores })),
    },
    null,
    2,
  ),
);
