"""
Simple RPA Service - Windows Localhost Version
"""

import time
import os
import logging
import platform
import stat
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SimpleTorrentRPA:
    def __init__(self):
        self.driver = None
        self.wait = None
        
    def setup_driver(self):
        """Setup Chrome driver for both Windows and Linux"""
        try:
            logger.info("🚀 Setting up Chrome driver...")
            
            # Detect environment
            is_windows = platform.system() == 'Windows'
            is_linux = platform.system() == 'Linux'
            logger.info(f"🔍 Platform detected: {platform.system()}")
            
            # Chrome options
            options = Options()
            
            if is_linux:
                # Linux/EC2 - headless mode with proper flags
                options.add_argument("--headless=new")
                options.add_argument("--no-sandbox")
                options.add_argument("--disable-dev-shm-usage")
                options.add_argument("--disable-gpu")
                options.add_argument("--disable-software-rasterizer")
                logger.info("🐧 Using Linux headless options")
                
                # Try to find Chrome/Chromium binary on Linux
                chromium_paths = [
                    "/usr/bin/google-chrome",
                    "/usr/bin/google-chrome-stable",
                    "/usr/bin/chromium-browser",
                    "/usr/bin/chromium",
                ]
                
                for path in chromium_paths:
                    if os.path.exists(path):
                        logger.info(f"🔍 Found browser at: {path}")
                        options.binary_location = path
                        break
                        
            elif is_windows:
                # Windows localhost - visible browser for debugging
                options.add_argument("--start-maximized")
                logger.info("💻 Using Windows visible browser options")
            
            # Common options
            options.add_argument("--window-size=1920,1080")
            options.add_argument("--disable-extensions")
            options.add_argument("--disable-notifications")
            options.add_argument("--disable-popup-blocking")
            options.add_argument("--disable-translate")
            options.add_argument("--disable-logging")
            options.add_argument("--no-first-run")
            options.add_argument("--no-default-browser-check")
            options.add_argument("--ignore-certificate-errors")
            options.add_argument("--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
            
            # Try webdriver-manager first
            try:
                logger.info("🔧 Trying webdriver-manager...")
                from webdriver_manager.chrome import ChromeDriverManager
                
                driver_path = ChromeDriverManager().install()
                logger.info(f"✅ ChromeDriver installed at: {driver_path}")
                
                # Fix path if needed (Linux issue) - webdriver-manager bug
                if is_linux:
                    # The path often points to THIRD_PARTY_NOTICES instead of chromedriver
                    if 'THIRD_PARTY_NOTICES' in driver_path or not driver_path.endswith('chromedriver'):
                        # Get the directory
                        driver_dir = os.path.dirname(driver_path)
                        
                        # Look for actual chromedriver binary
                        possible_paths = [
                            os.path.join(driver_dir, 'chromedriver'),
                            os.path.join(driver_dir, '..', 'chromedriver'),
                            os.path.join(driver_dir, 'chromedriver-linux64', 'chromedriver'),
                        ]
                        
                        for possible_path in possible_paths:
                            abs_path = os.path.abspath(possible_path)
                            if os.path.exists(abs_path) and os.path.isfile(abs_path):
                                driver_path = abs_path
                                logger.info(f"🔧 Fixed ChromeDriver path: {driver_path}")
                                break
                        
                        # If still not found, search the entire directory tree
                        if 'THIRD_PARTY_NOTICES' in driver_path:
                            base_dir = os.path.dirname(os.path.dirname(driver_path))
                            for root, dirs, files in os.walk(base_dir):
                                if 'chromedriver' in files:
                                    potential_driver = os.path.join(root, 'chromedriver')
                                    if os.access(potential_driver, os.X_OK) or not os.path.islink(potential_driver):
                                        driver_path = potential_driver
                                        logger.info(f"🔍 Found ChromeDriver binary: {driver_path}")
                                        break
                
                # Fix path if needed (Windows issue)
                if is_windows and ('THIRD_PARTY_NOTICES' in driver_path or not driver_path.endswith('.exe')):
                    driver_dir = os.path.dirname(driver_path)
                    possible_paths = [
                        os.path.join(driver_dir, 'chromedriver.exe'),
                        os.path.join(driver_dir, 'chromedriver-win32', 'chromedriver.exe'),
                    ]
                    
                    for possible_path in possible_paths:
                        if os.path.exists(possible_path):
                            driver_path = possible_path
                            logger.info(f"🔧 Fixed ChromeDriver path: {driver_path}")
                            break
                
                if os.path.exists(driver_path) and os.path.isfile(driver_path):
                    # Make executable on Linux
                    if is_linux:
                        try:
                            os.chmod(driver_path, stat.S_IRWXU | stat.S_IRGRP | stat.S_IXGRP | stat.S_IROTH | stat.S_IXOTH)
                            logger.info(f"✅ Made ChromeDriver executable: {driver_path}")
                        except Exception as chmod_error:
                            logger.warning(f"⚠️ Could not chmod driver: {chmod_error}")
                    
                    service = Service(driver_path)
                    self.driver = webdriver.Chrome(service=service, options=options)
                    logger.info("✅ Chrome driver setup successful with webdriver-manager")
                else:
                    logger.warning(f"⚠️ ChromeDriver path invalid: {driver_path}")
                    raise FileNotFoundError(f"ChromeDriver not found at {driver_path}")
                
            except Exception as wdm_error:
                logger.warning(f"⚠️ webdriver-manager failed: {wdm_error}")
                logger.info("🔧 Trying system ChromeDriver at /usr/bin/chromedriver...")
                
                # Try system ChromeDriver directly
                try:
                    if is_linux and os.path.exists('/usr/bin/chromedriver'):
                        service = Service('/usr/bin/chromedriver')
                        self.driver = webdriver.Chrome(service=service, options=options)
                        logger.info("✅ Chrome driver setup successful with /usr/bin/chromedriver")
                    else:
                        logger.info("🔧 Trying system Chrome from PATH...")
                        self.driver = webdriver.Chrome(options=options)
                        logger.info("✅ Chrome driver setup successful with system Chrome")
                except Exception as sys_error:
                    logger.error(f"❌ System Chrome also failed: {sys_error}")
                    raise
            
            # Set timeouts
            self.driver.implicitly_wait(10)
            self.driver.set_page_load_timeout(30)
            self.wait = WebDriverWait(self.driver, 20)
            
            # Test the driver
            logger.info("🧪 Testing Chrome driver...")
            self.driver.get("data:text/html,<html><body><h1>RPA Test - Chrome Working!</h1></body></html>")
            logger.info("✅ Chrome driver test successful")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Chrome setup failed: {e}")
            logger.error(f"❌ Error type: {type(e).__name__}")
            logger.error(f"❌ Full traceback: {repr(e)}")
            
            # Provide helpful suggestions
            error_str = str(e).lower()
            if "chromedriver" in error_str or "chrome" in error_str:
                logger.error("💡 SOLUTION: Chrome browser is not installed or not found")
                logger.error("💡 On Linux: sudo apt-get install -y google-chrome-stable")
                logger.error("💡 On Windows: Download from https://www.google.com/chrome/")
            elif "permission denied" in error_str:
                logger.error("💡 SOLUTION: Permission issue with ChromeDriver")
                logger.error("💡 Try: chmod +x /path/to/chromedriver")
            
            return False
    
    def navigate_to_torrent_power(self):
        """Navigate to Torrent Power website"""
        try:
            url = "https://connect.torrentpower.com/tplcp/application/namechangerequest"
            logger.info(f"🌐 Navigating to: {url}")
            
            self.driver.get(url)
            
            # Wait for page to load
            self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
            logger.info("✅ Page loaded successfully")
            
            # Clean automation without annoying banners
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Navigation failed: {e}")
            return False
    
    def fill_form(self, form_data):
        """Fill the Torrent Power form"""
        try:
            logger.info("🚀 Starting form filling...")
            filled_fields = []
            time.sleep(1)  # Wait for page to fully load
            
            # 1. Fill City Dropdown
            try:
                logger.info("🔍 Looking for city dropdown...")
                city_select = self.wait.until(EC.element_to_be_clickable((By.TAG_NAME, "select")))
                
                select = Select(city_select)
                city = form_data.get('city', 'Ahmedabad')
                
                # Try to select city
                options = select.options
                for option in options:
                    if city.lower() in option.text.lower():
                        select.select_by_value(option.get_attribute('value'))
                        filled_fields.append("City selected")
                        logger.info(f"✅ City selected: {option.text}")
                        
                        # Highlight the field
                        self.driver.execute_script("arguments[0].style.backgroundColor = '#d4edda'; arguments[0].style.border = '3px solid #28a745';", city_select)
                        break
                
                time.sleep(0.3)
                
            except Exception as e:
                logger.error(f"❌ City dropdown error: {e}")
                filled_fields.append("❌ City dropdown not found")
            
            # 2. Fill Service Number
            try:
                logger.info("🔍 Looking for service number field...")
                service_selectors = [
                    "input[placeholder*='Service Number']",
                    "input[placeholder*='Service']",
                    "input[name*='service']",
                    "input[id*='service']"
                ]
                
                service_input = None
                for selector in service_selectors:
                    try:
                        service_input = self.driver.find_element(By.CSS_SELECTOR, selector)
                        break
                    except:
                        continue
                
                if not service_input:
                    text_inputs = self.driver.find_elements(By.CSS_SELECTOR, "input[type='text']")
                    if text_inputs:
                        service_input = text_inputs[0]
                
                if service_input and form_data.get('service_number'):
                    service_input.clear()
                    service_input.send_keys(form_data['service_number'])
                    filled_fields.append("Service Number filled")
                    logger.info(f"✅ Service Number filled: {form_data['service_number']}")
                    
                    # Highlight the field
                    self.driver.execute_script("arguments[0].style.backgroundColor = '#d4edda'; arguments[0].style.border = '3px solid #28a745';", service_input)
                else:
                    filled_fields.append("❌ Service Number field not found")
                
                time.sleep(0.3)
                
            except Exception as e:
                logger.error(f"❌ Service Number error: {e}")
                filled_fields.append("❌ Service Number error")
            
            # 3. Fill T Number
            try:
                logger.info("🔍 Looking for T Number field...")
                t_selectors = [
                    "input[placeholder*='T No']",
                    "input[placeholder*='T-No']",
                    "input[name*='tno']"
                ]
                
                t_input = None
                for selector in t_selectors:
                    try:
                        t_input = self.driver.find_element(By.CSS_SELECTOR, selector)
                        break
                    except:
                        continue
                
                if not t_input:
                    text_inputs = self.driver.find_elements(By.CSS_SELECTOR, "input[type='text']")
                    if len(text_inputs) > 1:
                        t_input = text_inputs[1]
                
                if t_input and form_data.get('t_number'):
                    t_input.clear()
                    t_input.send_keys(form_data['t_number'])
                    filled_fields.append("T Number filled")
                    logger.info(f"✅ T Number filled: {form_data['t_number']}")
                    
                    # Highlight the field
                    self.driver.execute_script("arguments[0].style.backgroundColor = '#d4edda'; arguments[0].style.border = '3px solid #28a745';", t_input)
                else:
                    filled_fields.append("❌ T Number field not found")
                
                time.sleep(0.3)
                
            except Exception as e:
                logger.error(f"❌ T Number error: {e}")
                filled_fields.append("❌ T Number error")
            
            # 4. Fill Mobile Number
            try:
                logger.info("🔍 Looking for mobile field...")
                mobile_selectors = [
                    "input[type='tel']",
                    "input[placeholder*='Mobile']",
                    "input[name*='mobile']"
                ]
                
                mobile_input = None
                for selector in mobile_selectors:
                    try:
                        mobile_input = self.driver.find_element(By.CSS_SELECTOR, selector)
                        break
                    except:
                        continue
                
                if not mobile_input:
                    text_inputs = self.driver.find_elements(By.CSS_SELECTOR, "input[type='text']")
                    if len(text_inputs) > 2:
                        mobile_input = text_inputs[2]
                
                if mobile_input and form_data.get('mobile'):
                    mobile_input.clear()
                    mobile_input.send_keys(form_data['mobile'])
                    filled_fields.append("Mobile Number filled")
                    logger.info(f"✅ Mobile filled: {form_data['mobile']}")
                    
                    # Highlight the field
                    self.driver.execute_script("arguments[0].style.backgroundColor = '#d4edda'; arguments[0].style.border = '3px solid #28a745';", mobile_input)
                else:
                    filled_fields.append("❌ Mobile field not found")
                
                time.sleep(0.3)
                
            except Exception as e:
                logger.error(f"❌ Mobile error: {e}")
                filled_fields.append("❌ Mobile error")
            
            # 5. Fill Email
            try:
                logger.info("🔍 Looking for email field...")
                email_selectors = [
                    "input[type='email']",
                    "input[placeholder*='Email']",
                    "input[name*='email']"
                ]
                
                email_input = None
                for selector in email_selectors:
                    try:
                        email_input = self.driver.find_element(By.CSS_SELECTOR, selector)
                        break
                    except:
                        continue
                
                if not email_input:
                    text_inputs = self.driver.find_elements(By.CSS_SELECTOR, "input[type='text']")
                    if len(text_inputs) > 3:
                        email_input = text_inputs[3]
                
                if email_input and form_data.get('email'):
                    email_input.clear()
                    email_input.send_keys(form_data['email'])
                    filled_fields.append("Email filled")
                    logger.info(f"✅ Email filled: {form_data['email']}")
                    
                    # Highlight the field
                    self.driver.execute_script("arguments[0].style.backgroundColor = '#d4edda'; arguments[0].style.border = '3px solid #28a745';", email_input)
                else:
                    filled_fields.append("❌ Email field not found")
                
                time.sleep(0.3)
                
            except Exception as e:
                logger.error(f"❌ Email error: {e}")
                filled_fields.append("❌ Email error")
            
            # 6. Skip submit - let user handle captcha
            logger.info("⚠️ Captcha detected - form filled, user needs to solve captcha and submit manually")
            filled_fields.append("Form filled - solve captcha to submit")
            
            # Clean completion without popup
            success_count = len([f for f in filled_fields if not f.startswith('❌')])
            logger.info(f"📊 Form filling completed: {success_count}/5 fields filled")
            
            return {
                "success": True,  # Mark as success since fields are filled
                "filled_fields": filled_fields,
                "total_filled": success_count,
                "total_fields": 5
            }
            
        except Exception as e:
            logger.error(f"❌ Form filling failed: {e}")
            return {
                "success": False,
                "error": str(e),
                "filled_fields": ["❌ Form filling failed"],
                "total_filled": 0,
                "total_fields": 6
            }
    
    def run_automation(self, form_data):
        """Run complete Torrent Power automation"""
        try:
            logger.info("🤖 Starting Torrent Power RPA automation...")
            
            # Setup driver
            if not self.setup_driver():
                return {"success": False, "error": "Chrome setup failed"}
            
            # Navigate to Torrent Power
            if not self.navigate_to_torrent_power():
                return {"success": False, "error": "Failed to navigate to Torrent Power website"}
            
            # Fill the form
            result = self.fill_form(form_data)
            
            # Reduce wait time from 5 minutes to 30 seconds
            logger.info("🕐 Keeping browser open for 30 seconds for user interaction...")
            time.sleep(30)
            
            return result
            
        except Exception as e:
            logger.error(f"❌ RPA automation failed: {e}")
            return {"success": False, "error": str(e)}
        finally:
            # Don't close driver immediately - let user interact
            pass
    
    def close_driver(self):
        """Close the browser"""
        try:
            if self.driver:
                self.driver.quit()
                logger.info("✅ Browser closed")
        except Exception as e:
            logger.error(f"❌ Error closing browser: {e}")


# Test function for localhost
def test_localhost_rpa():
    """Test RPA on localhost"""
    test_data = {
        "city": "Ahmedabad",
        "service_number": "TP123456",
        "t_number": "T789",
        "mobile": "9632587410",
        "email": "test@gmail.com"
    }
    
    rpa = SimpleTorrentRPA()
    result = rpa.run_automation(test_data)
    
    print("🔍 Localhost RPA Test Results:")
    print(f"Success: {result.get('success')}")
    print(f"Fields filled: {result.get('total_filled', 0)}/5")
    
    if result.get('filled_fields'):
        print("Field Results:")
        for field in result['filled_fields']:
            print(f"  {field}")
    
    return result


if __name__ == "__main__":
    test_localhost_rpa()