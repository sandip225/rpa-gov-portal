#!/bin/bash

# Restart Backend on EC2 with Updated RPA Service
# This script stops Docker, pulls latest code, and runs backend directly

echo "🔄 Restarting Backend on EC2..."

# Stop Docker containers if running
echo "🛑 Stopping Docker containers..."
docker stop rpa-backend 2>/dev/null || true
docker rm rpa-backend 2>/dev/null || true

# Pull latest code
echo "📥 Pulling latest code from Git..."
cd ~/rpa-gov-portal
git pull origin main

# Check if virtual environment exists, create if not
if [ ! -d "venv" ]; then
    echo "🐍 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "� Activating Python virtual environment..."
source venv/bin/activate

# Install/update dependencies
echo "� Installing dependencies..."
cd backend
pip install --upgrade pip
pip install -r requirements.txt

# Check if Chrome is installed
echo "� Checking Chrome installation..."
if ! command -v google-chrome &> /dev/null && ! command -v chromium &> /dev/null; then
    echo "⚠️  Chrome/Chromium not found. Installing..."
    cd ~/rpa-gov-portal
    chmod +x install-chrome.sh
    ./install-chrome.sh
    cd backend
fi

# Run backend directly (not in Docker)
echo ""
echo "🚀 Starting backend server..."
echo "📍 Backend will be available at: http://13.201.36.63:8000"
echo "📍 API docs at: http://13.201.36.63:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
