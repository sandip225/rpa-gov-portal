# Registration Error 400 - Troubleshooting

## Error: `POST http://52.204.134.92/api/auth/register 400 (Bad Request)`

This means the registration data is not being accepted by the backend.

## Common Causes & Fixes:

### 1. **Check Browser Console for Detailed Error**
- Open DevTools (F12)
- Go to Console tab
- Try to register again
- Look for the actual error message from the backend

### 2. **Validate Form Fields**
Ensure you're entering:
- **Full Name**: Any text (required)
- **Email**: Must be valid format like `user@example.com` (required)
- **Mobile**: Exactly 10 digits, e.g., `9876543210` (required)
- **City**: Select from dropdown (required)
- **Password**: Any password, at least 1 character (required)

### 3. **Common Validation Errors**

❌ **Email already registered**
- Use a different email address

❌ **Mobile already registered**
- Use a different 10-digit mobile number
- Ensure it's exactly 10 digits

❌ **Invalid email format**
- Email must have @ symbol, e.g., `test@example.com`

❌ **Mobile must be 10 digits**
- Don't include country code or +91
- Just 10 digits: `9876543210`

### 4. **Test Registration via API**

Run this PowerShell command to test:

```powershell
$uri = "http://52.204.134.92/api/auth/register"
$body = @{
    email = "newuser@example.com"
    mobile = "9876543210"
    password = "Test@123"
    full_name = "New User"
    city = "Ahmedabad"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri $uri -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ Registration successful!" -ForegroundColor Green
    $response.Content | ConvertFrom-Json | ConvertTo-Json
} catch {
    Write-Host "❌ Error: " -ForegroundColor Red
    $_.Exception.Response.StatusCode
    $_.Exception.Response.Content.ReadAsStringAsync().Result
}
```

### 5. **If Still Getting 400**

The backend might not have picked up the changes. Rebuild containers on EC2:

```bash
cd ~/unified-portal
docker-compose down
docker-compose up -d --build
sleep 60
```

Then try registering again.

### 6. **Check Backend Logs**

```bash
docker logs unified-portal-backend --tail 100
```

Look for validation errors or stack traces.

## Solution Summary:

1. Check DevTools Console (F12) for the actual error message
2. Validate all form fields match requirements above
3. If issue persists, rebuild containers: `docker-compose down && docker-compose up -d --build`
4. Try API test with PowerShell command above
5. If still stuck, check backend logs: `docker logs unified-portal-backend`
