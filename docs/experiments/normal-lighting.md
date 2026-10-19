# Normal-driven virtual studio

`Frame.lighting: 'studio'` opts into a fixed virtual studio for foil and living
surfaces. `normalLightingVersion === 1` detects support. Existing callers retain
their pointer-driven appearance by default. Gloss restores the pointer-based
varnish from 0.5.3 for compatibility; the 0.5.4 softbox is selected by studio mode.

Supply world-space `Instance.normal` values from the visible card pose. Lighting
ignores `Frame.pointer` in this mode. Actual `Frame.hover` hits still disturb water.
The normalized studio uses the same lamp, camera and card basis as 2D gloss.
The foil source follows the mirror image of the lamp intersected with the card
plane, so it moves with the clear-coat reflection and can leave the face.
Diffraction bands, etched relief, embossed facets and water remain separate
material responses; this is an analytic visual approximation, not a spectral
press or measured BRDF simulation. The shared virtual foil source is intended
for upright, normalized card hosts; it does not reconstruct arbitrary scene
translation or in-plane roll from a normal alone.

Use the same `lighting`, `normal`, `finish`, printing settings and surface time
in `exportCard` for matching PNGs. Preparation, fonts and cached face assets are
unchanged. The mode adds small shader calculations and one draw uniform, with no
per-frame readbacks, texture uploads, mask work or shader compilation.

`node tests/normal-lighting.mjs` checks all ten finishes for pointer invariance,
pose response, default-mode parity, aligned horizontal highlight motion, printed
coating invariance and live/PNG parity. Browser metrics describe submitted work,
not GPU completion. Physical GPU and mobile review remain necessary.
