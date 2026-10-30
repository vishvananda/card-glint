# Old-frame starting defaults

Mirage and Onslaught have independent printing profiles. Other ordinary old-frame
sets use the best measured starting point among Fourth Edition, Mirage and
Onslaught. An independent set profile always takes precedence. These defaults
are starting points for a set audit; they do not mark that set complete.

The comparison uses cached full-card scans, fixed scan-only alignment and native
Original renders. Geometry selection agrees with a frame-and-art-only comparison.
The pilot covers 34 sets and keeps rejected scans in its denominator. Small
samples and uncertain Original wording limit what it proves about typography.

| Geometry       | Sets                                                                                                                                                                                                                                                                                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fourth Edition | Ice Age, Alliances, Homelands, Introductory Two-Player Set, Rivals Quick Start                                                                                                                                                                                                                                                                                            |
| Mirage         | Visions, Fifth Edition, Weatherlight, Tempest, Stronghold, Exodus, Urza's Saga, Urza's Legacy, Urza's Destiny, Sixth Edition, Mercadian Masques, Nemesis, Prophecy, Invasion, Planeshift, Apocalypse, Seventh Edition, Odyssey, Torment, Judgment, Legions, Scourge, Battle Royale, Beatdown, Portal, Portal Second Age, Portal Three Kingdoms, Starter 1999, Anthologies |

Onslaught was tested as a geometry donor and did not win these pilots. Its color
curves are useful separately for Legions and Scourge. A few materials use neutral
source colors or a measured pigment supplement where the geometry donor's colors
fit poorly. Surround colors remain target-owned, including white borders.

The runtime preserves each target's expansion symbol, artist and legal wording,
footer and stats. It also preserves heading, mana or body components when the
pilot found the previous treatment better. Unsupported special layouts and
explicit custom frame selections do not inherit these defaults.

## Where to change values

- Independent profile: games/magic/src/calibration/sets/SET.ts.
- Shared starting-point choices: games/magic/src/calibration/old-frame-default-values.ts.
- Frozen donor study: games/magic/fixtures/accuracy/mirage-onslaught/default-donor-review.json.
- Installed replay and color decisions: games/magic/fixtures/accuracy/mirage-onslaught/production-adoption.json.gz.
- Current numbers and remaining checks: games/magic/fixtures/accuracy/mirage-onslaught/installed-review.json.

Use loadMagicSet(set) before synchronous queries, or prepareMagicCards(faces)
before composing a collection. These load only the required donor tables.
Printing corrections remain a separate loadPrintingSet(set) operation.
The compatibility Magic entry loads all tables for synchronous callers.

## Repeating the check

Use the calibration guide to cache references and build Original inputs first.
Keep the reference hashes, wording review, scan poses, renderer source identity
and metric source graph with the result. Do not refit scan alignment when choosing
a render profile.

The accuracy tools include old-frame-installed-capture.mjs for exact candidate
parity, old-frame-public-source-parity.mjs for public Original/Oracle wording,
old-frame-installed-default-study.mjs for donor integration and retained-footer
checks, and old-frame-adoption-controls.mjs for unchanged foreign/custom frames.
Each tool prints its required positional arguments when called without arguments.
Native capture runs use cached assets and refuse unlisted network requests.

Review color separately from structure. A structural improvement can conceal a
worse pigment match. The color tools sample frame strips and text-cleared paper,
exclude illustrations, preserve rejected scans, and require a native replay
before adopting continuous pigment fits. Record coverage limits and individual
regressions with the comparison rather than claiming full-set validation.
