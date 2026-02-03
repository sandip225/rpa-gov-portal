# Automated RPA Deployment Script for EC2 (PowerShell)
# This script automates the entire deployment process from Windows

param(
    [string]$EC2User = "ec2-user",
    [string]$EC2IP = "",
    [string]$KeyFile = "",
    [string]$GitRepo = "https://github.com/Vaidehip0407/rpa-gov-portal.git"
)

# Colors
$Green = "Green"
$Red = "Red"
$Yellow = "Yellow"
$Blue = "Cyan"

function Print-Header {
    param([string]$Text)
    Write-Host "`n========================================" -ForegroundColor $Blue
    Write-Host "  $Text" -ForegroundColor $Blue
    Write-Host "========================================`n" -ForegroundColor $Blue
}

function Print-Success {
    param([string]$Text)
    Write-Host "✅ $Text" -ForegroundColor $Green
}

function Print-Error {
    param([string]$Text)
    Write-Host "❌ $Text" -ForegroundColor $Red
}

function Print-Warning {
    param([string]$Text)
    Write-Host "⚠️  $Text" -ForegroundColor $Yellow
}

function Print-Info {
    param([string]$Text)
    Write-Host "ℹ️  $Text" -ForegroundColor $Blue
}

# Validate inputs
if ([string]::IsNullOrEmpty($EC2IP) -or [string]::IsNullOrEmpty($KeyFile)) {
    Write-Host "Usage: .\deploy-rpa-to-ec2.ps1 -EC2User <user> -EC2IP <ip> -KeyFile <path>"
    Write-Host "Example: .\deploy-rpa-to-ec2.ps1 -EC2User ec2-user -EC2IP 3.88.187.173 -KeyFile C:\keys\my-key.pem"
    exit 1
}

if (-not (Test-Path $KeyFile)) {
    Print-Error "Key file not found: $KeyFile"
    exit 1
}

Print-Header "RPA Deployment to EC2 (PowerShell)"
Print-Info "EC2 User: $EC2User"
Print-Info "EC2 IP: $EC2IP"
Print-Info "Key File: $KeyFile"
Print-Info "Git Repo: $GitRepo"

# Function to run SSH commands
function Invoke-SSHCommand {
    param(
        [string]$Command,
        [string]$Description = ""
    )
    
    if ($Description) {
        Write-Host "`n$Description..." -ForegroundColor $Blue
    }
    
    $result = ssh -i $KeyFile "${EC2User}@${EC2IP}" $Command 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        return $result
    } else {
        Print-Error "Command failed: $Command"
        Write-Host $result
        return $null
    }
}

# Step 1: Test SSH connection
Print-Header "Step 1: Testing SSH Connection"
$testResult = Invoke-SSHCommand "echo 'SSH connection successful'" "Testing SSH"
if ($testResult) {
    Print-Success "SSH connection successful"
} else {
    Print-Error "Cannot connect to EC2 instance"
    exit 1
}

# Step 2: Install Chrome
Print-Header "Step 2: Installing Chrome"
$chromeResult = Invoke-SSHCommand @"
sudo apt-get update -qq && `
sudo apt-get install -y google-chrome-stable > /dev/null 2>&1 && `
google-chrome --version
"@ "Installing Chrome"

if ($chromeResult) {
    Print-Success "Chrome installed: $chromeResult"
} else {
    Print-Error "Chrome installation failed"
    exit 1
}

# Step 3: Install Python
Print-Header "Step 3: Installing Python Dependencies"
$pythonResult = Invoke-SSHCommand @"
sudo apt-get install -y python3 python3-pip python3-venv > /dev/null 2>&1 && `
python3 --version
"@ "Installing Python"

if ($pythonResult) {
    Print-Success "Python installed: $pythonResult"
} else {
    Print-Error "Python installation failed"
    exit 1
}

# Step 4: Clone repository
Print-Header "Step 4: Setting Up Repository"
$repoResult = Invoke-SSHCommand @"
if [ -d ~/rpa-gov-portal ]; then
    cd ~/rpa-gov-portal && git pull origin main
else
    git clone $GitRepo ~/rpa-gov-portal
fi && echo 'Repository ready'
"@ "Setting up repository"

if ($repoResult) {
    Print-Success "Repository setup complete"
} else {
    Print-Error "Repository setup failed"
    exit 1
}

# Step 5: Create virtual environment
Print-Header "Step 5: Setting Up Python Virtual Environment"
$venvResult = Invoke-SSHCommand @"
cd ~/rpa-gov-portal && `
python3 -m venv venv && `
source venv/bin/activate && `
cd backend && `
pip install -q -r requirements.txt && `
echo 'Virtual environment ready'
"@ "Creating virtual environment"

if ($venvResult) {
    Print-Success "Virtual environment setup complete"
} else {
    Print-Error "Virtual environment setup failed"
    exit 1
}

# Step 6: Create systemd service
Print-Header "Step 6: Creating Systemd Service"
$serviceResult = Invoke-SSHCommand @"
sudo tee /etc/systemd/system/rpa-backend.service > /dev/null << 'SYSTEMD'
[Unit]
Description=RPA Government Portal Backend
After=network.target

[Service]
Type=simple
User=$EC2User
WorkingDirectory=/home/$EC2User/rpa-gov-portal/backend
Environment="PATH=/home/$EC2User/rpa-gov-portal/venv/bin"
ExecStart=/home/$EC2User/rpa-gov-portal/venv/bin/python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
SYSTEMD

sudo systemctl daemon-reload && echo 'Service created'
"@ "Creating systemd service"

if ($serviceResult) {
    Print-Success "Systemd service created"
} else {
    Print-Error "Systemd service creation failed"
    exit 1
}

# Step 7: Start service
Print-Header "Step 7: Starting Backend Service"
$startResult = Invoke-SSHCommand @"
sudo systemctl enable rpa-backend && `
sudo systemctl start rpa-backend && `
sleep 3 && `
sudo systemctl is-active --quiet rpa-backend && echo 'Service started'
"@ "Starting backend service"

if ($startResult) {
    Print-Success "Backend service started"
} else {
    Print-Error "Backend service failed to start"
    exit 1
}

# Step 8: Verify backend
Print-Header "Step 8: Verifying Backend"
$verifyResult = Invoke-SSHCommand @"
sudo netstat -tlnp 2>/dev/null | grep ':8000' && echo 'Port 8000 listening'
"@ "Verifying port 8000"

if ($verifyResult) {
    Print-Success "Backend is listening on port 8000"
} else {
    Print-Warning "Port 8000 not yet listening, service may still be starting"
}

# Step 9: Test RPA
Print-Header "Step 9: Testing RPA Automation"
$rpaResult = Invoke-SSHCommand @"
cd ~/rpa-gov-portal && `
source venv/bin/activate && `
python test-rpa-direct.py 2>&1 | tail -20
"@ "Running RPA test"

if ($rpaResult -and $rpaResult -like "*RPA TEST PASSED*") {
    Print-Success "RPA test passed!"
} else {
    Print-Warning "RPA test result unclear, check logs"
}

# Summary
Print-Header "Deployment Complete!"
Print-Success "RPA Backend deployed to EC2"
Print-Info "Backend URL: http://${EC2IP}:8000"
Print-Info "Health Check: http://${EC2IP}:8000/health"
Print-Info "API Docs: http://${EC2IP}:8000/docs"

Write-Host ""
Print-Info "Next steps:"
Write-Host "  1. Update frontend API URL to: http://${EC2IP}:8000/api"
Write-Host "  2. Configure security group to allow port 8000"
Write-Host "  3. Deploy frontend to EC2"
Write-Host "  4. Set up SSL certificate"
Write-Host ""

Print-Info "Useful commands:"
Write-Host "  View logs: ssh -i $KeyFile ${EC2User}@${EC2IP} 'sudo journalctl -u rpa-backend -f'"
Write-Host "  Restart service: ssh -i $KeyFile ${EC2User}@${EC2IP} 'sudo systemctl restart rpa-backend'"
Write-Host "  Check status: ssh -i $KeyFile ${EC2User}@${EC2IP} 'sudo systemctl status rpa-backend'"
Write-Host ""
