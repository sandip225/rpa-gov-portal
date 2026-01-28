import React, { useState } from 'react';
import { Zap, User, Lock, Phone, Mail, FileText, Play, CheckCircle, AlertCircle, Camera } from 'lucide-react';
import axios from '../api/axios';

const TorrentPowerRPA = () => {
  const [formData, setFormData] = useState({
    // Login data
    username: '',
    password: '',
    // Form data
    city: 'Ahmedabad',
    service_number: '',
    mobile: '',
    email: '',
    old_name: '',
    new_name: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const requestData = {
        login_data: {
          username: formData.username,
          password: formData.password
        },
        form_data: {
          city: formData.city,
          service_number: formData.service_number,
          mobile: formData.mobile,
          email: formData.email,
          old_name: formData.old_name,
          new_name: formData.new_name
        }
      };

      const response = await axios.post('/api/torrent-power/automate-name-change', requestData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail?.error || err.message || 'Automation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Torrent Power RPA Automation</h1>
          <p className="text-gray-600">Automated name change process for Torrent Power connections</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-orange-500" />
              Automation Form
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Login Credentials */}
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-orange-600" />
                  Login Credentials
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username (Service Number)
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="TP2025123456"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter password"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Form Data */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Name Change Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="TP2025123456"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="9876543210"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="user@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Name
                    </label>
                    <input
                      type="text"
                      name="old_name"
                      value={formData.old_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Current name on connection"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Name
                    </label>
                    <input
                      type="text"
                      name="new_name"
                      value={formData.new_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="New name to update"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Running Automation...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Start RPA Automation</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Camera className="w-6 h-6 mr-3 text-green-500" />
              Automation Results
            </h2>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
                <div className="flex items-start">
                  <AlertCircle className="w-6 h-6 text-red-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-800">Automation Failed</h3>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {result && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-6">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-800">Automation Successful</h3>
                    <p className="text-green-700 text-sm mt-1">{result.message}</p>
                    {result.next_step && (
                      <p className="text-green-600 text-sm mt-2 font-medium">{result.next_step}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4">How it works:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>Logs into your Torrent Power account</li>
                <li>Navigates to the name change application</li>
                <li>Fills the form with your provided data</li>
                <li>Takes a screenshot for verification</li>
                <li>Leaves the form ready for manual review</li>
              </ol>
              
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> If captcha is detected, the automation will pause and require manual intervention.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TorrentPowerRPA;