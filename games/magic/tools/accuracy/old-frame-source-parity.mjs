// Exact native controls for source-family support; this is not a calibration fit.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { openBrowser } from './browser.mjs';
import { fetchComponents } from './components.mjs';
import { hash, root, sourceHash, writeJson } from './common.mjs';
const [inputFile, exportedFile, deltaFile, out] = process.argv.slice(2);
assert(out, 'Use INPUTS EXPORTED_INPUTS SOURCE_DELTA_JSON NEW_OUTPUT');
const input = JSON.parse(await fs.readFile(inputFile)),
  exported = JSON.parse(await fs.readFile(exportedFile));
const db = await fs.readFile(deltaFile),
  delta = JSON.parse(db);
const probes = [];
for (const key of new Set(exported.rows.map((r) => r.key))) {
  const r = exported.rows.find((r) => r.accepted && r.key === key);
  const e = input.entries.find((e) => e.id === r.id);
  for (const set of [input.set, '2ed', 'fem', '4ed', 'chr'])
    probes.push({
      ...e,
      id: set + '-' + key,
      sourceId: e.id,
      face: {
        ...e.face,
        setCode: set,
        borderColor: ['2ed', '4ed', 'chr'].includes(set) ? 'white' : 'black',
      },
    });
}
const components = await fetchComponents(probes, { offline: true }, (e) => e.face);
const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
const values = {};
for (const mode of ['before', 'after']) {
  const session = await openBrowser(
    { ...input, entries: probes, components },
    {
      plugins:
        mode === 'before'
          ? [
              {
                name: 'exact-parent-source-controls',
                enforce: 'pre',
                transform(code, id) {
                  const file = Object.keys(delta.files).find((f) => id.endsWith('/' + f));
                  const entry = delta.files[file];
                  if (!entry || entry.beforeSource === null || file.endsWith('.json')) return;
                  assert.equal(hash(code), entry.after);
                  return entry.beforeSource;
                },
              },
            ]
          : [],
    },
  );
  try {
    await session.page.evaluate(async () => {
      await import('/games/magic/src/data/eager.ts');
      await import('/games/magic/src/data/eager-wording.ts');
    });
    values[mode] = [];
    for (const e of probes) {
      const png = await session.page.evaluate(async (e) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const image = await composeCardTexture(
          { face: e.face, printingId: e.sourceId, printedImage: null },
          'inspect',
          new AbortController().signal,
        );
        try {
          return image.toDataURL().split(',')[1];
        } finally {
          image.width = image.height = 0;
        }
      }, e);
      values[mode].push({
        id: e.id,
        inputHash: hash(JSON.stringify(e.face)),
        sha256: hash(Buffer.from(png, 'base64')),
      });
    }
    assert.deepEqual(session.faults, []);
  } finally {
    await session.close();
  }
}
assert.equal(rendererHash, await sourceHash(path.join(root, 'games/magic/src')));
assert.deepEqual(values.after, values.before, 'Existing frame-family native controls changed');
await writeJson(out, {
  schema: 1,
  status: 'unchanged-native-frame-family-controls',
  source: {
    rendererHash,
    deltaHash: hash(db),
    toolHash: hash(await fs.readFile(new URL(import.meta.url))),
  },
  scope:
    'Exact parent source bytes versus new source-family support. Frozen Original inputs provide one face per material/basic, replayed for Mirage and active Unlimited/Fallen Empires/Fourth/Chronicles profiles. These synthetic profile probes certify no calibration values; they establish byte-identical native faces for existing family branches.',
  count: probes.length,
  changed: 0,
  rows: values.after,
});
console.log(probes.length, 'existing family controls are byte-identical');
