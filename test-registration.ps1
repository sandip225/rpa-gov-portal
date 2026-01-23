#!/usr/bin/env powershell
# Test Registration API

param(
    [string]$Email = "testuser$(Get-Random)@example.com",
    [string]$Mobile = "9876543210",
    [string]$Password = "Test@123",
    [string]$FullName = "Test User",
    [string]$City = "Ahmedabad",
    [string]$URL = "http://52.204.134.92"
)

Write-Host "Testing Registration API" -ForegroundColor Cyan
Write-Host "URL: $URL/api/auth/register" -ForegroundColor Yellow

$body = @{
    email = $Email
    mobile = $Mobile
    password = $Password
    full_name = $FullName
    city = $City
} | ConvertTo-Json

Write-Host "Request Data:" -ForegroundColor Yellow
Write-Output $body

try {
    $response = Invoke-WebRequest -Uri "$URL/api/auth/register" `
        -Method POST `
        -Body $body `
        -ContentType "application/json"
    
    Write-Host "SUCCESS! Registration worked!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Green
    Write-Output ($response.Content | ConvertFrom-Json | ConvertTo-Json)
    
} catch {
    Write-Host "FAILED! Registration error:" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        
        try {
            $errorContent = $_.Exception.Response.Content.ReadAsStringAsync().Result
            Write-Host "Error Details:" -ForegroundColor Red
            Write-Output ($errorContent | ConvertFrom-Json | ConvertTo-Json)
        } catch {
            Write-Output $errorContent
        }
    } else {
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
}
