# Arabian Nights and Antiquities artifact repair

This repair changes only artifact source clipping and pigment curves. It does
not complete either set's calibration. Lab will receive it with the next release.

The selected Fourth Edition artifact asset contains opaque white source margins.
ARN's stock window exposed a visible strip at the left edge and a smaller strip
at the right. Intersecting the window with measured colored-source bounds removes
these strips. The frame, illustration and lettering positions remain unchanged.
ATQ receives the same source-bound clipping repair using its own frame placement.

Color fitting uses one shared transform per set and component, with frozen
scan-only alignment. The first paper proposal failed full-card validation.
Clearing text from each reference before pooling produces a better paper fit.

| Set | Native artifact faces | Reserved names | Frame error, before → after | Paper background error, before → after |
| --- | --------------------: | -------------: | --------------------------: | -------------------------------------: |
| ARN |                    14 |              5 |                 2.93 → 2.29 |                            1.76 → 1.34 |
| ATQ |                    45 |             11 |                 6.28 → 4.50 |                            2.71 → 1.78 |

These are mean Oklab color errors, not accuracy scores; lower is better. The
evidence retains every printing and individual regression. ARN's frame fit
improves 3 of 5 reserved cards; its paper background improves all 5. ATQ's frame
improves all 11; its paper background improves 10 of 11.

All 59 installed native faces exactly match the tested candidates. Illustration
interiors are byte-identical to the previous renderer, and text layout records
are unchanged. A crop-only replay confines changes to the stock-window edges.
The 65 unrelated native frame controls are byte-identical.

[Measurements and candidate values](../../fixtures/accuracy/mirage-onslaught/artifact-source-repair-study.json)
and the compressed artifact-source-delta.json.gz beside them bind inputs,
references, source revisions, native output hashes and the unchanged controls.

## Reproducing the fit

A cached study directory contains inputs.json, frozen poses.json,
exported/inputs.json and normalized reference PNGs, the before/clean/candidate
profiles, and native capture directories. The native source study prepares
clean-control with --material-only; no reference artwork is committed.

    python3 tests/magic-old-frame-stock-fringe.py
    python3 games/magic/tools/accuracy/old_frame_artifact_paper_fit.py \
      "$STUDY" "$STUDY/new-paper-proposal.json"

Replay the proposal through old-frame-native-source-study.mjs with explicit
profiles and - for the geometry-file argument. Then run
old_frame_material_validation.py with --candidate, --profile and --paper-refit.
Inspect the full-card comparison as well as the numerical result. A clean
material prediction alone is insufficient evidence for promotion.

The score report reopens only the changed artifact frame/paper and whole-card
tasks. Original wording, scan poses and other materials keep their evidence.

For the separate ARN cost/inline-symbol correction, see
[Arabian Nights symbol roles](arn-inline-symbols.md).
