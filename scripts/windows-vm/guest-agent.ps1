$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$Root = 'C:\Glint'
$Config = Get-Content (Join-Path $Root 'settings.json') -Raw | ConvertFrom-Json
$Headers = @{ Authorization = "Bearer $($Config.token)" }
$NodeFolder = Get-ChildItem (Join-Path $Root 'node') -Directory | Select-Object -First 1
$Node = Join-Path $NodeFolder.FullName 'node.exe'
$OS = Get-CimInstance Win32_OperatingSystem
$Video = Get-CimInstance Win32_VideoController | Select-Object Name, DriverVersion, AdapterCompatibility
$Data = @{stage='agent-ready'; os=$OS.Caption; build=$OS.BuildNumber; video=$Video; node=(& $Node --version)}
Invoke-RestMethod -UseBasicParsing -Uri "$($Config.base)/event" -Method Post -Headers $Headers -ContentType 'application/json' -Body ($Data | ConvertTo-Json -Depth 10) | Out-Null
# The separate Node coordinator owns process deadlines and file handles. Keeping
# this out of PowerShell avoids redirected-process/runspace completion deadlocks.
& $Node (Join-Path $Root 'guest-agent.mjs')
exit $LASTEXITCODE
