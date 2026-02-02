@echo off
echo 🚀 LOCALHOST DEVELOPMENT - Direct Setup (No Docker)
echo ================================================

echo 📋 Prerequisites Check:
echo - Python 3.11+ installed
echo - Node.js 18+ installed
echo - Chrome browser installed
echo.

echo 🔧 Setting up Backend...
cd backend

echo Installing Python dependencies...
pip install -r requirements.txt

echo Starting FastAPI backend...
start "Backend Server" cmd /k "uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

cd ..

echo 🎨 Setting up Frontend...
cd frontend

echo Installing Node dependencies...
call npm install

echo Starting React frontend...
start "Frontend Server" cmd /k "npm run dev"

cd ..

echo.
echo 🎉 LOCALHOST DEVELOPMENT STARTED!
echo ================================
echo 🌐 URLs:
echo    - Frontend: http://localhost:3000
echo    - Backend: http://localhost:8000
echo    - API Docs: http://localhost:8000/docs
echo.
echo 🤖 Torrent Power Automation Ready!
echo 1. Open: http://localhost:3000
echo 2. Register/Login
echo 3. Go to: Services → Electricity → Name Change
echo 4. Select: Torrent Power
echo 5. Fill form and click 'Start AI Auto-fill'
echo 6. 🎉 Watch Chrome browser automation!
echo.
echo ⚠️ Note: Both backend and frontend will open in separate windows
echo 📝 To stop: Close both command windows

pause