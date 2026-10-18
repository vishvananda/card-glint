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
    import { createDisplayRaster, printSamplingVersion, holofoilVersion } from 'card-glint';
    assert.equal(holofoilVersion,1);
    assert.equal(typeof createDisplayRaster,'function');
    assert.equal(printSamplingVersion,1);
    import { FinishResources, SURFACE_GLSL, WORN_GLSL, SurfaceMotion, surfaceSeed } from 'card-glint/finish';
    import { canvasFontAssets, canvasAssetUrls, faceManaAssets, setAssetFetcher } from 'card-glint/magic/presentation';
    for(const fn of [FinishResources, SurfaceMotion, surfaceSeed, canvasAssetUrls, faceManaAssets, setAssetFetcher]) assert.equal(typeof fn,'function');
    assert.ok(SURFACE_GLSL.length>0 && WORN_GLSL.length>0);
    assert.ok(canvasFontAssets.length>0 && canvasFontAssets.every(font=>font.family && font.url));
    import { artworkFoilMask, resolvePrintingWording, resolvePrintingArtist, resolvePrintingPreset, resolveScryfallPrinting, fromScryfallCard, fromMtgjsonCard, artworkGeometry, resolveArtPlacement, printingStyles, resolvePrintingStyle, composePrintingSelection, validatePrintingStyle, resolvePrintingCalibration, printingCalibrationOptions, printingCalibrationApiVersion } from 'card-glint/magic';
    assert.equal(typeof artworkFoilMask,'function');
    assert.equal(printingCalibrationApiVersion,1);
    const calibrated={name:'Calibration probe',setCode:'NEO',colors:['R'],calibration:'auto'};
    assert.equal(resolvePrintingCalibration(calibrated).components.border.color,'#16130e');
    assert.equal(printingCalibrationOptions(calibrated)[0].supported,true);
    const oracle = {typeLine:'Creature', rulesText:'Oracle rules.'};
    const result = resolvePrintingWording('f594b7aa-d44e-47c4-989b-565f881e25f1', {oracle, original:oracle});
    assert.equal(result.wordings.oracle.rulesText, oracle.rulesText);
    assert.equal(result.wordings.original.typeLine, 'Continuous Artifact');
    assert.equal(result.provenance.status, 'applied');
    const artist = resolvePrintingArtist('0faa005e-c753-4484-bf64-349350d59094', 'Dan Murayama Scott');
    assert.equal(artist.artist, 'Dan Scott');
    assert.equal(artist.provenance.status, 'applied');
    const face = resolvePrintingPreset({name:'Probe',typeLine:'Instant',colors:['U']}, {preset:'plc-colorshifted',overrides:{calibration:'auto',collectorNumber:'7',elements:{artist:{hidden:true}}}});
    assert.equal(face.frameTreatment, 'colorshifted');
    assert.equal(resolveScryfallPrinting({frame:'future'}).frameTemplate, 'future');
    const art = resolveArtPlacement(face,{mode:'window',zoom:2,focalPoint:[.3,.6]});
    assert.ok(artworkGeometry(art,400,1000).destination[2]>0);
    assert.equal(fromScryfallCard({name:'Package probe',type_line:'Instant',oracle_text:'Draw a card.',mana_cost:'{U}'}).manaSymbols[0],'U');assert.equal(fromMtgjsonCard({name:'Package probe',type:'Instant',text:'Draw a card.',manaCost:'{U}'}).manaSymbols[0],'U');
    const style=validatePrintingStyle(printingStyles.find(s=>s.id==='fut'));assert.equal(style.frames.length,4);assert.equal(resolvePrintingStyle({...face,frameTemplate:'future'},style).frame,'futureshifted');assert.equal(composePrintingSelection({preset:'lea'},{overrides:{frameColors:['B']}}).overrides.frameColors[0],'B');
  `,
    ],
    { cwd: temporary, stdio: 'inherit' },
  );
  await writeFile(
    path.join(temporary, 'index.ts'),
    `
import { createRenderer, createDisplayRaster, printSamplingVersion, IDENTITY, type CardDocument, type DisplayRaster } from 'card-glint';
export { createDisplayRaster, printSamplingVersion, type DisplayRaster };
import { showcase } from 'card-glint/showcase';
import { magic, opticalDocument, resolvePrintingWording, resolvePrintingArtist, type ResolvedPrintingArtist, withCardWording, resolvePrintingPreset, printingPresets, printingStyles, resolvePrintingStyle, type PrintingStyle, type PrintingSelection, fromScryfallCard, fromMtgjsonCard, type CardImportOptions, type MagicCard, type PrintingText } from 'card-glint/magic';
import 'card-glint/magic/fonts.css';
import { faceArtBounds, composeCardTexture, type CardTextureInput } from 'card-glint/magic/presentation';
import { foilShader, FinishResources, PRINT_DOTS_GLSL, CARDSTOCK_GLSL } from 'card-glint/finish';
import type { FinishMap } from 'card-glint/finish';
import { createPixelKernels } from 'card-glint/kernels';
export { faceArtBounds, composeCardTexture, foilShader, FinishResources, PRINT_DOTS_GLSL, CARDSTOCK_GLSL, createPixelKernels };
export function uploadFinishMap(gl: WebGL2RenderingContext, map: FinishMap, srgb: boolean) {
  gl.texImage2D(gl.TEXTURE_2D, 0, srgb ? gl.SRGB8_ALPHA8 : gl.RGBA8, map.width, map.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, map.data);
}
export const hostInk: CardTextureInput = {printingId:null,printedImage:null,face:{name:'Host',canonicalTypeLine:'Creature',borderThickness:0.08,textInk:{stats:[{start:0,end:1,color:'#f00'}]}},rulesText:false};
export const composeHostInk = (signal: AbortSignal) => composeCardTexture(hostInk, 'table', signal);
import wasmUrl from 'card-glint/renderer.wasm?url';
const face: MagicCard = {name:'Example', typeLine:'Creature — Wizard', colors:['U'],power:'2',toughness:'2',borderThickness:0.125,blackBorderLift:0.03,setSymbolMask:'ink',printingOmissions:[{rect:[0.1,0.1,0.4,0.1],texts:['Example']}]};
const selection: PrintingSelection = {preset:printingPresets[0]!.id,overrides:{calibration:'auto',collectorNumber:'7',elements:{artist:{offset:[2,0]}}}};
export const presetFace = resolvePrintingPreset(face, selection);
const importOptions:CardImportOptions={wording:'oracle'};export const imported=fromScryfallCard({name:'Probe',type_line:'Instant'},importOptions);export const importedMtgjson=fromMtgjsonCard({name:'Probe',type:'Instant'});
const style:PrintingStyle=printingStyles[0]!;export const styleFace=resolvePrintingStyle(face,style,{overrides:{frameColors:['R']}}).face;
const source: PrintingText = {typeLine:'Creature', rulesText:'', flavorText:'A fixture.'};
export const resolved = resolvePrintingWording('unknown-printing', {oracle:source, original:source});
export const credit: ResolvedPrintingArtist = resolvePrintingArtist('unknown-printing', face.artist);
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
