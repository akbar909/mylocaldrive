@echo off
REM Auto-commit and push at 2 AM
cd /d E:\projects\MyDrive

REM Get current date-time for commit message
for /f "tokens=2-4 delimiters=/ " %%a in ('date /t') do (set mydate=%%c-%%a-%%b)
for /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)

REM Check if there are changes to commit
git status --porcelain | findstr . >nul
if errorlevel 1 (
  echo No changes to commit
  exit /b 0
)

REM Add all changes
git add .

REM Commit with timestamp
git commit -m "Nightly auto-commit on %mydate% at %mytime%"

REM Push to main branch
git push origin main

echo Nightly commit and push completed successfully!
