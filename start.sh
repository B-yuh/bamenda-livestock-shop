#!/bin/bash

echo "🐄 Starting Bamenda Livestock Shop Webapp..."
echo "=========================================="

# Install backend dependencies if needed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install
    cd ..
fi

# Start backend server
echo "🚀 Starting backend server on port 5000..."
cd backend && node index.js &
BACKEND_PID=$!
cd ..

# Give backend time to start
sleep 2

# Start frontend server
echo "🌐 Starting frontend server on port 8080..."
python3 -m http.server 8080 &
FRONTEND_PID=$!

echo ""
echo "✅ Webapp is running!"
echo "📱 Frontend: http://localhost:8080"
echo "🔧 Backend API: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all servers..."

# Wait for user to stop
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait