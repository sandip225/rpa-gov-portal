#!/bin/bash

# Chrome Installation Script for Linux/Mac
# This script helps install Chrome and ChromeDriver for RPA automation

echo ""
echo "========================================"
echo "Chrome Installation for RPA Automation"
echo "========================================"
echo ""

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
    echo "🐧 Detected Linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="mac"
    echo "🍎 Detected macOS"
else
    echo "❌ Unsupported OS: $OSTYPE"
    exit 1
fi

echo ""
echo "Installing Chrome..."
echo ""

if [ "$OS" = "linux" ]; then
    # Linux installation
    echo "📦 Updating package manager..."
    sudo apt-get update
    
    echo "📦 Adding Google Chrome repository..."
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo gpg --dearmor -o /usr/share/keyrings/google-chrome.gpg
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome.gpg] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
    
    echo "📦 Updating package list..."
    sudo apt-get update
    
    echo "📦 Installing Google Chrome..."
    sudo apt-get install -y google-chrome-stable
    
    if [ $? -eq 0 ]; then
        echo "✅ Chrome installed successfully"
        google-chrome --version
    else
        echo "⚠️ Chrome installation failed, trying Chromium instead..."
        sudo apt-get install -y chromium-browser chromium-driver
        
        if [ $? -eq 0 ]; then
            echo "✅ Chromium installed successfully"
            chromium-browser --version
        else
            echo "❌ Failed to install Chrome or Chromium"
            echo "Try manual installation: https://www.google.com/chrome/"
            exit 1
        fi
    fi
    
elif [ "$OS" = "mac" ]; then
    # macOS installation
    echo "📦 Checking for Homebrew..."
    if ! command -v brew &> /dev/null; then
        echo "❌ Homebrew not found. Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    
    echo "📦 Installing Google Chrome via Homebrew..."
    brew install --cask google-chrome
    
    if [ $? -eq 0 ]; then
        echo "✅ Chrome installed successfully"
        /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --version
    else
        echo "❌ Failed to install Chrome"
        exit 1
    fi
fi

echo ""
echo "Checking Python..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed"
    echo "Please install Python3 first"
    exit 1
fi

echo "✅ Python is installed"
python3 --version

echo ""
echo "Installing webdriver-manager (handles ChromeDriver automatically)..."
# Don't install system-wide on Ubuntu 24.04+
# Users should use virtual environment in their project
echo "✅ Skipping system-wide webdriver-manager installation"
echo "   Install it in your project's virtual environment instead:"
echo "   cd ~/rpa-gov-portal && python3 -m venv venv && source venv/bin/activate && pip install webdriver-manager"

echo ""
echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Restart your backend server"
echo "2. Try the RPA automation again"
echo ""
