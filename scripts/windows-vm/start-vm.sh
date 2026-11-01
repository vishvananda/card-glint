#!/usr/bin/env bash
set -euo pipefail
(( EUID != 0 )) || { echo 'Run as your normal user; this launcher requests scoped sudo itself.' >&2; exit 1; }
root=$(realpath "${1:?Pass the private VM storage directory}")
mode=${2:-run}
user=$(id -un)
group=$(id -gn)
[[ "$root" != *[[:space:]]* ]] || { echo 'Use a VM directory without whitespace.' >&2; exit 1; }
[[ "$mode" == run || "$mode" == install ]] || { echo 'Mode must be run or install' >&2; exit 2; }
[[ -f "$root/tools/run-qemu.sh" && -f "$root/state/control-token" ]] || { echo 'Prepare the VM storage and tools first.' >&2; exit 1; }
if sudo -n systemctl is-active --quiet card-glint-windows-vm.service; then echo 'The test VM is already running.'; exit 0; fi
if ! systemctl --user is-active --quiet glint-windows-control.service; then
 systemd-run --user --collect --unit=glint-windows-control \
  -p MemoryMax=384M -p MemorySwapMax=0 -p CPUQuota=25% -p RuntimeMaxSec=21600 \
  -p "StandardOutput=append:$root/logs/control-server.log" -p "StandardError=append:$root/logs/control-server.log" \
  /usr/bin/python3 -u "$root/tools/control-server.py" "$root"
fi
sudo -n systemd-run --collect --unit=card-glint-windows-vm \
 -p "User=$user" -p "Group=$group" -p SupplementaryGroups=kvm -p UMask=0077 \
 -p Nice=10 -p CPUQuota=300% -p IOWeight=25 -p MemoryMax=10G -p MemorySwapMax=0 \
 -p TasksMax=512 -p RuntimeMaxSec=21600 -p NoNewPrivileges=yes -p PrivateTmp=yes \
 -p ProtectSystem=strict -p ProtectHome=yes -p "ReadWritePaths=$root" \
 -p KillMode=control-group -p TimeoutStopSec=90 \
 -p "ExecStop=/usr/bin/python3 $root/tools/qmp.py $root system_powerdown" \
 -p "StandardOutput=append:$root/logs/qemu.log" -p "StandardError=append:$root/logs/qemu.log" \
 /bin/bash "$root/tools/run-qemu.sh" "$root" "$mode"
