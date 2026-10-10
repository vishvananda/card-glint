# Optical treatments

The effects reuse the prepared card face and keep its layer/depth ordering.
Each treatment has a small shader module under `packages/browser/src/gpu`.

## Rain on glass

[Lucas Bebber's rain experiments](https://tympanus.net/codrops/2015/11/04/rain-water-effect-experiments/)
separate a soft background from sharp refractive drops, with larger drops
clearing trails through smaller ones. [Tatarchuk and Isidoro's rain presentation](https://www.realtimerendering.com/advances/s2006/Tatarchuk-Rain.pdf)
also discusses glass droplets, streams and lighting. These informed the visual
model; their code and image assets are not bundled.

Our analytic approximation uses small cap gradients, seeded births, draining
drops and clear tracks. Condensation lightly softens the image, while lenses
and tracks remain sharp. The image sits behind the glass: tilt moves it relative
to the drops and their highlights. It does not conserve water volume or simulate
collision-driven merging.

## Heat

The field varies rapidly vertically and slowly horizontally, making horizontal
air layers. Displacement is primarily lateral. A small anisotropic filter softens
the ink without a blur texture. A weak warm reflection follows tilt.

Optional `Instance.deformation` also changes the silhouette. An expanded quad
allows ink outside the original bounds; inverse-warped clipping cuts into the
opposite edge and reveals the background. Rust culling and picking use that
same mapping. Card-local masks and overlays follow; scene overlays remain
independent. Full-card heat uses this in the showcase; artwork-only does not.
PNG export includes transparent margins around the complete warped outline.

## Pool: surface and receiving floor

[GPU Gems: Rendering Water Caustics](https://developer.nvidia.com/gpugems/gpugems/part-i-natural-effects/chapter-2-rendering-water-caustics)
describes wave-derived caustics. [Evan Wallace's explanation](https://medium.com/@evanwallace/rendering-realtime-caustics-in-webgl-2a99a29a0b2c)
explains projecting a mesh of refracted rays and comparing their incoming and
receiving areas. Our implementation uses this footprint technique, with original
code and a bounded shared light map.

Six traveling height waves define the surface and its normals. A dedicated GPU
pass refracts overhead sunlight through a mesh of that surface onto the bottom.
The ratio of the incoming footprint area to its receiving area determines
brightness: converging rays brighten and diverging rays darken. Folded rays
accumulate additively into a 512×512 R8 light map. It stores up to 8× irradiance.
A five-tap receiving footprint softens mesh boundaries and singular ray folds.

A second, card-shading pass looks through the water to a recessed floor. Artwork
and the caustic illumination share the viewing-ray displacement. Lighting is
applied in linear light, with modest ambient fill and water attenuation. Surface
normals create reflections and Fresnel highlights above the floor; hover ripples
and slosh affect this viewing/reflection layer. Tilting gives the floor parallax.

This is a single-floor, single-light approximation. Parallax depth is visually
compressed. There are no underwater occluders or volume simulation. Local
ripples warp the shared floor illumination; they do not each rebuild sunlight
projections. The periodic field is continuously transported; per-instance
sampling offsets avoid identical patterns on neighboring cards.

## Coverage and cost

**Effect: Full card / Artwork only** applies to all treatments and PNG export.
The showcase masks the pack's `artWindows` with `finishCoverageBase: 0` for
artwork-only. Full-card coverage uses base 1. Exclusions take precedence and
over-finish content stays clear of optical distortion. Artwork-only rain/pool
clamp their recessed samples to the art window to avoid pulling in the frame.

Mask preparation happens on the first switch and is reused while cached. Card
animation builds no assets, uploads no textures and performs no readbacks. Rain
and heat use five face samples. Pool adds one shared light pass per changed time,
regardless of visible card count; fixed-time redraws reuse it. Its fixed map/index
allocation is 704,512 bytes, reported separately as `surfaceBytes`.

CI checks silhouette pixels against Rust picking, overlap, masks, exports, moving
image features behind the optical surface, light/dark floor contrast, traveling
caustics and cache/pass reuse. These are software-rendered correctness tests,
not hardware FPS or proof of physical accuracy.
