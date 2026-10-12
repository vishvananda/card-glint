import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { readJson, atomicWrite, fixtureRoot, outputRoot, hash } from './common.mjs';
import { normalize } from './pixels.mjs';
const phase = process.argv[2] ?? 'development';
assert.ok(['development', 'validation'].includes(phase));
const root = path.join(outputRoot, '3ed'),
  out = path.join(root, `mana-${phase}`);
const trial = await readJson(path.join(out, 'trial.json'));
const plan = await readJson(path.join(fixtureRoot, '3ed/mana-plan.json'));
const capture = await readJson(path.join(root, plan.sourceRun, 'capture.json'));
assert.equal(trial.captureHash, plan.captureHash);
const candidate =
  process.argv[3] ??
  (await readJson(path.join(fixtureRoot, '3ed/mana-candidate.json'))).candidate.id;
assert.ok(trial.candidates.some((c) => c.id === candidate));
const escape = (t) =>
  String(t).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
const articles = [],
  sheets = [];
for (const [index, r] of trial.results.entries()) {
  const card = capture.results.find((c) => c.id === r.id),
    control = r.scores.find((s) => s.tier === 'inspect' && s.candidate === 'control'),
    changed = r.scores.find((s) => s.tier === 'inspect' && s.candidate === candidate);
  const row = new PNG({ width: 1032, height: 100 });
  for (const [col, [file, checksum]] of [
    [path.join(root, plan.sourceRun, card.images.reference.file), r.referenceHash],
    [path.join(out, control.file), control.sha256],
    [path.join(out, changed.file), changed.sha256],
  ].entries()) {
    const bytes = await readFile(file);
    assert.equal(hash(bytes), checksum);
    const im = normalize(PNG.sync.read(bytes));
    for (let y = 0; y < 50; y++)
      for (let x = 0; x < 172; x++)
        for (let dy = 0; dy < 2; dy++)
          for (let dx = 0; dx < 2; dx++)
            row.data.set(
              im.data.subarray(((y + 17) * 488 + x + 292) * 4, ((y + 17) * 488 + x + 292) * 4 + 4),
              ((y * 2 + dy) * 1032 + col * 344 + x * 2 + dx) * 4,
            );
  }
  const file = `${r.number}.review.png`;
  await atomicWrite(path.join(out, file), PNG.sync.write(row));
  const page = Math.floor(index / 6),
    offset = index % 6;
  if (!sheets[page])
    sheets[page] = new PNG({
      width: 1032,
      height: 100 * Math.min(6, trial.results.length - page * 6),
    });
  sheets[page].data.set(row.data, offset * row.data.length);
  const a = control.regions[0],
    b = changed.regions[0];
  articles.push(
    `<article id="card-${r.number}"><h2>${escape(r.name)}</h2><p>Mana row edge F1 ${a.edgeF1.toFixed(3)} → ${b.edgeF1.toFixed(3)} · local contrast ${a.contrastCorrelation.toFixed(3)} → ${b.contrastCorrelation.toFixed(3)}</p><div class="labels"><span>Scan</span><span>Previous renderer</span><span>Frozen candidate</span></div><img src="${file}" alt="${escape(r.name)} mana comparison"><details><summary>Full cards</summary><div class="cards"><img src="../${plan.sourceRun}/${card.images.reference.file}" alt="Scan"><img src="${control.file}" alt="Previous renderer"><img src="${changed.file}" alt="Candidate"></div></details></article>`,
  );
}
for (const [i, sheet] of sheets.entries())
  await atomicWrite(path.join(out, `review-${i + 1}.png`), PNG.sync.write(sheet));
await atomicWrite(
  path.join(out, 'index.html'),
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Revised mana: ${phase}</title><style>body{background:#1c2024;color:#e4e8ea;font:16px/1.5 system-ui;margin:30px auto;max-width:1100px;padding:0 20px}a{color:#b4d6dd}article{border-top:1px solid #52606a;padding:16px 0}img{width:100%}.labels,.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.labels{margin-bottom:8px}.cards img{min-width:0}summary{cursor:pointer}</style><h1>Revised mana: ${phase}</h1><p>Same source inputs, frame assets and fixed family registration. The candidate uses the existing historic font's original white sun, removes header shadows, and applies one shared row position and pitch. Numeric discs and other symbol assets remain. Titles and inline rules symbols are unchanged.</p><p>Candidate ${escape(candidate)}. ${phase === 'validation' ? 'Frozen before opening these 13 mana crops; cards were seen in earlier body/lettering studies.' : 'Development examples used to choose the policy; not held-out evidence.'} Scores remain diagnostics of alignment and shape, not percentages of accuracy.</p><p><a href="../../main-review/index.html">Full comparisons versus main</a></p>${articles.join('')}<p>Local fan study. Magic imagery © Wizards of the Coast; cached scans through Scryfall.</p></html>`,
);
console.log(`Wrote ${trial.results.length} mana comparisons: ${out}`);
