// Offline native trial of Alpha's long-medium width policy. No renderer values
// or reference transforms are modified. External output pixels stay in OUT.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { readJson, writeJson, hash, sourceHash, root } from './common.mjs';
import { JsTextObjective, nativeGrayCrop } from './abu-type-objective.mjs';
const [native, out] = process.argv.slice(2);
assert(out, 'Usage: abu-rules-width-study.mjs NATIVE_BASELINE OUT');
const input = await readJson(path.join(native, 'inputs.json'));
const capture = await readJson(path.join(native, 'capture.json'));
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), capture.source.rendererHash);
const entries = input.entries.filter(e => e.set === 'lea');
assert.equal(entries.length, 295);
await mkdir(out, { recursive: true });
const source = {
  rendererHash: capture.source.rendererHash,
  baselineCaptureHash: hash(await readFile(path.join(native, 'capture.json'))),
  inputHash: hash(await readFile(path.join(native, 'inputs.json'))),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  candidate: { regularWidthDelta: 8 },
  scope: 'Every Alpha layout checked with the real painter. Changed layouts have paired full native captures; all other layout objects must be identical. Original wording, sources and frozen reference poses retained. Reused development scans, not a new blind holdout; regional indices out of 100.',
};
const session = await openBrowser(input, { plugins: [{
  name: 'alpha-native-width-trial', enforce: 'pre',
  transform(code, id) {
    if (id.endsWith('/early-text-tiers.ts')) {
      const old = '  return earlyTextTierLayout(context, face, base);';
      assert(code.includes(old));
      return code.replace(old, '  return earlyTextTierLayout(context, face, base, { regularWidthDelta: (globalThis as any).__alphaWidth });');
    }
    if (!id.endsWith('/retro-rules.ts')) return;
    const old = `  return adjustCalibrationRules(
    context,
    face,
    alphaTextLayout(context, face, baseRetroTextLayout(context, face)),
  );`;
    assert(code.includes(old));
    return code.replace(old, `  const value=adjustCalibrationRules(context, face, alphaTextLayout(context, face, baseRetroTextLayout(context, face)));
  (globalThis as any).__rulesProbe=value;
  return value;`);
  },
}] });
try {
  const layouts = await session.page.evaluate(async entries => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
    const { loadCanvasFonts } = await import('/games/magic/src/presentation/canvas-assets.ts');
    const { loadRetroFont } = await import('/games/magic/src/presentation/retro-font.ts');
    await Promise.all([loadCanvasFonts(), loadRetroFont()]);
    const { paintRetroFace } = await import('/games/magic/src/presentation/retro-paint.ts');
    const canvas = document.createElement('canvas'); canvas.width=732; canvas.height=1020;
    const c=canvas.getContext('2d'); c.scale(1.5,1.5);
    const draw=(face,width)=>{globalThis.__alphaWidth=width;globalThis.__rulesProbe=null;c.clearRect(0,0,488,680);paintRetroFace(c,face,new Map());return structuredClone(globalThis.__rulesProbe);};
    return entries.map(e=>({id:e.id,before:draw(e.face,undefined),after:draw(e.face,8)}));
  }, entries);
  const rows=[];
  const rect=[77,410,345,195];
  for (const e of entries) {
    const dry=layouts.find(r=>r.id===e.id), changed=JSON.stringify(dry.before)!==JSON.stringify(dry.after);
    const chars=(e.face.rulesAlignment?.reference??e.face.rulesParagraphs??[]).reduce((n,p)=>n+p.runs.reduce((n,r)=>n+r.text.length,0),0);
    if(changed) assert(chars>=180&&chars<=274, 'Unexpected cohort: '+e.name);
    const row={id:e.id,name:e.name,material:e.material,characters:chars,changed,baselineLines:dry.before?.lines.length??0,candidateLines:dry.after?.lines.length??0};
    if(changed || ['Dark Ritual','Nether Shadow','Air Elemental'].includes(e.name)) {
      const rendered=await session.page.evaluate(async ({e, changed})=>{
        const {loadAccuracyImages}=await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const{canvasAssetUrls}=await import('/games/magic/src/presentation/canvas-assets.ts');
        const{composeCardTexture}=await import('/games/magic/src/presentation/canvas-face.ts');
        const lease=await loadAccuracyImages(canvasAssetUrls(e.face),AbortSignal.timeout(30000),e.face.illustration);
        try {
          const render=async width=>{globalThis.__alphaWidth=width;globalThis.__rulesProbe=null;const canvas=await composeCardTexture({face:e.face,printingId:e.id,printedImage:null},'inspect',AbortSignal.timeout(30000),{loadImages:async()=>({...lease,dispose(){}})});const value={png:canvas.toDataURL().split(',')[1],layout:structuredClone(globalThis.__rulesProbe)};canvas.width=canvas.height=0;return value;};
          return {before:await render(undefined),after:changed?await render(8):null};
        }finally{lease.dispose();}
      }, {e, changed});
      assert.deepEqual(rendered.before.layout,dry.before,'Dry painter layout mismatch: '+e.name);
      const bytes=Buffer.from(rendered.before.png,'base64'),base=capture.rows.find(r=>r.id===e.id);
      assert.equal(hash(bytes),base.renderHash,'Native baseline mismatch: '+e.name);
      row.baselineRenderHash=hash(bytes);
      if(changed){
        assert.deepEqual(rendered.after.layout,dry.after);
        const nextBytes=Buffer.from(rendered.after.png,'base64'),before=PNG.sync.read(bytes),after=PNG.sync.read(nextBytes);
        let outside=0,pixels=0;
        for(let y=0;y<after.height;y++)for(let x=0;x<after.width;x++){
          const i=(y*after.width+x)*4;if(![0,1,2,3].some(k=>before.data[i+k]!==after.data[i+k]))continue;pixels++;
          if(x<50*1.5||x>=450*1.5||y<405*1.5||y>=610*1.5)outside++;
        }
        assert.equal(outside,0,'Changed non-rules pixels: '+e.name);
        const scanBytes=await readFile(path.join(native,'lea',e.id+'-scan.png'));assert.equal(hash(scanBytes),base.scanHash);
        const scan=PNG.sync.read(scanBytes),objective=new JsTextObjective(nativeGrayCrop(scan,rect),rect[2],rect[3]);
        const a=objective.score(nativeGrayCrop(before,rect)),b=objective.score(nativeGrayCrop(after,rect));
        Object.assign(row,{candidateRenderHash:hash(nextBytes),changedPixels:pixels,outsideRules:outside,scoreBefore100:a[0]*100,scoreAfter100:b[0]*100,delta100:(b[0]-a[0])*100,chamferBefore:a[4],chamferAfter:b[4],referenceHash:e.reference.sha256,poseHash:base.poseHash});
        const {writeFile}=await import('node:fs/promises');await writeFile(path.join(out,e.id+'.png'),nextBytes);
      }
    }
    rows.push(row);
    await writeJson(path.join(out,'study.json'),{source,rect,rows,layouts});
    if(changed) console.log(JSON.stringify(row));
  }
  assert.deepEqual(session.faults,[]);
  const affected=rows.filter(r=>r.changed),mean=key=>affected.reduce((n,r)=>n+r[key],0)/affected.length;
  const summary={printings:rows.length,changed:affected.length,unchanged:rows.length-affected.length,before100:mean('scoreBefore100'),after100:mean('scoreAfter100'),improved:affected.filter(r=>r.delta100>0).length,regressedHalfPoint:affected.filter(r=>r.delta100<-.5).map(r=>({name:r.name,delta:r.delta100}))};
  await writeJson(path.join(out,'study.json'),{source,rect,summary,rows,layouts});console.log(JSON.stringify(summary));
}finally{await session.close();}
