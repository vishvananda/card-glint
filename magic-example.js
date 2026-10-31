import { createRenderer, IDENTITY } from './browser.js';
import { magic, disclaimer } from './magic.js';

const canvas = document.querySelector('#card');
const editor = document.querySelector('#face');
const status = document.querySelector('#status');
document.querySelector('#notice').textContent = disclaimer;
editor.value = JSON.stringify(
  {
    name: 'Example Adept',
    typeLine: 'Creature — Human Wizard',
    colors: ['U'],
    manaSymbols: ['2', 'U'],
    rulesText: 'When this creature enters, draw a card.',
    power: '2',
    toughness: '2',
    setCode: 'GLINT',
    rarity: 'uncommon',
    frameStyle: 'modern',
    borderColor: 'black',
    illustration: new URL('./art/orbit.webp', location.href).href,
  },
  null,
  2,
);
const renderer = await createRenderer({ canvas, invalidate: paint });
let revision = 0;
let pointer = [0.5, 0.5];
function paint() {
  renderer.updateScene([
    {
      id: 1,
      card: 1,
      finish: document.querySelector('#finish').value,
      transform: [1.84, 0, 0, 0, 0, -1.84, 0, 0, 0, 0, 1, 0, -0.92, 0.92, 0, 1],
    },
  ]);
  renderer.render({ viewProjection: IDENTITY, pointer });
}
async function draw() {
  try {
    const face = JSON.parse(editor.value);
    if (typeof face.name !== 'string' || typeof face.typeLine !== 'string')
      throw Error('Supply name and typeLine strings.');
    status.textContent = 'Preparing face…';
    const requested = ++revision;
    renderer.upsertCards([{ id: 1, revision: requested, recipe: magic.describe(face, 'inspect') }]);
    await renderer.ready(1, requested);
    if (revision !== requested) return;
    paint();
    status.textContent = 'Ready. Move over the card to change the reflection.';
  } catch (error) {
    status.textContent = error.message;
  }
}
document.querySelector('#draw').onclick = draw;
document.querySelector('#finish').onchange = paint;
canvas.onpointermove = (event) => {
  const rect = canvas.getBoundingClientRect();
  pointer = [(event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height];
  paint();
};
window.addEventListener('pagehide', () => renderer.dispose(), { once: true });
await draw();
