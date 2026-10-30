import { createRenderer, IDENTITY } from './browser.js';
import {
  magic,
  disclaimer,
  printingPresets,
  printingPresetCompatibility,
  resolvePrintingPreset,
} from './magic.js';
const source = {
  name: 'Remembered Horizon',
  typeLine: 'Creature — Spirit',
  colors: ['U'],
  manaSymbols: ['2', 'U'],
  rulesText: 'Flying\nWhen this creature enters, draw a card.',
  power: '2',
  toughness: '3',
  setCode: 'GLINT',
  rarity: 'rare',
  artist: 'Original showcase illustration',
  collectorNumber: '42',
  illustration: new URL('./art/orbit.webp', location.href).href,
};
const $ = (id) => document.getElementById(id),
  renderer = await createRenderer({
    canvas: $('card'),
    invalidate: paint,
    wasmUrl: new URL('./renderer_bg.wasm', import.meta.url),
  });
let preset = 'm21',
  revision = 0,
  active = 0,
  pointer = [0.5, 0.5],
  selectedOverrides = {};
$('notice').textContent = disclaimer;
function paint() {
  if (!active) return;
  renderer.updateScene([
    {
      id: 1,
      card: active,
      finish: $('finish').value,
      transform: [1.84, 0, 0, 0, 0, -1.84, 0, 0, 0, 0, 1, 0, -0.92, 0.92, 0, 1],
    },
  ]);
  renderer.render({ viewProjection: IDENTITY, pointer });
}
function overrides() {
  const out = {};
  for (const [id, key] of [
    ['artist', 'artist'],
    ['legal', 'legalText'],
    ['number', 'collectorNumber'],
    ['language', 'collectorLanguage'],
    ['symbol', 'setSymbol'],
    ['mana', 'symbolStyle'],
  ])
    if ($(id).value) out[key] = $(id).value;
  if ($('total').value) out.collectorTotal = Number($('total').value);
  const elements = {};
  for (const key of ['artist', 'legal', 'collector', 'manaCost', 'setSymbol']) {
    const hidden = !$(key + '-visible').checked,
      dx = Number($(key + '-x').value),
      dy = Number($(key + '-y').value);
    if (hidden || dx || dy)
      elements[key] = { ...(hidden ? { hidden } : {}), ...(dx || dy ? { offset: [dx, dy] } : {}) };
  }
  if (Object.keys(elements).length) out.elements = elements;
  return out;
}
async function preview(id) {
  const request = ++revision;
  try {
    const face = resolvePrintingPreset(source, { preset: id, overrides: selectedOverrides });
    $('status').textContent = 'Preparing ' + printingPresets.find((p) => p.id === id).label + '…';
    renderer.upsertCards([{ id: request, revision: 1, recipe: magic.describe(face, 'inspect') }]);
    await renderer.ready(request, 1);
    if (request !== revision) {
      renderer.releaseCards(new Uint32Array([request]));
      return;
    }
    const previous = active;
    active = request;
    paint();
    await renderer.ready(request, 1);
    if (request !== revision) return;
    paint();
    if (previous) renderer.releaseCards(new Uint32Array([previous]));
    $('status').textContent = 'Preview: ' + printingPresets.find((p) => p.id === id).label;
  } catch (error) {
    if (request === revision) $('status').textContent = error.message;
    renderer.releaseCards(new Uint32Array([request]));
  }
}
for (const entry of printingPresets) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = entry.label;
  const support = printingPresetCompatibility(source, entry.id);
  button.disabled = !support.supported;
  button.title = support.reason || entry.note;
  button.dataset.preset = entry.id;
  button.setAttribute('aria-pressed', String(entry.id === preset));
  button.onpointerenter = (e) => {
    if (e.pointerType !== 'touch') void preview(entry.id);
  };
  button.onfocus = () => void preview(entry.id);
  button.onclick = () => {
    preset = entry.id;
    for (const b of $('presets').children) b.setAttribute('aria-pressed', String(b === button));
    void preview(preset);
  };
  $('presets').append(button);
}
$('presets').onpointerleave = () => void preview(preset);
for (const [key, label] of [
  ['artist', 'Artist credit'],
  ['legal', 'Copyright'],
  ['collector', 'Collector information'],
  ['manaCost', 'Mana cost'],
  ['setSymbol', 'Set symbol'],
]) {
  const field = document.createElement('fieldset'),
    legend = document.createElement('legend');
  legend.textContent = label;
  field.append(legend);
  const visible = document.createElement('label');
  visible.append('Show ');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = true;
  checkbox.id = key + '-visible';
  visible.append(checkbox);
  field.append(visible);
  for (const [axis, title] of [
    ['x', 'Horizontal offset'],
    ['y', 'Vertical offset'],
  ]) {
    const l = document.createElement('label');
    l.append(title);
    const n = document.createElement('input');
    n.type = 'number';
    n.min = '-100';
    n.max = '100';
    n.value = '0';
    n.id = key + '-' + axis;
    l.append(n);
    field.append(l);
  }
  $('elements').append(field);
}
document.querySelector('details').oninput = () => {
  selectedOverrides = overrides();
  void preview(preset);
};
$('reset').onclick = () => {
  for (const input of document.querySelectorAll('details input'))
    if (input.type === 'checkbox') input.checked = true;
    else input.value = input.id.endsWith('-x') || input.id.endsWith('-y') ? '0' : '';
  $('mana').value = '';
  selectedOverrides = {};
  void preview(preset);
};
$('finish').onchange = paint;
$('card').onpointermove = (e) => {
  const r = $('card').getBoundingClientRect();
  pointer = [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height];
  paint();
};
$('card').onpointerleave = () => {
  pointer = [0.5, 0.5];
  paint();
};
$('download').onclick = async () => {
  if (!active) return;
  const blob = await renderer.exportCard(active, {
      revision: 1,
      width: 732,
      finish: $('finish').value,
      pointer,
    }),
    url = URL.createObjectURL(blob),
    link = document.createElement('a');
  link.href = url;
  link.download = 'printing-preset.png';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
};
window.addEventListener('pagehide', () => renderer.dispose(), { once: true });
await preview(preset);
