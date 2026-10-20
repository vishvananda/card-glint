// Current native replays of frozen ABU original-printing inputs. External pixels
// remain in OUT; this tool never downloads or changes comparison poses.
import assert from 'node:assert/strict';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { gunzipSync } from 'node:zlib';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { createServer } from 'vite';
import { root, hash, sourceHash, objectFile, writeJson } from './common.mjs';
import { cachedFetch } from './cache.mjs';
import { openBrowser } from './browser.mjs';
import { inverseScanMatrix } from './scan-transform.mjs';
const [out, scope = 'duals', sets = 'lea,leb', variant = 'current'] = process.argv.slice(2);
assert(
  out && ['duals', 'headings', 'all'].includes(scope),
  'Usage: abu-reviewed-replay.mjs OUT [duals|headings|all] [lea,leb]',
);
assert(['current', 'released-headings'].includes(variant));
assert(variant === 'current' || sets === 'lea', 'Released-heading control applies to Alpha only');
const entries = [],
  inputs = [];
for (const set of sets.split(',')) {
  assert(['lea', 'leb'].includes(set));
  const dir = path.join(root, 'games/magic/fixtures/accuracy/abu-054');
  const raw = gunzipSync(await readFile(path.join(dir, set + '-inputs.json.gz')));
  const input = JSON.parse(raw),
    poseBytes = gunzipSync(await readFile(path.join(dir, set + '-normalization.json.gz'))),
    poses = JSON.parse(poseBytes);
  assert.equal(hash(raw), poses.inputHash);
  inputs.push({ set, inputHash: hash(raw), poseHash: hash(poseBytes) });
  for (const e of input.entries) {
    const p = poses.rows.find((p) => p.id === e.id);
    assert(p && p.referenceHash === e.reference.sha256);
    assert.equal(e.face.wordingMode, 'original');
    if (
      scope === 'duals' &&
      !(
        e.face.landColors?.length === 2 ||
        (/Land/.test(e.card.type_line) &&
          !e.card.type_line.includes('Basic') &&
          [
            'Badlands',
            'Bayou',
            'Plateau',
            'Savannah',
            'Scrubland',
            'Taiga',
            'Tropical Island',
            'Tundra',
            'Underground Sea',
            'Volcanic Island',
          ].includes(e.name ?? e.card.name))
      )
    )
      continue;
    entries.push({ ...e, name: e.card.name, set, pose: p });
  }
}
assert(entries.length);
const ssr = await createServer({
    configFile: false,
    root,
    server: { middlewareMode: true, hmr: false },
  }),
  components = [];
try {
  await ssr.ssrLoadModule('/games/magic/src/data/eager.ts');
  await ssr.ssrLoadModule('/games/magic/src/data/eager-wording.ts');
  const { canvasAssetUrls } = await ssr.ssrLoadModule(
    '/games/magic/src/presentation/canvas-assets.ts',
  );
  const { RETRO_FONT, RETRO_SYMBOL_FONT } = await ssr.ssrLoadModule(
    '/games/magic/src/presentation/retro-frame.ts',
  );
  const { resolvePrintingWording, resolvePrintingArtist, withCardWording } =
    await ssr.ssrLoadModule('/games/magic/src/index.ts');
  for (const e of entries) {
    const f = e.face,
      pars = f.rulesParagraphs ?? [],
      text = (role) =>
        pars
          .filter((p) => p.role === role)
          .map((p) => p.runs.map((r) => r.text).join(''))
          .join('\n');
    const original = {
      name: f.name,
      typeLine: f.typeLine,
      rulesText: text('rules'),
      flavorText: text('flavor'),
      rulesParagraphs: pars,
      manaSymbols: f.manaSymbols,
      power: f.power,
      toughness: f.toughness,
    };
    const wording = resolvePrintingWording(
      e.id,
      { original, oracle: { typeLine: e.card.type_line, rulesText: e.card.oracle_text ?? '' } },
      { referenceSha256: e.reference.sha256 },
    );
    const artist = resolvePrintingArtist(e.id, f.artist, { referenceSha256: e.reference.sha256 });
    assert.notEqual(wording.provenance.status, 'reference-mismatch');
    assert.notEqual(artist.provenance.status, 'reference-mismatch');
    const selected = { ...f, ...wording.wordings.original, artist: artist.artist };
    e.face = withCardWording(
      selected,
      {
        original: selected,
        oracle: { typeLine: e.card.type_line, rulesText: e.card.oracle_text ?? '' },
      },
      'original',
      {
        rulesAlignment: f.rulesAlignment?.mode === 'left' ? 'left' : 'original',
        symbolStyle: 'original',
      },
    );
    if (f.rulesAlignment?.mode === 'auto')
      e.face.rulesAlignment = { mode: 'auto', reference: e.face.rulesParagraphs };
    e.correctionEvidence = { wording: wording.provenance, artist: artist.provenance };
    if (variant === 'released-headings') {
      const { createSetCalibrationCandidate, describeSetCalibration } = await ssr.ssrLoadModule(
        '/games/magic/src/calibration/editor.ts',
      );
      e.face.setCalibrationCandidate = createSetCalibrationCandidate(
        'lea',
        describeSetCalibration('lea').revision,
        Object.fromEntries(
          ['title', 'type'].flatMap((role) =>
            Object.entries({
              dx: 0,
              dy: 0,
              size: role === 'title' ? 27.8 : 22.2,
              width: 1,
              wordSpacing: 0,
              gray: 130,
              shadow: 1,
            }).map(([k, v]) => [role + '.' + k, v]),
          ),
        ),
      );
    }
  }
  const css = await readFile(path.join(root, 'games/magic/fonts.css'), 'utf8');
  const urls = new Set(
    [...css.matchAll(/url\('([^']+)'\)/g)]
      .map((m) => m[1])
      .concat(RETRO_FONT, RETRO_SYMBOL_FONT, ...entries.flatMap((e) => canvasAssetUrls(e.face)))
      .filter((u) => u?.startsWith('https:')),
  );
  for (const url of urls) components.push(await cachedFetch(url, { offline: true }));
} finally {
  await ssr.close();
}
await mkdir(out, { recursive: true });
const source = {
  schema: 1,
  version: JSON.parse(await readFile(path.join(root, 'package.json'))).version,
  commit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  rendererHash: await sourceHash(path.join(root, 'games/magic/src')),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  scope,
  variant,
  inputs,
  components: components.map((c) => [c.url, c.sha256]),
  count: entries.length,
  comparison:
    'Frozen independent scan affine poses; raw scan sampled once at native 732x1020; rejected poses retained but excluded from aggregate. Heading controls execute the real painter, changing only fill color and shadow for the selected slot. No cloned Canvas spacing state.',
};
await writeJson(path.join(out, 'inputs.json'), { source, entries, components });
const session = await openBrowser(
  { entries, components },
  {
    plugins: [
      {
        name: 'observe-native-retro-slots',
        enforce: 'pre',
        transform(code, id) {
          if (!id.endsWith('/retro-paint.ts')) return;
          const title = "  c.save();\n  c.translate(...titleTranslation(face, 'retro'));";
          const titleEnd = '  c.restore();\n  const modernSymbols =';
          const type = '  c.save();\n  c.translate(typePlacement.dx, typePlacement.dy);';
          const typeEnd = '  const paintType ='; // remaining type scope is delimited below
          assert(code.includes(title) && code.includes(titleEnd) && code.includes(type));
          code = code
            .replace(title, "  const stopTitleProbe=probeHeading(c,'title');\n" + title)
            .replace(titleEnd, '  stopTitleProbe();\n' + titleEnd);
          code = code.replace(type, "  const stopTypeProbe=probeHeading(c,'type');\n" + type);
          const start = code.indexOf('  const stopTypeProbe=');
          const end = code.indexOf('  c.restore();', start);
          assert(end > start);
          code = code.slice(0, end) + '  stopTypeProbe();\n' + code.slice(end);
          return (
            code +
            `\nfunction probeHeading(c:CanvasContext,role:string){
 const probe=(globalThis as any).__abuProbe;if(!probe||probe.role!==role)return()=>{};
 const fill=c.fillText;c.fillText=function(...args:Parameters<CanvasContext['fillText']>){c.save();try{c.fillStyle=probe.color;c.shadowColor='transparent';fill.call(c,...args);}finally{c.restore();}};
 return()=>{c.fillText=fill;};
}\n`
          );
        },
      },
    ],
  },
);
const rows = [];
let previous;
try {
  previous = JSON.parse(await readFile(path.join(out, 'capture.json')));
} catch (e) {
  if (e.code !== 'ENOENT') throw e;
}
if (previous)
  for (const key of [
    'version',
    'commit',
    'rendererHash',
    'toolHash',
    'scope',
    'variant',
    'inputs',
    'components',
    'count',
  ])
    assert.deepEqual(previous.source[key], source[key], 'Stale replay: ' + key);
await writeFile(path.join(out, 'capture-tool.mjs'), await readFile(new URL(import.meta.url)));
try {
  source.browser = session.browser.version();
  await writeJson(path.join(out, 'source.json'), source);
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
    globalThis.__abuLoader = await import('/games/magic/tools/accuracy/abu-assets.mjs');
    globalThis.__abuCompose = (
      await import('/games/magic/src/presentation/canvas-face.ts')
    ).composeCardTexture;
  });
  for (const e of entries) {
    const dir = path.join(out, e.set);
    await mkdir(dir, { recursive: true });
    const cached = previous?.rows.find((r) => r.id === e.id);
    if (cached) {
      assert.equal(hash(await readFile(path.join(dir, e.id + '.png'))), cached.renderHash);
      assert.equal(hash(await readFile(path.join(dir, e.id + '-scan.png'))), cached.scanHash);
      for (const [role, proof] of Object.entries(cached.controls))
        assert.equal(
          hash(await readFile(path.join(dir, e.id + '-' + role + '.png'))),
          proof.sha256,
        );
      rows.push(cached);
      continue;
    }
    const result = await session.page.evaluate(
      async ({ e, headings }) => {
        const lease = await globalThis.__abuLoader.loadAccuracyImages(
          (await import('/games/magic/src/presentation/canvas-assets.ts')).canvasAssetUrls(e.face),
          new AbortController().signal,
          e.face.illustration,
        );
        const hooks = { loadImages: async () => ({ ...lease, dispose() {} }) };
        const render = async (probe) => {
          globalThis.__abuProbe = probe;
          const c = await globalThis.__abuCompose(
            { face: e.face, printingId: e.id, printedImage: null },
            'inspect',
            new AbortController().signal,
            hooks,
          );
          try {
            return c.toDataURL().split(',')[1];
          } finally {
            c.width = c.height = 0;
          }
        };
        try {
          const full = await render(null),
            controls = {};
          if (headings)
            for (const role of ['title', 'type'])
              controls[role] = {
                black: await render({ role, color: '#000' }),
                white: await render({ role, color: '#fff' }),
              };
          return { full, controls };
        } finally {
          delete globalThis.__abuProbe;
          lease.dispose();
        }
      },
      { e, headings: scope !== 'duals' && variant === 'current' },
    );
    const bytes = Buffer.from(result.full, 'base64');
    await writeFile(path.join(dir, e.id + '.png'), bytes);
    const full = PNG.sync.read(bytes);
    assert.equal(full.width, 732);
    assert.equal(full.height, 1020);
    const controls = {};
    for (const [role, c] of Object.entries(result.controls)) {
      const b = PNG.sync.read(Buffer.from(c.black, 'base64')),
        w = PNG.sync.read(Buffer.from(c.white, 'base64')),
        mask = new PNG({ width: 732, height: 1020 });
      let count = 0,
        outside = 0;
      for (let i = 0; i < mask.data.length; i += 4) {
        const v = Math.max(
          0,
          Math.round(
            (w.data[i] -
              b.data[i] +
              (w.data[i + 1] - b.data[i + 1]) +
              (w.data[i + 2] - b.data[i + 2])) /
              3,
          ),
        );
        mask.data[i] = mask.data[i + 1] = mask.data[i + 2] = 0;
        mask.data[i + 3] = v;
        if (v) {
          count++;
          const y = Math.floor(i / 4 / 732) / 1.5;
          if (y < (role === 'title' ? 20 : 350) || y > (role === 'title' ? 78 : 408)) outside++;
        }
      }
      assert(count > 10, role + ' probe missing');
      assert.equal(outside, 0, role + ' probe escaped slot');
      const mb = PNG.sync.write(mask);
      await writeFile(path.join(dir, e.id + '-' + role + '.png'), mb);
      controls[role] = { sha256: hash(mb), pixels: count, outside };
    }
    const rb = await readFile(objectFile(e.reference));
    assert.equal(hash(rb), e.reference.sha256);
    const raw = PNG.sync.read(rb),
      w = 732,
      h = 1020,
      s = 1.5,
      f = Math.min(488 / raw.width, 680 / raw.height),
      px = (488 - raw.width * f) / 2,
      py = (680 - raw.height * f) / 2,
      m = inverseScanMatrix(e.pose.transform),
      scan = new PNG({ width: w, height: h });
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const cx = (x + 0.5) / s - 0.5 - 244,
          cy = (y + 0.5) / s - 0.5 - 340;
        const sx = (m[0] * cx + m[2] * cy + m[4] + 244 - px + 0.5) / f - 0.5,
          sy = (m[1] * cx + m[3] * cy + m[5] + 340 - py + 0.5) / f - 0.5;
        if (sx < 0 || sy < 0 || sx > raw.width - 1 || sy > raw.height - 1) continue;
        const l = Math.floor(sx),
          t = Math.floor(sy),
          r = Math.min(l + 1, raw.width - 1),
          b = Math.min(t + 1, raw.height - 1),
          fx = sx - l,
          fy = sy - t,
          o = (y * w + x) * 4;
        for (let c = 0; c < 4; c++)
          scan.data[o + c] = Math.round(
            (raw.data[(t * raw.width + l) * 4 + c] * (1 - fx) +
              raw.data[(t * raw.width + r) * 4 + c] * fx) *
              (1 - fy) +
              (raw.data[(b * raw.width + l) * 4 + c] * (1 - fx) +
                raw.data[(b * raw.width + r) * 4 + c] * fx) *
                fy,
          );
      }
    const sb = PNG.sync.write(scan);
    await writeFile(path.join(dir, e.id + '-scan.png'), sb);
    rows.push({
      id: e.id,
      set: e.set,
      name: e.name,
      accepted: e.pose.accepted,
      renderHash: hash(bytes),
      scanHash: hash(sb),
      referenceHash: e.reference.sha256,
      poseHash: hash(JSON.stringify(e.pose.transform)),
      controls,
    });
    await writeJson(path.join(out, 'capture.json'), { source, rows });
    console.log(e.set, rows.length + '/' + entries.length, e.name);
  }
} finally {
  await session.close();
}
