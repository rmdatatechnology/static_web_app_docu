@echo off
rem Like start.bat, but always starts from an empty Gatsby cache.
cd /d "%~dp0"
call npm run clean
call "%~dp0start.bat" %*
