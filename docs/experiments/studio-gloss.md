# Softbox gloss experiment

The approved softbox treatment now replaces the old gloss effect, with a 10%
strength increase. All three cards in the private frame preview share it. Frame
assets, flat overlays and accuracy scores are unchanged; this is not a release.

The native face pass receives surface positions and a camera recovered from the
view-projection matrix. Reflection rays intersect a fixed rectangular softbox.
A blurred source approximates rough coating, and a small dielectric Fresnel term
sets its strength. This is an area-reflection approximation, not integrated GGX.
The lamp is defined in card-height world units. Pointer position and elapsed time
have no direct lighting effect. Existing cardstock modulates the coating.

The preview uses the normalized 2D virtual studio with physical posed normals.
Its visual tilt and optical normal use the same bounded angles: vertical rotation
is reduced from 17.2° to 14.9°, and the combined angle is capped at 18°.
That cap also limits purely horizontal rotation to 18°. The card motion springs remain host-owned. All three
cards again share one renderer and one lighting model; export uses that model.

Prepare a new local directory from the existing private preview:

```sh
npm run build
node games/magic/tools/accuracy/studio-gloss-preview.mjs \
  BASE_SITE NEW_SITE dist/lib SURFACE_POSE
python3 -m http.server --directory NEW_SITE
node tests/studio-gloss.mjs
```

The preparation script reuses large local study assets with symlinks and copies
the experimental runtime. Deploy only the changed page files and that runtime
alongside the existing study assets; do not publish external card art in the
repository showcase. The source snapshot must remain available locally.

The lighting test checks pointer/time invariance, a stationary reflection while
a uniform card spins in its plane, a highlight that exits under tilt, restrained
intensity, and unchanged warm composition/upload/readback counts. Pixel reads in
the test validate GPU output; CPU submission timings are not GPU completion.
