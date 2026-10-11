import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import os from 'node:os';
import { chromium } from 'playwright';
const manifest = JSON.parse(await readFile('dist/releases/release.json', 'utf8'));
for (const file of manifest.files) {
  const data = await readFile(path.join('dist/releases', file.name));
  assert.equal(data.length, file.bytes);
  assert.equal(createHash('sha256').update(data).digest('hex'), file.sha256);
}
const temporary = await mkdtemp(path.join(os.tmpdir(), 'card-glint-release-'));
const archive = manifest.files.find((file) => file.name.endsWith('.zip'));
execFileSync('unzip', ['-q', path.resolve('dist/releases', archive.name), '-d', temporary]);
const root = path.join(temporary, archive.name.slice(0, -4));
const types = {
  '.js': 'text/javascript',
  '.wasm': 'application/wasm',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.html': 'text/html',
  '.css': 'text/css',
};
const server = createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, 'http://localhost').pathname;
    if (!pathname.startsWith('/library/')) throw Error('Outside release');
    const relative = decodeURIComponent(pathname.slice('/library/'.length)) || 'index.html';
    const file = path.resolve(root, relative);
    if (!file.startsWith(root + '/')) throw Error('Outside release');
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    res.end(await readFile(file));
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({ args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
  const page = await browser.newPage();
  const origin = `http://127.0.0.1:${server.address().port}`,
    errors = [],
    requests = [],
    failures = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  page.on('request', (request) => requests.push(request.url()));
  page.on('response', (response) => {
    if (!response.ok()) failures.push(response.url());
  });
  await page.goto(origin + '/library/');
  const metrics = await page.evaluate(async () => await window.exampleReady);
  assert.equal(metrics.draws, 1);
  assert.equal(metrics.visible, 1);
  assert.deepEqual(errors, []);
  assert.deepEqual(failures, []);
  assert.ok(requests.some((url) => url.endsWith('/renderer_bg.wasm')));
  assert.ok(
    requests.every((url) => {
      const parsed = new URL(url);
      return (
        parsed.origin === origin &&
        (parsed.protocol === 'blob:' || parsed.pathname.startsWith('/library/'))
      );
    }),
    JSON.stringify(requests),
  );
  console.log(
    'Release hashes and extracted browser archive passed: JS, WASM and original art work under a nested URL without a bundler.',
  );
  const magicPage = await browser.newPage();
  await magicPage.route('https://**/*', (route) => {
    const font = /\.(?:ttf|woff2?)(?:\?|$)/.test(route.request().url());
    return route.fulfill({
      status: font ? 404 : 200,
      contentType: font ? 'text/plain' : 'image/svg+xml',
      body: font
        ? ''
        : '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#526675" fill-opacity=".1"/></svg>',
    });
  });
  await magicPage.goto(origin + '/library/magic.html');
  await magicPage.waitForFunction(
    () => document.querySelector('#status').textContent.startsWith('Ready.'),
    null,
    { timeout: 30000 },
  );
  await magicPage.locator('#finish').selectOption('opal');
  assert.ok(
    await magicPage.locator('#card').evaluate((canvas) => canvas.toDataURL().length > 10000),
  );
  await magicPage.close();
  console.log(
    'Optional Magic browser example renders and changes finish with synthetic external-frame fixtures.',
  );
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
  await rm(temporary, { recursive: true, force: true });
}
