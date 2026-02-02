// Torrent Power Auto-fill Bookmarklet
// This can be used as a backup if the main automation doesn't work

javascript:(function(){
    // Check if we're on the right website
    if (!window.location.hostname.includes('torrentpower.com')) {
        alert('❌ This bookmarklet only works on Torrent Power website.\n\nPlease navigate to:\nhttps://connect.torrentpower.com/tplcp/application/namechangerequest');
        return;
    }
    
    // Get data from localStorage (stored by our portal)
    let data = null;
    try {
        const storedData = localStorage.getItem('torrent_autofill_data');
        if (storedData) {
            data = JSON.parse(storedData);
            // Check if data is fresh (less than 10 minutes old)
            if (Date.now() - data.timestamp > 10 * 60 * 1000) {
                localStorage.removeItem('torrent_autofill_data');
                data = null;
            }
        }
    } catch (e) {
        console.error('Error reading stored data:', e);
    }
    
    // If no stored data, ask user to input manually
    if (!data) {
        const city = prompt('Enter City:', 'Ahmedabad') || 'Ahmedabad';
        const serviceNumber = prompt('Enter Service Number:') || '';
        const tNumber = prompt('Enter T Number:') || '';
        const mobile = prompt('Enter Mobile Number:') || '';
        const email = prompt('Enter Email:') || '';
        
        if (!serviceNumber || !tNumber || !mobile || !email) {
            alert('❌ All fields are required for auto-fill.');
            return;
        }
        
        data = { city, service_number: serviceNumber, t_number: tNumber, mobile, email };
    }
    
    console.log('🚀 Starting Torrent Power Auto-fill...', data);
    
    let filled = 0;
    
    try {
        // 1. Fill City dropdown
        const citySelect = document.querySelector('select');
        if (citySelect && data.city) {
            const options = citySelect.querySelectorAll('option');
            for (let option of options) {
                if (option.textContent.toLowerCase().includes(data.city.toLowerCase())) {
                    citySelect.value = option.value;
                    citySelect.dispatchEvent(new Event('change', { bubbles: true }));
                    filled++;
                    console.log('✅ City filled:', data.city);
                    
                    // Highlight field
                    citySelect.style.backgroundColor = '#d4edda';
                    citySelect.style.border = '2px solid #28a745';
                    break;
                }
            }
        }
        
        // 2. Fill Service Number
        const serviceInputs = document.querySelectorAll('input[type="text"]');
        if (serviceInputs[0] && data.service_number) {
            serviceInputs[0].value = data.service_number;
            serviceInputs[0].dispatchEvent(new Event('input', { bubbles: true }));
            serviceInputs[0].dispatchEvent(new Event('change', { bubbles: true }));
            filled++;
            console.log('✅ Service Number filled:', data.service_number);
            
            // Highlight field
            serviceInputs[0].style.backgroundColor = '#d4edda';
            serviceInputs[0].style.border = '2px solid #28a745';
        }
        
        // 3. Fill T Number
        if (serviceInputs[1] && data.t_number) {
            serviceInputs[1].value = data.t_number;
            serviceInputs[1].dispatchEvent(new Event('input', { bubbles: true }));
            serviceInputs[1].dispatchEvent(new Event('change', { bubbles: true }));
            filled++;
            console.log('✅ T Number filled:', data.t_number);
            
            // Highlight field
            serviceInputs[1].style.backgroundColor = '#d4edda';
            serviceInputs[1].style.border = '2px solid #28a745';
        }
        
        // 4. Fill Mobile
        const mobileInput = document.querySelector('input[type="tel"]') || serviceInputs[2];
        if (mobileInput && data.mobile) {
            mobileInput.value = data.mobile;
            mobileInput.dispatchEvent(new Event('input', { bubbles: true }));
            mobileInput.dispatchEvent(new Event('change', { bubbles: true }));
            filled++;
            console.log('✅ Mobile filled:', data.mobile);
            
            // Highlight field
            mobileInput.style.backgroundColor = '#d4edda';
            mobileInput.style.border = '2px solid #28a745';
        }
        
        // 5. Fill Email
        const emailInput = document.querySelector('input[type="email"]') || serviceInputs[3];
        if (emailInput && data.email) {
            emailInput.value = data.email;
            emailInput.dispatchEvent(new Event('input', { bubbles: true }));
            emailInput.dispatchEvent(new Event('change', { bubbles: true }));
            filled++;
            console.log('✅ Email filled:', data.email);
            
            // Highlight field
            emailInput.style.backgroundColor = '#d4edda';
            emailInput.style.border = '2px solid #28a745';
        }
        
        // Show completion message
        if (filled > 0) {
            const notification = document.createElement('div');
            notification.innerHTML = `
                <div style="position: fixed; top: 20px; right: 20px; background: #28a745; color: white; padding: 15px 25px; border-radius: 10px; font-family: Arial, sans-serif; font-size: 14px; z-index: 999999; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
                    ✅ Auto-fill Completed!<br>
                    Fields filled: ${filled}/5<br>
                    <small>Please review and submit</small>
                </div>
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 5000);
            
            console.log(`📊 Auto-fill completed: ${filled}/5 fields`);
        } else {
            alert('❌ Auto-fill failed. Please check if you are on the correct form page.');
        }
        
    } catch (error) {
        console.error('❌ Auto-fill error:', error);
        alert('❌ Auto-fill error: ' + error.message);
    }
})();