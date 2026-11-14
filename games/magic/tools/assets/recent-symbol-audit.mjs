// Download symbol references into an ignored cache, never the distributable/showcase.
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createServer } from 'vite';
import { chromium } from 'playwright';
const args = process.argv.slice(2),
  arg = (name, fallback) => {
    const index = args.indexOf(name);
    return index < 0 ? fallback : args[index + 1];
  };
const cache = path.resolve(arg('--cache', 'games/magic/.cache/recent-set-symbols'));
const since = arg('--since', '2024-01-01'),
  today = new Date().toISOString().slice(0, 10);
assert.match(since ?? '', /^\d{4}-\d{2}-\d{2}$/, 'Use --since YYYY-MM-DD');
assert.equal(new Date(since).toISOString().slice(0, 10), since, 'Invalid start date');
const refresh = args.includes('--refresh'),
  sha = (v) => createHash('sha256').update(v).digest('hex');
await mkdir(cache, { recursive: true });
async function cached(url, kind) {
  const file = path.join(cache, sha(url) + '.' + kind);
  if (!refresh)
    try {
      return { file, bytes: await readFile(file) };
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
    }
  const response = await fetch(url, {
    headers: { 'User-Agent': 'card-glint/asset-audit (local symbol validation)' },
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw Error('HTTP ' + response.status + ': ' + url);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (kind === 'svg') assert(/<svg\b/.test(bytes.toString()), 'Not an SVG: ' + url);
  await writeFile(file, bytes);
  return { file, bytes };
}
const metadata = await cached('https://api.scryfall.com/sets', 'json');
const sets = JSON.parse(metadata.bytes).data;
assert(Array.isArray(sets), 'Incomplete Scryfall set metadata');
const catalog = JSON.parse(await readFile('games/magic/fixtures/assets/recent-set-symbols.json'));
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false, ws: false },
});
let browser;
try {
  const { setSymbolVector } = await server.ssrLoadModule(
    '/games/magic/src/presentation/set-symbols.ts',
  );
  const { styledSetSymbol } = await server.ssrLoadModule(
    '/games/magic/src/presentation/styled-set-symbols.ts',
  );
  const { setSymbolFilter } = await server.ssrLoadModule(
    '/games/magic/src/presentation/set-symbol-ink.ts',
  );
  const selected = sets.filter(
    (s) =>
      s.released_at >= since &&
      s.released_at <= today &&
      (Object.hasOwn(catalog.aliases, s.code) ||
        s.code === 'slz' ||
        (s.card_count >= 50 &&
          [
            'core',
            'expansion',
            'masters',
            'draft_innovation',
            'commander',
            'eternal',
            'masterpiece',
          ].includes(s.set_type))),
  );
  assert(selected.length > 0, 'No sets found in the requested interval');
  const rows = selected.map((s) => ({
    code: s.code,
    name: s.name,
    released: s.released_at,
    type: s.set_type,
    alias: catalog.aliases[s.code]?.symbol ?? null,
    assets: ['common', 'uncommon', 'rare', 'mythic'].map((rarity) => ({
      rarity,
      url: setSymbolVector(s.code, rarity),
      filter: setSymbolFilter(s.code, rarity),
      quality: styledSetSymbol(s.code, rarity) ? 'styled' : 'monochrome-fallback',
    })),
  }));
  const tasks = new Map();
  for (const row of rows) for (const a of row.assets) if (a.url) tasks.set(a.url, null);
  const urls = [...tasks.keys()];
  let next = 0;
  await Promise.all(
    Array.from({ length: 3 }, async () => {
      while (next < urls.length) {
        const url = urls[next++];
        try {
          const item = await cached(url, 'svg');
          tasks.set(url, { ...item, sha256: sha(item.bytes) });
        } catch (e) {
          tasks.set(url, { error: e.message });
        }
      }
    }),
  );
  browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  for (const [url, item] of tasks) {
    if (item.error) continue;
    const render = await page
      .evaluate(async (svg) => {
        const blob = new Blob([svg], { type: 'image/svg+xml' }),
          u = URL.createObjectURL(blob);
        try {
          const img = new Image();
          img.src = u;
          await img.decode();
          const c = document.createElement('canvas');
          c.width = 96;
          c.height = 96;
          const ctx = c.getContext('2d');
          ctx.drawImage(img, 0, 0, 96, 96);
          const d = ctx.getImageData(0, 0, 96, 96).data;
          let opaque = 0;
          for (let i = 3; i < d.length; i += 4) if (d[i] > 20) opaque++;
          if (opaque === 0) throw Error('Empty symbol');
          return { width: img.naturalWidth, height: img.naturalHeight, opaque };
        } finally {
          URL.revokeObjectURL(u);
        }
      }, item.bytes.toString())
      .catch((e) => ({ error: e.message }));
    Object.assign(item, render);
  }
  const errors = [];
  for (const row of rows)
    for (const a of row.assets) {
      const item = tasks.get(a.url);
      if (!a.url || item?.error) {
        a.error = item?.error ?? 'No supported symbol';
        errors.push({ set: row.code, rarity: a.rarity, error: a.error });
      } else
        Object.assign(a, {
          sha256: item.sha256,
          width: item.width,
          height: item.height,
          opaque: item.opaque,
        });
    }
  for (const [code, entry] of Object.entries(catalog.vectors)) {
    const item = tasks.get(entry.url);
    if (item && !item.error && item.sha256 !== entry.sha256)
      errors.push({ set: code, error: 'Source checksum changed; review before updating metadata' });
  }
  const escape = (s) =>
    s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
  const cards = rows
    .map(
      (r) =>
        `<article><strong>${escape(r.code.toUpperCase())} · ${escape(r.name)}</strong><div>${r.assets
          .map((a) => {
            const item = tasks.get(a.url);
            return item && !item.error
              ? `<figure><img style="filter:${a.filter}" src="data:image/svg+xml;base64,${item.bytes.toString('base64')}"><figcaption>${a.rarity}${a.quality === 'styled' ? '' : ' · outline'}</figcaption></figure>`
              : '<p>Unavailable</p>';
          })
          .join('')}</div></article>`,
    )
    .join('');
  const html =
    '<!doctype html><meta charset="utf-8"><title>Recent set symbols</title><style>body{font:14px system-ui;background:#e7e3da;color:#252521;margin:24px}main{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}article{background:#f9f7f1;padding:14px;border-radius:8px}article div{display:flex;justify-content:space-around}figure{margin:12px 2px;text-align:center}img{width:64px;height:52px;object-fit:contain}figcaption{font-size:11px}</style><h1>Recent set symbols</h1><p>Asset availability and decoding only. Not a scan calibration. External art references stay in this local cache.</p><main>' +
    cards +
    '</main>';
  await writeFile(path.join(cache, 'review.html'), html);
  await page.setViewportSize({ width: 1350, height: 850 });
  await page.setContent(html);
  await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode())));
  await page.screenshot({ path: path.join(cache, 'review.png'), fullPage: true });
  const report = {
    schema: 1,
    checkedAt: new Date().toISOString(),
    since,
    through: today,
    sets: rows.length,
    uniqueSources: tasks.size,
    errors,
    rows,
    scope:
      'Source availability, checksum provenance, SVG decode and nonempty pixels. No scan alignment or placement certification.',
  };
  await writeFile(path.join(cache, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(
    JSON.stringify({
      sets: rows.length,
      sources: tasks.size,
      errors,
      report: path.join(cache, 'report.json'),
      preview: path.join(cache, 'review.html'),
    }),
  );
  if (errors.length) process.exitCode = 1;
} finally {
  await browser?.close();
  await server.close();
}
