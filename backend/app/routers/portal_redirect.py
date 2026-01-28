"""
Simple Portal Redirection API
Redirects users to official government and private portals
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import json
import os
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/portal", tags=["portal-redirect"])

class PortalRedirectRequest(BaseModel):
    supplier_id: str
    service_type: str = "name_change"  # "name_change", "address_change", "new_connection"
    user_data: Optional[Dict[str, Any]] = None

class PortalRedirectResponse(BaseModel):
    success: bool
    supplier_name: str
    portal_url: str
    service_url: Optional[str] = None
    offline_form_url: Optional[str] = None
    instructions: List[str]
    user_guidance: List[str]
    automation_available: bool = False

def load_services_data() -> Dict[str, Any]:
    """Load services data from JSON file"""
    try:
        # Try multiple possible paths
        possible_paths = [
            os.path.join(os.path.dirname(__file__), "../data/services_data.json"),
            "/app/app/data/services_data.json",
            "/app/data/services_data.json",
            "backend/app/data/services_data.json"
        ]
        
        for services_file in possible_paths:
            if os.path.exists(services_file):
                with open(services_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                logger.info(f"Services data loaded from: {services_file}")
                return data
        
        logger.error("Services data file not found in any expected location")
        return {}
        
    except Exception as e:
        logger.error(f"Error loading services data: {e}")
        return {}

@router.post("/redirect", response_model=PortalRedirectResponse)
async def get_portal_redirect(request: PortalRedirectRequest):
    """Get portal redirection information for a supplier"""
    try:
        # Load services data
        services_data = load_services_data()
        
        # Find supplier across all categories
        supplier = None
        category = None
        
        for cat, suppliers in services_data.items():
            for s in suppliers:
                if s.get('id') == request.supplier_id:
                    supplier = s
                    category = cat
                    break
            if supplier:
                break
        
        if not supplier:
            raise HTTPException(
                status_code=404, 
                detail=f"Supplier '{request.supplier_id}' not found"
            )
        
        # Get appropriate URL based on service type
        service_url = None
        if request.service_type == "name_change":
            service_url = supplier.get('name_change_url')
        elif request.service_type == "address_change":
            service_url = supplier.get('address_change_url')
        
        # Fallback to main portal URL
        portal_url = service_url or supplier.get('portal_url')
        
        if not portal_url:
            raise HTTPException(
                status_code=400,
                detail=f"No portal URL available for {supplier.get('name')}"
            )
        
        # Generate user guidance based on supplier type
        user_guidance = generate_user_guidance(supplier, request.service_type)
        
        # Generate instructions
        instructions = generate_instructions(supplier, request.service_type)
        
        return PortalRedirectResponse(
            success=True,
            supplier_name=supplier.get('name'),
            portal_url=portal_url,
            service_url=service_url,
            offline_form_url=supplier.get('offline_form_url'),
            instructions=instructions,
            user_guidance=user_guidance,
            automation_available=False  # Disabled for now
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Portal redirect failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

def generate_user_guidance(supplier: Dict[str, Any], service_type: str) -> List[str]:
    """Generate step-by-step user guidance"""
    guidance = []
    
    supplier_name = supplier.get('name', 'Supplier')
    automation_type = supplier.get('automation_type', 'manual_only')
    
    # Common first steps
    guidance.append(f"🌐 You will be redirected to {supplier_name} official portal")
    guidance.append("📋 Keep your documents ready (ID proof, current bill, etc.)")
    
    # Service-specific guidance
    if service_type == "name_change":
        guidance.extend([
            "📝 You will need to fill name change form",
            "📄 Upload required documents (marriage certificate, gazette notification, etc.)",
            "📱 Provide mobile number for OTP verification"
        ])
    elif service_type == "address_change":
        guidance.extend([
            "📝 You will need to fill address change form", 
            "📄 Upload address proof documents",
            "📍 Provide new service address details"
        ])
    
    # Portal-specific guidance
    if automation_type == "login_assisted":
        guidance.extend([
            "🔐 You will need to login to your account",
            "📱 Keep mobile ready for OTP verification",
            "🔍 Look for customer service or forms section"
        ])
    elif automation_type == "direct_form":
        guidance.extend([
            "📝 Form should be directly accessible",
            "✏️ Fill all required fields carefully",
            "✅ Review information before submitting"
        ])
    else:
        guidance.extend([
            "📞 You may need to contact customer service",
            "🏢 Office visit might be required",
            "📋 Download and fill offline forms if available"
        ])
    
    # Final steps
    guidance.extend([
        "💾 Save confirmation number after submission",
        "📧 Check email for acknowledgment",
        "📞 Follow up if needed"
    ])
    
    return guidance

def generate_instructions(supplier: Dict[str, Any], service_type: str) -> List[str]:
    """Generate specific instructions for the supplier"""
    instructions = []
    
    # Get facility information
    if service_type == "name_change":
        facility = supplier.get('name_change_facility', 'Available')
    else:
        facility = supplier.get('address_change_facility', 'Available')
    
    instructions.append(f"Service Availability: {facility}")
    
    # Add portal type information
    portal_type = supplier.get('type', 'government')
    instructions.append(f"Portal Type: {portal_type.title()}")
    
    # Add automation status
    automation_type = supplier.get('automation_type', 'manual_only')
    if automation_type == "direct_form":
        instructions.append("✅ Direct form access available")
    elif automation_type == "login_assisted":
        instructions.append("🔐 Login required for form access")
    else:
        instructions.append("📋 Manual process - office visit may be required")
    
    # Add online availability
    if supplier.get('online_available'):
        instructions.append("🌐 Online service available")
    else:
        instructions.append("🏢 Offline service only")
    
    return instructions

@router.get("/suppliers")
async def get_all_suppliers():
    """Get list of all suppliers with portal information"""
    try:
        services_data = load_services_data()
        suppliers = []
        
        for category, supplier_list in services_data.items():
            for supplier in supplier_list:
                suppliers.append({
                    "id": supplier.get('id'),
                    "name": supplier.get('name'),
                    "category": category,
                    "type": supplier.get('type'),
                    "portal_url": supplier.get('portal_url'),
                    "online_available": supplier.get('online_available', False),
                    "automation_type": supplier.get('automation_type', 'manual_only')
                })
        
        return {
            "suppliers": suppliers,
            "total_count": len(suppliers),
            "categories": list(services_data.keys())
        }
        
    except Exception as e:
        logger.error(f"Error getting suppliers: {e}")
        raise HTTPException(status_code=500, detail="Failed to get suppliers")

@router.get("/supplier/{supplier_id}/info")
async def get_supplier_portal_info(supplier_id: str):
    """Get detailed portal information for a specific supplier"""
    try:
        services_data = load_services_data()
        
        # Find supplier
        supplier = None
        category = None
        
        for cat, suppliers in services_data.items():
            for s in suppliers:
                if s.get('id') == supplier_id:
                    supplier = s
                    category = cat
                    break
            if supplier:
                break
        
        if not supplier:
            raise HTTPException(status_code=404, detail="Supplier not found")
        
        return {
            "supplier_id": supplier_id,
            "name": supplier.get('name'),
            "category": category,
            "type": supplier.get('type'),
            "portal_url": supplier.get('portal_url'),
            "name_change_url": supplier.get('name_change_url'),
            "address_change_url": supplier.get('address_change_url'),
            "offline_form_url": supplier.get('offline_form_url'),
            "online_available": supplier.get('online_available', False),
            "automation_type": supplier.get('automation_type', 'manual_only'),
            "name_change_facility": supplier.get('name_change_facility'),
            "address_change_facility": supplier.get('address_change_facility')
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting supplier info: {e}")
        raise HTTPException(status_code=500, detail=str(e))