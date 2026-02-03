"""
Docker RPA Service - Optimized for Docker/Chromium
Uses Chromium instead of Chrome for easier Docker deployment
"""

import time
import os
import logging
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

class DockerTorrentRPA:
    def __init__(self):
        self.driver = None
        self.wait = None
        
    def setup_driver(self):
        """Setup Chrome/Chromium WebDriver for Docker"""
        try:
            logger.info("🚀 Setting up Chromium driver for Docker...")
            
            # Chrome options for Docker (headless)
            options = Options()
            
            # Docker-specific options
            options.add_argument("--headless=new")
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")
            options.add_argument("--disable-gpu")
            options.add_argument("--disable-software-rasterizer")
            options.add_argument("--disable-background-timer-throttling")
            options.add_argument("--disable-backgrounding-occluded-windows")
            options.add_argument("--disable-renderer-backgrounding")
            options.add_argument("--disable-features=TranslateUI")
            options.add_argument("--disable-ipc-flooding-protection")
            options.add_argument("--memory-pressure-off")
            
            # Common options
            options.add_argument("--window-size=1920,1080")
            options.add_argument("--disable-extensions")
            options.add_argument("--disable-plugins")
            options.add_argument("--disable-notifications")
            options.add_argument("--disable-popup-blocking")
            options.add_argument("--disable-translate")
            options.add_argument("--disable-logging")
            options.add_argument("--no-first-run")
            options.add_argument("--no-default-browser-check")
            options.add_argument("--ignore-certificate-errors")
            options.add_argument("--ignore-ssl-errors")
            options.add_argument("--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
            
            # Try to find Chromium/Chrome binary
            chromium_paths = [
                "/usr/bin/chromium-browser",
                "/usr/bin/chromium",
                "/usr/bin/google-chrome",
                "/usr/bin/google-chrome-stable",
            ]
            
            binary_found = False
            for path in chromium_paths:
                if os.path.exists(path):
                    logger.info(f"🔍 Found browser at: {path}")
                    options.binary_location = path
                    binary_found = True
                    break
            
            if not binary_found:
                logger.warning("⚠️ No browser binary found, using system default")
            
            # Try webdriver-manager first
            try:
                logger.info("🔧 Trying webdriver-manager...")
                from webdriver_manager.chrome import ChromeDriverManager
                
                driver_path = ChromeDriverManager().install()
                logger.info(f"✅ ChromeDriver installed at: {driver_path}")
                
                # Fix path if needed
                if not driver_path.endswith('chromedriver'):
                    driver_dir = os.path.dirname(driver_path)
                    possible_paths = [
                        os.path.join(driver_dir, 'chromedriver'),
                        os.path.join(driver_dir, 'chromedriver-linux64', 'chromedriver'),
                    ]
                    for possible_path in possible_paths:
                        if os.path.exists(possible_path):
                            driver_path = possible_path
                            break
                
                if os.path.exists(driver_path):
                    os.chmod(driver_path, 0o755)
                    service = Service(driver_path)
                    self.driver = webdriver.Chrome(service=service, options=options)
                    logger.info("✅ Chrome driver initialized with webdriver-manager")
                else:
                    raise FileNotFoundError(f"ChromeDriver not found at {driver_path}")
                    
            except Exception as wdm_error:
                logger.warning(f"⚠️ webdriver-manager failed: {wdm_error}")
                logger.info("🔧 Trying system Chrome/Chromium...")
                try:
                    self.driver = webdriver.Chrome(options=options)
                    logger.info("✅ Chrome driver initialized from system")
                except Exception as sys_error:
                    logger.error(f"❌ System Chrome also failed: {sys_error}")
                    raise
            
            # Set timeouts
            self.driver.implicitly_wait(10)
            self.driver.set_page_load_timeout(30)
            self.wait = WebDriverWait(self.driver, 20)
            
            # Test driver
            logger.info("🧪 Testing Chrome driver...")
            self.driver.get("data:text/html,<html><body><h1>Driver Test</h1></body></html>")
            logger.info("✅ Chrome driver test successful")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Driver setup failed: {e}")
            logger.error(f"❌ Error type: {type(e).__name__}: {str(e)}")
            return False
    
    def navigate_to_torrent_power(self):
        """Navigate to Torrent Power website"""
        try:
            url = "https://connect.torrentpower.com/tplcp/application/namechangerequest"
            logger.info(f"🌐 Navigating to: {url}")
            
            self.driver.get(url)
            self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
            logger.info("✅ Page loaded successfully")
            
            return True
            
        except TimeoutException:
            logger.error("❌ Page load timeout")
            return False
        except Exception as e:
            logger.error(f"❌ Navigation failed: {e}")
            return False
    
    def fill_form(self, form_data):
        """Fill the Torrent Power form"""
        try:
            logger.info("🚀 Starting form filling...")
            filled_fields = []
            time.sleep(2)
            
            # 1. Fill City Dropdown
            try:
                logger.info("🔍 Looking for city dropdown...")
                city_select = self.wait.until(EC.element_to_be_clickable((By.TAG_NAME, "select")))
                select = Select(city_select)
                city = form_data.get('city', 'Ahmedabad')
                
                options = select.options
                for option in options:
                    if city.lower() in option.text.lower():
                        select.select_by_value(option.get_attribute('value'))
                        filled_fields.append(f"✅ City: {option.text}")
                        logger.info(f"✅ City selected: {option.text}")
                        break
                
                time.sleep(1)
            except Exception as e:
                logger.error(f"❌ City dropdown error: {e}")
                filled_fields.append("❌ City dropdown not found")
            
            # 2. Fill Service Number
            try:
                logger.info("🔍 Looking for service number field...")
                text_inputs = self.driver.find_elements(By.CSS_SELECTOR, "input[type='text']")
                if text_inputs and form_data.get('service_number'):
                    text_inputs[0].clear()
                    text_inputs[0].send_keys(form_data['service_number'])
                    filled_fields.append(f"✅ Service Number: {form_data['service_number']}")
                    logger.info(f"✅ Service Number filled")
                
                time.sleep(0.5)
            except Exception as e:
                logger.error(f"❌ Service Number error: {e}")
            
            # 3. Fill T Number
            try:
                logger.info("🔍 Looking for T Number field...")
                text_inputs = self.driver.find_elements(By.CSS_SELECTOR, "input[type='text']")
                if len(text_inputs) > 1 and form_data.get('t_number'):
                    text_inputs[1].clear()
                    text_inputs[1].send_keys(form_data['t_number'])
                    filled_fields.append(f"✅ T Number: {form_data['t_number']}")
                    logger.info(f"✅ T Number filled")
                
                time.sleep(0.5)
            except Exception as e:
                logger.error(f"❌ T Number error: {e}")
            
            # 4. Fill Mobile Number
            try:
                logger.info("🔍 Looking for mobile field...")
                text_inputs = self.driver.find_elements(By.CSS_SELECTOR, "input[type='text']")
                if len(text_inputs) > 2 and form_data.get('mobile'):
                    text_inputs[2].clear()
                    text_inputs[2].send_keys(form_data['mobile'])
                    filled_fields.append(f"✅ Mobile: {form_data['mobile']}")
                    logger.info(f"✅ Mobile filled")
                
                time.sleep(0.5)
            except Exception as e:
                logger.error(f"❌ Mobile error: {e}")
            
            # 5. Fill Email
            try:
                logger.info("🔍 Looking for email field...")
                text_inputs = self.driver.find_elements(By.CSS_SELECTOR, "input[type='text']")
                if len(text_inputs) > 3 and form_data.get('email'):
                    text_inputs[3].clear()
                    text_inputs[3].send_keys(form_data['email'])
                    filled_fields.append(f"✅ Email: {form_data['email']}")
                    logger.info(f"✅ Email filled")
                
                time.sleep(0.5)
            except Exception as e:
                logger.error(f"❌ Email error: {e}")
            
            success_count = len([f for f in filled_fields if f.startswith('✅')])
            logger.info(f"📊 Form filling completed: {success_count}/5 fields filled")
            
            return {
                "success": success_count > 0,
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
                "total_fields": 5
            }
    
    def run_automation(self, form_data):
        """Run complete RPA automation"""
        try:
            logger.info("🤖 Starting Torrent Power RPA Automation...")
            
            if not self.setup_driver():
                return {"success": False, "error": "Failed to setup browser driver"}
            
            if not self.navigate_to_torrent_power():
                return {"success": False, "error": "Failed to navigate to Torrent Power website"}
            
            result = self.fill_form(form_data)
            
            return result
            
        except Exception as e:
            logger.error(f"❌ RPA automation failed: {e}")
            return {"success": False, "error": str(e)}
        finally:
            self.close_driver()
    
    def close_driver(self):
        """Close the browser"""
        try:
            if self.driver:
                self.driver.quit()
                logger.info("✅ Browser closed")
        except Exception as e:
            logger.error(f"❌ Error closing browser: {e}")
