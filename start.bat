@echo off
rem Live preview while writing: start once, then every saved change shows
rem up in the browser after a few seconds (http://localhost:8000).
rem   start.bat            all products (slowest start)
rem   start.bat geomatik   only one product, see the products folder
cd /d "%~dp0"
set "DOCS_PRODUCT=%~1"
node scripts\prepare.js
if errorlevel 1 goto failed
call npm run develop -- --open
pause
exit /b 0
:failed
echo Preparation failed, see the messages above.
pause
exit /b 1
