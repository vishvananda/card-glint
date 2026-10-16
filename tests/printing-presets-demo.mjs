import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const base = process.env.LAB_URL ?? 'http://127.0.0.1:4283/card-glint/';
const browser = await chromium.launch({
  headless: true,
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});
try {
  for (const mobile of [false, true]) {
    const context = await browser.newContext({
      viewport: mobile ? { width: 390, height: 844 } : { width: 1250, height: 1100 },
      isMobile: mobile,
      hasTouch: mobile,
      deviceScaleFactor: 1,
      acceptDownloads: true,
    });
    const page = await context.newPage(),
      errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(new URL('presets/printing-presets.html', base).href);
    const status = page.locator('#status');
    await status.filter({ hasText: 'Preview: Core Set 2021' }).waitFor({ timeout: 120000 });
    const preset = (id) => page.locator(`[data-preset="${id}"]`);
    if (!mobile) {
      await preset('lea').hover();
      await status.filter({ hasText: /^Preview: Alpha$/ }).waitFor({ timeout: 120000 });
      assert.equal(
        await preset('m21').getAttribute('aria-pressed'),
        'true',
        'Hover must not commit',
      );
      await page.locator('h1').hover();
      await status.filter({ hasText: 'Preview: Core Set 2021' }).waitFor({ timeout: 120000 });
      await preset('fut').focus();
      await status.filter({ hasText: 'Preview: Future Sight' }).waitFor({ timeout: 120000 });
    }
    if (!mobile) {
      for (const button of await page.locator('[data-preset]').all()) {
        const label = await button.textContent();
        await button.click();
        await status.filter({ hasText: 'Preview: ' + label }).waitFor({ timeout: 120000 });
      }
    }
    await preset('plc-colorshifted').click();
    await status
      .filter({ hasText: 'Preview: Planar Chaos · Colorshifted' })
      .waitFor({ timeout: 120000 });
    assert.equal(await preset('plc-colorshifted').getAttribute('aria-pressed'), 'true');
    await page.locator('summary').click();
    await page.locator('#artist').fill('Prototype Artist');
    await page.locator('#number').fill('77');
    await page.locator('#total').fill('200');
    await page.locator('#legal-visible').uncheck();
    await page.locator('#artist-y').fill('-8');
    await status
      .filter({ hasText: 'Preview: Planar Chaos · Colorshifted' })
      .waitFor({ timeout: 120000 });
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#download').click();
    const download = await downloadPromise;
    assert.equal(download.suggestedFilename(), 'printing-preset.png');
    const stream = await download.createReadStream();
    let bytes = 0;
    for await (const chunk of stream) bytes += chunk.length;
    assert.ok(bytes > 20000, 'PNG must contain a rendered card');
    await page.locator('#reset').click();
    assert.equal(await page.locator('#artist').inputValue(), '');
    assert.equal(await page.locator('#artist-y').inputValue(), '0');
    assert.equal(await page.locator('#legal-visible').isChecked(), true);
    await status
      .filter({ hasText: 'Preview: Planar Chaos · Colorshifted' })
      .waitFor({ timeout: 120000 });
    await page.locator('summary').click();
    await page.screenshot({
      path: `/tmp/glint-presets-${mobile ? 'mobile' : 'desktop'}.png`,
      fullPage: true,
    });
    assert.deepEqual(errors, []);
    await context.close();
  }
  console.log(
    'Printing preset demo: desktop hover/focus, touch click, commit/reset, details and PNG export pass in Chromium software graphics (mobile emulated).',
  );
} finally {
  await browser.close();
}
