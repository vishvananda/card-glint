import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const url = process.env.LAB_URL ?? 'http://127.0.0.1:4283/card-glint/';
const browser = await chromium.launch({
  headless: true,
  // Force the software backend: allowing fallback alone still selects flaky host drivers.
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});
try {
  const page = await browser.newPage({
    viewport: { width: 1400, height: 1100 },
    deviceScaleFactor: 1,
  });
  const external = [],
    errors = [],
    requests = [];
  page.on('request', (r) => {
    requests.push(r.url());
    if (new URL(r.url()).origin !== new URL(url).origin) external.push(r.url());
  });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(url);
  await page.evaluate(async () => {
    await window.lab.ready;
    window.lab.pause();
  });
  assert.deepEqual(external, [], 'Showcase fetched external assets');
  assert.deepEqual(errors, []);
  assert.equal(await page.locator('#finish').inputValue(), 'mixed');
  assert.deepEqual(
    await page.evaluate(() => window.lab.instances().map((instance) => instance.finish)),
    ['etched', 'cold', 'opal'],
    'Showcase opens with classic foils',
  );
  await mkdir('docs/images', { recursive: true });
  await page.locator('#scene').screenshot({ path: 'docs/images/showcase.png' });
  await writeFile(
    'evidence/showcase.json',
    JSON.stringify(
      {
        externalRequests: external,
        errors,
        localRequests: requests.map((s) => new URL(s).pathname),
        art: 'Original AI-generated fantasy WebP; prompts and provenance included; repository licensed',
        fonts: 'System fonts; no font download',
      },
      null,
      2,
    ) + '\n',
  );
  console.log('Showcase uses only local original assets; README image captured.');
} finally {
  await browser.close();
}
