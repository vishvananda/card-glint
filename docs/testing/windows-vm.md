# Windows VM shader checks

Use a dedicated Windows evaluation VM to reproduce browser shader preparation,
software graphics and timeout failures. The probes use the published renderer
and synthetic, locally drawn card faces. They do not import a game pack.

Microsoft's former [prebuilt VM link](https://developer.microsoft.com/en-us/windows/downloads/virtual-machines/)
now redirects to its developer documentation. The
[Enterprise evaluation ISO](https://www.microsoft.com/en-us/evalcenter/download-windows-11-enterprise)
provides a 90-day test installation. The commands below pin the English x64
26H2 image and verify its [published checksum](https://support.microsoft.com/en-us/servicing/os/windows/docs/2026/09/verify-the-authenticity-of-a-windows-11-enterprise-evaluation-iso-file).
An unattended installation accepts the evaluation terms. No product key or
personal Microsoft account is added by these helpers.

## Host and storage

Use an x86 Linux host with `/dev/kvm`, QEMU, OVMF Secure Boot firmware, swtpm,
Python 3, genisoimage and unzip. On Ubuntu:

```sh
sudo apt-get install --no-install-recommends \
  qemu-system-x86 qemu-utils ovmf swtpm genisoimage unzip
```

Choose a large data volume. Keep the VM, ISO files, temporary files, logs and
results outside the system drive and repository. Use a path without whitespace.
The private directory contains a generated test-account password and API token;
keep its permissions at 0700 and never commit its contents.

```sh
export VM_ROOT=/path/on/large-volume/card-glint-windows
mkdir -p "$VM_ROOT"/{media,logs,results,state,tools/payload}
chmod 700 "$VM_ROOT"
# On Btrfs, do this while state/ is still empty.
sudo chattr +C "$VM_ROOT/state"
```

The disk is sparse: 96 GiB is its virtual capacity, not its initial allocation.
The guest has 8 GiB RAM and four vCPUs. The managed process is limited to 10 GiB
host memory, no host swap, three CPU equivalents and six hours. It has lower
CPU/I/O priority. The host's KVM group is granted to that process only.

## Verified media and runtime

```sh
curl -fL --retry 3 \
  'https://go.microsoft.com/fwlink/?LinkId=2382600&clcid=0x409&country=us&culture=en-us' \
  -o "$VM_ROOT/media/windows11-enterprise-eval-en-us-x64.iso"
printf '%s  %s\n' \
  BC3F24086EBADC94489066B5AD78089E2CF5C3491E90E790BB81A2B199C10E38 \
  "$VM_ROOT/media/windows11-enterprise-eval-en-us-x64.iso" | sha256sum -c -
mkdir -p "$VM_ROOT/media/installer"
sudo mount -o loop,ro "$VM_ROOT/media/windows11-enterprise-eval-en-us-x64.iso" \
  "$VM_ROOT/media/installer"
genisoimage -quiet -udf -iso-level 3 -J -joliet-long -allow-limited-size \
  -V GLINT_WIN_EVAL -e efi/microsoft/boot/efisys_noprompt.bin -no-emul-boot \
  -o "$VM_ROOT/media/installer-noprompt.iso" "$VM_ROOT/media/installer"
```

The derived ISO uses Microsoft's supplied no-prompt EFI loader. The operating
system image and license files remain unchanged. It avoids interactive boot
keystrokes during automated installation.

Download the Windows Node runtime from [nodejs.org](https://nodejs.org/dist/)
and verify its official SHA256SUMS before using it. For this run:

```sh
curl -fL https://nodejs.org/dist/v24.22.2/node-v24.22.2-win-x64.zip \
  -o "$VM_ROOT/tools/payload/node.zip"
printf '%s  %s\n' \
  ca1bff5d8ead13c9f2ea404a176db46bd430704d5b5113734049fa365e7799e2 \
  "$VM_ROOT/tools/payload/node.zip" | sha256sum -c -
printf '%s\n' \
  '{"sha256":"ca1bff5d8ead13c9f2ea404a176db46bd430704d5b5113734049fa365e7799e2"}' \
  > "$VM_ROOT/tools/node-source.json"
```

Download a published browser archive and its SHA256SUMS from the
[renderer releases](https://github.com/vishvananda/card-glint/releases).
Verify the archive, then extract its contents into `$VM_ROOT/tools/sdk/` so that
`sdk/browser.js` and its matching WASM/chunks are together. Do not mix revisions.
The initial probe uses v0.7.11. No renderer source checkout or Rust compiler is
needed inside Windows.

## Prepare and start

Run these commands from the repository as the normal host user:

```sh
cp scripts/windows-vm/*.{py,sh,ps1,mjs} "$VM_ROOT/tools/"
cp scripts/windows-vm/*.{ps1,mjs} "$VM_ROOT/tools/payload/"
python3 "$VM_ROOT/tools/prepare-answer.py" "$VM_ROOT"
bash "$VM_ROOT/tools/start-vm.sh" "$VM_ROOT" install
```

On hosts that confine swtpm with AppArmor, its local profile may need a rule for
this exact private state directory: `owner "/your/vm/directory/state/**" rwk,`.
Add it to `/etc/apparmor.d/local/usr.bin.swtpm` and reload that profile with
`sudo apparmor_parser -r /etc/apparmor.d/usr.bin.swtpm`. Keep other profiles and
existing rules intact.

Setup creates only the guest disk's partitions. Its local test account installs
a checksum-verified Node runtime and Playwright, then starts an interactive,
limited-token scheduled test agent. Windows protection and the browser sandbox
remain enabled. The account has automatic logon for this disposable VM.
The first authenticated bootstrap event marks the disk installed; a subsequent
`install` launch refuses to overwrite that installation.

The console is a private Unix VNC socket. QMP is also private. The HTTP controller
binds only to 127.0.0.1 and requires a per-VM token. The guest polls outbound
through QEMU user networking; no guest login or debugging port is exposed.

## Run and inspect a probe

Write one job atomically to `$VM_ROOT/tools/job.json`:

```json
{
  "id": "edge-default-auto-001",
  "script": "shader-probe.mjs",
  "backend": "default",
  "quality": "auto",
  "browser": "msedge",
  "timeoutSeconds": 240
}
```

Use a new ID for each run. Backend choices are `default`, `warp`, `swiftshader`;
quality choices are `auto`, `full`, `reduced`. Edge is included with Windows.
`full` and `reduced` correspond to high and low quality. Test both explicitly;
an `auto` result alone does not exercise both paths.
The `chromium` and `firefox` selections require their Playwright browser installs
inside the guest first. A forced backend is a separate diagnostic, not evidence
that the browser's default path works.

To install a Playwright browser, submit a job with
`"script": "install-browsers.mjs"`, the desired `browser`, a new ID and
`"timeoutSeconds": 600`. Keep valid `backend` and `quality` fields. Wait for
that job to complete before submitting its shader probe. The installer uses
Playwright's official browser downloads and the guest's persistent browser cache.

Firefox also needs the [Microsoft Visual C++ v14 x64 runtime](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist).
Download its official `https://aka.ms/vc14/vc_redist.x64.exe` link into
`tools/payload/vc_redist.x64.exe`, then submit an `install-runtime.mjs` job with a
600-second timeout. The helper verifies Microsoft's Authenticode signature and
records the version and SHA256 before installation. Approve the Microsoft
installer's elevation prompt in the private VM console. No browser sandbox or
Windows security setting needs to be disabled.

Use `"script": "stress-probe.mjs"` and a 600-second process timeout for the
many-face test. It prepares 100, then 300 distinct 122×170 faces, displays them
as 36×50 thumbnails in an 800×800 surface, and mixes all ten finishes with
print dots and cardstock. It measures twelve warmed frames and revisits the
first 100 faces without new compositions, masks or uploads. Every phase checks
the rendered coverage. The separate GPU-fence completion time includes queued
driver work; CPU submission time does not. The cold software-driver budget is
longer than the warmed-frame budget. Run this separately at `full` and `reduced`.
`stress-control-probe.mjs` repeats the same faces and sizes with regular finishes
as a control for face-count overhead versus finish shading.

Use `warp` for Firefox's forced software path; its launcher does not support
Chromium's `swiftshader` selection. Always inspect the reported adapter.

Read `logs/guest-events.jsonl` for bootstrap, heartbeat and job progress. Each
completed job saves `results/JOB_ID.json`, including timeouts and child output.
The last `stage: report` JSON line inside `stdout` records the actual adapter,
browser version, selected quality and individual finish results. The Windows
agent terminates a timed-out Node/browser process tree; it does not need to
restart the host.

```sh
python3 "$VM_ROOT/tools/qmp.py" "$VM_ROOT" query-status
python3 "$VM_ROOT/tools/qmp.py" "$VM_ROOT" screendump
sudo systemctl stop card-glint-windows-vm.service
# Later: resume the installed disk without installation media.
bash "$VM_ROOT/tools/start-vm.sh" "$VM_ROOT"
```

`screendump` writes `results/console.png`. To use an interactive VNC client,
forward a local port through SSH to the remote `$VM_ROOT/state/vnc.sock`.
The six-hour process limit is intentional; the launcher can start a new bounded
session when needed. Neither service is enabled automatically at host boot.

## Interpret the results

The probe prepares all ten finishes with print dots and cardstock, exercises
pose/time changes without new static composition or mask uploads, and exports
an opaque card. `readyMs` includes resource/material preparation. `submitMs` is
CPU API time, not GPU completion time. `captureMs` includes explicit export and
readback. The page and process-tree deadlines are independent.
WARP finish tests allow a longer page deadline for slow cold compilation; use
a 600-second process timeout when collecting a complete WARP run.

A VM without GPU passthrough tests WARP/SwiftShader and Windows/ANGLE integration.
It does not validate physical Intel, AMD or NVIDIA drivers. Preserve the actual
adapter, backend and flags with any freeze report. An unavailable WebGL context,
a cold compile, a failed shader and a process timeout are distinct outcomes.

Check the tooling without a VM:

```sh
python3 -m unittest discover -s scripts/windows-vm -p 'test_*.py'
bash -n scripts/windows-vm/run-qemu.sh scripts/windows-vm/start-vm.sh
node --check scripts/windows-vm/shader-probe.mjs
```
