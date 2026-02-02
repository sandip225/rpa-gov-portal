@echo off
echo 🎨 Starting React Frontend Server...
echo ==================================

echo 📦 Installing dependencies...
call npm install

echo 🚀 Starting development server on http://localhost:3000
echo 🌐 Portal will open automatically in browser
echo.
echo ⚠️ Keep this window open while developing
echo 📝 Press Ctrl+C to stop the server
echo.

npm run dev