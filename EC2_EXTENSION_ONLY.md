# 🚀 EC2 Deployment - Extension Only (No RPA)

## 📋 **Simple Commands - Copy Paste करें**

### **1. PM2 & Nginx Install:**
```bash
sudo npm install -g pm2 serve
sudo apt install -y nginx
```

### **2. Clone Repository (अगर नहीं किया है):**
```bash
cd /home/ubuntu
git clone https://github.com/your-username/unified-portal.git
cd unified-portal
```

### **3. Backend Setup:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn python-multipart sqlalchemy python-jose[cryptography] passlib[bcrypt] python-dotenv
```

### **4. Create Simple Backend Environment:**
```bash
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
cat > .env << EOF
ENVIRONMENT=production
DATABASE_URL=sqlite:///./unified_portal.db
CORS_ORIGINS=["http://$EC2_IP:3000", "http://$EC2_IP"]
EOF
```

### **5. Frontend Setup:**
```bash
cd ../frontend
npm install
```

### **6. Update Frontend API Configuration:**
```bash
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
cat > src/api/axios.js << EOF
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://$EC2_IP/api',
  timeout: 30000,
});

export default api;
EOF
```

### **7. Build Frontend:**
```bash
npm run build
```

### **8. Create PM2 Configuration (Extension Only):**
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
      env: {
        ENVIRONMENT: 'production'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'dgvcl-frontend',
      cwd: './frontend',
      script: 'serve',
      args: '-s dist -l 3000',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M'
    }
  ]
};
EOF
```

### **9. Configure Nginx (Extension Only):**
```bash
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
sudo tee /etc/nginx/sites-available/dgvcl-automation << EOF
server {
    listen 80;
    server_name $EC2_IP;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/dgvcl-automation /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### **10. Start Services:**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### **11. Final Check:**
```bash
sleep 5
pm2 status
curl http://localhost:8000/health
curl http://localhost:3000
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
curl http://$EC2_IP
echo ""
echo "🎉 Extension-based system is ready!"
echo "📱 Access: http://$EC2_IP"
echo ""
```

## 🎯 **How to Use:**

### **1. Install Chrome Extension:**
- Download extension from your EC2: `http://your-ec2-ip/chrome-extension/`
- Load unpacked extension in Chrome
- Enable Developer Mode in Chrome Extensions

### **2. Use the System:**
1. Go to: `http://your-ec2-ip`
2. Navigate: **Services** → **Electricity** → **Name Change**
3. Select **DGVCL**
4. Fill form details
5. Choose **Browser Extension** method
6. DGVCL portal will open with auto-fill!

## 🔧 **Management Commands:**

```bash
# Check services
pm2 status

# View logs
pm2 logs

# Restart services
pm2 restart all

# Check system
htop
```

## ✅ **Success Indicators:**

- ✅ PM2 shows both services as "online"
- ✅ `curl http://your-ec2-ip` returns HTML
- ✅ `curl http://your-ec2-ip/api/health` returns JSON
- ✅ Extension auto-fills DGVCL portal

## 🎉 **Ready!**

Your Extension-based DGVCL automation is now live on EC2! 🚀

**Access**: `http://your-ec2-ip`