#!/bin/bash
# Fix Frontend Issue - Restore portal functionality

echo "🔧 Fixing frontend issue - Portal should work exactly as before..."

# Check current container status
echo "📊 Current container status:"
docker-compose ps

# Check frontend logs
echo "🔍 Checking frontend logs:"
docker-compose logs frontend --tail 20

# Check if frontend container is missing
if ! docker-compose ps | grep -q "unified-portal-frontend"; then
    echo "❌ Frontend container missing! Recreating..."
    
    # Stop all containers
    docker-compose down
    
    # Remove any orphaned containers
    docker container prune -f
    
    # Rebuild frontend specifically
    echo "🔨 Rebuilding frontend container..."
    docker-compose build frontend --no-cache
    
    # Start all containers
    echo "▶️ Starting all containers..."
    docker-compose up -d
    
    # Wait for containers to be ready
    echo "⏳ Waiting for containers to start..."
    sleep 30
    
else
    echo "✅ Frontend container exists, checking if it's running..."
    
    # Restart frontend container
    echo "🔄 Restarting frontend container..."
    docker-compose restart frontend
    
    # Wait for restart
    sleep 15
fi

# Check container status again
echo "📊 Updated container status:"
docker-compose ps

# Test frontend directly
echo "🧪 Testing frontend directly..."
if curl -s http://localhost:3003 > /dev/null; then
    echo "✅ Frontend responding on port 3003"
else
    echo "❌ Frontend not responding on port 3003"
    
    # Check if port is in use
    echo "🔍 Checking port usage:"
    netstat -tlnp | grep :3003 || echo "Port 3003 not in use"
    
    # Try to restart with different approach
    echo "🔄 Trying alternative restart..."
    docker-compose stop frontend
    docker-compose rm -f frontend
    docker-compose up -d frontend
    
    sleep 20
    
    if curl -s http://localhost:3003 > /dev/null; then
        echo "✅ Frontend now responding"
    else
        echo "❌ Frontend still not responding - checking logs..."
        docker-compose logs frontend --tail 30
    fi
fi

# Test backend
echo "🧪 Testing backend..."
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ Backend responding"
else
    echo "❌ Backend not responding"
fi

# Test nginx
echo "🧪 Testing nginx..."
if curl -s http://localhost/ > /dev/null; then
    echo "✅ Nginx responding"
else
    echo "❌ Nginx not responding"
fi

# Final status
echo ""
echo "🎯 Final Status:"
docker-compose ps

echo ""
echo "📋 Portal should work exactly as before!"
echo "🌐 Test your portal at: http://98.81.95.183/"
echo ""
echo "If still not working, run:"
echo "  docker-compose logs frontend"
echo "  docker-compose logs backend"
echo "  docker-compose logs nginx"