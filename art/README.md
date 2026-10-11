# Original showcase artwork

The three featured illustrations were created for card-glint with OpenAI's
built-in image generation tool on October 10, 2026. No reference images,
existing game artwork, frames, logos or fonts were supplied. They are
AI-generated illustrations, not scans or commissioned paintings.

| File          | Illustration                                                                                         |
| ------------- | ---------------------------------------------------------------------------------------------------- |
| `orbit.webp`  | **Starfall Seer** — a celestial wayfinder holding a luminous astrolabe above floating observatories. |
| `tide.webp`   | **Tidebound Wyrm** — a jade-scaled sea dragon rising through a drowned temple.                       |
| `garden.webp` | **Cinderbloom** — an ancient stag with ember-blossomed antlers in a rain-soaked forest.              |

All three are 1536 × 1024. The generated PNGs were re-encoded as WebP at quality
0.9 using the browser encoder for smaller downloads. The composition is unchanged.
The exact generation prompts are recorded in [prompts.json](prompts.json).

These assets are offered under the repository's **MIT OR Apache-2.0** license.
The code-drawn frames and symbols are independent of the illustrations. No
internal art assets are used. The renderer can load your own separately licensed
artwork without this example pack.

`orbit.svg`, `tide.svg` and `garden.svg` are small, deterministic geometric
alternatives under the same license. Run `npm run art` to regenerate them from
[`scripts/generate-showcase-art.mjs`](../../../scripts/generate-showcase-art.mjs).
