// Offline GPU trials: compile once, reuse one context, read back once per candidate.
import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';

const [directory, url] = process.argv.slice(2);
if (!directory || !url)
  throw Error('Usage: frame-reconstruction-print-dots.mjs OUTPUT SERVED_OUTPUT_URL');
const manifest = JSON.parse(await readFile(path.join(directory, 'candidates.json'), 'utf8'));
await mkdir(path.join(directory, 'renders'), { recursive: true });
await writeFile(
  path.join(directory, 'capture.html'),
  '<!doctype html><meta charset="utf-8"><title>Offline print-dot trial</title>',
);
const browser = await chromium.launch({
  headless: true,
  args: ['--no-sandbox', '--use-angle=metal'],
});
const page = await browser.newPage();
try {
  await page.goto(new URL('capture.html', url).href);
  await page.evaluate(async ({ source, size, experiment }) => {
    const { FinishResources, PRINT_DOTS_GLSL } = await import('../renderer/finish.js');
    const im = new Image();
    im.src = source;
    await im.decode();
    const face = document.createElement('canvas');
    [face.width, face.height] = size;
    face.getContext('2d').drawImage(im, 0, 0, ...size);
    window.trial = { face, resources: new FinishResources() };
    if (experiment) {
      const { createDotExperiment } = await import(experiment);
      window.trial.experiment = createDotExperiment(PRINT_DOTS_GLSL, face);
    }
  }, manifest);
  const gpu = await page.evaluate(() => {
    const c = document.createElement('canvas'),
      gl = c.getContext('webgl2'),
      ext = gl.getExtension('WEBGL_debug_renderer_info');
    return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
  });
  console.log(gpu);
  const receipts = [];
  for (const [index, candidate] of manifest.candidates.entries()) {
    const png = await page.evaluate((settings) => {
      const { face, resources, experiment } = window.trial;
      const { width, height } = face;
      const output = document.createElement('canvas');
      output.width = width;
      output.height = height;
      const ctx = output.getContext('2d');
      if (settings.amount === 0) ctx.drawImage(face, 0, 0);
      else {
        const pixels = experiment
          ? experiment.render(settings)
          : resources.printDots(face, width, height, settings);
        const data = new ImageData(width, height),
          stride = width * 4;
        for (let y = 0; y < height; y++)
          data.data.set(
            pixels.data.subarray((height - 1 - y) * stride, (height - y) * stride),
            y * stride,
          );
        ctx.putImageData(data, 0, 0);
      }
      const result = output.toDataURL('image/png');
      output.width = output.height = 0;
      return result;
    }, candidate);
    const data = Buffer.from(png.split(',')[1], 'base64');
    await writeFile(path.join(directory, 'renders', candidate.key + '.png'), data);
    receipts.push({ key: candidate.key, sha256: createHash('sha256').update(data).digest('hex') });
    if (index % 20 === 0) console.log(`${index + 1}/${manifest.candidates.length}`);
  }
  await writeFile(
    path.join(directory, 'native-receipt.json'),
    JSON.stringify(
      {
        browser: browser.version(),
        gpu,
        size: manifest.size,
        settings: manifest.candidates,
        renders: receipts,
      },
      null,
      2,
    ) + '\n',
  );
  await page.evaluate(() => {
    window.trial.resources.dispose();
    window.trial.experiment?.dispose();
  });
} finally {
  await browser.close();
}
