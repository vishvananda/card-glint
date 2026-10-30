import test from 'node:test';
import assert from 'node:assert/strict';
import { programAsync, program } from '../packages/browser/src/gpu/etcher.js';

function context({ parallel = true, fail = false } = {}) {
  const events = [],
    canvas = new EventTarget();
  let complete = false,
    lost = false,
    next = 0;
  const gl = {
    canvas,
    VERTEX_SHADER: 1,
    FRAGMENT_SHADER: 2,
    LINK_STATUS: 3,
    isContextLost: () => lost,
    getExtension: () => (parallel ? { COMPLETION_STATUS_KHR: 4 } : null),
    createProgram: () => ({ id: next++ }),
    createShader: () => ({ id: next++ }),
    shaderSource() {},
    compileShader() {
      events.push('compile');
    },
    attachShader() {},
    linkProgram() {
      events.push('link');
    },
    deleteShader() {
      events.push('delete shader');
    },
    deleteProgram() {
      events.push('delete program');
    },
    getProgramParameter(_p, key) {
      if (key === 4) {
        events.push('completion');
        return complete;
      }
      assert.equal(key, 3);
      if (parallel) assert(complete, 'link status queried before completion');
      events.push('status');
      return !fail;
    },
    getProgramInfoLog: () => 'program error',
    getShaderInfoLog: () => 'shader error',
  };
  return {
    gl,
    events,
    complete: () => {
      complete = true;
    },
    lose: () => {
      lost = true;
      canvas.dispatchEvent(new Event('webglcontextlost'));
    },
  };
}

test('parallel compilation yields and waits for completion before link inspection', async () => {
  const c = context();
  const pending = programAsync(c.gl, 'fragment');
  assert.deepEqual(c.events.slice(0, 3), ['compile', 'compile', 'link']);
  await new Promise((r) => setTimeout(r, 12));
  assert(c.events.includes('completion'));
  assert(!c.events.includes('status'));
  c.complete();
  assert(await pending);
  assert.equal(c.events.filter((x) => x === 'status').length, 1);
  assert(!c.events.includes('delete program'));
});

test('fallback yields before link status; synchronous API remains available', async () => {
  const c = context({ parallel: false });
  const pending = programAsync(c.gl, 'fragment');
  assert(!c.events.includes('status'));
  await pending;
  assert(c.events.includes('status'));
  assert(program(c.gl, 'fragment'));
});

test('abort and context loss reject pending work and stop compiler polling', async () => {
  for (const loss of [false, true]) {
    const c = context(),
      abort = new AbortController();
    const pending = programAsync(c.gl, 'fragment', undefined, abort.signal);
    const rejected = assert.rejects(pending, { name: 'AbortError' });
    if (loss) c.lose();
    else abort.abort();
    await rejected;
    const calls = c.events.length;
    await new Promise((r) => setTimeout(r, 16));
    assert.equal(c.events.length, calls);
    assert.equal(c.events.filter((x) => x === 'delete program').length, loss ? 0 : 1);
  }
  const c = context(),
    aborted = new AbortController();
  aborted.abort();
  await assert.rejects(programAsync(c.gl, 'fragment', undefined, aborted.signal));
  assert.equal(c.events.length, 0);
});

test('link failures report details and delete the failed program', async () => {
  const c = context({ fail: true });
  c.complete();
  await assert.rejects(programAsync(c.gl, 'bad'), /program error.*\nshader error/s);
  assert.equal(c.events.filter((x) => x === 'delete program').length, 1);
});
