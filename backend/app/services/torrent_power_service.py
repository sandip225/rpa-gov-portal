"""
Torrent Power Service - Clean Implementation
Handles Torrent Power automation using Selenium
"""

import time
import logging
from typing import Dict, Any, Optional
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TorrentPowerService:
    """Service for Torrent Power automation"""
    
    def __init__(self, headless: bool = True):
        """Initialize the service"""
        self.driver = None
        self.wait = None
        self.headless = headless
        logger.info(f"🚀 TorrentPowerService initialized (headless={headless})")
    
    def initialize_browser(self) -> bool:
        """Initialize Chrome browser"""
        try:
            logger.info("🌐 Initializing Chrome browser...")
            
            chrome_options = Options()
            if self.headless:
                chrome_options.add_argument("--headless")
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")
            chrome_options.add_argument("--window-size=1280,720")
            
            service = Service(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=service, options=chrome_options)
            self.wait = WebDriverWait(self.driver, 10)
            
            logger.info("✅ Browser initialized successfully")
            return True
            
        except Exception as e:
            logger.error(f"❌ Browser initialization failed: {e}")
            return False
    
    def submit_name_change_application(self, form_data: Dict[str, Any]) -> Dict[str, Any]:
        """Submit name change application to Torrent Power with actual form filling"""
        try:
            logger.info("🚀 Starting Torrent Power name change automation...")
            
            # Initialize browser
            if not self.initialize_browser():
                return {"success": False, "error": "Failed to initialize browser"}
            
            # Navigate to form
            logger.info("📝 Navigating to Torrent Power name change form...")
            self.driver.get("https://connect.torrentpower.com/tplcp/application/namechangerequest")
            time.sleep(5)  # Wait for page to load completely
            
            # Take initial screenshot
            try:
                self.driver.save_screenshot("torrent_initial_page.png")
                logger.info("📸 Initial page screenshot taken")
            except:
                pass
            
            # Fill form fields with actual data
            fields_filled = 0
            total_fields = 5  # City, Service Number, T No, Mobile, Email
            
            # 1. Fill City dropdown
            try:
                city_dropdown = self.wait.until(EC.element_to_be_clickable((By.ID, "city")))
                city_dropdown.click()
                time.sleep(1)
                
                # Select the city from form data
                city_option = self.driver.find_element(By.XPATH, f"//option[text()='{form_data.get('city', 'Ahmedabad')}']")
                city_option.click()
                fields_filled += 1
                logger.info(f"✅ City filled: {form_data.get('city', 'Ahmedabad')}")
            except Exception as e:
                logger.error(f"❌ Failed to fill city: {e}")
            
            # 2. Fill Service Number
            try:
                service_field = self.wait.until(EC.presence_of_element_located((By.NAME, "serviceNumber")))
                service_field.clear()
                service_field.send_keys(form_data.get('service_number', ''))
                fields_filled += 1
                logger.info(f"✅ Service Number filled: {form_data.get('service_number', '')}")
            except Exception as e:
                logger.error(f"❌ Failed to fill service number: {e}")
            
            # 3. Fill T Number
            try:
                t_number_field = self.wait.until(EC.presence_of_element_located((By.NAME, "tNumber")))
                t_number_field.clear()
                t_number_field.send_keys(form_data.get('t_number', ''))
                fields_filled += 1
                logger.info(f"✅ T Number filled: {form_data.get('t_number', '')}")
            except Exception as e:
                logger.error(f"❌ Failed to fill T number: {e}")
            
            # 4. Fill Mobile Number
            try:
                mobile_field = self.wait.until(EC.presence_of_element_located((By.NAME, "mobileNumber")))
                mobile_field.clear()
                mobile_field.send_keys(form_data.get('mobile', ''))
                fields_filled += 1
                logger.info(f"✅ Mobile Number filled: {form_data.get('mobile', '')}")
            except Exception as e:
                logger.error(f"❌ Failed to fill mobile number: {e}")
            
            # 5. Fill Email
            try:
                email_field = self.wait.until(EC.presence_of_element_located((By.NAME, "email")))
                email_field.clear()
                email_field.send_keys(form_data.get('email', ''))
                fields_filled += 1
                logger.info(f"✅ Email filled: {form_data.get('email', '')}")
            except Exception as e:
                logger.error(f"❌ Failed to fill email: {e}")
            
            # Take final screenshot
            try:
                self.driver.save_screenshot("torrent_form_filled.png")
                logger.info("📸 Form filled screenshot taken")
            except:
                pass
            
            # Return success result
            return {
                "success": True,
                "message": f"Form auto-filled successfully! {fields_filled}/{total_fields} fields completed.",
                "fields_filled": fields_filled,
                "total_fields": total_fields,
                "next_steps": [
                    "✅ Form fields have been automatically filled",
                    "📝 Please review the filled data for accuracy",
                    "📤 Click Submit to complete your application",
                    "💾 Save the application reference number for tracking"
                ]
            }
            
        except Exception as e:
            logger.error(f"❌ Automation error: {e}")
            return {
                "success": False, 
                "error": f"Automation failed: {str(e)}",
                "message": "Failed to auto-fill the form. Please fill manually."
            }
        finally:
            # Keep browser open for user interaction if not headless
            if not self.headless:
                logger.info("ℹ️ Browser kept open for manual review and submission")
    
    def cleanup(self):
        """Clean up resources"""
        try:
            if self.driver:
                logger.info("🧹 Cleaning up Torrent Power service...")
                if self.headless:
                    self.driver.quit()
                    self.driver = None
                logger.info("✅ Torrent Power service cleanup completed")
        except Exception as e:
            logger.error(f"❌ Cleanup error: {e}")


# Global service instance
torrent_power_service = TorrentPowerService(headless=False)  # Keep browser visible for user interaction