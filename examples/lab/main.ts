import './style.css';
import {
  createRenderer,
  IDENTITY,
  canvas,
  type CardDocument,
  type CardLayer,
  type Finish,
} from '@card-glint/browser';
import { showcase } from '../../games/showcase/src/index.js';
import { layoutCards, sceneSize } from './layout.js';
import { benchmarkCaches } from './cache-benchmark.js';
import * as api from '@card-glint/browser';
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const surface = $<HTMLCanvasElement>('scene'),
  status = $('status');
let overlap = false,
  overlay = false,
  paused = false,
  disposed = false,
  lastStats = 0;
const faces = [
  {
    name: 'Astral Compass',
    subtitle: 'Instrument · Navigation',
    theme: 'orbit' as const,
    charge: 3,
    serial: '001 / ∞',
    illustration: './art/orbit.svg',
    rules:
      'Chart a path through the unknown.\nAt dawn, store one light. Release three to reveal a distant horizon.',
  },
  {
    name: 'Tidal Engine',
    subtitle: 'Relic · Resonance',
    theme: 'tide' as const,
    charge: 5,
    serial: '002 / ∞',
    illustration: './art/tide.svg',
    rules:
      'Turn the current in your favor.\nStore the strength of a rising tide. Release it to awaken a sleeping vessel.',
  },
  {
    name: 'Ember Orchard',
    subtitle: 'Sanctuary · Renewal',
    theme: 'garden' as const,
    charge: 2,
    serial: '003 / ∞',
    illustration: './art/garden.svg',
    rules:
      'Where the last ember takes root.\nAt dusk, plant a spark. Each dawn, a new branch remembers the sun.',
  },
];
const documents: CardDocument[] = faces.map((face, i) => ({
  id: i + 1,
  revision: 1,
  recipe: showcase.describe(face, 'inspect'),
}));
let viewWidth = 1200,
  viewHeight = 750;
function instances(time = 0) {
  return layoutCards(
    documents,
    viewWidth,
    viewHeight,
    Number($<HTMLSelectElement>('count').value),
    ($<HTMLSelectElement>('finish').value === 'mixed'
      ? 'etched'
      : $<HTMLSelectElement>('finish').value) as Finish,
    overlap,
    time,
  ).map((instance, i) => ({
    ...instance,
    finish:
      $<HTMLSelectElement>('finish').value === 'mixed'
        ? (['etched', 'cold', 'opal'] as const)[i % 3]
        : instance.finish,
  }));
}
function resize() {
  const count = Number($<HTMLSelectElement>('count').value);
  const size = sceneSize(surface.parentElement!.clientWidth, count);
  viewWidth = size.width;
  viewHeight = size.height;
  surface.style.height = viewHeight + 'px';
  const ratio = Math.min(2, window.devicePixelRatio || 1);
  const width = Math.round(viewWidth * ratio),
    height = Math.round(viewHeight * ratio);
  if (surface.width !== width || surface.height !== height) {
    surface.width = width;
    surface.height = height;
  }
}

const ready = (async () => {
  const renderer = await createRenderer({
    canvas: surface,
    onError: (error) => {
      status.textContent = String(error);
      console.error(error);
    },
  });
  resize();
  renderer.upsertCards(documents);
  await Promise.all(documents.map((d) => renderer.ready(d.id, d.revision)));
  status.textContent = 'Ready. Move over the canvas to sweep the foil light.';
  let pointer: [number, number] = [0.5, 0.5];
  surface.onpointermove = (e) => {
    const r = surface.getBoundingClientRect();
    pointer = [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height];
    const hit = renderer.hitTest(e.clientX - r.left, e.clientY - r.top);
    $('hit').textContent = hit
      ? `Instance ${hit.instance} · ${hit.part ?? 'card'} · ${hit.uv.map((v) => v.toFixed(2)).join(', ')}`
      : '';
  };
  function draw(time: number) {
    if (disposed) return;
    requestAnimationFrame(draw);
    if (paused) return;
    renderer.updateScene(instances(time));
    const metrics = renderer.render({ viewProjection: IDENTITY, pointer });
    if (time - lastStats > 500) {
      $('stats').textContent = JSON.stringify(metrics, null, 2);
      lastStats = time;
    }
  }
  requestAnimationFrame(draw);
  const resizeObserver = new ResizeObserver(() => {
    resize();
    renderer.updateScene(instances());
    renderer.render({ viewProjection: IDENTITY, pointer });
  });
  resizeObserver.observe(surface.parentElement!);
  $<HTMLSelectElement>('count').onchange = resize;
  $('overlap').onclick = () => {
    overlap = !overlap;
  };
  $('layer').onclick = async () => {
    overlay = !overlay;
    const raster = {
      key: 'orange-badge-v1',
      size: [732, 1020] as const,
      async paint() {
        const c = canvas([732, 1020]),
          ctx = c.getContext('2d')!;
        ctx.fillStyle = '#e58d33';
        ctx.fillRect(65, 215, 270, 95);
        ctx.fillStyle = '#131c22';
        ctx.font = 'bold 34px sans-serif';
        ctx.fillText('OVER FOIL', 80, 275);
        return c;
      },
    };
    const layers: CardLayer[] = overlay
      ? [
          {
            id: 'badge',
            order: 0,
            stage: 'over-finish',
            raster,
            finishCoverage: { exclude: raster },
          },
        ]
      : [];
    const next = { ...documents[0]!, revision: documents[0]!.revision + 1, layers };
    documents[0] = next;
    renderer.upsertCards([next]);
    await renderer.ready(next.id, next.revision);
  };
  $('cache').onclick = async () => {
    paused = true;
    status.textContent = 'Measuring shared-context cache hits, eviction and restoration…';
    try {
      const before = renderer.metrics,
        start = performance.now();
      await Promise.all(documents.map((d) => renderer.ready(d.id, d.revision)));
      const fullFaceReuse = {
        elapsedMs: performance.now() - start,
        before,
        after: renderer.metrics,
      };
      const report = {
        ...(await benchmarkCaches(documents[0]!.recipe.edges[0]!.asset.url)),
        fullFaceReuse,
      };
      $('report').textContent = JSON.stringify(report, null, 2);
      status.textContent = 'Cache measurements complete.';
    } catch (error) {
      status.textContent = String(error);
      console.error(error);
    } finally {
      paused = false;
    }
  };
  $('export').onclick = async () => {
    const blob = await renderer.exportCard(1, {
      revision: documents[0]!.revision,
      width: 732,
      finish: ($<HTMLSelectElement>('finish').value === 'mixed'
        ? 'etched'
        : $<HTMLSelectElement>('finish').value) as Finish,
    });
    const url = URL.createObjectURL(blob),
      link = document.createElement('a');
    link.href = url;
    link.download = 'card.png';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  $('copy').onclick = () =>
    navigator.clipboard.writeText($('report').textContent || $('stats').textContent || '');
  window.addEventListener(
    'pagehide',
    () => {
      disposed = true;
      resizeObserver.disconnect();
      renderer.dispose();
    },
    { once: true },
  );
  renderer.updateScene(instances());
  renderer.render({ viewProjection: IDENTITY });
  return renderer;
})();
$('disclaimer').textContent =
  'Original illustrations, frames and symbols · MIT OR Apache-2.0 · No external artwork or fonts loaded.';
Object.assign(window, {
  lab: {
    ready,
    api,
    showcase,
    faces,
    documents,
    benchmarkCaches,
    layoutCards,
    sceneSize,
    pause: (value = true) => {
      paused = value;
    },
  },
});
void ready.catch((error) => {
  status.textContent = String(error);
  console.error(error);
});
