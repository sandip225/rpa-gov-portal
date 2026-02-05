import { useState } from 'react';
import { Bot, CheckCircle, AlertCircle, Play, ExternalLink } from 'lucide-react';
import api from '../api/axios';

const TorrentPowerAutomation = ({ userData, onComplete, onClose }) => {
  const [automationStatus, setAutomationStatus] = useState('idle'); // idle, running, completed, failed
  const [result, setResult] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [processingSteps, setProcessingSteps] = useState([]);

  const startAutomation = async () => {
    try {
      setAutomationStatus('running');
      setStatusMessage('Processing...');
      setProcessingSteps([]);

      // Simulate processing steps
      const steps = [
        'Opening Torrent Power website...',
        'Filling city field...',
        'Filling service number...',
        'Filling transaction number...',
        'Filling mobile number...',
        'Filling email address...',
        'Submitting form...'
      ];

      // Show steps one by one
      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setProcessingSteps(prev => [...prev, steps[i]]);
      }

      // Debug: Log the userData to see what we're getting
      console.log('🔍 Debug - userData received:', userData);

      // Prepare the request data with proper field mapping
      const requestData = {
        city: userData.city || 'Ahmedabad',
        service_number: userData.serviceNumber || userData.service_number || '',
        t_number: userData.tNumber || userData.t_number || '',
        mobile: userData.mobile || '',
        email: userData.email || '',
        confirm_email: userData.confirmEmail || userData.email || ''
      };

      // Debug: Log the request data
      console.log('📤 Debug - Request data being sent:', requestData);

      // Validate required fields before sending
      if (!requestData.service_number || !requestData.t_number || !requestData.mobile || !requestData.email) {
        throw new Error('Missing required fields: Service Number, T Number, Mobile, or Email');
      }

      const response = await api.post('/torrent-automation/start-automation', requestData);

      console.log('✅ Automation request sent successfully');
      console.log('📥 Response received:', response.data);

      const automationResult = response.data;

      if (automationResult.success) {
        setAutomationStatus('completed');
        setStatusMessage('Form Submitted Successfully');
        setResult(automationResult);
        
        if (onComplete) {
          onComplete(automationResult);
        }
      } else {
        setAutomationStatus('failed');
        setStatusMessage(`Automation failed: ${automationResult.message}`);
        setResult(automationResult);
      }

    } catch (error) {
      console.error('❌ Automation error:', error);
      setAutomationStatus('failed');
      
      // Show user-friendly error messages
      let errorMessage = 'Failed to connect to automation service';
      
      if (error.message && error.message.includes('Missing required fields')) {
        errorMessage = error.message;
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.detail || 'Invalid request data. Please check your form inputs.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication required. Please login again.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      setStatusMessage(errorMessage);
      setResult({
        success: false,
        error: errorMessage,
        message: 'Automation Failed'
      });
    }
  };

  const openTorrentPowerManually = () => {
    // Store data in localStorage for potential auto-fill
    const torrentData = {
      city: userData.city || 'Ahmedabad',
      service_number: userData.serviceNumber || userData.service_number || '',
      t_number: userData.tNumber || userData.t_number || '',
      mobile: userData.mobile || '',
      email: userData.email || '',
      timestamp: Date.now()
    };
    
    try {
      localStorage.setItem('torrent_autofill_data', JSON.stringify(torrentData));
      console.log('💾 Data stored in localStorage for manual opening');
    } catch (e) {
      console.warn('Could not store data in localStorage:', e);
    }
    
    // Open the website
    window.open('https://connect.torrentpower.com/tplcp/application/namechangerequest', '_blank');
    setStatusMessage('🌐 Torrent Power website opened manually. Data stored for potential auto-fill.');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot className="w-6 h-6 text-white" />
              <h2 className="text-lg font-bold text-white">Torrent Power Automation</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-1 rounded transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          
          {/* Status Display */}
          <div className="mb-4">
            <div className={`p-4 rounded-lg border ${
              automationStatus === 'idle' ? 'bg-gray-50 border-gray-200' :
              automationStatus === 'running' ? 'bg-blue-50 border-blue-200' :
              automationStatus === 'completed' ? 'bg-green-50 border-green-200' :
              'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-3">
                {automationStatus === 'running' && (
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                )}
                {automationStatus === 'completed' && <CheckCircle className="w-5 h-5 text-green-600" />}
                {automationStatus === 'failed' && <AlertCircle className="w-5 h-5 text-red-600" />}
                {automationStatus === 'idle' && <Bot className="w-5 h-5 text-gray-600" />}
                
                <p className={`font-medium ${
                  automationStatus === 'running' ? 'text-blue-800' :
                  automationStatus === 'completed' ? 'text-green-800' :
                  automationStatus === 'failed' ? 'text-red-800' :
                  'text-gray-800'
                }`}>
                  {statusMessage || 'Start Processing'}
                </p>
              </div>

              {/* Processing Steps */}
              {automationStatus === 'running' && processingSteps.length > 0 && (
                <div className="mt-3 space-y-1">
                  {processingSteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-blue-700">
                      <CheckCircle className="w-4 h-4" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Success Message */}
          {result && result.success && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-green-800 mb-2">Form Submitted Successfully</h3>
              <p className="text-green-700">Torrent Power will contact you soon.</p>
            </div>
          )}

          {/* Error Message */}
          {result && !result.success && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-2">Automation Failed</h3>
              <p className="text-sm text-red-700">{result.message || result.error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {automationStatus === 'idle' && (
              <button
                onClick={startAutomation}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start
              </button>
            )}
            
            {automationStatus === 'completed' && (
              <button
                onClick={onClose}
                className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                OK
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TorrentPowerAutomation;