# README media

The animated GIF embeds directly in GitHub's README. Clicking it opens the live
GitHub Pages showcase. The MP4 is linked separately for sharper playback with
native pause and seek controls; no JavaScript runs inside the README.

Both are eight-second loops of the actual Rust/WASM + WebGL2 renderer using
the original [showcase artwork and frames](../../games/showcase/art/README.md).
The finishes are etched, cold foil and opal. Each card tilts independently around
a fixed light. Motion follows a periodic path so the loop has no abrupt reset.
The background is opaque for predictable GIF and video playback.

After installing the repository's build prerequisites, Playwright Chromium and
FFmpeg with libx264 support:

```sh
npm run build
npm run preview
# In another terminal:
npm run media:showcase
```

The script captures 192 frames at 1200 × 584, then encodes an H.264 MP4 at 24 fps
and a smaller 800 × 390 GIF at 12 fps. It uses the public scene/layout interfaces,
with headless Chromium's software WebGL for offline capture. These frames are
illustrations of the rendering, not a real-time performance benchmark.

Raw frames stay in ignored `test-results/showcase-media/`. Use `--capture-only`
or `--encode-only` to repeat one stage. `LAB_URL` can select a different preview
and `FFMPEG` can specify a binary path. Rebuild after encoding to include the new
MP4 in the GitHub Pages artifact. CI checks the renderer but does not recapture
these media on every push. `npm run test:showcase` refreshes the static PNG.

Media uses the repository's MIT OR Apache-2.0 license. No external game artwork,
private host assets or model-generated video is included.
