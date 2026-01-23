# Fix Portal on EC2 from Windows
# This script connects to your EC2 instance and fixes the nginx/login issues

param(
    [string]$KeyPath = "gov-portal.pem",
    [string]$IPAddress = "52.204.134.92",
    [string]$User = "ubuntu"
)

Write-Host "🚀 Portal Login Fix - EC2 Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Check if key file exists
if (-not (Test-Path $KeyPath)) {
    Write-Host "❌ Key file not found: $KeyPath" -ForegroundColor Red
    exit 1
}

$keyAbsolute = (Resolve-Path $KeyPath).Path

Write-Host "
✅ Key file found: $keyAbsolute
✅ Target: $User@$IPAddress
" -ForegroundColor Green

# SSH command
$sshCmd = "ssh -i `"$keyAbsolute`" -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null $User@$IPAddress"

Write-Host "`n1️⃣ Checking current container status..." -ForegroundColor Yellow
Invoke-Expression "$sshCmd 'docker ps --format `"table {{.Names}}\t{{.Status}}`"'"

Write-Host "`n2️⃣ Stopping and removing containers..." -ForegroundColor Yellow
Invoke-Expression "$sshCmd 'cd ~/unified-portal && docker-compose down'"

Write-Host "`n3️⃣ Rebuilding and starting containers..." -ForegroundColor Yellow
Invoke-Expression "$sshCmd 'cd ~/unified-portal && docker-compose up -d --build'"

Write-Host "`n⏳ Waiting 60 seconds for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 60

Write-Host "`n4️⃣ Verifying container health..." -ForegroundColor Yellow
Invoke-Expression "$sshCmd 'docker ps --format `"table {{.Names}}\t{{.Status}}`"'"

Write-Host "`n5️⃣ Testing API connection..." -ForegroundColor Yellow
Invoke-Expression "$sshCmd 'curl -s http://localhost/api/health | jq . 2>/dev/null || echo Test failed'"

Write-Host "`n6️⃣ Creating test user..." -ForegroundColor Yellow
Invoke-Expression "$sshCmd 'cd ~/unified-portal && python create_test_user.py'"

Write-Host "`n
✅ Portal Fix Complete!
" -ForegroundColor Green

Write-Host "
📱 Access your portal:
   URL: http://$IPAddress
   
🔑 Login Credentials:
   Email:    test@example.com
   Password: Test@123
   
💡 Tips:
   - If still not loading, wait another 30 seconds
   - Check: http://$IPAddress/health
   - Check: http://$IPAddress/api
" -ForegroundColor Cyan

Write-Host "
Troubleshooting:
- View logs: $sshCmd 'docker logs unified-portal-nginx'
- Restart: $sshCmd 'docker-compose restart'
- Full logs: ssh -i $keyAbsolute $User@$IPAddress 'docker-compose logs'
" -ForegroundColor Gray
