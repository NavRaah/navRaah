@echo off
echo Stopping any existing Metro processes...
taskkill /f /im node.exe /t >nul 2>&1
timeout /t 2 >nul

echo Starting Metro bundler with reset cache...
npx react-native start --reset-cache 