#!/bin/bash
# Diagnostic script for nginx issues on EC2

echo "🔍 Checking Nginx Health on EC2..."
echo "=================================="

echo -e "\n1️⃣ Nginx Container Status:"
docker ps -a --filter "name=nginx"

echo -e "\n2️⃣ Nginx Logs (last 30 lines):"
docker logs unified-portal-nginx -n 30

echo -e "\n3️⃣ Testing Backend Health:"
curl -v http://localhost:8000/health

echo -e "\n\n4️⃣ Testing Frontend:"
curl -v http://localhost:3003

echo -e "\n5️⃣ Testing Nginx Health Check:"
curl -v http://localhost:80/health

echo -e "\n6️⃣ Checking Network Connectivity:"
docker exec unified-portal-nginx ping -c 2 backend || echo "Cannot reach backend"
docker exec unified-portal-nginx ping -c 2 frontend || echo "Cannot reach frontend"

echo -e "\n7️⃣ Docker Network:"
docker network inspect unified-portal-network

echo -e "\n8️⃣ Checking if database exists:"
ls -lh /app/unified_portal.db 2>/dev/null || echo "Database not found"

echo -e "\n✅ Diagnostic complete"
