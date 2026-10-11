# Integrating into an existing scene

Use `createRenderer` for a complete scene. Hosts with an established depth pass,
overlays and texture cache can instead use the independent public entry points:

- `card-glint/magic/presentation`: shared layout, text, symbols and raster painters.
- `card-glint/finish`: `foilShader` and `FOIL_REFLECTION_GLSL`.
- `card-glint/kernels`: `createPixelKernels` with explicit disposal.

These entry points do not create a WebGL context or schedule animation. The host
owns image leases, texture uploads, memory limits, clipping, hit testing, overlays,
context loss and the draw order. Never borrow private renderer textures or copy
its shader source into a host. A host-created material draws the card and finish
in the same depth pass, so later overlays and intervening objects remain in front.
A layer intended to participate in etching must be rasterized before mask creation;
a layer above the finish must be drawn later or excluded in the host material.

## Face composition

`composeCardTexture(input, tier, signal, hooks)` accepts an image-lease loader,
font-loading hooks, a quiet-time barrier and an optional `resolveEtching` callback.
The callback supplies a URL for a prepared mask; the pack owns its crop, split
panel transform, clipping and set stamp placement. Omit it for a stamp-only raster
when using the complete renderer's separately cached edge sources. Aborted jobs
release leases and never publish partial output. Hosts may keep their own persistent
image/derivative caches; none are installed globally by this API.

The same entry exposes geometry for DOM accessibility and inline editing. Import
`card-glint/magic/fonts.css` for the matching font names. Optional `setSymbol` URLs
allow custom set marks without changing the visible `setCode`. Asset provenance
and the fan notice remain in [games/magic](../games/magic/README.md).

## Finish shader contract

`foilShader({artWindows: 'pair', liquid: false})` returns GLSL functions, not a
complete material. Default `artWindows: 'array'` uses `vec4 artBounds[8]`; `pair`
uses `vec4 artBounds` plus `vec4 artBounds2`. Bounds are bottom-left UV endpoints
(x0,y0,x1,y1); zero bounds disable a window. The host declares these uniforms,
`sampler2D face`, `sampler2D mask`, `float hasMask`, `vec2 pointer`, and `float aspect`.
It provides linear RGB face samples and unmodified mask alpha in a linear R8
texture. `previewFoil(uv, normal, view)` returns sRGB; `previewLinear` converts it
for a host that performs output color conversion.

The shader declares `previewKind` (0 ordinary, 1 etched, 2 prismatic, 3 cold,
4 opal), `satinCompact`, `satinHoverGain`, `wave` and `hasWave`. Pointer defaults to
(0.5,0.5), with normals/view normalized in the same coordinate system. Aspect is
card height/width. The optional `liquid: true` branch retains host-simulated height
fields (kinds 5 water and 6 hologram); the host owns their texture and scheduling.
It is separate from the complete renderer's newer rain/heat/pool treatments.

Shader programs compile once per context/material variant. Updating pose, finish
or reflection uniforms must not compose faces, derive masks or upload static
textures. Keep residency and disposal at the same scope as the scene context.

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
