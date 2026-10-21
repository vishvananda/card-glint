import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
assert(
  process.argv[2],
  'Usage: node games/magic/tools/accuracy/print-texture-candidates.mjs STUDY_DIRECTORY',
);
const out = path.resolve(process.argv[2]);
let dots = (await readFile('packages/browser/src/gpu/print-dots.ts', 'utf8')).match(
  /export const PRINT_DOTS_GLSL = \x60([\s\S]*)\x60;/,
)[1];
dots = dots.replace(
  'max(.015,printFootprint*.4)',
  'max(.015,length(vec2(printSpread,printFootprint*.4)))',
);
dots = dots.replace(
  'float k=1.-max(max(ink.r,ink.g),ink.b);',
  'float k=(1.-max(max(ink.r,ink.g),ink.b))*blackFraction;',
);
dots = dots.replace(
  'float inkScreen(vec2 p,float ink,vec2 axis,float channel){',
  'float plateScreen(vec2 p,float ink,vec2 axis,float channel){',
);
dots = dots.replace(
  'vec3 printDotInk(vec3 ink,vec2 uv){',
  'float inkScreen(vec2 p,float ink,vec2 axis,float channel){float absorption=1.-inkTransparency*(1.-ink);return absorption*plateScreen(p,ink/absorption,axis,channel);}\nvec3 printDotInk(vec3 ink,vec2 uv){',
);
dots = dots.replace(
  'length(vec2(printSpread,printFootprint*.4))',
  'length(vec2(studyDotSpread,printFootprint*.4))',
);
dots = dots.replace(
  'vec3 printDotInk(vec3 ink,vec2 uv){',
  'float patchNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(plateNoise(i,39.),plateNoise(i+vec2(1.,0.),39.),f.x),mix(plateNoise(i+vec2(0.,1.),39.),plateNoise(i+1.,39.),f.x),f.y);}\nvec3 printDotInk(vec3 ink,vec2 uv){\n studyDotSpread=mix(studyBlurRange.x,studyBlurRange.y,smoothstep(.1,.9,patchNoise(vec2(uv.x,1.-uv.y)*studyPatchScale+vec2(13.2,7.4))));',
);
dots = dots.replace(
  'if(visible<=0.)return ink;',
  'visible*=mix(1.,smoothstep(.38,.62,patchNoise(vec2(uv.x,1.-uv.y)*vec2(7.,10.)+vec2(13.2,7.4))),studyPattern.z);\n if(visible<=0.)return ink;',
);
dots = dots.replace(
  'float k=',
  'p.y*=studyPattern.y;float c=cos(studyPattern.x),s=sin(studyPattern.x);p=mat2(c,s,-s,c)*p;\n float k=',
);
dots = dots.replace(
  'return absorption*plateScreen(p,ink/absorption,axis,channel);',
  'float coverage=ink/absorption;coverage=clamp(coverage-studyGapBoost*coverage*(1.-coverage),0.,1.);return absorption*plateScreen(p,coverage,axis,channel);',
);
dots = dots.replace(
  'vec3 printDotInk(vec3 ink,vec2 uv){',
  'vec3 printDotInk(vec3 ink,vec2 uv){\n float brightness=dot(ink,vec3(.2126,.7152,.0722));studyGapBoost=(studyGapParameters.x+studyGapParameters.y*smoothstep(.18,.9,brightness))*smoothstep(.1,.35,brightness);',
);
dots = dots.replace(
  'float inkScreen(vec2 p,float ink,vec2 axis,float channel){',
  'float registrationNoise(vec2 p,float channel){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(plateNoise(i,71.+channel),plateNoise(i+vec2(1.,0.),71.+channel),f.x),mix(plateNoise(i+vec2(0.,1.),71.+channel),plateNoise(i+1.,71.+channel),f.x),f.y);}\nvec2 plateRegistration(float channel){if(all(equal(studyRegistration,vec2(0.))))return vec2(0.);vec2 base=channel<3.?vec2(-.30,.12):channel<7.?vec2(.20,-.22):channel<11.?vec2(.08,.26):vec2(-.05,-.03);vec2 drift=vec2(0.);if(studyRegistration.y>0.){vec2 p=studyRegistrationUv*vec2(8.,11.);drift=(vec2(registrationNoise(p,channel),registrationNoise(p+17.3,channel+31.))-.5)*studyRegistration.y;}return (base*studyRegistration.x+drift)/printDotsInfo.y;}\nfloat inkScreen(vec2 p,float ink,vec2 axis,float channel){p+=plateRegistration(channel);',
);
dots = dots.replace(
  'vec3 printDotInk(vec3 ink,vec2 uv){',
  'vec3 printDotInk(vec3 ink,vec2 uv){\n studyRegistrationUv=vec2(uv.x,1.-uv.y);',
);
dots = dots.replace(
  'return mix(ink,screened,printDotsInfo.x*visible);',
  'if(all(equal(studySeparation,vec3(1.))))return mix(ink,screened,printDotsInfo.x*visible);\n vec3 delta=screened-ink;float baseY=dot(ink,vec3(.2126,.7152,.0722)),dy=dot(delta,vec3(.2126,.7152,.0722));float factor=dy>=0.?studySeparation.x:studySeparation.y*pow(clamp(-dy/max(baseY,.05),.00001,1.),studySeparation.z-1.);factor=mix(1.,factor,smoothstep(.1,.35,baseY));return clamp(ink+delta*factor*printDotsInfo.x*visible,0.,1.);',
);

// Stable press-like irregularity: independent plates, ragged impression edges,
// small directional ink spread. This is an experiment, not an ICC press model.
dots = dots.replace(
  'return 1.-smoothstep(radius-aa,radius+aa,length(cell));',
  `
 if(studyPhysical.y>0.){
  float phase=plateNoise(id,channel+83.)*6.2831853;
  float theta=atan(cell.y,cell.x);
  radius*=1.+studyPhysical.y*(.035*sin(3.*theta+phase)+.018*sin(5.*theta-phase));
 }
 return 1.-smoothstep(radius-aa,radius+aa,length(cell));`,
);
dots = dots.replace(
  'return absorption*plateScreen(p,coverage,axis,channel);',
  `
 if(studyPhysical.x<=0.)return absorption*plateScreen(p,coverage,axis,channel);
 // Smooth fixed density variation, not screen-space white noise or animation.
 coverage=clamp(coverage+studyPhysical.z*(registrationNoise(p*.43,channel+53.)-.5)*coverage*(1.-coverage),0.,1.);
 vec2 drag=vec2(0.,studyPhysical.x)/printDotsInfo.y;
 return absorption*(.25*plateScreen(p-drag,coverage,axis,channel)+.5*plateScreen(p,coverage,axis,channel)+.25*plateScreen(p+drag,coverage,axis,channel));`,
);

// Blog-inspired comparison: derive a dot's color from its rotated cell center.
// Existing production CMYK conversion, angles and neighbor union stay intact.
// Reference: Maxime Heckel, Shades of Halftone, and Paper's retro-print article.
dots = dots.replace(
  'float absorption=1.-inkTransparency*(1.-ink);',
  `
 if(studyCellSampling>.5){
  mat2 rotation=mat2(axis.x,axis.y,-axis.y,axis.x);
  vec2 center=transpose(rotation)*(floor(rotation*p)+.5);
  vec2 paper=center*printDotsInfo.y/printScreenSize();
  vec3 sampled=previewInk(GLINT_PRINT_FACE(vec2(paper.x,1.-paper.y)).rgb);
  float key=(1.-max(max(sampled.r,sampled.g),sampled.b))*blackFraction;
  vec3 cmy=clamp((1.-sampled-key)/max(1.-key,.0001),0.,1.);
  ink=channel<3.?cmy.r:channel<7.?cmy.g:channel<11.?cmy.b:key;
 }
 float absorption=1.-inkTransparency*(1.-ink);`,
);

// Blur the completed separation pattern, including its sharp light/dark tails.
// Keep the center's underlying ink fixed so text and frame edges stay sharp.
dots = dots.replace(
  'vec3 printDotInk(vec3 ink,vec2 uv){',
  'vec3 studyRawDotInk(vec3 ink,vec2 uv){',
);
dots = dots.replace(
  'vec4 printFace(vec2 uv){',
  `
vec3 printDotInk(vec3 ink,vec2 uv){
 if(studyGlobalBlur<=0.)return studyRawDotInk(ink,uv);
 vec2 stepUv=vec2(studyGlobalBlur)/printScreenSize();
 vec3 result=vec3(0.);
 for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
  float weight=(x==0?2.:1.)*(y==0?2.:1.)/16.;
  result+=weight*studyRawDotInk(ink,uv+vec2(float(x),float(y))*stepUv);
 }
 return result;
}
vec4 printFace(vec2 uv){`,
);

let fragment = (await readFile('packages/browser/src/gpu/printed-ink.ts', 'utf8'))
  .match(/const fragment = \x60([\s\S]*?)\x60;\nconst limit/)[1]
  .replace(
    /\$\{PRINT_DOTS_GLSL.replace\([^\n]*\)\}/,
    dots.replace('flat in vec4 printDotsInfo;', 'uniform vec4 printDotsInfo;'),
  )
  .replace(
    'uniform sampler2D face;',
    'uniform sampler2D face;uniform float printSpread;uniform float blackFraction;uniform float inkTransparency;uniform vec3 studyPattern;uniform vec2 studyBlurRange;uniform vec2 studyPatchScale;float studyDotSpread;uniform vec2 studyGapParameters;float studyGapBoost;uniform vec2 studyRegistration;vec2 studyRegistrationUv;uniform vec3 studySeparation;uniform float studyGlobalBlur;uniform vec3 studyPhysical;uniform float studyCellSampling;',
  );
const base = {
  amount: 0.35,
  period: 2,
  variation: 0.5,
  spread: 0.08,
  blackFraction: 1,
  inkTransparency: 0.65,
  angle: 0,
  stretch: 1,
  masked: 0,
  blur: [0.06, 0.14],
  patchScale: [21, 30],
  gaps: [0.03, 0.24],
  registration: [0, 0],
  separation: [2.3, 3, 1.8],
  globalBlur: 0,
  physical: [0, 0, 0],
};
const variants = [
  { ...base, id: 'strong-soft-control', label: 'Unchanged stronger separation control' },
  {
    ...base,
    id: 'f-strong-soft',
    label: 'Stronger separation + global softness',
    globalBlur: 0.45,
  },
  {
    ...base,
    id: 'f-strong-softer',
    label: 'Stronger separation + more global softness',
    globalBlur: 0.7,
  },
  {
    ...base,
    id: 'cmyk-press',
    label: 'CMYK plate spread + irregular ink',
    registration: [1, 0.28],
    separation: [1, 1, 1],
    globalBlur: 0.45,
    physical: [0.3, 0.75, 0.08],
  },
  {
    ...base,
    id: 'cmyk-press-strong',
    label: 'CMYK plate spread + stronger separation',
    registration: [1, 0.28],
    globalBlur: 0.45,
    physical: [0.3, 0.75, 0.08],
  },
  {
    ...base,
    id: 'cmyk-cell-center',
    label: 'CMYK cell-centered dots + soft spread',
    registration: [1, 0.28],
    separation: [1, 1, 1],
    globalBlur: 0.45,
    physical: [0.3, 0.75, 0.08],
    cellSampling: 1,
  },
  {
    ...base,
    id: 'cmyk-cell-strong',
    label: 'CMYK cell-centered dots + stronger separation',
    registration: [1, 0.28],
    globalBlur: 0.45,
    physical: [0.3, 0.75, 0.08],
    cellSampling: 1,
  },
];
const numbers = (await readdir(out))
  .flatMap((file) => {
    const m = /^face-(\d+)\.png$/.exec(file);
    return m ? [Number(m[1])] : [];
  })
  .sort((a, b) => a - b);
assert(numbers.length, 'Expected native 732x1020 face-NUMBER.png inputs');
const sources = [];
await mkdir(out + '/preview', { recursive: true });
const browser = await chromium.launch({
  args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
});
try {
  const page = await browser.newPage();
  for (const number of numbers) {
    const bytes = await readFile(out + '/face-' + number + '.png');
    const decoded = PNG.sync.read(bytes);
    assert.equal(decoded.width, 732);
    assert.equal(decoded.height, 1020);
    sources.push({ number, sha256: createHash('sha256').update(bytes).digest('hex') });
    const rows = await page.evaluate(
      async ({ fragment, png, variants }) => {
        const image = await createImageBitmap(
          await (await fetch('data:image/png;base64,' + png)).blob(),
        );
        const c = document.createElement('canvas');
        c.width = 732;
        c.height = 1020;
        const gl = c.getContext('webgl2');
        const program = gl.createProgram();
        for (const [type, src] of [
          [
            gl.VERTEX_SHADER,
            '#version 300 es\nout vec2 uv;void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);uv=p;gl_Position=vec4(p*2.-1.,0.,1.);}',
          ],
          [gl.FRAGMENT_SHADER, fragment],
        ]) {
          const s = gl.createShader(type);
          gl.shaderSource(s, src);
          gl.compileShader(s);
          if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(s));
          gl.attachShader(program, s);
          gl.deleteShader(s);
        }
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS))
          throw Error(gl.getProgramInfoLog(program));
        const input = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, input);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        // Flip a Canvas source, matching FinishPrinting's ImageBitmap->canvas contract.
        const src = document.createElement('canvas');
        src.width = 732;
        src.height = 1020;
        src.getContext('2d').drawImage(image, 0, 0);
        image.close();
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.SRGB8_ALPHA8, gl.RGBA, gl.UNSIGNED_BYTE, src);
        const output = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, output);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.SRGB8_ALPHA8,
          732,
          1020,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          null,
        );
        const fb = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, output, 0);
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE)
          throw Error('FBO');
        gl.useProgram(program);
        gl.bindTexture(gl.TEXTURE_2D, input);
        gl.uniform1i(gl.getUniformLocation(program, 'face'), 0);
        gl.uniform1f(gl.getUniformLocation(program, 'printArtwork'), 1);
        gl.viewport(0, 0, 732, 1020);
        gl.disable(gl.DITHER);
        gl.enable(gl.SCISSOR_TEST);
        const result = [];
        for (const v of variants) {
          gl.uniform4f(
            gl.getUniformLocation(program, 'printDotsInfo'),
            v.amount,
            v.period,
            v.variation,
            0.035,
          );
          gl.uniform1f(gl.getUniformLocation(program, 'printSpread'), v.spread);
          gl.uniform1f(gl.getUniformLocation(program, 'blackFraction'), v.blackFraction);
          gl.uniform1f(gl.getUniformLocation(program, 'inkTransparency'), v.inkTransparency);
          gl.uniform3f(
            gl.getUniformLocation(program, 'studyPattern'),
            v.angle,
            v.stretch,
            v.masked,
          );
          gl.uniform2fv(gl.getUniformLocation(program, 'studyBlurRange'), v.blur);
          gl.uniform2fv(gl.getUniformLocation(program, 'studyPatchScale'), v.patchScale);
          gl.uniform2fv(gl.getUniformLocation(program, 'studyGapParameters'), v.gaps);
          gl.uniform2fv(gl.getUniformLocation(program, 'studyRegistration'), v.registration);
          gl.uniform3fv(gl.getUniformLocation(program, 'studySeparation'), v.separation);
          gl.uniform1f(gl.getUniformLocation(program, 'studyGlobalBlur'), v.globalBlur);
          gl.uniform3fv(gl.getUniformLocation(program, 'studyPhysical'), v.physical);
          gl.uniform1f(gl.getUniformLocation(program, 'studyCellSampling'), v.cellSampling ?? 0);
          const data = new Uint8Array(400 * 365 * 4);
          gl.scissor(12, 130, 400, 365);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
          const b = new Uint8Array(data.length);
          gl.readPixels(12, 130, 400, 365, gl.RGBA, gl.UNSIGNED_BYTE, b);
          for (let y = 0; y < 365; y++)
            data.set(b.subarray((364 - y) * 400 * 4, (365 - y) * 400 * 4), y * 400 * 4);
          result.push({ id: v.id, bytes: Array.from(data) });
        }
        return result;
      },
      { fragment, png: bytes.toString('base64'), variants },
    );
    for (const row of rows) {
      const p = new PNG({ width: 400, height: 365 });
      p.data = Buffer.from(row.bytes);
      await writeFile(out + '/preview/' + number + '-' + row.id + '.png', PNG.sync.write(p));
    }
    console.log('completed', number, rows.length);
  }
  await writeFile(
    out + '/preview/texture-candidates.json',
    JSON.stringify(
      {
        sources,
        shaderHash: createHash('sha256').update(fragment).digest('hex'),
        variants,
        patches: [
          [120, 825, 120, 36],
          [306, 825, 120, 36],
          [492, 825, 120, 36],
        ],
        width: 732,
        height: 1020,
      },
      null,
      2,
    ) + '\n',
  );
} finally {
  await browser.close();
}
