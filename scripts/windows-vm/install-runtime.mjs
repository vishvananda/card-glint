import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const response = await fetch(
  new URL('/payload/vc_redist.x64.exe', process.env.GLINT_CONTROL_BASE),
  {
    headers: { Authorization: 'Bearer ' + process.env.GLINT_CONTROL_TOKEN },
    signal: AbortSignal.timeout(60000),
  },
);
if (!response.ok) throw Error('Microsoft runtime payload unavailable');
await fs.writeFile(path.join(root, 'vc_redist.x64.exe'), Buffer.from(await response.arrayBuffer()));
const script = path.join(root, 'install-runtime.ps1');
await fs.writeFile(
  script,
  `
$ErrorActionPreference='Stop'
$File=Join-Path $PSScriptRoot 'vc_redist.x64.exe'
$Signature=Get-AuthenticodeSignature $File
if ($Signature.Status -ne 'Valid' -or $Signature.SignerCertificate.Subject -notmatch 'O=Microsoft Corporation') { throw 'Microsoft runtime signature invalid' }
Write-Output (Get-FileHash $File -Algorithm SHA256).Hash
Write-Output (Get-Item $File).VersionInfo.FileVersion
$Installer=Start-Process $File -Verb RunAs -ArgumentList '/install','/quiet','/norestart' -PassThru -Wait
if ($Installer.ExitCode -notin @(0,3010,1638)) { throw ('Runtime installer failed: '+$Installer.ExitCode) }
if (!(Test-Path (Join-Path $env:SystemRoot 'System32/msvcp140_1.dll'))) { throw 'Required C++ runtime still missing' }
Write-Output 'Microsoft C++ runtime installed'
`,
);
const processResult = spawn(
  'powershell.exe',
  ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', script],
  { stdio: 'inherit', windowsHide: true },
);
const code = await new Promise((resolve, reject) => {
  processResult.once('close', resolve);
  processResult.once('error', reject);
});
if (code !== 0) throw Error('Microsoft C++ runtime installation failed');
