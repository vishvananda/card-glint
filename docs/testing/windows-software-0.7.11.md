# Windows software graphics checks — 0.7.11

The VM reproduced long browser stalls while preparing shaders. All six mixed-finish stress cases eventually completed at both quality levels, reached 300 distinct faces, and revisited cached faces without additional compositions, masks or uploads. Passing these functional checks does not mean the software performance is acceptable.

This is a diagnostic sample from 2026-11-01, using the verified published 0.7.11 browser archive. See the [machine-readable results](windows-software-0.7.11.json) and [reproduction guide](windows-vm.md). No renderer code was changed for these checks.

## Environment

- Windows 11 Enterprise Evaluation, build 26300; Node 24.22.2.
- Headed Edge 156.0.4314.58, Playwright Chromium 148.0.7778.96, and Playwright Firefox 150.0.2.
- KVM on an x86 Linux host, four guest vCPUs and 8 GiB RAM. The VM service was limited to three CPU equivalents and 10 GiB host memory, without swap. No host out-of-memory kill or VM restart occurred.
- Actual backends: ANGLE SwiftShader/Vulkan and ANGLE Microsoft Basic Render Driver/D3D11 (WARP). This does not validate physical Intel, AMD or NVIDIA drivers.
- Fresh browser processes per case; OS/driver caches were not flushed. The probes use synthetic canvas faces and a shared mask shape, without game assets, external images or custom font downloads. Diagnostic instrumentation and deadlines evolved during the investigation; the renderer archive and stress dimensions stayed fixed.

## Mixed finishes

Each run prepares 100 and then 300 distinct 122×170 faces, drawn as 36×50 thumbnails in an 800×800 drawing buffer. All ten finishes are mixed with print dots and cardstock requested. Their normal minification filters still apply. Twelve warmed frames are sampled, followed by a cached revisit of the first 100 faces. Coverage readbacks occur once per scene, outside the warmed-frame samples.

Preparation includes face composition and shader/resource preparation. Completed-frame time uses a WebGL fence and includes driver queueing, software execution, scheduling and polling. It is not CPU submission time or a GPU timestamp measurement.

| Browser/backend        | Quality | Prepare first 100 (s) | First completed frame (s) | Median warmed 300-face frame (ms) | Largest 100-face JS heartbeat gap (s) |
| ---------------------- | ------- | --------------------: | ------------------------: | --------------------------------: | ------------------------------------: |
| Chromium / SwiftShader | Low     |                  1.60 |                     33.56 |                            3335.3 |                                  0.85 |
| Chromium / SwiftShader | High    |                  1.08 |                     45.80 |                            3459.2 |                                  0.71 |
| Edge / WARP            | Low     |                141.44 |                      8.98 |                             539.3 |                                  0.53 |
| Edge / WARP            | High    |                224.12 |                      6.13 |                             500.8 |                                  0.69 |
| Firefox / WARP         | Low     |                308.71 |                      5.89 |                             460.0 |                                196.67 |
| Firefox / WARP         | High    |                322.56 |                      5.71 |                             469.0 |                                135.67 |

These are single sequential samples, so small differences between quality levels are not meaningful. The large Firefox heartbeat gaps show a recovered page stall, not a Windows crash. Its low-quality run included a 196.67-second heartbeat gap while preparing the first 100 faces.

## Controls

The regular control keeps the same face sizes and printing settings but selects the regular finish. The bare control also disables print dots and cardstock. All controls passed the same coverage and cache checks.

| Backend                | Bare regular, warmed 300 (ms) | Regular with printing, warmed 300 (ms) | Mixed low-quality finishes, warmed 300 (ms) |
| ---------------------- | ----------------------------: | -------------------------------------: | ------------------------------------------: |
| Chromium / SwiftShader |                         381.3 |                                 1895.5 |                                      3335.3 |
| Edge / WARP            |                         400.3 |                                  319.3 |                                       539.3 |

In this sample, the printing path greatly increased SwiftShader frame cost even at thumbnail size. The WARP controls did not show a consistent printing penalty. Treat the result as a target for isolated profiling, rather than a universal multiplier. Both compilation cost and warmed shading cost need attention.

## Other outcomes

- Edge and Chromium on SwiftShader, and Firefox on WARP, exported all ten individual finishes at both quality levels.
- Initial Edge/WARP finish runs hit a 150-second page deadline after seven low-quality or four high-quality finishes. The later many-face runs used a longer budget and completed. A page deadline is distinct from a shader validation failure or an indefinitely hung process.
- Default Firefox had no WebGL2 context in this VM. Forced WARP was verified from the actual adapter string. This unsupported default was kept separate from rendering failures.
- A deliberate stalled-process test confirmed that the coordinator kills a Node process and its child after the deadline, then remains available. The public matrix CLI also passed an end-to-end Windows control run.

## Next profiling targets

1. Reduce cold preparation of the printing program, especially when print dots are invisible at the selected face tier.
2. Profile the shared material program with printing enabled versus disabled on SwiftShader.
3. Reduce the software cost of the rain and heat material variants; low-quality preparation still took about a minute per variant in Firefox/WARP.
4. Review the reduced-quality material strategy. In 0.7.11, quality changes printing/cardstock preparation, while the main foil material is compiled through the same `materialFragment` path.

Keep future A/B tests on immutable SDK/probe inputs. The matrix runner fingerprints both and refuses a batch whose files change during the run.
