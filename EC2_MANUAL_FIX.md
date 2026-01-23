# 🔧 MANUAL FIX FOR PORTAL LOGIN ISSUE
# Copy and paste these commands in your EC2 terminal (ubuntu@ip-172-31-22-134)

# ==========================================
# Step 1: Navigate to project directory
# ==========================================
cd ~/unified-portal || cd /root/unified-portal || pwd


# ==========================================
# Step 2: Stop all containers
# ==========================================
docker-compose down


# ==========================================
# Step 3: Remove old containers completely
# ==========================================
docker rm -f unified-portal-nginx unified-portal-backend unified-portal-frontend 2>/dev/null || true


# ==========================================
# Step 4: Restart with new config
# ==========================================
docker-compose up -d --build


# ==========================================
# Step 5: Wait for services to start
# ==========================================
echo "Waiting 60 seconds for services to start..."
sleep 60


# ==========================================
# Step 6: Check status
# ==========================================
echo ""
echo "Container Status:"
docker-compose ps


# ==========================================
# Step 7: Test API
# ==========================================
echo ""
echo "Testing API..."
curl -v http://localhost/api/health


# ==========================================
# Step 8: Create test user
# ==========================================
echo ""
echo "Creating test user..."
python create_test_user.py


# ==========================================
# Step 9: View logs if there are issues
# ==========================================
# If portal still isn't loading, check logs:
# docker logs unified-portal-nginx
# docker logs unified-portal-backend
# docker logs unified-portal-frontend
