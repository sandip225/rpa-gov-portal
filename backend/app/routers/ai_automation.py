"""
AI Automation API endpoints
Handles browser automation requests for government portals
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
import asyncio
import os
from datetime import datetime

from app.services.ai_browser_service import get_ai_browser_service
from app.auth import get_current_user
from app.models import User

router = APIRouter(prefix="/api/ai-automation", tags=["AI Automation"])


class AutomationRequest(BaseModel):
    """Request model for form automation"""
    provider: str
    service_type: str  # 'name_change', 'new_connection', etc.
    user_data: Dict[str, Any]
    portal_url: Optional[str] = None
    login_required: Optional[bool] = False
    login_credentials: Optional[Dict[str, str]] = None


class AutomationResponse(BaseModel):
    """Response model for automation results"""
    success: bool
    message: str
    details: Optional[str] = None
    timestamp: str
    provider: str
    portal_url: Optional[str] = None
    error: Optional[str] = None


class FormAnalysisRequest(BaseModel):
    """Request model for form analysis"""
    portal_url: str
    provider: str


# Store automation results temporarily (in production, use Redis or database)
automation_results = {}


@router.post("/start-torrent-power", response_model=AutomationResponse)
async def start_torrent_power_automation(
    request: AutomationRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
):
    """
    Start AI automation for Torrent Power name change form
    """
    
    try:
        print("🚀 Received Torrent Power automation request")
        print(f"📋 Request data: {request.dict()}")
        
        # Validate required fields for Torrent Power - more flexible validation
        user_data = request.user_data
        print(f"👤 User data: {user_data}")
        
        # Check if we have at least some basic data
        if not user_data:
            raise HTTPException(
                status_code=400,
                detail="User data is required for automation"
            )
        
        # Start automation directly (not in background for better error handling)
        print("🤖 Starting AI browser service...")
        ai_service = get_ai_browser_service()
        print("✅ AI browser service obtained")
        
        print("🚀 Running Torrent Power automation...")
        result = await ai_service.auto_fill_torrent_power_form(user_data)
        print(f"📊 Automation result: {result}")
        
        if result.get("success"):
            return AutomationResponse(
                success=True,
                message=result.get("message", "Torrent Power automation completed successfully"),
                timestamp=datetime.now().isoformat(),
                provider="torrent_power",
                portal_url="https://connect.torrentpower.com/tplcp/application/namechangerequest",
                details=result.get("details", "Form filled automatically")
            )
        else:
            return AutomationResponse(
                success=False,
                message=result.get("message", "Automation failed"),
                timestamp=datetime.now().isoformat(),
                provider="torrent_power",
                portal_url="https://connect.torrentpower.com/tplcp/application/namechangerequest",
                error=result.get("error", "Unknown error"),
                details=result.get("full_error", "")
            )
        
    except Exception as e:
        print(f"❌ Router error: {str(e)}")
        import traceback
        print(f"❌ Full traceback: {traceback.format_exc()}")
        
        return AutomationResponse(
            success=False,
            message=f"Failed to start automation: {str(e)}",
            timestamp=datetime.now().isoformat(),
            provider="torrent_power",
            error=str(e),
            details=traceback.format_exc()
        )


@router.post("/start-government-portal", response_model=AutomationResponse)
async def start_government_portal_automation(
    request: AutomationRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
):
    """
    Start AI automation for government portals (PGVCL, UGVCL, etc.)
    """
    
    try:
        # Validate required fields
        if not request.portal_url:
            raise HTTPException(status_code=400, detail="Portal URL is required")
        
        # Government portals typically require these fields
        required_fields = ['full_name', 'mobile', 'aadhaar']
        missing_fields = [field for field in required_fields if not request.user_data.get(field)]
        
        if missing_fields:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required fields: {', '.join(missing_fields)}"
            )
        
        # Start automation in background
        task_id = f"{request.provider}_{current_user.id}_{datetime.now().timestamp()}"
        
        async def run_automation():
            ai_service = get_ai_browser_service()
            result = await ai_service.auto_fill_government_portal_form(
                provider=request.provider,
                user_data=request.user_data,
                portal_url=request.portal_url,
                login_required=request.login_required,
                login_credentials=request.login_credentials
            )
            automation_results[task_id] = result
        
        background_tasks.add_task(run_automation)
        
        return AutomationResponse(
            success=True,
            message=f"{request.provider} automation started - form will be filled automatically",
            timestamp=datetime.now().isoformat(),
            provider=request.provider,
            portal_url=request.portal_url,
            details=f"Task ID: {task_id}"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status/{task_id}")
async def get_automation_status(
    task_id: str,
    current_user: User = Depends(get_current_user)
):
    """
    Get the status of an automation task
    """
    
    if task_id not in automation_results:
        return {
            "status": "running",
            "message": "Automation is still in progress",
            "timestamp": datetime.now().isoformat()
        }
    
    result = automation_results[task_id]
    
    # Clean up completed task
    del automation_results[task_id]
    
    return {
        "status": "completed",
        "result": result,
        "timestamp": datetime.now().isoformat()
    }


@router.post("/analyze-form")
async def analyze_form_structure(
    request: FormAnalysisRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Analyze a government portal form to understand its structure
    """
    
    try:
        ai_service = get_ai_browser_service()
        result = await ai_service.get_form_fields(request.portal_url)
        
        return {
            "success": True,
            "provider": request.provider,
            "analysis": result,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/supported-providers")
async def get_supported_providers():
    """
    Get list of supported providers and their requirements
    """
    
    providers = {
        "torrent_power": {
            "name": "Torrent Power",
            "type": "private",
            "portal_url": "https://connect.torrentpower.com/tplcp/application/namechangerequest",
            "login_required": False,
            "aiSupported": True,  # Enable AI support
            "required_fields": [
                "connection_id",
                "current_name", 
                "new_name",
                "mobile"
            ],
            "optional_fields": [
                "email",
                "address",
                "reason"
            ]
        },
        "pgvcl": {
            "name": "PGVCL",
            "type": "government",
            "portal_url": "https://portal.guvnl.in/login.php",
            "login_required": True,
            "required_fields": [
                "full_name",
                "mobile",
                "aadhaar",
                "subdivision_code"
            ],
            "optional_fields": [
                "email",
                "address"
            ]
        },
        "ugvcl": {
            "name": "UGVCL", 
            "type": "government",
            "portal_url": "https://portal.guvnl.in/login.php",
            "login_required": True,
            "required_fields": [
                "full_name",
                "mobile",
                "aadhaar",
                "subdivision_code"
            ],
            "optional_fields": [
                "email",
                "address"
            ]
        },
        "adani_gas": {
            "name": "Adani Total Gas",
            "type": "private",
            "portal_url": "https://www.adanigas.com/name-transfer",
            "login_required": False,
            "required_fields": [
                "customer_id",
                "current_name",
                "new_name",
                "mobile"
            ],
            "optional_fields": [
                "email",
                "address",
                "account_number"
            ]
        }
    }
    
    return {
        "success": True,
        "providers": providers,
        "total_count": len(providers),
        "timestamp": datetime.now().isoformat()
    }


@router.post("/test-connection")
async def test_browser_connection():
    """
    Test if browser-use automation is working with visible browser
    """
    
    try:
        # Test browser-use with visible browser
        from browser_use import Browser, Agent
        from browser_use.llm.openai import OpenAILLM  # Use browser-use's OpenAI LLM wrapper
        
        # Create visible browser for testing
        browser = Browser(
            headless=False,  # Visible browser for testing
            viewport={"width": 1280, "height": 720}
        )
        
        # Simple test task
        llm = OpenAILLM(
            model="gpt-4o", 
            api_key=os.getenv("OPENAI_API_KEY"),
            temperature=0.1
        )
        
        agent = Agent(
            task="Navigate to Google.com, take a screenshot, and report the page title",
            llm=llm,
            browser=browser,
            use_vision=True
        )
        
        # Run test automation
        result = await agent.run()
        
        # Close browser
        await browser.close()
        
        return {
            "success": True,
            "message": "Browser-use automation is working with visible browser",
            "test_result": f"Successfully tested browser automation: {str(result)[:200]}...",
            "timestamp": datetime.now().isoformat(),
            "browser_type": "visible",
            "automation_library": "browser-use"
        }
        
    except Exception as e:
        import traceback
        return {
            "success": False,
            "error": str(e),
            "message": "Browser-use automation test failed",
            "timestamp": datetime.now().isoformat(),
            "browser_type": "visible",
            "automation_library": "browser-use",
            "full_error": traceback.format_exc()
        }