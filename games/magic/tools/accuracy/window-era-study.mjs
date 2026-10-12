import { frameDimensions, estimateScanScale } from './scan-scale.mjs';
import { measureScanFrame } from './scan-translation.mjs';
import assert from 'node:assert/strict';
import { PNG } from 'pngjs';
import { readFile } from 'node:fs/promises';
import { cachedFetch, readObject } from './cache.mjs';
import { cacheRoot, fixtureRoot, writeJson, readJson, hash, mapLimit } from './common.mjs';
import { exclusion, qualityIssue } from './corpus.mjs';
import { normalize } from './pixels.mjs';
import { measureWindows } from './window-geometry.mjs';
import { median } from './metrics.mjs';
const [action = 'compare', ...codes] = process.argv.slice(2),
  sets = codes.length ? codes : ['iko', 'znr', 'mid', 'dmu', 'woe', 'fdn', 'tdm'];
assert.ok(['fetch', 'compare'].includes(action));
assert.ok(sets.every((s) => /^[a-z0-9]{2,8}$/.test(s)));
const bucket = (c) =>
  /Land/.test(c.type_line)
    ? 'land'
    : /Artifact/.test(c.type_line)
      ? 'artifact'
      : c.colors.length === 1
        ? c.colors[0]
        : c.colors.length > 1
          ? 'gold'
          : 'colorless';
for (const set of sets) {
  const file = `${cacheRoot}/sets/${set}-window-era.json`;
  if (action === 'fetch') {
    const metaAsset = await cachedFetch(`https://api.scryfall.com/sets/${set}`),
      meta = JSON.parse((await readObject(metaAsset)).toString()),
      cards = [],
      pages = [];
    let url =
      'https://api.scryfall.com/cards/search?' +
      new URLSearchParams({ q: `set:${set} lang:en game:paper`, unique: 'prints', order: 'set' });
    while (url) {
      const asset = await cachedFetch(url),
        page = JSON.parse((await readObject(asset)).toString());
      assert.ok(Array.isArray(page.data));
      pages.push(asset);
      cards.push(...page.data);
      url = page.has_more ? page.next_page : null;
    }
    const counts = new Map(),
      selected = cards.filter((c) => {
        if (
          exclusion(c) ||
          qualityIssue(c) ||
          /Legendary|Basic Land|Saga|Class|Planeswalker/.test(c.type_line)
        )
          return false;
        const b = bucket(c),
          n = counts.get(b) ?? 0;
        counts.set(b, n + 1);
        return n < 3;
      });
    console.log(set, 'caching', selected.length, 'balanced ordinary cards');
    const entries = await mapLimit(selected, 2, async (card) => {
      const reference = await cachedFetch(card.image_uris.png),
        art = await cachedFetch(card.image_uris.art_crop),
        image = PNG.sync.read(await readObject(reference));
      assert.ok(image.width >= 700 && image.height >= 1000);
      return {
        id: card.id,
        card,
        bucket: bucket(card),
        reference,
        art,
        referenceDimensions: [image.width, image.height],
      };
    });
    await writeJson(file, {
      schemaVersion: 1,
      set,
      name: meta.name,
      releasedAt: meta.released_at,
      meta: metaAsset,
      pages,
      selection:
        'First three high-resolution ordinary nonlegendary normal cards per W/U/B/R/G/artifact/land/gold bucket, frozen before viewing scans. Special treatments and special layouts excluded.',
      complete: false,
      entries,
    });
  }
  const snapshot = await readJson(file),
    rows = [],
    sourceInventory = { total: 0, eligible: 0, excluded: {} };
  for (const page of snapshot.pages) {
    for (const card of JSON.parse((await readObject(page)).toString()).data) {
      sourceInventory.total++;
      const reason =
        exclusion(card) ||
        qualityIssue(card) ||
        (/Legendary|Basic Land|Saga|Class|Planeswalker/.test(card.type_line)
          ? 'outside-normal-nonlegendary-scope'
          : null);
      if (reason) sourceInventory.excluded[reason] = (sourceInventory.excluded[reason] ?? 0) + 1;
      else sourceInventory.eligible++;
    }
  }
  for (const entry of snapshot.entries) {
    const image = PNG.sync.read(await readObject(entry.reference)),
      canonical = normalize(image);
    const printing = frameDimensions(measureScanFrame(canonical));
    rows.push({
      id: entry.id,
      name: entry.card.name,
      number: entry.card.collector_number,
      bucket: entry.bucket,
      referenceHash: entry.reference.sha256,
      artHash: entry.art.sha256,
      source: entry.card.scryfall_uri,
      referenceDimensions: entry.referenceDimensions,
      normalization: canonical.normalization,
      windows: measureWindows(canonical),
      printing,
    });
  }
  const summary = {};
  for (const b of ['all', ...new Set(rows.map((r) => r.bucket))]) {
    const selected = b === 'all' ? rows : rows.filter((r) => r.bucket === b);
    summary[b] = Object.fromEntries(
      ['art', 'rules'].map((name) => {
        const reliable = selected.filter((r) => r.windows[name].reliable);
        return [
          name,
          {
            cards: selected.length,
            measured: reliable.length,
            medianWidth: median(reliable.map((r) => r.windows[name].width)),
            medianCenter: median(reliable.map((r) => r.windows[name].center)),
          },
        ];
      }),
    );
  }
  const mono = rows.filter((r) => ['U', 'B', 'R', 'G'].includes(r.bucket));
  const profile = await readJson(`${fixtureRoot}/scan-normalization-war-profile.json`),
    counts = new Map();
  const samples = mono.map((r) => {
    const n = counts.get(r.bucket) ?? 0;
    counts.set(r.bucket, n + 1);
    return {
      id: r.id,
      bucket: r.bucket,
      cohort: n < 2 ? 'calibration' : 'validation',
      dimensions: r.printing,
    };
  });
  const scaleProfile = estimateScanScale(samples, profile.template);
  const scaleDiagnostics = {
    cards: mono.length,
    outerMeasured: mono.filter((r) => r.printing.outerWidth !== null).length,
    outerWidth: median(
      mono.flatMap((r) => (r.printing.outerWidth !== null ? [r.printing.outerWidth] : [])),
    ),
    ...Object.fromEntries(
      ['art', 'rules'].map((name) => [
        name,
        {
          width: median(
            mono.flatMap((r) => (r.windows[name].reliable ? [r.windows[name].width] : [])),
          ),
          ratioToOuter: median(
            mono.flatMap((r) =>
              r.windows[name].reliable && r.printing.outerWidth !== null
                ? [r.windows[name].width / r.printing.outerWidth]
                : [],
            ),
          ),
        },
      ]),
    ),
  };
  await writeJson(`${fixtureRoot}/window-era-${set}-measurement.json`, {
    schemaVersion: 1,
    set,
    name: snapshot.name,
    releasedAt: snapshot.releasedAt,
    scope:
      'Raw canonical scan geometry only: no renderer tuning, no per-scan transform, no color/saturation matching. Same fixed edge windows for every set; uncertain edges excluded with their measurements retained. Balanced small diagnostic sample, not a full-set census.',
    selection: snapshot.selection,
    sourceInventory,
    snapshotHash: hash(JSON.stringify(snapshot)),
    methods: Object.fromEntries(
      await Promise.all(
        ['window-era-study', 'window-geometry', 'scan-translation', 'scan-scale', 'pixels'].map(
          async (name) => [name, hash(await readFile(new URL(`./${name}.mjs`, import.meta.url)))],
        ),
      ),
    ),
    scaleProfile: {
      ...scaleProfile,
      templateHash: hash(JSON.stringify(profile)),
      scope:
        'First two U/B/R/G cards per color calibrate one uniform set/frame scale from outer rails; third cards validate. Art-window vertical span is a rejection check, never a fitted scale target. No card-specific scale, rotation, or anisotropic warp. Failed fits retain unit scale. This does not establish physical printing dimensions.',
    },
    summary,
    scaleDiagnostics,
    rows,
  });
  console.log(
    set,
    rows.length,
    scaleProfile.status,
    scaleProfile.scale,
    JSON.stringify(scaleDiagnostics),
  );
}
