import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Clock, Bot, X, ExternalLink, Monitor, Play, Eye, Zap, Sparkles } from 'lucide-react';

const AIAutomationIframe = ({ 
  provider, 
  userData, 
  portalUrl, 
  onAutomationComplete,
  onClose 
}) => {
  const [automationStatus, setAutomationStatus] = useState('ready');
  const [statusMessage, setStatusMessage] = useState('Ready to start AI automation');
  const [taskId, setTaskId] = useState(null);
  const [showIframeError, setShowIframeError] = useState(true);

  const startExternalBrowserAutomation = async () => {
    try {
      setAutomationStatus('starting');
      setStatusMessage('🤖 Starting AI agent automation...');
      
      // Start browser-use AI automation
      const response = await fetch('/api/ai-automation/start-torrent-power', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          provider: 'torrent_power',
          service_type: 'name_change',
          user_data: userData,
          portal_url: 'https://connect.torrentpower.com/tplcp/application/namechangerequest'
        })
      });

      const result = await response.json();

      if (result.success) {
        const extractedTaskId = result.details?.split('Task ID: ')[1];
        setTaskId(extractedTaskId);
        setAutomationStatus('running');
        setStatusMessage('🤖 AI agent is automating Torrent Power form - watch the browser!');
        
        // Start polling for status
        pollAutomationStatus(extractedTaskId);
      } else {
        throw new Error(result.message || 'Failed to start AI automation');
      }
      
    } catch (error) {
      console.error('AI automation error:', error);
      setAutomationStatus('error');
      setStatusMessage(`❌ AI automation failed: ${error.message}`);
    }
  };

  const pollAutomationStatus = async (taskId) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/ai-automation/status/${taskId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const statusResult = await response.json();

        if (statusResult.status === 'completed') {
          clearInterval(pollInterval);
          
          if (statusResult.result.success) {
            setAutomationStatus('completed');
            setStatusMessage('✅ Automation completed! Check the browser window to complete manually.');
            onAutomationComplete?.(statusResult.result);
          } else {
            setAutomationStatus('error');
            setStatusMessage(`❌ Automation failed: ${statusResult.result.error || 'Unknown error'}`);
          }
        } else if (statusResult.status === 'running') {
          setStatusMessage('🔄 AI is navigating and filling the form - watch the browser window...');
        }
      } catch (error) {
        console.error('Status polling error:', error);
        clearInterval(pollInterval);
        setAutomationStatus('error');
        setStatusMessage('❌ Failed to check automation status');
      }
    }, 3000);

    // Cleanup after 5 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
      if (automationStatus === 'running') {
        setAutomationStatus('timeout');
        setStatusMessage('⏰ Automation timed out. Please check the browser window.');
      }
    }, 300000);
  };

  const openTorrentPowerManually = () => {
    // Open Torrent Power website in new tab
    window.open('https://connect.torrentpower.com/tplcp/session/signin', '_blank');
    setStatusMessage('🌐 Torrent Power website opened in new tab. You can fill the form manually.');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col relative">
        
        {/* Close Button */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-600 hover:text-gray-800 rounded-full p-2 shadow-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Browser Automation</h2>
              <p className="text-blue-100 text-sm">Torrent Power Name Change - Live Automation</p>
            </div>
          </div>
        </div>

        {/* Scrollable Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            
            {/* Status Icon */}
            <div className="mb-4">
              {automationStatus === 'ready' && (
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Play className="w-8 h-8 text-blue-600" />
                </div>
              )}
              {automationStatus === 'starting' && (
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              )}
              {automationStatus === 'running' && (
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Bot className="w-8 h-8 text-green-600 animate-bounce" />
                </div>
              )}
              {automationStatus === 'completed' && (
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              )}
              {automationStatus === 'error' && (
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
              )}
            </div>

            {/* Status Message */}
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {automationStatus === 'ready' && 'Ready to Start AI Agent'}
              {automationStatus === 'starting' && 'Starting AI Agent'}
              {automationStatus === 'running' && 'AI Agent Working'}
              {automationStatus === 'completed' && 'AI Agent Completed'}
              {automationStatus === 'error' && 'AI Agent Error'}
            </h3>

            <p className="text-gray-600 mb-6 text-base">{statusMessage}</p>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4 mb-4">
              
              {automationStatus === 'ready' && (
                <button
                  onClick={startExternalBrowserAutomation}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-colors flex items-center gap-2 text-lg"
                >
                  <Bot className="w-6 h-6" />
                  Start AI Agent Automation
                  <Sparkles className="w-5 h-5" />
                </button>
              )}

              {automationStatus === 'starting' && (
                <div className="text-blue-600">
                  <p className="font-medium">🤖 Starting AI agent...</p>
                  <p className="text-sm">Browser will open with AI automation</p>
                </div>
              )}

              {automationStatus === 'running' && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-medium text-purple-900">🤖 AI agent is working automatically...</p>
                  </div>
                  <div className="mt-2 text-sm text-purple-800">
                    <p>• AI opened browser and navigating to form</p>
                    <p>• Automatically filling all form fields</p>
                    <p>• Watch the browser window for live automation</p>
                  </div>
                </div>
              )}

              {automationStatus === 'completed' && (
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="font-medium text-green-900">✅ AI agent completed successfully!</p>
                    <p className="text-sm text-green-700 mt-2">Form filled automatically - complete captcha and submit</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Done
                  </button>
                </div>
              )}

              {automationStatus === 'error' && (
                <div className="space-y-3">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="font-medium text-red-900">❌ AI automation failed</p>
                    <p className="text-sm text-red-700 mt-1">Please check OpenAI API key and credits</p>
                  </div>
                  <button
                    onClick={startExternalBrowserAutomation}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Bot className="w-5 h-5" />
                    Retry AI Agent
                  </button>
                </div>
              )}
            </div>

            {/* AI Agent Info */}
            {automationStatus === 'running' && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  AI Agent Process
                </h4>
                <div className="text-sm text-gray-700 space-y-2 text-left">
                  <p>🤖 <strong>Browser-use Agent:</strong> AI is controlling the browser automatically</p>
                  <p>🌐 <strong>Direct Navigation:</strong> Opening Torrent Power form page</p>
                  <p>📝 <strong>Auto-fill:</strong> Filling all form fields with your data</p>
                  <p>👀 <strong>Visible Process:</strong> You can watch the AI work in real-time</p>
                  <p>✋ <strong>Manual Step:</strong> Captcha and submit left for you</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAutomationIframe;