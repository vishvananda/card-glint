import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { openBrowser } from './browser.mjs';
import { cachedFetch } from './cache.mjs';
import { hash, root as repo } from './common.mjs';
const [inputFile, pairedFile, out, ...requestedVersions] = process.argv.slice(2);
if (!out) throw Error('Usage: early-text-history.mjs INPUTS PAIRED_WORDINGS OUT [VERSIONS...]');
await fs.mkdir(out, { recursive: true });
const inputBytes = await fs.readFile(inputFile),
  pairedBytes = await fs.readFile(pairedFile);
const snapshot = JSON.parse(inputBytes),
  live = JSON.parse(pairedBytes);
// Hosts can supply exact, cached pairs. Never invent Oracle paragraphs for the
// reference experiment or fetch changing provider text during a replay.
for (const [id, data] of Object.entries(live)) {
  if (
    !snapshot.entries.some((e) => e.id === id) ||
    data.card.id !== id ||
    !data.original ||
    !data.oracle
  )
    throw Error('Paired wording identity mismatch: ' + id);
}
const names = Object.values(live).map((d) => d.card.name);
const versions = requestedVersions.length
  ? requestedVersions
  : ['0.5.2', '0.5.3', '0.5.4', '0.5.5', '0.6.0', '0.6.6'];
for (const version of versions)
  if (!/^\d+\.\d+\.\d+$/.test(version)) throw Error('Invalid release version');
const reports = [];
for (const version of versions) {
  const root = path.join(out, 'sources', version);
  await fs.mkdir(root, { recursive: true });
  const archive = execFileSync(
    'git',
    ['archive', 'v' + version, 'games/magic', 'packages/browser/src', 'package.json'],
    { cwd: repo, maxBuffer: 512 * 1024 * 1024 },
  );
  execFileSync('tar', ['-x', '-C', root], { input: archive });
  try {
    await fs.symlink(path.join(repo, 'node_modules'), path.join(root, 'node_modules'));
  } catch (e) {
    if (e.code !== 'EEXIST') throw e;
  }
  execFileSync('node', ['games/magic/tools/build-set-data.mjs'], { cwd: root, stdio: 'pipe' });
  await fs.mkdir(path.join(root, 'games/magic/tools/accuracy'), { recursive: true });
  await fs.copyFile(
    path.join(repo, 'games/magic/tools/accuracy/abu-assets.mjs'),
    path.join(root, 'games/magic/tools/accuracy/abu-assets.mjs'),
  );
  const css = await fs.readFile(path.join(root, 'games/magic/fonts.css'), 'utf8');
  const components = [...snapshot.components];
  for (const m of css.matchAll(/url\('([^']+)'\)/g)) {
    if (!components.some((c) => c.url === m[1]))
      components.push(await cachedFetch(m[1], { offline: true }));
  }
  const s = await openBrowser({ ...snapshot, components }, { sourceRoot: root });
  try {
    const eager = await fs.access(path.join(root, 'games/magic/src/data/eager.ts')).then(
      () => true,
      () => false,
    );
    const records = await s.page.evaluate(
      async ({ entries, live, names, eager }) => {
        if (eager) {
          await import('/games/magic/src/data/eager.ts');
          await import('/games/magic/src/data/eager-wording.ts');
        }
        const assets = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { loadRetroFont } = await import('/games/magic/src/presentation/retro-font.ts');
        await assets.loadCanvasFonts();
        await loadRetroFont();
        const { retroTextLayout } = await import('/games/magic/src/presentation/retro-rules.ts');
        const { withCardWording } = await import('/games/magic/src/presentation/wording.ts');
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const { rulesLayoutRequest } = await import(
          '/games/magic/src/presentation/rules-layout.ts'
        );
        const ctx = document.createElement('canvas').getContext('2d');
        const rows = [];
        for (const e of entries) {
          const data = live[e.id];
          const original = data ? { ...data.original, illustration: e.face.illustration } : e.face;
          const oracle = data?.oracle ?? original;
          const wordings = { original, oracle };
          const variants = {};
          for (const alignment of data ? ['original', 'oracle', 'left'] : ['original', 'left']) {
            const face = withCardWording(
              { ...original, colorCalibration: 'set-hsb-v1' },
              wordings,
              'original',
              { rulesAlignment: alignment, symbolStyle: 'original' },
            );
            const l = retroTextLayout(ctx, face);
            const request = l && rulesLayoutRequest(l);
            const v = {
              size: l?.size ?? null,
              horizontalScale: l?.horizontalScale ?? 1,
              top: l?.top ?? null,
              width: l?.width ?? null,
              request: request ? { bounds: request.bounds, typography: request.typography } : null,
              lines:
                l?.lines.map((line) => ({
                  text: line.runs?.map((r) => r.text ?? r.token ?? '').join('') ?? '',
                  x: line.x,
                  baseline: line.baseline,
                  inkBounds: line.inkBounds,
                })) ?? [],
            };
            if (names.includes(e.name) && alignment !== 'left') {
              const c = await composeCardTexture(
                { face, printingId: e.id, printedImage: null },
                'inspect',
                new AbortController().signal,
                {
                  loadImages: (urls, signal) => loadAccuracyImages(urls, signal, face.illustration),
                },
              );
              v.image = c.toDataURL().split(',')[1];
              c.width = c.height = 0;
            }
            variants[alignment] = v;
          }
          rows.push({
            id: e.id,
            name: e.name,
            originalCharacters: original.rulesText?.length,
            oracleCharacters: oracle.rulesText?.length,
            variants,
          });
        }
        return {
          rows,
          fonts: [...document.fonts].map((f) => ({
            family: f.family,
            style: f.style,
            status: f.status,
          })),
        };
      },
      { entries: snapshot.entries, live, names, eager },
    );
    if (s.faults.length) throw Error(s.faults.join('\n'));
    await fs.mkdir(path.join(out, version), { recursive: true });
    for (const row of records.rows)
      for (const [a, v] of Object.entries(row.variants))
        if (v.image) {
          const b = Buffer.from(v.image, 'base64');
          await fs.writeFile(path.join(out, version, row.id + '-' + a + '.png'), b);
          v.imageHash = hash(b);
          delete v.image;
        }
    const report = {
      scope:
        'Original-reference layouts for every input; historical Oracle-reference controls only for exact supplied printing pairs.',
      inputHash: hash(inputBytes),
      pairedWordingsHash: hash(pairedBytes),
      sourceArchiveHash: hash(archive),
      fontsCssHash: hash(css),
      version,
      commit: execFileSync('git', ['rev-parse', 'v' + version], {
        cwd: repo,
        encoding: 'utf8',
      }).trim(),
      browser: s.browser.version(),
      ...records,
    };
    await fs.writeFile(path.join(out, version, 'report.json'), JSON.stringify(report, null, 2));
    reports.push(report);
    console.log(
      version,
      records.rows.length,
      JSON.stringify(
        records.rows
          .filter((r) =>
            ['Animate Dead', 'Warp Artifact', 'Air Elemental', 'Serra Angel'].includes(r.name),
          )
          .map((r) => ({
            name: r.name,
            sizes: Object.fromEntries(Object.entries(r.variants).map(([a, v]) => [a, v.size])),
          })),
      ),
    );
  } finally {
    await s.close();
  }
}
await fs.writeFile(path.join(out, 'report.json'), JSON.stringify({ versions: reports }, null, 2));
