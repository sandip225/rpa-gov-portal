#!/usr/bin/env python3
"""
Torrent Power RPA Service
Integrates Torrent Power automation with the backend API
"""
import time
import logging
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from typing import Dict, Any
import os
from .selenium_config import selenium_config

logger = logging.getLogger(__name__)

class TorrentPowerService:
    def __init__(self, headless=True):
        self.driver = None
        self.wait = None
        self.headless = headless
        
    def setup_driver(self):
        """Setup Chrome driver using selenium_config"""
        try:
            self.driver = selenium_config.create_driver(
                headless=self.headless, 
                stealth_mode=True, 
                undetected=False
            )
            
            # Configure for government sites
            selenium_config.configure_for_government_sites(self.driver)
            
            self.wait = WebDriverWait(self.driver, 20)
            logger.info("✅ Torrent Power driver setup completed")
            
        except Exception as e:
            logger.error(f"❌ Failed to setup driver: {e}")
            raise e
        
    def login(self, username, password):
        """Login to Torrent Power portal"""
        try:
            logger.info("🔐 Logging into Torrent Power portal...")
            
            # Navigate to login page
            self.driver.get("https://connect.torrentpower.com/tplcp/session/signin")
            time.sleep(3)
            
            # Take screenshot for debugging
            selenium_config.take_screenshot(self.driver, "torrent_login_page.png")
            
            # Find and fill username
            username_field = selenium_config.wait_for_element(
                self.driver, (By.NAME, "username"), timeout=15
            )
            if username_field:
                selenium_config.safe_send_keys(self.driver, username_field, username)
                logger.info("✅ Username filled")
            else:
                return {"success": False, "error": "Username field not found"}
            
            # Find and fill password
            password_field = selenium_config.wait_for_element(
                self.driver, (By.NAME, "password"), timeout=10
            )
            if password_field:
                selenium_config.safe_send_keys(self.driver, password_field, password)
                logger.info("✅ Password filled")
            else:
                return {"success": False, "error": "Password field not found"}
            
            # Handle captcha if present
            try:
                captcha_field = self.driver.find_element(By.NAME, "captcha")
                logger.warning("⚠️ Captcha detected - manual intervention required")
                selenium_config.take_screenshot(self.driver, "torrent_captcha_detected.png")
                return {"success": False, "error": "Captcha detected - manual intervention required"}
            except NoSuchElementException:
                logger.info("✅ No captcha detected")
            
            # Click login button
            login_button = selenium_config.wait_for_element(
                self.driver, (By.XPATH, "//button[@type='submit']"), timeout=10
            )
            if login_button:
                if selenium_config.safe_click(self.driver, login_button):
                    logger.info("✅ Login button clicked")
                else:
                    return {"success": False, "error": "Failed to click login button"}
            else:
                return {"success": False, "error": "Login button not found"}
            
            # Wait for dashboard to load
            try:
                self.wait.until(EC.url_contains("dashboard"))
                logger.info("✅ Login successful!")
                selenium_config.take_screenshot(self.driver, "torrent_dashboard.png")
                return {"success": True}
            except TimeoutException:
                selenium_config.take_screenshot(self.driver, "torrent_login_failed.png")
                return {"success": False, "error": "Login failed - dashboard not loaded"}
            
        except Exception as e:
            logger.error(f"❌ Login failed: {e}")
            selenium_config.take_screenshot(self.driver, "torrent_login_error.png")
            return {"success": False, "error": str(e)}
    
    def navigate_to_name_change(self):
        """Navigate to name change application"""
        try:
            logger.info("🧭 Navigating to name change application...")
            
            # Look for "Apply now" button on dashboard
            apply_buttons = self.driver.find_elements(By.XPATH, "//button[contains(text(), 'Apply now')]")
            if apply_buttons:
                if selenium_config.safe_click(self.driver, apply_buttons[0]):
                    logger.info("✅ Apply now button clicked")
                    time.sleep(2)
            
            # Navigate directly to name change URL
            name_change_url = "https://connect.torrentpower.com/tplcp/application/namechangerequest"
            logger.info(f"🔗 Navigating to: {name_change_url}")
            self.driver.get(name_change_url)
            time.sleep(3)
            
            # Take screenshot
            selenium_config.take_screenshot(self.driver, "torrent_name_change_form.png")
            
            # Check if we're on the right page
            current_url = self.driver.current_url
            if "namechangerequest" in current_url:
                logger.info("✅ Name change form loaded!")
                return {"success": True}
            else:
                logger.warning(f"⚠️ Unexpected URL: {current_url}")
                return {"success": True, "warning": f"Unexpected URL: {current_url}"}
            
        except Exception as e:
            logger.error(f"❌ Navigation failed: {e}")
            selenium_config.take_screenshot(self.driver, "torrent_navigation_error.png")
            return {"success": False, "error": str(e)}
    
    def fill_name_change_form(self, form_data):
        """Fill the name change form automatically"""
        try:
            logger.info("📝 Filling name change form...")
            filled_fields = 0
            
            # Multiple selector strategies for each field
            field_selectors = {
                'city': [
                    (By.NAME, "city"),
                    (By.ID, "city"),
                    (By.XPATH, "//select[contains(@name, 'city')]")
                ],
                'service_number': [
                    (By.NAME, "serviceNumber"),
                    (By.NAME, "service_number"),
                    (By.ID, "serviceNumber"),
                    (By.XPATH, "//input[contains(@name, 'service')]")
                ],
                'mobile': [
                    (By.NAME, "mobileNumber"),
                    (By.NAME, "mobile"),
                    (By.ID, "mobile"),
                    (By.XPATH, "//input[contains(@name, 'mobile')]")
                ],
                'email': [
                    (By.NAME, "email"),
                    (By.ID, "email"),
                    (By.XPATH, "//input[contains(@name, 'email')]")
                ],
                'old_name': [
                    (By.NAME, "oldName"),
                    (By.NAME, "currentName"),
                    (By.ID, "oldName"),
                    (By.XPATH, "//input[contains(@name, 'old') or contains(@name, 'current')]")
                ],
                'new_name': [
                    (By.NAME, "newName"),
                    (By.ID, "newName"),
                    (By.XPATH, "//input[contains(@name, 'new')]")
                ]
            }
            
            # Fill each field
            for field_name, selectors in field_selectors.items():
                if form_data.get(field_name):
                    field_found = False
                    
                    for selector in selectors:
                        try:
                            element = selenium_config.wait_for_element(self.driver, selector, timeout=5)
                            if element:
                                if field_name == 'city' and element.tag_name == 'select':
                                    # Handle dropdown
                                    try:
                                        select = Select(element)
                                        select.select_by_visible_text(form_data[field_name])
                                        logger.info(f"✅ {field_name} dropdown selected: {form_data[field_name]}")
                                        filled_fields += 1
                                        field_found = True
                                        break
                                    except:
                                        continue
                                else:
                                    # Handle text input
                                    if selenium_config.safe_send_keys(self.driver, element, form_data[field_name]):
                                        logger.info(f"✅ {field_name} filled: {form_data[field_name]}")
                                        filled_fields += 1
                                        field_found = True
                                        break
                        except:
                            continue
                    
                    if not field_found:
                        logger.warning(f"⚠️ {field_name} field not found")
            
            # Handle captcha
            try:
                captcha_field = self.driver.find_element(By.NAME, "captcha")
                logger.warning("⚠️ Captcha detected - manual intervention required")
                selenium_config.take_screenshot(self.driver, "torrent_form_captcha.png")
                return {"success": False, "error": "Captcha detected - manual intervention required"}
            except NoSuchElementException:
                logger.info("✅ No captcha detected")
            
            # Take final screenshot
            selenium_config.take_screenshot(self.driver, "torrent_form_filled.png")
            
            if filled_fields > 0:
                logger.info(f"✅ Form filled successfully! {filled_fields} fields completed")
                return {"success": True, "filled_fields": filled_fields}
            else:
                logger.warning("⚠️ No fields were filled")
                return {"success": False, "error": "No form fields found or filled"}
            
        except Exception as e:
            logger.error(f"❌ Form filling failed: {e}")
            selenium_config.take_screenshot(self.driver, "torrent_form_error.png")
            return {"success": False, "error": str(e)}
    
    def automate_name_change(self, login_data, form_data):
        """Complete automation flow"""
        try:
            logger.info("🚀 Starting Torrent Power name change automation...")
            
            # Setup driver
            self.setup_driver()
            
            # Step 1: Login
            login_result = self.login(login_data['username'], login_data['password'])
            if not login_result['success']:
                return login_result
            
            # Step 2: Navigate to name change
            nav_result = self.navigate_to_name_change()
            if not nav_result['success']:
                return nav_result
            
            # Step 3: Fill form
            fill_result = self.fill_name_change_form(form_data)
            if not fill_result['success']:
                return fill_result
            
            # Take screenshot for verification
            screenshot_path = f"screenshots/torrent_power_form_{int(time.time())}.png"
            os.makedirs("screenshots", exist_ok=True)
            self.driver.save_screenshot(screenshot_path)
            
            return {
                "success": True,
                "message": "Torrent Power name change form filled successfully",
                "screenshot": screenshot_path,
                "next_step": "Manual review and submission recommended",
                "website": "Torrent Power",
                "service": "Name Change"
            }
            
        except Exception as e:
            logger.error(f"Automation failed: {e}")
            return {"success": False, "error": str(e)}
        
        finally:
            self.cleanup()
    
    def cleanup(self):
        """Close browser and cleanup"""
        try:
            if self.driver:
                selenium_config.cleanup_driver(self.driver)
                self.driver = None
                logger.info("✅ Torrent Power service cleanup completed")
        except Exception as e:
            logger.error(f"❌ Cleanup error: {e}")

# Global service instance
torrent_power_service = TorrentPowerService(headless=True)  # Always headless for production