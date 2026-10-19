# Softbox gloss experiment

This branch tests restrained clear varnish on the right card of the private
three-card frame preview. The two controls keep their frozen renderer. Frame
assets, flat overlays and accuracy scores are unchanged; this is not a release.

The native face pass receives surface positions and a camera recovered from the
view-projection matrix. Reflection rays intersect a fixed rectangular softbox.
A blurred source approximates rough coating, and a small dielectric Fresnel term
sets its strength. This is an area-reflection approximation, not integrated GGX.
The lamp is defined in card-height world units. Pointer position and elapsed time
have no direct lighting effect. Existing cardstock modulates the coating.

The private page previously combined projection and model transforms. Its right
card now separates them while retaining exactly the same projected geometry.
Its surface normal follows the actual transformed plane. A separate renderer
keeps the two controls on their original lighting. The experiment adds no public
finish enum or new host API. Preview export uses the same virtual studio.

Prepare a new local directory from the existing private preview:

```sh
npm run build
node games/magic/tools/accuracy/studio-gloss-preview.mjs \
  BASE_SITE NEW_SITE dist/lib
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
