# HTTPS Deployment Guide for India Portal & Guided Flow

## 🎯 Why HTTPS for AI Automation?

### Benefits:
1. **Security**: HTTPS to HTTPS communication is secure
2. **CORS**: No cross-origin issues between HTTPS sites
3. **SSL Handshake**: Browser-use automation works better with SSL
4. **Production Ready**: Real-world deployment standard
5. **API Access**: OpenAI API works seamlessly with HTTPS
6. **Torrent Power**: HTTPS portal can access HTTPS Torrent website without issues

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    HTTPS Deployment                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  EC2 Instance 1 (107.21.134.74)                           │
│  ├── India Portal (https://indiaportals.com)              │
│  ├── AI Automation Backend                                 │
│  ├── Browser-use Integration                               │
│  └── SSL Certificate (Let's Encrypt)                       │
│                                                             │
│  EC2 Instance 2 (54.81.22.180)                            │
│  ├── Guided Flow WhatsApp (https://guidedflow.com)        │
│  ├── WhatsApp Business API                                 │
│  └── SSL Certificate (Let's Encrypt)                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📋 Prerequisites

1. **Domain Names** (Optional - can use IP addresses):
   - `indiaportals.com` → 107.21.134.74
   - `guidedflow.com` → 54.81.22.180

2. **EC2 Instances**:
   - Instance 1: 107.21.134.74 (India Portal)
   - Instance 2: 54.81.22.180 (Guided Flow)

3. **API Keys**:
   - OpenAI API Key (for AI automation)
   - WhatsApp Business API credentials

## 🔧 Step 1: Deploy India Portal with HTTPS

### Local Preparation:
```bash
# Set your OpenAI API key
export OPENAI_API_KEY="your-openai-api-key-here"

# Make deployment script executable
chmod +x deploy-https-ec2.sh

# Run deployment
./deploy-https-ec2.sh
```

### What this does:
1. ✅ Updates backend with production environment
2. ✅ Configures HTTPS frontend
3. ✅ Sets up SSL certificates with Let's Encrypt
4. ✅ Deploys with Docker Compose
5. ✅ Configures Nginx with SSL termination
6. ✅ Sets up AI automation with HTTPS

## 🔧 Step 2: Deploy Guided Flow with HTTPS

```bash
# Make deployment script executable
chmod +x guided-flow-https-deploy.sh

# Run deployment
./guided-flow-https-deploy.sh
```

### What this does:
1. ✅ Deploys Guided Flow WhatsApp service
2. ✅ Sets up SSL certificates
3. ✅ Configures HTTPS frontend
4. ✅ Sets up WhatsApp Business API integration

## 🤖 AI Automation with HTTPS

### How HTTPS Improves Automation:

1. **Secure Communication**:
   ```
   HTTPS Portal → OpenAI API (HTTPS) ✅
   HTTPS Portal → Torrent Power (HTTPS) ✅
   ```

2. **No CORS Issues**:
   ```
   https://indiaportals.com → https://connect.torrentpower.com ✅
   ```

3. **Browser-use Integration**:
   ```javascript
   // HTTPS environment enables better browser automation
   const browser = new Browser({
     headless: false,
     viewport: { width: 1280, height: 720 }
   });
   
   // AI agent can now securely access HTTPS websites
   const agent = new Agent({
     task: "Fill Torrent Power form",
     llm: openaiLLM,
     browser: browser
   });
   ```

## 🧪 Testing HTTPS Deployment

### 1. Test India Portal:
```bash
# Health check
curl https://indiaportals.com/health

# AI automation endpoint
curl https://indiaportals.com/api/ai-automation/supported-providers

# Frontend
curl https://indiaportals.com/
```

### 2. Test Guided Flow:
```bash
# Health check
curl https://guidedflow.com/

# WhatsApp API
curl https://guidedflow.com/api/whatsapp/status
```

### 3. Test AI Automation:
1. Go to: `https://indiaportals.com/name-change-application/electricity?provider=torrent-power`
2. Fill the form with test data
3. Click "Start AI Automation"
4. Watch the browser window open and automatically fill the Torrent Power form

## 🔒 SSL Certificate Management

### Automatic Renewal:
```bash
# Add to crontab for automatic renewal
0 12 * * * /usr/bin/certbot renew --quiet
```

### Manual Renewal:
```bash
# SSH to EC2 instance
ssh -i "Guided-flow.pem" ubuntu@107.21.134.74

# Renew certificates
sudo certbot renew

# Restart nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

## 📊 Monitoring & Logs

### Backend Logs:
```bash
# SSH to EC2
ssh -i "Guided-flow.pem" ubuntu@107.21.134.74

# View backend logs
docker logs india-portal-backend -f

# View AI automation logs
docker logs india-portal-backend | grep "AI automation"
```

### Nginx Logs:
```bash
# Access logs
docker logs india-portal-nginx

# SSL certificate status
sudo certbot certificates
```

## 🚨 Troubleshooting

### Common Issues:

1. **SSL Certificate Issues**:
   ```bash
   # Check certificate status
   sudo certbot certificates
   
   # Renew if expired
   sudo certbot renew --force-renewal
   ```

2. **AI Automation Not Working**:
   ```bash
   # Check OpenAI API key
   docker logs india-portal-backend | grep "OpenAI"
   
   # Test browser-use
   curl https://indiaportals.com/api/ai-automation/test-connection
   ```

3. **CORS Issues**:
   ```bash
   # Check nginx config
   docker exec india-portal-nginx cat /etc/nginx/nginx.conf
   ```

## 🎉 Success Indicators

### ✅ Deployment Successful When:
1. `https://indiaportals.com` loads without SSL warnings
2. AI automation endpoint responds: `https://indiaportals.com/api/ai-automation/supported-providers`
3. Torrent Power form automation works from HTTPS portal
4. Browser-use opens visible browser and fills form automatically
5. SSL Labs test shows A+ rating: https://www.ssllabs.com/ssltest/

### 🤖 AI Automation Working When:
1. Form page loads: `https://indiaportals.com/name-change-application/electricity?provider=torrent-power`
2. "Start AI Automation" button works
3. Browser window opens automatically
4. Form gets filled with user data
5. User can complete captcha and submit manually

## 🔗 Final URLs

### Production URLs:
- **India Portal**: https://indiaportals.com (or https://107.21.134.74)
- **Guided Flow**: https://guidedflow.com (or https://54.81.22.180)

### API Endpoints:
- **AI Automation**: https://indiaportals.com/api/ai-automation/
- **WhatsApp API**: https://guidedflow.com/api/whatsapp/

### Admin Panels:
- **Backend Docs**: https://indiaportals.com/docs
- **Health Check**: https://indiaportals.com/health

---

## 🎯 Next Steps After Deployment

1. **Test AI Automation**: Try the Torrent Power form automation
2. **Monitor Performance**: Check logs and response times
3. **Set up Monitoring**: Add uptime monitoring
4. **Backup Strategy**: Set up automated backups
5. **Domain Configuration**: Point your domains to EC2 IPs
6. **Security Audit**: Run security scans on HTTPS endpoints

**Ready to deploy? Run the deployment scripts and enjoy HTTPS-powered AI automation! 🚀**