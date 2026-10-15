# README media

The animated GIF embeds directly in GitHub's README. Clicking it opens the live
GitHub Pages showcase. The MP4 is linked separately for sharper playback with
native pause and seek controls; no JavaScript runs inside the README.

The paired eight-second captures use the actual Rust/WASM + WebGL2 renderer and
original [showcase artwork and frames](../../games/showcase/art/README.md).
Both reuse four cards, including Dawnwing Griffin:

- `showcase-foils.gif` / `.mp4`: prismatic, cold foil, Opal embossing, etched gold.
- `showcase-living.gif` / `.mp4`: rain, pool water, heat shimmer, gloss.

Each card tilts independently around a fixed light. Living surfaces advance their
simulation clock and heat also deforms the silhouette. The tilt follows a periodic
path; the living simulations are not guaranteed to loop seamlessly. Each capture
has an opaque background and finish labels.

After installing the repository's build prerequisites, Playwright Chromium and
FFmpeg with libx264 support:

```sh
npm run build
npm run preview
# In another terminal:
npm run media:showcase
```

The script captures 192 frames per group at 1600 × 644, then encodes an H.264 MP4 at 24 fps
and a smaller 1000 × 402 GIF at 12 fps. It uses the public scene/layout interfaces,
with headless Chromium's software WebGL for offline capture. These frames are
illustrations of the rendering, not a real-time performance benchmark.

Raw frames stay in ignored `test-results/showcase-media/`. Use `--capture-only`
or `--encode-only` to repeat one stage. Add `--group=foils` or `--group=living`
to capture only one group. `LAB_URL` can select a different preview
and `FFMPEG` can specify a binary path. Rebuild after encoding to include the new
GIFs and MP4s in the GitHub Pages artifact. CI checks the renderer but does not recapture
these media on every push. `npm run test:showcase` refreshes the static PNG.

Media uses the repository's MIT OR Apache-2.0 license. No external game artwork,
private host assets or model-generated video is included.
