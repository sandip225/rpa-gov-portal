"""
Torrent Power RPA Service using Selenium WebDriver
Real browser automation for form filling
"""

import time
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TorrentPowerRPA:
    def __init__(self):
        self.driver = None
        self.wait = None
        
    def setup_driver(self):
        """Setup Chrome WebDriver with proper options"""
        try:
            chrome_options = Options()
            
            # EC2 deployment options
            chrome_options.add_argument("--headless")  # Run headless on server
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")
            chrome_options.add_argument("--disable-gpu")
            chrome_options.add_argument("--window-size=1920,1080")
            chrome_options.add_argument("--remote-debugging-port=9222")
            
            # Additional EC2 stability options
            chrome_options.add_argument("--disable-extensions")
            chrome_options.add_argument("--disable-plugins")
            chrome_options.add_argument("--disable-images")
            chrome_options.add_argument("--disable-javascript")  # Remove if JS needed
            chrome_options.add_argument("--single-process")
            chrome_options.add_argument("--disable-background-timer-throttling")
            chrome_options.add_argument("--disable-renderer-backgrounding")
            chrome_options.add_argument("--disable-backgrounding-occluded-windows")
            
            # Disable notifications and popups
            chrome_options.add_argument("--disable-notifications")
            chrome_options.add_argument("--disable-popup-blocking")
            
            # User agent to avoid detection
            chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
            
            # Try to find Chrome driver
            try:
                # Try system PATH first
                self.driver = webdriver.Chrome(options=chrome_options)
                logger.info("✅ Chrome driver initialized from system PATH")
            except Exception as e:
                logger.error(f"❌ Failed to initialize Chrome driver: {e}")
                raise Exception("Chrome driver not found. Please install ChromeDriver.")
            
            # Set implicit wait and create explicit wait
            self.driver.implicitly_wait(10)
            self.wait = WebDriverWait(self.driver, 20)
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Driver setup failed: {e}")
            return False
    
    def navigate_to_torrent_power(self):
        """Navigate to Torrent Power name change form"""
        try:
            url = "https://connect.torrentpower.com/tplcp/application/namechangerequest"
            logger.info(f"🌐 Navigating to: {url}")
            
            self.driver.get(url)
            
            # Wait for page to load
            self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "form")))
            logger.info("✅ Page loaded successfully")
            
            # Take screenshot for debugging
            self.driver.save_screenshot("torrent_page_loaded.png")
            logger.info("📸 Screenshot saved: torrent_page_loaded.png")
            
            return True
            
        except TimeoutException:
            logger.error("❌ Page load timeout")
            return False
        except Exception as e:
            logger.error(f"❌ Navigation failed: {e}")
            return False
    
    def fill_form(self, form_data):
        """Fill the Torrent Power form with provided data"""
        try:
            logger.info("🚀 Starting form filling...")
            filled_fields = []
            
            # 1. Fill City Dropdown
            try:
                logger.info("🔍 Looking for city dropdown...")
                city_select = self.wait.until(EC.element_to_be_clickable((By.TAG_NAME, "select")))
                
                select = Select(city_select)
                city = form_data.get('city', 'Ahmedabad')
                
                # Try to select by visible text or value
                options = select.options
                for option in options:
                    if city.lower() in option.text.lower() or city.lower() in option.get_attribute('value').lower():
                        select.select_by_value(option.get_attribute('value'))
                        filled_fields.append(f"✅ City: {option.text}")
                        logger.info(f"✅ City selected: {option.text}")
                        
                        # Highlight the field
                        self.driver.execute_script("arguments[0].style.backgroundColor = '#d4edda'; arguments[0].style.border = '2px solid #28a745';", city_select)
                        break
                
                time.sleep(1)  # Wait for any dynamic updates
                
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
                    except NoSuchElementException:
                        continue
                
                # Fallback to first text input
                if not service_input:
                    text_inputs = self.driver.find_elements(By.CSS_SELECTOR, "input[type='text']")
                    if text_inputs:
                        service_input = text_inputs[0]
                
                if service_input and form_data.get('service_number'):
                    service_input.clear()
                    service_input.send_keys(form_data['service_number'])
                    filled_fields.append(f"✅ Service Number: {form_data['service_number']}")
                    logger.info(f"✅ Service Number filled: {form_data['service_number']}")
                    
                    # Highlight the field
                    self.driver.execute_script("arguments[0].style.backgroundColor = '#d4edda'; arguments[0].style.border = '2px solid #28a745';", service_input)
                else:
                    filled_fields.append("❌ Service Number field not found")
                
                time.sleep(0.5)
                
            except Exception as e:
                logger.error(f"❌ Service Number error: {e}")
                filled_fields.append("❌ Service Number error")
            
            # 3. Fill T Number
            try:
                logger.info("🔍 Looking for T Number field...")
                t_selectors = [
                    "input[placeholder*='T No']",
                    "input[placeholder*='T-No']",
                    "input[placeholder*='TNo']",
                    "input[name*='tno']",
                    "input[id*='tno']"
                ]
                
                t_input = None
                for selector in t_selectors:
                    try:
                        t_input = self.driver.find_element(By.CSS_SELECTOR, selector)
                        break
                    except NoSuchElementException:
                        continue
                
                # Fallback to second text input
                if not t_input:
                    text_inputs = self.driver.find_elements(By.CSS_SELECTOR, "input[type='text']")
                    if len(text_inputs) > 1:
                        t_input = text_inputs[1]
                
                if t_input and form_data.get('t_number'):
                    t_input.clear()
                    t_input.send_keys(form_data['t_number'])
                    filled_fields.append(f"✅ T Number: {form_data['t_number']}")
                    logger.info(f"✅ T Number filled: {form_data['t_number']}")
                    
                    # Highlight the field
                    self.driver.execute_script("arguments[0].style.backgroundColor = '#d4edda'; arguments[0].style.border = '2px solid #28a745';", t_input)
                else:
                    filled_fields.append("❌ T Number field not found")
                
                time.sleep(0.5)
                
            except Exception as e:
                logger.error(f"❌ T Number error: {e}")
                filled_fields.append("❌ T Number error")
            
            # 4. Fill Mobile Number
            try:
                logger.info("🔍 Looking for mobile number field...")
                mobile_selectors = [
                    "input[type='tel']",
                    "input[placeholder*='Mobile']",
                    "input[placeholder*='mobile']",
                    "input[name*='mobile']",
                    "input[id*='mobile']"
                ]
                
                mobile_input = None
                for selector in mobile_selectors:
                    try:
                        mobile_input = self.driver.find_element(By.CSS_SELECTOR, selector)
                        break
                    except NoSuchElementException:
                        continue
                
                # Fallback to third text input
                if not mobile_input:
                    text_inputs = self.driver.find_elements(By.CSS_SELECTOR, "input[type='text']")
                    if len(text_inputs) > 2:
                        mobile_input = text_inputs[2]
                
                if mobile_input and form_data.get('mobile'):
                    mobile_input.clear()
                    mobile_input.send_keys(form_data['mobile'])
                    filled_fields.append(f"✅ Mobile: {form_data['mobile']}")
                    logger.info(f"✅ Mobile filled: {form_data['mobile']}")
                    
                    # Highlight the field
                    self.driver.execute_script("arguments[0].style.backgroundColor = '#d4edda'; arguments[0].style.border = '2px solid #28a745';", mobile_input)
                else:
                    filled_fields.append("❌ Mobile field not found")
                
                time.sleep(0.5)
                
            except Exception as e:
                logger.error(f"❌ Mobile error: {e}")
                filled_fields.append("❌ Mobile error")
            
            # 5. Fill Email
            try:
                logger.info("🔍 Looking for email field...")
                email_selectors = [
                    "input[type='email']",
                    "input[placeholder*='Email']",
                    "input[placeholder*='email']",
                    "input[name*='email']",
                    "input[id*='email']"
                ]
                
                email_input = None
                for selector in email_selectors:
                    try:
                        email_input = self.driver.find_element(By.CSS_SELECTOR, selector)
                        break
                    except NoSuchElementException:
                        continue
                
                # Fallback to fourth text input
                if not email_input:
                    text_inputs = self.driver.find_elements(By.CSS_SELECTOR, "input[type='text']")
                    if len(text_inputs) > 3:
                        email_input = text_inputs[3]
                
                if email_input and form_data.get('email'):
                    email_input.clear()
                    email_input.send_keys(form_data['email'])
                    filled_fields.append(f"✅ Email: {form_data['email']}")
                    logger.info(f"✅ Email filled: {form_data['email']}")
                    
                    # Highlight the field
                    self.driver.execute_script("arguments[0].style.backgroundColor = '#d4edda'; arguments[0].style.border = '2px solid #28a745';", email_input)
                else:
                    filled_fields.append("❌ Email field not found")
                
                time.sleep(0.5)
                
            except Exception as e:
                logger.error(f"❌ Email error: {e}")
                filled_fields.append("❌ Email error")
            
            # Take final screenshot
            self.driver.save_screenshot("torrent_form_filled.png")
            logger.info("📸 Final screenshot saved: torrent_form_filled.png")
            
            # Show success notification on the page
            success_count = len([f for f in filled_fields if f.startswith('✅')])
            
            notification_script = f"""
            const notification = document.createElement('div');
            notification.innerHTML = `
                <div style="position: fixed; top: 20px; right: 20px; background: #28a745; color: white; padding: 20px 30px; border-radius: 10px; font-family: Arial, sans-serif; font-size: 16px; z-index: 999999; box-shadow: 0 4px 20px rgba(0,0,0,0.3); max-width: 400px;">
                    <strong>🤖 RPA Auto-fill Completed!</strong><br>
                    Fields filled: {success_count}/5<br>
                    <small style="font-size: 14px; margin-top: 10px; display: block;">
                        RPA successfully filled the form fields.<br>
                        Please review and submit the form.
                    </small>
                </div>
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => {{
                if (notification.parentNode) {{
                    notification.parentNode.removeChild(notification);
                }}
            }}, 10000);
            """
            
            self.driver.execute_script(notification_script)
            
            logger.info(f"📊 Form filling completed: {success_count}/5 fields filled")
            
            return {
                "success": success_count > 0,
                "filled_fields": filled_fields,
                "total_filled": success_count,
                "total_fields": 5,
                "screenshots": ["torrent_page_loaded.png", "torrent_form_filled.png"]
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
    
    def keep_browser_open(self, duration=300):
        """Keep browser open for user interaction"""
        try:
            logger.info(f"🕐 Keeping browser open for {duration} seconds for user interaction...")
            logger.info("👤 User can now review the form and submit manually")
            
            # Show a message to user
            message_script = """
            alert('🎉 RPA Auto-fill Completed!\\n\\nThe form has been filled automatically.\\n\\nPlease review the data and click Submit to complete your application.\\n\\nThe browser will stay open for your convenience.');
            """
            self.driver.execute_script(message_script)
            
            # Keep browser open
            time.sleep(duration)
            
        except Exception as e:
            logger.error(f"❌ Error keeping browser open: {e}")
    
    def close_driver(self):
        """Close the browser driver"""
        try:
            if self.driver:
                self.driver.quit()
                logger.info("✅ Browser closed")
        except Exception as e:
            logger.error(f"❌ Error closing browser: {e}")
    
    def run_automation(self, form_data, keep_open=True):
        """Run the complete RPA automation"""
        try:
            logger.info("🚀 Starting Torrent Power RPA Automation...")
            
            # Setup driver
            if not self.setup_driver():
                return {"success": False, "error": "Failed to setup browser driver"}
            
            # Navigate to website
            if not self.navigate_to_torrent_power():
                return {"success": False, "error": "Failed to navigate to Torrent Power website"}
            
            # Fill form
            result = self.fill_form(form_data)
            
            if result["success"] and keep_open:
                # Keep browser open for user interaction
                self.keep_browser_open(300)  # 5 minutes
            
            return result
            
        except Exception as e:
            logger.error(f"❌ RPA automation failed: {e}")
            return {"success": False, "error": str(e)}
        finally:
            if not keep_open:
                self.close_driver()


# Test function
def test_rpa():
    """Test the RPA automation"""
    test_data = {
        "city": "Ahmedabad",
        "service_number": "TEST123456",
        "t_number": "T123456789",
        "mobile": "9876543210",
        "email": "test@example.com"
    }
    
    rpa = TorrentPowerRPA()
    result = rpa.run_automation(test_data, keep_open=True)
    
    print("🔍 RPA Test Results:")
    print(f"Success: {result.get('success')}")
    print(f"Fields filled: {result.get('total_filled', 0)}/5")
    
    if result.get('filled_fields'):
        print("Field Results:")
        for field in result['filled_fields']:
            print(f"  {field}")
    
    return result


if __name__ == "__main__":
    test_rpa()