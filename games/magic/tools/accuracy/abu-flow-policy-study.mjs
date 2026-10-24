// Actual native study of shared ABU flow rules, with fixed scan poses and source assets.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { PNG } from 'pngjs';
import { hash, sourceHash } from './common.mjs';
import { abuArtDelta } from './abu-art-ancestry.mjs';
import { openBrowser } from './browser.mjs';
import { abuFlowPolicyPlugin } from './abu-flow-policy-plugin.mjs';
const [inputFile, out, subset] = process.argv.slice(2);
assert(subset === undefined || subset === '--small-controls');
assert(out, 'Usage: abu-flow-policy-study.mjs INPUTS OUT');
const p = await abuArtDelta(),
  ib = await readFile(inputFile),
  inputs = JSON.parse(ib),
  prior = JSON.parse(gunzipSync(await readFile(p.native.file)));
assert.equal(hash(ib), prior.source.inputHash);
const names = [
  'Word of Command',
  'Basalt Monolith',
  'Howl from Beyond',
  'Birds of Paradise',
  'False Orders',
  'Wall of Brambles',
  'Black Vise',
  'Stasis',
  'Twiddle',
  'Lifetap',
  'Gauntlet of Might',
];
const controls = [
  'Animate Dead',
  'Warp Artifact',
  'Keldon Warlord',
  'Pearled Unicorn',
  'Serra Angel',
];
const chars = (e) =>
  e.face.rulesParagraphs?.reduce((n, p) => n + p.runs.reduce((n, r) => n + r.text.length, 0), 0) ??
  0;
const entries = inputs.entries.filter((e) =>
  subset
    ? ['Mana Vault', 'Hypnotic Specter'].includes(e.name)
    : chars(e) > 274 ||
      names.includes(e.name) ||
      controls.includes(e.name) ||
      ['Mana Vault', 'Hypnotic Specter'].includes(e.name),
);
const trials = [
  { id: 'current', policy: null },
  { id: 'control', policy: {} },
  { id: 'small-seven', policy: { smallSeven: true } },
  { id: 'small-seven-width-one', policy: { smallSeven: true, denseOne: true } },
  { id: 'centered-y-zero', policy: { zeroCentered: true } },
  { id: 'keyword-large', policy: { keyword: true } },
  {
    id: 'combined',
    policy: { smallSeven: true, denseOne: true, zeroCentered: true, keyword: true },
  },
];
const source = {
  rendererHash: await sourceHash('games/magic/src'),
  inputHash: hash(ib),
  parentNativeHash: p.native.contentSha256,
  toolHash: hash(await readFile(new URL(import.meta.url))),
  pluginHash: hash(await readFile(new URL('./abu-flow-policy-plugin.mjs', import.meta.url))),
  cohort: subset
    ? 'All six content-reviewed small-face Mana Vault/Hypnotic Specter controls, with the same shared proposals and frozen Original inputs. Completes the force-small eligibility cases omitted by the first dense-only selection.'
    : 'All content-reviewed small faces and dense passages >274characters, every existing count-matched placement review and selected low-score cases, plus five ordinary/flavor controls per set. Original wording and all scan transforms fixed. Minimum7-row small-face budget, normalized dense glyph width, retirement of old centered vertical offsets and short multi-paragraph keyword layout are separate shared proposals; no per-card offsets or scan refits.',
};
assert.equal(source.rendererHash, p.afterRenderer);
await mkdir(out, { recursive: true });
await writeFile(path.join(out, 'method-study.mjs'), await readFile(new URL(import.meta.url)));
await writeFile(
  path.join(out, 'method-plugin.mjs'),
  await readFile(new URL('./abu-flow-policy-plugin.mjs', import.meta.url)),
);
const transformed = {},
  rows = [];
const session = await openBrowser(
  { ...inputs, entries },
  { plugins: [abuFlowPolicyPlugin(transformed)] },
);
const checkpoint = async (complete) =>
  writeFile(
    path.join(out, complete ? 'capture.json' : 'progress.json'),
    JSON.stringify(
      {
        schema: 1,
        status: complete ? 'complete-native-flow-policy-study-not-adopted' : 'in-progress',
        source,
        trials,
        transformed,
        total: entries.length,
        completed: rows.length / 7,
        rows,
        faults: session.faults,
      },
      null,
      2,
    ) + '\n',
  );
try {
  source.browser = session.browser.version();
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
  });
  for (const e of entries) {
    const result = await session.page.evaluate(
      async ({ e, trials }) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const { retroTextLayout } = await import('/games/magic/src/presentation/retro-rules.ts');
        const signal = new AbortController().signal,
          lease = await loadAccuracyImages(canvasAssetUrls(e.face), signal, e.face.illustration),
          rows = [];
        try {
          for (const t of trials) {
            globalThis.__abuFlow = t.policy;
            const c = await composeCardTexture(
              { face: e.face, printingId: e.id, printedImage: null },
              'inspect',
              signal,
              { loadImages: async () => ({ ...lease, dispose() {} }) },
            );
            try {
              rows.push({
                trial: t.id,
                png: c.toDataURL().split(',')[1],
                layout: retroTextLayout(c.getContext('2d'), e.face),
              });
            } finally {
              c.width = c.height = 0;
            }
          }
          return rows;
        } finally {
          globalThis.__abuFlow = null;
          lease.dispose();
        }
      },
      { e, trials },
    );
    const old = prior.rows.find((r) => r.id === e.id);
    const baselineBytes = Buffer.from(result[0].png, 'base64'),
      baseline = PNG.sync.read(baselineBytes);
    assert.equal(hash(baselineBytes), old.original.hashes['after-face']);
    assert.equal(result[1].png, result[0].png, 'Explicit empty policy changed pixels');
    for (const t of result) {
      const b = Buffer.from(t.png, 'base64'),
        im = PNG.sync.read(b);
      let changed = 0,
        alpha = 0,
        outside = 0;
      for (let i = 0; i < im.data.length; i += 4) {
        if (im.data[i + 3] !== baseline.data[i + 3]) alpha++;
        if ([0, 1, 2, 3].some((k) => im.data[i + k] !== baseline.data[i + k])) {
          changed++;
          const x = ((i / 4) % 732) / 1.5,
            y = Math.floor(i / 4 / 732) / 1.5;
          if (x < 45 || x > 455 || y < 395 || y > 610) outside++;
        }
      }
      assert.equal(alpha, 0);
      assert.equal(outside, 0);
      await writeFile(path.join(out, e.id + '-' + t.trial + '.png'), b);
      const scale = t.layout?.horizontalScale ?? 1;
      const unsafe =
        t.layout?.lines.some((l) => {
          const [x, y, w, h] = l.inkBounds;
          return x * scale < 48 || (x + w) * scale > 449 || y < 399 || y + h > 604;
        }) ?? false;
      rows.push({
        id: e.id,
        set: e.set,
        name: e.name,
        characters: chars(e),
        referenceHash: e.reference.sha256,
        poseHash: old.poseHash,
        inputHash: old.inputHash,
        trial: t.trial,
        nativeFaceHash: hash(b),
        changed,
        alpha,
        outside,
        unsafe,
        layout: t.layout,
      });
    }
    if (rows.length % 70 === 0) await checkpoint(false);
    console.log(rows.length / 7 + '/' + entries.length, e.set, e.name);
  }
  assert.deepEqual(session.faults, []);
  assert.equal(await sourceHash('games/magic/src'), source.rendererHash);
  source.closed = true;
  await checkpoint(true);
} finally {
  await session.close();
}
