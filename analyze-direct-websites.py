#!/usr/bin/env python3
"""
Analyze Direct Access Websites for Name Change Forms
Test each website and extract actual form fields
"""
import sys
import os
sys.path.append('/app')

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
import time
import json

# Direct Access Websites for Name Change
DIRECT_WEBSITES = {
    "gujarat_gas": {
        "name": "Gujarat Gas Ltd",
        "url": "https://iconnect.gujaratgas.com/Portal/outer-service-request_template.aspx",
        "type": "gas"
    },
    "adani_gas": {
        "name": "Adani Total Gas Ltd", 
        "url": "https://www.adanigas.com/name-transfer",
        "type": "gas"
    },
    "torrent_gas": {
        "name": "Torrent Gas",
        "url": "https://www.torrentgas.com",
        "type": "gas"
    },
    "torrent_power": {
        "name": "Torrent Power",
        "url": "https://connect.torrentpower.com",
        "type": "electricity"
    },
    "anyror_gujarat": {
        "name": "AnyROR Gujarat",
        "url": "https://anyror.gujarat.gov.in",
        "type": "property"
    },
    "enagar_portal": {
        "name": "e-Nagar Portal",
        "url": "https://enagar.gujarat.gov.in",
        "type": "property"
    },
    "edhara_centers": {
        "name": "e-Dhara Centers",
        "url": "https://edhara.gujarat.gov.in",
        "type": "property"
    }
}

def setup_driver():
    """Setup Chrome driver for testing"""
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.add_argument('--window-size=1920,1080')
    
    try:
        service = Service('/usr/bin/chromedriver')
        driver = webdriver.Chrome(service=service, options=options)
        return driver
    except Exception as e:
        print(f"Failed to setup driver: {e}")
        return None

def analyze_form_fields(driver, url, website_name):
    """Analyze form fields on a website"""
    try:
        print(f"\n🔍 Analyzing {website_name}...")
        print(f"URL: {url}")
        
        driver.get(url)
        time.sleep(5)  # Wait for page load
        
        # Find all input fields
        inputs = driver.find_elements(By.TAG_NAME, "input")
        selects = driver.find_elements(By.TAG_NAME, "select")
        textareas = driver.find_elements(By.TAG_NAME, "textarea")
        
        fields = []
        
        # Analyze input fields
        for input_elem in inputs:
            field_info = {
                "tag": "input",
                "type": input_elem.get_attribute("type") or "text",
                "name": input_elem.get_attribute("name"),
                "id": input_elem.get_attribute("id"),
                "placeholder": input_elem.get_attribute("placeholder"),
                "class": input_elem.get_attribute("class"),
                "required": input_elem.get_attribute("required") is not None
            }
            if field_info["name"] or field_info["id"]:
                fields.append(field_info)
        
        # Analyze select fields
        for select_elem in selects:
            options = []
            option_elements = select_elem.find_elements(By.TAG_NAME, "option")
            for opt in option_elements:
                options.append({
                    "value": opt.get_attribute("value"),
                    "text": opt.text
                })
            
            field_info = {
                "tag": "select",
                "name": select_elem.get_attribute("name"),
                "id": select_elem.get_attribute("id"),
                "class": select_elem.get_attribute("class"),
                "required": select_elem.get_attribute("required") is not None,
                "options": options
            }
            if field_info["name"] or field_info["id"]:
                fields.append(field_info)
        
        # Analyze textarea fields
        for textarea_elem in textareas:
            field_info = {
                "tag": "textarea",
                "name": textarea_elem.get_attribute("name"),
                "id": textarea_elem.get_attribute("id"),
                "placeholder": textarea_elem.get_attribute("placeholder"),
                "class": textarea_elem.get_attribute("class"),
                "required": textarea_elem.get_attribute("required") is not None
            }
            if field_info["name"] or field_info["id"]:
                fields.append(field_info)
        
        print(f"✅ Found {len(fields)} form fields")
        
        # Look for submit buttons
        buttons = driver.find_elements(By.TAG_NAME, "button")
        submit_inputs = driver.find_elements(By.CSS_SELECTOR, "input[type='submit']")
        
        submit_buttons = []
        for btn in buttons + submit_inputs:
            submit_buttons.append({
                "tag": btn.tag_name,
                "type": btn.get_attribute("type"),
                "text": btn.text,
                "value": btn.get_attribute("value"),
                "class": btn.get_attribute("class")
            })
        
        return {
            "url": url,
            "accessible": True,
            "fields": fields,
            "submit_buttons": submit_buttons,
            "page_title": driver.title
        }
        
    except Exception as e:
        print(f"❌ Error analyzing {website_name}: {e}")
        return {
            "url": url,
            "accessible": False,
            "error": str(e),
            "fields": [],
            "submit_buttons": []
        }

def main():
    """Main analysis function"""
    driver = setup_driver()
    if not driver:
        print("❌ Failed to setup Chrome driver")
        return
    
    results = {}
    
    try:
        for website_id, website_info in DIRECT_WEBSITES.items():
            result = analyze_form_fields(
                driver, 
                website_info["url"], 
                website_info["name"]
            )
            result["type"] = website_info["type"]
            results[website_id] = result
            
            # Take screenshot
            try:
                screenshot_path = f"/app/screenshots/{website_id}_analysis.png"
                driver.save_screenshot(screenshot_path)
                result["screenshot"] = screenshot_path
                print(f"📸 Screenshot saved: {screenshot_path}")
            except:
                pass
    
    finally:
        driver.quit()
    
    # Save results
    output_file = "/app/direct_websites_analysis.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    print(f"\n📊 Analysis complete! Results saved to: {output_file}")
    
    # Print summary
    print("\n📋 SUMMARY:")
    print("=" * 50)
    
    for website_id, result in results.items():
        status = "✅ Accessible" if result["accessible"] else "❌ Not Accessible"
        field_count = len(result["fields"])
        print(f"{DIRECT_WEBSITES[website_id]['name']}: {status} ({field_count} fields)")
    
    # Identify common fields
    all_field_names = set()
    for result in results.values():
        if result["accessible"]:
            for field in result["fields"]:
                if field.get("name"):
                    all_field_names.add(field["name"].lower())
    
    print(f"\n🔧 Common field patterns found: {len(all_field_names)}")
    common_fields = sorted(list(all_field_names))
    for field in common_fields[:20]:  # Show first 20
        print(f"  - {field}")

if __name__ == "__main__":
    main()