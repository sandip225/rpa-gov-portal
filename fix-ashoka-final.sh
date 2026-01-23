#!/bin/bash
# Final Fix - Rebuild Everything with New Nginx Config

cd ~/unified-portal

echo "🔍 Checking container status..."
docker-compose ps

echo ""
echo "🛑 Stopping all containers..."
docker-compose down

echo ""
echo "🗑️ Cleaning up volumes..."
docker volume prune -f

echo ""
echo "🏗️ Full rebuild with new nginx.conf..."
docker-compose up -d --build

echo ""
echo "⏳ Waiting 60 seconds for services..."
sleep 60

echo ""
echo "📊 Container status:"
docker-compose ps

echo ""
echo "🧪 Testing ashoka-emblem.webp..."
echo "Should return: Content-Type: image/webp"
curl -I http://localhost/ashoka-emblem.webp

echo ""
echo "🔗 Testing API..."
curl http://localhost/api

echo ""
echo "================================"
echo "✅ All Set!"
echo "================================"
echo ""
echo "Open browser: http://52.204.134.92"
echo "Clear cache: Ctrl+Shift+Delete"
echo "Refresh: F5"
echo ""
