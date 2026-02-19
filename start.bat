@echo off
echo ========================================
echo  Autonomous Program Charter
echo  Starting React + Node.js Application
echo ========================================
echo.

echo [1/4] Installing frontend dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo [2/4] Installing backend dependencies...
cd server
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo [3/4] Starting backend server...
start "Backend Server" cmd /k "cd server && npm start"

timeout /t 3 /nobreak >nul

echo.
echo [4/4] Starting React app...
echo.
echo ========================================
echo  Application Starting!
echo ========================================
echo  Frontend: http://localhost:3000
echo  Backend:  http://localhost:5000
echo ========================================
echo.

npm start
