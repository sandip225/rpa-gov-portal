# Docker Deployment Guide for RPA Backend

## Prerequisites

- Docker installed on EC2
- Docker Compose installed
- Your code pushed to GitHub

## Quick Start

### 1. SSH into EC2
```bash
ssh -i your-key.pem ec2-user@3.88.187.173
```

### 2. Install Docker
```bash
# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker
sudo apt-get install -y docker.io docker-compose

# Add user to docker group (optional, to avoid sudo)
sudo usermod -aG docker $USER
newgrp docker
```

### 3. Clone Repository
```bash
git clone https://github.com/Vaidehip0407/rpa-gov-portal.git
cd rpa-gov-portal
```

### 4. Build and Run with Docker Compose
```bash
# Build the image
docker-compose -f docker-compose.rpa.yml build

# Start the service
docker-compose -f docker-compose.rpa.yml up -d

# View logs
docker-compose -f docker-compose.rpa.yml logs -f rpa-backend
```

### 5. Verify Deployment
```bash
# Check if container is running
docker ps

# Test the API
curl http://localhost:8000/health

# View logs
docker logs rpa-backend
```

## Docker Commands

### View Logs
```bash
# Real-time logs
docker-compose -f docker-compose.rpa.yml logs -f rpa-backend

# Last 100 lines
docker logs --tail 100 rpa-backend
```

### Restart Service
```bash
docker-compose -f docker-compose.rpa.yml restart rpa-backend
```

### Stop Service
```bash
docker-compose -f docker-compose.rpa.yml down
```

### Rebuild Image
```bash
docker-compose -f docker-compose.rpa.yml build --no-cache
```

### Execute Command in Container
```bash
docker exec -it rpa-backend bash
```

### Check Container Stats
```bash
docker stats rpa-backend
```

## Production Deployment

### 1. Create Environment File
```bash
cat > .env.prod << EOF
DATABASE_URL=sqlite:///./test.db
SECRET_KEY=your-very-secure-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30
PYTHONUNBUFFERED=1
EOF
```

### 2. Update docker-compose.rpa.yml
```yaml
environment:
  - DATABASE_URL=${DATABASE_URL}
  - SECRET_KEY=${SECRET_KEY}
  - ACCESS_TOKEN_EXPIRE_MINUTES=${ACCESS_TOKEN_EXPIRE_MINUTES}
```

### 3. Use Production Compose File
```bash
docker-compose -f docker-compose.rpa.yml --env-file .env.prod up -d
```

### 4. Set Up Nginx Reverse Proxy
```bash
# Copy nginx config
cp nginx.prod.conf /etc/nginx/nginx.conf

# Test nginx config
sudo nginx -t

# Start nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 5. Set Up SSL Certificate
```bash
# Install certbot
sudo apt-get install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d your-domain.com

# Update nginx config with SSL paths
# Then reload nginx
sudo nginx -s reload
```

## Troubleshooting

### Container won't start
```bash
# Check logs
docker logs rpa-backend

# Check if port is already in use
sudo lsof -i :8000

# Kill process using port
sudo kill -9 <PID>
```

### Chrome not working in container
```bash
# Check if Chrome is installed in container
docker exec rpa-backend which google-chrome

# Check Chrome version
docker exec rpa-backend google-chrome --version

# Rebuild image
docker-compose -f docker-compose.rpa.yml build --no-cache
```

### Out of memory
```bash
# Check container memory usage
docker stats rpa-backend

# Increase memory limit in docker-compose.yml
# Add under rpa-backend service:
# mem_limit: 2g
```

### Port already in use
```bash
# Change port in docker-compose.yml
# Change "8000:8000" to "8001:8000"

# Or kill process using port
sudo lsof -i :8000
sudo kill -9 <PID>
```

## Monitoring

### View Real-time Stats
```bash
docker stats rpa-backend
```

### Check Container Health
```bash
docker inspect --format='{{.State.Health.Status}}' rpa-backend
```

### View Container Details
```bash
docker inspect rpa-backend
```

## Backup and Restore

### Backup Database
```bash
docker exec rpa-backend cp /app/test.db /app/test.db.backup
docker cp rpa-backend:/app/test.db.backup ./test.db.backup
```

### Restore Database
```bash
docker cp ./test.db.backup rpa-backend:/app/test.db
docker exec rpa-backend chown 1000:1000 /app/test.db
```

## Update Deployment

### Pull Latest Code
```bash
git pull origin main
```

### Rebuild and Restart
```bash
docker-compose -f docker-compose.rpa.yml build --no-cache
docker-compose -f docker-compose.rpa.yml up -d
```

## Performance Optimization

### 1. Use Alpine Base Image
Already using `python:3.11-slim` for smaller image size

### 2. Multi-stage Build
Already implemented to reduce final image size

### 3. Layer Caching
Order Dockerfile commands from least to most frequently changed

### 4. Resource Limits
```yaml
services:
  rpa-backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

## Security Best Practices

1. **Use secrets management**
   ```bash
   docker secret create db_password -
   ```

2. **Run as non-root user**
   Already configured in Dockerfile

3. **Use read-only filesystem where possible**
   ```yaml
   read_only: true
   tmpfs:
     - /tmp
   ```

4. **Scan image for vulnerabilities**
   ```bash
   docker scan rpa-backend
   ```

5. **Keep base image updated**
   ```bash
   docker pull python:3.11-slim
   ```

## Useful Docker Commands

```bash
# List all containers
docker ps -a

# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# View image layers
docker history rpa-backend

# Export image
docker save rpa-backend > rpa-backend.tar

# Import image
docker load < rpa-backend.tar

# Push to registry
docker tag rpa-backend your-registry/rpa-backend:latest
docker push your-registry/rpa-backend:latest
```

## Next Steps

1. ✅ Deploy backend with Docker
2. Deploy frontend with Docker
3. Set up Docker Swarm or Kubernetes for scaling
4. Configure monitoring (Prometheus, Grafana)
5. Set up CI/CD pipeline (GitHub Actions)
