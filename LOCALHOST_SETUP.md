# 🚀 LOCALHOST DEVELOPMENT SETUP

## Prerequisites
- ✅ Python 3.11+ installed
- ✅ Node.js 18+ installed  
- ✅ Chrome browser installed
- ✅ Git installed

## Quick Start (Recommended)

### Option 1: Automatic Setup
```cmd
.\run-localhost-direct.bat
```

### Option 2: Manual Setup

#### Step 1: Start Backend
```cmd
cd backend
.\run-backend.bat
```

#### Step 2: Start Frontend (in new terminal)
```cmd
cd frontend  
.\run-frontend.bat
```

## 🌐 URLs After Setup

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Automation Test**: http://localhost:8000/torrent-automation/test-connection

## 🤖 Test Torrent Power Automation

1. **Open**: http://localhost:3000
2. **Register/Login** with any credentials
3. **Navigate**: Services → Electricity → Name Change
4. **Select**: Torrent Power
5. **Fill form** with test data:
   - City: Ahmedabad
   - Service Number: TP123456789
   - T Number: T789
   - Mobile: 9876543210
   - Email: test@example.com
6. **Click**: "Start AI Auto-fill in Website (Production Ready)"
7. **🎉 Watch Chrome browser open and fill form automatically!**

## 🔧 Development Commands

### Backend Commands
```cmd
cd backend

# Install dependencies
pip install -r requirements.txt

# Start development server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Test automation
curl http://localhost:8000/torrent-automation/test-connection
```

### Frontend Commands
```cmd
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🐛 Troubleshooting

### Backend Issues
- **Port 8000 busy**: Change port in uvicorn command
- **Module not found**: Run `pip install -r requirements.txt`
- **Database error**: Delete `unified_portal.db` and restart

### Frontend Issues
- **Port 3000 busy**: Vite will automatically use next available port
- **Dependencies error**: Delete `node_modules` and run `npm install`
- **API connection error**: Check if backend is running on port 8000

### Automation Issues
- **Chrome not found**: Install Google Chrome browser
- **Selenium error**: Run `pip install selenium webdriver-manager`
- **Permission denied**: Run terminal as administrator

## 📝 Development Notes

- **Hot Reload**: Both frontend and backend support hot reload
- **API Changes**: Backend automatically reloads on code changes
- **Database**: SQLite database created automatically
- **Screenshots**: Automation screenshots saved in `backend/screenshots/`
- **Logs**: Check terminal windows for detailed logs

## 🎯 Production Features Available

- ✅ **Complete Portal** - Registration, login, services
- ✅ **AI Automation** - Production-ready Torrent Power automation
- ✅ **Visible Browser** - Chrome opens and fills form automatically
- ✅ **Screenshot Audit** - Complete audit trail
- ✅ **Error Handling** - Graceful fallbacks
- ✅ **Session Management** - Secure user sessions
- ✅ **Multi-language** - Hindi/English support

## 🚀 Ready to Code!

Your localhost development environment is ready with full Torrent Power automation capabilities!