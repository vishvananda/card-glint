// Exact regional source compatibility; this never certifies a set or a donor fit.
import {
  preModernSymbolPlacementSource,
  originalSymbolPlacementRuntimeParent,
} from './modern-symbol-placement-ancestry.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { hash, root } from './common.mjs';

const FILE = 'games/magic/fixtures/accuracy/ons-recheck/symbols-and-stats-077.json.gz';
const SHA = 'a5d689cb1023a7dafdd911d465eb68eec7ff9463f65e8fb106cc02b5eebbe4f8';
let checked;
export function onsSymbolStatsDelta() {
  return (checked ??= (async () => {
    const bytes = await fs.readFile(path.join(root, FILE));
    assert.equal(hash(bytes), SHA, 'Changed ONS symbol/stats receipt');
    const p = JSON.parse(gunzipSync(bytes));
    assert.equal(p.schema, 1);
    assert.equal(p.kind, 'ons-cost-paper-and-filled-stats');
    assert.deepEqual(p.affectedSets, ['ons']);
    assert.equal(
      p.beforeRenderer,
      '4fc0850d6991e1654cad1088b13d0e77a6d3cef077454d89004a808a11ac0e5c',
    );
    for (const e of Object.values(p.files)) {
      assert.match(e.after, /^[a-f0-9]{64}$/);
      assert.equal(e.beforeSource === null ? null : hash(e.beforeSource), e.before);
    }
    assert.equal(p.native.source.beforeRenderer, p.beforeRenderer);
    assert.equal(p.native.source.afterRenderer, p.afterRenderer);
    assert.deepEqual(p.native.summary, {
      cards: 350,
      renders: 1400,
      changed: 756,
      alpha: 0,
      outside: 0,
    });
    assert.equal(p.native.rows.length, 1400);
    assert.equal(new Set(p.native.rows.map((r) => r.id)).size, 350);
    for (const r of p.native.rows) {
      assert.match(r.before, /^[a-f0-9]{64}$/);
      assert.match(r.after, /^[a-f0-9]{64}$/);
      assert.equal(r.alpha, 0);
      assert.equal(r.outside, 0);
      if (r.mode === 'etching') assert.equal(r.before, r.after);
      if (r.mode === 'oracle-modern') assert.equal(r.genericPaperPixels, 0);
    }
    assert.equal(p.controls.beforeHash, p.beforeRenderer);
    assert.equal(p.controls.afterHash, p.afterRenderer);
    assert.equal(p.controls.count, 574);
    assert.equal(p.controls.changed, 0);
    assert.equal(p.controls.rows.length, 574);
    for (const row of p.controls.rows) {
      assert.match(row.inputHash, /^[a-f0-9]{64}$/);
      assert.match(row.sha256, /^[a-f0-9]{64}$/);
    }
    assert.equal(p.scores.rows.length, 350);
    for (const r of p.scores.rows) {
      assert(Number.isFinite(r.before) && Number.isFinite(r.after));
      for (const [key, value] of Object.entries(r.components))
        if (!['mana', 'stats'].includes(key))
          assert.equal(value.before, value.after, r.name + ' ' + key);
    }
    return p;
  })());
}
export async function preOnsSymbolStatsSource(file, bytes) {
  bytes = await preModernSymbolPlacementSource(file, bytes);
  const e = (await onsSymbolStatsDelta()).files[file];
  return e && e.beforeSource !== null && hash(bytes) === e.after
    ? Buffer.from(e.beforeSource)
    : bytes;
}
export async function onsSymbolStatsHistoricalFiles(files) {
  const p = await onsSymbolStatsDelta(),
    kept = [];
  for (const file of files) {
    const key = file.startsWith('games/') ? file : path.relative(root, file);
    const e = p.files[key];
    if (e?.beforeSource === null && hash(await fs.readFile(path.join(root, key))) === e.after)
      continue;
    kept.push(file);
  }
  return kept;
}
export async function onsSymbolStatsAffected(set, task, original = false, group) {
  if (
    set?.toLowerCase() !== 'ons' ||
    original ||
    !['manaColor', 'stats', 'fullCard', 'release'].includes(task)
  )
    return false;
  if (!Array.isArray(group?.printingIds)) return true;
  const p = await onsSymbolStatsDelta();
  const changed = new Set(
    p.native.rows
      .filter(
        (r) =>
          r.mode === 'original' &&
          (task === 'manaColor'
            ? r.genericPaperPixels
            : task === 'stats'
              ? r.statsPixels
              : r.pixels) > 0,
      )
      .map((r) => r.id),
  );
  return group.printingIds.some((id) => changed.has(id));
}
export async function onsSymbolStatsRuntimeParent(actual, set, task, original = false, group) {
  if (set) actual = await originalSymbolPlacementRuntimeParent(actual);
  const p = await onsSymbolStatsDelta();
  const changed =
    set?.toLowerCase() === 'ons' &&
    (!task || (await onsSymbolStatsAffected(set, task, original, group)));
  return actual === p.afterRenderer && set && !changed ? p.beforeRenderer : actual;
}
