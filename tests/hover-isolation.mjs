import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
try {
  async function sample(finish, hovered) {
    const page = await browser.newPage({ viewport: { width: 1400, height: 1100 } });
    await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
    await page.clock.pauseAt(new Date('2026-01-01T00:00:01Z'));
    await page.goto(process.env.LAB_URL ?? 'http://127.0.0.1:4283/card-glint/');
    await page.evaluate(async (value) => {
      await window.lab.ready;
      const select = document.querySelector('#finish');
      select.value = value;
      select.dispatchEvent(new Event('change'));
    }, finish);
    const rect = await page.locator('#scene').boundingBox();
    if (hovered) await page.mouse.move(rect.x + rect.width / 10, rect.y + rect.height * 0.3);
    const snapshots = [];
    for (const duration of [600, 200]) {
      await page.evaluate(() => window.lab.pause(false));
      await page.clock.runFor(duration);
      const state = await page.evaluate(() => {
        window.lab.pause();
        return {
          ...window.lab.motionState(),
          normals: window.lab.instances().map((i) => i.normal),
        };
      });
      const pixels = [];
      for (let index = 0; index < 3; index++) {
        pixels.push(
          await page.screenshot({
            clip: {
              x: Math.ceil(rect.x + (rect.width * index) / 3),
              y: Math.ceil(rect.y),
              width: Math.floor(rect.width / 3),
              height: Math.floor(rect.height),
            },
          }),
        );
      }
      snapshots.push({ state, pixels });
    }
    await page.close();
    return snapshots;
  }
  for (const finish of ['opal', 'surfaces']) {
    const idle = await sample(finish, false),
      hover = await sample(finish, true);
    for (let frame = 0; frame < idle.length; frame++) {
      assert.equal(hover[frame].state.hover?.instance, 1);
      assert.equal(
        hover[frame].state.time,
        idle[frame].state.time,
        'Compare identical animation times',
      );
      assert.notDeepEqual(hover[frame].state.normals[0], idle[frame].state.normals[0]);
      assert.ok(!hover[frame].pixels[0].equals(idle[frame].pixels[0]), 'Hovered card must respond');
      for (let card = 1; card < 3; card++) {
        assert.deepEqual(hover[frame].state.normals[card], idle[frame].state.normals[card]);
        assert.ok(
          hover[frame].pixels[card].equals(idle[frame].pixels[card]),
          `${finish}: hover changed card ${card + 1}'s foil`,
        );
      }
    }
    assert.ok(!hover[0].pixels[1].equals(hover[1].pixels[1]), 'Other cards must keep animating');
    console.log(`${finish}: only hovered card responds; neighbors retain independent idle pixels.`);
  }
} finally {
  await browser.close();
}
