$Repo = "Tencent/BrowserSkill"
$InstallDir = Join-Path $HOME ".local\bin"
$GitHub = "https://github.com/${Repo}"

function Write-Log { param([string]$Message); Write-Host "==> $Message" -ForegroundColor Cyan }
function Write-Die { param([string]$Message); Write-Host "error: $Message" -ForegroundColor Red; exit 1 }

$arch = [System.Runtime.InteropServices.RuntimeInformation]::ProcessArchitecture
Write-Log "Architecture: $arch"

if ($arch -eq "X64") { $archId = "x64"; $triple = "x86_64-pc-windows-msvc" }
elseif ($arch -eq "Arm64") { $archId = "arm64"; $triple = "aarch64-pc-windows-msvc" }
else { Write-Die "unsupported architecture: $arch" }

$platformKey = "windows-$archId"
Write-Log "Platform: $platformKey"

$manifestUrl = "${GitHub}/releases/latest/download/version.json"
Write-Log "Fetching version from $manifestUrl"
$manifest = Invoke-RestMethod -Uri $manifestUrl
$version = $manifest.version
if (-not $version) { Write-Die "could not parse version from version.json" }
$tag = "cli-v${version}"
Write-Log "Version: $version"

$archiveName = "bsk-v${version}-${triple}.zip"
$downloadUrl = "${GitHub}/releases/download/${tag}/${archiveName}"
Write-Log "Downloading $downloadUrl"

$tempDir = Join-Path ([System.IO.Path]::GetTempPath()) ([System.IO.Path]::GetRandomFileName())
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

try {
    $archivePath = Join-Path $tempDir $archiveName
    Invoke-WebRequest -Uri $downloadUrl -OutFile $archivePath -UseBasicParsing -ErrorAction Stop

    Write-Log "Extracting ${archiveName}"
    Expand-Archive -Path $archivePath -DestinationPath $tempDir -Force

    if (-not (Test-Path (Join-Path $tempDir "bsk.exe"))) { Write-Die "bsk.exe not found in archive" }

    if (-not (Test-Path $InstallDir)) { New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null }

    Copy-Item -Path (Join-Path $tempDir "bsk.exe") -Destination (Join-Path $InstallDir "bsk.exe") -Force
    Write-Log "Installed bsk to $InstallDir\bsk.exe"

    $env:PATH = "$InstallDir;$env:PATH"

    $currentUserPath = [Environment]::GetEnvironmentVariable("PATH", "User") -split ";" | Where-Object { $_ }
    if (-not ($currentUserPath -contains $InstallDir)) {
        $newUserPath = ($currentUserPath + $InstallDir) -join ";"
        [Environment]::SetEnvironmentVariable("PATH", $newUserPath, "User")
        Write-Log "Added $InstallDir to user PATH"
    }

    $unixPath = $InstallDir -replace '\\', '/'
    if ($unixPath -match '^([A-Z]):(.*)$') { $unixPath = '/' + $matches[1].ToLower() + $matches[2] }
    $bashRc = Join-Path $HOME ".bashrc"
    $exportLine = "export PATH=`"${unixPath}:$PATH`"  # bsk CLI"
    if (Test-Path $bashRc) {
        $content = Get-Content $bashRc -Raw -ErrorAction SilentlyContinue
        if (-not ($content -match [regex]::Escape($unixPath))) {
            Add-Content $bashRc "`n$exportLine" -Encoding ASCII
            Write-Log "Added $unixPath to ~/.bashrc"
        }
    } else {
        Set-Content $bashRc "$exportLine" -Encoding ASCII
        Write-Log "Created ~/.bashrc with $unixPath"
    }

    $bskPath = Join-Path $InstallDir "bsk.exe"
    if (Get-Command bsk -ErrorAction SilentlyContinue) { & bsk --version }
    else { Write-Log "Verify: & `"$bskPath`" --version" }

    Write-Log "Done. Open new terminal for PATH changes."
}
finally {
    Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue
}