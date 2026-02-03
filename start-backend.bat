@echo off
REM Start the backend server

echo.
echo ========================================
echo Starting Unified Services Portal Backend
echo ========================================
echo.

cd backend

echo Installing dependencies...
pip install -r requirements.txt

echo.
echo Starting uvicorn server on http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.

python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

pause
