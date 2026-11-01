const finishes = [
  'regular',
  'gloss',
  'etched',
  'prismatic',
  'cold',
  'holofoil',
  'opal',
  'rain',
  'heat',
  'pool',
];

export async function runStress({ createRenderer, IDENTITY }, quality) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 800;
  document.body.append(canvas);
  const renderer = await createRenderer({
    canvas,
    wasmUrl: '/sdk/renderer_bg.wasm',
    finishQuality: quality,
    etching: 'rust',
  });
  const gl = canvas.getContext('webgl2');
  const documents = Array.from({ length: 300 }, (_, index) => {
    const id = index + 1;
    return {
      id,
      revision: 1,
      recipe: {
        pack: 'windows-stress-probe',
        color: {
          key: 'distinct-stress-face-' + id,
          size: [122, 170],
          async paint() {
            const face = document.createElement('canvas');
            face.width = 122;
            face.height = 170;
            const p = face.getContext('2d');
            const gradient = p.createLinearGradient(0, 0, 122, 170);
            gradient.addColorStop(0, 'hsl(' + ((id * 47) % 360) + ' 60% 35%)');
            gradient.addColorStop(1, 'hsl(' + ((id * 31) % 360) + ' 45% 70%)');
            p.fillStyle = gradient;
            p.fillRect(0, 0, 122, 170);
            p.fillStyle = '#e8e4cd';
            p.fillRect(8, 98, 106, 62);
            p.fillStyle = '#17212b';
            p.font = '12px sans-serif';
            p.fillText('Face ' + id, 12, 116);
            return face;
          },
        },
        edges: [],
        artWindows: [[0.1, 0.1, 0.8, 0.35]],
        cornerRadius: 0.045,
        regions: [],
      },
    };
  });
  const instances = documents.map(({ id }, index) => {
    const x = 3 + (index % 20) * 40,
      y = 3 + Math.floor(index / 20) * 52.8;
    return {
      id,
      card: id,
      transform: [
        72 / 800,
        0,
        0,
        0,
        0,
        -100 / 800,
        0,
        0,
        0,
        0,
        1,
        0,
        -1 + (2 * x) / 800,
        1 - (2 * y) / 800,
        0,
        1,
      ],
      normal: [0, 0, 1],
      finish: finishes[index % finishes.length],
      printDots: { amount: 0.35, artwork: false },
      cardstock: { amount: 0.2 },
    };
  });
  async function completedFrame(time, budget = 45000) {
    const start = performance.now();
    renderer.render({
      viewProjection: IDENTITY,
      lighting: 'studio',
      time,
      pointer: [0.4 + 0.1 * Math.sin(time), 0.5],
    });
    const submitMs = performance.now() - start;
    const fence = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    if (!fence) throw Error('Could not create GPU completion fence');
    gl.flush();
    try {
      for (;;) {
        if (gl.isContextLost()) throw Error('WebGL context lost during stress');
        const status = gl.clientWaitSync(fence, 0, 0);
        if (status === gl.WAIT_FAILED) throw Error('GPU completion fence failed');
        if (status !== gl.TIMEOUT_EXPIRED) break;
        if (performance.now() - start > budget)
          throw Error('GPU frame exceeded its completion budget');
        await new Promise((resolve) => setTimeout(resolve, 8));
      }
    } finally {
      gl.deleteSync(fence);
    }
    return { submitMs, completionMs: performance.now() - start };
  }
  function stable(before, after) {
    for (const name of ['compositions', 'maskBuilds', 'uploads'])
      if (after[name] !== before[name])
        throw Error('Static resource rebuilt during warm stress: ' + name);
    if (after.pending !== 0) throw Error('Warm stress left pending face work');
  }
  try {
    await window.recordAdapter({ stressPhase: 'empty-frame', ...(await completedFrame(0, 10000)) });
    for (const count of [100, 300]) {
      document.querySelector('#status').textContent =
        'Preparing ' + count + ' distinct faces · ' + quality;
      await window.recordAdapter({ stressPhase: 'preparing', count, quality });
      const start = performance.now();
      renderer.upsertCards(documents.slice(0, count));
      renderer.updateScene(instances.slice(0, count));
      await Promise.all(documents.slice(0, count).map(({ id }) => renderer.ready(id, 1)));
      const readyMs = performance.now() - start;
      await window.recordAdapter({ stressPhase: 'cold-frame', count, quality, readyMs });
      // Ten cold software-driver shader variants can be much slower than a
      // warmed frame. Keep their budget separate rather than calling that a hang.
      const first = await completedFrame(0.2, 180000);
      await window.recordAdapter({ stressPhase: 'cold-frame-complete', count, quality, ...first });
      const pixels = new Uint8Array(canvas.width * canvas.height * 4);
      gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      let opaquePixels = 0;
      for (let i = 3; i < pixels.length; i += 4) if (pixels[i] > 240) opaquePixels++;
      if (opaquePixels < count * 36 * 50 * 0.75) throw Error('Incomplete many-face scene');
      const before = renderer.metrics,
        samples = [];
      for (let frame = 0; frame < 12; frame++)
        samples.push(await completedFrame(0.3 + frame * 0.07));
      const after = renderer.metrics;
      stable(before, after);
      const ordered = samples.map((row) => row.completionMs).sort((a, b) => a - b);
      await window.recordStep({
        phase: 'stress',
        count,
        selectedQuality: renderer.finishQuality,
        nativeFaceSize: [122, 170],
        displayedFaceSize: [36, 50],
        viewport: [800, 800],
        opaquePixels,
        readyMs,
        coldSubmitMs: first.submitMs,
        coldCompletionMs: first.completionMs,
        warmFrames: samples.length,
        warmMedianCompletionMs: ordered[Math.floor(ordered.length / 2)],
        warmMaxCompletionMs: ordered.at(-1),
        warmMedianSubmitMs: samples.map((row) => row.submitMs).sort((a, b) => a - b)[6],
        compositions: after.compositions,
        maskBuilds: after.maskBuilds,
        uploads: after.uploads,
        pending: after.pending,
        gpuBytes: after.gpu.bytes,
        jsHeapBytes: performance.memory?.usedJSHeapSize ?? null,
      });
    }
    const before = renderer.metrics;
    renderer.updateScene(instances.slice(0, 100));
    await Promise.all(documents.slice(0, 100).map(({ id }) => renderer.ready(id, 1)));
    const frame = await completedFrame(1.7);
    stable(before, renderer.metrics);
    await window.recordStep({
      phase: 'cached-revisit',
      count: 100,
      ...frame,
      compositions: renderer.metrics.compositions,
      uploads: renderer.metrics.uploads,
    });
    document.querySelector('#status').textContent = '100 / 300 face stress checks completed';
    return { selectedQuality: renderer.finishQuality };
  } finally {
    renderer.dispose();
  }
}
