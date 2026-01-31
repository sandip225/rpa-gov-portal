#!/bin/bash

echo "🚀 Simple Deployment - Working Version"

# Pull latest minimal requirements
git pull origin main

# Stop everything
docker compose -f docker-compose.prod.yml down
docker system prune -f

# Create simple SSL cert
mkdir -p ssl
openssl req -x509 -newkey rsa:2048 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes -subj "/CN=50.19.189.29"

# Build only frontend first (no backend issues)
echo "🔨 Building frontend..."
docker compose -f docker-compose.prod.yml build frontend

# Start frontend and nginx only
echo "🚀 Starting frontend..."
docker compose -f docker-compose.prod.yml up -d frontend nginx

# Check status
docker compose -f docker-compose.prod.yml ps

echo ""
echo "✅ Frontend deployed successfully!"
echo "🌐 Portal URL: http://50.19.189.29:3000"
echo ""
echo "⚠️ Backend will be deployed separately after fixing dependencies"