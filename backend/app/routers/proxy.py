"""
Proxy router to bypass X-Frame-Options restrictions
Allows loading external websites in iframe
"""

from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import HTMLResponse
import httpx
import re
from urllib.parse import urljoin, urlparse

router = APIRouter(prefix="/api/proxy", tags=["Proxy"])

@router.get("/torrent-power")
async def proxy_torrent_power():
    """
    Proxy Torrent Power website to bypass X-Frame-Options
    """
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                "https://connect.torrentpower.com/tplcp/application/namechangerequest",
                headers={
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            )
            
            if response.status_code == 200:
                html_content = response.text
                
                # Remove X-Frame-Options restrictions
                html_content = re.sub(r'<meta[^>]*http-equiv=["\']X-Frame-Options["\'][^>]*>', '', html_content, flags=re.IGNORECASE)
                
                # Inject our AI form automation script
                ai_script = """
                <script>
                // AI Form Automation Script
                console.log('🤖 AI Form Automation loaded in proxy');
                
                // Listen for form data from parent window
                window.addEventListener('message', function(event) {
                    if (event.data.type === 'FILL_FORM') {
                        console.log('📝 Received form data:', event.data.data);
                        fillFormWithAnimation(event.data.data);
                    }
                });
                
                // Enhanced form filling with visible animations
                async function fillFormWithAnimation(userData) {
                    try {
                        console.log('🤖 Starting visible form filling...');
                        
                        let currentStep = 0;
                        const totalSteps = 6;
                        
                        // Show progress indicator
                        function showProgress(step, message) {
                            const existing = document.querySelector('.ai-progress-indicator');
                            if (existing) existing.remove();
                            
                            const progressDiv = document.createElement('div');
                            progressDiv.className = 'ai-progress-indicator';
                            progressDiv.innerHTML = `
                                <div style="position: fixed; top: 20px; left: 20px; background: #3B82F6; color: white; padding: 15px 25px; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.2); z-index: 10000; font-family: Arial, sans-serif; min-width: 300px;">
                                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                                        <div style="width: 24px; height: 24px; border: 3px solid #60A5FA; border-top: 3px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                                        <div style="font-weight: bold; font-size: 16px;">🤖 AI Auto-Filling Form</div>
                                    </div>
                                    <div style="font-size: 14px; margin-bottom: 10px;">Step ${step}/${totalSteps}: ${message}</div>
                                    <div style="background: rgba(255,255,255,0.2); height: 6px; border-radius: 3px; overflow: hidden;">
                                        <div style="background: white; height: 100%; width: ${(step/totalSteps)*100}%; transition: width 0.5s ease; border-radius: 3px;"></div>
                                    </div>
                                </div>
                                <style>
                                    @keyframes spin {
                                        0% { transform: rotate(0deg); }
                                        100% { transform: rotate(360deg); }
                                    }
                                </style>
                            `;
                            document.body.appendChild(progressDiv);
                        }
                        
                        // Animated field filling
                        function fillFieldWithAnimation(field, value, fieldName) {
                            return new Promise((resolve) => {
                                if (!field || !value) {
                                    resolve();
                                    return;
                                }
                                
                                // Highlight field
                                field.style.border = '3px solid #3B82F6';
                                field.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.5)';
                                field.style.backgroundColor = '#EBF8FF';
                                
                                // Clear and focus
                                field.value = '';
                                field.focus();
                                
                                // Type animation
                                let i = 0;
                                const typeInterval = setInterval(() => {
                                    if (i < value.length) {
                                        field.value += value[i];
                                        field.dispatchEvent(new Event('input', { bubbles: true }));
                                        i++;
                                    } else {
                                        clearInterval(typeInterval);
                                        
                                        // Final events
                                        field.dispatchEvent(new Event('change', { bubbles: true }));
                                        field.dispatchEvent(new Event('blur', { bubbles: true }));
                                        
                                        // Success styling
                                        field.style.border = '3px solid #10B981';
                                        field.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.5)';
                                        field.style.backgroundColor = '#ECFDF5';
                                        
                                        console.log(`✅ ${fieldName} filled with: ${value}`);
                                        
                                        setTimeout(() => {
                                            field.style.border = '';
                                            field.style.boxShadow = '';
                                            field.style.backgroundColor = '';
                                            resolve();
                                        }, 800);
                                    }
                                }, 100);
                            });
                        }
                        
                        // Find field helper
                        function findField(selectors) {
                            for (const selector of selectors) {
                                const field = document.querySelector(selector);
                                if (field) return field;
                            }
                            return null;
                        }
                        
                        // Start automation
                        currentStep = 1;
                        showProgress(currentStep, 'Filling Service Number...');
                        const serviceField = findField(['input[name*="service"]', 'input[name*="connection"]', 'input[name*="customer"]']);
                        await fillFieldWithAnimation(serviceField, userData.connection_id, 'Service Number');
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        
                        currentStep = 2;
                        showProgress(currentStep, 'Filling Mobile Number...');
                        const mobileField = findField(['input[name*="mobile"]', 'input[type="tel"]']);
                        await fillFieldWithAnimation(mobileField, userData.mobile, 'Mobile Number');
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        
                        currentStep = 3;
                        showProgress(currentStep, 'Filling Email...');
                        const emailField = findField(['input[type="email"]', 'input[name*="email"]']);
                        await fillFieldWithAnimation(emailField, userData.email, 'Email');
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        
                        currentStep = 4;
                        showProgress(currentStep, 'Confirming Email...');
                        const confirmEmailField = findField(['input[name*="confirm"]', 'input[name*="verify"]']);
                        await fillFieldWithAnimation(confirmEmailField, userData.email, 'Confirm Email');
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        
                        currentStep = 5;
                        showProgress(currentStep, 'Generating Captcha...');
                        // Try to click regenerate captcha button
                        const regenerateBtn = document.querySelector('a[onclick*="regenerate"], button[onclick*="regenerate"], .regenerate');
                        if (regenerateBtn) {
                            regenerateBtn.click();
                        }
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        
                        currentStep = 6;
                        showProgress(currentStep, 'Securing form...');
                        
                        // Disable submit button
                        const submitButtons = document.querySelectorAll('input[type="submit"], button[type="submit"], input[value*="Submit"]');
                        submitButtons.forEach(btn => {
                            btn.disabled = true;
                            btn.style.opacity = '0.5';
                            btn.style.cursor = 'not-allowed';
                            btn.title = 'Form filled by AI - Please review before submitting manually';
                        });
                        
                        // Show completion
                        setTimeout(() => {
                            const existing = document.querySelector('.ai-progress-indicator');
                            if (existing) existing.remove();
                            
                            const completionDiv = document.createElement('div');
                            completionDiv.innerHTML = `
                                <div style="position: fixed; top: 20px; left: 20px; background: #10B981; color: white; padding: 20px 30px; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.2); z-index: 10000; font-family: Arial, sans-serif; min-width: 350px;">
                                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                                        <span style="font-size: 24px;">🎉</span>
                                        <div>
                                            <div style="font-weight: bold; font-size: 18px; margin-bottom: 4px;">Form Filled Successfully!</div>
                                            <div style="font-size: 14px; opacity: 0.9;">Please enter captcha and review before submitting</div>
                                        </div>
                                    </div>
                                    <div style="background: rgba(255,255,255,0.2); padding: 12px; border-radius: 8px; margin-top: 12px;">
                                        <div style="font-size: 13px; font-weight: bold; margin-bottom: 6px;">⚠️ Next Steps:</div>
                                        <div style="font-size: 12px; line-height: 1.4;">
                                            1. Enter the captcha code<br>
                                            2. Review all filled information<br>
                                            3. Click Submit to complete
                                        </div>
                                    </div>
                                </div>
                            `;
                            document.body.appendChild(completionDiv);
                            
                            setTimeout(() => {
                                if (completionDiv.parentNode) {
                                    completionDiv.parentNode.removeChild(completionDiv);
                                }
                            }, 10000);
                        }, 1000);
                        
                    } catch (error) {
                        console.error('❌ Form filling error:', error);
                    }
                }
                
                // Auto-start if data is available
                const storedData = localStorage.getItem('aiFormData');
                if (storedData) {
                    try {
                        const userData = JSON.parse(storedData);
                        setTimeout(() => {
                            fillFormWithAnimation(userData);
                            localStorage.removeItem('aiFormData');
                        }, 2000);
                    } catch (e) {
                        console.error('Error parsing stored data:', e);
                    }
                }
                </script>
                """
                
                # Inject script before closing body tag
                html_content = html_content.replace('</body>', ai_script + '</body>')
                
                # Fix relative URLs to absolute URLs
                base_url = "https://connect.torrentpower.com"
                html_content = re.sub(r'src="(?!http)', f'src="{base_url}', html_content)
                html_content = re.sub(r'href="(?!http)', f'href="{base_url}', html_content)
                html_content = re.sub(r'action="(?!http)', f'action="{base_url}', html_content)
                
                return HTMLResponse(content=html_content)
            else:
                raise HTTPException(status_code=response.status_code, detail="Failed to fetch website")
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Proxy error: {str(e)}")

@router.get("/website")
async def proxy_website(url: str):
    """
    Generic website proxy
    """
    
    try:
        # Validate URL
        parsed_url = urlparse(url)
        if not parsed_url.scheme or not parsed_url.netloc:
            raise HTTPException(status_code=400, detail="Invalid URL")
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                url,
                headers={
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            )
            
            if response.status_code == 200:
                html_content = response.text
                
                # Remove X-Frame-Options restrictions
                html_content = re.sub(r'<meta[^>]*http-equiv=["\']X-Frame-Options["\'][^>]*>', '', html_content, flags=re.IGNORECASE)
                
                # Fix relative URLs
                base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
                html_content = re.sub(r'src="(?!http)', f'src="{base_url}', html_content)
                html_content = re.sub(r'href="(?!http)', f'href="{base_url}', html_content)
                html_content = re.sub(r'action="(?!http)', f'action="{base_url}', html_content)
                
                return HTMLResponse(content=html_content)
            else:
                raise HTTPException(status_code=response.status_code, detail="Failed to fetch website")
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Proxy error: {str(e)}")