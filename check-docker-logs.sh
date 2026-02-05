#!/bin/bash
# Run this script on EC2 server to check Docker logs

echo "=== Checking Docker Containers ==="
docker ps

echo ""
echo "=== Getting Backend Container Logs (last 100 lines) ==="
CONTAINER_ID=$(docker ps | grep backend | awk '{print $1}')

if [ -z "$CONTAINER_ID" ]; then
    echo "❌ Backend container not found!"
    echo "Available containers:"
    docker ps -a
else
    echo "✅ Found backend container: $CONTAINER_ID"
    echo ""
    echo "=== Backend Logs ==="
    docker logs --tail 100 $CONTAINER_ID
    
    echo ""
    echo "=== Checking Chrome/ChromeDriver versions inside container ==="
    docker exec $CONTAINER_ID google-chrome --version
    docker exec $CONTAINER_ID chromedriver --version 2>/dev/null || echo "ChromeDriver not found at /usr/bin/chromedriver"
fi
