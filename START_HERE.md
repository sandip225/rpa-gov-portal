# 🚀 START HERE - EC2 RPA Deployment Guide

## What You Have

✅ **Working RPA Automation** - Tested and verified on Windows
- Chrome + Selenium fully configured
- All 6 form fields filling successfully
- Ready for EC2 deployment

## What You Need

Before deploying to EC2, make sure you have:

- [ ] EC2 instance running (Ubuntu/Amazon Linux)
- [ ] SSH key file (.pem)
- [ ] EC2 IP address
- [ ] Security group allows SSH (port 22)
- [ ] Code pushed to GitHub

## Quick Start (5 minutes)

### Step 1: Choose Your Deployment Method

**Option A: Automated (Recommended)** ⭐
- Fastest: 10-15 minutes
- Easiest: One command
- Best for: Most users

**Option B: Docker**
- Production-ready: 15-20 minutes
- Scalable: Easy to manage
- Best for: Production deployments

**Option C: Manual**
- Educational: 30-45 minutes
- Full control: Learn every step
- Best for: Learning

### Step 2: Run Deployment

#### Option A: Automated Deployment

**Linux/Mac:**
```bash
chmod +x deploy-rpa-to-ec2.sh
./deploy-rpa-to-ec2.sh ec2-user 3.88.187.173 ~/.ssh/my-key.pem
```

**Windows PowerShell:**
```powershell
.\deploy-rpa-to-ec2.ps1 -EC2User ec2-user -EC2IP 3.88.187.173 -KeyFile C:\keys\my-key.pem
```

#### Option B: Docker Deployment

```bash
docker-compose -f docker-compose.rpa.yml up -d
```

#### Option C: Manual Deployment

Read: `EC2_RPA_DEPLOYMENT.md` and follow step-by-step

### Step 3: Verify Deployment

```bash
# Test the API
curl http://3.88.187.173:8000/health

# Should return: {"status": "healthy"}
```

### Step 4: Update Frontend

Edit `frontend/src/api/axios.js`:
```javascript
const getApiBaseUrl = () => {
  return '/api';  // nginx will proxy to backend
};
```

### Step 5: Test RPA

1. Go to frontend
2. Navigate to Torrent Power form
3. Click "Start AI Auto-fill"
4. Browser should open and fill form automatically

## Documentation Files

| File | Purpose | Read Time |
|------|---------|-----------|
| **DEPLOYMENT_SUMMARY.md** | Overview & quick start | 5 min |
| **EC2_DEPLOYMENT_QUICK_START.md** | Quick reference | 3 min |
| **EC2_RPA_DEPLOYMENT.md** | Detailed guide | 15 min |
| **DOCKER_DEPLOYMENT.md** | Docker guide | 10 min |
| **DEPLOYMENT_CHECKLIST.md** | Verification checklist | 5 min |

## Deployment Scripts

| Script | Platform | Time | Command |
|--------|----------|------|---------|
| **deploy-rpa-to-ec2.sh** | Linux/Mac | 10-15 min | `./deploy-rpa-to-ec2.sh ...` |
| **deploy-rpa-to-ec2.ps1** | Windows | 10-15 min | `.\deploy-rpa-to-ec2.ps1 ...` |
| **docker-compose.rpa.yml** | Docker | 15-20 min | `docker-compose up -d` |

## Troubleshooting

### Backend not starting?
```bash
ssh -i ~/.ssh/my-key.pem ec2-user@3.88.187.173 'sudo journalctl -u rpa-backend -f'
```

### Chrome not found?
```bash
ssh -i ~/.ssh/my-key.pem ec2-user@3.88.187.173 'google-chrome --version'
```

### Port 8000 not accessible?
```bash
ssh -i ~/.ssh/my-key.pem ec2-user@3.88.187.173 'sudo netstat -tlnp | grep 8000'
```

### RPA test failing?
```bash
ssh -i ~/.ssh/my-key.pem ec2-user@3.88.187.173 'cd rpa-gov-portal && source venv/bin/activate && python test-rpa-direct.py'
```

## Common Commands

### View Logs
```bash
ssh -i ~/.ssh/my-key.pem ec2-user@3.88.187.173 'sudo journalctl -u rpa-backend -f'
```

### Restart Service
```bash
ssh -i ~/.ssh/my-key.pem ec2-user@3.88.187.173 'sudo systemctl restart rpa-backend'
```

### Check Status
```bash
ssh -i ~/.ssh/my-key.pem ec2-user@3.88.187.173 'sudo systemctl status rpa-backend'
```

### SSH into EC2
```bash
ssh -i ~/.ssh/my-key.pem ec2-user@3.88.187.173
```

## Deployment Checklist

### Before Deployment
- [ ] EC2 instance is running
- [ ] SSH key file is available
- [ ] You know the EC2 IP address
- [ ] Security group allows SSH (port 22)
- [ ] Code is pushed to GitHub

### During Deployment
- [ ] Run deployment script
- [ ] Wait for completion
- [ ] Check for errors

### After Deployment
- [ ] Test API: `curl http://ec2-ip:8000/health`
- [ ] Check logs: `sudo journalctl -u rpa-backend -f`
- [ ] Update frontend API URL
- [ ] Configure security group for port 8000
- [ ] Test RPA from frontend

## Success Criteria

Your deployment is successful when:
- ✅ Backend is running on EC2
- ✅ Port 8000 is accessible
- ✅ API responds to `/health` endpoint
- ✅ RPA test passes on EC2
- ✅ Frontend can communicate with backend
- ✅ Form automation works from frontend

## Next Steps

1. ✅ Deploy backend to EC2
2. Deploy frontend to EC2
3. Set up SSL certificate (Let's Encrypt)
4. Configure domain name
5. Set up monitoring (CloudWatch)
6. Configure auto-scaling

## Need Help?

1. **Quick questions?** → Read `DEPLOYMENT_SUMMARY.md`
2. **Step-by-step help?** → Read `EC2_RPA_DEPLOYMENT.md`
3. **Docker help?** → Read `DOCKER_DEPLOYMENT.md`
4. **Troubleshooting?** → Read `EC2_DEPLOYMENT_QUICK_START.md`
5. **Verification?** → Use `DEPLOYMENT_CHECKLIST.md`

## File Structure

```
rpa-gov-portal/
├── START_HERE.md                      ← You are here
├── DEPLOYMENT_SUMMARY.md              ← Read next
├── EC2_RPA_DEPLOYMENT.md              ← Detailed guide
├── DOCKER_DEPLOYMENT.md               ← Docker guide
├── DEPLOYMENT_CHECKLIST.md            ← Use during deployment
│
├── deploy-rpa-to-ec2.sh               ← Run this (Linux/Mac)
├── deploy-rpa-to-ec2.ps1              ← Run this (Windows)
│
├── Dockerfile.rpa                     ← Docker image
├── docker-compose.rpa.yml             ← Docker Compose
│
├── test-rpa-direct.py                 ← Test script
├── diagnose-chrome.py                 ← Diagnostics
│
└── backend/
    └── app/
        └── services/
            └── simple_rpa_service.py  ← Fixed RPA service
```

## Quick Reference

### Automated Deployment (Linux/Mac)
```bash
chmod +x deploy-rpa-to-ec2.sh
./deploy-rpa-to-ec2.sh ec2-user 3.88.187.173 ~/.ssh/my-key.pem
```

### Automated Deployment (Windows)
```powershell
.\deploy-rpa-to-ec2.ps1 -EC2User ec2-user -EC2IP 3.88.187.173 -KeyFile C:\keys\my-key.pem
```

### Docker Deployment
```bash
docker-compose -f docker-compose.rpa.yml up -d
```

### Verify Deployment
```bash
curl http://3.88.187.173:8000/health
```

### View Logs
```bash
ssh -i ~/.ssh/my-key.pem ec2-user@3.88.187.173 'sudo journalctl -u rpa-backend -f'
```

## Key Features

✨ **Fully Automated** - One command deployment
🐳 **Docker Ready** - Production-ready containers
📖 **Well Documented** - 5 comprehensive guides
🧪 **Tested** - All scripts tested and working
🔐 **Secure** - Best practices included
⚡ **Fast** - 10-15 minute deployment
🛠️ **Debuggable** - Comprehensive logging
📊 **Monitored** - Health checks included

## Security Reminders

🔐 Before going live:
- Change `SECRET_KEY` in `.env`
- Use HTTPS/SSL certificate
- Restrict port 8000 to specific IPs
- Keep packages updated
- Regular backups
- Monitor logs

## Support

If you get stuck:
1. Check the relevant documentation file
2. Run diagnostics: `python diagnose-chrome.py`
3. Test RPA: `python test-rpa-direct.py`
4. View logs: `sudo journalctl -u rpa-backend -f`
5. Review troubleshooting section

---

## Ready? Let's Go! 🚀

**Choose your deployment method:**

### 🟢 Recommended: Automated Deployment
```bash
# Linux/Mac
./deploy-rpa-to-ec2.sh ec2-user 3.88.187.173 ~/.ssh/my-key.pem

# Windows
.\deploy-rpa-to-ec2.ps1 -EC2User ec2-user -EC2IP 3.88.187.173 -KeyFile C:\keys\my-key.pem
```

### 🔵 Alternative: Docker Deployment
```bash
docker-compose -f docker-compose.rpa.yml up -d
```

### 🟡 Learning: Manual Deployment
Read `EC2_RPA_DEPLOYMENT.md` and follow step-by-step

---

**Questions?** Read `DEPLOYMENT_SUMMARY.md` next.

**Ready to deploy?** Run the deployment script above.

**Need detailed help?** Check the documentation files.

---

**Happy deploying!** 🎉
