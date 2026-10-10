# Architecture and contracts

This implementation uses a Rust/WASM policy and numerical core plus a WebGL2
browser backend. Browser fonts and Canvas2D still rasterize static game faces;
Rust does not implement font shaping. The browser adapter owns graphics handles,
while Rust owns cache admission/recency/pins, scene planning/picking, graph
validation, and the CPU edge detector. A future Rust-owned WebGL backend can
replace the adapter without moving game definitions into the core.

## Dependencies

`game pack → public browser contract → Rust/WASM + WebGL2`

Game packs describe immutable `FaceRecipe` values: color raster, optional stamp,
edge sources and their crops/placements, art windows, silhouette radius, and
editable regions. The browser host loads those rasters through a bounded image
store. Packs can use their own image, SVG, symbol, or text layout functions.
The generic backend never interprets names, rules, costs, stats, set codes,
affiliations, or game state. No game pack imports another game pack.

Keep the application/editor in its own project. Its adapter translates visible
presentation data to the chosen pack and owns event handling, model generation,
validation, selection, and authoring. The renderer does not receive private
engine state. Existing Three.js scenes should use an explicit integration
adapter; they must not borrow this renderer's live context or private textures.

## Layers and masks

Card-local layers use `stage → order → stable ID`. The Rust boundary rejects
ambiguous IDs and etching contributions above the finish.

| Stage             | Behavior                                                  |
| ----------------- | --------------------------------------------------------- |
| `under-art`       | Pack inserts the supplied raster before its illustration. |
| `printed-content` | Additional printed content above the pack's base raster.  |
| `under-finish`    | Included in the shaded face.                              |
| `over-finish`     | Composited after shading, inside the same card surface.   |

`contributesToEtch` derives an additional edge source from a declared under-finish
layer and adds it to the mask. Sources are etched independently, then composed;
it does not currently derive a single combined source across intersecting
layers. A change to an ordinary over-finish badge changes only its overlay.

Coverage masks declare `finishCoverage` or `etchCoverage`, each with optional
`add` and `exclude` rasters. The alpha channels are combined by maximum and
packed into a linear texture. Both use `max(base, add) × (1 − exclude)`;
exclusion wins. `finishCoverageBase` defaults to 1; use 0 for selective foil.
Layer rectangular clips also clip their mask contributions. Colors use sRGB
textures, defined linear conversions for effect/overlay compositing, and a
linear mask texture. The retained native Canvas2D painter still follows browser
compositing semantics; it is not a replacement linear-space text compositor.

Face and foil produce **one depth surface**. An over-finish overlay is part of
that same surface, so it cannot leak above a nearer card. Rounded silhouette
clipping applies to the whole card. This first backend deliberately clips
card-local overlays to the card; extending them beyond the silhouette requires a
scene layer.

Scene layers have explicit `world-under-cards`, `world-interleaved`,
`scene-overlay`, or `hud` stages and `test-write`, `test-readonly`, or `ignore`
depth policies. World-interleaved layers run against the resolved card depth;
an arrow can pass behind one card and in front of another. Transparent world
layers need caller-provided back-to-front `order`. HUD uses clip-space transforms;
other scene layers use the camera's view-projection. Overlay/HUD stages must
ignore depth. No unrestricted GL callback is exposed. Arbitrary geometry,
per-instance ownership masks, and nonrectangular custom layer clips remain
future backend extensions; use pre-rasterized alpha within declared quads now.

## Cache ownership

A session owns one GL context, reusable programs/scratch textures, a GPU texture
LRU, a decoded-image LRU, and pending preparation. Rust admission honors byte
limits and pins. The graphics adapter evicts before allocating a replacement
GPU texture. Leases prevent one revision from evicting resources still needed
by another in-flight revision. Exhaustion rejects admission instead of silently
raising the budget. Caches retain unpinned results for reuse. Intermediate edges/stamps have lower
eviction priority than final display textures; caching preparation artifacts
must not crowd finished faces out of the working set.

| Resource          | Key includes                                                 | Changes that reuse it                                            |
| ----------------- | ------------------------------------------------------------ | ---------------------------------------------------------------- |
| Decoded image     | URL/revision and decode width                                | Card name, pose, crop, finish                                    |
| Art edge R8       | Source revision, decode width, threshold, algorithm          | Name, rules, crop, set, finish, motion                           |
| Assembled R8 mask | Edge recipes, placement/crop, stamp, etch contributors, tier | Name/rules when geometry is unchanged, over-finish badges, light |
| Face color        | Pack recipe and printed/under-finish layers                  | Motion, finish, over-finish badges                               |
| Overlay           | Ordered overlay content and clips                            | Base text, artwork, light                                        |
| Coverage          | Mask content and clips                                       | Motion and light                                                 |

HTTP caching retains encoded sources across reloads. GPU textures are reusable
within their context, but do not survive context loss. Recovery rebuilds from
retained decoded sources when present, or fetches/decodes sources again. No mask
readback occurs in normal GPU preparation. The lab separately measures optional
R8 serialization, gzip, CacheStorage, and re-upload; it is **not enabled by
default**. Serializing everything would put readbacks back on the critical path.

Prepared color/mask/overlay sets publish atomically after all resources complete.
Stale jobs cannot replace a new revision. `resetEpoch` cancels jobs, clears scene
and retained texture/image caches, and clears the canvas. Context loss invalidates
GPU handles while keeping visible document recipes and decoded images for
recovery. Texture IDs are monotonic and stale leases are generation-checked.

Default limits are 64 MiB of resident GPU payload, 32 MiB of retained decoded
images, and a 16 MiB etching scratch ceiling, with two preparation jobs and four
image decode jobs. Metrics are payload accounting, **not physical VRAM**. Browser
decoder internals, transient Canvas staging, GPU driver padding, WASM pages,
shader programs, and display/depth buffers are additional allocations. Model
inference shares the device and must be budgeted by the application too.

## Large scenes and current limits

Rust consumes packed instance matrices, culls outside the view frustum, and
provides perspective-correct hit UVs. The browser submits instanced draws for
adjacent instances sharing prepared material textures. Moving cards changes
instance buffers and uniforms, not static assets. Native painter assets are
loaded only during preparation. The table/inspection raster tier is chosen by
the host; this backend does not yet choose projected-size tiers automatically.

A scene with 2,000 instances of three recipes is fundamentally different from
2,000 unique cards. The lab exercises the former. Unique-card texture-array
paging, occluded-stack culling, incremental packed deltas, scheduled per-frame
GPU upload budgets, GPU timing queries for the complete scene, and automatic
resolution promotion remain follow-up work. Preparation concurrency is bounded,
but one submitted GPU job is not preempted to satisfy a millisecond time slice.

The renderer does not claim pixel identity with Canvas2D mask resampling.
Integer edge detection is byte-exact; GPU composition of the final mask can
differ at thin edges, especially under Opal highlights. Physical Safari/M1
acceptance remains necessary in addition to Chromium software-GPU checks.

## Animated optical surfaces

`rain`, `heat` and `pool` shade the already prepared face in its existing depth
pass. They keep the rounded silhouette and depth surface unchanged. Refraction
samples are clamped to the card; finish-excluded pixels mix back to the original
unwarped face, and over-finish overlays sample at the original UV. Thus an overlay
does not get pulled underneath a droplet or water wave.

Time is explicit, nonnegative elapsed seconds. The host schedules draws and owns
reduced-motion/visibility policy. The browser adapter holds a damped spring and
a ring of four ripple impulses per visible animated instance. It derives slosh
from changes in the instance transform and normal, and creates throttled impulses
only for `Frame.hover.instance`. Stable instance IDs keep independent seeds.
Removing/culling an instance drops its transient state; rewinding time, a gap
over half a second, context recreation or an epoch reset clears that history.
Moving the camera alone does not inject slosh. Export uses an isolated state.

There are no extra simulation textures, image decodes, mask builds, framebuffer
passes or readbacks for these treatments. Animation uploads a 160-byte instance
record (matrix, normal, finish, spring/seed and four ripples), up from 80 bytes in
v0.1.0. Transient JavaScript state and the staging buffer scale with visible
instances; texture budgets and cache keys are unchanged. Surface programs compile
once per context. The original finishes skip the new optical shader branches.

Rain evaluates nine nearby procedural droplets per fragment; pool water combines
two nine-cell caustic fields and four bounded analytic ripple waves. These costs
scale primarily with shaded pixel count and overdraw, even when many instances
share one prepared face. The pixel tests verify animation, fixed-time repeatability,
localized impulses, coverage masks and unchanged preparation/upload counters.
They use Chromium software rendering, not hardware GPU timings or mobile FPS.

These are stylized refraction prototypes rather than a fluid simulation. Rain
does not physically merge droplets; pool water does not conserve volume. Heat
warps sampled ink, not mesh geometry, so picking and surrounding objects keep
their original shape. Slosh/ripple history is transient and not serialized.
