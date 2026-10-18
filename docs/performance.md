# Performance and caching

The cache is shared by GPU and Rust etching. Both paths retain finished R8
textures. A resident hit does no edge detection, composition, readback, or upload;
a faster detector only helps misses. Masks, printed faces, overlays, and decoded
sources have separate keys, so changing a name or rotating a card does not
invalidate artwork edges. Intermediate edge/stamp textures are evicted before
finished display textures. See [architecture](architecture.md) for the exact keys,
leases, and byte limits.

## Reproduce

Build, start `npm run preview`, then open the lab and choose **Measure cache
lifecycle**. Copy the report with the button below it. Record the hardware,
browser/version, power mode, and whether model inference was running. For a
repeatable regression run, use `npm run test:browser` against the preview. The
JSON and screenshot are written to `evidence/`. `npm run test:package` installs a
packed tarball in an isolated directory and checks TypeScript declarations and
Vite consumption without another application checkout.

## Measurement scope

The hardware tables below preserve user-supplied historical measurements from
2026-10-10. They used one decoded 512 × 341 illustration from a prior private
fixture. That illustration is not distributed here. The original public showcase
uses a different illustration; results are comparable in resource size and
method, not as identical artwork. The new build-host regression report is
[evidence/browser.json](../evidence/browser.json); its software GPU is useful
for lifecycle correctness, not hardware recommendations.

Both detectors retain identical R8 textures and use the same Rust LRU. Mask miss,
pressure and restore timings force completion with readback. Production GPU
preparation has no readback. Hit batches contain no GL work. Network, fonts,
face painting and full-scene GPU rendering are excluded. Eight recipe keys vary
threshold on one decoded image. GPU scratch is separate from resident payload.

## Apple M1 measurements

The user supplied [this summarized lab report](../evidence/m1-cache-summary.json)
on 2026-10-10, from Chrome 154 on an M1 Mac. Power mode and concurrent model
inference were not recorded. These measurements use the same 512 × 341 source
and cache workloads; they are one run, with five cold samples per path.

| Workload                             | Rust/WASM detector | GPU detector |
| ------------------------------------ | -----------------: | -----------: |
| Cold mask, completed                 |             2.8 ms |       1.8 ms |
| 10,000 resident lookups and leases   |             1.3 ms |       1.2 ms |
| Rebuilds / uploads on those hits     |              0 / 0 |        0 / 0 |
| 800 requests, eight resident keys    |         0 rebuilds |   0 rebuilds |
| 24 requests, four-mask budget        |           180.5 ms |     152.5 ms |
| Last workload's rebuilds / evictions |            24 / 20 |      24 / 20 |

GPU cold preparation was **35.7% faster**, and the yielding pressure workload
was **15.5% faster**. The mask bytes were identical. Resident hits cost about
0.12–0.13 microseconds each in the aggregate batch; the small difference between
paths is too close to timer granularity to rank them. Both use the same Rust
cache and retain the same finished R8 payload. GPU preparation needs an extra
1,222,144 bytes (1.17 MiB) of reusable scratch for this size.

Eight masks need 1.33 MiB. Halving that budget to 0.67 MiB caused complete thrash
on this intentionally cyclic access pattern. Protecting the working set is more
valuable than the roughly 1 ms saved on an individual miss. At a 99% hit rate,
that miss improvement saves about 0.01 ms per request for this workload.

The whole-face reuse observation also caused zero new compositions, mask
builds, edge builds, or uploads. It took 0.2 ms and retained 26.3 MiB of GPU
payload across the faces visited in that session. The scene had 2,000 repeated
instances, but this **does not time drawing them**. The immediate snapshot still
included one promise awaiting cleanup; this is not evidence of ongoing GPU work.
No M1 GPU-completed full-scene timing was collected.

These results support GPU preparation with resident texture caching on this
hardware. Retain the Rust fallback and measure unique-card scenes, tier changes,
and contention with model inference before choosing a device-wide policy.

## Older Mac measurements

A second [user-supplied report](../evidence/older-mac-cache-summary.json), from
Chrome 155 on an older Mac, shows why the fallback remains useful. The chip,
power mode, and concurrent inference were not recorded.

| Workload                           | Rust/WASM detector | GPU detector |
| ---------------------------------- | -----------------: | -----------: |
| Cold mask, completed               |            11.8 ms |      10.7 ms |
| 10,000 resident lookups and leases |             5.0 ms |       3.8 ms |
| 800 requests, eight resident keys  |         0 rebuilds |   0 rebuilds |
| 24 requests, four-mask budget      |           382.1 ms |     516.6 ms |

GPU was 9.3% faster on cold masks but **35.2% slower under pressure**. Both paths
produced identical pixels, hit without rebuilding or uploading, and stayed
within the same resident mask budget. The pressure test includes forced readback
and timer yields; it does not isolate shader execution. The separate GPU rebuild
measurement was 6.3 ms versus 10.7 ms in the earlier cold sequence, so repeated
runs and a readback-free completion measurement are needed before automating
backend selection. A single short cold test would pick the wrong backend for
this measured churn workload.

Whole-face reuse took 0.4 ms with no extra compositions, masks, edges, or uploads.
The 22.6 MiB retained GPU payload differs from the M1 session because the visited
faces differ; neither figure measures total device memory. Cache reuse is the
consistent win across both Macs. Prefer a fitted working set and keep backend
selection explicit until more representative measurements are available.

## iPhone measurements

The [iPhone report](../evidence/iphone-cache-summary.json) uses Chrome for iOS
155 / WebKit 605.1.15 on iOS 26.6.2. The exact phone model, Low Power Mode,
and concurrent inference were not included in this report.

| Workload                           | Rust/WASM detector | GPU detector |
| ---------------------------------- | -----------------: | -----------: |
| Cold mask, completed               |               3 ms |         4 ms |
| 10,000 resident lookups and leases |               3 ms |         5 ms |
| 800 requests, eight resident keys  |         0 rebuilds |   0 rebuilds |
| 24 requests, four-mask budget      |             240 ms |       323 ms |

Rust took 25% less time on the cold-mask workload and 25.7% less under pressure
(equivalently, GPU took 33.3% and 34.6% longer). Masks were byte-identical and
resident hits did no rebuilds or uploads. Both 800-request hit batches reported
0 ms, indicating timer granularity, not zero work. The shared cache code does
not depend on the detector; small hit-time differences are not GPU work.
Whole-face reuse took 1 ms with no new resources; this is not a full-frame GPU
timing. The retained GPU payload was 22.6 MiB, excluding other browser memory.

For these measurements, keep GPU preparation available for the M1 and retain
the Rust option for the phone and older hardware. Do not hardcode a browser or
chip policy from three single runs. Next calibration should repeat realistic
miss bursts, time completion without full readback, record jitter and memory,
and include concurrent inference. No automatic backend policy was changed.

## Persistence across context loss or page loads

GPU objects cannot survive context loss. Decoded sources can survive and rebuild
the derived textures. An optional alternative is reading an R8 mask, compressing
it, storing it in CacheStorage, and uploading it in a later context. The lab
measures that full path; it is not enabled in the renderer by default.

The break-even formula is
`ceil((snapshot + gzip + write) / (rebuild − read/decode − upload))`.
A nonpositive denominator means persistence never pays back in that workload.
Measurements use warm CacheStorage, not OS-cold disk. Any optional snapshot
belongs outside interaction and model inference.

For the M1, snapshot + gzip + write cost **5.5 ms**. Read/decode took **0.6 ms**
and upload/completion **1.4 ms**, totaling about **2.0 ms**, versus **2.0 ms**
to rebuild. The near-zero difference is timer noise, not a persistence win;
there is no measured break-even. Keep encoded sources in the HTTP cache and
finished masks in the live texture cache. Leave derived-mask persistence off.

The older Mac also showed no persistence benefit: **6.6 ms** to read/decode and
upload versus **6.3 ms** to rebuild, plus **15.5 ms** to snapshot/compress/write.
This reinforces keeping persistence disabled by default on hardware GPUs.

The iPhone is the only hardware sample with a measured per-restore saving:
**2 ms** to restore versus **3 ms** to rebuild. Snapshot, compression and write
cost **20 ms**, giving the reported **20-restore** break-even. With 1 ms timing
resolution and warm CacheStorage reads, that estimate is coarse. This is not
compelling enough to put persistence/readback on the interaction path. Leave
it optional and disabled for now.

## Scene scaling and correctness

The regression scene draws **2,000 instances sharing three prepared faces in
three draw calls**, without additional face compositions, masks, uploads, or
normal-path readbacks. Current CPU submission measurements and retained payload
counts are in the [browser report](../evidence/browser.json). They exclude GPU
completion and do not establish FPS.

This does not demonstrate 2,000 unique faces fitting in that budget. Unique faces
need resolution tiers, eviction scheduling, and eventually texture-array paging.
The host currently chooses the `table` or `inspect` tier. Total memory includes
more than the counters: display/depth buffers, driver allocation padding,
programs, Canvas staging, decoders, and WASM pages are additional allocations.

Pixel checks cover front-card occlusion of rear foil, overlays above foil,
foil exclusion, and world quads passing behind/in front of cards. Lifecycle
checks cover canceled revisions, epoch clearing, restoring a lost context, and
reloading a scene overlay after budget eviction. Failed asset preparation is
reported once; an explicit `ready()` retries it instead of every animation frame
starting another failed request.

## Distribution footprint

The generic browser backend and WASM are separate cacheable modules. The
showcase is an optional subpath export; consumers supply their own game pack
without importing it. `npm run test:package` verifies an independent TypeScript
and Vite consumer using only the packed archive. Illustrations are SVG sources,
with no downloaded frames or font binaries. Build output reports module sizes.

## Optional printing shader paths

Procedural print-dot screens compile separately from ordinary and cached-printing
shaders. Amount-zero branches inside the shared shader still imposed substantial
software-renderer cost; cached printing now uses the smaller shader as well.
Both variants compile at context creation, with no compilation while tilting.

A [short before/after diagnostic](../evidence/cardstock-paths.json) used one
366 × 510 card with a 732 × 1020 source in Chromium SwiftShader on macOS.
Mean warmed gloss draw plus full pixel readback fell from about 1,074 ms to
105 ms; cardstock gloss fell from 1,081 ms to 115 ms. Each mean has only two
warmed samples, after a separate first draw. These are software-raster timings
including readback, not hardware GPU timings or FPS. CPU submission was below
1 ms and cannot explain completion latency. Relief and cached ink preparation
counts stayed constant after warmup. Mixed screen settings retain the procedural
fallback, with separate pixel and cache regression coverage.

Fine print screens (periods below four source pixels) integrate four subpixel
positions once when cached printing is prepared. The ink color and alpha remain
sampled at the source texel, keeping lettering sharp. At full variation,
registration jitter spans half a screen cell to break coherent empty rows; the
neighbor reach includes that displacement so dot and hole screens remain joined.
This adds preparation work only; pointer frames reuse the same bounded cache.
The pixel-area regression compares against a dense reference and checks source
edges, alpha, zero intensity and unchanged coarse-screen sampling. It is software
WebGL validation, not a physical external-monitor or GPU-completion benchmark.
