@echo off
rem Build the site like the server does and open it (http://localhost:9000).
rem Slower than start.bat; use it to check the final result.
rem   preview.bat            all products
rem   preview.bat geomatik   only one product
cd /d "%~dp0"
set "DOCS_PRODUCT=%~1"
node scripts\prepare.js
if errorlevel 1 goto failed
call npm run build-local
if errorlevel 1 goto failed
call npm run serve-local -- --open
pause
exit /b 0
:failed
echo Failed, see the messages above.
pause
exit /b 1
