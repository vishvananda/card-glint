import assert from 'node:assert/strict';
import { createServer } from 'vite';
const server = await createServer({
  configFile: false,
  server: { middlewareMode: true, hmr: false },
});
try {
  const { SurfaceMotion } = await server.ssrLoadModule('/packages/browser/src/surface-motion.ts');
  const motion = new SurfaceMotion(),
    instance = {
      id: 17,
      card: 1,
      finish: 'pool',
      transform: [2, 0, 0, 0, 0, -2, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1],
    },
    identity = new Float32Array(16);
  const sample = (time, x, hover = true, id = 17) => {
    motion.begin();
    const result = motion
      .sample(
        { ...instance, id },
        {
          viewProjection: identity,
          time,
          ...(hover ? { hover: { instance: id, uv: [x, 0.5] } } : {}),
        },
      )
      .slice();
    motion.end();
    return result;
  };
  for (const [i, x] of [0.2, 0.35, 0.5, 0.65].entries()) sample(i * 0.04, x);
  const full = sample(0.12, 0.65),
    trails = full.slice(4);
  assert.equal([...trails].filter((v, i) => i % 4 === 3 && v > 0).length, 4);
  for (const [i, x] of [0.8, 0.95, 0.8, 0.65, 0.5, 0.35, 0.2].entries())
    assert.deepEqual(
      sample(0.16 + i * 0.04, x).slice(4),
      trails,
      'Fast motion must not overwrite a live trail',
    );
  assert.ok(
    sample(0.5, 0.25)
      .slice(0, 2)
      .some((v) => v !== 0),
    'Slosh responds even while emission waits',
  );
  sample(1, 0.25, false);
  assert.deepEqual(
    sample(1.1, 0.8, true).slice(4),
    trails,
    'Re-entering cannot overwrite live trails',
  );
  assert.deepEqual(
    sample(2.3, 0.8).slice(4),
    trails,
    'A stationary pointer does not create replacement waves',
  );
  const expired = sample(2.31, 0.7).slice(4);
  assert.ok(
    expired.some((v, i) => v !== trails[i]),
    'Motion resumes emission after an old trail expires',
  );
  const finish = sample(2.4, 0.7, false).slice(4);
  assert.deepEqual(
    sample(3, 0.7, false).slice(4),
    finish,
    'Leaving the surface lets the remaining waves fade without resets',
  );
  console.log(
    'PASS four ripple slots preserve live trails, throttle fast input/re-entry, retain slosh, and resume only on movement after expiry',
  );
} finally {
  await server.close();
}
