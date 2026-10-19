/** Upgrade the private frame preview without changing its art, scores or overlays. */
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, mkdir, readdir, symlink, cp } from 'node:fs/promises';
const [baseSite, outputSite, rendererDirectory, poseSource] = process.argv
  .slice(2)
  .map((p) => path.resolve(p));
if (!poseSource)
  throw Error('Usage: studio-gloss-preview.mjs BASE_SITE OUT_SITE RENDERER SURFACE_POSE');
assert.notEqual(baseSite, outputSite);
await mkdir(outputSite, { recursive: true });
for (const name of await readdir(baseSite)) {
  if (['app.js', 'index.html', 'style.css', 'studio-renderer', 'cardforge-motion'].includes(name))
    continue;
  await symlink(path.join(baseSite, name), path.join(outputSite, name));
}
await cp(rendererDirectory, path.join(outputSite, 'studio-renderer'), { recursive: true });
await cp(path.join(baseSite, 'cardforge-motion'), path.join(outputSite, 'cardforge-motion'), {
  recursive: true,
});
await cp(poseSource, path.join(outputSite, 'cardforge-motion/surface-pose.js'));
let app = await readFile(path.join(baseSite, 'app.js'), 'utf8');
function patch(before, after) {
  assert.equal(app.split(before).length, 2, 'Preview source changed: ' + before.slice(0, 70));
  app = app.replace(before, after);
}
patch("from './renderer/browser.js'", "from './studio-renderer/browser.js'");
patch("wasmUrl:'./renderer/renderer_bg.wasm'", "wasmUrl:'./studio-renderer/renderer_bg.wasm'");
patch(
  'surfaceNormal, previewTiltScale',
  'glossNormal, tiltAngles, maximumCombinedTilt, previewTiltScale',
);
patch(
  'const rx=(pointer.y-.5)*.3*previewTiltScale,ry=(pointer.x-.5)*.38*previewTiltScale,sx=Math.sin(rx)',
  'const {x:rx,y:ry}=tiltAngles(pointer,previewTiltScale),sx=Math.sin(rx)',
);
patch(
  'normal:surfaceNormal(pointer,previewTiltScale)',
  'normal:glossNormal(pointer,previewTiltScale)',
);
patch(
  'window.previewPoses=currents.map',
  "window.previewStudio={model:'softbox-v2',rightOnly:false,strengthGain:1.1,maximumCombinedTilt};\n window.previewPoses=currents.map",
);
await writeFile(path.join(outputSite, 'app.js'), app);
let html = await readFile(path.join(baseSite, 'index.html'), 'utf8');
html = html
  .replace(
    'with matching surface treatments.',
    'with matching, subtle softbox gloss and gentler tilt.',
  )
  .replace(
    '<p id="cohort-note">',
    '<p>All three cards use the same pack-fresh softbox gloss. Vertical tilt is reduced and combined tilt is capped at 18°. Lighting is excluded from the scores and flat overlays.</p><p id="cohort-note">',
  );
await writeFile(path.join(outputSite, 'index.html'), html);
await cp(path.join(baseSite, 'style.css'), path.join(outputSite, 'style.css'));
console.log('Shared softbox preview prepared; original assets and flat comparisons retained.');
