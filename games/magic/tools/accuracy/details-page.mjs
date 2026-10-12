import path from 'node:path';
import { atomicWrite, outputRoot, readJson } from './common.mjs';
const escape = (v) =>
  String(v ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
const number = (v) => (Number.isFinite(v) ? v.toFixed(3) : '—');
export async function detailPage({ opts, dir, previous, current, before, report }) {
  const sets = [{ set: opts.set, dir, previous, current, before, report }];
  const fourth = opts.set === '4ed';
  const other = opts.set === 'mir' ? 'tmp' : 'mir';
  if (!fourth)
    try {
      const root = path.join(outputRoot, other, opts.run),
        old = path.join(outputRoot, other, opts.baseline);
      const metrics = await readJson(path.join(root, 'metrics.json'));
      const details = await readJson(path.join(root, 'details.json'));
      if (
        details.rendererHashes[1] === current.rendererHash &&
        details.rendererHashes[1] === metrics.rendererHash &&
        details.referenceIdentity === metrics.referenceIdentity &&
        details.alignmentHash === metrics.alignmentHash &&
        details.diagnosticSource === report.diagnosticSource &&
        details.baseline === opts.baseline
      )
        sets.push({
          set: other,
          dir: root,
          previous: old,
          current: metrics,
          before: await readJson(path.join(old, 'metrics.json')),
          report: details,
        });
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  const fullReports = [];
  for (const s of sets) {
    const full = s.current.complete ? s.dir : path.join(outputRoot, s.set, opts.run + '-all');
    try {
      const metrics = await readJson(path.join(full, 'metrics.json'));
      if (metrics.complete && metrics.rendererHash === s.current.rendererHash)
        fullReports.push([
          s.set,
          path
            .relative(dir, path.join(full, 'report.html'))
            .split(path.sep)
            .map(encodeURIComponent)
            .join('/'),
        ]);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  const selected = fourth
    ? ['Uncle Istvan', 'Lifetap', 'Conversion', 'Backfire', 'Fellwar Stone', 'Island', 'Strip Mine']
    : [
        'Viashino Warrior',
        "Suq'Ata Firewalker",
        'Shaper Guildmage',
        'Grindstone',
        'Altar of Dementia',
        'Mtenda Herder',
        'Mogg Conscripts',
        'Lead Golem',
      ];
  const local = (root, file) =>
    path.relative(dir, path.join(root, file)).split(path.sep).map(encodeURIComponent).join('/');
  const cards = selected.flatMap((name) =>
    sets.flatMap((s) => {
      const card = s.current.results.find((c) => c.name === name);
      if (!card) return [];
      const old = s.before.results.find((c) => c.id === card.id),
        detail = s.report.results.find((c) => c.id === card.id);
      const region = (c, id) => c.comparisons.inspect.regions.find((r) => r.id === id)?.edgeF1?.[1];
      const score = ['title', 'mana', 'set-symbol', 'stats', 'footer']
        .filter((id) => region(card, id) != null)
        .map((id) => `${id}: ${number(region(old, id))} → ${number(region(card, id))}`)
        .join(' · ');
      const review = fourth
        ? card.frame !== 'retro-fourth'
          ? 'Unchanged land branch: this uses a different plate and has insufficient calibration evidence. The early basic-land body and credits still need a separate printing policy.'
          : 'Remaining review: title/credit strokes look heavier than the print, and body typography has not been adjusted in this pass. Inspect glyph weight separately from placement.'
        : name === 'Lead Golem'
          ? 'Frame asset review: the original artifact frame has a dark reddish texture. Our existing asset is much brighter and brown, with a different text-box pattern.'
          : name === 'Shaper Guildmage' || name === 'Grindstone'
            ? 'Tap review: the new mark is the tilted card with an arrow. Remaining stroke weight and circle size are visible in the crop; body-line placement is a separate typography issue.'
            : name === 'Mtenda Herder' || name === 'Mogg Conscripts'
              ? 'Typography review: these remain examples where body line spacing/wrapping needs attention. This pass changes printed details, not the body layout.'
              : null;
      const columns = [
        ['Scryfall scan', local(s.dir, `cards/${card.id}.aligned.png`)],
        ['Previous presentation', local(s.previous, old.images.inspect.file)],
        ['Current presentation', local(s.dir, card.images.inspect.file)],
      ];
      const diagnostics = detail.regions
        .map(
          (r) =>
            `<tr><td>${escape(r.id)}</td><td>${number(r.before.rawEdgeF1)} → ${number(r.after.rawEdgeF1)}</td><td>${escape(r.before.dx)}, ${escape(r.before.dy)} → ${escape(r.after.dx)}, ${escape(r.after.dy)}</td><td>${escape(r.after.status)}</td></tr>`,
        )
        .join('');
      const overlays = detail.regions
        .map(
          (r) =>
            `<figure class="edge"><figcaption>${escape(r.id)} · old | new</figcaption><img src="${escape(local(s.dir, r.overlay))}" alt="${escape(r.id)} edge differences" loading="lazy"></figure>`,
        )
        .join('');
      return [
        `<article id="card-${card.collectorNumber}-${s.set}"><h2>${escape(name)} <small>${s.set.toUpperCase()} #${card.collectorNumber}</small></h2><p class="scores">${score}</p>${review ? `<p class="review">${escape(review)}</p>` : ''}<div class="triptych">${columns.map(([title, url]) => `<figure><figcaption>${title}</figcaption><a class="card" href="${escape(url)}" target="_blank" rel="noopener"><img src="${escape(url)}" alt="${escape(name)} — ${title}" loading="lazy" width="488" height="680"></a></figure>`).join('')}</div><details><summary>Component offsets and edge overlays</summary>${detail.manaRows ? `<p>Whole mana row (scan / old / new): ${detail.manaRows.map((row) => `${row.status}; pitch ${number(row.pitch)}px`).join(' / ')}. Every disc is checked; a correct rightmost disc cannot hide incorrect spacing.</p>` : ''}${detail.manaCircles ? `<p>Independent rightmost-mana disc centers (scan / old / new): ${detail.manaCircles.map((v) => `${v.x}, ${v.y} · ${v.status}`).join(' / ')}. Ring detection discounts straight frame edges; uncertain circles require visual review.</p>` : ''}<p>Offsets suggest moving rendered ink toward the reference. They are diagnostics, never applied to these images or accuracy scores. Cyan = scan-only edge; magenta = render-only; white = overlap. Shape flags can also reflect typography, texture or incomplete crops.</p><table><thead><tr><th>Component</th><th>Fixed F1</th><th>Suggested dx, dy (px)</th><th>Current flag</th></tr></thead><tbody>${diagnostics}</tbody></table><div class="overlays">${overlays}</div></details><p><a href="${escape(card.source)}">Scryfall source</a> · <a href="${escape(local(s.dir, 'details.json'))}">Component data</a></p></article>`,
      ];
    }),
  );
  const aggregate = sets
    .map(
      (s) =>
        `<h3>${s.set.toUpperCase()} · ${s.report.attempted} paired cards, ${s.report.alignmentExcluded} alignment exclusions</h3><table><thead><tr><th>Component</th><th>n</th><th>Median fixed F1</th><th>Gains / regressions &gt; .02</th></tr></thead><tbody>${Object.entries(
          s.report.summary,
        )
          .map(
            ([id, v]) =>
              `<tr><td>${escape(id)}</td><td>${v.count}</td><td>${number(v.before)} → ${number(v.after)}</td><td>${v.improved} / ${v.regressed}</td></tr>`,
          )
          .join('')}</tbody></table>`,
    )
    .join('');
  await atomicWrite(
    path.join(dir, 'details.html'),
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Printed details · scan / previous / current</title><style>
:root{font:16px/1.5 system-ui,sans-serif;color-scheme:dark;background:#14191d;color:#edf2f4;--crop-y:0;--crop-h:680}*{box-sizing:border-box}body{margin:0}header,main{max-width:1520px;margin:auto;padding:24px 32px}h1{font-size:36px;line-height:1.2}h2{margin:0;font-size:25px}h3{font-size:18px}small{font-size:14px;color:#a8bac6;font-weight:400}p{max-width:1150px}.intro{color:#b6c7d0}.tag{color:#9fe2c8;font-size:12px;letter-spacing:.1em;text-transform:uppercase}.controls{position:sticky;top:0;z-index:3;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;padding:12px;background:#14191df5;border-block:1px solid #3b4a54}button{font:inherit;border:1px solid #667b89;border-radius:6px;background:#27343d;color:inherit;padding:7px 14px;cursor:pointer}button[aria-pressed=true]{background:#b7e5d5;color:#143228}article{padding:22px 0 30px;border-bottom:1px solid #3b4a54}.triptych{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}figure{margin:0}figcaption{margin-bottom:8px;color:#b7cbd6;font-size:14px}.card{display:block;position:relative;overflow:hidden;aspect-ratio:488/var(--crop-h);background:repeating-conic-gradient(#354047 0% 25%,#46515a 0% 50%) 50%/16px 16px}.card img{position:absolute;width:100%;height:auto;top:calc(var(--crop-y) / var(--crop-h) * -100%)}.scores{font-size:13px;color:#ade2ce}.review{padding:12px;background:#332d21;border-left:3px solid #e7c174;color:#f1d9ac}a{color:#9dd5f4}details{margin-top:18px}summary{cursor:pointer;color:#b7cbd6}details p{font-size:13px;color:#b6c7d0}table{border-collapse:collapse;font-size:13px;margin:12px 0 24px}th,td{text-align:left;padding:8px 16px;border-bottom:1px solid #34454f}.overlays{display:flex;flex-wrap:wrap;gap:16px}.edge img{height:100px;max-width:100%;image-rendering:pixelated;background:#191919}.edge{overflow:auto;max-width:100%}footer{font-size:12px;color:#9daeb9;margin-top:25px}@media(max-width:750px){header,main{padding:20px 12px}.triptych{min-width:700px;gap:8px}article{overflow-x:auto}h1{font-size:28px}}
</style><header><div class="tag">Local print-detail review · ${fourth ? 'Fourth Edition' : 'Mirage + Tempest'}</div><h1>Scan / previous / current</h1><p class="intro">${fourth ? 'Fourth Edition nonland cards: corrected header placement, whole-row mana spacing, artist credits, copyright and the historical tap. Its previous stats shadow is preserved; land plates remain flagged separately.' : 'Corrected mana placement and shadows, outlined black set symbols, power/toughness shadows, artist credits, copyright, historical tap glyph, and rounded Canvas corners.'} Existing frame and illustration assets are unchanged. ${fourth ? 'The previous column is the frozen pre-fix renderer.' : 'The previous column is the typography version you reviewed.'}</p><p class="intro">${sets.reduce((n, s) => n + s.report.attempted, 0)} paired cards; ${sets.reduce((n, s) => n + s.current.results.filter((c) => c.contentStatus === 'scan-reviewed').length, 0)} have reviewed printed body text. ${fourth ? 'Six nonland development cards; six reserved nonland cards evaluated after freezing the policy. The other two reserved cards use the unchanged land branch. Most body text remains Oracle diagnostics.' : 'No fresh holdouts.'} All scores use the frozen frame alignment; no per-scan fitting. F1 is edge agreement within one canonical pixel, not an accuracy percentage. Component crops include their own failure flags so a low mana score cannot disappear inside a body-text average.</p><p>${fullReports.map(([set, url]) => `<a href="${escape(url)}">${set.toUpperCase()} all-card scores and asset backlog</a>`).join(' · ')}</p>${fourth ? '<p><a href="../../tmp/retro-details/details.html">Mirage / Tempest printed details</a> · <a href="../../tmp/retro-basics/basics.html">Historical basic lands</a></p>' : ''}<details><summary>Paired component results</summary>${aggregate}</details></header><nav class="controls" aria-label="Image crop">${[
      ['full', 'Full cards', 0, 680],
      ['header', 'Mana / title', 20, 55],
      ['set', 'Set symbols', 365, 45],
      ['footer', 'Credits / stats', 602, 49],
      ['body', 'Rules / tap', 410, 193],
      ['corners', 'Top corners', 0, 65],
    ]
      .map(
        ([id, label, y, h]) =>
          `<button data-y="${y}" data-h="${h}" aria-pressed="${id === 'full'}">${label}</button>`,
      )
      .join(
        '',
      )}</nav><main>${cards.join('')}<footer>Local fan rendering study. Magic imagery © Wizards of the Coast; reference scans and art through Scryfall. Cached external assets remain outside the public showcase and repository images.</footer></main><script>for(const b of document.querySelectorAll('button'))b.addEventListener('click',()=>{document.documentElement.style.setProperty('--crop-y',b.dataset.y);document.documentElement.style.setProperty('--crop-h',b.dataset.h);for(const o of document.querySelectorAll('button'))o.setAttribute('aria-pressed',String(o===b));});</script></html>`,
  );
}
