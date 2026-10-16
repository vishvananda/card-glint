import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import os from 'node:os';
import { build } from 'vite';
const root = process.cwd(),
  temporary = await mkdtemp(path.join(os.tmpdir(), 'card-glint-consumer-'));
try {
  const packed = JSON.parse(
    execFileSync('npm', ['pack', '--json', '--pack-destination', temporary], { encoding: 'utf8' }),
  )[0];
  await writeFile(
    path.join(temporary, 'package.json'),
    JSON.stringify({ name: 'consumer', private: true, type: 'module' }),
  );
  execFileSync(
    'npm',
    [
      'install',
      '--ignore-scripts',
      '--no-audit',
      '--no-fund',
      path.join(temporary, packed.filename),
    ],
    { cwd: temporary, stdio: 'pipe' },
  );
  // Import the published entry point in Node: the wording resolver needs no
  // browser globals, source checkout, provider access or accuracy fixtures.
  execFileSync(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `
    import assert from 'node:assert/strict';
    import { resolvePrintingWording, resolvePrintingPreset, resolveScryfallPrinting } from 'card-glint/magic';
    const oracle = {typeLine:'Creature', rulesText:'Oracle rules.'};
    const result = resolvePrintingWording('f594b7aa-d44e-47c4-989b-565f881e25f1', {oracle, original:oracle});
    assert.equal(result.wordings.oracle.rulesText, oracle.rulesText);
    assert.equal(result.wordings.original.typeLine, 'Continuous Artifact');
    assert.equal(result.provenance.status, 'applied');
    const face = resolvePrintingPreset({name:'Probe',typeLine:'Instant',colors:['U']}, {preset:'plc-colorshifted',overrides:{collectorNumber:'7',elements:{artist:{hidden:true}}}});
    assert.equal(face.frameTreatment, 'colorshifted');
    assert.equal(resolveScryfallPrinting({frame:'future'}).frameTemplate, 'future');
  `,
    ],
    { cwd: temporary, stdio: 'inherit' },
  );
  await writeFile(
    path.join(temporary, 'index.ts'),
    `
import { createRenderer, IDENTITY, type CardDocument } from 'card-glint';
import { showcase } from 'card-glint/showcase';
import { magic, opticalDocument, resolvePrintingWording, withCardWording, resolvePrintingPreset, printingPresets, type PrintingSelection, type MagicCard, type PrintingText } from 'card-glint/magic';
import 'card-glint/magic/fonts.css';
import { faceArtBounds, composeCardTexture } from 'card-glint/magic/presentation';
import { foilShader } from 'card-glint/finish';
import { createPixelKernels } from 'card-glint/kernels';
export { faceArtBounds, composeCardTexture, foilShader, createPixelKernels };
import wasmUrl from 'card-glint/renderer.wasm?url';
const face: MagicCard = {name:'Example', typeLine:'Creature — Wizard', colors:['U'],power:'2',toughness:'2',blackBorderLift:0.03,printingOmissions:[{rect:[0.1,0.1,0.4,0.1],texts:['Example']}]};
const selection: PrintingSelection = {preset:printingPresets[0]!.id,overrides:{collectorNumber:'7',elements:{artist:{offset:[2,0]}}}};
export const presetFace = resolvePrintingPreset(face, selection);
const source: PrintingText = {typeLine:'Creature', rulesText:'', flavorText:'A fixture.'};
export const resolved = resolvePrintingWording('unknown-printing', {oracle:source, original:source});
export const magicRecipe = magic.describe(withCardWording(face,resolved.wordings),'inspect');
export const opticalRecipe = opticalDocument(2,1,face,'silver');
export async function example(canvas: HTMLCanvasElement) {
  const renderer = await createRenderer({ canvas, wasmUrl });
  const cards: CardDocument[] = [{id:1,revision:1,recipe:showcase.describe({name:'Compass',subtitle:'Instrument',theme:'orbit',charge:3,serial:'001',illustration:'/art/orbit.svg',rules:'Find a path.'},'table')}];
  renderer.upsertCards(cards);
  await renderer.ready(1, 1);
  renderer.updateScene([{id:1,card:1,transform:Array.from(IDENTITY),finish:'gloss',cardstock:{amount:0.2},printDots:{amount:0.15,period:7,variation:0.3,inset:0.04}}]);
  renderer.render({ viewProjection: IDENTITY });
  renderer.dispose();
}
`,
  );
  await writeFile(
    path.join(temporary, 'assets.d.ts'),
    `declare module '*.wasm?url' { const url: string; export default url; }\n`,
  );
  execFileSync(
    process.execPath,
    [
      path.join(root, 'node_modules/typescript/bin/tsc'),
      '--noEmit',
      '--strict',
      '--target',
      'ES2022',
      '--module',
      'NodeNext',
      '--moduleResolution',
      'NodeNext',
      'index.ts',
      'assets.d.ts',
    ],
    { cwd: temporary, stdio: 'inherit' },
  );
  await build({
    configFile: false,
    root: temporary,
    build: {
      target: 'es2022',
      assetsInlineLimit: 0,
      rollupOptions: { input: path.join(temporary, 'index.ts'), preserveEntrySignatures: 'strict' },
    },
  });
  const manifest = JSON.parse(await readFile('package.json', 'utf8'));
  console.log(
    `${manifest.name}: tarball ${packed.size} bytes; independent TypeScript and Vite consumer passed.`,
  );
} finally {
  await rm(temporary, { recursive: true, force: true });
}
