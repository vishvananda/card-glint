# Optical treatments

The effects use the prepared card face as their refracted image. They stay in
the card's depth pass, with the same silhouette, overlay ordering and masks.
Each treatment has a small shader module under `packages/browser/src/gpu`.

## Rain on glass

[Lucas Bebber's rain experiments](https://tympanus.net/codrops/2015/11/04/rain-water-effect-experiments/)
separate a soft background from sharp refractive drops, with larger drops
clearing trails through smaller ones. [Tatarchuk and Isidoro's rain presentation](https://www.realtimerendering.com/advances/s2006/Tatarchuk-Rain.pdf)
also discusses glass droplets, streams and their lighting. These informed the
visual model; their code and image assets are not bundled.

Our bounded analytic approximation uses small cap gradients to refract the
face, instead of drawing bright circles or exaggerated rainbow rims. Beads
appear at seeded positions; draining drops move downward and clear narrow
tracks. Condensation lightly softens and lifts the background, while lenses
and cleared tracks remain sharp. Drop highlights respond to card tilt.
It does not conserve water volume or simulate collision-driven merging.

## Heat

The distortion field varies rapidly vertically and slowly horizontally, making
broad horizontal air layers. Displacement is primarily lateral, with much less
vertical motion. A small anisotropic filter softens the image without adding a
blur texture. A weak warm reflection follows tilt. This is refracted printed
content, not geometric deformation of the card.

## Pool

The former effect outlined cells whose centers oscillated around a fixed
lattice. That produced persistent polygons, even while their edges moved.
The replacement uses traveling waves and continuous transport across the card.

[GPU Gems: Rendering Water Caustics](https://developer.nvidia.com/gpugems/gpugems/part-i-natural-effects/chapter-2-rendering-water-caustics)
describes inexpensive wave-derived caustics. [Evan Wallace's explanation](https://medium.com/@evanwallace/rendering-realtime-caustics-in-webgl-2a99a29a0b2c)
shows how shrinking a light footprint increases its brightness. Our implementation
uses that area-convergence idea in an analytic approximation, rather than
importing his mesh simulation or rendering to a caustics texture.

Six waves provide a surface gradient and Hessian. We approximate the mapping
from water to floor as `p + d * gradient(h)`, whose Jacobian is
`I + d * Hessian(h)`. A bounded inverse determinant highlights convergence.
One inverse-footprint estimate locates this on the receiving floor. Pixel
derivatives soften singular folds. Different phase speeds and continuous
translation make the light travel rather than pulse at fixed positions.

This omits multiple ray paths and full energy conservation. It is a rendering
approximation, not a general fluid solver. Existing slosh and local pointer
ripples still affect refraction and reflections. The image-correlation test
checks transport over several frame pairs, separately from basic animation.

## Coverage and cost

**Effect: Full card / Artwork only** applies to all seven treatments and PNG
export. The showcase builds an additive mask from the pack's `artWindows`, with
`finishCoverageBase: 0` for artwork-only. Full-card coverage uses base 1.
Exclusions take precedence, and over-finish content stays sharp. A transparent
over-finish layer carries the mask without invalidating the prepared face.

Mask preparation happens on the first switch and is reused while cached.
Animation builds no assets, uploads no textures and performs no readbacks.
The new rain and heat filters cost five face samples per shaded fragment;
rain also evaluates eighteen candidate drops. Pool evaluates twelve wave terms
and four bounded ripples. Fragment cost grows with visible area and overdraw;
these are not hardware performance measurements. CI tests output pixels, cache
counters, masks, export behavior and caustic transport.
