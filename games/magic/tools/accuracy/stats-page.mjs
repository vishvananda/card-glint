import path from 'node:path';
import { atomicWrite } from './common.mjs';
const escape = (v) =>
  String(v ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
const number = (v) => (Number.isFinite(v) ? v.toFixed(3) : '—');
export async function statsPage(sets, dir, plan = {}) {
  const transferSet = plan.transferSet ?? '5ed';
  const transfer = sets.find((s) => s.set === transferSet);
  const heldOut = transfer?.summary['held-out'].inspect;
  const transferStatus = heldOut
    ? `${transferSet.toUpperCase()} reserved check: ${heldOut.improved} gains and ${heldOut.regressed} regressions over 0.02 among ${heldOut.count} confidently aligned stat boxes. ${heldOut.regressed ? 'Transfer requires review.' : 'Inspect the residual shapes as well as the aggregate.'}`
    : 'Transfer results unavailable.';
  const local = (file) =>
    path.relative(dir, file).split(path.sep).map(encodeURIComponent).join('/');
  const cards = sets.flatMap((s) => {
    const selected =
      s.set === transferSet
        ? s.results.filter((c) => c.cohort === 'held-out')
        : s.results.filter((c) =>
            (s.set === '4ed'
              ? ['Angry Mob', 'Leviathan', 'Shapeshifter', 'Nightmare', 'Uncle Istvan', 'Onulet']
              : ['Shapeshifter', 'White Knight', 'Keldon Warlord', 'Lhurgoyf']
            ).includes(c.name),
          );
    return selected.map((c) => {
      const d = c.diagnostic[1],
        p = d.overlapPeak;
      const question =
        s.set === '3ed'
          ? 'Review the dark printed strokes and pale edging. The current light fill is a different treatment; a placement score alone cannot certify this match.'
          : s.set === '5ed'
            ? 'Review numeric weight and expression width: the printed Fifth Edition stats appear heavier than ours. Shapeshifter remains a shape/width review case.'
            : 'Review numeric stroke weight and star shape. The shared placement is closer, but those contours are still different from the scan.';
      return `<article><h2>${escape(c.name)} <small>${s.set.toUpperCase()} #${c.collectorNumber} · ${s.set === transferSet && c.cohort === 'held-out' ? 'reserved transfer' : 'development / exploratory'}</small></h2><p>Stats F1: ${c.scores.inspect.map(number).join(' → ')} (inspect), ${c.scores.table.map(number).join(' → ')} (table). ${c.alignmentUncertain ? '<strong>Alignment warning: excluded from aggregate.</strong>' : ''}</p><p class="review">${escape(question)} Residual review: ${escape(d.status)}; maximum-overlap offset ${p ? `${p.dx}, ${p.dy}px · F1 ${number(p.edgeF1)}${p.ambiguous ? ' · ambiguous' : ''}${p.boundary ? ' · boundary' : ''}` : 'unmeasured'}. ${d.objectiveDisagreementPx > 2 ? 'Overlap and distance objectives disagree. ' : ''}Full-card body text may still use unreviewed Oracle wording.</p><div class="triptych">${[
        ['Scryfall scan', c.images.scan],
        ['Previous presentation', c.images.before],
        [
          s.set === '3ed' && plan.study === 'stats-wide'
            ? 'Rejected candidate'
            : 'New presentation',
          c.images.after,
        ],
      ]
        .map(
          ([label, file]) =>
            `<figure><figcaption>${label}</figcaption><a class="card" href="${escape(local(file))}" target="_blank" rel="noopener"><img src="${escape(local(file))}" alt="${escape(c.name)} — ${label}" loading="lazy"></a></figure>`,
        )
        .join(
          '',
        )}</div><p><a href="${escape(c.source)}">Scryfall source</a> · <a href="${escape(local(path.join(path.dirname(c.images.after), '../stats.json')))}">All component data for ${s.set.toUpperCase()}</a></p></article>`;
    });
  });
  const summaries = sets
    .map(
      (s) =>
        `<h3>${s.set.toUpperCase()} · ${s.attempted} cards, ${s.failed} failures</h3><p>${s.statsCards} stat boxes; ${s.alignmentExcluded} alignment exclusions. All ${s.outsideStatsIdentical} successful cards preserve every pixel outside the stats window at both tiers; ${s.unchangedNonstats} cards without stats are wholly unchanged.</p><table><tr><th>Cohort</th><th>n</th><th>Median inspect F1</th><th>Gains / regressions &gt; .02</th></tr>${Object.entries(
          s.summary,
        )
          .map(
            ([cohort, v]) =>
              `<tr><td>${escape(cohort === 'held-out' && s.set !== transferSet ? 'former held-out (seen)' : cohort)}</td><td>${v.inspect.count}</td><td>${number(v.inspect.before)} → ${number(v.inspect.after)}</td><td>${v.inspect.improved} / ${v.inspect.regressed}</td></tr>`,
          )
          .join('')}</table>`,
    )
    .join('');
  await atomicWrite(
    path.join(dir, 'stats.html'),
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(plan.reportTitle ?? 'Shared stats placement')}</title><style>
:root{font:16px/1.5 system-ui;color-scheme:dark;background:#14191d;color:#edf2f4;--crop-x:310;--crop-w:165;--crop-y:590;--crop-h:65}*{box-sizing:border-box}body{margin:0}header,main{max-width:1520px;margin:auto;padding:24px 32px}h1{font-size:34px}h2{font-size:25px;margin:0}small{font-size:14px;font-weight:400;color:#b7cbd6}p{max-width:1120px}a{color:#9dd5f4}.controls{position:sticky;top:0;z-index:2;background:#14191df5;padding:12px;display:flex;justify-content:center;gap:12px;border-block:1px solid #3b4a54}button{font:inherit;padding:7px 16px;border:1px solid #667b89;border-radius:6px;background:#27343d;color:inherit;cursor:pointer}button[aria-pressed=true]{background:#b7e5d5;color:#143228}.triptych{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}figure{margin:0}figcaption{margin-bottom:8px;color:#b7cbd6}.card{display:block;position:relative;overflow:hidden;aspect-ratio:var(--crop-w)/var(--crop-h);background:#354047}.card img{position:absolute;width:calc(488 / var(--crop-w) * 100%);height:auto;left:calc(var(--crop-x) / var(--crop-w) * -100%);top:calc(var(--crop-y) / var(--crop-h) * -100%)}article{padding:24px 0 30px;border-bottom:1px solid #3b4a54}.review{background:#332d21;border-left:3px solid #e7c174;padding:12px;color:#f1d9ac;font-size:14px}table{border-collapse:collapse;margin:14px 0 24px;font-size:14px}td,th{text-align:left;padding:8px 16px;border-bottom:1px solid #34454f}summary{cursor:pointer;color:#b7cbd6}footer{font-size:12px;color:#9daeb9}@media(max-width:750px){header,main{padding:20px 12px}.triptych{min-width:700px;gap:8px}article{overflow-x:auto}}
</style><header><h1>${escape(plan.reportTitle ?? 'Shared stats placement')}</h1><p>${escape(plan.reportDescription ?? 'Shared displacement, unchanged fonts and frame assets.')}</p><p>${escape(plan.note)} Scans retain fixed frame-family alignment, with uncertain cards excluded from aggregates.</p><p class="review">${plan.study === 'stats-wide' ? 'The right-anchor change is retained for Fourth and Fifth Edition. Revised failed the transfer review and keeps its previous placement; its third column shows the rejected candidate. ' : ''}${escape(transferStatus)} ${sets.some((s) => s.set === '3ed') ? 'Revised also uses a different numeric ink treatment; current light-edge scores do not certify that match.' : ''}</p><p>The first centered-offset trial failed on wide expressions; those failures remain in its archived measurement. The new search includes their full width. Residual offset suggestions are diagnostics only and are never applied to individual scans.</p><p><a href="../../4ed/fourth-details-all/details.html">Previous header/credit comparison</a> · <a href="report.html">${escape(transferSet.toUpperCase())} all-card report</a></p><details><summary>Paired results and parity checks</summary>${summaries}</details></header><nav class="controls"><button data-x="310" data-w="165" data-y="590" data-h="65" aria-pressed="true">Stats detail</button><button data-x="0" data-w="488" data-y="590" data-h="65" aria-pressed="false">Whole footer</button><button data-x="0" data-w="488" data-y="0" data-h="680" aria-pressed="false">Full cards</button></nav><main>${cards.join('')}<footer>Local fan rendering study. Magic imagery © Wizards of the Coast; reference scans and art through Scryfall. Downloaded assets stay outside the public showcase and repository images.</footer></main><script>for(const b of document.querySelectorAll('button'))b.addEventListener('click',()=>{document.documentElement.style.setProperty('--crop-x',b.dataset.x);document.documentElement.style.setProperty('--crop-w',b.dataset.w);document.documentElement.style.setProperty('--crop-y',b.dataset.y);document.documentElement.style.setProperty('--crop-h',b.dataset.h);for(const o of document.querySelectorAll('button'))o.setAttribute('aria-pressed',String(o===b));});</script></html>`,
  );
}
