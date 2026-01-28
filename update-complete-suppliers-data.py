#!/usr/bin/env python3
"""
Complete Gujarat Suppliers Data Update
Updates all suppliers with correct official portal URLs for name change and address change
Based on comprehensive supplier data provided
"""
import json
import os

# Complete supplier data with all official URLs
COMPLETE_SUPPLIERS_DATA = {
    "gas": [
        {
            "id": "gujarat-gas",
            "name": "Gujarat Gas Ltd",
            "type": "government",
            "portal_url": "https://www.gujaratgas.com",
            "name_change_url": "https://iconnect.gujaratgas.com/Portal/outer-service-request_template.aspx",
            "address_change_url": "https://www.gujaratgas.com/customer-care-numbers/",
            "offline_form_url": "https://iconnect.gujaratgas.com/Portal/Upload.ashx?EncQuery=RbfX54x4vIZzhOBRSRfWTZbXAG7f3AbEg0f7VkvFfGVZliNT3OTix7df9NjIu7AFUPL8Mhq17Uk8uDKp9EzcvQ%3D%3D",
            "api_available": False,
            "online_available": True,
            "rpa_enabled": True,
            "login_required": False,
            "direct_access": True,
            "automation_type": "direct_form",
            "form_type": "web_form",
            "name_change_facility": "Yes (via application form / customer service)",
            "address_change_facility": "Yes (manual update via customer care)"
        },
        {
            "id": "gspc",
            "name": "GSPC Ltd",
            "type": "government",
            "portal_url": "https://www.gspcgroup.com",
            "name_change_url": None,
            "address_change_url": None,
            "offline_form_url": None,
            "api_available": False,
            "online_available": False,
            "rpa_enabled": False,
            "login_required": False,
            "direct_access": False,
            "automation_type": "manual_only",
            "form_type": "office_visit",
            "name_change_facility": "Limited/Not separately available — merging into Gujarat Gas",
            "address_change_facility": "Limited/Manual via customer support",
            "note": "Retail phased out, contact GSPC office"
        },
        {
            "id": "sabarmati-gas",
            "name": "Sabarmati Gas",
            "type": "government",
            "portal_url": "https://www.sabarmatigas.in",
            "name_change_url": "https://www.sabarmatigas.in/",
            "address_change_url": "https://www.sabarmatigas.in/",
            "offline_form_url": "https://www.sabarmatigas.in/",
            "api_available": False,
            "online_available": False,
            "rpa_enabled": False,
            "login_required": False,
            "direct_access": False,
            "automation_type": "manual_only",
            "form_type": "office_visit",
            "name_change_facility": "Manual/Offline (contact centre)",
            "address_change_facility": "Manual/Offline",
            "note": "Visit local Sabarmati office"
        },
        {
            "id": "adani-gas",
            "name": "Adani Total Gas Ltd",
            "type": "private",
            "portal_url": "https://www.adanigas.com",
            "name_change_url": "https://www.adanigas.com/name-transfer",
            "address_change_url": "https://www.adanigas.com/en/myaccount",
            "offline_form_url": "https://www.adanigas.com",
            "api_available": False,
            "online_available": True,
            "rpa_enabled": True,
            "login_required": True,
            "direct_access": False,
            "automation_type": "login_assisted",
            "form_type": "customer_portal",
            "name_change_facility": "Yes (online name transfer available)",
            "address_change_facility": "Yes (customer self-service on portal)"
        },
        {
            "id": "torrent-gas",
            "name": "Torrent Gas",
            "type": "private",
            "portal_url": "https://connect.torrentgas.com",
            "name_change_url": "https://www.torrentgas.com",
            "address_change_url": "https://connect.torrentgas.com",
            "offline_form_url": "https://connect.torrentgas.com/attachments/static_content/download_page/Name_Transfer_Application_form_all_Locations_domestic.pdf",
            "api_available": False,
            "online_available": True,
            "rpa_enabled": True,
            "login_required": False,
            "direct_access": True,
            "a