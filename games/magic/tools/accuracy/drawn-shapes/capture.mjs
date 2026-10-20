import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { cacheRoot } from '../common.mjs';
import { cachedFetch, readObject } from '../cache.mjs';
import { printingTextIndex } from '../printing-text.mjs';
import { presentation } from '../adapter.mjs';
import { fetchComponents } from '../components.mjs';
import { openBrowser } from '../browser.mjs';
const output = process.argv[2];
if (!output) throw Error('Pass external output directory');
const sets = process.argv.slice(3);
if (!sets.length) sets.push('m15', 'm21', 'war');
const records = [];
for (const set of sets) {
  assert.match(set, /^[a-z0-9]{2,8}$/);
  const snapshot = JSON.parse(await readFile(cacheRoot + '/sets/' + set + '-window-era.json'));
  const asset = await cachedFetch('https://mtgjson.com/api/v5/' + set.toUpperCase() + '.json');
  const originalData = JSON.parse(await readObject(asset)).data;
  const originals = printingTextIndex(snapshot, originalData);
  for (const bucket of ['W', 'U', 'artifact']) {
    for (const entry of snapshot.entries.filter((e) => e.bucket === bucket).slice(0, 2)) {
      assert.equal(entry.card.layout, 'normal');
      assert(!/Legendary|Planeswalker|Saga/.test(entry.card.type_line));
      const face = presentation(entry, {}, originals).face;
      const original = originals.cards[entry.id];
      assert(original, 'Original wording absent: ' + entry.card.name);
      face.typeLine = original.originalType;
      records.push({ ...entry, face, originalSource: asset });
    }
  }
}
const components = await fetchComponents(records, {}, (e) => e.face);
await mkdir(output, { recursive: true });
await writeFile(
  output + '/inputs.json',
  JSON.stringify({ entries: records, components }, null, 2) + '\n',
);
const session = await openBrowser({ entries: records, components });
const receipt = {
  schema: 1,
  sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  records: [],
};
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
  });
  for (const e of records) {
    const reference = await readObject(e.reference);
    await writeFile(output + '/' + e.id + '-raw.png', reference);
    const url = await session.page.evaluate(async (face) => {
      const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
      const im = await composeCardTexture(
        { face, printingId: null, printedImage: null },
        'inspect',
        new AbortController().signal,
      );
      const c = document.createElement('canvas');
      c.width = im.width;
      c.height = im.height;
      c.getContext('2d').drawImage(im, 0, 0);
      im.close?.();
      return c.toDataURL();
    }, e.face);
    const bytes = Buffer.from(url.split(',')[1], 'base64');
    await writeFile(output + '/' + e.id + '-released.png', bytes);
    receipt.records.push({
      id: e.id,
      name: e.card.name,
      set: e.card.set,
      bucket: e.bucket,
      referenceSha256: e.reference.sha256,
      renderSha256: createHash('sha256').update(bytes).digest('hex'),
    });
    console.log(e.card.set + ' ' + e.card.name);
  }
  assert.deepEqual(session.faults, []);
  await writeFile(output + '/receipt.json', JSON.stringify(receipt, null, 2) + '\n');
} finally {
  await session.close();
}
