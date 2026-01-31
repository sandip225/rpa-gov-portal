// Enhanced Content Script for AI Form Automation
// This script helps with cross-origin iframe form filling

console.log('🤖 AI Form Automation Content Script Loaded');

// Listen for messages from the parent window
window.addEventListener('message', function(event) {
  console.log('📨 Message received:', event.data);
  
  if (event.data.type === 'FILL_FORM') {
    console.log('🔄 Starting form filling...');
    fillFormWithData(event.data.data);
  }
});

// Enhanced form filling function with visible animations
function fillFormWithData(userData) {
  try {
    console.log('📝 Starting visible form filling with data:', userData);
    
    // Wait for page to be fully loaded
    if (document.readyState !== 'complete') {
      window.addEventListener('load', () => fillFormWithData(userData));
      return;
    }
    
    let currentStep = 0;
    const totalSteps = 6;
    
    // Show progress indicator
    function showProgress(step, message) {
      // Remove existing progress
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
    
    // Animated field filling function
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
        
        // Clear field first
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
            
            // Add checkmark
            const checkmark = document.createElement('span');
            checkmark.innerHTML = '✅';
            checkmark.style.position = 'absolute';
            checkmark.style.right = '10px';
            checkmark.style.top = '50%';
            checkmark.style.transform = 'translateY(-50%)';
            checkmark.style.fontSize = '18px';
            checkmark.style.zIndex = '1000';
            
            // Position checkmark relative to field
            if (field.parentElement.style.position !== 'relative') {
              field.parentElement.style.position = 'relative';
            }
            field.parentElement.appendChild(checkmark);
            
            console.log(`✅ ${fieldName} filled with: ${value}`);
            
            setTimeout(() => {
              field.style.border = '';
              field.style.boxShadow = '';
              field.style.backgroundColor = '';
              resolve();
            }, 800);
          }
        }, 100); // Type speed: 100ms per character
      });
    }
    
    // Main automation function
    async function startVisibleAutomation() {
      try {
        console.log('🤖 AI: Starting visible form automation...');
        
        // Step 1: Connection ID
        currentStep = 1;
        showProgress(currentStep, 'Filling Connection ID...');
        const connectionField = findField([
          'input[name*="connection"]',
          'input[name*="customer"]', 
          'input[id*="connection"]',
          'input[id*="customer"]',
          'input[placeholder*="connection"]',
          'input[placeholder*="customer"]'
        ]);
        await fillFieldWithAnimation(connectionField, userData.connection_id, 'Connection ID');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Step 2: Current Name
        currentStep = 2;
        showProgress(currentStep, 'Filling Current Name...');
        const currentNameField = findField([
          'input[name*="current"]',
          'input[name*="old"]',
          'input[placeholder*="current"]',
          'input[placeholder*="old"]',
          'input[name*="existing"]'
        ]);
        await fillFieldWithAnimation(currentNameField, userData.current_name, 'Current Name');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Step 3: New Name
        currentStep = 3;
        showProgress(currentStep, 'Filling New Name...');
        const newNameField = findField([
          'input[name*="new"]',
          'input[placeholder*="new"]',
          'input[name*="revised"]'
        ]);
        await fillFieldWithAnimation(newNameField, userData.new_name, 'New Name');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Step 4: Mobile Number
        currentStep = 4;
        showProgress(currentStep, 'Filling Mobile Number...');
        const mobileField = findField([
          'input[name*="mobile"]',
          'input[name*="phone"]',
          'input[type="tel"]',
          'input[placeholder*="mobile"]',
          'input[placeholder*="phone"]'
        ]);
        await fillFieldWithAnimation(mobileField, userData.mobile, 'Mobile Number');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Step 5: Email
        currentStep = 5;
        showProgress(currentStep, 'Filling Email Address...');
        const emailField = findField([
          'input[type="email"]',
          'input[name*="email"]',
          'input[placeholder*="email"]'
        ]);
        await fillFieldWithAnimation(emailField, userData.email, 'Email');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Step 6: Address
        currentStep = 6;
        showProgress(currentStep, 'Filling Address...');
        const addressField = findField([
          'textarea[name*="address"]',
          'input[name*="address"]',
          'textarea[placeholder*="address"]',
          'input[placeholder*="address"]'
        ]);
        await fillFieldWithAnimation(addressField, userData.address, 'Address');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Final step: Disable submit buttons
        showProgress(totalSteps, 'Securing form - Disabling submit buttons...');
        disableSubmitButtons();
        showCompletionMessage();
        
      } catch (error) {
        console.error('❌ AI form filling error:', error);
        showErrorMessage(error.message);
      }
    }
    
    // Start the visible automation
    startVisibleAutomation();
    
  } catch (error) {
    console.error('❌ Form filling error:', error);
    showErrorMessage(error.message);
  }
}

// Helper function to find field by multiple selectors
function findField(selectors) {
  for (const selector of selectors) {
    const field = document.querySelector(selector);
    if (field) {
      console.log(`✅ Found field with selector: ${selector}`);
      return field;
    }
  }
  console.log(`❌ No field found for selectors:`, selectors);
  return null;
}

// Helper function to fill a field with proper events
function fillField(field, value, fieldName) {
  try {
    // Clear existing value
    field.value = '';
    
    // Set new value
    field.value = value;
    
    // Trigger events to ensure the form recognizes the change
    const events = ['input', 'change', 'blur', 'keyup'];
    events.forEach(eventType => {
      const event = new Event(eventType, { bubbles: true });
      field.dispatchEvent(event);
    });
    
    // Visual feedback
    field.style.backgroundColor = '#e8f5e8';
    setTimeout(() => {
      field.style.backgroundColor = '';
    }, 2000);
    
    console.log(`✅ ${fieldName} filled with: ${value}`);
  } catch (error) {
    console.error(`❌ Error filling ${fieldName}:`, error);
  }
}

// Disable submit buttons for safety
function disableSubmitButtons() {
  const submitSelectors = [
    'input[type="submit"]',
    'button[type="submit"]',
    'button[onclick*="submit"]',
    '.submit-btn',
    '#submit',
    'button:contains("Submit")',
    'input[value*="Submit"]'
  ];
  
  let buttonsDisabled = 0;
  
  submitSelectors.forEach(selector => {
    const buttons = document.querySelectorAll(selector);
    buttons.forEach(btn => {
      btn.disabled = true;
      btn.style.opacity = '0.5';
      btn.style.cursor = 'not-allowed';
      btn.title = 'Form filled by AI - Please review before submitting manually';
      
      // Add visual indicator
      if (!btn.querySelector('.ai-filled-indicator')) {
        const indicator = document.createElement('span');
        indicator.className = 'ai-filled-indicator';
        indicator.innerHTML = ' 🤖 AI Filled - Review Required';
        indicator.style.fontSize = '12px';
        indicator.style.color = '#666';
        indicator.style.marginLeft = '8px';
        btn.appendChild(indicator);
      }
      
      buttonsDisabled++;
    });
  });
  
  console.log(`✅ ${buttonsDisabled} submit buttons disabled`);
}

// Show completion message
function showCompletionMessage() {
  // Remove any existing completion message
  const existingMessage = document.querySelector('.ai-completion-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Remove progress indicator
  const existing = document.querySelector('.ai-progress-indicator');
  if (existing) existing.remove();
  
  const completionDiv = document.createElement('div');
  completionDiv.className = 'ai-completion-message';
  completionDiv.innerHTML = `
    <div style="position: fixed; top: 20px; left: 20px; background: #10B981; color: white; padding: 20px 30px; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.2); z-index: 10000; font-family: Arial, sans-serif; min-width: 350px;">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
        <span style="font-size: 24px;">🎉</span>
        <div>
          <div style="font-weight: bold; font-size: 18px; margin-bottom: 4px;">Form Filled Successfully!</div>
          <div style="font-size: 14px; opacity: 0.9;">All fields have been filled automatically by AI</div>
        </div>
      </div>
      <div style="background: rgba(255,255,255,0.2); padding: 12px; border-radius: 8px; margin-top: 12px;">
        <div style="font-size: 13px; font-weight: bold; margin-bottom: 6px;">⚠️ Important:</div>
        <div style="font-size: 12px; line-height: 1.4;">
          Please review all filled information carefully before submitting. 
          The submit button has been disabled for your safety.
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(completionDiv);
  
  // Remove completion message after 10 seconds
  setTimeout(() => {
    if (completionDiv.parentNode) {
      completionDiv.parentNode.removeChild(completionDiv);
    }
  }, 10000);
}

// Show error message
function showErrorMessage(error) {
  const errorDiv = document.createElement('div');
  errorDiv.innerHTML = `
    <div style="position: fixed; top: 20px; right: 20px; background: #EF4444; color: white; padding: 12px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10000; font-family: Arial, sans-serif; max-width: 300px;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 18px;">❌</span>
        <div>
          <div style="font-weight: bold; margin-bottom: 4px;">Form Filling Failed</div>
          <div style="font-size: 12px; opacity: 0.9;">${error}</div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(errorDiv);
  
  // Remove error message after 5 seconds
  setTimeout(() => {
    if (errorDiv.parentNode) {
      errorDiv.parentNode.removeChild(errorDiv);
    }
  }, 5000);
}

// Auto-detect and fill forms if data is available in localStorage
function autoFillFromStorage() {
  const storedData = localStorage.getItem('aiFormData');
  if (storedData) {
    try {
      const userData = JSON.parse(storedData);
      console.log('🔄 Auto-filling from stored data');
      fillFormWithData(userData);
      localStorage.removeItem('aiFormData'); // Clean up after use
    } catch (error) {
      console.error('❌ Error parsing stored data:', error);
    }
  }
}

// Check for stored data on page load
if (document.readyState === 'complete') {
  autoFillFromStorage();
} else {
  window.addEventListener('load', autoFillFromStorage);
}

// Export functions for external use
window.aiFormFiller = {
  fillForm: fillFormWithData,
  disableSubmit: disableSubmitButtons
};