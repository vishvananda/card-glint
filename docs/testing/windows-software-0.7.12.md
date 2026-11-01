# Windows software graphics checks — 0.7.12

The optimized renderer passed high/low finish exports, visible printing, and
300-face stress checks on Firefox/WARP. The
[recorded Firefox results](windows-software-0.7.12-firefox.json) contain all eight
cases. The release's complete Edge/WARP, Chromium/SwiftShader and Firefox/WARP
matrix is published as a
[JSON release attachment](https://github.com/vishvananda/card-glint/releases/download/v0.7.12/windows-software-0.7.12.json).
See the [reproduction guide](windows-vm.md).

## Changes measured

- Filtered-out dots require no printing helper or procedural material program.
- Visible dots are cached during preparation and sampled through the plain
  material program. An analytic fallback compiles only for mixed settings or
  cache pressure. Entries remain protected until their finishes have ready
  fallbacks, so eviction cannot start warm compilation.
- Native programs exclude unrelated finishes before compilation. CMYK plates
  and area samples use uniform loops instead of duplicated shader graphs.
- Low quality uses fewer rain/heat blur taps, central stationary rain beads,
  single-sample pool irradiance, and less etched/opal micro-grain.

Full-quality controls remain pixel-identical to the historical renderer for all
ten finishes, including printing and local holograms. Separate tests check
visible printing against the historical runtime, mixed settings, multi-finish
cache protection, active working-set overflow, and zero warm compilations.
These are synthetic controls, not a claim about every physical graphics driver.

## Firefox results

Both versions use the same 100→300→100-face workload described in the
[0.7.11 report](windows-software-0.7.11.md). Faces are 122×170 pixels, displayed
as 36×50 thumbnails in an 800×800 drawing buffer, with all ten finishes,
printing and cardstock requested.

| Quality | 0.7.11 prepare first 100 (s) | 0.7.12 prepare first 100 (s) | 0.7.11 largest page gap (s) | 0.7.12 largest page gap (s) |
| ------- | ---------------------------: | ---------------------------: | --------------------------: | --------------------------: |
| Low     |                       308.71 |                        36.34 |                      196.67 |                       10.67 |
| High    |                       322.56 |                        39.19 |                      135.67 |                       10.64 |

The final samples ran during heavy unrelated build activity on the host. Its
load average exceeded 100 during part of the run. The guest CPU is now pinned
to the documented Broadwell-v4 model. OS/driver caches were not flushed. These
are diagnostic observations, not a controlled speedup ratio or FPS benchmark.
The final 300-face warmed median was approximately 779 ms at low quality and
783 ms at high quality; CPU submission, queueing, execution and polling all
contribute to those fence wall times.

A second workload deliberately keeps the dots visible (244×340 source, period
7). Firefox prepared its first full-quality printing in 29.01 s and its first
low-quality printing in 8.35 s. Subsequent full-quality finishes prepared in
roughly 2–6 s. Cold full-detail CMYK preparation remains expensive on software
renderers. `finishQuality: 'auto'` selects low quality for identified software
adapters; the compatibility default remains full quality.

Every reported run completed without a process timeout, shader failure or
context loss. All ten exported finishes covered the card. Cached revisits added
no compositions, masks or uploads. Warm-cache and mask checks are independent
of the cold preparation timings.

## Coverage limits

Windows 11 Enterprise Evaluation build 26300 runs under KVM with four guest
vCPUs and 8 GiB RAM. The host service is limited to three CPU equivalents and
10 GiB without swap. Browsers are headed; adapters are virtual/software.
No physical Intel, AMD or NVIDIA Windows GPU was tested. The guest display
could blank during unattended probes, so these checks establish graphics-command
completion, not scanout or compositor presentation.
