
// Working Torrent Power Auto-fill Script
(function() {
    console.log('🚀 Starting Torrent Power Auto-fill...');
    
    const formData = {
        city: 'Ahmedabad',
        serviceNumber: 'TEST123456',
        tNumber: 'T123456789',
        mobile: '9876543210',
        email: 'test@example.com'
    };
    
    console.log('📋 Form data to fill:', formData);
    
    let filled = 0;
    const results = [];
    
    // Wait for page to be fully loaded
    setTimeout(function() {
        
        // 1. Fill City Dropdown
        try {
            const cityDropdown = document.querySelector('select');
            if (cityDropdown) {
                const options = cityDropdown.querySelectorAll('option');
                for (let option of options) {
                    if (option.textContent.toLowerCase().includes('ahmedabad')) {
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
            
            if (serviceInput && 'TEST123456') {
                serviceInput.value = 'TEST123456';
                serviceInput.dispatchEvent(new Event('input', { bubbles: true }));
                serviceInput.dispatchEvent(new Event('change', { bubbles: true }));
                serviceInput.style.backgroundColor = '#d4edda';
                serviceInput.style.border = '2px solid #28a745';
                filled++;
                results.push(`✅ Service Number: TEST123456`);
                console.log('✅ Service Number filled:', 'TEST123456');
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
            
            if (tInput && 'T123456789') {
                tInput.value = 'T123456789';
                tInput.dispatchEvent(new Event('input', { bubbles: true }));
                tInput.dispatchEvent(new Event('change', { bubbles: true }));
                tInput.style.backgroundColor = '#d4edda';
                tInput.style.border = '2px solid #28a745';
                filled++;
                results.push(`✅ T Number: T123456789`);
                console.log('✅ T Number filled:', 'T123456789');
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
            
            if (mobileInput && '9876543210') {
                mobileInput.value = '9876543210';
                mobileInput.dispatchEvent(new Event('input', { bubbles: true }));
                mobileInput.dispatchEvent(new Event('change', { bubbles: true }));
                mobileInput.style.backgroundColor = '#d4edda';
                mobileInput.style.border = '2px solid #28a745';
                filled++;
                results.push(`✅ Mobile: 9876543210`);
                console.log('✅ Mobile filled:', '9876543210');
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
            
            if (emailInput && 'test@example.com') {
                emailInput.value = 'test@example.com';
                emailInput.dispatchEvent(new Event('input', { bubbles: true }));
                emailInput.dispatchEvent(new Event('change', { bubbles: true }));
                emailInput.style.backgroundColor = '#d4edda';
                emailInput.style.border = '2px solid #28a745';
                filled++;
                results.push(`✅ Email: test@example.com`);
                console.log('✅ Email filled:', 'test@example.com');
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
        
        // Show completion alert
        if (filled > 0) {
            setTimeout(() => {
                alert(`🎉 Auto-fill Successful!\n\nFilled ${filled} out of 5 fields:\n\n${results.filter(r => r.includes('✅')).join('\n')}\n\nPlease review the data and click Submit to complete your application.`);
            }, 1000);
        } else {
            alert('❌ Auto-fill failed. Please fill the form manually.\n\nData to fill:\n• City: Ahmedabad\n• Service Number: TEST123456\n• T Number: T123456789\n• Mobile: 9876543210\n• Email: test@example.com');
        }
        
    }, 2000); // Wait 2 seconds for page to load
    
})();
