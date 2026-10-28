import { oldFrameHistoricalSourceFiles } from './old-frame-source-ancestry.mjs';
import { preRevisedRequestSource } from './revised-body-request-ancestry.mjs';
// Exact history for the shared Revised Original fit and six physical ARN credits.
// Projection authenticates historical evidence; it never approves a changed fit.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, readdir } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { root, hash } from './common.mjs';
export const REVISED_BODY_ARTIST_RECEIPT =
  '5af94cce9765bc3bb41a36c4e575721e3c855a8c592c3b16e6f953c46f425a9c';
const FILE = 'games/magic/fixtures/accuracy/3ed-recheck/body-artist-source-delta.json.gz';
let checked;
export function revisedBodyArtistDelta() {
  return (checked ??= (async () => {
    const bytes = await readFile(path.join(root, FILE));
    assert.equal(hash(bytes), REVISED_BODY_ARTIST_RECEIPT);
    const p = JSON.parse(gunzipSync(bytes));
    assert.equal(p.status, 'native-revised-body-and-arn-artist-adoption');
    assert.deepEqual(p.affectedSets, ['3ed', 'arn']);
    assert.deepEqual(
      Object.keys(p.files)
        .filter((f) => f.startsWith('games/magic/src/'))
        .sort(),
      [
        'games/magic/src/data/eager-wording.ts',
        'games/magic/src/data/generated-manifest.json',
        'games/magic/src/data/review-metadata.ts',
        'games/magic/src/data/wording/arn.ts',
        'games/magic/src/presentation/canvas-face.ts',
        'games/magic/src/presentation/early-text-tiers.ts',
        'games/magic/src/presentation/retro-rules.ts',
      ],
    );
    for (const e of Object.values(p.files)) {
      assert.equal(hash(e.beforeSource), e.before);
      assert.equal(hash(e.afterSource), e.after);
    }
    const catalog = p.files['games/magic/fixtures/accuracy/printing-review-catalog.json'],
      a = JSON.parse(catalog.beforeSource),
      b = JSON.parse(catalog.afterSource);
    assert.deepEqual(a.wording, b.wording);
    assert.deepEqual(a.sets, b.sets);
    assert.equal(a.revision, b.revision);
    assert.equal(Object.keys(a.wording).length, 3180);
    assert.equal(Object.keys(a.artists).length, 222);
    assert.equal(Object.keys(b.artists).length, 228);
    for (const [id, v] of Object.entries(a.artists)) assert.deepEqual(b.artists[id], v);
    assert.deepEqual(
      Object.keys(b.artists)
        .filter((id) => !a.artists[id])
        .sort(),
      [...p.artist.ids].sort(),
    );
    assert.equal(hash(await readFile(path.join(root, p.artist.fixture))), p.artist.fixtureHash);
    const load = async (key) => {
      const ref = p.artifacts[key],
        z = await readFile(path.join(root, ref.file));
      assert.equal(hash(z), ref.sha256);
      const raw = gunzipSync(z);
      assert.equal(hash(raw), ref.contentSha256);
      return JSON.parse(raw);
    };
    const captures = {};
    for (const key of [
      'body-before-colors',
      'body-after-colors',
      'body-before-artifacts',
      'body-after-artifacts',
      'body-land-controls',
      'artist-before',
      'artist-after',
      'unaffected',
    ]) {
      const x = await load(key);
      captures[key] = x;
      assert.equal(x.status, 'complete');
      assert.deepEqual(x.faults, []);
      assert.equal(x.rendererHash, key.includes('before') ? p.beforeRenderer : p.afterRenderer);
    }
    const study = await load('selected-native'),
      grid = await load('coupled-study');
    assert.equal(study.rows.length, 281);
    assert.equal(grid.rows.length, 281);
    assert.deepEqual(study.faults, []);
    assert.deepEqual(grid.faults, []);
    let originals = 0,
      variants = 0;
    for (const palette of ['colors', 'artifacts']) {
      const before = captures['body-before-' + palette],
        after = captures['body-after-' + palette];
      assert.deepEqual(before.prototype, {});
      assert.deepEqual(after.prototype, {});
      assert.equal(after.rows.length, palette === 'colors' ? 230 : 51);
      for (const row of after.rows) {
        const old = before.rows.find((r) => r.id === row.id),
          trial = study.rows.find((r) => r.id === row.id),
          selected = trial.trials.find((t) => t.id === 'selected'),
          zero = trial.trials[0],
          recorded = p.body.rows.find((r) => r.id === row.id);
        assert(old && recorded);
        assert.equal(recorded.referenceHash, row.referenceHash);
        assert.equal(recorded.before, zero.baselineHash);
        assert.equal(recorded.after, selected.pngHash);
        assert.equal(zero.baselineHash, old.modes.original.trials.current.sha256);
        assert.equal(selected.pngHash, row.modes.original.trials.current.sha256);
        const content = (t) =>
          t.layout.lines
            .map((l) => l.text)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();
        assert.equal(content(zero), content(selected), 'No printed text may be lost');
        assert.equal(selected.isolation.outside, 0);
        assert.equal(selected.isolation.alpha, 0);
        assert.equal(recorded.beforeText100, zero.score?.[0] == null ? null : zero.score[0] * 100);
        assert.equal(
          recorded.afterText100,
          selected.score?.[0] == null ? null : selected.score[0] * 100,
        );
        for (const mode of ['oracle', 'oracle-modern', 'etching']) {
          assert.equal(old.modes[mode].inputHash, row.modes[mode].inputHash);
          assert.equal(
            old.modes[mode].trials.current.sha256,
            row.modes[mode].trials.current.sha256,
          );
          // The mask contains no rules text. Its diagnostic layout is computed
          // from the Original recipe, so only its raster identity is a control.
          if (mode !== 'etching')
            assert.deepEqual(
              old.modes[mode].trials.current.layout,
              row.modes[mode].trials.current.layout,
            );
          variants++;
        }
        originals++;
      }
    }
    assert.equal(originals, 281);
    assert.equal(variants, 843);
    assert.equal(captures['body-land-controls'].rows.length, 25);
    assert.equal(p.body.acceptedReferences, 270);
    assert.equal(p.body.rows.filter((r) => r.accepted).length, 270);
    assert.equal(p.body.heldOut, false);
    for (const cohort of ['calibration', 'validation', 'all']) {
      const rows = p.body.rows.filter(
          (r) => r.accepted && (cohort === 'all' || r.cohort === cohort),
        ),
        s = p.body.summary[cohort],
        mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
      assert.equal(rows.length, s.cards);
      assert.equal(mean(rows.map((r) => r.delta100)), s.delta100);
      assert(s.delta100 > 0);
      assert.equal(s.improved, rows.filter((r) => r.delta100 > 1e-9).length);
      assert.equal(s.regressed, rows.filter((r) => r.delta100 < -1e-9).length);
    }
    assert.equal(captures['artist-before'].rows.length, 92);
    assert.equal(captures['artist-after'].rows.length, 92);
    let changed = 0,
      unchanged = 0;
    for (const row of captures['artist-after'].rows) {
      const before = captures['artist-before'].rows.find((r) => r.id === row.id);
      for (const mode of ['original', 'oracle', 'oracle-modern', 'etching']) {
        const a = before.modes[mode],
          b = row.modes[mode];
        if (p.artist.ids.includes(row.id) && mode !== 'etching') {
          const r = p.artist.rows.find((r) => r.id === row.id && r.mode === mode);
          assert(r);
          assert.equal(r.before, a.sha256);
          assert.equal(r.after, b.sha256);
          assert.equal(r.outside, 0);
          assert.equal(r.alpha, 0);
          assert(r.pixels > 0);
          changed++;
        } else {
          assert.equal(a.sha256, b.sha256);
          unchanged++;
        }
      }
    }
    assert.equal(changed, 18);
    assert.equal(unchanged, 350);
    assert.equal(captures.unaffected.rows.length, 1001);
    for (const r of captures.unaffected.rows) assert.equal(r.before, r.after);
    return p;
  })());
}
export async function preRevisedBodyArtistSource(file, bytes) {
  bytes = await preRevisedRequestSource(file, bytes);
  const e = (await revisedBodyArtistDelta()).files[file];
  return e && hash(bytes) === e.after ? Buffer.from(e.beforeSource) : bytes;
}
export async function revisedBodyArtistHistoricalHash(
  directory = path.join(root, 'games/magic/src'),
) {
  const files = (await readdir(directory, { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
    .map((e) => path.join(e.parentPath, e.name))
    .sort();
  return hash(
    JSON.stringify(
      await Promise.all(
        (await oldFrameHistoricalSourceFiles(files)).map(async (f) => [
          path.relative(directory, f),
          hash(await preRevisedBodyArtistSource(path.relative(root, f), await readFile(f))),
        ]),
      ),
    ),
  );
}
/** Source wording is unchanged by the fractional layout. Physical credits are
 * independent metadata; only the six exact printings need fresh artist scores. */
export async function revisedBodyArtistAffected(set, task, original = false, group = {}) {
  if (original) return false;
  if (set?.toLowerCase() === '3ed')
    return ['rules', 'flavor', 'fullCard', 'release'].includes(task);
  if (set?.toLowerCase() !== 'arn' || !['artist', 'fullCard', 'release'].includes(task))
    return false;
  const ids = (await revisedBodyArtistDelta()).artist.ids;
  return (group.printingIds ?? []).some((id) => ids.includes(id));
}
