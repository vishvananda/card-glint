import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { cachedFetch, readObject } from './cache.mjs';
import { fixtureRoot, hash, writeJson } from './common.mjs';
import { stockBounds } from './frame-family-metrics.mjs';
import { normalize } from './pixels.mjs';

// This review card is intentionally outside both frozen fitting cohorts. This
// command only observes the already frozen profile; it cannot change admission.
const id = 'cb9b9a9d-ae4c-4e04-bf9d-cae48f01292c',
  profileBytes = await readFile(`${fixtureRoot}/old-frame-registration-3ed.json`),
  profile = JSON.parse(profileBytes),
  reference = await cachedFetch(`https://cards.scryfall.io/png/front/c/b/${id}.png?1783948311`, {
    offline: true,
  });
assert.ok(profile.accepted && profile.set === '3ed' && profile.frameFamily === 'fourth');
assert.ok(!profile.referenceRows.some((row) => row.id === id), 'Diagnostic entered frozen cohorts');
assert.equal(reference.sha256, '535e8bde88dcb9e53564e4baecd2ace5f93b843f0144b4a925751b61c6f3b557');
const scan = PNG.sync.read(await readObject(reference), { checkCRC: true }),
  target = profile.targets.R,
  measurements = {};
for (const [mode, transform] of [
  ['raw', {}],
  ['shared', profile.transform],
]) {
  const bounds = stockBounds(normalize(scan, transform), profile.border),
    residuals = Object.fromEntries(
      ['left', 'right', 'top', 'bottom'].map((side) => [
        side,
        bounds.sides[side].position - target.sides[side].position,
      ]),
    );
  assert.ok(bounds.reliable, 'Independent scan has uncertain stock anchors');
  measurements[mode] = {
    bounds,
    residuals,
    rms: Math.sqrt(Object.values(residuals).reduce((sum, v) => sum + v * v, 0) / 4),
  };
}
const result = {
  schemaVersion: 1,
  status: 'independent-diagnostic-only',
  policy:
    'One frozen shared profile applied without fitting. Four outer stock boundaries only; art, type line, title, rules text and internal bevels are excluded. This observation cannot admit or adjust the profile.',
  id,
  name: 'Lightning Bolt',
  set: '3ed',
  number: '162',
  material: 'R',
  reference,
  profileHash: hash(JSON.stringify(profile)),
  profileFileSha256: hash(profileBytes),
  methodHash: hash(
    Buffer.concat(
      await Promise.all(
        ['old-frame-registration-diagnostic.mjs', 'frame-family-metrics.mjs', 'pixels.mjs'].map(
          (p) => readFile(new URL(p, import.meta.url)),
        ),
      ),
    ),
  ),
  transform: profile.transform,
  target,
  measurements,
};
await writeJson(`${fixtureRoot}/old-frame-registration-3ed-diagnostic.json`, result);
console.log(
  `Independent Bolt stock RMS: ${measurements.raw.rms.toFixed(3)} → ${measurements.shared.rms.toFixed(3)} canonical pixels`,
);
