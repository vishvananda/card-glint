import path from 'node:path';
import { atomicWrite } from './common.mjs';
const escape = (s) =>
  String(s ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
const sourceLabel = (c) => {
  if (c.contentReview?.regions?.includes('body'))
    return 'Rules text was checked against the scan; other printing fields may still differ.';
  const wording =
    c.contentStatus === 'scan-reviewed'
      ? 'Reviewed printed wording supplied to both renderers.'
      : c.contentStatus === 'printing-reference'
        ? 'Printing-specific reference wording supplied to both renderers; paragraph styling and other fields still need scan review.'
        : 'Body wording is unreviewed Oracle text on both sides.';
  return `${c.contentReview?.regions?.includes('mana') ? 'Mana cost checked against the scan. ' : ''}${wording}`;
};
const score = (v) => (Number.isFinite(v) ? v.toFixed(3) : '—');
export async function mainPage(report, dir) {
  const headline = report.headline ?? 'Scans vs main vs the current branch';
  const beforeLabel = report.beforeLabel ?? 'main · ' + report.mainCommit.slice(0, 7);
  const failed = report.examples.flatMap((c) =>
    c.captures.main.fonts.filter((f) => f.status === 'error'),
  );
  const cards = report.examples
    .map(
      (c) =>
        `<article id="${c.set}-${c.number}"><h2>${c.reviewCase ? 'Review: ' : ''}${escape(c.name)} <small>${c.set.toUpperCase()} #${c.number}</small></h2><p>${escape(c.note)}</p><p class="scores">${c.scores.map((s) => `${escape(s.region)}: ${s.values.map(score).join(' → ')}`).join(' · ')} <span>edge F1, ${escape(report.scoreLabel ?? 'main → branch')}</span></p><div class="triptych">${[
          ['Scryfall scan', 'scan'],
          [beforeLabel, 'main'],
          ['Current branch', 'branch'],
        ]
          .map(
            ([label, side]) =>
              `<figure><figcaption>${label}</figcaption><a class="card" href="${escape(c.images[side])}" target="_blank" rel="noopener"><img src="${escape(c.images[side])}" alt="${escape(c.name)} — ${label}" loading="lazy"></a></figure>`,
          )
          .join(
            '',
          )}</div><p class="source"><a href="${escape(c.source)}">Scryfall source</a> · ${sourceLabel(c)}</p></article>`,
    )
    .join('');
  await atomicWrite(
    path.join(dir, 'index.html'),
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(headline)}</title><style>
:root{font:16px/1.45 system-ui;color-scheme:dark;background:#14191e;color:#edf2f5;--y:0;--h:680}*{box-sizing:border-box}body{margin:0}header,main{max-width:1520px;padding:24px 30px;margin:auto}h1{font-size:32px;margin:0 0 12px}h2{font-size:24px;margin:0}small,.source{font-size:13px;font-weight:400;color:#b8c8d4}p{max-width:1200px;margin:10px 0}a{color:#a7d9f4}.controls{position:sticky;top:0;z-index:2;background:#14191ef5;border-block:1px solid #3d4d57;padding:10px;display:flex;gap:10px;justify-content:center}button{font:inherit;padding:7px 15px;border:1px solid #778c99;border-radius:6px;background:#293840;color:inherit;cursor:pointer}button[aria-pressed=true]{background:#b6e4d1;color:#163429}article{scroll-margin-top:75px;padding:20px 0 30px;border-bottom:1px solid #3d4d57}.triptych{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}figure{margin:0}figcaption{margin:8px 0;color:#c5d9e6}.card{display:block;position:relative;overflow:hidden;aspect-ratio:488/var(--h);background:#354149}.card img{position:absolute;width:100%;height:auto;top:calc(var(--y)/var(--h)*-100%)}.scores{font-size:13px;color:#c2e5d5}.scores span{color:#a9bbc7}.note{background:#332e24;padding:10px 14px;border-left:3px solid #ddbb77;font-size:14px}nav.jump{display:flex;gap:16px;flex-wrap:wrap;font-size:14px}footer{font-size:12px;color:#a9bbc7;padding:24px 0}@media(max-width:760px){header,main{padding:18px 10px}.triptych{min-width:720px;gap:10px}article{overflow:auto}}
</style><header><h1>${escape(headline)}</h1><p>${report.description ? escape(report.description) : `${report.examples.length} selected examples. The middle column is rendered from the actual main commit ${report.mainCommit.slice(0, 7)}; the right uses codex/magic-rendering-accuracy.`}</p><p>Both receive identical card inputs and cached artwork. Existing frame assets are retained. These are selected examples, not a ranking of every card. Scores measure structural edge agreement, not percent accuracy.</p>${failed.length ? '<p class="note">Main’s original italic font fails browser loading. Its original stylesheet and fallback behavior are preserved here; the branch includes the repaired font source.</p>' : ''}<nav class="jump">${report.examples.map((c) => `<a href="#${c.set}-${c.number}">${escape(c.name)}</a>`).join('')}</nav><p><a href="comparison.json">Source hashes and component scores</a> · <a href="../3ed/mana-validation/index.html">Revised mana validation</a> · <a href="../3ed/large-body-review/index.html">Revised large rules and regression review</a> · <a href="../3ed/lettering-validation/index.html">Revised lettering validation</a> · <a href="../3ed/stats-wide/stats.html">Stats study and remaining review cases</a></p></header><nav class="controls"><button data-y="0" data-h="680" aria-pressed="true">Full cards</button><button data-y="15" data-h="75" aria-pressed="false">Titles / mana</button><button data-y="360" data-h="245" aria-pressed="false">Type / rules</button><button data-y="598" data-h="65" aria-pressed="false">Credits / stats</button></nav><main>${cards}<footer>Local fan rendering study. Magic imagery © Wizards of the Coast; scans and art through Scryfall. Downloaded assets are excluded from the public showcase and repository images.</footer></main><script>for(const b of document.querySelectorAll('button'))b.addEventListener('click',()=>{document.documentElement.style.setProperty('--y',b.dataset.y);document.documentElement.style.setProperty('--h',b.dataset.h);for(const o of document.querySelectorAll('button'))o.setAttribute('aria-pressed',String(o===b));});</script></html>`,
  );
}
