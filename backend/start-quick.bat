@echo off
echo 🚀 Starting FastAPI Backend Server...
echo ====================================
echo.
echo 🚀 Starting server on http://localhost:8000
echo 📚 API Docs: http://localhost:8000/docs
echo.
echo ⚠️ Keep this window open while developing
echo 📝 Press Ctrl+C to stop the server
echo.

python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
