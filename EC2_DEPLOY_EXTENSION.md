# 🚀 EC2 Deployment - Chrome Extension System

## 📋 **Simple EC2 Commands - Copy Paste करें**

### **1. Connect to EC2:**
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### **2. Install Dependencies:**
```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt install -y python3 python3-pip python3-venv git
sudo npm install -g pm2 serve
sudo apt install -y nginx
```

### **3. Clone Repository:**
```bash
cd /home/ubuntu
git clone https://github.com/your-username/unified-portal.git
cd unified-portal
```

### **4. Backend Setup:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### **5. Environment Configuration:**
```bash
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
cat > .env << EOF
ENVIRONMENT=production
DATABASE_URL=sqlite:///./unified_portal.db
CORS_ORIGINS=["http://$EC2_IP:3000", "http://$EC2_IP"]
EOF
```

### **6. Frontend Setup:**
```bash
cd ../frontend
npm install
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
sed -i "s|http://localhost:8000|http://$EC2_IP/api|g" src/api/axios.js
npm run build
```

### **7. PM2 Configuration:**
```bash
cd /home/ubuntu/unified-portal
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'dgvcl-backend',
      cwd: './backend',
      script: 'venv/bin/uvicorn',
      args: 'app.main:app --host 0.0.0.0 --port 8000',
      instances: 1,
      autorestart: true
    },
    {
      name: 'dgvcl-frontend',
      cwd: './frontend',
      script: 'serve',
      args: '-s dist -l 3000',
      instances: 1,
      autorestart: true
    }
  ]
};
EOF
```

### **8. Nginx Configuration:**
```bash
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
sudo tee /etc/nginx/sites-available/dgvcl << EOF
server {
    listen 80;
    server_name $EC2_IP;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
    
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/dgvcl /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### **9. Start Services:**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### **10. Final Check:**
```bash
pm2 status
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
echo ""
echo "🎉 DGVCL Extension System Deployed!"
echo "📱 Main App: http://$EC2_IP"
echo "🔧 Backend: http://$EC2_IP/api/health"
echo "🧩 Extension: http://$EC2_IP/chrome-extension/"
echo ""
```

## 🎯 **How Users Will Use:**

### **Step 1: Install Chrome Extension**
1. Go to: `http://your-ec2-ip/chrome-extension/`
2. Download extension files
3. Open Chrome → Extensions → Developer Mode ON
4. Click "Load unpacked" → Select extension folder

### **Step 2: Use the System**
1. Open: `http://your-ec2-ip`
2. Navigate: **Services** → **Electricity** → **Name Change**
3. Select **DGVCL**
4. Fill form details
5. Click **Submit & Open DGVCL Portal**
6. Extension automatically fills DGVCL portal!
7. Enter Captcha and OTP manually
8. Form submits automatically!

## ✅ **Success Indicators:**
- ✅ PM2 shows both services as "online"
- ✅ `curl http://your-ec2-ip` returns HTML
- ✅ `curl http://your-ec2-ip/api/health` returns JSON
- ✅ Extension auto-fills DGVCL portal

## 🔧 **Management Commands:**
```bash
# Check services
pm2 status

# View logs
pm2 logs

# Restart services
pm2 restart all

# Check system resources
htop
```

## 🎉 **Perfect! Chrome Extension System Ready on EC2!** 🚀

**Access**: `http://your-ec2-ip`

**Features:**
- ✅ Chrome Extension Auto-Fill
- ✅ 5-Step DGVCL Automation
- ✅ Mobile & Desktop Support
- ✅ Production Ready
- ✅ Public Access via EC2