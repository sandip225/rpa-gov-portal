#!/bin/bash
# Complete Fix for Ashoka Emblem Image

cd ~/unified-portal

echo "🔍 Step 1: Verify image file exists locally"
ls -lh frontend/public/ashoka-emblem.webp || echo "ERROR: Image not in public folder!"

echo ""
echo "🔧 Step 2: Remove old containers"
docker-compose down
docker rm -f unified-portal-frontend 2>/dev/null || true

echo ""
echo "🏗️ Step 3: Clean rebuild frontend"
docker-compose build --no-cache frontend

echo ""
echo "⏳ Step 4: Start containers"
docker-compose up -d

echo ""
echo "⏳ Waiting 60 seconds..."
sleep 60

echo ""
echo "📊 Step 5: Verify containers"
docker-compose ps

echo ""
echo "🔍 Step 6: Check if image exists in frontend container"
docker exec unified-portal-frontend ls -lh /usr/share/nginx/html/ashoka-emblem.webp || echo "NOT FOUND in container!"

echo ""
echo "📝 Step 7: Check frontend nginx config"
docker exec unified-portal-frontend cat /etc/nginx/conf.d/default.conf | head -20

echo ""
echo "🧪 Step 8: Test image file"
echo "Checking Content-Type..."
curl -I http://localhost/ashoka-emblem.webp | grep Content-Type

echo ""
echo "🔗 Step 9: Test API"
curl http://localhost/api/health

echo ""
echo "================================"
echo "If Content-Type shows: image/webp ✅"
echo "If Content-Type shows: text/html ❌"
echo "================================"
