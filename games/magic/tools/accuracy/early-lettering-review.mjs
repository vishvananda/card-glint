import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { normalize, savePng } from './pixels.mjs';
import { readJson, outputRoot, atomicWrite, hash, writeJson } from './common.mjs';

const run = process.argv[2] ?? 'development-style';
const selected = process.argv[3];
const base = path.join(outputRoot, 'early-lettering', run);
const trial = await readJson(path.join(base, 'trial.json'));
const candidate = selected ?? trial.candidates.at(-1).id;
const articles = [],
  sheets = [],
  records = [];
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
for (const [index, row] of trial.results.entries()) {
  const before = row.scores.find((s) => s.candidate === 'control' && s.tier === 'inspect');
  const after = row.scores.find((s) => s.candidate === candidate && s.tier === 'inspect');
  const images = [];
  for (const [file, checksum] of [
    [path.join(outputRoot, row.referenceFile), row.referenceHash],
    [path.join(base, before.file), before.sha256],
    [path.join(base, after.file), after.sha256],
  ]) {
    const bytes = await readFile(file);
    if (hash(bytes) !== checksum) throw Error('Review image bytes changed');
    images.push(normalize(PNG.sync.read(bytes)));
  }
  const crop = { width: 1464, height: 125, data: new Uint8Array(1464 * 125 * 4) };
  crop.data.fill(238);
  for (const [j, image] of images.entries())
    for (const [top, height, target] of [
      [20, 50, 0],
      [602, 57, 58],
    ])
      for (let y = 0; y < height; y++)
        crop.data.set(
          image.data.subarray((top + y) * 488 * 4, (top + y + 1) * 488 * 4),
          ((target + y) * 1464 + j * 488) * 4,
        );
  const filename = `${row.set}-${row.number}.${candidate}.review.png`;
  await savePng(path.join(base, filename), crop);
  const page = Math.floor(index / 4),
    offset = index % 4;
  if (!sheets[page]) {
    sheets[page] = {
      width: 1464,
      height: 125 * Math.min(4, trial.results.length - page * 4),
      data: new Uint8Array(1464 * 125 * Math.min(4, trial.results.length - page * 4) * 4),
    };
  }
  sheets[page].data.set(crop.data, offset * crop.data.length);
  records.push({
    set: row.set,
    name: row.name,
    number: row.number,
    file: filename,
    sha256: hash(await readFile(path.join(base, filename))),
  });
  const scores = after.regions
    .map(
      (r) =>
        `${r.id} F1 ${before.regions.find((b) => b.id === r.id).edgeF1.toFixed(3)} → ${r.edgeF1.toFixed(3)}`,
    )
    .join(' · ');
  articles.push(
    `<article id="${row.set}-${row.number}"><h2>${escape(row.set.toUpperCase() + ' ' + row.name)}</h2><p>${escape(scores)}</p><div class="labels"><span>Scan</span><span>Previous branch</span><span>${escape(candidate)}</span></div><img src="${filename}" alt="Title and credit comparison for ${escape(row.name)}"><details><summary>Full cards</summary><div class="cards"><img src="../../${row.referenceFile}" alt="Scan"><img src="${before.file}" alt="Previous branch"><img src="${after.file}" alt="Candidate"></div></details></article>`,
  );
}
for (const [i, sheet] of sheets.entries())
  await savePng(path.join(base, `${candidate}.review-${i + 1}.png`), sheet);
await writeJson(path.join(base, `${candidate}.review.json`), {
  trialHash: hash(await readFile(path.join(base, 'trial.json'))),
  candidate,
  records,
});
await atomicWrite(
  path.join(base, 'index.html'),
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Early-frame lettering ${escape(run)}</title><style>body{background:#1c2024;color:#e4e8ea;font:16px/1.5 system-ui;max-width:1464px;margin:30px auto;padding:0 20px}article{border-top:1px solid #52606a;padding:16px 0}img{width:100%}.labels,.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.cards img{min-width:0}summary{cursor:pointer}</style><h1>Alpha and Unlimited lettering: ${escape(run)}</h1><p>Experimental candidate; acceptance is recorded separately. Shared identity alignment, identical printing inputs and existing frame assets. Titles and credits only. F1 is boundary overlap, not percentage accuracy. Alpha whole-frame registration remains uncertain.</p>${articles.join('')}<p>Local fan study. Magic imagery © Wizards of the Coast; cached scans through Scryfall.</p></html>`,
);
console.log(`Created ${trial.results.length} review crops for ${candidate}`);
