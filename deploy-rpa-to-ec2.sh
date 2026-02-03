#!/bin/bash

# Automated RPA Deployment Script for EC2
# This script automates the entire deployment process

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
EC2_USER="${1:-ec2-user}"
EC2_IP="${2:-}"
KEY_FILE="${3:-}"
PROJECT_DIR="/home/${EC2_USER}/rpa-gov-portal"

# Functions
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Validate inputs
if [ -z "$EC2_IP" ] || [ -z "$KEY_FILE" ]; then
    echo "Usage: $0 <ec2-user> <ec2-ip> <key-file>"
    echo "Example: $0 ec2-user 3.88.187.173 ~/.ssh/my-key.pem"
    exit 1
fi

if [ ! -f "$KEY_FILE" ]; then
    print_error "Key file not found: $KEY_FILE"
    exit 1
fi

print_header "RPA Deployment to EC2"
print_info "EC2 User: $EC2_USER"
print_info "EC2 IP: $EC2_IP"
print_info "Key File: $KEY_FILE"
print_info "Project Dir: $PROJECT_DIR"

# Step 1: Test SSH connection
print_header "Step 1: Testing SSH Connection"
if ssh -i "$KEY_FILE" -o ConnectTimeout=5 "${EC2_USER}@${EC2_IP}" "echo 'SSH connection successful'" > /dev/null 2>&1; then
    print_success "SSH connection successful"
else
    print_error "Cannot connect to EC2 instance"
    exit 1
fi

# Step 2: Update system and install Chrome
print_header "Step 2: Installing Chrome"
ssh -i "$KEY_FILE" "${EC2_USER}@${EC2_IP}" << 'EOF'
    echo "Updating system..."
    sudo apt-get update -qq
    
    echo "Installing Chrome..."
    sudo apt-get install -y google-chrome-stable > /dev/null 2>&1
    
    if command -v google-chrome &> /dev/null; then
        echo "✅ Chrome installed: $(google-chrome --version)"
    else
        echo "❌ Chrome installation failed"
        exit 1
    fi
EOF

if [ $? -eq 0 ]; then
    print_success "Chrome installed on EC2"
else
    print_error "Chrome installation failed"
    exit 1
fi

# Step 3: Install Python dependencies
print_header "Step 3: Installing Python Dependencies"
ssh -i "$KEY_FILE" "${EC2_USER}@${EC2_IP}" << 'EOF'
    echo "Installing Python 3 and pip..."
    sudo apt-get install -y python3 python3-pip python3-venv > /dev/null 2>&1
    
    if command -v python3 &> /dev/null; then
        echo "✅ Python 3 installed: $(python3 --version)"
    else
        echo "❌ Python 3 installation failed"
        exit 1
    fi
EOF

if [ $? -eq 0 ]; then
    print_success "Python dependencies installed"
else
    print_error "Python installation failed"
    exit 1
fi

# Step 4: Clone or update repository
print_header "Step 4: Setting Up Repository"
ssh -i "$KEY_FILE" "${EC2_USER}@${EC2_IP}" << EOF
    if [ -d "$PROJECT_DIR" ]; then
        echo "Repository already exists, updating..."
        cd "$PROJECT_DIR"
        git pull origin main
    else
        echo "Cloning repository..."
        git clone https://github.com/Vaidehip0407/rpa-gov-portal.git "$PROJECT_DIR"
    fi
    
    if [ -d "$PROJECT_DIR" ]; then
        echo "✅ Repository ready at $PROJECT_DIR"
    else
        echo "❌ Repository setup failed"
        exit 1
    fi
EOF

if [ $? -eq 0 ]; then
    print_success "Repository setup complete"
else
    print_error "Repository setup failed"
    exit 1
fi

# Step 5: Create virtual environment and install dependencies
print_header "Step 5: Setting Up Python Virtual Environment"
ssh -i "$KEY_FILE" "${EC2_USER}@${EC2_IP}" << EOF
    cd "$PROJECT_DIR"
    
    if [ ! -d "venv" ]; then
        echo "Creating virtual environment..."
        python3 -m venv venv
    fi
    
    echo "Activating virtual environment and installing dependencies..."
    source venv/bin/activate
    
    cd backend
    pip install -q -r requirements.txt
    
    echo "✅ Virtual environment ready"
EOF

if [ $? -eq 0 ]; then
    print_success "Virtual environment setup complete"
else
    print_error "Virtual environment setup failed"
    exit 1
fi

# Step 6: Create systemd service
print_header "Step 6: Creating Systemd Service"
ssh -i "$KEY_FILE" "${EC2_USER}@${EC2_IP}" << EOF
    sudo tee /etc/systemd/system/rpa-backend.service > /dev/null << 'SYSTEMD'
[Unit]
Description=RPA Government Portal Backend
After=network.target

[Service]
Type=simple
User=${EC2_USER}
WorkingDirectory=${PROJECT_DIR}/backend
Environment="PATH=${PROJECT_DIR}/venv/bin"
ExecStart=${PROJECT_DIR}/venv/bin/python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
SYSTEMD

    sudo systemctl daemon-reload
    echo "✅ Systemd service created"
EOF

if [ $? -eq 0 ]; then
    print_success "Systemd service created"
else
    print_error "Systemd service creation failed"
    exit 1
fi

# Step 7: Start the backend service
print_header "Step 7: Starting Backend Service"
ssh -i "$KEY_FILE" "${EC2_USER}@${EC2_IP}" << 'EOF'
    sudo systemctl enable rpa-backend
    sudo systemctl start rpa-backend
    
    # Wait for service to start
    sleep 3
    
    if sudo systemctl is-active --quiet rpa-backend; then
        echo "✅ Backend service started successfully"
    else
        echo "❌ Backend service failed to start"
        sudo systemctl status rpa-backend
        exit 1
    fi
EOF

if [ $? -eq 0 ]; then
    print_success "Backend service started"
else
    print_error "Backend service failed to start"
    exit 1
fi

# Step 8: Verify backend is running
print_header "Step 8: Verifying Backend"
ssh -i "$KEY_FILE" "${EC2_USER}@${EC2_IP}" << 'EOF'
    echo "Checking if port 8000 is listening..."
    if sudo netstat -tlnp 2>/dev/null | grep -q ":8000"; then
        echo "✅ Port 8000 is listening"
    else
        echo "⚠️  Port 8000 not yet listening, waiting..."
        sleep 5
    fi
    
    echo "Testing API endpoint..."
    if curl -s http://localhost:8000/health | grep -q "healthy"; then
        echo "✅ API is responding"
    else
        echo "⚠️  API not responding yet"
    fi
EOF

if [ $? -eq 0 ]; then
    print_success "Backend verification complete"
else
    print_warning "Backend verification had issues, check logs"
fi

# Step 9: Test RPA
print_header "Step 9: Testing RPA Automation"
ssh -i "$KEY_FILE" "${EC2_USER}@${EC2_IP}" << EOF
    cd "$PROJECT_DIR"
    source venv/bin/activate
    
    echo "Running RPA test..."
    python test-rpa-direct.py
EOF

if [ $? -eq 0 ]; then
    print_success "RPA test passed!"
else
    print_warning "RPA test had issues, check logs"
fi

# Final summary
print_header "Deployment Complete!"
print_success "RPA Backend deployed to EC2"
print_info "Backend URL: http://${EC2_IP}:8000"
print_info "Health Check: http://${EC2_IP}:8000/health"
print_info "API Docs: http://${EC2_IP}:8000/docs"

echo ""
print_info "Next steps:"
echo "  1. Update frontend API URL to: http://${EC2_IP}:8000/api"
echo "  2. Configure security group to allow port 8000"
echo "  3. Deploy frontend to EC2"
echo "  4. Set up SSL certificate"
echo ""

print_info "Useful commands:"
echo "  View logs: ssh -i $KEY_FILE ${EC2_USER}@${EC2_IP} 'sudo journalctl -u rpa-backend -f'"
echo "  Restart service: ssh -i $KEY_FILE ${EC2_USER}@${EC2_IP} 'sudo systemctl restart rpa-backend'"
echo "  Check status: ssh -i $KEY_FILE ${EC2_USER}@${EC2_IP} 'sudo systemctl status rpa-backend'"
echo ""
