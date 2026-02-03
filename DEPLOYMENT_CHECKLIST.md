# EC2 RPA Deployment Checklist

## Pre-Deployment

### EC2 Instance Setup
- [ ] EC2 instance is running
- [ ] Instance type is at least `t3.medium` (for Chrome)
- [ ] Ubuntu 20.04 or Amazon Linux 2 OS
- [ ] Storage: at least 20GB
- [ ] SSH key file (.pem) is available locally
- [ ] You know the EC2 IP address

### Security Configuration
- [ ] Security group allows SSH (port 22)
- [ ] Security group allows HTTP (port 80) - optional
- [ ] Security group allows HTTPS (port 443) - optional
- [ ] Security group allows port 8000 (backend)
- [ ] Key file has correct permissions (chmod 400)

### Code Preparation
- [ ] Code is pushed to GitHub
- [ ] All changes are committed
- [ ] `test-rpa-direct.py` is in root directory
- [ ] `deploy-rpa-to-ec2.sh` or `.ps1` is in root directory
- [ ] Deployment scripts are executable

### Local Testing
- [ ] RPA works locally on your machine
- [ ] `test-rpa-direct.py` passes locally
- [ ] Chrome is installed locally
- [ ] All dependencies are in `requirements.txt`

## Deployment (Choose One)

### Option A: Automated Deployment (Recommended)

#### Linux/Mac
- [ ] Make script executable: `chmod +x deploy-rpa-to-ec2.sh`
- [ ] Run script: `./deploy-rpa-to-ec2.sh ec2-user 3.88.187.173 ~/.ssh/my-key.pem`
- [ ] Wait for completion (10-15 minutes)
- [ ] Check for errors in output
- [ ] Script shows success message

#### Windows PowerShell
- [ ] Open PowerShell as Administrator
- [ ] Run script: `.\deploy-rpa-to-ec2.ps1 -EC2User ec2-user -EC2IP 3.88.187.173 -KeyFile C:\keys\my-key.pem`
- [ ] Wait for completion (10-15 minutes)
- [ ] Check for errors in output
- [ ] Script shows success message

### Option B: Docker Deployment

- [ ] Docker is installed on EC2
- [ ] Docker Compose is installed
- [ ] `Dockerfile.rpa` exists in root
- [ ] `docker-compose.rpa.yml` exists in root
- [ ] Run: `docker-compose -f docker-compose.rpa.yml up -d`
- [ ] Wait for image build and container start
- [ ] Check: `docker ps` shows running container

### Option C: Manual Deployment

- [ ] SSH into EC2: `ssh -i key.pem ec2-user@ip`
- [ ] Install Chrome: `sudo apt-get install -y google-chrome-stable`
- [ ] Install Python: `sudo apt-get install -y python3 python3-pip python3-venv`
- [ ] Clone repo: `git clone https://github.com/Vaidehip0407/rpa-gov-portal.git`
- [ ] Create venv: `python3 -m venv venv`
- [ ] Activate venv: `source venv/bin/activate`
- [ ] Install deps: `pip install -r backend/requirements.txt`
- [ ] Create systemd service (see guide)
- [ ] Start service: `sudo systemctl start rpa-backend`

## Post-Deployment Verification

### Backend Service
- [ ] Service is running: `sudo systemctl status rpa-backend`
- [ ] Port 8000 is listening: `sudo netstat -tlnp | grep 8000`
- [ ] API responds: `curl http://localhost:8000/health`
- [ ] No errors in logs: `sudo journalctl -u rpa-backend -n 20`

### Chrome & Selenium
- [ ] Chrome is installed: `google-chrome --version`
- [ ] ChromeDriver is available: `ls ~/.wdm/drivers/chromedriver/`
- [ ] RPA test passes: `python test-rpa-direct.py`

### Network & Security
- [ ] Backend is accessible from local: `curl http://3.88.187.173:8000/health`
- [ ] Security group allows port 8000
- [ ] Firewall is not blocking port 8000
- [ ] SSH access still works

## Frontend Configuration

### Update API URL
- [ ] Edit `frontend/src/api/axios.js`
- [ ] Set API base URL to backend IP or domain
- [ ] Rebuild frontend: `npm run build`
- [ ] Deploy frontend to EC2 or CDN

### Test Frontend
- [ ] Frontend loads successfully
- [ ] Can access login page
- [ ] Can navigate to RPA form
- [ ] API calls reach backend (check network tab)

## RPA Testing

### Test from Frontend
- [ ] Navigate to Torrent Power form
- [ ] Fill in test data
- [ ] Click "Start AI Auto-fill"
- [ ] Browser opens and fills form
- [ ] All fields are filled correctly
- [ ] Form submission works

### Test from Command Line
```bash
ssh -i key.pem ec2-user@ip 'cd rpa-gov-portal && source venv/bin/activate && python test-rpa-direct.py'
```
- [ ] Test completes successfully
- [ ] All 6 fields are filled
- [ ] No errors in output

## Monitoring & Logs

### Check Logs
- [ ] View real-time logs: `sudo journalctl -u rpa-backend -f`
- [ ] Check for errors or warnings
- [ ] Verify Chrome is starting correctly
- [ ] Verify Selenium is working

### Monitor Resources
- [ ] Check CPU usage: `top`
- [ ] Check memory usage: `free -h`
- [ ] Check disk space: `df -h`
- [ ] Check network: `netstat -an | grep 8000`

## Troubleshooting

### If Backend Won't Start
- [ ] Check logs: `sudo journalctl -u rpa-backend -n 50`
- [ ] Verify Chrome is installed: `google-chrome --version`
- [ ] Check port 8000 is free: `sudo lsof -i :8000`
- [ ] Restart service: `sudo systemctl restart rpa-backend`

### If Chrome Not Found
- [ ] Install Chrome: `sudo apt-get install -y google-chrome-stable`
- [ ] Verify installation: `google-chrome --version`
- [ ] Restart backend: `sudo systemctl restart rpa-backend`

### If Port 8000 Not Accessible
- [ ] Check security group in AWS Console
- [ ] Verify service is running: `sudo systemctl status rpa-backend`
- [ ] Check firewall: `sudo ufw status`
- [ ] Test locally: `curl http://localhost:8000/health`

### If RPA Test Fails
- [ ] Check Chrome is installed: `google-chrome --version`
- [ ] Check Selenium: `pip list | grep selenium`
- [ ] Check webdriver-manager: `pip list | grep webdriver`
- [ ] Run test with verbose output: `python test-rpa-direct.py`

## Performance Optimization

### After Deployment
- [ ] Monitor memory usage during RPA execution
- [ ] Check CPU usage during form filling
- [ ] Verify response times are acceptable
- [ ] Check for memory leaks over time

### If Performance Issues
- [ ] Increase instance size (t3.large, t3.xlarge)
- [ ] Enable swap space
- [ ] Use headless mode (already configured)
- [ ] Optimize Chrome options

## Security Hardening

### Before Going Live
- [ ] Change SECRET_KEY in `.env`
- [ ] Set strong database password
- [ ] Enable HTTPS/SSL certificate
- [ ] Restrict port 8000 to specific IPs
- [ ] Enable firewall rules
- [ ] Set up regular backups
- [ ] Enable CloudWatch monitoring

### Ongoing
- [ ] Monitor logs for suspicious activity
- [ ] Keep system packages updated
- [ ] Keep Python packages updated
- [ ] Review security group rules monthly
- [ ] Backup database regularly

## Documentation

### Create Documentation
- [ ] Document your EC2 setup
- [ ] Document deployment steps used
- [ ] Document any customizations
- [ ] Document troubleshooting steps
- [ ] Create runbook for operations

### Backup Important Files
- [ ] Backup SSH key file
- [ ] Backup environment variables
- [ ] Backup database
- [ ] Backup deployment scripts

## Final Verification

### Complete Workflow Test
- [ ] User can login to frontend
- [ ] User can navigate to RPA form
- [ ] User can fill in form data
- [ ] User can click "Start AI Auto-fill"
- [ ] Browser opens and fills form
- [ ] Form is submitted successfully
- [ ] User receives confirmation

### Load Testing (Optional)
- [ ] Test with multiple concurrent users
- [ ] Monitor resource usage
- [ ] Check response times
- [ ] Verify no errors occur

## Sign-Off

- [ ] All checklist items completed
- [ ] No critical errors in logs
- [ ] RPA automation working end-to-end
- [ ] Performance is acceptable
- [ ] Security measures in place
- [ ] Documentation is complete
- [ ] Ready for production use

---

## Quick Reference

### Deployment Command (Linux/Mac)
```bash
chmod +x deploy-rpa-to-ec2.sh
./deploy-rpa-to-ec2.sh ec2-user 3.88.187.173 ~/.ssh/my-key.pem
```

### Deployment Command (Windows)
```powershell
.\deploy-rpa-to-ec2.ps1 -EC2User ec2-user -EC2IP 3.88.187.173 -KeyFile C:\keys\my-key.pem
```

### Verify Deployment
```bash
curl http://3.88.187.173:8000/health
```

### View Logs
```bash
ssh -i ~/.ssh/my-key.pem ec2-user@3.88.187.173 'sudo journalctl -u rpa-backend -f'
```

### Restart Service
```bash
ssh -i ~/.ssh/my-key.pem ec2-user@3.88.187.173 'sudo systemctl restart rpa-backend'
```

---

**Date Started**: _______________
**Date Completed**: _______________
**Deployed By**: _______________
**Notes**: _______________________________________________
