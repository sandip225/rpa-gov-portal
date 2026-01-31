# 🚀 Complete Deployment Commands for EC2

## EC2 Instance Details:
- **IP**: `50.19.189.29`
- **PEM File**: `government-portal.pem`
- **GitHub Repo**: https://github.com/Vaidehip0407/India-Portal.git

---

## Step 1: Prepare Local Environment

### 1.1 Create Production Files
```bash
# Run the preparation script
chmod +x deploy-ec2-new.sh
./deploy-ec2-new.sh
```

### 1.2 Verify guided-flow-whatsapp is Excluded
```bash
# Check gitignore
cat .gitignore | grep guided-flow-whatsapp

# Should show: guided-flow-whatsapp/
```

---

## Step 2: Push to GitHub (Excluding guided-flow-whatsapp)

### 2.1 Add All Changes
```bash
# Add all files except guided-flow-whatsapp
git add .

# Check what will be committed (should NOT include guided-flow-whatsapp)
git status
```

### 2.2 Commit Changes
```bash
# Commit with message
git commit -m "Add HTTPS deployment with AI automation - EC2 ready"
```

### 2.3 Push to GitHub
```bash
# Push to main branch
git push origin main
```

---

## Step 3: Connect to EC2 Instance

### 3.1 Test SSH Connection
```bash
# Navigate to PEM file directory
cd C:\Users\vaide\Downloads

# Test connection (should work now)
ssh -i "government-portal.pem" ubuntu@50.19.189.29
```

### 3.2 If Connection Still Fails:
```bash
# Check security group allows SSH (port 22)
# Check if instance is running
# Verify PEM file permissions
```

---

## Step 4: Deploy on EC2 Instance

### 4.1 Connect to EC2
```bash
ssh -i "government-portal.pem" ubuntu@50.19.189.29
```

### 4.2 Update System
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install -y docker.io docker-compose-v2
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# Install additional tools
sudo apt install -y git curl nginx
```

### 4.3 Configure Firewall
```bash
# Allow necessary ports
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw --force enable
```

### 4.4 Clone Repository
```bash
# Create project directory
sudo mkdir -p /opt/india-portal
sudo chown $USER:$USER /opt/india-portal
cd /opt/india-portal

# Clone from GitHub
git clone https://github.com/Vaidehip0407/India-Portal.git .
```

### 4.5 Setup Environment
```bash
# Copy production environment files
cp backend/.env.prod backend/.env
cp frontend/.env.production frontend/.env.local

# Create SSL directory and self-signed certificates
sudo mkdir -p /etc/nginx/ssl
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/key.pem \
    -out /etc/nginx/ssl/cert.pem \
    -subj "/C=IN/ST=Gujarat/L=Ahmedabad/O=India Portal/CN=50.19.189.29"
```

### 4.6 Build and Deploy
```bash
# Build and start services
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d

# Wait for services to start
sleep 30

# Check service status
docker compose -f docker-compose.prod.yml ps
```

---

## Step 5: Test Deployment

### 5.1 Test from EC2 Instance
```bash
# Test health endpoint
curl http://localhost/health

# Test AI automation endpoint
curl http://localhost/api/ai-automation/supported-providers

# Check logs
docker logs india-portal-backend
docker logs india-portal-frontend
docker logs india-portal-nginx
```

### 5.2 Test from Your Local Machine
```bash
# Test HTTP access
curl http://50.19.189.29/health

# Test HTTPS access (self-signed certificate)
curl -k https://50.19.189.29/health

# Test AI automation
curl -k https://50.19.189.29/api/ai-automation/supported-providers
```

---

## Step 6: Access Portal

### 6.1 Open in Browser
- **HTTP**: http://50.19.189.29
- **HTTPS**: https://50.19.189.29 (accept self-signed certificate warning)

### 6.2 Test AI Automation
1. Go to: https://50.19.189.29/name-change-application/electricity?provider=torrent-power
2. Fill form with test data
3. Click "Start AI Automation"
4. Watch browser window open and fill Torrent Power form automatically

---

## Step 7: Troubleshooting Commands

### 7.1 Check Service Status
```bash
# SSH to EC2
ssh -i "government-portal.pem" ubuntu@50.19.189.29

# Check Docker services
docker compose -f /opt/india-portal/docker-compose.prod.yml ps

# Check logs
docker logs india-portal-backend -f
docker logs india-portal-nginx -f
```

### 7.2 Restart Services
```bash
# Restart all services
cd /opt/india-portal
docker compose -f docker-compose.prod.yml restart

# Restart specific service
docker compose -f docker-compose.prod.yml restart backend
```

### 7.3 Check Network
```bash
# Check if ports are open
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443

# Check firewall
sudo ufw status
```

---

## Step 8: Monitor and Maintain

### 8.1 View Logs
```bash
# Backend logs (AI automation)
docker logs india-portal-backend | grep "AI automation"

# Nginx access logs
docker logs india-portal-nginx | tail -100

# Real-time monitoring
docker stats
```

### 8.2 Update Deployment
```bash
# Pull latest changes
cd /opt/india-portal
git pull origin main

# Rebuild and restart
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d
```

---

## 🎯 Expected Results

### ✅ Successful Deployment When:
1. **Portal loads**: https://50.19.189.29 shows login page
2. **API works**: https://50.19.189.29/api/ai-automation/supported-providers returns JSON
3. **AI automation**: Form automation works from HTTPS portal
4. **Browser-use**: Opens visible browser and fills Torrent Power form
5. **No CORS errors**: HTTPS to HTTPS communication works

### 🤖 AI Automation Test:
1. Navigate to: https://50.19.189.29/name-change-application/electricity?provider=torrent-power
2. Fill form: Service Number, T Number, Mobile, Email
3. Click "Start AI Automation"
4. Browser window opens automatically
5. Form gets filled on Torrent Power website
6. User completes captcha and submits

---

## 📞 Support Commands

### If SSH Connection Fails:
```bash
# Check instance status in AWS Console
# Verify security group allows port 22 from your IP
# Try different SSH client or check PEM file permissions
```

### If Services Don't Start:
```bash
# Check Docker installation
docker --version
docker compose version

# Check available disk space
df -h

# Check memory usage
free -h
```

### If AI Automation Fails:
```bash
# Check OpenAI API key in logs
docker logs india-portal-backend | grep "OpenAI"

# Test browser-use installation
docker exec -it india-portal-backend python -c "import browser_use; print('OK')"
```

---

**Ready to deploy? Start with Step 1! 🚀**