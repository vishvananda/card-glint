#!/usr/bin/env bash
set -euo pipefail
root=$(realpath "${1:?Pass the private VM storage directory}")
exec 9>"$root/state/vm.lock"
flock -n 9 || { echo 'This VM already has a running process.' >&2; exit 1; }
mode=${2:-run}
[[ "$mode" != install || ! -f "$root/state/installed" ]] || { echo 'Windows is already installed; use run mode.' >&2; exit 1; }
[[ "$mode" == run || "$mode" == install ]] || { echo 'Mode must be run or install' >&2; exit 2; }
[[ -r /dev/kvm && -w /dev/kvm ]] || { echo 'This process needs /dev/kvm access (use the documented scoped service group).' >&2; exit 1; }
[[ -f "$root/state/windows.qcow2" && -f "$root/state/OVMF_VARS.fd" ]] || { echo 'VM disk/firmware state is missing.' >&2; exit 1; }
mkdir -p "$root/state/tpm" "$root/state/tmp" "$root/logs"
export TMPDIR="$root/state/tmp"
swtpm socket --tpm2 --tpmstate "dir=$root/state/tpm" --ctrl "type=unixio,path=$root/state/tpm.sock" --flags not-need-init &
tpm_pid=$!
qemu_pid=''
cleanup(){ if [[ -n "$qemu_pid" ]]; then kill -TERM "$qemu_pid" 2>/dev/null || true; fi; kill -TERM "$tpm_pid" 2>/dev/null || true; }
trap cleanup EXIT INT TERM
for ((attempt=0;attempt<100;attempt++)); do [[ -S "$root/state/tpm.sock" ]] && break; sleep .05; done
[[ -S "$root/state/tpm.sock" ]] || { echo 'TPM socket did not become ready.' >&2; exit 1; }
args=(
 -name card-glint-windows -machine q35,accel=kvm,smm=on
 # Keep the guest feature set stable; do not expose host nested-VMX features.
 -cpu Broadwell-v4,hv_relaxed,hv_vapic,hv_spinlocks=0x1fff -smp 4,cores=4,threads=1 -m 8192
 -global driver=cfi.pflash01,property=secure,value=on
 -drive if=pflash,format=raw,unit=0,file=/usr/share/OVMF/OVMF_CODE_4M.secboot.fd,readonly=on
 -drive "if=pflash,format=raw,unit=1,file=$root/state/OVMF_VARS.fd"
 -chardev "socket,id=chrtpm,path=$root/state/tpm.sock" -tpmdev emulator,id=tpm0,chardev=chrtpm -device tpm-crb,tpmdev=tpm0
 -drive "if=none,id=os,format=qcow2,file=$root/state/windows.qcow2,cache=writeback,discard=unmap"
 -device ide-hd,drive=os,bus=ide.0
 -netdev user,id=nat -device e1000,netdev=nat
 -device qemu-xhci -device usb-tablet -vga none -device VGA,vgamem_mb=32
 -display none -vnc "unix:$root/state/vnc.sock"
 -qmp "unix:$root/state/qmp.sock,server=on,wait=off"
 -serial "file:$root/logs/serial.log"
)
if [[ "$mode" == install ]]; then
 args+=( -drive "if=none,id=installer,format=raw,media=cdrom,readonly=on,file=$root/media/installer-noprompt.iso" -device ide-cd,drive=installer,bus=ide.1
 -drive "if=none,id=answer,format=raw,media=cdrom,readonly=on,file=$root/media/answer.iso" -device ide-cd,drive=answer,bus=ide.2
 -boot order=c,once=d,menu=on )
else args+=( -boot order=c,menu=on ); fi
qemu-system-x86_64 "${args[@]}" &
qemu_pid=$!
wait "$qemu_pid"
