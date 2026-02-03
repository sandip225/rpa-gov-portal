#!/usr/bin/env python3
"""
Chrome and Selenium Diagnostic Script
Helps identify why RPA automation is failing
"""

import os
import sys
import platform
import subprocess
import shutil

def print_header(text):
    print("\n" + "="*50)
    print(f"  {text}")
    print("="*50)

def check_chrome_installed():
    """Check if Chrome is installed"""
    print_header("Checking Chrome Installation")
    
    system = platform.system()
    
    if system == "Windows":
        # Check Windows registry
        try:
            import winreg
            try:
                key = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, 
                    r"SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe")
                chrome_path = winreg.QueryValue(key, None)
                print(f"✅ Chrome found at: {chrome_path}")
                return True
            except FileNotFoundError:
                print("❌ Chrome not found in registry")
                return False
        except Exception as e:
            print(f"❌ Error checking registry: {e}")
            return False
    
    elif system == "Darwin":  # macOS
        chrome_path = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        if os.path.exists(chrome_path):
            print(f"✅ Chrome found at: {chrome_path}")
            return True
        else:
            print("❌ Chrome not found at standard macOS location")
            return False
    
    elif system == "Linux":
        chrome_path = shutil.which("google-chrome") or shutil.which("chromium")
        if chrome_path:
            print(f"✅ Chrome found at: {chrome_path}")
            return True
        else:
            print("❌ Chrome not found in PATH")
            return False
    
    return False

def check_chromedriver():
    """Check if ChromeDriver is available"""
    print_header("Checking ChromeDriver")
    
    # Check if chromedriver is in PATH
    chromedriver_path = shutil.which("chromedriver")
    if chromedriver_path:
        print(f"✅ ChromeDriver found in PATH: {chromedriver_path}")
        return True
    
    print("⚠️ ChromeDriver not in PATH (webdriver-manager will download it)")
    return False

def check_selenium():
    """Check if Selenium is installed"""
    print_header("Checking Selenium Installation")
    
    try:
        import selenium
        print(f"✅ Selenium is installed")
        print(f"   Version: {selenium.__version__}")
        return True
    except ImportError:
        print("❌ Selenium is NOT installed")
        print("   Run: pip install selenium")
        return False

def check_webdriver_manager():
    """Check if webdriver-manager is installed"""
    print_header("Checking webdriver-manager")
    
    try:
        import webdriver_manager
        print(f"✅ webdriver-manager is installed")
        return True
    except ImportError:
        print("❌ webdriver-manager is NOT installed")
        print("   Run: pip install webdriver-manager")
        return False

def test_selenium_import():
    """Test if we can import and use Selenium"""
    print_header("Testing Selenium Import")
    
    try:
        from selenium import webdriver
        from selenium.webdriver.chrome.options import Options
        from selenium.webdriver.chrome.service import Service
        print("✅ Selenium imports successful")
        return True
    except ImportError as e:
        print(f"❌ Selenium import failed: {e}")
        return False

def test_chrome_driver_creation():
    """Test if we can create a Chrome driver"""
    print_header("Testing Chrome Driver Creation")
    
    try:
        from selenium import webdriver
        from selenium.webdriver.chrome.options import Options
        from webdriver_manager.chrome import ChromeDriverManager
        
        print("🔧 Attempting to create Chrome driver...")
        
        options = Options()
        options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        
        # Try webdriver-manager approach
        try:
            driver_path = ChromeDriverManager().install()
            print(f"   ChromeDriver path: {driver_path}")
            
            service = Service(driver_path)
            driver = webdriver.Chrome(service=service, options=options)
            print("✅ Chrome driver created successfully!")
            driver.quit()
            return True
        except Exception as e:
            print(f"❌ webdriver-manager approach failed: {e}")
            
            # Try system Chrome
            try:
                driver = webdriver.Chrome(options=options)
                print("✅ Chrome driver created successfully (system Chrome)!")
                driver.quit()
                return True
            except Exception as e2:
                print(f"❌ System Chrome approach failed: {e2}")
                return False
                
    except Exception as e:
        print(f"❌ Chrome driver creation failed: {e}")
        return False

def print_recommendations():
    """Print recommendations based on checks"""
    print_header("Recommendations")
    
    system = platform.system()
    
    print("\n📋 Installation Steps:\n")
    
    if system == "Windows":
        print("1. Install Chrome:")
        print("   - Visit: https://www.google.com/chrome/")
        print("   - Download and install Chrome")
        print("")
        print("2. Install Python dependencies:")
        print("   pip install selenium webdriver-manager")
        print("")
        print("3. Run this diagnostic again to verify")
        print("")
        print("4. Restart your backend server")
        
    elif system == "Darwin":  # macOS
        print("1. Install Chrome:")
        print("   brew install --cask google-chrome")
        print("")
        print("2. Install Python dependencies:")
        print("   pip3 install selenium webdriver-manager")
        print("")
        print("3. Run this diagnostic again to verify")
        print("")
        print("4. Restart your backend server")
        
    elif system == "Linux":
        print("1. Install Chrome:")
        print("   sudo apt-get update")
        print("   sudo apt-get install -y google-chrome-stable")
        print("")
        print("2. Install Python dependencies:")
        print("   pip3 install selenium webdriver-manager")
        print("")
        print("3. Run this diagnostic again to verify")
        print("")
        print("4. Restart your backend server")

def main():
    print("\n")
    print("╔════════════════════════════════════════════════════════╗")
    print("║   Chrome & Selenium Diagnostic Tool                   ║")
    print("║   For RPA Automation Troubleshooting                  ║")
    print("╚════════════════════════════════════════════════════════╝")
    
    system = platform.system()
    print(f"\n🖥️  System: {system}")
    print(f"🐍 Python: {sys.version.split()[0]}")
    
    # Run checks
    chrome_ok = check_chrome_installed()
    chromedriver_ok = check_chromedriver()
    selenium_ok = check_selenium()
    webdriver_mgr_ok = check_webdriver_manager()
    selenium_import_ok = test_selenium_import()
    
    # Only test driver creation if basic imports work
    driver_ok = False
    if selenium_ok and webdriver_mgr_ok:
        driver_ok = test_chrome_driver_creation()
    
    # Summary
    print_header("Summary")
    
    checks = [
        ("Chrome Browser", chrome_ok),
        ("ChromeDriver", chromedriver_ok),
        ("Selenium Package", selenium_ok),
        ("webdriver-manager", webdriver_mgr_ok),
        ("Selenium Imports", selenium_import_ok),
        ("Chrome Driver Creation", driver_ok),
    ]
    
    print("\n")
    for check_name, result in checks:
        status = "✅" if result else "❌"
        print(f"{status} {check_name}")
    
    all_ok = all(result for _, result in checks)
    
    if all_ok:
        print("\n✅ All checks passed! RPA automation should work.")
    else:
        print("\n❌ Some checks failed. See recommendations below.")
        print_recommendations()
    
    print("\n")

if __name__ == "__main__":
    main()
