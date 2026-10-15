/** Offline README capture: real renderer, looped host tilt, no per-frame asset rebuild. */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdir, stat, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const frameRoot = 'test-results/showcase-media';
const selection = process.argv.find((arg) => arg.startsWith('--group='))?.slice(8);
if (selection && !['foils', 'living'].includes(selection)) throw Error('Unknown media group');
for (const group of selection ? [selection] : ['foils', 'living']) {
  const frames = `${frameRoot}/${group}`;
  const output = 'docs/images';
  const fps = 24;
  const seconds = 8;
  const count = fps * seconds;
  const ffmpeg = process.env.FFMPEG ?? 'ffmpeg';
  await mkdir(frames, { recursive: true });
  await mkdir(output, { recursive: true });

  if (!process.argv.includes('--encode-only')) {
    const browser = await chromium.launch({
      args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
    });
    try {
      const page = await browser.newPage({
        viewport: { width: 1664, height: 1100 },
        deviceScaleFactor: 1,
      });
      const url = process.env.LAB_URL ?? 'http://127.0.0.1:4283/card-glint/';
      const errors = [];
      page.on('pageerror', (error) => errors.push(String(error)));
      page.on('request', (request) => {
        assert.equal(
          new URL(request.url()).origin,
          new URL(url).origin,
          'Use only repository assets',
        );
      });
      await page.goto(url);
      await page.evaluate(async () => {
        await window.lab.ready;
        window.lab.pause();
        await new Promise(requestAnimationFrame);
      });
      let first;
      for (let frame = 0; frame < count; frame++) {
        const png = await page.evaluate(
          async ({ phase, time, group }) => {
            const { lab } = window;
            const renderer = await lab.ready;
            const canvas = document.querySelector('#scene');
            const poses = new Map(
              [1, 2, 3, 4].map((id) => [
                id,
                {
                  x: 0.5 + Math.sin(phase + (id - 1) * 1.4) * 0.32,
                  y: 0.5 + Math.cos(phase + (id - 1) * 1.4) * 0.25,
                },
              ]),
            );
            const instances = lab
              .layoutCards(
                lab.documents,
                canvas.width,
                canvas.height,
                4,
                'prismatic',
                false,
                0,
                poses,
              )
              .map((instance, i) => {
                const finish = lab.finishGroups[group === 'foils' ? 'mixed' : 'surfaces'][i];
                return {
                  ...instance,
                  finish,
                  deformation: finish === 'heat' ? { kind: 'heat', amount: 0.012 } : undefined,
                };
              });
            renderer.updateScene(instances);
            // Advance the living surfaces as well as the independently tilting cards.
            renderer.render({ viewProjection: lab.api.IDENTITY, time });
            const image = document.createElement('canvas');
            image.width = canvas.width;
            image.height = canvas.height + 60;
            const ctx = image.getContext('2d');
            const background = ctx.createRadialGradient(
              image.width / 2,
              image.height * 0.4,
              0,
              image.width / 2,
              image.height * 0.4,
              image.width * 0.6,
            );
            background.addColorStop(0, '#33303d');
            background.addColorStop(1, '#12151b');
            ctx.fillStyle = background;
            ctx.fillRect(0, 0, image.width, image.height);
            ctx.drawImage(canvas, 0, 0);
            ctx.font = '600 20px system-ui';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#f0edf6';
            instances.forEach((instance, i) =>
              ctx.fillText(
                lab.finishNames[instance.finish],
                ((i + 0.5) * image.width) / 4,
                canvas.height + 34,
              ),
            );
            return image.toDataURL('image/png').split(',')[1];
          },
          { phase: (frame / count) * Math.PI * 2, time: 2 + frame / fps, group },
        );
        first ??= png;
        if (frame === count / 2) assert.notEqual(png, first, 'Preview must animate');
        await writeFile(
          `${frames}/${String(frame).padStart(4, '0')}.png`,
          Buffer.from(png, 'base64'),
        );
        if (frame % fps === 0) console.log(`${group}: captured ${frame}/${count} frames`);
      }
      assert.deepEqual(errors, []);
    } finally {
      await browser.close();
    }
  }

  if (process.argv.includes('--capture-only')) continue;
  execFileSync(ffmpeg, ['-version'], { stdio: 'ignore' });
  const input = [
    '-y',
    '-hide_banner',
    '-loglevel',
    'error',
    '-framerate',
    String(fps),
    '-i',
    `${frames}/%04d.png`,
  ];
  execFileSync(ffmpeg, [
    ...input,
    '-frames:v',
    String(count),
    '-c:v',
    'libx264',
    '-preset',
    'slow',
    '-crf',
    '20',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    `${output}/showcase-${group}.mp4`,
  ]);
  execFileSync(ffmpeg, [
    ...input,
    '-t',
    String(seconds),
    '-filter_complex',
    'fps=12,scale=1000:-2:flags=lanczos,split[a][b];[a]palettegen=max_colors=192:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=3:diff_mode=rectangle',
    '-loop',
    '0',
    `${output}/showcase-${group}.gif`,
  ]);
  for (const name of [`showcase-${group}.gif`, `showcase-${group}.mp4`]) {
    const { size } = await stat(`${output}/${name}`);
    assert.ok(size < 10 * 1024 * 1024, 'Keep README media below 10 MiB each');
    console.log(`${name}: ${(size / 1024 / 1024).toFixed(2)} MiB`);
  }
}
