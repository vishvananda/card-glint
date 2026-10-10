import './style.css';
import {
  createRenderer,
  IDENTITY,
  canvas,
  type CardDocument,
  type CardLayer,
  type Finish,
  type Instance,
} from '@card-glint/browser';
import { showcase, showcaseDocument } from '../../games/showcase/src/index.js';
import { layoutCards, sceneSize } from './layout.js';
import { benchmarkCaches } from './cache-benchmark.js';
import { ShowcaseMotion } from './motion.js';
import { ShowcaseInput } from './input.js';
import { withArtworkCoverage } from './coverage.js';
import * as api from '@card-glint/browser';
const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const surface = $<HTMLCanvasElement>('scene'),
  status = $('status');
let overlap = false,
  overlay = false,
  paused = false,
  disposed = false,
  lastStats = 0;
const motion = new ShowcaseMotion();
let motionEnabled = !matchMedia('(prefers-reduced-motion: reduce)').matches;
let effectTime = 2,
  lastTime = 0;
let dirty = true,
  visible = true;
let hover: { instance: number; uv: readonly [number, number] } | undefined;
let poses: ReadonlyMap<number, { x: number; y: number }> | undefined;
function deformation(finish: Finish): Instance['deformation'] {
  return finish === 'heat' && $('scope').getAttribute('aria-pressed') !== 'true'
    ? { kind: 'heat', amount: 0.012 }
    : undefined;
}
function chosenFinish(index: number): Finish {
  const value = $<HTMLSelectElement>('finish').value;
  if (value === 'mixed') return (['etched', 'cold', 'opal'] as const)[index % 3]!;
  if (value === 'surfaces') return (['rain', 'heat', 'pool'] as const)[index % 3]!;
  return value as Finish;
}
const faces = [
  {
    name: 'Starfall Seer',
    subtitle: 'Wayfinder · Celestial',
    theme: 'orbit' as const,
    charge: 3,
    serial: '001 / ∞',
    illustration: './art/orbit.webp',
    rules:
      'She charts the roads between stars.\nAt dawn, gather one light. Spend three to open a path beyond the horizon.',
  },
  {
    name: 'Tidebound Wyrm',
    subtitle: 'Leviathan · Tempest',
    theme: 'tide' as const,
    charge: 5,
    serial: '002 / ∞',
    illustration: './art/tide.webp',
    rules:
      'The deep remembers its sovereign.\nWhen the tide rises, awaken a relic. Its next echo resounds twice.',
  },
  {
    name: 'Cinderbloom',
    subtitle: 'Ancient · Renewal',
    theme: 'garden' as const,
    charge: 2,
    serial: '003 / ∞',
    illustration: './art/garden.webp',
    rules:
      'Even the ashes remember spring.\nAt dusk, plant a spark. At dawn, restore a fallen companion to your grove.',
  },
];
const documents: CardDocument[] = faces.map((face, i) => showcaseDocument(i + 1, face));
let viewWidth = 1200,
  viewHeight = 750;
function instances(time = 0) {
  return layoutCards(
    documents,
    viewWidth,
    viewHeight,
    Number($<HTMLSelectElement>('count').value),
    chosenFinish(0),
    overlap,
    time,
    poses,
  ).map((instance, i) => ({
    ...instance,
    finish: chosenFinish(i),
    deformation: deformation(chosenFinish(i)),
  }));
}
function resize() {
  dirty = true;
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
  status.textContent = 'Hover or drag a card to tilt it. Swipe beside or between cards to scroll.';
  const input = new ShowcaseInput(
    surface,
    (x, y) => renderer.hitTest(x, y),
    () => {
      dirty = true;
      const hit = input.hover;
      hover = hit;
      $('hit').textContent = hit
        ? `Instance ${hit.instance} · ${hit.part ?? 'card'} · ${hit.uv.map((v) => v.toFixed(2)).join(', ')}`
        : '';
    },
  );
  $('motion').setAttribute('aria-pressed', String(motionEnabled));
  $('motion').onclick = () => {
    dirty = true;
    motionEnabled = !motionEnabled;
    $('motion').setAttribute('aria-pressed', String(motionEnabled));
    $('motion').textContent = motionEnabled ? 'Pause motion' : 'Resume motion';
  };
  $<HTMLSelectElement>('finish').onchange = () => {
    dirty = true;
    const names: Record<Finish, string> = {
      regular: 'Uncoated',
      etched: 'Etched silver',
      cold: 'Cold foil',
      opal: 'Opal embossing',
      prismatic: 'Prismatic',
      rain: 'Raindrops on glass',
      heat: 'Heat shimmer',
      pool: 'Pool water',
    };
    document.querySelectorAll('.captions i').forEach((node, i) => {
      node.textContent = names[chosenFinish(i)];
    });
  };
  if (!motionEnabled) $('motion').textContent = 'Resume motion';
  function draw(time: number) {
    if (disposed) return;
    requestAnimationFrame(draw);
    const dt = Math.min(0.05, Math.max(0, (time - lastTime) / 1000));
    lastTime = time;
    if (paused || document.hidden || !visible || (!motionEnabled && !dirty)) return;
    dirty = false;
    hover = input.sample();
    if (motionEnabled) {
      effectTime += dt;
      poses = motion.sample(effectTime, dt, hover);
    }
    renderer.updateScene(instances());
    const metrics = renderer.render({
      viewProjection: IDENTITY,
      pointer: input.pointer,
      time: effectTime,
      hover: motionEnabled ? hover : undefined,
    });
    if (time - lastStats > 500) {
      $('stats').textContent = JSON.stringify(metrics, null, 2);
      lastStats = time;
    }
  }
  requestAnimationFrame(draw);
  const resizeObserver = new ResizeObserver(() => {
    resize();
    renderer.updateScene(instances());
    renderer.render({ viewProjection: IDENTITY, pointer: input.pointer, time: effectTime });
  });
  resizeObserver.observe(surface.parentElement!);
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry!.isIntersecting;
    dirty = true;
  });
  visibilityObserver.observe(surface);
  $<HTMLSelectElement>('count').onchange = resize;
  $('overlap').onclick = () => {
    dirty = true;
    overlap = !overlap;
  };
  async function updateCards(next: CardDocument[]) {
    const controls = ['scope', 'layer', 'export'].map((id) => $<HTMLButtonElement>(id));
    controls.forEach((button) => {
      button.disabled = true;
    });
    try {
      renderer.upsertCards(next);
      await Promise.all(next.map((card) => renderer.ready(card.id, card.revision)));
      for (const card of next) documents[documents.findIndex((d) => d.id === card.id)] = card;
      dirty = true;
    } finally {
      controls.forEach((button) => {
        button.disabled = false;
      });
    }
  }
  $('scope').onclick = async () => {
    const button = $('scope');
    const artworkOnly = button.getAttribute('aria-pressed') !== 'true';
    try {
      await updateCards(documents.map((card) => withArtworkCoverage(card, artworkOnly)));
      button.setAttribute('aria-pressed', String(artworkOnly));
      button.textContent = artworkOnly ? 'Effect: Artwork only' : 'Effect: Full card';
    } catch (error) {
      status.textContent = String(error);
    }
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
    const layers: CardLayer[] = (documents[0]!.layers ?? []).filter(
      (layer) => layer.id !== 'badge',
    );
    if (overlay)
      layers.push({
        id: 'badge',
        order: 0,
        stage: 'over-finish',
        raster,
        finishCoverage: { exclude: raster },
      });
    const next = { ...documents[0]!, revision: documents[0]!.revision + 1, layers };
    try {
      await updateCards([next]);
    } catch (error) {
      overlay = !overlay;
      status.textContent = String(error);
    }
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
      finish: chosenFinish(0),
      deformation: deformation(chosenFinish(0)),
      instanceId: 1,
      time: effectTime,
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
      visibilityObserver.disconnect();
      input.dispose();
      renderer.dispose();
    },
    { once: true },
  );
  renderer.updateScene(instances());
  renderer.render({ viewProjection: IDENTITY });
  return renderer;
})();
$('disclaimer').textContent =
  'Original AI-generated illustrations and code-drawn frames · MIT OR Apache-2.0 · No external game artwork or fonts loaded.';
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
    instances,
    motionState: () => ({ time: effectTime, hover, motionEnabled }),
    pause: (value = true) => {
      paused = value;
    },
  },
});
void ready.catch((error) => {
  status.textContent = String(error);
  console.error(error);
});
