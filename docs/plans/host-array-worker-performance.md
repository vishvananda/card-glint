# Host sampling, worker composition and small-card performance

Target release: 0.6.0. This adds public host contracts and native raster sizing;
existing uniform shader assembly and main-thread composition remain supported.
The host continues to own its context, texture residency, tiers and scene.

1. Add `foilShader({sampling: 'host'})` and a shared `GLINT_HOST_SAMPLING`
   contract for printing, cardstock and optical surfaces. Hosts supply linear
   face and red-channel mask sampling functions; a texture-array implementation
   selects its own per-instance layers. Face pixel size and finish/pose/art
   parameters are flat fragment inputs. Use face texels for slope offsets and
   sampling clamps. Test actual instanced arrays, including different faces,
   masks, dimensions, art bounds and finish kinds in the same draw.
2. Move Canvas2D allocation behind a portable, game-neutral helper. Magic painters
   accept browser and OffscreenCanvas contexts. Worker composition uses host
   bitmap/font hooks and can return a transferable ImageBitmap for both face and
   etching outputs, including custom composition. Preserve cancellation, cleanup
   and atomic completion. Test a real worker with no document and loaded fonts.
3. Add native 488×680 composition and bounded arbitrary widths. Derive print
   screen spacing in card-width units, preserving the established 732px look.
   Test consistent screen phase across 244, 488 and 732px and minification.
4. Make etching coverage directly uploadable in red, with an R8 byte export where
   appropriate. Document alpha, color space, row order and ownership; validate
   an asymmetric mask through actual host upload without a JavaScript row flip.
5. Correct the face-texture mipmap documentation against the implementation.
   Measure before adding GPU work. Host faces use mipmapped linear minification,
   linear magnification and clamped edges, with correct sRGB decoding once.
6. Benchmark hundreds of distinct small faces with all foil features. Separate
   cold composition/upload from warm drawing; record preparation counts, memory,
   draw calls and CPU submission time. Record completed GPU time separately when
   timer queries are supported. Verify warm motion performs no image decoding,
   font loading, compilation, mask readback or face recomposition. Optimize the
   measured bottlenecks and retain reproducible benchmark evidence.

Run the repository's required renderer checks, strict native/WASM Clippy, worker
and host integration tests, and the distinct-face performance fixture before
publishing. Report tested browsers and hardware; software GPU measurements are
not evidence of physical-device GPU performance.
