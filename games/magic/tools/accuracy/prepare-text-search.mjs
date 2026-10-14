import { readFile, access } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { root, outputRoot, hash, sourceHash, writeJson } from './common.mjs';
import { openBrowser } from './browser.mjs';
import { sagaTextMetric } from './saga-text-metrics.mjs';

const label = process.argv[2] ?? 'prepare-native-v1';
const phase = process.argv[3] ?? 'size';
if (!['size', 'position', 'coverage'].includes(phase)) throw Error('Unknown search phase');
const dir = `${outputRoot}/${label}`;
const bytes = await readFile(`${dir}/audit.json`);
const audit = JSON.parse(bytes);
const entries = audit.results.filter((r) => r.set === 'sos' && r.registration.accepted);
if (!entries.length) throw Error('No accepted Prepared references');
const output = `${outputRoot}/${label}-text-${phase}.json`;
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
if (phase === 'coverage') {
  // Coverage audit after the pilot: retain every card and do not call this held out.
  for (const size of [21, 21.75, 22.25, 23, 23.5, 24])
    candidates.push({ size, leading: 1, dx: 0, dy: 0, width: 0, page: 'permanent' });
} else if (phase === 'size') {
  for (let size = 19; size <= 24; size += 0.25)
    for (const leading of [0.95, 1]) candidates.push({ size, leading, dx: 0, dy: 0, width: 0 });
} else {
  // Shared size sweep on the pilot subset; remaining SOS cards are held out.
  const sizes = JSON.parse(await readFile(`${outputRoot}/${label}-text-size.json`));
  for (const page of ['permanent', 'spell']) {
    const best = [...sizes.results].sort((a, b) => b.means[page] - a.means[page])[0];
    for (const dx of [-2, 0, 2, 4])
      for (const dy of [-4, 0, 4])
        for (const width of [-4, 0, 4]) candidates.push({ ...best.candidate, dx, dy, width, page });
  }
}
const results = [];
try {
  await session.page.evaluate(async () => {
    const { loadCanvasFonts } = await import('/games/magic/src/presentation/canvas-assets.ts');
    await loadCanvasFonts();
  });
  for (const candidate of candidates) {
    const rows = await session.page.evaluate(
      async ({ entries, candidate }) => {
        const { layoutRules } = await import('/games/magic/src/presentation/rules-layout.ts');
        const { paintRulesLayout } = await import('/games/magic/src/presentation/rules-paint.ts');
        const { wordingParagraphs } = await import('/games/magic/src/presentation/wording.ts');
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
          const layouts = {};
          for (const page of ['permanent', 'spell']) {
            if (candidate.page && candidate.page !== page) continue;
            const face = page === 'spell' ? entry.face.faces[1] : entry.face;
            const [x, y, width, height] =
              page === 'spell'
                ? [(1035 / 2010) * 488, (2059 / 2814) * 680, 0.3947 * 488, (438 / 2814) * 680]
                : [0.086 * 488, 0.6303 * 680, (808 / 2010) * 488, 0.2875 * 680];
            const layout = layoutRules(
              c,
              wordingParagraphs(face),
              {
                x: x + candidate.dx,
                y: y + candidate.dy,
                width: width + candidate.width,
                height,
                exclusions: [],
              },
              candidate.size,
              9,
              {
                leading: candidate.leading,
                paragraphGap: 0.4,
                flavorGap: 0.75,
                flavorSeparator: true,
              },
            );
            paintRulesLayout(c, layout, new Map());
            layouts[page] = {
              size: layout.size,
              overflow: layout.overflow,
              lines: layout.lines.map((l) => l.runs.map((r) => r.text ?? r.symbol ?? '').join('')),
            };
          }
          small.getContext('2d').drawImage(canvas, 0, 0, 488, 680);
          out.push({ id: entry.id, data: small.toDataURL(), layouts });
        }
        return out;
      },
      { entries, candidate },
    );
    const scores = rows.map((row) => {
      const render = PNG.sync.read(Buffer.from(row.data.split(',')[1], 'base64'));
      const reference = refs.get(row.id),
        ref = { ...reference, data: new Uint8Array(reference.data) };
      const face = entries.find((e) => e.id === row.id).face;
      if (face.power != null && face.toughness != null)
        for (const image of [ref, render])
          for (let y = 599; y < 653; y++)
            for (let x = 366; x < 464; x++) image.data.set([255, 255, 255, 255], (y * 488 + x) * 4);
      return {
        id: row.id,
        layouts: row.layouts,
        ...Object.fromEntries(
          Object.keys(row.layouts).map((page) => [
            page,
            sagaTextMetric(
              ref,
              render,
              page === 'permanent' ? [39, 428, 203, 199] : [250, 497, 204, 108],
            ).edgeF1[1],
          ]),
        ),
      };
    });
    const means = Object.fromEntries(
      Object.keys(scores[0].layouts).map((page) => [
        page,
        scores.reduce((sum, row) => sum + row[page], 0) / scores.length,
      ]),
    );
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
      'Exploratory typography search over the accepted cards in the named capture. Text-only trials omit inline symbol rasters; final full-render capture must validate selected settings.',
    results,
  });
} finally {
  await session.close();
}
