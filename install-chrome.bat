@echo off
REM Chrome Installation Script for Windows
REM This script helps install Chrome and ChromeDriver for RPA automation

echo.
echo ========================================
echo Chrome Installation for RPA Automation
echo ========================================
echo.

REM Check if Chrome is already installed
echo Checking for Chrome installation...
reg query "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe" >nul 2>&1

if %errorlevel% equ 0 (
    echo ✅ Chrome is already installed!
    for /f "tokens=2*" %%A in ('reg query "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe" /ve') do set CHROME_PATH=%%B
    echo Location: !CHROME_PATH!
) else (
    echo ❌ Chrome is NOT installed
    echo.
    echo Please install Chrome manually:
    echo 1. Visit: https://www.google.com/chrome/
    echo 2. Download and install Chrome
    echo 3. Run this script again
    echo.
    pause
    exit /b 1
)

echo.
echo Checking Python and pip...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python from: https://www.python.org/
    pause
    exit /b 1
)

echo ✅ Python is installed
python --version

echo.
echo Installing webdriver-manager (handles ChromeDriver automatically)...
pip install --upgrade webdriver-manager

if %errorlevel% neq 0 (
    echo ❌ Failed to install webdriver-manager
    pause
    exit /b 1
)

echo.
echo ✅ Installation complete!
echo.
echo Next steps:
echo 1. Restart your backend server
echo 2. Try the RPA automation again
echo.
pause
