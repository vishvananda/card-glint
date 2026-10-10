import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

const browser = await chromium.launch({ args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
try {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(process.env.LAB_URL ?? 'http://127.0.0.1:4283/card-glint/');
  await page.evaluate(async () => {
    await window.lab.ready;
  });
  // Native browser gestures exercise scroll arbitration and pointercancel;
  // dispatchEvent(new TouchEvent(...)) cannot reproduce the original bug.
  const client = await page.context().newCDPSession(page);
  const touch = (type, points = []) =>
    client.send('Input.dispatchTouchEvent', {
      type,
      touchPoints: points.map(([x, y], id) => ({ x, y, id })),
    });
  const state = () =>
    page.evaluate(() => ({
      hover: window.lab.motionState().hover,
      normals: window.lab.instances().map((item) => item.normal),
      scroll: scrollY,
    }));
  const cards = [];
  for (let index = 0; index < 3; index++) {
    await page.evaluate((i) => {
      const r = document.querySelector('#scene').getBoundingClientRect();
      window.scrollTo(0, scrollY + r.top + (r.height / 3) * (i + 0.5) - 450);
    }, index);
    const rect = await page.locator('#scene').boundingBox();
    const x = rect.x + rect.width * 0.4,
      y = rect.y + (rect.height / 3) * (index + 0.5);
    const before = await state();
    await touch('touchStart', [[x, y]]);
    const start = await state();
    assert.equal(start.hover?.instance, index + 1, 'Touch down did not pick the card');
    for (let step = 1; step <= 8; step++) {
      await touch('touchMove', [[x + step * 9, y - step * 13]]);
      await page.waitForTimeout(30);
    }
    await page.waitForTimeout(180);
    const dragged = await state();
    assert.equal(dragged.hover?.instance, index + 1);
    assert.ok(dragged.hover.uv[0] - start.hover.uv[0] > 0.15, 'Horizontal drag lost');
    assert.ok(start.hover.uv[1] - dragged.hover.uv[1] > 0.15, 'Vertical drag lost');
    assert.ok(Math.abs(dragged.normals[index][0] - start.normals[index][0]) > 0.01);
    assert.ok(Math.abs(dragged.normals[index][1] - start.normals[index][1]) > 0.01);
    assert.equal(dragged.scroll, before.scroll, 'Dragging a card scrolled the page');
    // A finger leaving the card must not grab a neighboring instance.
    await touch('touchMove', [[rect.x + 1, y - 104]]);
    assert.equal((await state()).hover?.instance, index + 1);
    await touch(index === 1 ? 'touchCancel' : 'touchEnd');
    const released = await state();
    assert.equal(released.hover, undefined, 'Release/cancel left the card stuck');
    await page.waitForTimeout(250);
    const idle = await state();
    assert.notDeepEqual(idle.normals[index], released.normals[index], 'Idle motion did not resume');
    cards.push({ instance: index + 1, start, dragged, released });
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  const rect = await page.locator('#scene').boundingBox();
  const x = rect.x + rect.width / 2,
    y = rect.y + 240;
  await touch('touchStart', [[x, y]]);
  await touch('touchStart', [
    [x, y],
    [x + 35, y + 35],
  ]);
  assert.equal((await state()).hover, undefined, 'Multiple fingers must release card ownership');
  await touch('touchEnd');

  const scrollFromGap = async (x, y, endX = x) => {
    const before = await state();
    await touch('touchStart', [[x, y]]);
    assert.equal((await state()).hover, undefined, 'Empty space captured a touch');
    for (let step = 1; step <= 8; step++) {
      await touch('touchMove', [[x + ((endX - x) * step) / 8, y - step * 16]]);
      await page.waitForTimeout(30);
    }
    await touch('touchEnd');
    const after = await state();
    assert.ok(after.scroll > before.scroll + 30, 'Swipe on empty canvas did not scroll');
    assert.equal(after.hover, undefined, 'Scrolling across a card captured it mid-gesture');
    return { before: before.scroll, after: after.scroll };
  };
  const gutterScroll = await scrollFromGap(rect.x + 1, y, rect.x + 60);
  await page.evaluate(() => window.scrollTo(0, 160));
  const gapRect = await page.locator('#scene').boundingBox();
  const betweenScroll = await scrollFromGap(x, gapRect.y + gapRect.height / 3);
  assert.deepEqual(errors, []);
  await writeFile(
    'evidence/touch.json',
    JSON.stringify(
      {
        cards,
        gutterScroll,
        betweenScroll,
        errors,
        scope: 'Chromium native touch emulation, not a physical iPhone test',
      },
      null,
      2,
    ) + '\n',
  );
  console.log('Touch tilt, two-axis drag, release/cancel, multi-touch and gap scrolling passed.');
} finally {
  await browser.close();
}
