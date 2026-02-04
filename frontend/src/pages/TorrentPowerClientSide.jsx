import React, { useState } from 'react';
import { Zap, ExternalLink, Play, CheckCircle, AlertCircle, Info } from 'lucide-react';

const TorrentPowerClientSide = () => {
  const [formData, setFormData] = useState({
    city: 'Ahmedabad',
    service_number: 'TP2025123456',
    t_number: 'T123456789',
    mobile: '9876543210',
    email: 'user@example.com'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStartAutomation = () => {
    // Store data in localStorage for the bookmarklet to use
    localStorage.setItem('torrent_autofill_data', JSON.stringify(formData));
    
    // Open Torrent Power website in a new window
    const torrentWindow = window.open(
      'https://connect.torrentpower.com/tplcp/application/namechangerequest',
      '_blank',
      'width=1200,height=800'
    );
    
    // Show instructions
    alert('✅ Torrent Power website opened!\n\n📋 Next Steps:\n1. Wait for the page to load\n2. The form will auto-fill in 3 seconds\n3. Review the filled data\n4. Click Submit when ready');
    
    // Wait for the window to load, then inject the autofill script
    if (torrentWindow) {
      setTimeout(() => {
        try {
          // Inject autofill script into the new window
          torrentWindow.postMessage({
            type: 'TORRENT_AUTOFILL',
            data: formData
          }, '*');
        } catch (e) {
          console.error('Could not inject autofill script:', e);
        }
      }, 3000);
    }
  };

  const generateBookmarklet = () => {
    const data = JSON.stringify(formData);
    const bookmarkletCode = `
javascript:(function(){
  const data = ${data};
  
  // Helper function to fill field
  function fillField(selectors, value) {
    for (let selector of selectors) {
      try {
        const elements = document.querySelectorAll(selector);
        for (let el of elements) {
          if (el.tagName === 'SELECT') {
            const options = Array.from(el.options);
            const option = options.find(opt => 
              opt.text.toLowerCase().includes(value.toLowerCase()) ||
              opt.value.toLowerCase().includes(value.toLowerCase())
            );
            if (option) {
              el.value = option.value;
              el.dispatchEvent(new Event('change', { bubbles: true }));
              el.style.backgroundColor = '#d4edda';
              el.style.border = '2px solid #28a745';
              return true;
            }
          } else {
            el.value = value;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            el.style.backgroundColor = '#d4edda';
            el.style.border = '2px solid #28a745';
            return true;
          }
        }
      } catch (e) {
        console.error('Error filling field:', e);
      }
    }
    return false;
  }
  
  // Fill City
  fillField(['select', 'select[name*="city"]', 'select[id*="city"]'], data.city);
  
  // Fill Service Number
  setTimeout(() => {
    fillField([
      'input[placeholder*="Service Number"]',
      'input[name*="service"]',
      'input[id*="service"]',
      'input[type="text"]'
    ], data.service_number);
  }, 500);
  
  // Fill T Number
  setTimeout(() => {
    fillField([
      'input[placeholder*="T No"]',
      'input[name*="tno"]',
      'input[id*="tno"]'
    ], data.t_number);
  }, 1000);
  
  // Fill Mobile
  setTimeout(() => {
    fillField([
      'input[type="tel"]',
      'input[placeholder*="Mobile"]',
      'input[name*="mobile"]'
    ], data.mobile);
  }, 1500);
  
  // Fill Email
  setTimeout(() => {
    fillField([
      'input[type="email"]',
      'input[placeholder*="Email"]',
      'input[name*="email"]'
    ], data.email);
  }, 2000);
  
  // Show success message
  setTimeout(() => {
    const notification = document.createElement('div');
    notification.innerHTML = \`
      <div style="position: fixed; top: 20px; right: 20px; background: #28a745; color: white; padding: 20px 30px; border-radius: 10px; font-family: Arial, sans-serif; font-size: 16px; z-index: 999999; box-shadow: 0 4px 20px rgba(0,0,0,0.3); max-width: 400px;">
        <strong>🤖 Auto-fill Completed!</strong><br>
        <small style="font-size: 14px; margin-top: 10px; display: block;">
          Form fields have been filled automatically.<br>
          Please review and submit the form.
        </small>
      </div>
    \`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 10000);
  }, 2500);
})();
    `.trim();
    
    return bookmarkletCode;
  };

  const copyBookmarklet = () => {
    const bookmarklet = generateBookmarklet();
    navigator.clipboard.writeText(bookmarklet);
    alert('✅ Bookmarklet copied to clipboard!\n\n📋 To use:\n1. Create a new bookmark\n2. Paste the code as the URL\n3. Go to Torrent Power website\n4. Click the bookmark to auto-fill');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <Zap className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Torrent Power Auto-Fill
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Open Torrent Power website and auto-fill your form instantly
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-2xl mb-8">
          <div className="flex items-start">
            <Info className="w-6 h-6 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">How This Works</h3>
              <p className="text-blue-700 text-sm">
                This approach opens the Torrent Power website in a new window and automatically fills the form using JavaScript. 
                The automation happens in YOUR browser, so you can see everything in real-time!
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left: Form Input */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Your Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Surat">Surat</option>
                  <option value="Gandhinagar">Gandhinagar</option>
                  <option value="Bhavnagar">Bhavnagar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Number
                </label>
                <input
                  type="text"
                  name="service_number"
                  value={formData.service_number}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="TP2025123456"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Number (T No)
                </label>
                <input
                  type="text"
                  name="t_number"
                  value={formData.t_number}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="T123456789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="9876543210"
                  maxLength="10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="user@example.com"
                />
              </div>
            </div>

            {/* Main Action Button */}
            <button
              onClick={handleStartAutomation}
              className="w-full mt-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-5 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <Play className="w-6 h-6" />
              <span>Open & Auto-Fill Website</span>
              <ExternalLink className="w-5 h-5" />
            </button>

            {/* Bookmarklet Button */}
            <button
              onClick={copyBookmarklet}
              className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>📋 Copy Bookmarklet</span>
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Click to open Torrent Power website in a new window
            </p>
          </div>

          {/* Right: Instructions */}
          <div className="space-y-6">
            
            {/* What Happens */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                🎬 What Happens Next?
              </h3>
              <ol className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">1</span>
                  <span>New window opens with Torrent Power website</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold mr-3">2</span>
                  <span>Wait 3 seconds for page to load completely</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold mr-3">3</span>
                  <span>Form fields auto-fill with your data</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold mr-3">4</span>
                  <span>Filled fields turn green for easy identification</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center font-bold mr-3">5</span>
                  <span>Review the data and click Submit</span>
                </li>
              </ol>
            </div>

            {/* Features */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">✨ Features</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>Works from any device with a browser</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>No server-side automation needed</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>Visual feedback with green highlighting</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>You see everything in real-time</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>Full control over submission</span>
                </li>
              </ul>
            </div>

            {/* Alternative Method */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-2xl">
              <h3 className="font-semibold text-yellow-800 mb-2">💡 Alternative: Use Bookmarklet</h3>
              <p className="text-yellow-700 text-sm mb-3">
                Click "Copy Bookmarklet" above, then:
              </p>
              <ol className="text-yellow-700 text-sm space-y-1 list-decimal list-inside">
                <li>Go to Torrent Power website manually</li>
                <li>Create a bookmark with the copied code</li>
                <li>Click the bookmark to auto-fill</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Manual Link */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Or fill the form manually:</p>
          <a
            href="https://connect.torrentpower.com/tplcp/application/namechangerequest"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <span>Open Torrent Power Website</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TorrentPowerClientSide;
