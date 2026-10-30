# Magic documentation

Start with the [pack README](../README.md) for a rendering example and contribution
checks. Read [asset sources and terms](../NOTICE.md) before using external assets.

## Use the pack

- [Loading only displayed sets](lazy-loading.md): collection imports and per-set data.
- [Provider cards](provider-cards.md): Scryfall and MTGJSON adapters.
- [Original and Oracle wording](wording.md): symbol era, centering, flavor and corrections.
- [Printing presets](printing-presets.md): frame selection, overrides and artwork placement.
- [Printing styles](printing-styles.md): reusable styles and inheritance.
- [Rendering inputs](rendering-inputs.md): semantic types, frame colors and asset preparation.
- [Host rendering](host-rendering.md): low-level painting, masks and editor controls.
- [Finishes and stamps](finishes.md): whole-card finishes and local holograms.
- [Symbol controls](symbol-adjustments.md): position, size, spacing and generic numerals.

## Calibrate and contribute

- [Calibrate a set](calibrating-a-set.md): measurement process, one-file profiles and PR evidence.
- [Calibration defaults](calibration-defaults.md): inherited styles, HSB and source policies.
- [Source map](source-map.md): geometry, painting and cache owners.
- [Completion contract](calibration-completion.md): evidence needed to check off a component.
- [Frame registration](frame-registration.md): scan normalization.
- [HSB calibration](hsb-calibration.md) and [five-set color audit](five-set-colors.md).
- [Component review plan](component-review-plan.md) and [calibration rollout](calibration-rollout.md).
- [Lab](https://cardforge.fyi/lab/): current status, comparisons and review tools.

A study reports its own source versions and measured scope. It does not certify
later releases. Check the current profile and Lab status before reusing values.

## Frame and typography notes

- [Supported templates](standard-templates.md) and [special-frame audit](special-frame-audit.md).
- [Frame asset selection](frame-assets.md) and [asset research](frame-asset-research.md).
- [Futureshifted](futureshifted.md), [Planar Chaos](planar-chaos.md),
  [Eighth Edition](eighth-edition.md), and [Flip/Battle templates](template-frames.md).
- [Set symbol assets](set-symbol-assets.md): styled sources, masks and SVG patches.
- [Revised lands](retro-lands.md) and [early-printing follow-up](early-printing-followup.md).
- [Planeswalker materials](planeswalker-materials.md).
- [Sagas](saga-layout.md), [Adventure](adventure-layout.md), [Prepared cards](prepare-layout.md),
  [split and Fuse](split-layout.md), and [Aftermath](aftermath-layout.md).
- [Historical mana](historical-mana.md) and [flavor attributions](flavor-attribution.md).
- [Wear references](wear-references.md).

## Study history and queued work

- [Mirage/Onslaught study](mirage-onslaught-study.md): current source checks, scan normalization and independent default calibration.

- [Earlier accuracy examples](accuracy-examples.md): commands and past set results.
- [Accuracy pipeline history](accuracy-plan.md): development studies.
- [Accuracy backlog](accuracy-backlog.md): recorded issues and follow-up work.
- [M21 study history](m21-calibration-study.md): normalization and calibration experiments.
- [Released M21 comparison](../fixtures/accuracy/m21/release-0612-comparison.json):
  all 297 ordinary printings, including regressions.

- [Alpha/Beta/Unlimited fractional text recheck](abu-fractional-text.md):
  full-corpus scores, guarded fitting, small-face reviews and reproduction.

- [Old-frame starting defaults](old-frame-defaults.md): measured Fourth/Mirage/Onslaught choices and their coverage limits.
  \n- [Font geometry across browsers](font-portability.md): anchors, real font faces and regression checks.\n
