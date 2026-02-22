param(
  [string]$ProjectPath = $PSScriptRoot
)

$ErrorActionPreference = 'Stop'

try {
  if (-not (Test-Path $ProjectPath)) {
    throw "Project path not found: $ProjectPath"
  }

  Set-Location $ProjectPath

  Write-Host ""
  Write-Host "=== Interactive MongoDB copy ===" -ForegroundColor Cyan
  Write-Host "Make sure SSH tunnel to VPS is already running." -ForegroundColor Yellow
  Write-Host ""

  $nodeVersion = node -v 2>$null
  if (-not $nodeVersion) {
    throw "Node.js is not found in PATH."
  }

  Write-Host "Node.js: $nodeVersion" -ForegroundColor DarkGray
  Write-Host ""

  node ".\scripts\db-copy-interactive.cjs"
  $exitCode = $LASTEXITCODE

  if ($exitCode -ne 0) {
    throw "Copy script failed with exit code $exitCode"
  }

  Write-Host ""
  Write-Host "Done." -ForegroundColor Green
}
catch {
  Write-Host ""
  Write-Host ("ERROR: " + $_.Exception.Message) -ForegroundColor Red
  exit 1
}

