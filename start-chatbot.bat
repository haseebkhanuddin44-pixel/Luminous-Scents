@echo off
echo Starting Lumiere Candles Chatbot Server...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if package.json exists
if not exist package.json (
    echo Error: package.json not found
    echo Please run this script from the project directory
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist node_modules (
    echo Installing dependencies...
    npm install
    if errorlevel 1 (
        echo Error: Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Check if .env file exists
if not exist .env (
    echo Warning: .env file not found
    echo Please copy .env.example to .env and configure your API keys
    echo.
    echo The chatbot will work with fallback responses without API keys
    echo.
)

REM Start the server
echo Starting server...
echo.
echo Open your browser and go to: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

npm start

pause
