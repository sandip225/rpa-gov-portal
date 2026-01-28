"""
Selenium Configuration for RPA Automation
Optimized for EC2 Ubuntu environment
"""
import os
import time
import logging
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import undetected_chromedriver as uc
from fake_useragent import UserAgent

logger = logging.getLogger(__name__)

class SeleniumConfig:
    """Selenium configuration and driver management"""
    
    def __init__(self):
        self.driver = None
        self.wait = None
        
    def create_driver(self, headless=True, stealth_mode=True, undetected=False):
        """Create Chrome WebDriver with optimized settings for EC2"""
        try:
            if undetected:
                return self._create_undetected_driver(headless)
            else:
                return self._create_standard_driver(headless, stealth_mode)
                
        except Exception as e:
            logger.error(f"Failed to create WebDriver: {e}")
            raise e
    
    def _create_standard_driver(self, headless=True, stealth_mode=True):
        """Create standard Chrome driver"""
        chrome_options = Options()
        
        # Basic options
        if headless:
            chrome_options.add_argument('--headless=new')
        
        # EC2 optimized options
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--disable-extensions')
        chrome_options.add_argument('--disable-plugins')
        chrome_options.add_argument('--disable-images')
        chrome_options.add_argument('--disable-javascript')
        chrome_options.add_argument('--window-size=1920,1080')
        chrome_options.add_argument('--start-maximized')
        
        # Memory optimization
        chrome_options.add_argument('--memory-pressure-off')
        chrome_options.add_argument('--max_old_space_size=4096')
        chrome_options.add_argument('--disable-background-timer-throttling')
        chrome_options.add_argument('--disable-renderer-backgrounding')
        chrome_options.add_argument('--disable-backgrounding-occluded-windows')
        
        # Anti-detection options
        if stealth_mode:
            chrome_options.add_argument('--disable-blink-features=AutomationControlled')
            chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
            chrome_options.add_experimental_option('useAutomationExtension', False)
            
            # Random user agent
            ua = UserAgent()
            chrome_options.add_argument(f'--user-agent={ua.random}')
        
        # Prefs for better performance
        prefs = {
            "profile.default_content_setting_values": {
                "images": 2,  # Block images
                "plugins": 2,  # Block plugins
                "popups": 2,  # Block popups
                "geolocation": 2,  # Block location sharing
                "notifications": 2,  # Block notifications
                "media_stream": 2,  # Block media stream
            },
            "profile.managed_default_content_settings": {
                "images": 2
            }
        }
        chrome_options.add_experimental_option("prefs", prefs)
        
        # Create service
        try:
            # Try to use system Chrome first
            service = Service('/usr/bin/chromedriver')
        except:
            # Fallback to ChromeDriverManager
            service = Service(ChromeDriverManager().install())
        
        # Create driver
        driver = webdriver.Chrome(service=service, options=chrome_options)
        
        # Anti-detection script
        if stealth_mode:
            driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            driver.execute_cdp_cmd('Network.setUserAgentOverride', {
                "userAgent": driver.execute_script("return navigator.userAgent").replace("Headless", "")
            })
        
        return driver
    
    def _create_undetected_driver(self, headless=True):
        """Create undetected Chrome driver"""
        options = uc.ChromeOptions()
        
        if headless:
            options.add_argument('--headless=new')
        
        # EC2 optimized options
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--disable-gpu')
        options.add_argument('--window-size=1920,1080')
        
        # Create undetected driver
        driver = uc.Chrome(options=options, version_main=None)
        
        return driver
    
    def configure_for_government_sites(self, driver):
        """Configure driver specifically for government websites"""
        try:
            # Set timeouts
            driver.implicitly_wait(10)
            driver.set_page_load_timeout(30)
            
            # Set window size
            driver.set_window_size(1920, 1080)
            
            # Additional government site optimizations
            driver.execute_script("""
                // Disable image loading for faster page loads
                var style = document.createElement('style');
                style.innerHTML = 'img { display: none !important; }';
                document.head.appendChild(style);
            """)
            
            logger.info("Driver configured for government sites")
            
        except Exception as e:
            logger.warning(f"Failed to configure driver for government sites: {e}")
    
    def wait_for_element(self, driver, locator, timeout=10):
        """Wait for element to be present and visible"""
        try:
            wait = WebDriverWait(driver, timeout)
            element = wait.until(EC.presence_of_element_located(locator))
            return element
        except Exception as e:
            logger.error(f"Element not found: {locator}, Error: {e}")
            return None
    
    def safe_click(self, driver, element):
        """Safe click with multiple strategies"""
        try:
            # Scroll to element
            driver.execute_script("arguments[0].scrollIntoView(true);", element)
            time.sleep(0.5)
            
            # Try regular click
            try:
                element.click()
                return True
            except:
                pass
            
            # Try JavaScript click
            try:
                driver.execute_script("arguments[0].click();", element)
                return True
            except:
                pass
            
            # Try ActionChains click
            try:
                from selenium.webdriver.common.action_chains import ActionChains
                ActionChains(driver).move_to_element(element).click().perform()
                return True
            except:
                pass
            
            return False
            
        except Exception as e:
            logger.error(f"Failed to click element: {e}")
            return False
    
    def safe_send_keys(self, driver, element, text, clear_first=True):
        """Safe send keys with human-like typing"""
        try:
            if clear_first:
                element.clear()
                time.sleep(0.2)
            
            # Human-like typing
            for char in text:
                element.send_keys(char)
                time.sleep(0.05)  # Small delay between characters
            
            time.sleep(0.3)
            return True
            
        except Exception as e:
            logger.error(f"Failed to send keys: {e}")
            return False
    
    def take_screenshot(self, driver, filename=None):
        """Take screenshot for debugging"""
        try:
            if not filename:
                filename = f"screenshot_{int(time.time())}.png"
            
            # Ensure screenshots directory exists
            os.makedirs("screenshots", exist_ok=True)
            filepath = os.path.join("screenshots", filename)
            
            driver.save_screenshot(filepath)
            logger.info(f"Screenshot saved: {filepath}")
            return filepath
            
        except Exception as e:
            logger.error(f"Failed to take screenshot: {e}")
            return None
    
    def cleanup_driver(self, driver):
        """Safely cleanup driver"""
        try:
            if driver:
                driver.quit()
                logger.info("Driver cleaned up successfully")
        except Exception as e:
            logger.error(f"Error cleaning up driver: {e}")

# Global selenium config instance
selenium_config = SeleniumConfig()