import path from 'node:path';
const escape = (v) =>
  String(v ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
const number = (v) => (Number.isFinite(v) ? v.toFixed(3) : '—');

export function basicPage({ sets, report, out }) {
  const local = (dir, file) =>
    path.relative(out, path.join(dir, file)).split(path.sep).map(encodeURIComponent).join('/');
  const examples = sets.flatMap((s) =>
    s.results
      .filter((c) => ['332', '336', '344'].includes(c.collectorNumber))
      .map((c) => ({ s, c })),
  );
  const rows = sets
    .flatMap((s) =>
      ['calibration', 'held-out'].map((cohort) => {
        const v = s.evidence.summary[cohort].inspect.body;
        return `<tr><td>${s.set.toUpperCase()} ${cohort}</td><td>${v.count}</td><td>${number(v.before)} → ${number(v.after)}</td><td>${v.improved} / ${v.regressed}</td></tr>`;
      }),
    )
    .join('');
  const cards = examples
    .map(({ s, c }) => {
      const card = s.after.results.find((v) => v.id === c.id);
      const old = s.before.results.find((v) => v.id === c.id);
      const columns = [
        ['Scryfall scan', local(s.dir, `cards/${c.id}.aligned.png`)],
        ['Previous presentation', local(s.previous, old.images.inspect.file)],
        ['Current presentation', local(s.dir, card.images.inspect.file)],
      ];
      return `<article><h2>${escape(c.name)} <small>${s.set.toUpperCase()} #${c.collectorNumber} · ${c.cohort}${c.alignmentUncertain ? ' · alignment flagged' : ''}</small></h2><p>Body F1 ${c.scores.inspect.body.map(number).join(' → ')} · Type F1 ${c.scores.inspect.type.map(number).join(' → ')}</p><div class="triptych">${columns.map(([label, url]) => `<figure><figcaption>${label}</figcaption><a href="${escape(url)}" class="card" target="_blank" rel="noopener"><img src="${escape(url)}" width="488" height="680" alt="${escape(c.name)} — ${label}" loading="lazy"></a></figure>`).join('')}</div><p><a href="${escape(card.source)}">Scryfall source</a> · <a href="${escape(local(s.dir, 'report.html'))}">Every ${s.set.toUpperCase()} card and asset flags</a></p></article>`;
    })
    .join('');
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Historical basics · scan / previous / current</title><style>
:root{color-scheme:dark;font:16px/1.5 system-ui,sans-serif;background:#14191d;color:#edf2f4;--crop-y:0;--crop-h:680}*{box-sizing:border-box}body{margin:0}header,main{max-width:1520px;margin:auto;padding:24px 32px}h1{font-size:36px;line-height:1.2}h2{font-size:25px}small{font-size:14px;font-weight:400;color:#b7cbd6}p{max-width:1150px}.controls{position:sticky;top:0;z-index:3;display:flex;gap:12px;justify-content:center;padding:12px;background:#14191df5;border-block:1px solid #3b4a54}button{font:inherit;background:#27343d;color:inherit;border:1px solid #667b89;border-radius:6px;padding:7px 14px;cursor:pointer}button[aria-pressed=true]{background:#b7e5d5;color:#143228}article{padding:12px 0 30px;border-bottom:1px solid #3b4a54}.triptych{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}figure{margin:0}figcaption{color:#b7cbd6;margin-bottom:8px}.card{display:block;position:relative;overflow:hidden;aspect-ratio:488/var(--crop-h);background:#354047}.card img{position:absolute;width:100%;height:auto;top:calc(var(--crop-y) / var(--crop-h) * -100%)}a{color:#9dd5f4}table{border-collapse:collapse;font-size:14px}th,td{padding:8px 16px;text-align:left;border-bottom:1px solid #34454f}.review{padding:12px 16px;background:#332d21;border-left:3px solid #e7c174}footer{font-size:12px;color:#9daeb9;margin-top:30px}@media(max-width:750px){header,main{padding:20px 12px}.triptych{min-width:700px;gap:8px}article{overflow-x:auto}h1{font-size:28px}}
</style><header><h1>Historical basics: scan / previous / current</h1><p>Mirage and Tempest now print “Land” and a centered tap-for-mana sentence instead of the later large mana symbol. The same semantic input, art, frame assets and shared scan alignment are used in both renders.</p><p>Five Mirage development cards; 15 Mirage and all 20 Tempest basics reserved before the policy was frozen. ${sets.reduce((n, s) => n + s.evidence.unchangedNonbasics, 0)} nonbasic cards plus ${report.modernParity.cards} modern holdouts remain pixel-identical at both tiers. F1 measures edge agreement within one canonical pixel, not a percentage of rendering accuracy.</p><table><thead><tr><th>Group</th><th>Confident cards</th><th>Median body F1</th><th>Gains / regressions &gt; .02</th></tr></thead><tbody>${rows}</tbody></table><p class="review">Still flagged for asset review: the printed basic-land text box has a flatter, grainier texture than our cloudy plate. The frame assets are unchanged. Tap and mana glyph weight also remain separate shape-review items.</p><p><a href="../retro-details/details.html">Earlier mana, set-symbol, footer and corner comparisons</a> · <a href="basics.json">All 40 basic-land measurements</a></p></header><nav class="controls" aria-label="Image crop">${[
    ['Full cards', 0, 680],
    ['Type lines', 368, 45],
    ['Text boxes', 410, 195],
    ['Credits', 600, 58],
  ]
    .map(
      ([label, y, h], i) =>
        `<button data-y="${y}" data-h="${h}" aria-pressed="${i === 0}">${label}</button>`,
    )
    .join(
      '',
    )}</nav><main><p>Six reserved examples, selected by collector number to show three colors in each set; no ranking by improvement.</p>${cards}<footer>Local fan rendering study. Magic: The Gathering and card imagery © Wizards of the Coast. Scans and art via Scryfall. External images remain local and are excluded from the public showcase.</footer></main><script>for(const button of document.querySelectorAll('button'))button.addEventListener('click',()=>{document.documentElement.style.setProperty('--crop-y',button.dataset.y);document.documentElement.style.setProperty('--crop-h',button.dataset.h);for(const other of document.querySelectorAll('button'))other.setAttribute('aria-pressed',String(other===button));});</script></html>`;
}
