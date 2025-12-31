# Unified Portal - Deployment Guide

## Prerequisites

- AWS EC2 instance (Ubuntu 20.04 or later)
- Security group with ports 22, 80, 443 open
- SSH key pair (gov-portal.pem)

## Quick Deployment (Automated)

### 1. Connect to your EC2 instance

```bash
ssh -i "gov-portal.pem" ubuntu@ec2-54-167-51-207.compute-1.amazonaws.com
```

### 2. Run the deployment script

```bash
cd /tmp
wget https://raw.githubusercontent.com/Vaidehip0407/unified-portal/main/deploy.sh
chmod +x deploy.sh
./deploy.sh
```

Or clone and run locally:

```bash
git clone https://github.com/Vaidehip0407/unified-portal.git
cd unified-portal
chmod +x deploy.sh
./deploy.sh
```

## Manual Deployment Steps

### 1. Update System

```bash
sudo apt-get update
sudo apt-get upgrade -y
```

### 2. Install Docker

```bash
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io
```

### 3. Install Docker Compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 4. Configure Docker Permissions

```bash
sudo usermod -aG docker ubuntu
newgrp docker
```

### 5. Clone Repository

```bash
cd /home/ubuntu
git clone https://github.com/Vaidehip0407/unified-portal.git
cd unified-portal
```

### 6. Create Environment File

```bash
cat > .env << EOF
DATABASE_URL=sqlite:///./unified_portal.db
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
VITE_API_URL=http://your-ec2-ip:8000
EOF
```

### 7. Deploy with Docker Compose

**Development:**
```bash
docker-compose up -d
```

**Production (with Nginx):**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Access Your Application

- **Frontend**: `http://your-ec2-ip:3000`
- **Backend API**: `http://your-ec2-ip:8000`
- **API Documentation**: `http://your-ec2-ip:8000/docs`
- **Nginx (Production)**: `http://your-ec2-ip`

## Useful Docker Commands

### View logs
```bash
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Stop services
```bash
docker-compose down
```

### Restart services
```bash
docker-compose restart
```

### Rebuild images
```bash
docker-compose build --no-cache
docker-compose up -d
```

### Check container status
```bash
docker-compose ps
```

## Production Considerations

### 1. SSL/TLS Certificate (HTTPS)

For Let's Encrypt with Certbot:

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot certonly --standalone -d your-domain.com
```

Then update nginx.conf with SSL configuration.

### 2. Environment Variables

Create a secure `.env` file with production values:

```bash
DATABASE_URL=postgresql://user:password@db:5432/unified_portal
SECRET_KEY=your-very-secure-random-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 3. Database Backup

For SQLite (current setup):
```bash
docker-compose exec backend cp unified_portal.db /app/data/backup_$(date +%Y%m%d_%H%M%S).db
```

For production, consider using PostgreSQL instead of SQLite.

### 4. Monitoring

Monitor container health:
```bash
docker-compose ps
docker stats
```

### 5. Auto-restart on Reboot

Docker containers are set to `restart: always` in production compose file, so they'll restart automatically.

## Troubleshooting

### Port already in use
```bash
sudo lsof -i :8000
sudo lsof -i :3000
sudo kill -9 <PID>
```

### Permission denied errors
```bash
sudo usermod -aG docker ubuntu
newgrp docker
```

### Container won't start
```bash
docker-compose logs backend
docker-compose logs frontend
```

### Clear everything and restart
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## Updating the Application

```bash
cd /home/ubuntu/unified-portal
git pull origin main
docker-compose build --no-cache
docker-compose up -d
```

## Support

For issues, check:
1. Docker logs: `docker-compose logs`
2. Container status: `docker-compose ps`
3. System resources: `docker stats`
