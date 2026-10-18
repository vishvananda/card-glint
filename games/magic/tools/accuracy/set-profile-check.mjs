import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { readFile } from 'node:fs/promises';
import { hash, root } from './common.mjs';

/** Data checks run without Chromium, fonts, images or network. */
export function checkSetProfile(profile, review, manifest) {
  assert.equal(profile.schema, 1);
  assert.match(profile.set, /^[a-z0-9]{2,8}$/);
  assert.ok(Number.isInteger(profile.revision) && profile.revision > 0);
  assert.equal(review.revision, profile.revision, 'Update review and rendering revisions together');
  assert.ok(review.evidence.length > 0 && review.scope.length > 0);
  const finite = (value) => {
    if (typeof value === 'number') assert.ok(Number.isFinite(value));
    else if (value && typeof value === 'object') for (const v of Object.values(value)) finite(v);
  };
  finite(profile);
  const rect = (r, normalized = true) => {
    assert.equal(r.length, 4);
    assert.ok(r[2] > 0 && r[3] > 0);
    assert.ok(r.every((n) => Math.abs(n) <= (normalized ? 2 : 1000)));
  };
  const lettering = (p) => {
    assert.ok(p.size >= 6 && p.size <= 60);
    assert.ok(p.width >= 0.5 && p.width <= 1.5);
    assert.ok(p.shadow >= 0 && p.shadow <= 6);
    assert.ok(p.trim >= 0 && p.trim <= 2);
    for (const key of ['gray', 'lightGray', 'darkGray'])
      if (p[key] !== undefined) assert.ok(p[key] >= 0 && p[key] <= 255);
  };
  for (const [key, frame] of Object.entries(profile.frames)) {
    assert.ok(['abu', 'fourth'].includes(frame.family));
    assert.match(frame.assetKey, /^[a-z]+$/);
    for (const field of ['frame', 'art', 'stockWindow']) rect(frame[field]);
    const source = JSON.stringify([
      `${manifest.RETRO_ROOT}/img/frames/old/${frame.family}/${frame.assetKey}.png`,
      frame.frame,
    ]);
    for (const [color, adjustment] of Object.entries(profile.colors))
      if (color === key || (key === 'L' && color.startsWith('L-') && !profile.frames[color])) {
        assert.equal(
          adjustment.source,
          source,
          `Stale color source/geometry: ${profile.set}/${color}`,
        );
        assert.match(adjustment.stock, /^#[0-9a-f]{6}$/i);
      }
  }
  for (const p of [profile.title, profile.type, ...Object.values(profile.footer)]) lettering(p);
  for (const symbol of Object.values(profile.setSymbols ?? {})) {
    rect(symbol.crop);
    assert.ok(symbol.width > 0 && symbol.height > 0);
  }
  for (const body of Object.values(profile.body ?? {})) {
    rect(Object.values(body.bounds), false);
    assert.ok(
      body.minimumSize >= 6 && body.maximumSize >= body.minimumSize && body.maximumSize <= 45,
    );
    assert.ok(body.typography.leading > 0 && body.typography.leading <= 2);
    assert.ok(body.typography.paragraphGap >= 0 && body.typography.flavorGap >= 0);
  }
}

if (process.argv[1]?.endsWith('/set-profile-check.mjs')) {
  const server = await createServer({
    configFile: false,
    root,
    server: { middlewareMode: true },
    optimizeDeps: { noDiscovery: true },
  });
  try {
    const { setCalibrationProfiles } = await server.ssrLoadModule(
      '/games/magic/src/calibration/profiles.ts',
    );
    const manifest = JSON.parse(await readFile(new URL('../../assets.json', import.meta.url)));
    for (const [set, profile] of Object.entries(setCalibrationProfiles)) {
      const { review } = await server.ssrLoadModule(`/games/magic/src/calibration/sets/${set}.ts`);
      checkSetProfile(profile, review, manifest);
      console.log(
        `${set} r${profile.revision}: ${Object.keys(profile.frames).length} frames; values ${hash(JSON.stringify(profile))}; pending ${review.pending.join(', ')}`,
      );
    }
  } finally {
    await server.close();
  }
}
