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
adapter through the [public host interfaces](host-integration.md); they must not borrow this renderer's live context or private textures.

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

`FaceRecipe.hologram` adds an independent local reflective coating to the final
printed composite, including over-finish printing and regular/nonfoil cards.
Its small raster's alpha maps into a normalized rectangle; RGB is ignored. Packs
own the shape and inset it from lettering or borders that must remain static.
This opt-in coating is separate from the instance finish and `overlayFoil`.
The same face depth pass shades it, so it cannot leak above a nearer card.
The bounds, strength and stable seed are uniforms; changing them reuses the
mask texture. Changing the mask key prepares only that mask. The source mask is
prepared/uploaded once through the existing bounded cache, without mask readback.
View/normal changes move the reflection over stationary diffraction grooves.
Fixed view, pointer and seed produce a deterministic still; elapsed time alone
does not animate the coating. Export and context recovery retain that identity.
The context compiles ordinary and coated shader variants once. Uncoated cards
use the ordinary program, keeping the additional coating's shader cost out of
their draws. Switching between them never compiles a shader during rendering.

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
| Coverage          | Pack identifier, mask content and clips                      | Motion and light                                                 |
| Local hologram    | Mask identity and dimensions                                 | Placement, strength, seed, view and pointer                      |

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

`rain`, `heat` and `pool` shade the prepared face in its existing depth pass.
Refraction is clamped to the card, or to its art window in artwork-only mode.
Finish-excluded pixels keep the original ink; over-finish overlays do not get
pulled underneath droplets or water waves. Rain counter-projects a near-stationary scene behind a turning pane; pool keeps
its printed floor attached to the card. Neither adds a uniform image pan.

Time is explicit, nonnegative elapsed seconds. The host owns scheduling and
reduced-motion/visibility policy. The adapter holds a damped spring and four
ripple impulses per visible animated instance. Slosh follows changes in the
instance transform and normal. Only `Frame.hover.instance` receives impulses.
Stable instance IDs seed independent offsets in the shared fields. Culling drops
transient state; rewinding time, a gap over half a second, context recreation or
an epoch reset clears that history. Camera motion alone does not inject slosh.
Export isolates the motion state.

Card preparation, decoding, etching and texture uploads remain cached. Animation
uploads a 192-byte instance record, including independent rain fog density.
Rain evaluates eighteen candidate drops; rain and heat use five
face samples for softening. Pool evaluates six surface waves and four bounded
ripples, then samples the face and a **separate projected-light map** (five taps
to soften mesh boundaries and narrow ray folds). Programs
compile once per context. The original finishes skip the optical branches.

The pool light pass refracts a 192×192-cell mesh through the shared height field
onto a 512×512 R8 receiving plane. Source-to-destination footprint area determines
irradiance; additive blending accumulates folded rays. Floor ink is illuminated
in linear light, with ambient fill plus focused/diverging sunlight. A separate
water-surface normal supplies Fresnel reflection and highlights. This avoids
painting cell outlines over the face. The field is periodic and advected, with
per-instance offsets; there is no per-card light-map allocation.

One light pass runs at the first visible pool draw for a new time. Later pool
materials/instances reuse it; an unchanged time skips it entirely. No visible
pool cards means no light pass. `surfacePasses` reports its cumulative count;
`draws` continues to count card and scene-layer submissions. `surfaceBytes`
reports the fixed **704,512 bytes** for the R8 map and index buffer per context,
separate from the CPU/GPU asset-cache budgets and etching scratch. This bounded
allocation is created with the context and released with it. It adds no texture
uploads/readbacks during animation. GPU fragment cost still grows with area and
overdraw, while the shared light pass has a fixed cost. Browser pixel tests use
software rendering; CPU submission timings are not hardware GPU completion/FPS.

The water is an approximation: one flat receiving floor and one directional
light, capped 8× intensity in an 8-bit map, no volume conservation or submerged
occluders. Ripple/slosh changes refract the floor map and surface reflections;
it does not retrace the shared sunlight for each local ripple. Rain scene stabilization uses the surface normal and a fixed perspective
distance of 3.5 card widths; arbitrary host cameras and card translations are
not tracked. Basin slosh uses two low-frequency wall-to-wall height modes from
the existing damped spring. Rain does not physically merge droplets.

### Wear over finishes

Optional `Instance.wear` adds abrasion over any selected finish in the existing
card depth pass. `amount` ranges from zero to one; an optional uint32 `seed`
defaults to the stable instance ID. Hosts can persist it with a physical card
independently of scene identity. Export accepts the same wear settings.

Rounded-edge distance uses the pack's corner radius and face aspect; seeded
noise clusters paper exposure at edges and corners. Increasing wear spreads
and deepens those chips, adds ink loss and dulls more varnish. Short directional
scores and scattered abrasions sit over the chosen gloss/foil response, which
survives in intact areas. On foils, shallow rubs expose a reflective silver film;
deeper chips remove it and expose matte fibres. This approximates surface wear
without changing silhouette, picking geometry or document rasters.

Noise octaves fade to their mean when a screen pixel covers their detail.
Chip alpha uses derivative-based soft edges, and hairlines preserve coverage as
they shrink. Larger chip clusters remain resolved while subpixel fibres soften,
preventing the fixed pattern from sparkling during tilt or minification. This
filtering stays in the material pass; it does not blur the printed face.

Elapsed time does not change wear; pose and pointer move reflections. A separate
pair of instance floats holds wear amount/seed, leaving deformation and living
surface identities independent. Coverage exclusions and over-finish layers keep
their normal semantics, including an independent hologram coating. There are no
additional textures, passes, readbacks or transient motion states for wear.
Fragment work grows with covered area; CPU submission timings do not measure
GPU completion time. Fresh cards skip the abrasion branch.

### Optional moving silhouette

`Instance.deformation` opts into a bounded horizontal heat warp (0–0.02 local
card width). The vertex shader expands its raster quad conservatively. The
fragment shader inverse-warps coordinates **before** rounded clipping and all
face/layer/coverage lookups. Discarded pixels reveal the background or cards
behind. It remains one planar depth surface, not a bent 3D mesh.

Rust receives four shape floats per instance: published face aspect, corner
radius, amplitude and seed. Planning culls expanded bounds; picking uses the
same inverse map and rounded distance at the last rendered time, falling through
to a card behind on rejected pixels. Semantic regions receive source UVs.
Cross-backend pixel tests enforce shader/Rust agreement, including perspective.
The published face's shape stays active while a replacement revision prepares.
Invalid shape/frame data is rejected before replacing the last plan.

Card-local layers and exclusion masks follow this geometric mapping together;
a sharp over-finish badge moves with its card. World/interleaved/scene/HUD layers
keep independent geometry and established depth ordering. Export fits the whole
conservative envelope into the requested PNG with a small transparent guard.
It preserves aspect ratio and restores the live frame and motion state.

The showcase enables outline deformation only for Full card heat. Its area
toggle otherwise uses existing `finishCoverageBase` and pack `artWindows` masks.
The first artwork-only toggle prepares coverage/transparent-overlay textures;
subsequent toggles reuse them while resident. Neither changing area nor changing
outline amplitude rebuilds faces or edges.
See [optical references and approximations](optical-surfaces.md).

The original showcase's `showcaseDocument` helper keeps the illustration and
printed frame separate. Artwork-only mode moves that frame layer above the
finish, so refraction samples clean artwork and cannot drag a second copy of a
symbol into view. Full-card mode places printing below the finish. The first
scope change prepares another cached color/overlay set; warm toggles reuse both.
The older single-raster `showcase.describe` API remains available.

### Reflections on sharp printing

A pack can put its clean artwork in `recipe.color` and its transparent printed
frame in `over-finish` layers. Optical finishes then sample only the illustration.
`FaceRecipe.overlayFoil` optionally adds a gold, silver or prismatic satin
reflection (strength 0–1) to that combined printing, at the original UV. It
never distorts text or symbols. Omit it for unshaded overlays; it applies to all
over-finish layers in that document. Put unshaded HUD elements in scene layers.

This is a pair of material uniforms, evaluated in the existing depth pass.
Changing tone/strength reuses the prepared textures; batching distinguishes the
uniform values. Exports and context restoration use the same recipe. Hosts still
supply time, animation scheduling and reduced-motion policy.

## Cardstock coating relief

`Instance.cardstock.amount` is a game-neutral optical-coating parameter (0..1).
The browser backend stores one extra instance float. A context-owned relief map
contains two 16-bit analytical slopes in RGBA8; its shader is compiled with the
context and the fixed map is generated on first textured finish draw. Linear
decoding permits mip filtering, suppressing fine relief when cards shrink.
Subsequent frames sample the map in the existing material pass. There are no
reference face renders, per-frame uploads, readbacks or procedural noise calls.
The coating modulates the finish response before abrasion and finish coverage,
without an overall gain reduction. Gloss independently scales its clear-coat
contribution by 0.9, whether or not cardstock is enabled. Other finishes retain
their original strength. Static over-finish printing remains unaffected.
Default/zero amounts preserve the smooth coating; regular printing ignores it.
Disposal and context restoration follow
the same ownership as the other device resources. Map storage and the initial
pass are included in `surfaceBytes` and `surfacePasses`.

Printed ink uses a bounded 16 MiB context-owned LRU keyed by source face/overlay
texture identity and all screen settings. A one-time GPU pass stores linear
shader output in sRGB targets, retaining dark-ink precision. Mipmaps filter fine
dots as geometry shrinks. Homogeneous instance groups sample these textures in
the normal finish pass, whose shader excludes procedural screen evaluation.
Both variants compile at context creation, so switching settings never compiles
a shader during animation. Mixed groups and faces
that exceed the cache bound preserve the per-instance shader path. Metrics count
preparation passes and retained bytes; context restoration and disposal clear the
cache. Benchmark completed frame time separately from CPU submission time.
