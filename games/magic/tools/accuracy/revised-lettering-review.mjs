import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { normalize } from './pixels.mjs';
import { readJson, atomicWrite, fixtureRoot, outputRoot, hash } from './common.mjs';

const phase = process.argv[2] ?? 'development-final';
assert.ok(['development-final', 'validation'].includes(phase));
const base = path.join(outputRoot, '3ed');
const out = path.join(base, `lettering-${phase}`);
const trial = await readJson(path.join(out, 'trial.json'));
const plan = await readJson(path.join(fixtureRoot, '3ed/lettering-plan.json'));
const capture = await readJson(path.join(base, plan.sourceRun, 'capture.json'));
assert.equal(trial.captureHash, plan.captureHash);
assert.equal(trial.candidates.length, 2);
const candidate = trial.candidates[1];
if (phase === 'validation') {
  const frozen = await readJson(path.join(fixtureRoot, '3ed/lettering-candidate.json'));
  assert.equal(trial.experimentHash, frozen.experimentHash);
  assert.equal(trial.metricHash, frozen.metricHash);
  assert.deepEqual(candidate, frozen.candidate);
}
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
const articles = [];
const sheets = [];
for (const [index, result] of trial.results.entries()) {
  const card = capture.results.find((r) => r.id === result.id);
  const control = result.scores.find((s) => s.tier === 'inspect' && s.candidate === 'control');
  const changed = result.scores.find((s) => s.tier === 'inspect' && s.candidate === candidate.id);
  const row = new PNG({ width: 488 * 3, height: 150 });
  row.data.fill(240);
  for (const [column, [file, checksum]] of [
    [path.join(base, plan.sourceRun, card.images.reference.file), result.referenceHash],
    [path.join(out, control.file), control.sha256],
    [path.join(out, changed.file), changed.sha256],
  ].entries()) {
    const bytes = await readFile(file);
    assert.equal(hash(bytes), checksum);
    const image = normalize(PNG.sync.read(bytes));
    for (const [top, height, offset] of [
      [15, 65, 0],
      [605, 66, 72],
    ])
      for (let y = 0; y < height; y++)
        row.data.set(
          image.data.subarray((top + y) * 488 * 4, (top + y + 1) * 488 * 4),
          ((offset + y) * row.width + column * 488) * 4,
        );
  }
  const cropFile = `${result.number}.review.png`;
  await atomicWrite(path.join(out, cropFile), PNG.sync.write(row));
  const page = Math.floor(index / 6),
    offset = index % 6;
  if (!sheets[page]) {
    sheets[page] = new PNG({
      width: row.width,
      height: 150 * Math.min(6, trial.results.length - page * 6),
    });
    sheets[page].data.fill(240);
  }
  sheets[page].data.set(row.data, offset * row.data.length);
  const scores = changed.regions
    .map(
      (r) =>
        `${r.id}: ${control.regions.find((b) => b.id === r.id).edgeF1.toFixed(3)} → ${r.edgeF1.toFixed(3)}`,
    )
    .join(' · ');
  articles.push(
    `<article id="card-${result.number}"><h2>${escape(result.name)}</h2><p>${escape(scores)}</p>${result.statsWarning ? `<p class="warning">${escape(result.statsWarning)}</p>` : ''}<div class="labels"><span>Scan</span><span>Previous branch</span><span>Frozen candidate</span></div><img src="${cropFile}" alt="${escape(result.name)} title and footer comparison"><details><summary>Full cards</summary><div class="cards"><img src="../${plan.sourceRun}/${card.images.reference.file}" alt="Scan"><img src="${control.file}" alt="Previous branch"><img src="${changed.file}" alt="Frozen candidate"></div></details></article>`,
  );
}
for (const [index, sheet] of sheets.entries())
  await atomicWrite(path.join(out, `review-${index + 1}.png`), PNG.sync.write(sheet));
await atomicWrite(
  path.join(out, 'index.html'),
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Revised lettering: ${phase}</title><style>body{background:#1c2024;color:#e4e8ea;font:16px/1.5 system-ui;margin:30px auto;max-width:1464px;padding:0 20px}a{color:#b4d6dd}article{border-top:1px solid #52606a;padding:16px 0}img{width:100%}.labels,.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.labels{margin-bottom:8px}.cards img{min-width:0}.warning{color:#ffce93}summary{cursor:pointer}</style><h1>Revised lettering: ${phase}</h1><p>Same inputs, existing frame assets and fixed family alignment. Only titles, credits and power/toughness change. Type-line wording and the mana row are outside this trial.</p><p>Scores average separate dark and light boundary overlap; they are not percent accuracy. Direct shape review remains required: a solid dark title can score higher while filling the printed letter interior incorrectly.</p><p>${phase === 'validation' ? 'These title/credit crops were reserved before fitting and first opened after the candidate was committed. Earlier body studies used this set; this is not an untouched corpus or cross-set transfer proof.' : 'Development examples used to choose the candidate. These are not held-out validation.'}</p><p><a href="../../main-review/index.html">Full comparisons versus main</a> · <a href="../revised-lettering/report.html">All 306 card scores</a> · <a href="../revised-lettering/audit-review.png">Eight post-audit review cases</a></p><p>The audit sheet uses scan / previous branch / current branch columns. Animate Dead’s title regresses in paired edge overlap; weak dark-frame strokes and thin numerals remain flagged. The other audit cases expose disagreement between edge and Census scores.</p>${articles.join('')}<p>Local fan study. Magic imagery © Wizards of the Coast; cached scans through Scryfall.</p></html>`,
);
console.log(`Wrote ${trial.results.length} comparisons and ${sheets.length} review sheets: ${out}`);
