#!/bin/bash
# Restart nginx with fixed configuration

echo "🔧 Restarting Nginx with Fixed Configuration"
echo "============================================="
echo ""

cd ~/unified-portal

echo "1️⃣ Restarting nginx container..."
docker-compose restart unified-portal-nginx

echo ""
echo "2️⃣ Waiting 10 seconds..."
sleep 10

echo ""
echo "3️⃣ Testing ashoka-emblem.webp..."
curl -v http://localhost/ashoka-emblem.webp 2>&1 | head -20

echo ""
echo "4️⃣ Testing API..."
curl http://localhost/api

echo ""
echo "5️⃣ Testing frontend..."
curl http://localhost/ | head -5

echo ""
echo "================================"
echo "✅ Nginx Restarted!"
echo "================================"
echo ""
echo "Now check: http://52.204.134.92"
echo "Logo should show Ashoka Emblem!"
echo ""
