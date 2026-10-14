import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { PNG } from 'pngjs';

function cardPixels(image, card) {
  const left = Math.floor((image.width * card) / 3),
    right = Math.floor((image.width * (card + 1)) / 3);
  return Buffer.concat(
    Array.from({ length: image.height }, (_, y) =>
      image.data.subarray((y * image.width + left) * 4, (y * image.width + right) * 4),
    ),
  );
}

const browser = await chromium.launch({
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});
try {
  async function sample(finish, hovered) {
    const page = await browser.newPage({ viewport: { width: 1400, height: 1100 } });
    // A paused wall clock can start independent documents at different RAF
    // phases. Drive the real animation callback with identical timestamps;
    // neither navigation speed nor screenshots may advance simulation time.
    await page.addInitScript(() => {
      const nativeFrame = window.requestAnimationFrame.bind(window);
      window.settleTestLayout = () =>
        new Promise((resolve) => nativeFrame(() => nativeFrame(resolve)));
      let nextId = 1;
      const callbacks = new Map();
      window.requestAnimationFrame = (callback) => {
        const id = nextId++;
        callbacks.set(id, callback);
        return id;
      };
      window.cancelAnimationFrame = (id) => callbacks.delete(id);
      window.advanceTestFrame = (time) => {
        const pending = [...callbacks.values()];
        callbacks.clear();
        for (const callback of pending) callback(time);
      };
    });
    await page.goto(process.env.LAB_URL ?? 'http://127.0.0.1:4283/card-glint/');
    await page.evaluate(async (value) => {
      const renderer = await window.lab.ready;
      // The initial ResizeObserver also renders. Let it finish before choosing
      // a stateful surface effect, then seed both runs with the same pose/time.
      // Otherwise a mouse event can give only the hovered run an extra seed.
      await window.settleTestLayout();
      const select = document.querySelector('#finish');
      select.value = value;
      select.dispatchEvent(new Event('change'));
      renderer.updateScene(window.lab.instances());
      renderer.render({
        viewProjection: window.lab.api.IDENTITY,
        time: window.lab.motionState().time,
      });
    }, finish);
    const rect = await page.locator('#scene').boundingBox();
    if (hovered) await page.mouse.move(rect.x + rect.width / 10, rect.y + rect.height * 0.3);
    const snapshots = [];
    let timestamp = 0;
    for (const duration of [600, 200]) {
      await page.evaluate(() => window.lab.pause(false));
      await page.evaluate(
        ({ start, duration }) => {
          for (let elapsed = 10; elapsed <= duration; elapsed += 10)
            window.advanceTestFrame(start + elapsed);
        },
        { start: timestamp, duration },
      );
      timestamp += duration;
      const snapshot = await page.evaluate(() => {
        window.lab.pause();
        return {
          state: {
            ...window.lab.motionState(),
            instances: window.lab.instances(),
          },
          // Read the submitted WebGL frame synchronously, without depending on
          // the compositor catching up with the manually advanced frames.
          // This readback is test-only; compare decoded pixels, not PNG bytes.
          image: document.querySelector('#scene').toDataURL('image/png'),
        };
      });
      const image = Buffer.from(snapshot.image.split(',')[1], 'base64'),
        decoded = PNG.sync.read(image);
      snapshots.push({
        state: snapshot.state,
        image,
        size: [decoded.width, decoded.height],
        pixels: [0, 1, 2].map((card) => cardPixels(decoded, card)),
      });
    }
    await page.close();
    return snapshots;
  }
  for (const finish of ['opal', 'surfaces']) {
    const idle = await sample(finish, false),
      hover = await sample(finish, true);
    try {
      for (let frame = 0; frame < idle.length; frame++) {
        assert.deepEqual(hover[frame].size, idle[frame].size, 'Compare identical canvas sizes');
        assert.equal(hover[frame].state.hover?.instance, 1);
        assert.equal(
          hover[frame].state.time,
          idle[frame].state.time,
          'Compare identical animation times',
        );
        assert.notDeepEqual(hover[frame].state.instances[0], idle[frame].state.instances[0]);
        assert.ok(
          !hover[frame].pixels[0].equals(idle[frame].pixels[0]),
          'Hovered card must respond',
        );
        for (let card = 1; card < 3; card++) {
          assert.deepEqual(hover[frame].state.instances[card], idle[frame].state.instances[card]);
          assert.ok(
            hover[frame].pixels[card].equals(idle[frame].pixels[card]),
            `${finish}: hover changed card ${card + 1}'s foil`,
          );
        }
      }
      assert.ok(!hover[0].pixels[1].equals(hover[1].pixels[1]), 'Other cards must keep animating');
    } catch (error) {
      await mkdir('evidence', { recursive: true });
      for (const [name, snapshots] of Object.entries({ idle, hover }))
        for (const [index, snapshot] of snapshots.entries()) {
          const path = `evidence/hover-isolation-${finish}-${name}-${index}`;
          await writeFile(`${path}.png`, snapshot.image);
          await writeFile(`${path}.json`, JSON.stringify(snapshot.state, null, 2) + '\n');
        }
      throw error;
    }
    console.log(`${finish}: only hovered card responds; neighbors retain independent idle pixels.`);
  }
} finally {
  await browser.close();
}
