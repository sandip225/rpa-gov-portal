#!/bin/bash

echo "🚀 Starting Production Deployment to EC2..."

# Set production environment
export NODE_ENV=production
export ENVIRONMENT=production

# EC2 server details
EC2_IP="50.19.189.29"
EC2_USER="ubuntu"
KEY_PATH="terraform/unified-portal-key.pem"

echo "📦 Building production frontend..."
cd frontend
npm run build
cd ..

echo "🐳 Building Docker images..."
docker-compose -f docker-compose.prod.yml build

echo "📤 Deploying to EC2 server..."

# Copy files to EC2
echo "📁 Copying files to EC2..."
scp -i $KEY_PATH -r . $EC2_USER@$EC2_IP:/home/ubuntu/unified-portal/

# Install Chrome and ChromeDriver on EC2
echo "🌐 Installing Chrome and ChromeDriver on EC2..."
ssh -i $KEY_PATH $EC2_USER@$EC2_IP << 'EOF'
# Update system
sudo apt-get update

# Install Chrome
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
sudo apt-get update
sudo apt-get install -y google-chrome-stable

# Install ChromeDriver
CHROME_VERSION=$(google-chrome --version | grep -oP '\d+\.\d+\.\d+')
CHROMEDRIVER_VERSION=$(curl -s "https://chromedriver.storage.googleapis.com/LATEST_RELEASE_${CHROME_VERSION%%.*}")
wget -O /tmp/chromedriver.zip "https://chromedriver.storage.googleapis.com/${CHROMEDRIVER_VERSION}/chromedriver_linux64.zip"
sudo unzip /tmp/chromedriver.zip -d /usr/local/bin/
sudo chmod +x /usr/local/bin/chromedriver

# Install Python dependencies
cd /home/ubuntu/unified-portal/backend
pip3 install -r requirements.txt

# Install additional RPA dependencies
pip3 install selenium webdriver-manager

echo "✅ Chrome and ChromeDriver installed successfully"
EOF

# Start services on EC2
echo "🚀 Starting services on EC2..."
ssh -i $KEY_PATH $EC2_USER@$EC2_IP << 'EOF'
cd /home/ubuntu/unified-portal

# Stop existing services
docker-compose -f docker-compose.prod.yml down

# Start new services
docker-compose -f docker-compose.prod.yml up -d

# Check service status
docker-compose -f docker-compose.prod.yml ps

echo "✅ Services started successfully"
EOF

echo "🎉 Production deployment completed!"
echo "🌐 Frontend: http://$EC2_IP:3000"
echo "🔧 Backend: http://$EC2_IP:8000"
echo "📊 RPA Automation: Ready for Torrent Power"

# Test RPA functionality
echo "🧪 Testing RPA functionality..."
ssh -i $KEY_PATH $EC2_USER@$EC2_IP << 'EOF'
cd /home/ubuntu/unified-portal/backend
python3 -c "
from app.services.torrent_rpa_service import TorrentPowerRPA
rpa = TorrentPowerRPA()
if rpa.setup_driver():
    print('✅ RPA service is working on EC2')
    rpa.close_driver()
else:
    print('❌ RPA service failed on EC2')
"
EOF

echo "✅ Deployment verification completed!"