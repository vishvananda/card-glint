import { readFile, access, mkdir, symlink } from 'node:fs/promises';
import { relative } from 'node:path';
import { execFileSync } from 'node:child_process';
import { PNG } from 'pngjs';
import { outputRoot, hash, atomicWrite, writeJson, sourceHash } from './common.mjs';
import { readObject } from './cache.mjs';
import { openBrowser } from './browser.mjs';
import { specialFrameInput, specialFrameSides } from './special-frame-input.mjs';

const parentLabel = 'adventure-v0217-input-v2';
const label = process.argv[2];
const sourceRoot = process.env.MAGIC_CAPTURE_ROOT;
if (!label || !sourceRoot) throw Error('Supply a new label and MAGIC_CAPTURE_ROOT at v0.2.17.');
const sourceCommit = execFileSync('git', ['-C', sourceRoot, 'rev-parse', 'HEAD'], {
  encoding: 'utf8',
}).trim();
if (sourceCommit !== '621a8fcf22e4344dfbcc7e99a7ba3a0bfa3be9cb')
  throw Error('Expected exact v0.2.17 source');
const output = `${outputRoot}/${label}`;
try {
  await access(output);
  throw Error('Output exists; choose a new input revision.');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const bytes = await readFile(`${outputRoot}/${parentLabel}/audit.json`),
  audit = JSON.parse(bytes);
const entries = [],
  changes = [];
for (const source of audit.sources) {
  const cards = (
    await Promise.all(source.pages.map(async (p) => JSON.parse(await readObject(p)).data))
  ).flat();
  const data = JSON.parse(await readObject(source.wording)).data;
  for (const entry of audit.results.filter((r) => r.set === source.set)) {
    const card = cards.find((c) => `${c.id}-whole` === entry.id);
    if (!card) throw Error('Printing absent from frozen provider snapshot');
    const input = specialFrameInput(
      card,
      specialFrameSides(card)[0],
      entry.reference,
      entry.art,
      data.cards,
    );
    const number = card.collector_number.padStart(3, '0');
    input.face.collectorNumber =
      Number(card.collector_number) <= data.baseSetSize ? `${number}/${data.baseSetSize}` : number;
    input.face.legalText = entry.face.legalText;
    const fields = [...new Set([...Object.keys(entry.face), ...Object.keys(input.face)])].filter(
      (key) => JSON.stringify(entry.face[key]) !== JSON.stringify(input.face[key]),
    );
    if (fields.length)
      changes.push({
        id: entry.id,
        name: entry.name,
        fields,
        priorInputHash: hash(JSON.stringify(entry.face)),
        nextInputHash: hash(JSON.stringify(input.face)),
      });
    entries.push({ ...entry, ...input });
  }
}
console.log(
  'Changed inputs',
  changes.map((r) => [r.name, r.fields]),
);
await mkdir(output, { recursive: true });
const session = await openBrowser({ entries, components: audit.components }, { sourceRoot });
try {
  for (const entry of entries) {
    await symlink(
      relative(output, `${outputRoot}/${parentLabel}/${entry.files.reference}`),
      `${output}/${entry.files.reference}`,
    );
    if (!changes.some((c) => c.id === entry.id)) {
      await symlink(
        relative(output, `${outputRoot}/${parentLabel}/${entry.files.render}`),
        `${output}/${entry.files.render}`,
      );
      continue;
    }
    const data = await session.page.evaluate(async (face) => {
      const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
      const result = await composeCardTexture(
        { face, printingId: null, printedImage: null },
        'inspect',
        new AbortController().signal,
      );
      const c = document.createElement('canvas');
      c.width = 488;
      c.height = 680;
      c.getContext('2d').drawImage(result, 0, 0, 488, 680);
      const encoded = c.toDataURL();
      result.width = result.height = c.width = c.height = 0;
      return encoded;
    }, entry.face);
    const png = Buffer.from(data.split(',')[1], 'base64');
    PNG.sync.read(png);
    entry.renderHash = hash(png);
    delete entry.rows; // These diagnostics depended on the old wording.
    await atomicWrite(`${output}/${entry.files.render}`, png);
    console.log('Captured corrected baseline', entry.name);
  }
  if (session.faults.length) throw Error(session.faults.join('\n'));
  await writeJson(`${output}/audit.json`, {
    ...audit,
    createdAt: new Date().toISOString(),
    sourceCommit,
    rendererHash: await sourceHash(`${sourceRoot}/games/magic/src`),
    parentLabel,
    parentAuditHash: hash(bytes),
    inputChanges: changes,
    correctionScope:
      'Exact scan-reviewed CLB original text/type repairs, ELD historic type repair, and collector totals. Unchanged captures are linked, not rerendered. Both renderer versions must use these corrected inputs.',
    results: entries,
  });
} finally {
  await session.close();
}
