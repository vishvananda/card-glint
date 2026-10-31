# Font geometry across browsers

The Magic pack owns typography. Its Canvas calls go through
[font-geometry.ts](../src/presentation/font-geometry.ts), including in workers.

- A layout chooses its anchor. Font selection never changes it. Ordinary Eighth
  headings use alphabetic anchors; dedicated Planar Chaos and Future Sight
  headings keep their middle anchors.
- The catalog records the actual font outlines and reviewed line anchors. Several
  historical Matrix files contain positive descenders. Browser baseline defaults
  disagree on these files; CSS metric overrides alone do not fix WebKit.
- Sizes snap to 1/64 pixel before assignment. Fractional advances are measured at
  1000 px and cached, then scaled to the requested size. Measurements and painting
  use the same kerning and advances. Canvas getter serialization is not the
  source of truth.
- A named face uses its registered weight and style. Do not request a synthetic
  bold or oblique face. Future Sight numerals load the real MPlantin Bold face.
- Known glyphs use design ink bounds. Unsupported characters retain native
  fallback ink bounds; identical fallback fonts across platforms are not promised.

This fixes geometry and wrapping. Antialiasing and pixel rasterization can still
differ by browser and operating system. Preparation caches measurements; the
animation path does not decode fonts or measure text each frame.

## Validate a change

Run these checks from the repository root:

    npm run test:magic-fonts

The test downloads immutable, hash-verified font sources into a temporary cache.
Set CARD_GLINT_FONT_CACHE to reuse a cache. Set FONT_ENGINES to a comma-separated
list of chromium, webkit and firefox. FONT_CHROME_EXECUTABLE selects an installed
Chrome executable. The required CI job runs on Linux, macOS and Windows.

The test uses actual loaded faces, fractional sizes, all six baselines, wrapping,
and a worker FontFaceSet. A source boundary test rejects direct Canvas font/text
operations outside the shared module. Numeric geometry tolerance is 0.025 px;
raster edge tolerance accounts for antialiasing, not line-wrap differences.

## Add or replace a font

Keep the immutable upstream URL and SHA-256 with the catalog. Survey each source:

    node games/magic/tools/font-audit.mjs /tmp/font-audit

Run on Linux and macOS, then combine both platform survey JSON files and the
verified fonts into one directory. Install fonttools 4.60.1 and brotli 1.2.0 in a
Python environment and regenerate:

    python games/magic/tools/build-font-geometry.py /tmp/font-audit games/magic/src/presentation/font-geometry.json

Review the glyph bounds and anchors. Generate a proposed test reference with
node tests/magic-font-geometry.mjs --write-reference, then inspect the difference.
Do not rebaseline a failing test without explaining the visible change.
Submit cross-platform receipts and card comparisons. Keep font bytes and external
card images out of the repository and public showcase.

A typography change invalidates affected accuracy results. Historical receipts
describe their original renderer; reconstructing historical source does not
approve new scores or complete a set's current calibration.
