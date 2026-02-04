import React, { useState } from 'react';
import { Zap, ExternalLink, Play, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import api from '../api/axios';

const TorrentPowerDemo = () => {
  const [formData, setFormData] = useState({
    city: 'Ahmedabad',
    service_number: 'TP2025123456',
    t_number: 'T123456789',
    mobile: '9876543210',
    email: 'user@example.com'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStartAutomation = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Call the visible automation endpoint
      const response = await api.post('/torrent-automation/start-visible-automation', formData);
      
      setResult(response.data);
      
      // Show success message
      if (response.data.success) {
        alert('✅ Automation Started!\n\nA browser window will open and automatically fill the Torrent Power form.\n\nWatch the automation in action!');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'Automation failed';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
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
            AI-Powered Form Auto-Fill
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Watch as our RPA bot automatically opens Torrent Power website and fills your form in real-time
          </p>
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
              disabled={loading}
              className="w-full mt-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-5 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {loading ? (
                <>
                  <Loader className="w-6 h-6 animate-spin" />
                  <span>Starting Automation...</span>
                </>
              ) : (
                <>
                  <Play className="w-6 h-6" />
                  <span>Start AI Auto-Fill in Website</span>
                  <ExternalLink className="w-5 h-5" />
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Click to open Torrent Power website and watch the magic happen!
            </p>
          </div>

          {/* Right: Demo Info & Results */}
          <div className="space-y-6">
            
            {/* What Happens */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                🎬 What Happens Next?
              </h3>
              <ol className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">1</span>
                  <span>Browser window opens automatically</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold mr-3">2</span>
                  <span>Navigates to Torrent Power official website</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold mr-3">3</span>
                  <span>AI bot fills all form fields automatically</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold mr-3">4</span>
                  <span>Fields are highlighted in green as they're filled</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center font-bold mr-3">5</span>
                  <span>Browser stays open for you to review and submit</span>
                </li>
              </ol>
            </div>

            {/* Results */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-2xl">
                <div className="flex items-start">
                  <AlertCircle className="w-6 h-6 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-red-800 mb-1">Automation Failed</h3>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {result && result.success && (
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-2xl">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-green-800 mb-2">Automation Started!</h3>
                    <p className="text-green-700 text-sm mb-3">{result.message}</p>
                    
                    {result.next_steps && (
                      <div className="mt-3 space-y-1">
                        {result.next_steps.map((step, index) => (
                          <p key={index} className="text-green-600 text-sm">
                            {step}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">✨ Features</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>Real browser automation (not simulation)</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>Visual feedback with field highlighting</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>Automatic screenshot capture</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>Browser stays open for review</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>You control the final submission</span>
                </li>
              </ul>
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

export default TorrentPowerDemo;
