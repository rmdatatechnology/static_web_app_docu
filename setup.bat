@echo off
rem One-time setup on a new PC. Needs Git and Node.js 24 (https://nodejs.org).
rem start.bat and the files in the products folder run the same checks,
rem so after pulling new changes you do not need to run this again.
cd /d "%~dp0"
where git >nul 2>nul || (echo Git is not installed: https://git-scm.com & pause & exit /b 1)
where node >nul 2>nul || (echo Node.js is not installed: https://nodejs.org & pause & exit /b 1)
node scripts\prepare.js
if errorlevel 1 (echo Setup failed, see the messages above. & pause & exit /b 1)
echo.
echo Done. Start your product from the products folder, e.g. products\geomatik.bat
pause
