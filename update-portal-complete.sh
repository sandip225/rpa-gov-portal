#!/bin/bash
# Complete Portal Update & Fix Script for EC2

echo "🚀 Complete Portal Update & Fix"
echo "================================"
echo ""

cd ~/unified-portal || cd /root/unified-portal || exit 1

echo "Current directory: $(pwd)"
echo ""

# Stop all containers
echo "1️⃣  Stopping containers..."
docker-compose down
sleep 5

# Remove old database to ensure clean state
echo "2️⃣  Cleaning up old database..."
rm -f backend/unified_portal.db

# Pull latest changes (if git repo)
echo "3️⃣  Rebuilding containers..."
docker-compose up -d --build

# Wait for services to fully start
echo "4️⃣  Waiting 60 seconds for services to start..."
sleep 60

# Verify containers are healthy
echo ""
echo "5️⃣  Container Status:"
docker-compose ps

# Check logs
echo ""
echo "6️⃣  Checking logs..."
docker logs unified-portal-backend --tail 5
docker logs unified-portal-frontend --tail 5
docker logs unified-portal-nginx --tail 5

# Test API
echo ""
echo "7️⃣  Testing API..."
curl -s http://localhost/api | head -20

# Create test user
echo ""
echo "8️⃣  Creating test user..."
python create_test_user.py

# Final status
echo ""
echo "================================"
echo "✅ Portal Update Complete!"
echo "================================"
echo ""
echo "Access Portal: http://52.204.134.92"
echo ""
echo "Test Credentials:"
echo "  Email: test@example.com"
echo "  Password: Test@123"
echo ""
echo "To register new user:"
echo "  Go to Register page and fill all fields properly"
echo "  Mobile must be exactly 10 digits"
echo ""
