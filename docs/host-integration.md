# Integrating into an existing scene

Use `createRenderer` for a complete scene. Hosts with an established depth pass,
overlays and texture cache can instead use the independent public entry points:

- `card-glint/magic/presentation`: shared layout, painters, native assets and font metadata.
- `card-glint/finish`: foil and surface GLSL, `FinishResources`, `SurfaceMotion` and `surfaceSeed`.
- `card-glint/kernels`: `createPixelKernels` with explicit disposal.

Importing these entry points does not create a WebGL context or schedule animation. The host
owns image leases, texture uploads, memory limits, clipping, hit testing, overlays,
context loss and the draw order. Never borrow private renderer textures or copy
its shader source into a host. A host-created material draws the card and finish
in the same depth pass, so later overlays and intervening objects remain in front.
A layer intended to participate in etching must be rasterized before mask creation;
a layer above the finish must be drawn later or excluded in the host material.

## CSS previews

For a preview whose final pose uses CSS transforms, `createDisplayRaster(output)`
keeps a native-size `source` canvas and filters completed frames into `output`
at its CSS size times device pixel ratio. Set the native output dimensions before
creating the helper (or pass `[width, height]` as its second argument):

```ts
import { canvas, createDisplayRaster, createRenderer } from 'card-glint';
const output = canvas([732, 1020]);
output.style.cssText = 'width:244px;height:340px';
document.body.append(output);
const display = createDisplayRaster(output);
const renderer = await createRenderer({ canvas: display.source });
// After renderer.render(frame), call display.present().
// At teardown: renderer.dispose(); display.dispose().
```

This avoids fine halftone screens aliasing into colored moiré during CSS rotation.
The helper watches CSS size and monitor/zoom density changes, caps output at the
native size, and owns no animation loop. Native source textures and exports retain
their resolution. Do not filter a canvas already rendered directly at its final
projected resolution; `createRenderer` uploads color faces and overlays with mipmaps and trilinear minification; masks and coverage retain level-0 linear filtering. Cached print-dot and cardstock textures also have mipmaps. Host materials should generate face mipmaps and use trilinear minification, linear magnification and clamped edges.
`printSamplingVersion === 1` advertises this helper and continuous overlapping
varied print dots (including hole screens). Print-dot preparation stays in the
existing bounded printing cache, so tilting does not rebuild the screens.

## Face composition

`composeCardTexture(input, tier, signal, hooks)` accepts an image-lease loader,
font-loading hooks, a quiet-time barrier and an optional `resolveEtching` callback.
The callback supplies a URL for a prepared mask; the pack owns its crop, split
panel transform, clipping and set stamp placement. Omit it for a stamp-only raster
when using the complete renderer's separately cached edge sources. Aborted jobs
release leases and never publish partial output. Hosts may keep their own persistent
image/derivative caches; none are installed globally by this API.

Omit `rulesText` or pass `true` for normal native rules painting. Pass `false`
to omit rules ink while retaining native paper, frames and panel geometry.
Text-ink overrides are opt-in; omitted overrides retain the native lettering.

The same entry exposes geometry for DOM accessibility and inline editing. Import
`card-glint/magic/fonts.css` for the matching font names. Optional `setSymbol` URLs
allow custom set marks without changing the visible `setCode`. Asset provenance
and the fan notice remain in [games/magic](../games/magic/README.md).

Native text painters accept `textInk` spans with character offsets and colors.
The host owns change detection, type-word selection and power/toughness ranges.
The painter measures those spans in its actual font and transform without
changing text advances. `omitInk` suppresses only selected spans so a host can
animate their ink above unchanged native paper. `paintFittedText` retains its
numeric inset argument, followed by optional `CardTextInk` and the type/stats role.
Native rules suppression and geometry stay in the game pack. Custom layouts,
interaction panels, fallback policy and animation scheduling belong to the host.

The host compatibility runner compares the host-API revision's default pixels,
text measurements and layouts against upstream 0.4.14 at
`f42c2be65e338607b99ac002196a4f7210c3ea9b`.
Run `node tests/magic-native-host-compatibility.mjs` after building WASM.
Its 870 probes use synthetic plates and browser fonts, not fresh scan calibration.
The later early-expansion stats update has separate native isolation, candidate
parity, original-wording and host ink-span checks. After verifying that evidence,
the runner reconstructs the pre-stats 0.4.15 modules for the host comparison.
Historical checks then reverse the reviewed artist, mana, title and calibration
changes without replacing receipt hashes. An intentional stats-layout change is
not claimed to be pixel-identical to the earlier painter.

`createRenderer({canvas, rasterHost})` accepts an optional `RasterHost` for all
card rasters, artwork edge sources, layers, scene rasters and exports. Omit it
to retain the renderer's bounded decoded-asset store. A supplied host owns its
decoded images, cache budget and leases; every `images(requests, signal)` call
must honor `AssetRequest.width` and release only that request's borrowed images.
Capture the correct source scope when each request starts, and cancel obsolete
document work before replacing a document-specific source scope.

## Finish shader contract

`foilShader({artWindows: 'pair', liquid: false})` returns GLSL functions, not a
complete material. Default `artWindows: 'array'` uses `vec4 artBounds[8]`; `pair`
uses `vec4 artBounds` plus `vec4 artBounds2`. Bounds are bottom-left UV endpoints
(x0,y0,x1,y1); zero bounds disable a window. The host declares these uniforms,
`sampler2D face`, `sampler2D mask`, `float hasMask`, `vec2 pointer`, and `float aspect`.
It provides linear RGB face samples and unmodified mask alpha in a linear R8
texture. `previewFoil(uv, normal, view)` returns sRGB; `previewLinear` converts it
for a host that performs output color conversion.

Gloss uses a fixed virtual softbox and camera, deriving a posed card from the
supplied normal. Supply the actual surface normal for gloss as well as foil;
pointer movement alone no longer moves its reflection. Normals use world Y up;
a host with a CSS Y-down normal must convert that axis. Native 3D scenes with a
non-identity view-projection use their actual surface positions and camera.
The gloss helper adds no required uniforms or samplers.

The shader declares `previewKind` (0 ordinary, 1 etched, 2 prismatic, 3 cold,
4 opal, 8 gloss, 9 holofoil), `satinCompact`, `satinHoverGain`, `wave` and `hasWave`. Pointer defaults to
(0.5,0.5), with normals/view normalized in the same coordinate system. Aspect is
card height/width. The optional `liquid: true` branch retains host-simulated height
fields (kinds 5 water and 6 hologram); the host owns their texture and scheduling.
It is separate from the complete renderer's newer rain/heat/pool treatments.

Shader programs compile once per context/material variant. Updating pose, finish
or reflection uniforms must not compose faces, derive masks or upload static
textures. Keep residency and disposal at the same scope as the scene context.
`SURFACE_GLSL` and `WORN_GLSL` expose the renderer's existing shader functions.
The host assembles its material around those sources and `foilShader()`, supplying
its own texture samplers and artwork/printing composition. No host-specific
material assembly is included in the package.

Apply `WORN_GLSL` before finish-coverage blending and protected overlay composition,
as the native renderer does. Applying wear to the final composite bypasses
artwork-only coverage and changes protected printing.

`FinishResources.documentMask(document, rasterHost, signal)` prepares the same
artwork edges, imported alpha masks, native stamp and contributing layers as the
complete renderer. For Magic, supply
`{id, revision, recipe: magic.describe(resolvedFace, 'inspect')}` with the same
resolved printing, per-face artwork placement and symbol settings used for color.
The pack's stamp painter owns styled/native symbols, alpha versus dark-ink
extraction, hidden/offset elements and its generic missing-symbol mark.

The returned canvas stores linear mask coverage in RGB with opaque alpha,
including `max(base, etchAdd) * (1 - etchExclude)`. Upload it without premultiplying
or sRGB conversion; finish shaders sample its red channel. Finish coverage is
prepared separately with `documentCoverage`; protected-ink compositing remains
the host material's responsibility.
The caller owns the returned canvas and its uploaded texture. Cache them by
pack identifier, immutable recipe/source revision, dimensions and algorithm,
releasing canvases and textures on eviction. Never call this preparation API
from a frame loop.

Standalone etch preparation is serialized through a bounded 16 MiB texture cache and
8 MiB edge scratch budget, sharing the full renderer's mask composer rather than
reimplementing its GPU pipeline. Source/image leases and temporary GPU leases
release after preparation. It snapshots the resulting mask to a host-owned canvas
once; it does not perform per-frame mask readback. WASM initialization is lazy and
shared with `createRenderer`; importing the finish entry point or calling
`mask`, `printDots` or `cardstock` does not initialize renderer WASM.
Aborts, context loss and `dispose()` cancel standalone work. Dispose the
`FinishResources` owner when the host's resource scope ends.

`FinishResources.documentMaskData(document, rasterHost, signal)` returns
`{width, height, rowOrder: 'bottom-up', data: Uint8Array}` instead of a canvas.
The bytes contain the same linear R8 coverage, with no row flip or color conversion.
It submits `readPixels` into a pixel-pack buffer, inserts and flushes a GPU fence,
then yields between zero-timeout `clientWaitSync` polls. It calls `getBufferSubData`
only after the fence signals. There is no synchronous CPU `readPixels` fallback.
The GPU transfer uses RGBA bytes for portable default-framebuffer readback, then
extracts the red channel into the returned R8 array.

The serial preparation slot and mask/coverage leases remain held until readback
finishes or fails. Abort, context loss and disposal reject pending work and release
the fence and transfer buffer. Submission restores the previous pixel-pack buffer,
alignment, row length, skip rows/pixels, read framebuffer/read-buffer selection
and draw framebuffer before yielding. The final buffer copy separately restores
the pixel-pack binding current at that moment. No saved GL state spans an `await`.
Cache the returned bytes outside animation, using the same identity as a canvas mask.

### Printing and coating in host materials

`card-glint/finish` exports `PRINT_DOTS_GLSL`, `CARDSTOCK_GLSL` and the `FinishMap`
type alongside `FinishResources`. These use the same shaders and preparation
passes as `Instance.printDots` and `Instance.cardstock`; no host framework or
private GPU handle is required.

```ts
import { FinishResources } from 'card-glint/finish';

const resources = new FinishResources();
const printing = resources.printDots(faceCanvas, faceCanvas.width, faceCanvas.height, {
  amount: 0.35,
  period: 5,
  variation: 0.5,
  inset: 0,
});
const coating = resources.cardstock();
const coverage = await resources.documentCoverage(cardDocument, rasterHost, signal);
```

`printDots` accepts a `TexImageSource` and its exact pixel dimensions. Amount is
0..1, period is 2..16 reference pixels at a card width of 732, variation is 0..1, and inset is 0..0.2 card
widths. The defaults match `Instance.printDots`. Dimensions must be positive
integers within the context's texture-size limit and the native 4,194,304-pixel
raster limit. The source must be ready; the helper does not load or resize it.
Prepare the face and any over-finish printing separately with the same settings.

Every printing result owns its tightly packed, bottom-row-first RGBA bytes.
RGB is sRGB-encoded and alpha is straight. Upload into an sRGB texture for
automatic linear sampling, or decode explicitly in the material, never both.
Generate mipmaps and use trilinear minification with linear magnification and
clamped edges, as the native renderer does. Disable procedural dots when sampling
an already prepared printing texture.

`cardstock()` prepares one fixed native relief map and returns the same
`FinishMap` on subsequent calls within that context lifetime. Its four channels
are linear packed slope data; **alpha is data, not opacity**. Upload as linear
RGBA8 without premultiplication or row flipping. Do not pass this map through a
Canvas or image conversion that premultiplies alpha. Treat the shared bytes as
read-only. Coating amount is a shader input, so changing it does not rebuild the map.

For procedural printing, `PRINT_DOTS_GLSL` provides `printFace` and `printDotInk`.
Supply a linear-sampling `face` texture, the `previewInk`/`previewLinear`
conversions from `foilShader`, and `printDotsInfo = (amount, period, variation, inset)`.
Set `printFootprint` to the projected footprint in source pixels divided by the
screen period before silhouette discards or divergent branches. `printDotFootprint(uv)` computes this using the selected face dimensions and the resolution-independent period.
`CARDSTOCK_GLSL` needs the linear `cardstockMap`, `cardstockAmount` and `pointer`;
`cardstockGloss` receives sRGB ink and reflected color. Use the matching `flat out` vertex bindings with the host-sampling contract below; no declaration replacement is needed.

The native composition order is printed dots, finish shading, coating relief,
wear, finish-coverage blending, then protected over-finish printing. Regular
printing ignores coating relief. Keep card UVs and texture dimensions aligned
between the face, printing overlay, coverage and coating.

These preparation calls belong outside animation. Printing uses the native
fine-screen preparation pass, snapshots its output once and releases temporary
GPU textures. The host caches printing by immutable source revision, dimensions,
settings and SDK revision; each result remains usable after resource disposal.
Upload the shared coating once per host context. Context restoration regenerates
the resource owner's coating lazily. Dispose the owner when its scene ends.

### GPU preparation in a host context

When the source already resides on the GPU, use `FinishTextures` from
`card-glint/finish`. It runs the native preparation passes in the supplied
WebGL2 context, without creating another context, reading pixels back to the CPU,
or uploading source bytes again. The existing `FinishResources` byte API remains
available for renderers that cannot share their context.

```ts
import { FinishTextures } from 'card-glint/finish';

const finishes = new FinishTextures(gl);
await finishes.ready(signal);
const printing = finishes.printDots(
  { texture: sourceTexture, width, height },
  {}, // native print defaults
  artWindows, // optional normalized top-left rectangles
);
const coating = finishes.cardstock();
// Bind printing.texture as the face; disable procedural print dots.
// Bind coating.texture as the shared linear cardstockMap.
// For pool draws, borrow the shared light map at explicit elapsed seconds:
const light = finishes.caustics(time);
// Bind light.texture as the linear causticsMap; never upload it through a canvas.
// Tilt now samples these maps without regenerating them.

// On printing-cache eviction:
gl.deleteTexture(printing.texture);
// On scene teardown (also releases both borrowed maps):
finishes.dispose();
```

The exported `FinishTextureSource` describes an allocated `TEXTURE_2D` with
bottom-left UVs, straight-alpha sRGB color, and level-zero storage matching its
`width` and `height`. Use `SRGB8_ALPHA8`, base level zero and a complete source;
this helper does not convert linear or premultiplied sources, resize them, or
infer their storage dimensions. Source texture parameters remain unchanged; a
private linear/clamped sampler supplies the native preparation filtering.
Dimensions, profiles and artwork windows have the same limits as the byte API.
Foreign/deleted textures and invalid descriptors are rejected before allocation.

For an allocated `TEXTURE_2D_ARRAY`, add `layer`:

```ts
const printing = finishes.printDots(
  { texture: facePage, width: pageWidth, height: pageHeight, layer: faceLayer },
  profile,
  artWindows,
);
```

Each layer must contain the full face at those exact dimensions, without atlas
padding. Array sources use one temporary GPU-only copy into a 2D source, then
the same native pass. Every printing result is a `FinishTexture` describing a complete
`TEXTURE_2D` with all mip levels, clamped edges, trilinear minification and linear
magnification. Printing results use `SRGB8_ALPHA8` and retain straight alpha.
They are **caller-owned**: cache by immutable source revision (including array
layer), dimensions, profile, artwork windows and SDK revision, then explicitly
delete on eviction. Calls do not deduplicate or retain printing textures.
Disposing the helper leaves caller-owned printing textures and source textures
alive. A host can copy a printing result into its own compatible sRGB array layer
with a framebuffer and `copyTexSubImage3D`, then generate the page's mipmaps; no
CPU conversion is needed.

`cardstock()` returns the same **borrowed** `FinishTexture` on repeated calls.
Its linear `RGBA8` channels contain packed slopes, including alpha, matching
`FinishResources.cardstock()` byte for byte. Do not delete, modify or render
into this shared map. The helper releases it on disposal. Coating amount stays
a material input; changing it does not prepare another map.

`caustics(time)` returns a **borrowed** 512×512 linear `R8` `FinishTexture` in
the supplied context. It uses repeat wrapping, linear minification/magnification
and level zero only, without mipmaps. Supply finite, nonnegative elapsed seconds
that remain finite after `Math.fround`; the shared light pass runs at most once
for each successive float32 time. Repeated calls at the same float32 time return
the same descriptor without another pass or state capture. The map changes in
place when time changes. Bind it directly as `causticsMap` for `SURFACE_GLSL`;
do not delete, modify or render into it. It performs no canvas copy, readback
or re-upload, and all pool materials can sample it during that frame.

Preparation and caustics updates restore the host bindings and draw state they touch
on both success and failure, including separate read/draw framebuffers, program,
VAO and element buffer, active texture unit and unit-zero texture/sampler,
pixel-unpack buffer, viewport, color mask, clear color, separate blend equations
and RGB/alpha blend functions, and capability enables. They do not consume the host's GL error
queue. Run outside occlusion queries and pause transform feedback first; those
active operations are rejected rather than disturbed. Unbind a current program
marked for deletion before preparation: switching away would destroy it, making
state restoration impossible, so this state is also rejected. Frameworks that cache GL
state can keep their cache after these calls. Disposal invalidates owned
resources, so stop sampling both borrowed maps before disposing.

Create one helper per context lifetime. Call `await finishes.ready(signal)` before
the first synchronous preparation or caustics update to compile printing,
cardstock and caustics programs without an immediate link-status wait when
`KHR_parallel_shader_compile` is available. Compilation finishes before resource
initialization captures/restores host state; no state snapshot spans an `await`.
Concurrent callers share initialization. Aborting one caller rejects only that
caller's wait, without canceling another caller's initialization. Disposal or
context loss cancels the shared work. Real compilation failures reject readiness;
callers may retry an aborted/failed warmup while the owner remains live.

For compatibility, synchronous methods still initialize missing programs when
called without awaiting readiness. Such first calls can block on shader linking.
Subsequent calls reuse programs and scratch objects. Printing is one GPU render
pass plus mip generation, with the extra GPU copy for array sources. The helper
has no unbounded printing cache. The shared coating costs approximately 4 MB
including mipmaps; caustics uses a fixed 704,512 bytes for its map and index buffer.
State queries run during preparation and each changed caustics time, not for
unchanged pose-only printing/coating reuse. CPU submission time is not GPU
completion time; use a GPU timer query when measuring the pass.

After context loss, discard all cached GPU handles, dispose this helper and
create a fresh helper after restoration. The old helper remains invalid even
when the context is restored. The host owns context recovery and re-uploading
its immutable sources; this helper never calls `preventDefault` or restores or
destroys the host's context. `npm run test:finish-textures` covers native pixel
and mip parity, array layers, GL state, ownership, failure cleanup and recovery.

### Selective finish coverage

`documentCoverage(document, rasterHost, signal)` uses the renderer's layer order,
clipped mask rasters and maximum-alpha composition. It returns a caller-owned
opaque grayscale canvas with resolved `max(finishCoverageBase ?? 1, add) * (1 - exclude)`
in RGB. Sample its red channel as linear coverage; do not apply the base value again.
The canvas has normal top-left image orientation. Set the base to zero when only
the mask's white regions should receive the finish.

Etch-only masks do not affect this result, and coverage preparation does not
paint face color or load etching assets. Artwork-window and silhouette clipping,
and protected printing above the finish, remain separate host responsibilities.
Cache by pack, base coverage, immutable mask revisions, clips, dimensions and SDK
revision. Each returned canvas is independent; the caller releases its canvas
and uploaded texture. Coverage and etch requests share the owner's serialized,
abortable document lifecycle and lazy WASM initialization.

The Magic pack already exports `artworkFoilMask` to project an illustration-sized
mask through the selected artwork placement and frame aperture. Add its raster
to a document layer's `finishCoverage.add` or `.exclude`, then prepare that
document's coverage. Generic finish resources do not interpret game artwork.

## Pixel kernels

```js
import { createPixelKernels } from 'card-glint/kernels';
const kernels = await createPixelKernels({ wasmUrl: '/pixels_bg.wasm' });
try {
  const alpha = kernels.etch(width, height, rgbaBytes, 20);
  // alpha is an owned, top-down R8 array, independent of later calls.
} finally {
  kernels.dispose();
}
```

The pixel-only artifact omits scene/cache/JSON machinery. Initialization is shared per JavaScript realm; a worker initializes its own realm.
A host may supply binary bytes instead of a URL, useful for verified single-file
bundles. The Rust workspace is reused until disposal, and output arrays belong
to the caller. Cache masks by source revision, dimensions and threshold. Hot cache
hits should skip both kernels and GPU uploads. WASM instance memory and retained
scratch are additional to the host's resident image/texture budget.

## Asset discovery and offline hosts

`card-glint/magic/presentation` exports `canvasAssetUrls`, `canvasFontAssets`,
`faceManaAssets`, `PLAIN_SECURITY_STAMP`, `decodeCanvasImage` and `setAssetFetcher`.
The font catalog derives from the pack's native stylesheet and retro-font
definitions. These exports discover native resources without downloading them.
The host owns offline manifests, extra prefetch variants, font registration and
cache completeness.

Install a fetch adapter with `setAssetFetcher` before preparing faces when your
host serves permitted assets from a local cache or another URL. All package
entry points in one installed package share that adapter. The host still owns
font registration, caching, offline availability and asset rights. Do not infer
redistribution permission from a public URL. Keep `LICENSE-MIT`, `LICENSE-APACHE`,
`NOTICE.md` and `games/magic/NOTICE.md` with redistributed package code, and read
the [game-pack asset notices](../games/magic/NOTICE.md) separately from the
repository's code license.

The native `holofoil` finish uses the same diffraction response as a local
hologram patch, across the ordinary finish coverage. It remains distinct from
`prismatic`, needs no mask or extra texture, and supports print dots, cardstock
and wear. Existing card-local layers can restrict it using `finishCoverage`.

### Print-dot artwork coverage

Use `printDots: { artwork: false }` with the renderer to retain scanned art
inside `FaceRecipe.artWindows` while applying dots to the rest of the printing.
An empty profile opts into `DEFAULT_PRINT_DOTS` (amount 0.35, period 2, variation
0.5, inset 0); an absent profile stays disabled. Generated art can include dots.
`FinishResources.printDots(source, width, height, settings, artWindows)` accepts
the same normalized top-left rectangles as an optional fifth argument (maximum
eight). Omitted windows exclude nothing. Cached and procedural paths use the
same coverage; preparation is reused until the source, settings or windows change.

A direct shader host can opt into `PRINT_DOTS_GLSL` artwork coverage with
`#define PRINT_DOT_ART_WINDOWS`, supply `uniform float printArtwork` (1 to include,
0 to exclude), and fill `uniform vec4 printArtBounds[8]` with bottom-left
(min-x, min-y, max-x, max-y) coordinates. Unused entries are zero. Without the
define, existing shader hosts retain their previous contract.

## Instanced texture arrays (0.6)

Assemble `foilShader({sampling: 'host', artWindows: 'pair', liquid: false})`
before `PRINT_DOTS_GLSL`, `CARDSTOCK_GLSL` and optional `SURFACE_GLSL`. Host mode
sets `GLINT_HOST_SAMPLING`; it uses these host implementations instead of a
`sampler2D face` or `sampler2D mask`:

```glsl
uniform highp sampler2DArray faces;
uniform highp sampler2DArray masks;
flat in float faceLayer;
flat in float maskLayer;
vec4 glintSampleFace(vec2 uv) { return texture(faces, vec3(uv, faceLayer)); }
float glintSampleMask(vec2 uv) { return texture(masks, vec3(uv, maskLayer)).r; }
```

The shader declares `previewKind`, `hasMask`, `aspect`, `pointer`, `facePixelSize`
and artwork bounds as `flat in` fragment inputs. Supply matching `flat out`
vertex values for every instance. `facePixelSize` is the positive pixel size of
that face, independent of the texture array's allocated size. An atlas or padded
array host maps UVs inside its sampling functions. Samples use bottom-left UVs,
linear RGB and straight alpha; mask coverage is linear red. Array layers,
residency and context ownership remain entirely with the host.

Pair mode declares two `vec4` bounds and saves varying slots. Array mode declares
eight; check the device's varying limit when combining it with optical surfaces.
The optional `HOST_SAMPLING_GLSL` export supplies the same guarded declarations
when assembling printing without foil: define `GLINT_HOST_SAMPLING` first and
`GLINT_ART_PAIR` for two windows. Do not redeclare the instance inputs. Cardstock
uses one shared linear `sampler2D cardstockMap`; it needs no per-card copy.
Etch slopes use one face texel on each axis in host mode. Optical clamps use
face texels, including half-texel insets within artwork windows.

The host-sampling mode changes resource access, not finish composition order,
mask coverage, protected printing or output color conversion. The legacy uniform
shader mode remains the default.

Set the shared `studioLighting` uniform to 1 for the opt-in studio mode, or 0
for compatibility lighting. Studio lighting ignores the flat pointer value,
including cardstock relief. Keep actual hover hits separate for water motion.
For a normalized upright card, pass `studioCardView(uv, normal)` as the view
argument to `previewFoil`; a 3D host with its own camera can supply its actual
view vector. The virtual studio cannot infer scene translation or card roll
from a normal alone. The complete renderer selects this mode through
`Frame.lighting: 'studio'`; `normalLightingVersion === 1` detects support.

## Worker composition and native widths (0.6)

`composeCardTexture` paints directly at `'table'` (244×340), `'native'` (488×680),
`'inspect'` (732×1020), or an integer pixel width. Numeric heights preserve the
488:680 aspect, rounded to the nearest pixel; total area is bounded at 4,194,304
pixels. `cardTextureSize(tier)` exposes these exact dimensions. These choices do
not install an automatic tier policy in the renderer.

Without `document`, painters allocate OffscreenCanvas and return a transferable
ImageBitmap. On the main thread the default remains HTMLCanvasElement; pass
`{output: 'bitmap'}` to request a bitmap there too. The return type now expresses
both possibilities. `custom.compose` may return a canvas, OffscreenCanvas or
ImageBitmap and follows the same completion/cancellation path. Use `closeRaster`
from `card-glint/canvas` (or bitmap.close) when finished.

Supply `loadImages` leases containing ImageBitmap assets, plus `loadFonts` and
`loadRetroFont` hooks. Load each required `FontFace` into the worker's own
`self.fonts`; a page's font registry is not shared with its workers. The exported
`canvasFontAssets` and `retroFontAssets` describe the matching sources. Hooks
should cache preparation per worker and honor cancellation; image leases release
when composition completes. Custom painters own their asset and font loading.
No DOM shim or UI framework is required.

For the etching layer, `{output: 'r8'}` returns a `CoverageMap` instead of an image:

```ts
const mask = await composeCardTexture({ ...input, layer: 'etching' }, 'native', signal, {
  ...hooks,
  output: 'r8',
});
// mask.rowOrder === 'bottom-up'; mask.data is owned, tightly packed linear R8.
postMessage(mask, [mask.data.buffer]);
```

The extraction retains alpha coverage, including soft stamp edges, in the R8
bytes. The default image etching output retains its existing alpha semantics.
`FinishResources.documentMaskData(document, host, signal)` returns the same R8
shape after the complete mask and its coverage exclusions are composed. Upload
with `UNPACK_ALIGNMENT=1`, format RED/UNSIGNED_BYTE and internal format R8. No
premultiplication, sRGB decode, getImageData or JavaScript row flip is needed in
the host. Extraction is one-time preparation; cache it by recipe and algorithm,
never recompute it during motion.

## Print-period migration (0.6)

Print periods now describe a fixed physical screen on the card: the established
732px appearance is the reference. The screen phase and period no longer change
when the same card uses 244, 488 or 732px faces. `PRINT_DOTS_REFERENCE_WIDTH` is
732 and `printDotPeriodForWidth(width, period)` gives the period in face texels.
For example a period of 6 is 2, 4 and 6 face texels at those three widths.
Procedural hosts set `printFootprint = printDotFootprint(uv)` before divergent
branches or silhouette discards. Small projected screens filter away smoothly;
using a larger source texture does not make dots physically smaller.

Consumers that previously chose a different period per tier should now pass the
same reference period at every tier. Existing 732px settings retain their scale.

For a host-sampled print screen, `GLINT_PRINT_CELL_FACE(uv)` may be defined
before `PRINT_DOTS_GLSL` to sample source-cell colors explicitly at mip level 0
(for example with `textureLod` on the host texture array). Otherwise it uses
`glintSampleFace`. Ordinary color sampling and derivative-based screen fading
retain their existing contract. The native backend uses level 0 for these
cell-centered samples so quantized cell coordinates cannot select unstable mips.
