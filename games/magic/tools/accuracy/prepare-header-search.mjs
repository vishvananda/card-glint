import { readFile, access } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { root, outputRoot, hash, sourceHash, writeJson } from './common.mjs';
import { openBrowser } from './browser.mjs';
import { sagaTextMetric } from './saga-text-metrics.mjs';

const label = process.argv[2] ?? 'prepare-native-v1';
const dir = `${outputRoot}/${label}`;
const bytes = await readFile(`${dir}/audit.json`);
const audit = JSON.parse(bytes);
const entries = audit.results.filter((r) => r.set === 'sos' && r.registration.accepted);
if (!entries.length) throw Error('No accepted Prepared references');
const output = `${outputRoot}/${label}-headers.json`;
try {
  await access(output);
  throw Error('Search exists; choose a new capture');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const refs = new Map(
  await Promise.all(
    entries.map(async (r) => [r.id, PNG.sync.read(await readFile(`${dir}/${r.files.reference}`))]),
  ),
);
const session = await openBrowser({ entries, components: audit.components });
const candidates = [];
for (const part of ['title', 'type', 'spell-title', 'spell-type'])
  for (const size of part === 'title'
    ? [23, 24, 25, 26]
    : part === 'type'
      ? [20, 21, 22]
      : [18, 19, 20, 21])
    for (const dx of [-1, 0, 1])
      for (const dy of [-1, 0, 1]) candidates.push({ part, size, dx, dy });
const results = [];
try {
  await session.page.evaluate(async () => {
    const { loadCanvasFonts } = await import('/games/magic/src/presentation/canvas-assets.ts');
    await loadCanvasFonts();
  });
  for (const candidate of candidates) {
    const rows = await session.page.evaluate(
      async ({ entries, candidate }) => {
        const { paintFittedText } = await import('/games/magic/src/presentation/canvas-text.ts');
        const canvas = document.createElement('canvas');
        canvas.width = 732;
        canvas.height = 1020;
        const c = canvas.getContext('2d');
        const small = document.createElement('canvas');
        small.width = 488;
        small.height = 680;
        const out = [];
        for (const entry of entries) {
          c.setTransform(1.5, 0, 0, 1.5, 0, 0);
          c.fillStyle = '#fff';
          c.fillRect(0, 0, 488, 680);
          const inset = candidate.part.startsWith('spell-'),
            title = candidate.part.endsWith('title');
          const face = inset ? entry.face.faces[1] : entry.face;
          const cost = face.manaSymbols ?? [],
            size = inset ? 19.8 : 23.4,
            gap = inset ? 1.2 : 1.8;
          const costWidth = cost.length * size + Math.max(0, cost.length - 1) * gap;
          const x = inset ? (1042 / 2010) * 488 : 41.7;
          const y = inset ? (title ? 445 : 477) : title ? 51 : 401.5;
          const width = title
            ? (cost.length ? 452 - costWidth - (inset ? 4 : 8) : 452) - x
            : inset
              ? 195.2
              : 374;
          c.fillStyle = inset ? '#000' : '#fff';
          c.fillRect(0, 0, 488, 680);
          c.fillStyle = inset ? '#fff' : '#17140f';
          c.textAlign = 'left';
          c.textBaseline = 'middle';
          paintFittedText(
            c,
            title ? face.name : face.typeLine,
            x + candidate.dx,
            y + candidate.dy,
            width,
            candidate.size,
            true,
          );
          const rect = [
            Math.floor(x - 2),
            Math.floor(y - (inset ? 12 : 16)),
            Math.floor(width + 3),
            inset ? 25 : 33,
          ];
          small.getContext('2d').drawImage(canvas, 0, 0, 488, 680);
          out.push({ id: entry.id, data: small.toDataURL(), rect });
        }
        return out;
      },
      { entries, candidate },
    );
    const scores = rows.map((row) => {
      const render = PNG.sync.read(Buffer.from(row.data.split(',')[1], 'base64'));
      const reference = refs.get(row.id),
        ref = { ...reference, data: new Uint8Array(reference.data) };
      return {
        id: row.id,
        score: sagaTextMetric(ref, render, row.rect, candidate.part.startsWith('spell-')).edgeF1[1],
      };
    });
    const means = { score: scores.reduce((sum, r) => sum + r.score, 0) / scores.length };
    results.push({ candidate, means, scores });
    console.log(candidate, means);
  }
  if (session.faults.length) throw Error(session.faults.join('\n'));
  await writeJson(output, {
    schemaVersion: 1,
    inputAuditHash: hash(bytes),
    rendererHash: await sourceHash(`${root}/games/magic/src`),
    normalizationRendererHash: audit.rendererHash,
    exploratory: true,
    notes:
      'SOS pilot subset. Header-only trials exclude mana/set icons; final full-render capture must validate selected settings.',
    results,
  });
} finally {
  await session.close();
}
