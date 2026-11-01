$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$Root = 'C:\Glint'
$Config = Get-Content (Join-Path $Root 'settings.json') -Raw | ConvertFrom-Json
$Headers = @{ Authorization = "Bearer $($Config.token)" }
$NodeFolder = Get-ChildItem (Join-Path $Root 'node') -Directory | Select-Object -First 1
$Node = Join-Path $NodeFolder.FullName 'node.exe'
$env:Path = "$($NodeFolder.FullName);$env:Path"
$env:GLINT_CONTROL_BASE = $Config.base
$env:GLINT_CONTROL_TOKEN = $Config.token
$env:PLAYWRIGHT_BROWSERS_PATH = Join-Path $Root 'browsers'
function Send-Status($Data) {
    Invoke-RestMethod -UseBasicParsing -Uri "$($Config.base)/event" -Method Post -Headers $Headers -ContentType 'application/json' -Body ($Data | ConvertTo-Json -Depth 20) | Out-Null
}
$CompletedFile = Join-Path $Root 'completed-jobs.json'
$Completed = @{}
if (Test-Path $CompletedFile) { foreach ($Id in (Get-Content $CompletedFile -Raw | ConvertFrom-Json)) { $Completed[$Id] = $true } }
$OS = Get-CimInstance Win32_OperatingSystem
$Video = Get-CimInstance Win32_VideoController | Select-Object Name, DriverVersion, AdapterCompatibility
Send-Status @{stage='agent-ready'; os=$OS.Caption; build=$OS.BuildNumber; video=$Video; session=$env:SESSIONNAME; node=(& $Node --version)}
$LastHeartbeat = Get-Date
while ($true) {
    try {
        $Job = Invoke-RestMethod -UseBasicParsing -Uri "$($Config.base)/job" -Headers $Headers -TimeoutSec 15
        if ($Job.id -and !$Completed.ContainsKey($Job.id)) {
            if ($Job.id -notmatch '^[A-Za-z0-9_-]{1,100}$' -or $Job.script -notmatch '^[A-Za-z0-9_-]+\.mjs$') { throw 'Invalid job identity' }
            if ($Job.backend -notin @('default','warp','swiftshader') -or $Job.quality -notin @('auto','full','reduced') -or $Job.browser -notin @('msedge','chromium','firefox')) { throw 'Invalid test matrix selection' }
            $Script = Join-Path (Join-Path $Root 'runner') $Job.script
            Invoke-WebRequest -UseBasicParsing -Uri "$($Config.base)/payload/$($Job.script)" -Headers $Headers -OutFile $Script
            $Stdout = Join-Path $Root "$($Job.id)-stdout.log"
            $Stderr = Join-Path $Root "$($Job.id)-stderr.log"
            Send-Status @{stage='running'; jobId=$Job.id; backend=$Job.backend; quality=$Job.quality; browser=$Job.browser}
            $env:GLINT_JOB_ID = $Job.id
            $Started = Get-Date
            $Process = Start-Process -FilePath $Node -WorkingDirectory (Join-Path $Root 'runner') -ArgumentList @($Script,$Job.backend,$Job.quality,$Job.browser) -RedirectStandardOutput $Stdout -RedirectStandardError $Stderr -PassThru
            $Timeout = [Math]::Min(600, [Math]::Max(30, [int]$Job.timeoutSeconds)) * 1000
            $Finished = $Process.WaitForExit($Timeout)
            if (!$Finished) { & taskkill.exe /PID $Process.Id /T /F | Out-Null; $Process.WaitForExit(10000) | Out-Null }
            Send-Status @{stage='complete'; jobId=$Job.id; timedOut=(!$Finished); exitCode=$Process.ExitCode; elapsedMs=[int]((Get-Date)-$Started).TotalMilliseconds; stdout=(Get-Content $Stdout -Raw -ErrorAction SilentlyContinue); stderr=(Get-Content $Stderr -Raw -ErrorAction SilentlyContinue)}
            $Completed[$Job.id] = $true
            @($Completed.Keys | Select-Object -Last 400) | ConvertTo-Json | Set-Content $CompletedFile
        }
        if (((Get-Date)-$LastHeartbeat).TotalSeconds -gt 30) { Send-Status @{stage='heartbeat'; session=$env:SESSIONNAME}; $LastHeartbeat=Get-Date }
    } catch { try { Send-Status @{stage='agent-error'; message=$_.Exception.Message} } catch {} }
    Start-Sleep -Seconds 3
}
