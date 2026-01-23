# Login Troubleshooting Guide

## Quick Login Fix

### Problem: Can't Login to Portal

The most common reason is that **no user account exists yet**. You need to either:

1. **Register a new user first** (if registration page works), OR
2. **Create a test user directly**

---

## Solution 1: Create Test User (Fastest)

### Step 1: Run the test user creation script

```powershell
cd f:\DevOps\Gov\unified-portal
python create_test_user.py
```

Expected output:
```
✅ Test user created successfully!

Login credentials:
==================
Email: test@example.com
Password: Test@123
Mobile: 9999999999
==================
```

### Step 2: Login with these credentials
- **Email**: `test@example.com`
- **Password**: `Test@123`

---

## Solution 2: Ensure Docker Containers are Running

### Check if containers are running:

```powershell
docker ps
```

You should see 3 containers:
- `unified-portal-backend` (port 8000)
- `unified-portal-frontend` (port 3003)
- `unified-portal-nginx` (port 80)

### If containers are NOT running:

```powershell
cd f:\DevOps\Gov\unified-portal

# Start all containers
docker-compose up -d

# Wait 30-40 seconds for services to start
Start-Sleep -Seconds 40

# Check health
docker-compose ps
```

---

## Solution 3: Verify API Connection

### Test the backend API directly:

```powershell
# Test login endpoint
$headers = @{
    "Content-Type" = "application/x-www-form-urlencoded"
}

$body = "username=test@example.com&password=Test@123"

try {
    $response = Invoke-WebRequest -Uri "http://52.204.134.92/api/auth/login" -Method POST -Headers $headers -Body $body
    Write-Host "✅ Login successful!" -ForegroundColor Green
    $response.Content | ConvertFrom-Json | ConvertTo-Json
} catch {
    Write-Host "❌ Login failed:" -ForegroundColor Red
    Write-Host $_.Exception.Response.StatusCode
    $_.Exception.Response | ConvertTo-Json
}
```

### Test health check:

```powershell
try {
    $response = Invoke-WebRequest -Uri "http://52.204.134.92/health" -TimeoutSec 5
    Write-Host "✅ Backend is healthy!" -ForegroundColor Green
    $response.Content
} catch {
    Write-Host "❌ Backend is not responding" -ForegroundColor Red
}
```

---

## Solution 4: Check Browser Console

### Steps:
1. Open the portal: `http://52.204.134.92`
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Try to login and look for error messages

### Common errors and fixes:

**Error: "CORS error" or "Access-Control-Allow-Origin"**
- The IP is not in the allowed origins list
- Solution: We already added `52.204.134.92` to `backend/app/main.py`
- You need to **rebuild and restart containers**:
  ```powershell
  docker-compose down
  docker-compose up -d --build
  ```

**Error: "404 Not Found"**
- The backend API endpoint is not accessible
- Solution: Verify containers are running and check nginx.conf

**Error: "401 Unauthorized" or "Incorrect email or password"**
- User doesn't exist or wrong credentials
- Solution: Use the test user credentials (see Solution 1)

---

## Solution 5: Check Database

### Verify the database exists and has users:

```powershell
# Check if database file exists
Test-Path "f:\DevOps\Gov\unified-portal\backend\unified_portal.db"

# If it doesn't exist, the containers need to start and create it
# If it exists but no users, run create_test_user.py
```

---

## Solution 6: Check Logs

### View backend logs:

```powershell
docker logs unified-portal-backend -f
```

### View nginx logs:

```powershell
docker logs unified-portal-nginx -f
```

### View frontend logs:

```powershell
docker logs unified-portal-frontend -f
```

---

## Complete Reset (Nuclear Option)

If nothing works, try a complete reset:

```powershell
cd f:\DevOps\Gov\unified-portal

# Stop and remove all containers
docker-compose down -v

# Remove database
Remove-Item -Path "backend/unified_portal.db" -Force -ErrorAction SilentlyContinue

# Rebuild everything
docker-compose up -d --build

# Wait for services to start
Start-Sleep -Seconds 60

# Create test user
python create_test_user.py

# Try login
```

Then navigate to: `http://52.204.134.92`

Use credentials:
- Email: `test@example.com`
- Password: `Test@123`

---

## If Still Not Working

Check these specific issues:

1. **Port 52.204.134.92:80 is blocked?**
   - Test connectivity: `Test-Connection 52.204.134.92 -Count 1`
   - Check if port 80 is accessible from your machine

2. **Firewall issues?**
   - Ensure port 80 is open in your firewall
   - Ensure port 8000 is open for backend API

3. **Database corruption?**
   - Delete `backend/unified_portal.db`
   - Restart containers
   - Run `python create_test_user.py`

4. **DNS issues?**
   - Try accessing by IP directly: `http://52.204.134.92`
   - Not by hostname

---

## Testing Registration

If you want to test the registration flow instead:

```powershell
$payload = @{
    email = "newuser@example.com"
    mobile = "9876543210"
    password = "NewPass@123"
    full_name = "New User"
    city = "Ahmedabad"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://52.204.134.92/api/auth/register" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $payload
```

Then login with:
- Email: `newuser@example.com`
- Password: `NewPass@123`
