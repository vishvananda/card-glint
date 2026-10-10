/** Original, deterministic SVG illustrations. No downloaded inputs or embedded fonts. */
import { mkdir, writeFile } from 'node:fs/promises';
const out = new URL('../games/showcase/art/', import.meta.url);
await mkdir(out, { recursive: true });
function random(seed) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
function sky(seed, colors) {
  const r = random(seed);
  return `<defs>
    <linearGradient id="sky" x2=".8" y2="1"><stop stop-color="${colors[0]}"/><stop offset="1" stop-color="#080e1b"/></linearGradient>
    <radialGradient id="glow"><stop stop-color="${colors[1]}" stop-opacity=".55"/><stop offset="1" stop-color="${colors[1]}" stop-opacity="0"/></radialGradient>
    <linearGradient id="metal" x2="1" y2="1"><stop stop-color="#ffedbf"/><stop offset=".45" stop-color="${colors[1]}"/><stop offset="1" stop-color="#38294a"/></linearGradient>
    <linearGradient id="facet" x2=".8" y2="1"><stop stop-color="#e4fff8"/><stop offset=".25" stop-color="${colors[1]}"/><stop offset="1" stop-color="${colors[0]}"/></linearGradient>
  </defs><rect width="960" height="640" fill="url(#sky)"/>
  <ellipse cx="480" cy="280" rx="470" ry="370" fill="url(#glow)"/>
  ${Array.from({ length: 140 }, () => `<circle cx="${r() * 960}" cy="${r() * 560}" r="${0.5 + r() * 1.4}" fill="#eee2b5" opacity="${0.15 + r() * 0.65}"/>`).join('')}`;
}
function orbit() {
  let s = sky(8, ['#33204c', '#a2b9ff']);
  s += `<g fill="none" stroke="url(#metal)">
    <circle cx="480" cy="300" r="190" stroke-width="2"/>
    <circle cx="480" cy="300" r="204" stroke-opacity=".4"/>
    <ellipse cx="480" cy="300" rx="275" ry="81" transform="rotate(-27 480 300)" stroke-width="3"/>
    <ellipse cx="480" cy="300" rx="135" ry="252" transform="rotate(25 480 300)" stroke-width="2"/>
  </g>`;
  for (let i = 0; i < 60; i++) {
    const a = (i * Math.PI) / 30,
      x = 480 + 205 * Math.cos(a),
      y = 300 + 205 * Math.sin(a),
      len = i % 5 ? 4 : 11;
    s += `<path d="M${x},${y} l${len * Math.cos(a)},${len * Math.sin(a)}" stroke="#c8badc" opacity=".7"/>`;
  }
  s += `<path d="M480 72 578 249 540 391 480 505 408 379 380 249Z" fill="url(#facet)" stroke="#e3d8ff" stroke-width="2"/>
    <path d="M480 72 456 278 380 249 408 379 456 278 480 505 540 391 456 278 578 249Z" fill="#98b5ec" opacity=".36"/>
    <path d="M480 72 456 278 480 505M380 249 456 278 578 249M408 379 456 278 540 391" fill="none" stroke="#f0e3ff" opacity=".6"/>
    <circle cx="690" cy="155" r="14" fill="#e7c98c"/><circle cx="238" cy="420" r="8" fill="#b9dded"/>`;
  for (let i = 0; i < 10; i++)
    s += `<path d="M0 ${590 + i * 8} Q250 ${505 + i * 12} 480 ${594 + i * 8} T960 ${575 + i * 9}" stroke="#8c72ac" stroke-opacity="${0.2 - i * 0.013}" fill="none"/>`;
  return s;
}
function tide() {
  let s = sky(17, ['#0e454b', '#4cd4c4']);
  s += `<circle cx="480" cy="276" r="175" fill="#101e2b" stroke="url(#metal)" stroke-width="15"/>
    <circle cx="480" cy="276" r="151" fill="url(#glow)" stroke="#cde3ba" stroke-width="1"/>
    <path d="M480 83 592 277 480 475 370 277Z" fill="none" stroke="url(#metal)" stroke-width="2"/>
    <circle cx="480" cy="276" r="98" fill="none" stroke="#64cbbd" stroke-opacity=".7"/>`;
  for (let i = 0; i < 32; i++) {
    const a = (i * Math.PI) / 16,
      c = Math.cos(a),
      d = Math.sin(a);
    s += `<path d="M${480 + 157 * c} ${276 + 157 * d} L${480 + 181 * c} ${276 + 181 * d}" stroke="#eac9a0" stroke-width="${i % 4 ? 1 : 4}"/>`;
  }
  for (let i = 0; i < 36; i++) {
    const y = 392 + i * 7;
    s += `<path d="M-30 ${y} C170 ${y - 92},310 ${y + 100},480 ${y + 8} S790 ${y - 100},990 ${y + 18}" stroke="${i % 3 ? '#57b0af' : '#b3d9c5'}" stroke-width="${i % 4 ? 1 : 3}" fill="none" opacity="${0.55 - i * 0.01}"/>`;
  }
  s += `<path d="M411 289 Q480 105 549 289 Q480 331 411 289Z" fill="url(#facet)"/><path d="M480 159V323M411 289 480 253 549 289" stroke="#e1ffff" stroke-width="2" fill="none"/>`;
  return s;
}
function garden() {
  let s = sky(31, ['#58233b', '#f59b63']);
  s += `<circle cx="480" cy="249" r="165" fill="none" stroke="#cc895a" stroke-opacity=".6"/><circle cx="480" cy="249" r="173" fill="none" stroke="#dc8d64" stroke-opacity=".3"/>
  <circle cx="480" cy="245" r="108" fill="#edbf8e" opacity=".12"/>`;
  const r = random(99);
  function branch(x, y, len, a, depth) {
    const nx = x + len * Math.sin(a),
      ny = y - len * Math.cos(a);
    let b = `<path d="M${x} ${y} Q${x + len * Math.sin(a) * 0.3} ${y - len * 0.7} ${nx} ${ny}" stroke="url(#metal)" stroke-width="${depth * 1.5 + 0.7}" fill="none"/>`;
    if (depth)
      return (
        b +
        branch(nx, ny, len * 0.71, a - 0.48, depth - 1) +
        branch(nx, ny, len * 0.69, a + 0.53, depth - 1)
      );
    const rad = 10 + r() * 9;
    return (
      b +
      `<path d="M${nx} ${ny - rad * 2} Q${nx + rad * 1.8} ${ny - rad} ${nx} ${ny + rad} Q${nx - rad * 1.8} ${ny - rad} ${nx} ${ny - rad * 2}Z" fill="url(#facet)" stroke="#ffc09a" stroke-width=".6"/>`
    );
  }
  s += branch(480, 607, 142, 0, 4);
  for (let i = 0; i < 22; i++)
    s += `<ellipse cx="480" cy="${598 + i * 4}" rx="${40 + i * 18}" ry="${8 + i * 1.4}" fill="none" stroke="#cb986f" opacity="${0.3 - i * 0.01}"/>`;
  return s;
}
for (const [name, paint] of [
  ['orbit', orbit],
  ['tide', tide],
  ['garden', garden],
]) {
  await writeFile(
    new URL(`${name}.svg`, out),
    `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="640" viewBox="0 0 960 640"><title>Original card-glint ${name} illustration</title>${paint()}</svg>\n`,
  );
}
