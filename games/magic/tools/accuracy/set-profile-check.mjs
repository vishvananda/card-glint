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
    assert.ok(['abu', 'fourth', 'seventh', 'mse-old'].includes(frame.family));
    assert.match(frame.assetKey, /^[a-z][a-zA-Z]*$/);
    for (const field of ['frame', 'art', 'stockWindow']) rect(frame[field]);
    if (frame.stockMaskFrame !== undefined) rect(frame.stockMaskFrame);
    if (frame.artWindow !== undefined) {
      const [sx, sy, sw, sh] = frame.artWindow.source;
      const anchor = frame.artWindow.lowerAnchor;
      rect(frame.artWindow.source);
      assert.ok([sx, sy, sw, sh, anchor].every(Number.isFinite));
      assert.ok(sx > 0 && sy > 0 && sx + sw < 1 && sy + sh < anchor && anchor <= 1);
      const [fx, fy, fw, fh] = frame.frame;
      const [ax, ay, aw, ah] = frame.art;
      assert.ok(ax > fx && ay > fy && ax + aw < fx + fw && ay + ah < fy + fh * anchor);
    }
    const source = JSON.stringify([
      frame.family === 'mse-old'
        ? `${manifest.MSE_TEMPLATE_ROOT}/magic-old.mse-style/${frame.assetKey}card.jpg`
        : `${manifest.RETRO_ROOT}/img/frames/${frame.family === 'seventh' ? 'seventh/regular' : 'old/' + frame.family}/${frame.assetKey}.png`,
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
  for (const [name, material] of Object.entries(profile.landMaterials ?? {})) {
    assert(name.trim().length > 0);
    assert(material.startsWith('L') && profile.frames[material], 'Unknown land material');
  }
  if (profile.basicSymbol) {
    assert(
      profile.basicSymbol.originalLetters === undefined ||
        typeof profile.basicSymbol.originalLetters === 'boolean',
    );
    if (profile.basicSymbol.bounds) {
      rect(profile.basicSymbol.bounds);
      const [x, y, w, h] = profile.basicSymbol.bounds;
      assert(x >= 0 && y >= 0 && x + w <= 1 && y + h <= 1);
    }
  }
  for (const p of Object.values(profile.rulesPlacement ?? {})) {
    assert(p.baselineScale >= 0.9 && p.baselineScale <= 1.1);
    assert(p.offset.length === 2 && p.offset.every((v) => Math.abs(v) <= 8));
    assert(p.verticalLimits.length === 2 && p.verticalLimits[0] < p.verticalLimits[1]);
    if (p.maximumHeight !== undefined) assert(p.maximumHeight > 0 && p.maximumHeight <= 240);
  }
  const legal = profile.footer.legal;
  if (legal.align !== undefined) assert(['left', 'right', 'center'].includes(legal.align));
  if (legal.maxWidth !== undefined) assert(legal.maxWidth > 0 && legal.maxWidth <= 488);
  if (legal.collectorTotal !== undefined)
    assert(Number.isInteger(legal.collectorTotal) && legal.collectorTotal > 0);
  if (legal.lightMaterials !== undefined)
    assert(legal.lightMaterials.every((m) => Object.hasOwn(profile.frames, m)));
  for (const c of Object.values(profile.colors)) {
    const adj = c.adjustment;
    const masks = [adj.mask, ...(adj.regions ?? []).map((r) => r.mask)].filter(Boolean);
    for (const mask of masks)
      if (mask.kind === 'linear') {
        rect(mask.rect);
        const [x, y, w, h] = mask.rect;
        assert(x >= 0 && y >= 0 && x + w <= 1 && y + h <= 1 && mask.feather > 0);
      }
  }
  if (profile.dualLand) {
    const dual = profile.dualLand,
      frame = profile.frames['L-dual'];
    assert.equal(frame?.family, 'abu', 'Dual geometry requires an ABU source');
    assert.match(dual.stock, /^#[0-9a-f]{6}$/i);
    for (const color of 'WUBRG') {
      const source = dual.sources[color];
      assert(source, 'Missing dual source: ' + color);
      assert.equal(
        source.source,
        JSON.stringify([
          `${manifest.RETRO_ROOT}/img/frames/old/abu/${color.toLowerCase()}l.png`,
          frame.frame,
        ]),
        'Stale dual source/geometry: ' + color,
      );
      const rgb = dual.pinline.palette[color];
      assert(
        rgb?.length === 3 && rgb.every((v) => v >= 0 && v <= 1),
        'Invalid dual band ink: ' + color,
      );
    }
    const { box, width, edge } = dual.pinline;
    assert(box.left >= 0 && box.right <= 1500 && box.top >= 0 && box.bottom <= 2100);
    assert(box.right > box.left && box.bottom > box.top);
    assert(Object.values(width).every((v) => v > 0 && v <= 80));
    assert(
      width.left + width.right < box.right - box.left &&
        width.top + width.bottom < box.bottom - box.top,
    );
    if (edge) assert(edge.length === 3 && edge.every((v) => v >= 0 && v <= 1));
    assert(Object.keys(dual.outlines).length > 0);
    for (const [pair, color] of Object.entries(dual.outlines)) {
      assert.match(pair, /^(WU|WB|WR|WG|UB|UR|UG|BR|BG|RG)$/);
      assert('WUBRG'.includes(color));
    }
  }
  if (profile.textTiers?.retainRegularAboveLines !== undefined)
    assert(
      Number.isInteger(profile.textTiers.retainRegularAboveLines) &&
        profile.textTiers.retainRegularAboveLines > 0,
    );
  const artist = profile.footer.artist;
  if (artist.prefix !== undefined) assert.equal(typeof artist.prefix, 'string');
  if (artist.align !== undefined) assert(['left', 'right', 'center'].includes(artist.align));
  if (artist.baseline !== undefined)
    assert(['alphabetic', 'middle', 'top', 'bottom'].includes(artist.baseline));
  if (artist.maxWidth !== undefined) assert(artist.maxWidth > 0 && artist.maxWidth <= 488);
  if (profile.footer.stats.baseline !== undefined)
    assert(['alphabetic', 'middle'].includes(profile.footer.stats.baseline));
  if (profile.footer.legal.defaultText !== undefined)
    assert.equal(typeof profile.footer.legal.defaultText, 'string');
  for (const [color, ink] of Object.entries(profile.mana.sourceInk ?? {})) {
    assert.match(color, /^[WUBRG]$/, 'Source ink requires a colored mana symbol');
    assert.ok(['conjurer-old', 'mse-old'].includes(ink.family), 'Unsupported source ink family');
    assert.ok(
      typeof ink.pixels === 'number' && ink.pixels >= 0 && ink.pixels <= 1,
      'Invalid source ink pixels',
    );
    assert.ok(
      ink.paperSample === undefined || ink.paperSample === 'opaque-percentile',
      'Unsupported source paper sampler',
    );
  }
  for (const p of [profile.title, profile.type, ...Object.values(profile.footer)]) lettering(p);
  for (const symbol of Object.values(profile.setSymbols ?? {})) {
    rect(symbol.crop);
    assert.ok(symbol.width > 0 && symbol.height > 0);
  }
  if (profile.bodyClasses) {
    const p = profile.bodyClasses;
    assert(p.materials.length > 0 && new Set(p.materials).size === p.materials.length);
    assert(p.materials.every((m) => Object.hasOwn(profile.frames, m)));
    rect([p.bounds.x, p.bounds.y, p.bounds.width, p.bounds.height], false);
    assert(p.centered.size >= 6 && p.centered.size <= 45);
    assert(Number.isInteger(p.centered.maxCharacters) && p.centered.maxCharacters > 0);
    assert(Number.isInteger(p.centered.maxLines) && p.centered.maxLines > 0);
    assert(p.compact.nominalMinimum > 0 && p.compact.nominalMaximum > p.compact.nominalMinimum);
    assert(p.compact.size >= 6 && p.compact.size <= p.compact.nominalMaximum);
    assert(p.compact.leading > 0 && p.compact.leading <= 2);
    assert(p.typography.leading > 0 && p.typography.leading <= 2);
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
    await server.ssrLoadModule('/games/magic/src/data/eager.ts');
    const { profileSets } = await server.ssrLoadModule('/games/magic/src/data/scopes.ts');
    const { setCalibrationProfiles } = await server.ssrLoadModule(
      '/games/magic/src/calibration/profiles.ts',
    );
    const manifest = JSON.parse(await readFile(new URL('../../assets.json', import.meta.url)));
    assert.ok(profileSets.length > 0, 'No full profiles registered');
    assert.deepEqual(Object.keys(setCalibrationProfiles).sort(), [...profileSets].sort());
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
