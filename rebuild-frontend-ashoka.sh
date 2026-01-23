#!/bin/bash
# Rebuild Frontend & Deploy Ashoka Emblem Logo

echo "🔧 Rebuilding Frontend to Deploy Ashoka Emblem Logo"
echo "===================================================="
echo ""

cd ~/unified-portal

echo "1️⃣ Stopping containers..."
docker-compose down

echo ""
echo "2️⃣ Verifying ashoka-emblem.webp exists..."
if [ -f "frontend/public/ashoka-emblem.webp" ]; then
    echo "✅ Found: frontend/public/ashoka-emblem.webp"
    ls -lh frontend/public/ashoka-emblem.webp
else
    echo "❌ NOT found - copying now..."
    cp indian-national-emblem-ashokas-lion-600nw-2535022975.webp frontend/public/ashoka-emblem.webp
    echo "✅ Copied"
fi

echo ""
echo "3️⃣ Rebuilding frontend container..."
docker-compose build --no-cache frontend

echo ""
echo "4️⃣ Starting all containers..."
docker-compose up -d

echo ""
echo "5️⃣ Waiting 30 seconds for services to start..."
sleep 30

echo ""
echo "6️⃣ Verifying deployment..."
docker-compose ps

echo ""
echo "================================"
echo "✅ Deploy Complete!"
echo "================================"
echo ""
echo "📋 Next Steps:"
echo "1. Open http://52.204.134.92 in browser"
echo "2. Press Ctrl+Shift+Delete to clear cache"
echo "3. Refresh page (F5) to see Ashoka Emblem logo"
echo ""
