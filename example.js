// These imports resolve inside the extracted browser release. No bundler needed.
import { createRenderer, IDENTITY } from './browser.js';
import { showcase } from './showcase.js';
const canvas = document.getElementById('card');
window.exampleReady = (async () => {
  const renderer = await createRenderer({
    canvas,
    wasmUrl: new URL('./renderer_bg.wasm', import.meta.url),
  });
  renderer.upsertCards([
    {
      id: 1,
      revision: 1,
      recipe: showcase.describe(
        {
          name: 'Starfall Seer',
          subtitle: 'Wayfinder · Celestial',
          theme: 'orbit',
          charge: 3,
          serial: '001 / ∞',
          illustration: new URL('./art/orbit.webp', import.meta.url).href,
          rules: 'She charts the roads between stars.\nAt dawn, gather one light.',
        },
        'inspect',
      ),
    },
  ]);
  await renderer.ready(1, 1);
  renderer.updateScene([
    {
      id: 1,
      card: 1,
      finish: 'etched',
      transform: [2, 0, 0, 0, 0, -2, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1],
    },
  ]);
  const paint = (pointer = [0.5, 0.5]) => renderer.render({ viewProjection: IDENTITY, pointer });
  paint();
  canvas.onpointermove = (event) => {
    const rect = canvas.getBoundingClientRect();
    paint([(event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height]);
  };
  canvas.onpointerleave = () => paint();
  window.addEventListener('pagehide', () => renderer.dispose(), { once: true });
  document.getElementById('status').textContent = 'Ready. Move over the card to change the light.';
  return renderer.metrics;
})();
window.exampleReady.catch((error) => {
  document.getElementById('status').textContent = error.message;
  console.error(error);
});
