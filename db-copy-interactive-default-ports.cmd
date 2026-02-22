@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "PS_SCRIPT=%SCRIPT_DIR%db-copy-interactive.ps1"

if not exist "%PS_SCRIPT%" (
  echo [ERROR] Script not found: "%PS_SCRIPT%"
  pause
  exit /b 1
)

REM Default ports:
REM VPS via SSH tunnel: 127.0.0.1:27018
REM Local MongoDB:      127.0.0.1:27017
set "VPS_TUNNEL_MONGODB_URI=mongodb://127.0.0.1:27018/?authSource=admin"
set "LOCAL_MONGODB_URI=mongodb://127.0.0.1:27017/?authSource=admin"

echo.
echo Using default URIs:
echo   VPS tunnel URI : %VPS_TUNNEL_MONGODB_URI%
echo   Local Mongo URI: %LOCAL_MONGODB_URI%
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%PS_SCRIPT%"
set "EXIT_CODE=%ERRORLEVEL%"

if not "%EXIT_CODE%"=="0" (
  echo.
  echo [ERROR] Failed. Exit code: %EXIT_CODE%
  pause
  exit /b %EXIT_CODE%
)

echo.
echo Press any key to exit...
pause >nul
exit /b 0

