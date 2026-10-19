/** Patch a private three-card preview, leaving published renderer controls intact.
 * No reference art or private deployment paths are included in this script. */
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, mkdir, readdir, symlink, cp } from 'node:fs/promises';

const [baseSite, outputSite, rendererDirectory] = process.argv.slice(2).map((p) => path.resolve(p));
if (!rendererDirectory)
  throw Error('Usage: studio-gloss-preview.mjs BASE_SITE OUT_SITE EXPERIMENTAL_RENDERER');
assert.notEqual(baseSite, outputSite);
await mkdir(outputSite, { recursive: true });
// Large art-free frame materials and frozen controls are reused locally.
for (const name of await readdir(baseSite)) {
  if (['app.js', 'index.html', 'style.css', 'studio-renderer'].includes(name)) continue;
  await symlink(path.join(baseSite, name), path.join(outputSite, name));
}
await cp(rendererDirectory, path.join(outputSite, 'studio-renderer'), { recursive: true });
let app = await readFile(path.join(baseSite, 'app.js'), 'utf8');
function patch(before, after) {
  assert.equal(app.split(before).length, 2, 'Preview source changed: ' + before.slice(0, 70));
  app = app.replace(before, after);
}
patch(
  'import { FinishResources }',
  "import { createRenderer as createStudioRenderer } from './studio-renderer/browser.js';\nimport { FinishResources }",
);
patch(
  'let selected,filtered',
  `const studioSurface=$('studio-scene');
const studioRenderer=await createStudioRenderer({canvas:studioSurface,wasmUrl:'./studio-renderer/renderer_bg.wasm',onError:fail});
let selected,filtered`,
);
patch("surface.style.opacity='.45';", "surface.style.opacity=studioSurface.style.opacity='.45';");
patch('renderer.upsertCards(faces.map(', 'const documents=faces.map(');
patch(
  'regions:[]}})));',
  `regions:[]}}));
 renderer.upsertCards(documents.slice(0,2));studioRenderer.upsertCards(documents.slice(2));`,
);
patch(
  'await Promise.all([1,2,3].map(id=>renderer.ready(id,rev)))',
  'await Promise.all([renderer.ready(1,rev),renderer.ready(2,rev),studioRenderer.ready(3,rev)])',
);
patch("surface.style.opacity='1';", "surface.style.opacity=studioSurface.style.opacity='1';");
const studioPose = `
// A real surface pose and off-axis camera reproduce the old projected geometry
// exactly. World units are card heights, so lamp size survives viewport changes.
function studioPose(pointer,vw=surface.width,vh=surface.height,center=2/3,ph=surface.width/3*.94*H/W){
 const rx=(pointer.y-.5)*.3*previewTiltScale,ry=(pointer.x-.5)*.38*previewTiltScale;
 const sx=Math.sin(rx),cx=Math.cos(rx),sy=Math.sin(ry),cy=Math.cos(ry),a=W/H;
 const right=[a*cy,a*sx*sy,-a*cx*sy,0],down=[0,-cx,-sx,0];
 const origin=[0,0,0,1].map((n,i)=>n-(right[i]+down[i])/2);
 const distance=1000/(surface.getBoundingClientRect().width/3*.94*H/W);
 return {transform:[...right,...down,sy,-sx*cy,cx*cy,0,...origin],normal:[sy,-sx*cy,cx*cy],
 projection:[2*ph/vw,0,0,0,0,2*ph/vh,0,0,-center/distance,0,.12/distance,-1/distance,center,0,0,1]};
}
async function exportStudio(){
 const old=[studioSurface.width,studioSurface.height];
 try{
  studioSurface.width=W;studioSurface.height=H;
  const p=studioPose({x:.5,y:.5},W,H,0,H),effects=$('effects').checked;
  studioRenderer.updateScene([{id:3,card:3,finish:effects?'gloss':'regular',cardstock:{amount:effects?.25:0},transform:p.transform,normal:p.normal}]);
  studioRenderer.render({viewProjection:p.projection,clear:[0,0,0,0]});
  return await new Promise((resolve,reject)=>studioSurface.toBlob(b=>b?resolve(b):reject(Error('Preview export failed')),'image/png'));
 }finally{[studioSurface.width,studioSurface.height]=old;dirty=true;}
}
`;
patch('function draw(ms){', studioPose + '\nfunction draw(ms){');
patch(
  'renderer.updateScene(instances);renderer.render(',
  'renderer.updateScene(instances.slice(0,2));renderer.render(',
);
patch(
  'window.previewPoses=currents.map',
  `const studio=studioPose(currents[2]);
 studioRenderer.updateScene([{...instances[2],transform:studio.transform,normal:studio.normal}]);
 studioRenderer.render({viewProjection:studio.projection,pointer:[.5,.5],clear:[0,0,0,0]});
 window.previewStudio={pose:studio,model:'softbox-v1',light:[-.85,1.10,3],rightOnly:true};
 window.previewPoses=currents.map`,
);
patch(
  'const blob=await renderer.exportCard(',
  'const blob=i===2?await exportStudio():await renderer.exportCard(',
);
patch(
  'renderer.dispose();resources.dispose();',
  'renderer.dispose();studioRenderer.dispose();resources.dispose();',
);
await writeFile(path.join(outputSite, 'app.js'), app);
let html = await readFile(path.join(baseSite, 'index.html'), 'utf8');
assert.ok(html.includes('<canvas id="scene"'));
html = html
  .replace(
    'with matching surface treatments.',
    'with a subtle softbox-gloss experiment on the right card.',
  )
  .replace(
    'Reconstructed frame and inner border</small>',
    'Reconstructed frame · softbox gloss</small>',
  )
  .replace('<canvas id="scene"', '<div class="scene-pair"><canvas id="scene"')
  .replace(
    '</canvas><p id="status"',
    '</canvas><canvas id="studio-scene" width="2196" height="1060" aria-hidden="true"></canvas></div><p id="status"',
  )
  .replace(
    '<p id="cohort-note">',
    '<p>The right card uses an experimental fixed softbox and camera with restrained clear varnish. The left and middle retain 0.5.3 lighting. Lighting is excluded from scores and flat overlays.</p><p id="cohort-note">',
  );
await writeFile(path.join(outputSite, 'index.html'), html);
await writeFile(
  path.join(outputSite, 'style.css'),
  (await readFile(path.join(baseSite, 'style.css'), 'utf8')) +
    '\n.scene-pair{position:relative}.scene-pair #studio-scene{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}\n',
);
console.log('Right-card studio preview prepared; frozen controls retained.');
