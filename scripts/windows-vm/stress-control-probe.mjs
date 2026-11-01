import fs from 'node:fs/promises';

const response = await fetch(new URL('/payload/shader-probe.mjs', process.env.GLINT_CONTROL_BASE), {
  headers: { Authorization: 'Bearer ' + process.env.GLINT_CONTROL_TOKEN },
  signal: AbortSignal.timeout(30000),
});
if (!response.ok) throw Error('Shared probe unavailable: ' + response.status);
await fs.writeFile(new URL('./shader-probe.mjs', import.meta.url), await response.text());
process.env.GLINT_PROBE_STRESS = '1';
process.env.GLINT_STRESS_PROFILE = 'regular';
await import('./shader-probe.mjs');
