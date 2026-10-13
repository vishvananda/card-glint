# Existing old-frame source candidates

The first comparison is recorded in
[family results](fixtures/accuracy/old-frame-family-results.json): 35 source
plates, 2,767 cached full scans, 717 set/material/layout/stock groups across
63 major sets. The coverage inventory contains 13,603 printings; the comparison
is a sample study, not a full rerender of that inventory.

**Decision: retain the current source families for this color-calibration round.**
No alternative passed every admission check. Thirty-six groups support retaining
the current asset; 681 need further review because of sparse cohorts, weak or
ambiguous borders, region regressions, or unsettled scan registration. The
current family ranks first for 21 of 24 early-set nonland materials. Alpha
black's Fourth candidate does not transfer to reserved cards; Beta green's
Fourth candidate improves the combined score but regresses individual borders.
Unlimited red lacks enough usable structural regions.

The metric compares signed grayscale gradients and local intensity ordering.
All candidates share the intersection of their opaque frame pixels, eroded by
two canonical pixels, so internal artwork cannot win the comparison. Missing
candidate edges score zero on reference-defined support. Three fixed strips
per edge and separate calibration/reserved names limit text/texture interference.
This replaces an exploratory dark-keyline detector: some frame edges are light,
and strong interior artwork could steal its peak. These are structural scores,
not percentages of whole-card accuracy.

Only 26 of 66 shared set/frame/stock registration groups passed the independent
outer-anchor checks. The early sets retain raw normalized scans: their outer
frame proportions disagree with the fixed target by 2.8–4.3 pixels vertically.
Do not disguise a real frame-proportion difference as a per-scan warp or loosen
registration gates to force an asset winner. Review candidate gains for Arabian
Nights, Legends and Collector's Edition alongside their border regressions.
Typography remains tied to printing policy; no source switch has changed it.

Reproduce with `old-frame-cache.mjs`, `old-frame-templates.mjs`,
`old-frame-measure.mjs`, and `old-frame-select.mjs` in `tools/accuracy/`.
Source plates are captured once in Canvas; all scan measurement and selection
run on the CPU without Chromium. Detailed per-scan profiles stay in the local
cache, while source/method hashes and aggregate candidate scores are committed.
This measures image structure, not CPU submission or GPU completion time.

## Most useful existing asset

The pinned Card Conjurer collection already contains
[`old/abu/dualLand.png`](https://github.com/Investigamer/cardconjurer/blob/2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/dualLand.png),
a 1500 × 2100 alpha mask for alternating nested land bands. The
[ABU pack definition](https://github.com/Investigamer/cardconjurer/blob/2fcddba8966156d484cedf54d8214996748dd5e1/js/frames/packABU.js)
associates it with the neutral and five colored land frames. Composite two
colored land assets through its alpha; its blue RGB is mask visualization,
not printed blue ink. Validate both color ordering and geometry against scans.

This explains the missing stripes in our duals: the current painter chooses a
single generic land frame for a card with two basic-land types. Oracle and
original-wording views must retain the same semantic land palette, even when
the printed type line is only "Land". Avoid substituting color identity for
printed frame colors on arbitrary utility lands.

The Fourth directory has a neutral land asset but no five colored-land assets.
The Seventh directory has those colored lands. ABU and Revised dual scans do
not have identical art-window geometry, so adding the ABU overlay alone does
not certify Revised alignment. Test this as part of source selection before
recalibrating land colors.

## Other source collections inspected

- [Magic Set Editor Full Magic Pack, ABU style](https://github.com/MagicSetEditorPacks/Full-Magic-Pack/tree/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-old-abu.mse-style)
  has 750 × 1054 card JPEGs, separate alpha/land blending masks and historical
  symbol resources. The inspected textures appear closely related to the
  current source family; no demonstrated quality improvement yet. Its art
  overlay is a halftone layer, not a replacement bevel/shadow component.
- [Proxyshop's template manifest](https://github.com/Investigamer/Proxyshop/blob/9be3f1a4058f09fd5eedc890ee27f0e665c6b25c/src/data/manifest.yml)
  lists layered Classic and Classic Remastered templates. Their previews target
  later old-frame styling; they are candidates for later geometry/asset work,
  not established Alpha–Revised replacements. Full PSDs have not been evaluated.

White-card texture was visually confirmed to match the existing asset. Remove
it from replacement candidates. A difference in measured contrast spread is
insufficient evidence of a different texture.

Downloads stay in the local cache/review workspace. Do not add these external
images to the public showcase or README. Inspect provenance and redistribution
terms before adopting assets from a new collection; repository code licensing
does not establish rights to every contained card-frame image.
