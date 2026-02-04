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

# Activate virtual environment
echo "🐍 Activating Python virtual environment..."
source venv/bin/activate

# Install/update dependencies
echo "📦 Installing dependencies..."
cd backend
pip install -r requirements.txt

# Run backend directly (not in Docker)
echo "🚀 Starting backend server..."
echo "📍 Backend will be available at: http://13.201.36.63:8000"
echo "📍 API docs at: http://13.201.36.63:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
