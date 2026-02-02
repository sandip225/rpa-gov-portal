// Working Torrent Power Auto-fill Script
// Copy this entire script and paste it in the browser console on Torrent Power website

(function() {
    console.log('🚀 Starting Torrent Power Auto-fill...');
    
    // Test data - you can change these values
    const testData = {
        city: 'Ahmedabad',
        serviceNumber: 'TEST123456',
        tNumber: 'T123456789',
        mobile: '9876543210',
        email: 'test@example.com'
    };
    
    // Try to get data from localStorage first
    let formData = testData;
    try {
        const storedData = localStorage.getItem('torrent_autofill_data');
        if (storedData) {
            const parsed = JSON.parse(storedData);
            if (Date.now() - parsed.timestamp < 10 * 60 * 1000) { // Less than 10 minutes old
                formData = {
                    city: parsed.city || testData.city,
                    serviceNumber: parsed.service_number || testData.serviceNumber,
                    tNumber: parsed.t_number || testData.tNumber,
                    mobile: parsed.mobile || testData.mobile,
                    email: parsed.email || testData.email
                };
                console.log('✅ Using stored data from localStorage');
            }
        }
    } catch (e) {
        console.log('ℹ️ Using test data (no stored data found)');
    }
    
    console.log('📋 Form data to fill:', formData);
    
    let filled = 0;
    const results = [];
    
    // Wait a bit for page to be fully loaded
    setTimeout(function() {
        
        // 1. Fill City Dropdown
        try {
            const cityDropdown = document.querySelector('select');
            if (cityDropdown) {
                // Find the option that contains our city
                const options = cityDropdown.querySelectorAll('option');
                for (let option of options) {
                    if (option.textContent.toLowerCase().includes(formData.city.toLowerCase())) {
                        cityDropdown.value = option.value;
                        cityDropdown.dispatchEvent(new Event('change', { bubbles: true }));
                        cityDropdown.style.backgroundColor = '#d4edda';
                        cityDropdown.style.border = '2px solid #28a745';
                        filled++;
                        results.push(`✅ City: ${option.textContent}`);
                        console.log('✅ City filled:', option.textContent);
                        break;
                    }
                }
            } else {
                results.push('❌ City dropdown not found');
            }
        } catch (e) {
            results.push('❌ City error: ' + e.message);
        }
        
        // 2. Fill Service Number
        try {
            const serviceInput = document.querySelector('input[placeholder*="Service Number"]') || 
                                document.querySelector('input[placeholder*="Service"]') ||
                                document.querySelectorAll('input[type="text"]')[0];
            
            if (serviceInput && formData.serviceNumber) {
                serviceInput.value = formData.serviceNumber;
                serviceInput.dispatchEvent(new Event('input', { bubbles: true }));
                serviceInput.dispatchEvent(new Event('change', { bubbles: true }));
                serviceInput.style.backgroundColor = '#d4edda';
                serviceInput.style.border = '2px solid #28a745';
                filled++;
                results.push(`✅ Service Number: ${formData.serviceNumber}`);
                console.log('✅ Service Number filled:', formData.serviceNumber);
            } else {
                results.push('❌ Service Number field not found');
            }
        } catch (e) {
            results.push('❌ Service Number error: ' + e.message);
        }
        
        // 3. Fill T Number
        try {
            const tInput = document.querySelector('input[placeholder*="T No"]') || 
                          document.querySelector('input[placeholder*="T-No"]') ||
                          document.querySelectorAll('input[type="text"]')[1];
            
            if (tInput && formData.tNumber) {
                tInput.value = formData.tNumber;
                tInput.dispatchEvent(new Event('input', { bubbles: true }));
                tInput.dispatchEvent(new Event('change', { bubbles: true }));
                tInput.style.backgroundColor = '#d4edda';
                tInput.style.border = '2px solid #28a745';
                filled++;
                results.push(`✅ T Number: ${formData.tNumber}`);
                console.log('✅ T Number filled:', formData.tNumber);
            } else {
                results.push('❌ T Number field not found');
            }
        } catch (e) {
            results.push('❌ T Number error: ' + e.message);
        }
        
        // 4. Fill Mobile Number
        try {
            const mobileInput = document.querySelector('input[placeholder*="Mobile"]') || 
                               document.querySelector('input[type="tel"]') ||
                               document.querySelectorAll('input[type="text"]')[2];
            
            if (mobileInput && formData.mobile) {
                mobileInput.value = formData.mobile;
                mobileInput.dispatchEvent(new Event('input', { bubbles: true }));
                mobileInput.dispatchEvent(new Event('change', { bubbles: true }));
                mobileInput.style.backgroundColor = '#d4edda';
                mobileInput.style.border = '2px solid #28a745';
                filled++;
                results.push(`✅ Mobile: ${formData.mobile}`);
                console.log('✅ Mobile filled:', formData.mobile);
            } else {
                results.push('❌ Mobile field not found');
            }
        } catch (e) {
            results.push('❌ Mobile error: ' + e.message);
        }
        
        // 5. Fill Email
        try {
            const emailInput = document.querySelector('input[placeholder*="Email"]') || 
                              document.querySelector('input[type="email"]') ||
                              document.querySelectorAll('input[type="text"]')[3];
            
            if (emailInput && formData.email) {
                emailInput.value = formData.email;
                emailInput.dispatchEvent(new Event('input', { bubbles: true }));
                emailInput.dispatchEvent(new Event('change', { bubbles: true }));
                emailInput.style.backgroundColor = '#d4edda';
                emailInput.style.border = '2px solid #28a745';
                filled++;
                results.push(`✅ Email: ${formData.email}`);
                console.log('✅ Email filled:', formData.email);
            } else {
                results.push('❌ Email field not found');
            }
        } catch (e) {
            results.push('❌ Email error: ' + e.message);
        }
        
        // Show results
        console.log('📊 Auto-fill Results:');
        results.forEach(result => console.log(result));
        console.log(`📈 Total fields filled: ${filled}/5`);
        
        // Show notification
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: ${filled > 0 ? '#28a745' : '#dc3545'}; color: white; padding: 15px 25px; border-radius: 10px; font-family: Arial, sans-serif; font-size: 14px; z-index: 999999; box-shadow: 0 4px 20px rgba(0,0,0,0.3); max-width: 300px;">
                <strong>${filled > 0 ? '✅ Auto-fill Completed!' : '❌ Auto-fill Failed'}</strong><br>
                Fields filled: ${filled}/5<br>
                <small style="font-size: 12px; margin-top: 5px; display: block;">
                    ${results.slice(0, 3).join('<br>')}
                    ${results.length > 3 ? '<br>...' : ''}
                </small>
            </div>
        `;
        document.body.appendChild(notification);
        
        // Remove notification after 8 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 8000);
        
        // Show completion - NO ALERT, just visual notification
        if (filled > 0) {
            console.log(`🎉 Auto-fill Successful! Filled ${filled} out of 5 fields`);
            console.log('Filled fields:', results.filter(r => r.includes('✅')));
        } else {
            console.warn('❌ Auto-fill failed. No fields were filled.');
        }
        
    }, 2000); // Wait 2 seconds for page to load
    
})();