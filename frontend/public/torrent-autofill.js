// Torrent Power Auto-fill Script
// This script will be injected into the Torrent Power website to fill the form

(function() {
    console.log('🚀 Unified Portal Auto-fill Script Started');
    
    // Get data from URL parameters or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const formData = {
        city: urlParams.get('city') || localStorage.getItem('torrent_city') || 'Ahmedabad',
        serviceNumber: urlParams.get('service_number') || localStorage.getItem('torrent_service_number') || '',
        tNumber: urlParams.get('t_number') || localStorage.getItem('torrent_t_number') || '',
        mobile: urlParams.get('mobile') || localStorage.getItem('torrent_mobile') || '',
        email: urlParams.get('email') || localStorage.getItem('torrent_email') || ''
    };
    
    console.log('📋 Form data to fill:', formData);
    
    // Wait for page to load completely
    function waitForElements() {
        return new Promise((resolve) => {
            const checkElements = () => {
                const citySelect = document.querySelector('select[name="city"], #city, select');
                const serviceField = document.querySelector('input[name*="service"], input[placeholder*="Service"]');
                
                if (citySelect && serviceField) {
                    resolve();
                } else {
                    setTimeout(checkElements, 500);
                }
            };
            checkElements();
        });
    }
    
    // Fill form function
    async function fillForm() {
        try {
            await waitForElements();
            
            let fieldsFilledCount = 0;
            
            // 1. Fill City dropdown
            const citySelect = document.querySelector('select[name="city"], #city, select');
            if (citySelect && formData.city) {
                // Try to find option by text content
                const options = citySelect.querySelectorAll('option');
                for (let option of options) {
                    if (option.textContent.includes(formData.city)) {
                        citySelect.value = option.value;
                        citySelect.dispatchEvent(new Event('change', { bubbles: true }));
                        fieldsFilledCount++;
                        console.log('✅ City filled:', formData.city);
                        break;
                    }
                }
            }
            
            // 2. Fill Service Number
            const serviceSelectors = [
                'input[name*="service"]',
                'input[placeholder*="Service"]',
                'input[placeholder*="Consumer"]',
                'input[type="text"]:nth-of-type(1)'
            ];
            
            for (let selector of serviceSelectors) {
                const field = document.querySelector(selector);
                if (field && formData.serviceNumber) {
                    field.value = formData.serviceNumber;
                    field.dispatchEvent(new Event('input', { bubbles: true }));
                    field.dispatchEvent(new Event('change', { bubbles: true }));
                    fieldsFilledCount++;
                    console.log('✅ Service Number filled:', formData.serviceNumber);
                    break;
                }
            }
            
            // 3. Fill T Number
            const tNumberSelectors = [
                'input[name*="tNumber"]',
                'input[name*="transaction"]',
                'input[placeholder*="T No"]',
                'input[placeholder*="Transaction"]'
            ];
            
            for (let selector of tNumberSelectors) {
                const field = document.querySelector(selector);
                if (field && formData.tNumber) {
                    field.value = formData.tNumber;
                    field.dispatchEvent(new Event('input', { bubbles: true }));
                    field.dispatchEvent(new Event('change', { bubbles: true }));
                    fieldsFilledCount++;
                    console.log('✅ T Number filled:', formData.tNumber);
                    break;
                }
            }
            
            // 4. Fill Mobile Number
            const mobileSelectors = [
                'input[name*="mobile"]',
                'input[type="tel"]',
                'input[placeholder*="Mobile"]',
                'input[placeholder*="Phone"]'
            ];
            
            for (let selector of mobileSelectors) {
                const field = document.querySelector(selector);
                if (field && formData.mobile) {
                    field.value = formData.mobile;
                    field.dispatchEvent(new Event('input', { bubbles: true }));
                    field.dispatchEvent(new Event('change', { bubbles: true }));
                    fieldsFilledCount++;
                    console.log('✅ Mobile filled:', formData.mobile);
                    break;
                }
            }
            
            // 5. Fill Email
            const emailSelectors = [
                'input[name*="email"]',
                'input[type="email"]',
                'input[placeholder*="Email"]'
            ];
            
            for (let selector of emailSelectors) {
                const field = document.querySelector(selector);
                if (field && formData.email) {
                    field.value = formData.email;
                    field.dispatchEvent(new Event('input', { bubbles: true }));
                    field.dispatchEvent(new Event('change', { bubbles: true }));
                    fieldsFilledCount++;
                    console.log('✅ Email filled:', formData.email);
                    break;
                }
            }
            
            // Show success message
            if (fieldsFilledCount > 0) {
                const message = `✅ Auto-fill Completed!\n\nFields filled: ${fieldsFilledCount}/5\n\n• City: ${formData.city}\n• Service Number: ${formData.serviceNumber}\n• T Number: ${formData.tNumber}\n• Mobile: ${formData.mobile}\n• Email: ${formData.email}\n\nPlease review the data and submit the form.`;
                
                alert(message);
                
                // Highlight filled fields
                document.querySelectorAll('input[value], select[value]').forEach(field => {
                    if (field.value) {
                        field.style.backgroundColor = '#d4edda';
                        field.style.border = '2px solid #28a745';
                    }
                });
            } else {
                alert('❌ Auto-fill failed. Please fill the form manually.');
            }
            
        } catch (error) {
            console.error('❌ Auto-fill error:', error);
            alert('❌ Auto-fill error. Please fill the form manually.');
        }
    }
    
    // Start auto-fill after a short delay
    setTimeout(fillForm, 2000);
    
})();