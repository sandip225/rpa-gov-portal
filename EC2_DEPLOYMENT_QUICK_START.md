# EC2 RPA Deployment - Quick Start

## Option 1: Automated Deployment (Recommended)

### From Linux/Mac:
```bash
chmod +x deploy-rpa-to-ec2.sh
./deploy-rpa-to-ec2.sh ec2-user 3.88.187.173 ~/.ssh/my-key.pem
```

### From Windows (PowerShell):
```powershell
.\deploy-rpa-to-ec2.ps1 -EC2User ec2-user -EC2IP 3.88.187.173 -KeyFile C:\keys\my-key.pem
```

## Option 2: Manual Deployment

### 1. SSH into EC2
```bash
ssh -i your-key.pem ec2-user@3.88.187.173
```

### 2. Install Chrome
```bash
sudo apt-get update
sudo apt-get install -y google-chrome-stable
google-chrome --version  # Verify
```

### 3. Install Python
```bash
sudo apt-get install -y python3 python3-pip python3-venv
```

### 4. Clone Repository
```bash
git clone https://github.com/Vaidehip0407/rpa-gov-portal.git
cd rpa-gov-portal
```

### 5. Setup Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate
cd backend
pip install -r requirements.txt
```

### 6. Test RPA
```bash
cd ..
python test-rpa-direct.py
```

### 7. Create Systemd Service
```bash
sudo tee /etc/systemd/system/rpa-backend.service > /dev/null << 'EOF'
[Unit]
Description=RPA Government Portal Backend
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/rpa-gov-portal/backend
Environment="PATH=/home/ec2-user/rpa-gov-portal/venv/bin"
ExecStart=/home/ec2-user/rpa-gov-portal/venv/bin/python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable rpa-backend
sudo systemctl start rpa-backend
```

### 8. Verify Service
```bash
sudo systemctl status rpa-backend
sudo netstat -tlnp | grep 8000
curl http://localhost:8000/health
```

## Verify Deployment

### Check Backend is Running
```bash
# From your local machine
curl http://3.88.187.173:8000/health
```

### View Logs
```bash
ssh -i your-key.pem ec2-user@3.88.187.173 'sudo journalctl -u rpa-backend -f'
```

### Restart Service
```bash
ssh -i your-key.pem ec2-user@3.88.187.173 'sudo systemctl restart rpa-backend'
```

## Configure Security Group

In AWS Console:
1. EC2 → Security Groups
2. Select your instance's security group
3. Add Inbound Rule:
   - Type: Custom TCP
   - Port: 8000
   - Source: 0.0.0.0/0 (or your IP)

## Update Frontend

Edit `frontend/src/api/axios.js`:

```javascript
const getApiBaseUrl = () => {
  // For production with nginx proxy
  return '/api';
  
  // Or direct to backend
  // return 'http://3.88.187.173:8000/api';
};
```

## Test RPA on EC2

```bash
# SSH into EC2
ssh -i your-key.pem ec2-user@3.88.187.173

# Run test
cd rpa-gov-portal
source venv/bin/activate
python test-rpa-direct.py
```

## Troubleshooting

### Chrome not found
```bash
which google-chrome
google-chrome --version
# If not found, run: sudo apt-get install -y google-chrome-stable
```

### Port 8000 not accessible
```bash
# Check if service is running
sudo systemctl status rpa-backend

# Check if port is listening
sudo netstat -tlnp | grep 8000

# Check security group in AWS Console
```

### Backend not starting
```bash
# View detailed logs
sudo journalctl -u rpa-backend -n 50

# Restart service
sudo systemctl restart rpa-backend

# Check for errors
sudo systemctl status rpa-backend
```

### ChromeDriver issues
```bash
# webdriver-manager will auto-download
# Check cache
ls ~/.wdm/drivers/chromedriver/

# Clear cache if needed
rm -rf ~/.wdm/
```

## Performance Tips

1. **Use headless mode** for production (already configured)
2. **Monitor resource usage**: `top` or `htop`
3. **Set up log rotation** for long-running services
4. **Use nginx** as reverse proxy for better performance
5. **Enable SSL/TLS** for security

## Next Steps

1. ✅ Deploy backend to EC2
2. Deploy frontend to EC2 (Docker or nginx)
3. Set up SSL certificate (Let's Encrypt)
4. Configure domain name
5. Set up monitoring (CloudWatch)
6. Configure auto-scaling if needed

## Support

For issues:
1. Check logs: `sudo journalctl -u rpa-backend -f`
2. Test Chrome: `google-chrome --version`
3. Test API: `curl http://localhost:8000/health`
4. Check network: `sudo netstat -tlnp | grep 8000`
