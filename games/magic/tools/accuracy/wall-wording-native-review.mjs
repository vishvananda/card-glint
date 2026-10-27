// Full-set pixel isolation for exact printing-source corrections.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { hash, writeJson } from './common.mjs';
import { wallReviews } from './wall-wording-data.mjs';
const [configurationFile, output] = process.argv.slice(2);
assert(output, 'Usage: wall-wording-native-review.mjs PRIVATE_CONFIG NEW_OUTPUT');
const config = JSON.parse(await fs.readFile(configurationFile));
assert.deepEqual(config.map((c) => c.set).sort(), ['2ed', '4ed']);
await fs.writeFile(output, JSON.stringify({ status: 'running' }), { flag: 'wx' });
async function bytes(file, mode) {
  const b = await fs.readFile(path.join(path.dirname(file), mode.file));
  assert.equal(hash(b), mode.sha256);
  return b;
}
function difference(bb, ab) {
  const b = PNG.sync.read(bb),
    a = PNG.sync.read(ab);
  assert.deepEqual([a.width, a.height], [b.width, b.height]);
  let changed = 0,
    outside = 0,
    alpha = 0;
  for (let p = 0; p < a.width * a.height; p++) {
    const i = 4 * p;
    if (a.data[i + 3] !== b.data[i + 3]) alpha++;
    if (
      a.data[i] !== b.data[i] ||
      a.data[i + 1] !== b.data[i + 1] ||
      a.data[i + 2] !== b.data[i + 2]
    ) {
      changed++;
      const x = p % a.width,
        y = Math.floor(p / a.width);
      if (x < 90 || x >= 645 || y < 607 || y >= 910) outside++;
    }
  }
  return { changed, outside, alpha };
}
const sets = {},
  sources = {},
  modes = ['original', 'oracle', 'oracle-modern', 'etching'];
let beforeRenderer, afterRenderer;
for (const c of config) {
  const files = [c.beforeInputs, c.afterInputs, c.beforeNative, c.afterNative],
    raw = await Promise.all(files.map((f) => fs.readFile(f)));
  const [beforeInput, afterInput, before, after] = raw.map((b) => JSON.parse(b));
  const count = c.set === '2ed' ? 302 : 378,
    selected = wallReviews
      .filter((r) => r.set === c.set)
      .map((r) => r.id)
      .sort();
  for (const n of [before, after]) {
    assert.equal(n.status, 'complete');
    assert.deepEqual(n.faults, []);
    assert.equal(n.rows.length, count);
  }
  assert.equal(before.inputHash, hash(raw[0]));
  assert.equal(after.inputHash, hash(raw[1]));
  if (beforeRenderer) assert.equal(before.rendererHash, beforeRenderer);
  else beforeRenderer = before.rendererHash;
  if (afterRenderer) assert.equal(after.rendererHash, afterRenderer);
  else afterRenderer = after.rendererHash;
  assert.equal(beforeInput.entries.length, count);
  assert.equal(afterInput.entries.length, count);
  assert.deepEqual(after.rows.map((r) => r.id).sort(), before.rows.map((r) => r.id).sort());
  const rows = [],
    counts = Object.fromEntries(
      modes.map((m) => [m, { changed: 0, unchanged: 0, keysChanged: 0 }]),
    );
  for (const e of beforeInput.entries) {
    const next = afterInput.entries.find((r) => r.id === e.id),
      b = before.rows.find((r) => r.id === e.id),
      a = after.rows.find((r) => r.id === e.id),
      scoped = selected.includes(e.id);
    assert.equal(e.card.set, c.set);
    assert.deepEqual(next.card, e.card);
    assert.deepEqual(next.reference, e.reference);
    assert.deepEqual(next.art, e.art);
    const flavor = e.face.rulesParagraphs.filter((p) => p.role === 'flavor');
    if (scoped) {
      assert.equal(e.reference.sha256, wallReviews.find((r) => r.id === e.id).referenceHash);
      assert(e.face.rulesParagraphs.some((p) => p.role === 'rules'));
      assert(flavor.length);
      assert.deepEqual(next.face, {
        ...e.face,
        rulesText: flavor.map((p) => p.runs.map((r) => r.text).join('')).join('\n'),
        rulesParagraphs: flavor,
        ...(e.face.rulesAlignment?.mode === 'auto'
          ? { rulesAlignment: { ...e.face.rulesAlignment, reference: flavor } }
          : {}),
      });
    } else assert.deepEqual(next.face, e.face);
    assert.equal(b.referenceHash, e.reference.sha256);
    assert.equal(a.referenceHash, b.referenceHash);
    assert.equal(b.artHash, e.art.sha256);
    assert.equal(a.artHash, b.artHash);
    const observed = {};
    for (const mode of modes) {
      const old = b.modes[mode],
        n = a.modes[mode],
        bb = await bytes(c.beforeNative, old),
        ab = await bytes(c.afterNative, n);
      if (!scoped) assert.equal(old.inputHash, n.inputHash);
      const changed = old.sha256 !== n.sha256;
      assert.equal(
        changed,
        scoped && mode === 'original',
        'Unexpected native change ' + e.name + ' ' + mode,
      );
      counts[mode][changed ? 'changed' : 'unchanged']++;
      if (old.keyHash !== n.keyHash) counts[mode].keysChanged++;
      const delta = changed ? difference(bb, ab) : { changed: 0, outside: 0, alpha: 0 };
      assert.equal(delta.outside, 0);
      assert.equal(delta.alpha, 0);
      if (n.layout) assert.equal(n.layout.overflow, false);
      else assert.equal(n.layout, old.layout);
      if (!scoped || mode.startsWith('oracle')) assert.deepEqual(n.layout, old.layout);
      observed[mode] = {
        before: old.sha256,
        after: n.sha256,
        beforeKey: old.keyHash,
        afterKey: n.keyHash,
        ...delta,
      };
    }
    rows.push({
      id: e.id,
      name: e.name,
      scoped,
      referenceHash: e.reference.sha256,
      artHash: e.art.sha256,
      beforeInputHash: hash(JSON.stringify(e.face)),
      inputHash: hash(JSON.stringify(next.face)),
      modes: observed,
    });
    if (rows.length % 50 === 0)
      console.log('Wall source native isolation', c.set, rows.length, '/', count);
  }
  for (const mode of modes) {
    const changed = mode === 'original' ? 2 : 0;
    assert.deepEqual(counts[mode], { changed, unchanged: count - changed, keysChanged: changed });
  }
  sets[c.set] = { printings: count, nativeVariants: count * 4, ids: selected, counts, rows };
  sources[c.set] = raw.map(hash);
}
await writeJson(output, {
  schema: 1,
  status: 'complete-native-wall-wording-isolation',
  scope:
    'Four exact Original empty-rule corrections across680 printings/2720native variants. Caller flavor and Oracle are preserved;all pixel differences are confined to Original bodies,with exact art/frame/alpha/mask controls. No geometry,font,pigment or scan-pose override.',
  beforeRenderer,
  afterRenderer,
  sets,
  sources,
  toolHash: hash(await fs.readFile(new URL(import.meta.url))),
});
