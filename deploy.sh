#!/bin/bash

# Unified Portal Deployment Script for AWS EC2
# This script sets up Docker, Docker Compose, and deploys the application

set -e

echo "=========================================="
echo "Unified Portal Deployment Script"
echo "=========================================="

# Update system packages
echo "Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker
echo "Installing Docker..."
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# Install Docker Compose
echo "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add ubuntu user to docker group
echo "Configuring Docker permissions..."
sudo usermod -aG docker ubuntu

# Install Git
echo "Installing Git..."
sudo apt-get install -y git

# Clone the repository
echo "Cloning repository..."
cd /home/ubuntu
git clone https://github.com/Vaidehip0407/unified-portal.git
cd unified-portal

# Create environment file
echo "Creating environment configuration..."
cat > .env << EOF
# Backend Configuration
DATABASE_URL=sqlite:///./unified_portal.db
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Frontend Configuration
VITE_API_URL=http://localhost:8000
EOF

# Build and start containers
echo "Building Docker images..."
sudo docker-compose build

echo "Starting services..."
sudo docker-compose up -d

# Check service status
echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo "Frontend: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):3000"
echo "Backend API: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):8000"
echo "API Docs: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):8000/docs"
echo ""
echo "To view logs: sudo docker-compose logs -f"
echo "To stop services: sudo docker-compose down"
echo "=========================================="
