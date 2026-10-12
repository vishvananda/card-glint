import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { options, studyFile, outputRoot, readJson, atomicWrite, hash } from './common.mjs';

const opts = options();
const plan = await readJson(studyFile(opts, 'transfer-plan'));
if (plan.study !== 'retro-type') throw Error('This example page requires --study retro-type');
const out = path.join(outputRoot, opts.set, opts.run);
const escape = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
const number = (value) => (Number.isFinite(value) ? value.toFixed(3) : 'unmeasured');
const percent = (value) => (Number.isFinite(value) ? (value * 100).toFixed(0) + '%' : 'unmeasured');
const all = [];
for (const set of new Set([plan.sourceSet, opts.set])) {
  const runs = [
    set === plan.sourceSet ? plan.sourceBaselineRun : opts.baseline,
    set === plan.sourceSet ? plan.sourceRun : opts.run,
  ];
  const reports = await Promise.all(
    runs.map(async (run) => {
      const dir = path.join(outputRoot, set, run);
      const metrics = await readJson(path.join(dir, 'metrics.json'));
      const typography = await readJson(path.join(dir, 'typography.json'));
      for (const key of ['referenceIdentity', 'alignmentHash', 'rendererHash', 'browser'])
        if (metrics[key] !== typography[key]) throw Error(`Stale ${set}/${run} typography: ${key}`);
      return { dir, metrics, typography };
    }),
  );
  for (const key of [
    'referenceIdentity',
    'alignmentHash',
    'browser',
    'metricSource',
    'fontStylesheetHash',
  ])
    if (reports[0].metrics[key] !== reports[1].metrics[key])
      throw Error(`Cannot pair ${set}: ${key}`);
  const [before, after] = reports;
  for (const card of after.metrics.results) {
    const old = before.metrics.results.find((c) => c.id === card.id);
    if (
      !old ||
      old.issue ||
      card.issue ||
      old.inputHash !== card.inputHash ||
      card.contentStatus !== 'scan-reviewed'
    )
      continue;
    const body = (c) => c.comparisons.inspect.regions.find((r) => r.id === 'body')?.edgeF1?.[1];
    const previousType = before.typography.results.find((c) => c.id === card.id),
      currentType = after.typography.results.find((c) => c.id === card.id);
    all.push({
      set,
      card,
      old,
      before,
      after,
      previousType,
      currentType,
      scores: [body(old), body(card)],
      delta: body(card) - body(old),
    });
  }
}
const best = [...new Set(all.map((c) => c.set))].flatMap((set) =>
  all
    .filter(
      (c) =>
        c.set === set &&
        !c.card.alignment.uncertain &&
        !c.old.alignment.uncertain &&
        c.delta > 0.02,
    )
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 2),
);
const review = (plan.reviewExamples ?? []).map((item) => {
  const card = all.find(
    (c) => c.set === item.set && c.card.collectorNumber === item.collectorNumber,
  );
  if (!card) throw Error(`Review example unavailable: ${item.set}/${item.collectorNumber}`);
  return { ...card, question: item.question };
});
async function section(example) {
  const { set, card, old, before, after, scores, previousType, currentType, question } = example;
  const local = (dir, file) =>
    path
      .relative(out, path.join(dir, file))
      .split(path.sep)
      .map((s) => encodeURIComponent(s))
      .join('/');
  for (const [dir, result] of [
    [before.dir, old],
    [after.dir, card],
  ])
    if (
      hash(await readFile(path.join(dir, result.images.inspect.file))) !==
      result.images.inspect.sha256
    )
      throw Error(`Stale example image: ${card.name}`);
  const columns = [
    {
      title: 'Scryfall scan',
      image: local(after.dir, `cards/${card.id}.aligned.png`),
      link: local(after.dir, card.images.reference.file),
      detail: 'Frozen frame alignment · open original scan',
    },
    {
      title: 'Old presentation',
      image: local(before.dir, old.images.inspect.file),
      detail: `Body F1 ${number(scores[0])} · wraps ${percent(previousType?.softBreakF1)}`,
    },
    {
      title: 'New presentation',
      image: local(after.dir, card.images.inspect.file),
      detail: `Body F1 ${number(scores[1])} · wraps ${percent(currentType?.softBreakF1)}`,
    },
  ];
  return `<article><div class="caption"><h2>${escape(card.name)}</h2><span>${escape(set.toUpperCase())} #${escape(card.collectorNumber)} · ${escape(card.cohort)} · ${card.alignment.uncertain ? 'alignment flagged' : 'shared alignment'}</span></div>
  ${question ? `<p class="question">${escape(question)}</p>` : `<p class="gain">Body edge F1 +${number(example.delta)}. Selected among the largest measured gains in this set.</p>`}
  <div class="triptych">${columns.map((c) => `<figure><figcaption><strong>${c.title}</strong><small>${escape(c.detail)}</small></figcaption><a class="frame" href="${escape(c.link ?? c.image)}" target="_blank" rel="noopener"><img src="${escape(c.image)}" alt="${escape(card.name)} — ${c.title}" loading="lazy" width="488" height="680"></a></figure>`).join('')}</div>
  <p class="detail">Block edge error: ${number(previousType?.blockEdgeMae)} → ${number(currentType?.blockEdgeMae)} px. <a href="${escape(card.source)}" target="_blank" rel="noopener">Scryfall source</a> · <a href="${escape(local(after.dir, 'report.html'))}">Full set report</a></p></article>`;
}
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Old-border typography · scan / old / new</title>
<style>
:root{color-scheme:dark;font:16px/1.5 system-ui,sans-serif;background:#12171b;color:#e8eef2}*{box-sizing:border-box}body{margin:0}main,header,.controls{max-width:1450px;margin:auto;padding:24px 30px}header{padding-bottom:12px}h1{font-size:clamp(26px,4vw,42px);line-height:1.15;margin:8px 0 16px}h2{font-size:22px;margin:0}p{max-width:1000px}.eyebrow{letter-spacing:.12em;text-transform:uppercase;font-size:12px;color:#8fcbbd}.intro,.detail,small,.caption span{color:#b0bfc9}.controls{position:sticky;top:0;z-index:2;background:#12171bf2;max-width:none;border-block:1px solid #34414a;padding:12px 30px;display:flex;justify-content:center;gap:12px;align-items:center;flex-wrap:wrap}button{font:inherit;color:inherit;border:1px solid #647783;border-radius:6px;padding:7px 16px;background:#222d34;cursor:pointer}button[aria-pressed=true]{background:#b9e4d8;color:#102b24;border-color:#b9e4d8}a{color:#a6d7f4}article{padding:0 0 30px;margin-bottom:30px;border-bottom:1px solid #34414a}.caption{display:flex;gap:16px;align-items:baseline;flex-wrap:wrap}.gain{color:#9dd9c5;margin:8px 0 16px}.question{background:#302b22;border-left:3px solid #e6bd75;padding:12px 16px;color:#f3d9a9;max-width:none}.triptych{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}figure{margin:0;min-width:0}figcaption{margin-bottom:10px}small{display:block;font-size:12px}.frame{display:block;overflow:hidden;aspect-ratio:488/680;position:relative;background:#080b0d;border-radius:8px}.frame img{display:block;width:100%;height:auto}.body-only .frame{aspect-ratio:488/207;border-radius:4px}.body-only .frame img{position:absolute;top:-194.686%}.detail{font-size:13px}.section-label{font-size:26px;margin:15px 0 24px}.caveat{border:1px solid #34414a;border-radius:8px;padding:16px;font-size:14px}footer{color:#b0bfc9;font-size:12px;padding:20px 0}@media(max-width:720px){main,header{padding:18px 12px}.triptych{gap:8px;min-width:690px}article{overflow-x:auto}small{font-size:11px}.caption span{font-size:12px}.controls{justify-content:flex-start;padding:10px 12px}}
</style>
<header><div class="eyebrow">Local accuracy review · Mirage + Tempest</div><h1>Scan / old presentation / new presentation</h1><p class="intro">The same cached art, printed wording, frame assets and fonts in both renders. New typography adds measured fitting, italics and attribution alignment. Click a card for its full-resolution image.</p><p class="caveat">These are selected examples, not an overall accuracy percentage. Body F1 measures text edges within 1 canonical pixel; wrap agreement excludes forced paragraph breaks. Alignment is frozen for the frame family, never fitted per scan. Color and saturation are not scored. Scan geometry has about 2px measurement uncertainty. On narrow screens, scroll each row sideways.</p></header>
<div class="controls" role="group" aria-label="Image view"><button id="full" aria-pressed="true">Full cards</button><button id="body" aria-pressed="false">Enlarge text boxes</button><a href="#review">Questions for review ↓</a></div>
<main><h2 class="section-label">Largest measured improvements</h2>${(await Promise.all(best.map(section))).join('')}<h2 class="section-label" id="review">Your eyes on these</h2>${(await Promise.all(review.map(section))).join('')}<footer>Local fan-made rendering study. Magic: The Gathering and card imagery © Wizards of the Coast. Reference scans and art supplied through Scryfall. External assets remain in the local cache; this page is separate from the public showcase.</footer></main>
<script>for(const id of ['full','body'])document.getElementById(id).addEventListener('click',()=>{document.body.classList.toggle('body-only',id==='body');for(const other of ['full','body'])document.getElementById(other).setAttribute('aria-pressed',String(other===id));});</script></html>`;
await atomicWrite(path.join(out, 'examples.html'), html);
console.log(path.join(out, 'examples.html'));
