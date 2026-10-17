# Continuous foil lighting around flat

The shared `foilPointer` helper used a narrow Gaussian to move studio light away
from dead center at rest. Its offset changed too quickly near flat, so a steadily
moving pointer could produce a reversing or accelerated highlight. This affected
gloss, etched, prismatic, cold, Opal, rain, heat and pool finishes.

The offset now tapers broadly. The flat-pose lighting is preserved. Before
clamping, the offset's Jacobian has norm below 0.33, bounding the total mapping's
gain between 0.67 and 1.33 and preventing that fold. No new textures, readbacks,
program compilation or per-frame allocations are needed.

The shader audit also replaces two undefined operations:

- Hologram and optional liquid-coating highlights square signed axes directly,
  instead of calling `pow` with a potentially negative base.
- Etched/Opal sparkle fades use `1 - smoothstep(low, high, value)` instead of
  reversed smoothstep edges.

These input restrictions are specified in the
[GLSL ES specification](https://registry.khronos.org/OpenGL/specs/es/3.2/GLSL_ES_Specification_3.20.html).
The palette wraps join their endpoint colors; foil pillar envelopes vanish on
both sides of their `fract` wrap. Reflection denominators already have positive
floors, and surface reflection powers have nonnegative bases. These paths have
no additional zero-crossing changes in this patch.

`npm run test:foil-continuity` compiles the actual shared helper into a small GPU
probe. It samples two-axis lighting through flat and checks monotonic direction
and bounded gain, accounting for the CSS-to-texture Y inversion. The original
narrow offset fails this test (`FOIL_REFERENCE_NARROW=1`). GPU readback on Linux
Chromium/SwiftShader measured minimum forward gain -1.30 and maximum gain 3.90
for the former mapping, versus 0.85 and 1.16 for the corrected mapping over the
sampled range.

The integration portion renders all nine finishes with a hologram, sweeping
small pointer and surface-normal changes across flat on both axes at fixed
time. It bounds frame changes and checks GL errors. See
[`evidence/foil-continuity.json`](../evidence/foil-continuity.json). Separate
hologram, overlay-foil and optical-surface tests cover their full behavior.
This includes GPU readback completion, rather than only CPU submission timing.
These software-rendering checks do not constitute physical GPU validation on
macOS, iPhone, Windows or Linux. The evidence records the actual host platform
and Chromium version for each run.
