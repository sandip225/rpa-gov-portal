#!/usr/bin/env python3
"""
Direct RPA test - bypasses the API to test the service directly
"""

import sys
sys.path.insert(0, 'backend')

from app.services.simple_rpa_service import SimpleTorrentRPA
import logging

# Setup logging to see all messages
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

def test_rpa():
    """Test RPA automation directly"""
    
    print("\n" + "="*60)
    print("  DIRECT RPA TEST")
    print("="*60 + "\n")
    
    try:
        # Test data
        test_data = {
            "city": "Ahmedabad",
            "service_number": "TEST123456",
            "t_number": "T123456789",
            "mobile": "9876543210",
            "email": "test@example.com"
        }
        
        print("📋 Test Data:")
        for key, value in test_data.items():
            print(f"   {key}: {value}")
        
        print("\n🤖 Initializing RPA...")
        rpa = SimpleTorrentRPA()
        
        print("🔧 Setting up Chrome driver...")
        if not rpa.setup_driver():
            print("❌ Driver setup failed!")
            return False
        
        print("✅ Driver setup successful!")
        print("🌐 Navigating to Torrent Power website...")
        
        if not rpa.navigate_to_torrent_power():
            print("❌ Navigation failed!")
            rpa.close_driver()
            return False
        
        print("✅ Navigation successful!")
        print("📝 Filling form...")
        
        result = rpa.fill_form(test_data)
        
        print("\n📊 RESULT:")
        print(f"   Success: {result.get('success')}")
        print(f"   Fields filled: {result.get('total_filled', 0)}/{result.get('total_fields', 0)}")
        
        if result.get('filled_fields'):
            print("\n   Field Details:")
            for field in result['filled_fields']:
                print(f"      {field}")
        
        if result.get('error'):
            print(f"\n   Error: {result['error']}")
        
        # Keep browser open for 10 seconds so you can see it
        print("\n🕐 Keeping browser open for 10 seconds...")
        import time
        time.sleep(10)
        
        rpa.close_driver()
        
        return result.get('success', False)
        
    except Exception as e:
        print(f"\n❌ TEST FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_rpa()
    
    print("\n" + "="*60)
    if success:
        print("  ✅ RPA TEST PASSED")
    else:
        print("  ❌ RPA TEST FAILED")
    print("="*60 + "\n")
    
    sys.exit(0 if success else 1)
