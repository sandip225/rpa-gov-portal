#!/usr/bin/env python3
"""
Simple Torrent Gas PDF Form Automation
Easiest automation - just download and fill PDF form
"""
import time
import logging
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def simple_torrent_automation(form_data):
    """Simple Torrent Gas form download automation"""
    driver = None
    try:
        logger.info("🚀 Starting Simple Torrent Gas Automation...")
        
        # Chrome options for EC2
        chrome_options = Options()
        chrome_options.add_argument('--headless=new')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--window-size=1920,1080')
        chrome_options.binary_location = '/usr/bin/chromium'
        
        # Downloads directory
        downloads_dir = "/app/downloads"
        prefs = {
            "download.default_directory": downloads_dir,
            "download.prompt_for_download": False,
            "download.directory_upgrade": True
        }
        chrome_options.add_experimental_option("prefs", prefs)
        
        # Create driver
        service = Service('/usr/bin/chromedriver')
        driver = webdriver.Chrome(service=service, options=chrome_options)
        
        logger.info("✅ Chrome driver created successfully")
        
        # Step 1: Go to Torrent Gas main website
        logger.info("📱 Step 1: Opening Torrent Gas website...")
        driver.get("https://www.torrentgas.com")
        time.sleep(3)
        
        # Take screenshot of main page
        driver.save_screenshot("/app/screenshots/torrent_main.png")
        logger.info("📸 Main page screenshot saved")
        
        # Step 2: Look for forms or customer service section
        logger.info("🔍 Step 2: Looking for forms section...")
        
        try:
            # Look for common form links
            form_links = [
                "forms",
                "customer service",
                "name change",
                "transfer",
                "downloads"
            ]
            
            found_link = None
            for link_text in form_links:
                try:
                    link = driver.find_element(By.PARTIAL_LINK_TEXT, link_text)
                    if link.is_displayed():
                        found_link = link
                        logger.info(f"✅ Found link: {link_text}")
                        break
                except:
                    continue
            
            if found_link:
                found_link.click()
                time.sleep(3)
                driver.save_screenshot("/app/screenshots/torrent_forms.png")
                logger.info("📸 Forms page screenshot saved")
            
        except Exception as e:
            logger.warning(f"Forms section not found: {e}")
        
        # Step 3: Try direct PDF download URL
        logger.info("📄 Step 3: Trying direct PDF download...")
        pdf_url = "https://connect.torrentgas.com/attachments/static_content/download_page/Name_Transfer_Application_form_all_Locations_domestic.pdf"
        
        driver.get(pdf_url)
        time.sleep(5)  # Wait for download
        
        # Take screenshot of PDF page
        driver.save_screenshot("/app/screenshots/torrent_pdf.png")
        logger.info("📸 PDF page screenshot saved")
        
        # Step 4: Check if we can access the connect portal
        logger.info("🌐 Step 4: Checking connect portal...")
        driver.get("https://connect.torrentgas.com")
        time.sleep(3)
        
        page_title = driver.title
        current_url = driver.current_url
        
        driver.save_screenshot("/app/screenshots/torrent_connect.png")
        logger.info("📸 Connect portal screenshot saved")
        
        # Success result
        result = {
            "success": True,
            "message": "Torrent Gas automation completed successfully",
            "website": "Torrent Gas",
            "service": "Name Change Form",
            "page_title": page_title,
            "current_url": current_url,
            "screenshots": [
                "/app/screenshots/torrent_main.png",
                "/app/screenshots/torrent_forms.png", 
                "/app/screenshots/torrent_pdf.png",
                "/app/screenshots/torrent_connect.png"
            ],
            "form_data": form_data,
            "next_steps": [
                "✅ PDF form download attempted",
                "📋 Check downloads folder for PDF",
                "✏️ Fill PDF manually with provided data",
                "📧 Submit filled form to Torrent Gas",
                "📞 Follow up with customer service if needed"
            ],
            "automation_level": "Basic - PDF Download",
            "manual_steps_required": [
                "Fill downloaded PDF form",
                "Submit form via email/office"
            ]
        }
        
        logger.info("🎉 Torrent Gas automation completed!")
        return result
        
    except Exception as e:
        logger.error(f"❌ Torrent Gas automation failed: {e}")
        
        # Error screenshot
        error_screenshot = None
        try:
            error_screenshot = f"/app/screenshots/torrent_error_{int(time.time())}.png"
            if driver:
                driver.save_screenshot(error_screenshot)
        except:
            pass
        
        return {
            "success": False,
            "error": str(e),
            "message": f"Torrent Gas automation failed: {str(e)}",
            "website": "Torrent Gas",
            "screenshot_path": error_screenshot
        }
        
    finally:
        if driver:
            driver.quit()
            logger.info("🧹 Driver cleaned up")

# Test function
if __name__ == "__main__":
    test_data = {
        "consumer_number": "TG2025123456",
        "old_name": "Test User",
        "new_name": "New Test User",
        "mobile": "9876543210",
        "email": "test@example.com",
        "address": "Test Address, Gujarat"
    }
    
    result = simple_torrent_automation(test_data)
    print("🎯 AUTOMATION RESULT:")
    print("=" * 50)
    for key, value in result.items():
        print(f"{key}: {value}")