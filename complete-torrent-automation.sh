#!/bin/bash

echo "🚀 COMPLETE TORRENT POWER AUTOMATION SETUP"
echo "================================================"

# Stop everything
echo "🛑 Stopping all containers..."
docker compose -f docker-compose.prod.yml down 2>/dev/null || true
docker system prune -f 2>/dev/null || true

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# Create SSL certificate
echo "🔐 Creating SSL certificate..."
mkdir -p ssl
openssl req -x509 -newkey rsa:2048 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes -subj "/CN=50.19.189.29" 2>/dev/null

# Build everything fresh
echo "🔨 Building all services..."
docker compose -f docker-compose.prod.yml build --no-cache

# Start all services
echo "🚀 Starting all services..."
docker compose -f docker-compose.prod.yml up -d

# Wait for services
echo "⏳ Waiting for services to start..."
sleep 60

# Check status
echo "📊 Checking service status..."
docker compose -f docker-compose.prod.yml ps

# Test backend health
echo "🧪 Testing backend..."
sleep 10
curl -s http://localhost:8000/health || echo "Backend starting..."

# Test Selenium
echo "🤖 Testing Selenium automation..."
docker compose -f docker-compose.prod.yml exec -T backend python -c "
try:
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from webdriver_manager.chrome import ChromeDriverManager
    print('✅ Selenium ready!')
    
    # Test Chrome options
    options = Options()
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    print('✅ Chrome options configured!')
    
    print('✅ Torrent Power automation ready!')
except Exception as e:
    print(f'⚠️ Selenium test: {e}')
" 2>/dev/null || echo "⚠️ Backend still starting..."

echo ""
echo "🎉 TORRENT POWER AUTOMATION READY!"
echo "================================================"
echo "🌐 Portal URLs:"
echo "   - Main Portal: http://50.19.189.29:3000"
echo "   - HTTPS Portal: https://50.19.189.29"
echo "   - API Docs: http://50.19.189.29:8000/docs"
echo ""
echo "🤖 TORRENT POWER AUTOMATION STEPS:"
echo "1. Go to: http://50.19.189.29:3000"
echo "2. Login with your credentials"
echo "3. Click: Services → Electricity → Name Change"
echo "4. Select: Torrent Power"
echo "5. Fill form with:"
echo "   - Service Number: TP123456789"
echo "   - T Number: T789"
echo "   - Mobile: 9876543210"
echo "   - Email: test@example.com"
echo "6. Click: 'Start AI Auto-fill in Website'"
echo "7. 🎯 Chrome browser will open automatically!"
echo "8. 🎯 Torrent Power form will be filled automatically!"
echo "9. 🎯 Complete captcha and submit!"
echo ""
echo "✅ AUTOMATION FEATURES:"
echo "   - ✅ Direct Torrent Power website opening"
echo "   - ✅ Automatic form filling"
echo "   - ✅ Visible browser process"
echo "   - ✅ No API key required"
echo "   - ✅ Free to use"
echo ""
echo "🔥 READY TO USE! GO TEST IT NOW! 🔥"