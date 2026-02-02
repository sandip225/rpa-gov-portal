import { useState } from 'react';
import { Bot, Play, ExternalLink } from 'lucide-react';
import TorrentPowerAutomation from '../components/TorrentPowerAutomation';

const TestAutomationDirect = () => {
  const [showAutomation, setShowAutomation] = useState(false);
  const [formData, setFormData] = useState({
    city: 'Ahmedabad',
    serviceNumber: 'TEST123456',
    tNumber: 'T123456789',
    mobile: '9876543210',
    email: 'test@example.com',
    confirmEmail: 'test@example.com'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStartAutomation = () => {
    setShowAutomation(true);
  };

  const handleAutomationComplete = (result) => {
    console.log('Automation completed:', result);
    if (result.success) {
      alert(`✅ Automation Completed!\n\n${result.message}\n\nNext Steps:\n${result.next_steps?.join('\n') || 'Complete the form manually in the browser window.'}`);
    } else {
      alert(`❌ Automation Failed!\n\n${result.error || result.message}`);
    }
  };

  const handleCloseAutomation = () => {
    setShowAutomation(false);
  };

  const handleOpenManually = () => {
    // Store data in localStorage
    const torrentData = {
      city: formData.city,
      service_number: formData.serviceNumber,
      t_number: formData.tNumber,
      mobile: formData.mobile,
      email: formData.email,
      timestamp: Date.now()
    };
    
    try {
      localStorage.setItem('torrent_autofill_data', JSON.stringify(torrentData));
      console.log('💾 Data stored in localStorage:', torrentData);
      alert('✅ Data stored! Opening Torrent Power website...\n\nIf you have the Chrome extension installed, the form should auto-fill automatically.');
    } catch (e) {
      console.warn('Could not store data:', e);
    }
    
    // Open website
    window.open('https://connect.torrentpower.com/tplcp/application/namechangerequest', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">🚀 Direct RPA Test</h1>
              <p className="text-gray-600 text-lg">No login required - Direct Torrent Power automation</p>
            </div>
          </div>
        </div>

        {/* Test Form */}
        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Test Form Data</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            
            {/* City */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              >
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Surat">Surat</option>
                <option value="Gandhinagar">Gandhinagar</option>
                <option value="Bhavnagar">Bhavnagar</option>
              </select>
            </div>

            {/* Service Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Service Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="serviceNumber"
                value={formData.serviceNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                placeholder="Enter service number"
              />
            </div>

            {/* T Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                T No (Transaction Number) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="tNumber"
                value={formData.tNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                placeholder="Enter T number"
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                placeholder="Enter 10-digit mobile number"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                placeholder="Enter email address"
              />
            </div>

            {/* Confirm Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="confirmEmail"
                value={formData.confirmEmail}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                placeholder="Confirm email address"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <p>🔧 Direct RPA test - No login required</p>
              <p>📝 Fill the form above and test the automation</p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleStartAutomation}
                className="px-8 py-3 rounded-lg font-bold transition-all duration-300 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Bot className="w-5 h-5 fill-current" />
                🚀 Start RPA Test
              </button>
              
              <button
                onClick={handleOpenManually}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Open + Store Data
              </button>
              
              <a
                href="https://connect.torrentpower.com/tplcp/application/namechangerequest"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Open Only
              </a>
            </div>
          </div>
        </div>

        {/* Current Data Display */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="font-bold text-blue-900 mb-3">Current Test Data:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-800">City:</span>
              <p className="text-blue-700">{formData.city}</p>
            </div>
            <div>
              <span className="font-medium text-blue-800">Service Number:</span>
              <p className="text-blue-700">{formData.serviceNumber}</p>
            </div>
            <div>
              <span className="font-medium text-blue-800">T Number:</span>
              <p className="text-blue-700">{formData.tNumber}</p>
            </div>
            <div>
              <span className="font-medium text-blue-800">Mobile:</span>
              <p className="text-blue-700">{formData.mobile}</p>
            </div>
            <div>
              <span className="font-medium text-blue-800">Email:</span>
              <p className="text-blue-700">{formData.email}</p>
            </div>
            <div>
              <span className="font-medium text-blue-800">Confirm Email:</span>
              <p className="text-blue-700">{formData.confirmEmail}</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
          <h3 className="font-bold text-green-900 mb-3">🎯 Direct RPA Test Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-green-800">
            <li>Fill the form above with your test data</li>
            <li>Click "🚀 Start RPA Test" button</li>
            <li>Watch the automation modal and browser opening</li>
            <li>Verify if form fields get filled on Torrent Power website</li>
            <li>No login/registration required for this test</li>
          </ol>
        </div>
      </div>

      {/* Torrent Power Automation Modal */}
      {showAutomation && (
        <TorrentPowerAutomation
          userData={formData}
          onComplete={handleAutomationComplete}
          onClose={handleCloseAutomation}
        />
      )}
    </div>
  );
};

export default TestAutomationDirect;