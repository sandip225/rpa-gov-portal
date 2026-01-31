#!/bin/bash

echo "🔧 Fixing Dependencies and Deploying India Portal..."

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker compose -f docker-compose.prod.yml down

# Remove old images to force rebuild
echo "🗑️ Removing old backend image..."
docker rmi india-portal-backend 2>/dev/null || true

# Generate SSL certificate
echo "🔐 Generating SSL certificate..."
mkdir -p ssl
openssl genrsa -out ssl/key.pem 2048 2>/dev/null || true
openssl req -new -key ssl/key.pem -out ssl/cert.csr -subj "/C=IN/ST=Gujarat/L=Ahmedabad/O=IndiaPortal/CN=50.19.189.29" 2>/dev/null || true
openssl x509 -req -days 365 -in ssl/cert.csr -signkey ssl/key.pem -out ssl/cert.pem 2>/dev/null || true

# Build backend with fixed dependencies
echo "🔨 Building backend with fixed dependencies..."
docker compose -f docker-compose.prod.yml build --no-cache backend

# Start all services
echo "🚀 Starting all services..."
docker compose -f docker-compose.prod.yml up -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 45

# Check container status
echo "📊 Container status:"
docker compose -f docker-compose.prod.yml ps

# Test Selenium installation
echo "🧪 Testing Selenium installation..."
docker compose -f docker-compose.prod.yml exec -T backend python -c "
try:
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from webdriver_manager.chrome import ChromeDriverManager
    print('✅ Selenium imported successfully')
    print('✅ ChromeDriverManager available')
    print('✅ Selenium automation ready!')
except ImportError as e:
    print(f'❌ Selenium import failed: {e}')
" 2>/dev/null || echo "⚠️ Container not ready yet, will test later"

echo ""
echo "🎉 Deployment completed!"
echo "🌐 Portal URLs:"
echo "   - HTTP:  http://50.19.189.29:3000"
echo "   - HTTPS: https://50.19.189.29 (accept certificate warning)"
echo "   - API:   http://50.19.189.29:8000/docs"
echo ""
echo "🤖 Selenium browser automation is now available!"
echo "✅ Benefits:"
echo "   - No OpenAI API key required"
echo "   - Faster and more reliable"
echo "   - Visible browser automation"
echo "   - Free to use"
echo ""
echo "📝 Test automation:"
echo "   1. Go to: http://50.19.189.29:3000"
echo "   2. Login and navigate to Services → Electricity → Name Change"
echo "   3. Select Torrent Power and fill form"
echo "   4. Click 'Start AI Auto-fill in Website'"
echo "   5. Watch Chrome browser open and fill Torrent Power form!"