# EC2 RPA Deployment Guide

This guide will help you deploy the working RPA automation to your EC2 instance.

## Prerequisites

- EC2 instance running Ubuntu/Amazon Linux
- SSH access to your EC2 instance
- Your code pushed to GitHub

## Step 1: SSH into Your EC2 Instance

```bash
ssh -i your-key.pem ec2-user@your-ec2-ip
# or for Ubuntu
ssh -i your-key.pem ubuntu@your-ec2-ip
```

## Step 2: Install Chrome on EC2

```bash
# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Chrome
sudo apt-get install -y google-chrome-stable

# Verify Chrome installation
google-chrome --version
```

## Step 3: Install Python Dependencies

```bash
# Install Python and pip
sudo apt-get install -y python3 python3-pip python3-venv

# Clone your repository (if not already done)
git clone https://github.com/Vaidehip0407/rpa-gov-portal.git
cd rpa-gov-portal

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install backend dependencies
cd backend
pip install -r requirements.txt
```

## Step 4: Configure Environment Variables

```bash
# Copy and edit the environment file
cp .env.example .env
nano .env

# Make sure these are set:
# DATABASE_URL=sqlite:///./test.db
# SECRET_KEY=your-secret-key
# ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Step 5: Start the Backend Service

### Option A: Using systemd (Recommended for Production)

Create a systemd service file:

```bash
sudo nano /etc/systemd/system/rpa-backend.service
```

Add this content:

```ini
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
```

Then enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable rpa-backend
sudo systemctl start rpa-backend
sudo systemctl status rpa-backend
```

### Option B: Using Screen (Quick Testing)

```bash
# Install screen
sudo apt-get install -y screen

# Start backend in screen session
screen -S backend -d -m bash -c 'cd /home/ec2-user/rpa-gov-portal/backend && source ../venv/bin/activate && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000'

# View logs
screen -S backend -X hardcopy -h /tmp/backend.log
cat /tmp/backend.log
```

## Step 6: Verify Backend is Running

```bash
# Check if port 8000 is listening
sudo netstat -tlnp | grep 8000

# Or test the API
curl http://localhost:8000/health
```

## Step 7: Configure Security Group

In AWS Console:
1. Go to EC2 → Security Groups
2. Find your instance's security group
3. Add inbound rule:
   - Type: Custom TCP
   - Port: 8000
   - Source: 0.0.0.0/0 (or your IP for security)

## Step 8: Update Frontend API URL

Update `frontend/src/api/axios.js` to point to your EC2 instance:

```javascript
const getApiBaseUrl = () => {
  // Use relative URL - nginx will proxy /api to backend
  return '/api';
};
```

Or if not using nginx proxy:

```javascript
const getApiBaseUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8000/api';
  }
  
  // Production EC2 URL
  return 'http://your-ec2-ip:8000/api';
};
```

## Step 9: Test RPA on EC2

```bash
# SSH into EC2
ssh -i your-key.pem ec2-user@your-ec2-ip

# Navigate to project
cd rpa-gov-portal

# Activate venv
source venv/bin/activate

# Run the test
python test-rpa-direct.py
```

## Troubleshooting

### Chrome not found
```bash
# Check Chrome installation
which google-chrome
google-chrome --version

# If not installed, run Step 2 again
```

### ChromeDriver issues
```bash
# webdriver-manager will auto-download ChromeDriver
# Check cache location
ls ~/.wdm/drivers/chromedriver/

# Clear cache if needed
rm -rf ~/.wdm/
```

### Port 8000 already in use
```bash
# Find process using port 8000
sudo lsof -i :8000

# Kill the process
sudo kill -9 <PID>
```

### Backend not starting
```bash
# Check logs
sudo journalctl -u rpa-backend -f

# Or if using screen
screen -S backend -X hardcopy -h /tmp/backend.log
cat /tmp/backend.log
```

## Deployment Checklist

- [ ] SSH access to EC2 instance
- [ ] Chrome installed on EC2
- [ ] Python 3 and pip installed
- [ ] Repository cloned
- [ ] Virtual environment created
- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Backend service started
- [ ] Port 8000 accessible
- [ ] Security group configured
- [ ] Frontend API URL updated
- [ ] RPA test passed on EC2

## Next Steps

1. Deploy frontend to EC2 (using Docker or nginx)
2. Set up SSL certificate (Let's Encrypt)
3. Configure domain name
4. Set up monitoring and logging
5. Configure auto-scaling if needed

## Support

If you encounter issues:
1. Check backend logs: `sudo journalctl -u rpa-backend -f`
2. Test Chrome: `google-chrome --version`
3. Test API: `curl http://localhost:8000/health`
4. Check network: `sudo netstat -tlnp | grep 8000`
