const report = window.MAGIC_ACCURACY;
const $ = (id) => document.getElementById(id);
const percent = (n) => (n == null ? '—' : (100 * n).toFixed(1) + '%');
const fixed = (n) => (n == null ? '—' : n.toFixed(2));
const element = (tag, text, className) => {
  const e = document.createElement(tag);
  if (text != null) e.textContent = text;
  if (className) e.className = className;
  return e;
};
let selected = report.results.find((r) => !r.issue)?.id,
  edgeView = false,
  frameGuides = false;
$('title').textContent = `${report.set.toUpperCase()} · Rendering accuracy`;
$('scope').textContent =
  `${report.run} · ${report.eligibleCount} ordinary printings of ${report.totalPrintings} · Chromium ${report.browser} · ${report.elapsedSeconds.toFixed(1)}s in Node (${report.cacheHits} cached cards)`;
for (const [value, label] of [
  [`${report.summary.measured}/${report.eligibleCount}`, 'CARDS MEASURED'],
  [percent(report.summary.tiers.inspect.text.median), 'MEDIAN TEXT EDGE AGREEMENT'],
  [report.summary.scanReviewed, 'REVIEWED BODY TEXTS'],
  [report.summary.alignmentUncertain, 'ALIGNMENT FLAGS'],
  [report.summary.frameGeometryMismatch ?? 0, 'FRAME SIZE FLAGS'],
  [report.summary.failed, 'FAILED'],
]) {
  const stat = element('div', null, 'stat');
  stat.append(element('strong', value), element('span', label));
  $('summary').append(stat);
}
if (!report.complete) $('scope').append(' · INCOMPLETE RUN');
$('scope').append(
  ` · Layout/overflow checked on ${report.summary.layoutMeasured}/${report.summary.measured} cards`,
);
function showTab(tab) {
  for (const id of ['cards', 'assets', 'excluded']) $(id).hidden = id !== tab;
  document
    .querySelectorAll('[data-tab]')
    .forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
}
document
  .querySelectorAll('[data-tab]')
  .forEach((b) => b.addEventListener('click', () => showTab(b.dataset.tab)));
function score(r) {
  return r.comparisons?.[$('tier').value]?.textEdgeF1 ?? -1;
}
function choose(id) {
  selected = id;
  showTab('cards');
  drawDetail();
  drawList();
}
function drawList() {
  const query = $('search').value.toLowerCase(),
    filter = $('filter').value;
  const results = report.results.filter(
    (r) =>
      `${r.name} ${r.collectorNumber}`.toLowerCase().includes(query) &&
      (filter === 'all' ||
        (filter === 'reviewed' && r.contentStatus === 'scan-reviewed') ||
        (filter === 'held-out' && r.cohort === 'held-out') ||
        (filter === 'uncertain' && r.alignment?.uncertain) ||
        (filter === 'frame-geometry' && r.alignment?.geometryMismatch) ||
        (filter === 'failed' && (r.issue || r.clipping))),
  );
  results.sort((a, b) =>
    $('sort').value === 'number'
      ? parseInt(a.collectorNumber) - parseInt(b.collectorNumber)
      : $('sort').value === 'best'
        ? score(b) - score(a)
        : score(a) - score(b),
  );
  $('count').textContent = `${results.length} cards`;
  $('list').replaceChildren();
  for (const r of results) {
    const button = element('button', null, 'card-row' + (r.id === selected ? ' active' : ''));
    const label = element('span', r.name);
    label.append(element('small', `#${r.collectorNumber} · ${r.category}`));
    button.append(label, element('span', r.issue ? 'Failed' : percent(score(r)), 'score'));
    button.addEventListener('click', () => choose(r.id));
    $('list').append(button);
  }
}
function drawDetail() {
  const r = report.results.find((r) => r.id === selected),
    target = $('detail');
  target.replaceChildren();
  if (!r) return;
  target.append(element('h2', r.name));
  const badges = element('div', null, 'badges');
  for (const label of [
    r.contentStatus === 'scan-reviewed'
      ? 'Body wording reviewed'
      : r.contentStatus === 'printing-reference'
        ? 'Printing text source; scan styling unverified'
        : 'Oracle wording unverified',
    r.cohort,
    r.alignment?.family,
    r.alignment?.uncertain ? 'Alignment uncertain' : null,
    r.alignment?.geometryMismatch ? 'Frame size mismatch' : null,
    r.clipping ? 'Text overflow' : null,
    r.layout == null && !r.issue ? 'Layout/overflow unmeasured' : null,
  ].filter(Boolean))
    badges.append(
      element(
        'span',
        label,
        'badge' +
          (/unverified|uncertain|overflow|unmeasured|mismatch/.test(label) ? ' warning' : ''),
      ),
    );
  target.append(badges);
  if (r.issue) {
    target.append(element('pre', r.issue));
    return;
  }
  const images = element('div', null, 'images');
  const pair = [
    ['Scryfall · frozen alignment profile', r.previews.reference],
    [
      edgeView
        ? 'Inspect edges · cyan reference / magenta render / white match'
        : `Our renderer · ${$('tier').value}`,
      edgeView
        ? r.previews.edges
        : $('tier').value === 'table'
          ? r.images.table.file
          : r.previews.rendered,
    ],
  ];
  for (const [index, [caption, src]] of pair.entries()) {
    const figure = element('figure'),
      img = element('img');
    img.src = src;
    img.alt = `${r.name}: ${caption}`;
    const picture = element('div', null, 'picture');
    picture.append(img);
    if (frameGuides && r.alignment?.boundaries?.complete) {
      const sides = r.alignment.boundaries.sides;
      const key = index === 0 ? 'reference' : 'rendered';
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 488 680');
      svg.setAttribute('aria-label', 'Detected outer printed frame');
      const rect = document.createElementNS(svg.namespaceURI, 'rect');
      for (const [name, value] of Object.entries({
        x: sides.left[key],
        y: sides.top[key],
        width: sides.right[key] - sides.left[key],
        height: sides.bottom[key] - sides.top[key],
        fill: 'none',
        stroke: '#ff28b4',
        'stroke-width': 1.5,
      }))
        rect.setAttribute(name, value);
      svg.append(rect);
      picture.append(svg);
    }
    figure.append(element('figcaption', caption), picture);
    images.append(figure);
  }
  target.append(images);
  const controls = element('div', null, 'controls'),
    toggle = element('button', edgeView ? 'Show rendering' : 'Show edge disagreement');
  toggle.addEventListener('click', () => {
    edgeView = !edgeView;
    frameGuides = false;
    drawDetail();
  });
  const source = element('a', 'Scryfall source');
  source.href = r.source;
  source.target = '_blank';
  source.rel = 'noreferrer';
  controls.append(toggle, source);
  if (r.alignment?.boundaries?.complete) {
    const guide = element('button', frameGuides ? 'Hide frame guides' : 'Show frame guides');
    guide.addEventListener('click', () => {
      frameGuides = !frameGuides;
      edgeView = false;
      drawDetail();
    });
    controls.append(guide);
  }
  target.append(controls);
  if (r.alignment?.boundaries?.complete) {
    const boundary = r.alignment.boundaries;
    target.append(
      element(
        'p',
        `Outer frame: render center differs by (${fixed(boundary.centerDelta[0])}, ${fixed(boundary.centerDelta[1])})px; ` +
          `width/height differ by (${fixed(boundary.sizeDelta[0])}, ${fixed(boundary.sizeDelta[1])})px. ` +
          'Pink guides show the detected rectangle. These measurements do not move either image.',
        'note',
      ),
    );
  }
  const typography = report.typography?.results.find((card) => card.id === r.id);
  if (typography?.status === 'measured')
    target.append(
      element(
        'p',
        `Reviewed line layout · soft-wrap F1 ${fixed(typography.softBreakF1)} · ` +
          `${typography.actualLines}/${typography.expectedLines} lines · ` +
          `block-edge error ${fixed(typography.blockEdgeMae)}px · ` +
          `matched-line top error ${fixed(typography.matchedLineTopMae)}px ` +
          `(${typography.matchedLines} identical lines, inspect tier).`,
      ),
    );
  const rows = r.comparisons[$('tier').value].regions.map((v) => [
    v.id,
    percent(v.edgeF1?.[1]),
    fixed(v.meanDistance),
    fixed(v.p95Distance),
    percent(v.censusSimilarity),
    v.status,
  ]);
  target.append(
    table(['Region', 'Edge F1 @1px', 'Mean distance', 'p95 distance', 'Census', 'Status'], rows),
  );
  const details = element('details');
  details.append(
    element('summary', 'Alignment and layout diagnostics'),
    element(
      'pre',
      JSON.stringify(
        {
          alignment: r.alignment,
          normalization: r.normalization,
          layout: r.layout && {
            size: r.layout.size,
            height: r.layout.height,
            overflow: r.layout.overflow,
          },
          rawTextEdgeF1: r.comparisons.inspect.rawTextEdgeF1,
        },
        null,
        2,
      ),
    ),
  );
  target.append(details);
}
function table(headings, rows) {
  const t = element('table'),
    head = element('tr');
  headings.forEach((h) => head.append(element('th', h)));
  const thead = element('thead');
  thead.append(head);
  t.append(thead);
  const body = element('tbody');
  for (const row of rows) {
    const tr = element('tr');
    row.forEach((v) => {
      const td = element('td');
      if (v instanceof Node) td.append(v);
      else td.textContent = v;
      tr.append(td);
    });
    body.append(tr);
  }
  t.append(body);
  return t;
}
const assetRows = report.assets.map((a) => {
  const source = element(
    'a',
    `${a.role} · ${decodeURIComponent(a.url.split('/').slice(-2).join('/'))}`,
    'asset-url',
  );
  source.href = a.url;
  source.target = '_blank';
  source.rel = 'noreferrer';
  const examples = element('div');
  a.examples.slice(0, 4).forEach((c) => {
    const b = element('button', c.name);
    b.addEventListener('click', () => choose(c.id));
    examples.append(b);
  });
  return [
    source,
    a.status,
    `${a.confidentCount}/${a.cardCount}`,
    percent(a.medianEdgeF1),
    examples,
  ];
});
$('asset-list').append(
  table(['Asset', 'Review status', 'Confident cards', 'Median edge F1', 'Examples'], assetRows),
);
$('exclusions').append(
  table(
    ['Number', 'Name', 'Reason'],
    report.excluded.map((r) => [r.collectorNumber, r.name, r.reason]),
  ),
);
for (const id of ['search', 'filter', 'sort', 'tier'])
  $(id).addEventListener(id === 'search' ? 'input' : 'change', () => {
    drawList();
    drawDetail();
  });
drawList();
drawDetail();
