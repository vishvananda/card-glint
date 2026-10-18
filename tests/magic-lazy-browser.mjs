import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
const server = createServer(async (req, res) => {
  try {
    if (req.url === '/') {
      res.setHeader('Content-Type', 'text/html');
      res.end('<!doctype html><title>Set loading probe</title>');
      return;
    }
    if (!/^\/[a-zA-Z0-9_.-]+\.js$/.test(req.url)) {
      res.writeHead(404).end();
      return;
    }
    const body = await readFile('dist/lib' + req.url);
    res.setHeader('Content-Type', 'text/javascript');
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();
const rows = [];
try {
  const page = await browser.newPage();
  const responses = [];
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('response', (r) => {
    if (r.url().endsWith('.js'))
      responses.push(r.text().then((text) => ({ url: r.url().slice(origin.length), text })));
  });
  await page.goto(origin);
  const snapshot = async (label) => {
    const loaded = await Promise.all(responses);
    rows.push({
      label,
      requests: loaded.length,
      bytes: loaded.reduce((n, r) => n + Buffer.byteLength(r.text), 0),
      calibrationChunks: loaded
        .filter((r) => /kind:\s*"calibration"/.test(r.text))
        .map((r) => r.url),
      wordingChunks: loaded.filter((r) => /kind:\s*"wording"/.test(r.text)).map((r) => r.url),
    });
    return rows.at(-1);
  };
  assert.deepEqual(
    await page.evaluate(async () => {
      const m = await import('/magic-lazy.js');
      return m.loadedMagicSets();
    }),
    [],
  );
  let row = await snapshot('import');
  assert.equal(row.calibrationChunks.length, 0);
  assert.equal(row.wordingChunks.length, 0);
  assert.deepEqual(
    await page.evaluate(async () => {
      const m = await import('/magic-lazy.js');
      await Promise.all([m.loadMagicSet('4ed'), m.loadMagicSet('4ED')]);
      return m.loadedMagicSets();
    }),
    ['4ed'],
  );
  row = await snapshot('one set');
  assert.equal(row.calibrationChunks.length, 1);
  assert.equal(row.wordingChunks.length, 0);
  const requests = row.requests;
  await page.evaluate(async () => {
    const m = await import('/magic-lazy.js');
    await m.loadMagicSet('4ed');
  });
  assert.equal((await snapshot('cached set')).requests, requests);
  const evidence = JSON.parse(
    await readFile('games/magic/fixtures/accuracy/printing-review-catalog.json'),
  );
  const id = Object.keys(evidence.wording).find((id) => evidence.sets[id] === 'leb');
  const result = await page.evaluate(async (id) => {
    const m = await import('/magic-printing.js');
    return m.resolveSetPrintingWording('leb', id, {
      oracle: { typeLine: 'Artifact', rulesText: 'Oracle' },
      original: { typeLine: 'Artifact', rulesText: 'Original' },
    });
  }, id);
  assert.equal(result.provenance.status, 'applied');
  row = await snapshot('separate wording');
  assert.equal(row.calibrationChunks.length, 1);
  assert.equal(row.wordingChunks.length, 1);
  await page.evaluate(async () => {
    const m = await import('/magic-lazy.js');
    await m.prepareMagicCards([{ name: 'Probe', setCode: 'neo', calibration: 'auto' }]);
  });
  row = await snapshot('explicit modern donor');
  assert.equal(row.calibrationChunks.length, 3);
  assert.equal(row.wordingChunks.length, 1);
  assert.deepEqual(errors, []);
  // Failure must not install a partial set or silently paint uncalibrated output.
  await page.route(/\/lea-[^/]+\.js$/, (route) => route.abort('failed'));
  const failed = await page.evaluate(async () => {
    const m = await import('/magic-lazy.js');
    try {
      await m.loadMagicSet('lea');
      return { rejected: false };
    } catch {
      return { rejected: true, loaded: m.loadedMagicSets() };
    }
  });
  assert.equal(failed.rejected, true);
  assert.ok(!failed.loaded.includes('lea'));
  await writeFile(
    'evidence/magic-lazy-network.json',
    JSON.stringify(
      {
        schema: 1,
        scope: 'Fresh Chromium document; real ES-module requests, no image/font downloads.',
        rows,
        failureRejected: true,
      },
      null,
      2,
    ) + '\n',
  );
  console.log(
    'Browser set loading: zero initial payloads, one calibration chunk per set, separate wording, request coalescing, cache reuse, donor defaults and failure isolation passed.',
  );
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
