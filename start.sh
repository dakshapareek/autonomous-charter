#!/bin/bash

echo "========================================"
echo " Autonomous Program Charter"
echo " Starting React + Node.js Application"
echo "========================================"
echo ""

echo "[1/4] Installing frontend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies"
    exit 1
fi

echo ""
echo "[2/4] Installing backend dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies"
    exit 1
fi
cd ..

echo ""
echo "[3/4] Starting backend server..."
cd server
npm start &
BACKEND_PID=$!
cd ..

sleep 3

echo ""
echo "[4/4] Starting React app..."
echo ""
echo "========================================"
echo " Application Starting!"
echo "========================================"
echo " Frontend: http://localhost:3000"
echo " Backend:  http://localhost:5000"
echo "========================================"
echo ""

npm start

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
