# Fix RPA Automation Error on EC2

## Problem
The RPA automation is failing with "Simple RPA test failed" because the backend is using `docker_rpa_service` which has Chrome/Chromium issues in Docker.

## Solution
Switch to `simple_rpa_service` which works better on EC2 when running directly (not in Docker).

## Steps to Fix (Run on EC2)

### 1. Push Updated Code from Windows
```cmd
git add .
git commit -m "Fix RPA service - switch to simple_rpa_service"
git push origin main
```

### 2. SSH to EC2 and Run Fix Script
```bash
ssh -i your-key.pem ubuntu@13.201.36.63

# Make script executable
chmod +x ~/rpa-gov-portal/restart-backend-ec2.sh

# Run the script
cd ~/rpa-gov-portal
./restart-backend-ec2.sh
```

### 3. Test RPA Automation
Open your browser to: http://localhost:3003 (frontend running locally)
- Fill in the Torrent Power form
- Click "Start Automation"
- RPA should now work!

## What Changed

1. **Router Update**: `backend/app/routers/torrent_automation.py`
   - Changed from `DockerTorrentRPA` to `SimpleTorrentRPA`
   
2. **Service Update**: `backend/app/services/simple_rpa_service.py`
   - Added Linux/EC2 support with proper headless mode
   - Added Chrome/Chromium binary detection for Linux
   - Fixed ChromeDriver path issues

3. **Frontend Update**: `frontend/src/api/axios.js`
   - Updated API URL to point to current EC2 IP: `http://13.201.36.63:8000/api`

## Why This Works

- **Docker Issues**: Chrome/Chromium in Docker needs special flags (`--no-sandbox`, `--shm-size=2g`) and often crashes
- **Direct Execution**: Running backend directly on EC2 avoids Docker complexity
- **Simple RPA Service**: Better Chrome driver setup with fallbacks for both Windows and Linux

## Verify It's Working

1. Check backend logs for: `✅ Chrome driver setup successful`
2. Test endpoint: http://13.201.36.63:8000/api/torrent-automation/test-connection
3. Try automation from frontend

## Troubleshooting

If still failing, check:
```bash
# Check if Chrome is installed
which google-chrome
which chromium

# Check backend logs
cd ~/rpa-gov-portal/backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

If Chrome not found:
```bash
# Install Chrome
sudo apt-get update
sudo apt-get install -y google-chrome-stable
```
