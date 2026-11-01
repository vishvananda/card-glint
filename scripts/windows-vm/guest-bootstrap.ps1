$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$Root = 'C:\Glint'
New-Item -ItemType Directory -Force -Path $Root | Out-Null
$SourceSettings = Join-Path $PSScriptRoot 'settings.json'
$TargetSettings = Join-Path $Root 'settings.json'
if ($SourceSettings -ne $TargetSettings) { Copy-Item $SourceSettings $TargetSettings -Force }
$Config = Get-Content (Join-Path $Root 'settings.json') -Raw | ConvertFrom-Json
$Headers = @{ Authorization = "Bearer $($Config.token)" }
function Send-Status($Stage, $Details) {
    Invoke-RestMethod -UseBasicParsing -Uri "$($Config.base)/event" -Method Post -Headers $Headers -ContentType 'application/json' -Body (@{stage=$Stage; details=$Details} | ConvertTo-Json -Depth 10) | Out-Null
}
Start-Transcript -Path (Join-Path $Root 'bootstrap.log') -Append
try {
    Send-Status 'bootstrap' @{os=[Environment]::OSVersion.VersionString; session=$env:SESSIONNAME}
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -UseBasicParsing -Headers $Headers -Uri "$($Config.base)/payload/node.zip" -OutFile (Join-Path $Root 'node.zip')
    $Hash = (Get-FileHash (Join-Path $Root 'node.zip') -Algorithm SHA256).Hash.ToLowerInvariant()
    if ($Hash -ne $Config.nodeSha256) { throw 'Node download checksum mismatch' }
    Expand-Archive (Join-Path $Root 'node.zip') (Join-Path $Root 'node') -Force
    $NodeFolder = Get-ChildItem (Join-Path $Root 'node') -Directory | Select-Object -First 1
    $Node = Join-Path $NodeFolder.FullName 'node.exe'
    $env:Path = "$($NodeFolder.FullName);$env:Path"
    Send-Status 'bootstrap-node-ready' @{node=(& $Node --version)}
    $env:PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = '1'
    $Runner = Join-Path $Root 'runner'
    New-Item -ItemType Directory -Force -Path $Runner | Out-Null
    Send-Status 'bootstrap-playwright-install' @{}
    $NpmCli = Join-Path $NodeFolder.FullName 'node_modules\npm\bin\npm-cli.js'
    $Npm = Start-Process -FilePath $Node -ArgumentList @($NpmCli,'install','--prefix',$Runner,'--ignore-scripts','--no-audit','--no-fund','playwright@1.60.0') -NoNewWindow -PassThru -Wait -RedirectStandardOutput (Join-Path $Root 'npm-install.log') -RedirectStandardError (Join-Path $Root 'npm-install-errors.log')
    if ($Npm.ExitCode -ne 0) { throw 'Playwright installation failed' }
    Invoke-WebRequest -UseBasicParsing -Headers $Headers -Uri "$($Config.base)/payload/guest-agent.ps1" -OutFile (Join-Path $Root 'guest-agent.ps1')
    $Action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument '-NoProfile -ExecutionPolicy Bypass -File C:\Glint\guest-agent.ps1'
    $Trigger = New-ScheduledTaskTrigger -AtLogOn -User "$env:COMPUTERNAME\$env:USERNAME"
    $Principal = New-ScheduledTaskPrincipal -UserId "$env:COMPUTERNAME\$env:USERNAME" -LogonType Interactive -RunLevel Limited
    $Settings = New-ScheduledTaskSettingsSet -ExecutionTimeLimit (New-TimeSpan -Hours 6) -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
    Register-ScheduledTask -TaskName 'Card Glint Test Agent' -Action $Action -Trigger $Trigger -Principal $Principal -Settings $Settings -Force | Out-Null
    Start-ScheduledTask -TaskName 'Card Glint Test Agent'
    Send-Status 'bootstrap-complete' @{node=(& $Node --version)}
} catch {
    try { Send-Status 'bootstrap-error' @{message=$_.Exception.Message; log=(Get-Content (Join-Path $Root 'npm-install.log') -Tail 20 -ErrorAction SilentlyContinue) -join "`n"} } catch {}
    throw
} finally { Stop-Transcript }
