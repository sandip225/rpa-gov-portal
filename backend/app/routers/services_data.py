"""
Services Data API Router
Provides access to supplier information and portal URLs
"""
from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List, Optional
import json
import os
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/services", tags=["services-data"])

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

@router.get("/data")
async def get_all_services_data():
    """Get all services data"""
    try:
        data = load_services_data()
        return data
    except Exception as e:
        logger.error(f"Error getting services data: {e}")
        raise HTTPException(status_code=500, detail="Failed to load services data")

@router.get("/supplier/{supplier_id}")
async def get_supplier_info(supplier_id: str):
    """Get information for a specific supplier"""
    try:
        data = load_services_data()
        
        # Search across all categories
        for category, suppliers in data.items():
            for supplier in suppliers:
                if supplier.get('id') == supplier_id:
                    return {
                        "supplier": supplier,
                        "category": category
                    }
        
        raise HTTPException(status_code=404, detail=f"Supplier '{supplier_id}' not found")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting supplier info: {e}")
        raise HTTPException(status_code=500, detail="Failed to get supplier information")

@router.get("/category/{category}")
async def get_suppliers_by_category(category: str):
    """Get all suppliers in a specific category"""
    try:
        data = load_services_data()
        
        if category not in data:
            raise HTTPException(status_code=404, detail=f"Category '{category}' not found")
        
        return {
            "category": category,
            "suppliers": data[category],
            "count": len(data[category])
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting category data: {e}")
        raise HTTPException(status_code=500, detail="Failed to get category data")

@router.get("/automation-capable")
async def get_automation_capable_suppliers():
    """Get suppliers that support automation"""
    try:
        data = load_services_data()
        automation_suppliers = []
        
        for category, suppliers in data.items():
            for supplier in suppliers:
                if supplier.get('rpa_enabled') or supplier.get('automation_type') in ['direct_form', 'login_assisted']:
                    automation_suppliers.append({
                        **supplier,
                        "category": category
                    })
        
        return {
            "automation_capable_suppliers": automation_suppliers,
            "count": len(automation_suppliers),
            "categories": {
                "direct_form": len([s for s in automation_suppliers if s.get('automation_type') == 'direct_form']),
                "login_assisted": len([s for s in automation_suppliers if s.get('automation_type') == 'login_assisted']),
                "total": len(automation_suppliers)
            }
        }
        
    except Exception as e:
        logger.error(f"Error getting automation capable suppliers: {e}")
        raise HTTPException(status_code=500, detail="Failed to get automation data")

@router.get("/portal-urls/{supplier_id}")
async def get_supplier_portal_urls(supplier_id: str):
    """Get all portal URLs for a specific supplier"""
    try:
        data = load_services_data()
        
        # Find supplier
        supplier = None
        category = None
        for cat, suppliers in data.items():
            for s in suppliers:
                if s.get('id') == supplier_id:
                    supplier = s
                    category = cat
                    break
            if supplier:
                break
        
        if not supplier:
            raise HTTPException(status_code=404, detail=f"Supplier '{supplier_id}' not found")
        
        urls = {
            "supplier_id": supplier_id,
            "supplier_name": supplier.get('name'),
            "category": category,
            "portal_url": supplier.get('portal_url'),
            "name_change_url": supplier.get('name_change_url'),
            "address_change_url": supplier.get('address_change_url'),
            "offline_form_url": supplier.get('offline_form_url'),
            "online_available": supplier.get('online_available', False),
            "automation_type": supplier.get('automation_type'),
            "login_required": supplier.get('login_required', False)
        }
        
        return urls
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting portal URLs: {e}")
        raise HTTPException(status_code=500, detail="Failed to get portal URLs")

@router.get("/search")
async def search_suppliers(q: str):
    """Search suppliers by name or ID"""
    try:
        data = load_services_data()
        results = []
        
        query = q.lower()
        
        for category, suppliers in data.items():
            for supplier in suppliers:
                name = supplier.get('name', '').lower()
                supplier_id = supplier.get('id', '').lower()
                
                if query in name or query in supplier_id:
                    results.append({
                        **supplier,
                        "category": category
                    })
        
        return {
            "query": q,
            "results": results,
            "count": len(results)
        }
        
    except Exception as e:
        logger.error(f"Error searching suppliers: {e}")
        raise HTTPException(status_code=500, detail="Failed to search suppliers")

@router.get("/stats")
async def get_services_statistics():
    """Get statistics about services and automation capabilities"""
    try:
        data = load_services_data()
        
        stats = {
            "total_suppliers": 0,
            "by_category": {},
            "automation_stats": {
                "direct_form": 0,
                "login_assisted": 0,
                "manual_only": 0,
                "total_automated": 0
            },
            "online_availability": {
                "online_available": 0,
                "offline_only": 0
            },
            "portal_types": {
                "government": 0,
                "private": 0
            }
        }
        
        for category, suppliers in data.items():
            stats["by_category"][category] = len(suppliers)
            stats["total_suppliers"] += len(suppliers)
            
            for supplier in suppliers:
                # Automation stats
                automation_type = supplier.get('automation_type', 'manual_only')
                if automation_type in stats["automation_stats"]:
                    stats["automation_stats"][automation_type] += 1
                
                if automation_type in ['direct_form', 'login_assisted']:
                    stats["automation_stats"]["total_automated"] += 1
                
                # Online availability
                if supplier.get('online_available'):
                    stats["online_availability"]["online_available"] += 1
                else:
                    stats["online_availability"]["offline_only"] += 1
                
                # Portal types
                portal_type = supplier.get('type', 'government')
                if portal_type in stats["portal_types"]:
                    stats["portal_types"][portal_type] += 1
        
        return stats
        
    except Exception as e:
        logger.error(f"Error getting statistics: {e}")
        raise HTTPException(status_code=500, detail="Failed to get statistics")