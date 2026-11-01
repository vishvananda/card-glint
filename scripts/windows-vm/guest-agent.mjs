import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const root = path.dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(await fs.readFile(path.join(root, 'settings.json'), 'utf8'));
const headers = { Authorization: 'Bearer ' + config.token };
const completedFile = path.join(root, 'completed-node-jobs.json');
let completed = [];
try {
  completed = JSON.parse(await fs.readFile(completedFile, 'utf8'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
async function send(data) {
  const response = await fetch(new URL('/event', config.base), {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw Error('Controller rejected event: ' + response.status);
}
async function tail(filename) {
  const file = await fs.open(filename, 'r');
  try {
    const { size } = await file.stat();
    const bytes = Buffer.alloc(Math.min(size, 256 * 1024));
    await file.read(bytes, 0, bytes.length, Math.max(0, size - bytes.length));
    return bytes.toString('utf8');
  } finally {
    await file.close();
  }
}
async function run(job) {
  if (
    !/^[A-Za-z0-9_-]{1,100}$/.test(job.id) ||
    !/^[A-Za-z0-9_-]+\.mjs$/.test(job.script) ||
    !['default', 'warp', 'swiftshader'].includes(job.backend) ||
    !['auto', 'full', 'reduced'].includes(job.quality) ||
    !['msedge', 'chromium', 'firefox'].includes(job.browser) ||
    !Number.isFinite(job.timeoutSeconds)
  )
    throw Error('Invalid job');
  const runner = path.join(root, 'runner');
  const script = path.join(runner, job.script);
  const payload = await fetch(new URL('/payload/' + job.script, config.base), {
    headers,
    signal: AbortSignal.timeout(30000),
  });
  if (!payload.ok) throw Error('Test payload unavailable: ' + payload.status);
  await fs.writeFile(script, await payload.text());
  const stdout = path.join(root, job.id + '-stdout.log');
  const stderr = path.join(root, job.id + '-stderr.log');
  const out = await fs.open(stdout, 'w');
  const err = await fs.open(stderr, 'w');
  const started = Date.now();
  let timedOut = false;
  let timer;
  await send({
    stage: 'running',
    jobId: job.id,
    backend: job.backend,
    quality: job.quality,
    browser: job.browser,
  });
  try {
    const child = spawn(process.execPath, [script, job.backend, job.quality, job.browser], {
      cwd: runner,
      windowsHide: true,
      stdio: ['ignore', out.fd, err.fd],
      env: {
        ...process.env,
        PATH: path.dirname(process.execPath) + path.delimiter + process.env.PATH,
        GLINT_CONTROL_BASE: config.base,
        GLINT_CONTROL_TOKEN: config.token,
        GLINT_JOB_ID: job.id,
        PLAYWRIGHT_BROWSERS_PATH: path.join(root, 'browsers'),
      },
    });
    const status = new Promise((resolve, reject) => {
      child.once('error', reject);
      child.once('close', (exitCode, signal) => resolve({ exitCode, signal }));
    });
    const timeout = Math.max(30, Math.min(600, job.timeoutSeconds)) * 1000;
    timer = setTimeout(() => {
      timedOut = true;
      // A separate process kills Node plus its browser descendants, even when
      // a shader blocks the browser's JavaScript or driver threads.
      const killer = spawn(
        path.join(process.env.SystemRoot, 'System32', 'taskkill.exe'),
        ['/PID', String(child.pid), '/T', '/F'],
        { windowsHide: true, stdio: 'ignore' },
      );
      killer.on('error', () => child.kill());
      killer.on('close', (code) => {
        if (code !== 0) child.kill();
      });
    }, timeout);
    const result = await status;
    clearTimeout(timer);
    await out.close();
    await err.close();
    await send({
      stage: 'complete',
      jobId: job.id,
      timedOut,
      ...result,
      elapsedMs: Date.now() - started,
      stdout: await tail(stdout),
      stderr: await tail(stderr),
    });
    completed = [...completed, job.id].slice(-400);
    const temporary = completedFile + '.tmp';
    await fs.writeFile(temporary, JSON.stringify(completed));
    await fs.rename(temporary, completedFile);
  } finally {
    clearTimeout(timer);
    await out.close().catch(() => {});
    await err.close().catch(() => {});
  }
}
let heartbeat = 0;
for (;;) {
  try {
    if (Date.now() - heartbeat > 30000) {
      await send({ stage: 'heartbeat', coordinator: 'node' });
      heartbeat = Date.now();
    }
    const response = await fetch(new URL('/job', config.base), {
      headers,
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw Error('Controller rejected job request');
    const job = await response.json();
    if (job.id && !completed.includes(job.id)) await run(job);
  } catch (error) {
    await send({ stage: 'agent-error', message: error.message }).catch(() => {});
  }
  await delay(3000);
}
