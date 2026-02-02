@echo off
echo 🚀 Deploying Unified Portal with RPA to EC2...

REM Set environment variables
set EC2_IP=ec2-3-88-187-173.compute-1.amazonaws.com
set EC2_USER=ubuntu
set KEY_PATH=unified.pem

echo 📦 Building production frontend...
cd frontend
call npm run build
cd ..

echo 🐳 Building Docker images...
docker-compose -f docker-compose.prod.yml build

echo 📤 Copying files to EC2...
scp -i %KEY_PATH% -r . %EC2_USER%@%EC2_IP%:/home/ubuntu/unified-portal/

echo 🚀 Starting services on EC2...
ssh -i %KEY_PATH% %EC2_USER%@%EC2_IP% "cd /home/ubuntu/unified-portal && docker-compose -f docker-compose.prod.yml down && docker-compose -f docker-compose.prod.yml up -d"

echo ✅ Deployment completed!
echo 🌐 Frontend: http://%EC2_IP%:3000
echo 🔧 Backend: http://%EC2_IP%:8000
echo 📊 RPA: Ready for Torrent Power automation

echo 🧪 Testing RPA functionality...
ssh -i %KEY_PATH% %EC2_USER%@%EC2_IP% "cd /home/ubuntu/unified-portal && docker exec india-portal-backend python -c 'from app.services.torrent_rpa_service import TorrentPowerRPA; print(\"✅ RPA service ready on EC2\")'"

pause