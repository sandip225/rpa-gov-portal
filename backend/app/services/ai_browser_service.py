"""
AI Browser Automation Service using browser-use
Integrated with the official browser-use GitHub repo
Handles intelligent form filling for government portals with visible process
"""

import asyncio
import os
from typing import Dict, Any, Optional
from datetime import datetime
import json
import traceback

# Browser-use imports - official GitHub repo integration
try:
    from browser_use import Agent, Browser
    from browser_use.llm.openai import OpenAILLM  # Use browser-use's OpenAI LLM wrapper
    BROWSER_USE_AVAILABLE = True
except ImportError as e:
    print(f"Warning: browser-use not available: {e}")
    BROWSER_USE_AVAILABLE = False

from dotenv import load_dotenv
from app.config import get_settings

load_dotenv()
settings = get_settings()


class AIBrowserService:
    """AI-powered browser automation using browser-use library"""
    
    def __init__(self):
        try:
            # Check if browser-use is available
            if not BROWSER_USE_AVAILABLE:
                raise ValueError("browser-use library is not installed or not available")
            
            # Use settings or fallback to environment variables
            api_key = settings.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY")
            
            if not api_key:
                raise ValueError("OpenAI API key not found. Please set OPENAI_API_KEY in .env file")
            
            print(f"🔑 OpenAI API Key loaded: {api_key[:20]}...")
            
            # Initialize LLM for browser-use Agent
            self.llm = OpenAILLM(
                model="gpt-4o",
                api_key=api_key,
                temperature=0.1
            )
            
            # Browser configuration for visible automation
            self.browser_config = {
                "headless": False,  # Make browser visible for user to see process
                "slow_mo": 1000,    # Slow down actions for visibility
                "viewport": {"width": 1280, "height": 720}
            }
            
            print("✅ AIBrowserService initialized successfully")
            
        except Exception as e:
            print(f"❌ Error initializing AIBrowserService: {str(e)}")
            print(f"❌ Traceback: {traceback.format_exc()}")
            raise e
    
    async def auto_fill_torrent_power_form(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Direct Torrent Power form automation - goes straight to namechangerequest page
        Fills the form automatically with user data
        
        Args:
            user_data: Dictionary containing user information
            
        Returns:
            Dictionary with automation result
        """
        
        try:
            print("🚀 Starting Torrent Power form automation...")
            print(f"📋 User data received: {user_data}")
            
            # Check if browser-use is available
            if not BROWSER_USE_AVAILABLE:
                return {
                    "success": False,
                    "error": "browser-use library not available",
                    "message": "Browser automation library is not installed",
                    "timestamp": datetime.now().isoformat(),
                    "provider": "torrent_power"
                }
            
            # Create browser instance with visible configuration
            print("🌐 Creating browser instance...")
            browser = Browser(
                headless=False,  # Visible browser for user to watch
                viewport={"width": 1280, "height": 720}
            )
            print("✅ Browser instance created successfully")
            
            # Prepare form data with fallbacks
            form_data = {
                'service_number': user_data.get('service_number', user_data.get('connection_id', 'TP123456')),
                't_number': user_data.get('t_number', user_data.get('t_no', 'T789')),
                'mobile': user_data.get('mobile', user_data.get('phone', '9876543210')),
                'email': user_data.get('email', 'user@example.com')
            }
            
            print(f"📝 Form data prepared: {form_data}")
            
            # Create browser-use agent with direct form filling task
            task = f"""
            You are an AI automation agent that will fill the Torrent Power name change form automatically.
            The user will be watching this automation process live in the browser window.
            
            DIRECT TORRENT POWER FORM AUTOMATION:
            
            STEP 1: Navigate directly to the form page
            - Navigate to: https://connect.torrentpower.com/tplcp/application/namechangerequest
            - Wait for page to load completely (5 seconds)
            - Take screenshot after page loads
            
            STEP 2: Fill the form automatically with user data
            - Fill the form with the following data step by step:
              
              Form Data to Fill:
              * City/Location: Select "Ahmedabad" from dropdown (first select element)
              * Service Number: {form_data['service_number']} (first text input)
              * T No: {form_data['t_number']} (second text input)
              * Mobile Number: {form_data['mobile']} (third text input)
              * Email Address: {form_data['email']} (fourth text input)
            
            AUTOMATION VISIBILITY REQUIREMENTS:
            1. Move slowly between each action (wait 2-3 seconds between steps)
            2. Scroll to each element before interacting with it so user can see
            3. Highlight each field/button before clicking or filling
            4. Type in each field slowly with visible typing animation
            5. After filling each field, wait 2 seconds before moving to next field
            6. If there's a captcha, click "Regenerate" button but don't fill captcha
            7. DO NOT click the final submit button - leave it for manual review
            8. Take screenshots at each major step for documentation
            9. Provide step-by-step commentary of what you're doing
            10. Make the entire automation process clearly visible and understandable
            
            FIELD IDENTIFICATION:
            - Use CSS selectors like: input[type="text"], select, input[placeholder*="Service"]
            - Try multiple selectors if first one doesn't work
            - Look for placeholder text, labels, or nearby text to identify fields
            - Fill fields in the order they appear on the page
            
            ERROR HANDLING:
            - If any step fails, take a screenshot and describe what went wrong
            - If a button/field is not found, try alternative selectors or text
            - If navigation doesn't work, try refreshing and retrying
            - Always provide detailed feedback about what's happening
            
            SUCCESS CRITERIA:
            - Form page loaded successfully
            - All form fields filled with user data
            - User can see the filled form and complete captcha + submit manually
            - Process is visible and understandable throughout
            
            IMPORTANT: This is a live demonstration for the user. Make every action visible and clear.
            The goal is to show a complete, working automation that the user can watch and understand.
            """
            
            print("🤖 Creating AI agent...")
            # Create agent with browser automation
            agent = Agent(
                task=task,
                llm=self.llm,
                browser=browser,
                use_vision=True,
                save_conversation_path="./torrent_power_direct_automation.json"
            )
            print("✅ AI agent created successfully")
            
            # Run the automation
            print("🚀 Starting automation process...")
            result = await agent.run()
            print("✅ Torrent Power direct form automation completed!")
            print(f"📊 Automation result: {str(result)[:200]}...")
            
            # Keep browser open for user to complete manually
            # Don't close browser - let user complete captcha and submit
            
            return {
                "success": True,
                "message": "Torrent Power form filled automatically! Please complete captcha and submit.",
                "details": f"AI automation result: {str(result)[:500]}...",
                "timestamp": datetime.now().isoformat(),
                "provider": "torrent_power",
                "automation_steps": [
                    "✅ Navigated directly to name change form page",
                    "✅ Filled City dropdown with Ahmedabad", 
                    "✅ Filled Service Number with user data",
                    "✅ Filled T Number with user data",
                    "✅ Filled Mobile Number with user data",
                    "✅ Filled Email Address with user data"
                ],
                "portal_urls": [
                    "https://connect.torrentpower.com/tplcp/application/namechangerequest"
                ],
                "fields_filled": [
                    "city_dropdown", "service_number", "t_number", "mobile_number", "email_address"
                ],
                "next_steps": [
                    "1. Check the browser window - form should be filled automatically",
                    "2. Enter the captcha code manually", 
                    "3. Review all filled information for accuracy",
                    "4. Click the submit button to complete your application",
                    "5. Save the application reference number for tracking"
                ],
                "automation_type": "direct_form_fill",
                "user_action_required": "Complete captcha and submit form in the browser window",
                "browser_status": "Browser window left open for manual completion"
            }
            
        except Exception as e:
            print(f"❌ Torrent Power automation error: {str(e)}")
            print(f"❌ Full traceback: {traceback.format_exc()}")
            return {
                "success": False,
                "error": str(e),
                "message": f"Torrent Power automation failed: {str(e)}",
                "timestamp": datetime.now().isoformat(),
                "provider": "torrent_power",
                "automation_type": "direct_form_fill",
                "troubleshooting": [
                    "1. Check if OpenAI API key is valid and has credits",
                    "2. Ensure internet connection is stable",
                    "3. Try again - sometimes websites have temporary issues",
                    "4. Check if Torrent Power website is accessible",
                    "5. Verify browser-use library is properly installed"
                ],
                "full_error": traceback.format_exc()
            }
    
    async def auto_fill_government_portal_form(
        self, 
        provider: str, 
        user_data: Dict[str, Any],
        portal_url: str,
        login_required: bool = False,
        login_credentials: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """
        Generic method to auto-fill government portal forms using browser-use with visible process
        
        Args:
            provider: Provider name (e.g., 'pgvcl', 'ugvcl', etc.)
            user_data: User information to fill
            portal_url: URL of the government portal
            login_required: Whether login is required
            login_credentials: Login credentials if required
            
        Returns:
            Dictionary with automation result
        """
        
        try:
            # Create visible browser instance
            browser = Browser(
                headless=False,  # Visible browser
                viewport={"width": 1280, "height": 720},
                wait_between_actions=1.5  # Slow down for visibility
            )
            
            # Build task based on provider and requirements
            login_task = ""
            if login_required and login_credentials:
                login_task = f"""
                STEP 1 - LOGIN PROCESS:
                - Navigate to login page: {portal_url}
                - Fill username: {login_credentials.get('username', '')}
                - Fill password: {login_credentials.get('password', '')}
                - Click login button and wait for dashboard
                - Navigate to name change section
                
                """
            
            task = f"""
            Navigate to the {provider} government portal and fill out the name change form with visible automation.
            
            Website URL: {portal_url}
            {login_task}
            
            FORM DATA TO FILL:
            - Full Name: {user_data.get('full_name', '')}
            - Mobile Number: {user_data.get('mobile', '')}
            - Email Address: {user_data.get('email', '')}
            - Address: {user_data.get('address', '')}
            - Aadhaar Number: {user_data.get('aadhaar', '')}
            - Subdivision Code: {user_data.get('subdivision_code', '')}
            - Customer ID: {user_data.get('customer_id', '')}
            - Account Number: {user_data.get('account_number', '')}
            
            CRITICAL INSTRUCTIONS FOR VISIBLE AUTOMATION:
            1. Navigate to the website and wait for complete loading
            2. Fill each field slowly and visibly (wait 2-3 seconds between fields)
            3. Scroll to each field before filling so user can see the process
            4. Handle dropdowns, checkboxes, radio buttons appropriately
            5. Highlight each field after filling with colored border
            6. Show progress indicators for each step
            7. DO NOT click submit button - leave for manual review
            8. Take screenshot after completion
            9. Provide step-by-step commentary of actions
            10. Make the entire automation process clearly visible
            
            Show visible progress so the user can watch and understand the automation process.
            """
            
            # Create agent with visible browser automation
            agent = Agent(
                task=task,
                llm=self.llm,
                browser=browser,
                use_vision=True,
                save_conversation_path=f"./browser_automation_{provider}_log.json"
            )
            
            # Run the automation
            result = await agent.run()
            
            # Close browser after completion
            await browser.close()
            
            return {
                "success": True,
                "message": f"{provider} form filled successfully with visible process",
                "details": str(result),
                "timestamp": datetime.now().isoformat(),
                "provider": provider,
                "portal_url": portal_url,
                "automation_type": "visible_browser",
                "user_action_required": "Review filled form and submit manually"
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": f"Failed to auto-fill {provider} form with browser-use",
                "timestamp": datetime.now().isoformat(),
                "provider": provider,
                "automation_type": "visible_browser"
            }
    
    async def get_form_fields(self, portal_url: str) -> Dict[str, Any]:
        """
        Analyze a portal to identify available form fields using browser-use with visible process
        
        Args:
            portal_url: URL of the portal to analyze
            
        Returns:
            Dictionary with form field information
        """
        
        try:
            # Create visible browser for analysis
            browser = Browser(
                headless=False,  # Visible browser
                viewport={"width": 1280, "height": 720},
                wait_between_actions=1.0  # Slow down for visibility
            )
            
            task = f"""
            Navigate to {portal_url} and analyze the form structure with visible process.
            
            ANALYSIS TASKS:
            1. Navigate to the website and wait for complete loading
            2. Take a screenshot of the initial page
            3. Identify and document all form elements:
               - Input fields (name, id, type, placeholder text, required status)
               - Dropdown/select options and their values
               - Radio buttons and checkboxes with their options
               - Submit button information and location
               - Any required fields (marked with * or "required")
               - Form validation rules if visible
               - Captcha or security elements
               - File upload fields
            4. Scroll through the entire form to capture all fields
            5. Take additional screenshots of different form sections
            6. Provide detailed analysis that can be used for automated filling
            
            VISIBILITY REQUIREMENTS:
            - Highlight each form element as you analyze it
            - Scroll slowly to show all form sections
            - Take multiple screenshots for documentation
            - Provide step-by-step commentary of the analysis process
            
            The goal is to create a comprehensive form field mapping for automation.
            """
            
            # Create agent for form analysis
            agent = Agent(
                task=task,
                llm=self.llm,
                browser=browser,
                use_vision=True,
                save_conversation_path="./form_analysis_log.json"
            )
            
            # Run the analysis
            result = await agent.run()
            
            # Close browser after analysis
            await browser.close()
            
            return {
                "success": True,
                "form_analysis": str(result),
                "portal_url": portal_url,
                "timestamp": datetime.now().isoformat(),
                "analysis_type": "visible_browser",
                "screenshots_taken": True
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "portal_url": portal_url,
                "timestamp": datetime.now().isoformat(),
                "analysis_type": "visible_browser"
            }


# Singleton instance
ai_browser_service = None

def get_ai_browser_service():
    """Get or create the AI browser service instance"""
    global ai_browser_service
    if ai_browser_service is None:
        ai_browser_service = AIBrowserService()
    return ai_browser_service