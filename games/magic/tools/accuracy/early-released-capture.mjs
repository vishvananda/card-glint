// Capture checksum-verified released browser bytes against frozen Original inputs.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { root, hash, sourceHash } from './common.mjs';
import { openBrowser } from './browser.mjs';
const [inputFile, posesFile, archiveFile, releaseMetadataFile, out] = process.argv.slice(2);
assert(out, 'Usage: early-released-capture.mjs INPUTS POSES BROWSER_ZIP RELEASE_METADATA OUT');
const metadataBytes = await readFile(releaseMetadataFile),
  version = JSON.parse(metadataBytes);
assert(/^\d+\.\d+\.\d+$/.test(version.version), 'Expected a stable release');
assert(/^[a-f0-9]{40}$/.test(version.sourceCommit), 'Missing source commit');
const archive = await readFile(archiveFile),
  expected = version.files.find((f) => f.name === 'card-glint-' + version.version + '-browser.zip');
assert(expected, 'Browser archive absent from release metadata');
assert.equal(archive.length, expected.bytes);
assert.equal(hash(archive), expected.sha256, 'Browser archive checksum mismatch');
let bundleRoot;
const ib = await readFile(inputFile),
  inputs = JSON.parse(ib),
  pb = await readFile(posesFile),
  poses = JSON.parse(pb);
const gameHash = await sourceHash(path.join(root, 'games/magic/src'));
assert.equal(gameHash, inputs.rendererHash);
assert.equal(hash(ib), poses.inputHash);
assert(
  inputs.entries.every((e) => e.face.wordingMode === 'original'),
  'Original wording is required',
);
assert.equal(inputs.unavailable.length, 0);
assert.equal(inputs.unresolved.length, 0);
assert.equal(poses.rows.length, inputs.entries.length);

const plugins = [
  {
    name: 'checked-released-magic-bundle',
    configureServer(s) {
      s.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/__baseline_bundle/')) return next();
        const name = req.url.slice('/__baseline_bundle/'.length).split('?')[0];
        if (!/^[A-Za-z0-9_.-]+$/.test(name)) {
          res.writeHead(400).end();
          return;
        }
        try {
          const bytes = await readFile(path.join(bundleRoot, name));
          res.setHeader(
            'Content-Type',
            name.endsWith('.js')
              ? 'text/javascript'
              : name.endsWith('.css')
                ? 'text/css'
                : 'application/wasm',
          );
          res.end(bytes);
        } catch (e) {
          res.writeHead(404).end(String(e));
        }
      });
    },
  },
];
await mkdir(out, { recursive: true });
let session;
const rows = [];
const temporary = await mkdtemp(path.join(tmpdir(), 'glint-released-capture-'));
try {
  const files = execFileSync('unzip', ['-Z1', path.resolve(archiveFile)], { encoding: 'utf8' })
    .trim()
    .split('\n');
  assert(
    files.every((f) => !f.startsWith('/') && !f.split('/').includes('..')),
    'Unsafe archive path',
  );
  execFileSync('unzip', ['-q', path.resolve(archiveFile), '-d', temporary]);
  bundleRoot = path.join(temporary, 'card-glint-' + version.version + '-browser');
  await readFile(path.join(bundleRoot, 'magic-presentation.js'));

  session = await openBrowser(inputs, { plugins, fonts: false });
  await session.page.addStyleTag({ url: '/__baseline_bundle/magic.css' });
  for (const e of inputs.entries) {
    const pose = poses.rows.find((p) => p.id === e.id);
    assert(pose);
    assert.equal(pose.referenceHash, e.reference.sha256);
    const file = path.join(out, e.id + '.png');
    const result = await session.page.evaluate(
      async ({ face, id }) => {
        const api = await import('/__baseline_bundle/magic-presentation.js');
        const signal = new AbortController().signal;
        // The archived release owns decoding, fonts and material preparation.
        // The source checkout only supplies the immutable HTTP allowlist.
        const c = await api.composeCardTexture(
          { face, printingId: id, printedImage: null },
          'inspect',
          signal,
        );
        try {
          return { png: c.toDataURL().split(',')[1], width: c.width, height: c.height };
        } finally {
          c.width = c.height = 0;
        }
      },
      { face: e.face, id: e.id },
    );
    const bytes = Buffer.from(result.png, 'base64');
    await writeFile(file, bytes);
    rows.push({
      id: e.id,
      set: e.card.set,
      name: e.name,
      material: e.material,
      inputHash: hash(JSON.stringify(e.face)),
      referenceHash: e.reference.sha256,
      artHash: e.art.sha256,
      poseHash: hash(JSON.stringify(pose.transform)),
      poseAccepted: pose.accepted,
      sha256: hash(bytes),
      width: result.width,
      height: result.height,
    });
    if (rows.length % 20 === 0)
      console.log('Native released baseline', rows.length, '/', inputs.entries.length);
  }
  assert.deepEqual(session.faults, []);
  assert.equal(await sourceHash(path.join(root, 'games/magic/src')), gameHash);
  await writeFile(
    path.join(out, 'capture.json'),
    JSON.stringify(
      {
        schema: 1,
        complete: true,
        source: {
          release: version.version,
          releaseCommit: version.sourceCommit,
          archiveHash: hash(archive),
          releaseMetadataHash: hash(metadataBytes),
          rendererHash: gameHash,
          browserHash: await sourceHash(path.join(root, 'packages/browser/src')),
          inputHash: hash(ib),
          posesHash: hash(pb),
          toolHash: hash(await readFile(new URL(import.meta.url))),
          bundleEntryHash: hash(await readFile(path.join(bundleRoot, 'magic-presentation.js'))),
        },
        browser: session.browser.version(),
        rows,
        faults: [],
      },
      null,
      2,
    ) + '\n',
  );
  console.log('Complete released native baseline:', rows.length);
} finally {
  await session?.close();
  await rm(temporary, { recursive: true, force: true });
}
