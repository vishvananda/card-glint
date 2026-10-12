import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { normalize } from './pixels.mjs';
import { readJson, atomicWrite, fixtureRoot, outputRoot, hash } from './common.mjs';

const phase = process.argv[2] ?? 'development-neutral';
assert.ok(['development-neutral', 'validation'].includes(phase));
const base = path.join(outputRoot, '3ed');
const out = path.join(base, `letter-fill-${phase}`);
const trial = await readJson(path.join(out, 'trial.json'));
const plan = await readJson(path.join(fixtureRoot, '3ed/letter-fill-plan.json'));
const capture = await readJson(path.join(base, plan.sourceRun, 'capture.json'));
assert.equal(trial.captureHash, plan.captureHash);
const frozenCandidate = await readJson(path.join(fixtureRoot, '3ed/letter-fill-candidate.json'));
const transfer = await readJson(path.join(fixtureRoot, '3ed/letter-fill-transfer.json'));
assert.equal(
  hash(await readFile(path.join(fixtureRoot, '3ed/letter-fill-candidate.json'))),
  transfer.candidateHash,
);
const candidate = trial.candidates.find((c) => c.id === frozenCandidate.candidate.id);
assert.deepEqual(candidate, frozenCandidate.candidate);
if (phase === 'validation') {
  assert.equal(hash(await readFile(path.join(out, 'trial.json'))), transfer.trialHash);
  const frozen = await readJson(path.join(fixtureRoot, '3ed/letter-fill-candidate.json'));
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
        `${r.id}: ${control.regions.find((b) => b.id === r.id).edgeF1.toFixed(3)} → ${r.edgeF1.toFixed(3)} (contrast ${r.contrastCorrelation.toFixed(3)})`,
    )
    .join(' · ');
  const issue = transfer.sourceIssues.find((issue) => issue.name === result.name);
  if (issue) assert.equal(issue.referenceHash, result.referenceHash);
  articles.push(
    `<article id="card-${result.number}"><h2>${escape(result.name)}</h2><p>${escape(scores)}</p>${result.statsWarning ? `<p class="warning">${escape(result.statsWarning)}</p>` : ''}${issue ? `<p class="warning">Source mismatch: printed ${escape(issue.field)} “${escape(issue.printed)}”; input “${escape(issue.input)}”. ${escape(issue.note)}</p>` : ''}<div class="labels"><span>Scan</span><span>Current renderer</span><span>Rejected candidate</span></div><img src="${cropFile}" alt="${escape(result.name)} title and footer comparison"><details><summary>Full cards</summary><div class="cards"><img src="../${plan.sourceRun}/${card.images.reference.file}" alt="Scan"><img src="${control.file}" alt="Current renderer"><img src="${changed.file}" alt="Rejected candidate"></div></details></article>`,
  );
}
for (const [index, sheet] of sheets.entries())
  await atomicWrite(path.join(out, `review-${index + 1}.png`), PNG.sync.write(sheet));
await atomicWrite(
  path.join(out, 'index.html'),
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Revised letter interiors: ${phase}</title><style>body{background:#1c2024;color:#e4e8ea;font:16px/1.5 system-ui;margin:30px auto;max-width:1464px;padding:0 20px}a{color:#b4d6dd}article{border-top:1px solid #52606a;padding:16px 0}img{width:100%}.labels,.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.labels{margin-bottom:8px}.cards img{min-width:0}.warning{color:#ffce93}summary{cursor:pointer}</style><h1>Revised letter interiors: ${phase}</h1><p class="warning"><strong>Candidate rejected; production renderer unchanged.</strong> ${escape(transfer.decision)}</p><p>Same inputs, existing frame assets and fixed family alignment. Only the glyph interiors on titles, credits and power/toughness change. Font files, sizes, coordinates, edge masks and all body layout stay fixed. Type and mana are outside this trial.</p><p>Scores combine separate light/dark edge overlap with local-contrast correlation. The latter retains interior strokes and cancels positive affine luminance changes; neither measurement certifies glyph shape. The frozen candidate uses one neutral gray interior for every frame color.</p><p>${phase === 'validation' ? 'These title/credit crops were reserved for this study and opened after the candidate was committed. Earlier body studies used this set; this is not an untouched corpus or cross-set transfer proof.' : 'Development examples used to choose the candidate. These are not held-out validation.'}</p><p><a href="../../main-review/index.html">Full comparisons versus main</a> · <a href="../revised-large/report.html">Current baseline: all 306 card scores</a></p><p>Exact font contours, letter widths and scan grain still differ. Filling the interior is not a claim that Revised lettering is finished.</p>${articles.join('')}<p>Local fan study. Magic imagery © Wizards of the Coast; cached scans through Scryfall.</p></html>`,
);
console.log(`Wrote ${trial.results.length} comparisons and ${sheets.length} review sheets: ${out}`);
