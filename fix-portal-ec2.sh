#!/bin/bash
# Fix nginx and restart portal on EC2

echo "🔧 Fixing Nginx and Restarting Portal..."
echo "=========================================="

# Change to project directory
cd /home/ubuntu/unified-portal 2>/dev/null || cd /root/unified-portal 2>/dev/null || pwd

echo -e "\n📋 Current directory: $(pwd)"

echo -e "\n1️⃣ Stopping all containers..."
docker-compose down

echo -e "\n2️⃣ Removing unhealthy containers..."
docker rm -f unified-portal-nginx unified-portal-backend unified-portal-frontend 2>/dev/null || true

echo -e "\n3️⃣ Pulling latest images..."
docker-compose pull

echo -e "\n4️⃣ Building containers..."
docker-compose build --no-cache

echo -e "\n5️⃣ Starting containers..."
docker-compose up -d

echo -e "\n⏳ Waiting for services to start (60 seconds)..."
sleep 60

echo -e "\n6️⃣ Checking container status..."
docker-compose ps

echo -e "\n7️⃣ Checking backend health..."
docker exec unified-portal-backend curl -s http://localhost:8000/health || echo "❌ Backend not responding"

echo -e "\n8️⃣ Checking frontend..."
docker exec unified-portal-frontend curl -s http://localhost/api 2>&1 | head -5 || echo "❌ Frontend not responding"

echo -e "\n9️⃣ Checking nginx..."
curl -s http://localhost/api | head -5 || echo "❌ Nginx not responding"

echo -e "\n✅ Portal Fix Complete!"
echo "Access the portal at: http://52.204.134.92"
echo ""
echo "Login credentials:"
echo "Email: test@example.com"
echo "Password: Test@123"
