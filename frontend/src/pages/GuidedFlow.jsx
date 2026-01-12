import { useState } from 'react';
import { ArrowLeft, MessageCircle, Zap, Flame, Droplets, Building, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useGuidedFlow from '../hooks/useGuidedFlow';
import api from '../api/axios';

const SERVICES = [
  { id: 'electricity', name: 'Electricity', nameHindi: 'बिजली', icon: Zap, color: 'bg-yellow-500', providers: ['DGVCL', 'MGVCL', 'PGVCL', 'UGVCL', 'GUVNL'] },
  { id: 'gas', name: 'Gas', nameHindi: 'गैस', icon: Flame, color: 'bg-red-500', providers: ['Gujarat Gas', 'Adani Gas', 'HP Gas', 'Indane'] },
  { id: 'water', name: 'Water', nameHindi: 'पानी', icon: Droplets, color: 'bg-blue-500', providers: ['Water Board', 'Municipal Corporation'] },
  { id: 'property', name: 'Property', nameHindi: 'संपत्ति', icon: Building, color: 'bg-green-500', providers: ['Land Records', 'Municipal Corporation'] }
];

const GuidedFlow = () => {
  const navigate = useNavigate();
  const {
    currentStep,
    selectedCategory,
    selectedProvider,
    chatHistory,
    formData,
    submissionResult,
    startFlow,
    selectCategory,
    selectProvider,
    updateFormData,
    submitSuccess,
    goBack,
    startNewApplication
  } = useGuidedFlow();

  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    consumerNumber: '',
    oldName: '',
    newName: '',
    mobile: '',
    email: ''
  });

  const getStepNumber = () => {
    switch (currentStep) {
      case 'welcome': return 1;
      case 'service-select': return 2;
      case 'provider-select': return 3;
      case 'form': return 4;
      case 'confirmation': return 5;
      default: return 1;
    }
  };

  const handleStart = () => {
    startFlow();
  };

  const handleServiceSelect = (service) => {
    selectCategory(service);
  };

  const handleProviderSelect = (provider) => {
    selectProvider({ name: provider }, 'name_change');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/guided-flow/applications', {
        category: selectedCategory.id,
        provider_id: selectedProvider.name.toLowerCase().replace(/\s+/g, '-'),
        application_type: 'name_change',
        form_data: {
          consumer_number: formValues.consumerNumber,
          old_name: formValues.oldName,
          new_name: formValues.newName,
          mobile: formValues.mobile,
          email: formValues.email
        }
      });

      submitSuccess({
        message: 'Application submitted successfully!',
        trackingId: response.data.tracking_id
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        {currentStep !== 'welcome' && (
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step < getStepNumber() ? 'bg-green-500 text-white' :
                    step === getStepNumber() ? 'bg-orange-500 text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {step < getStepNumber() ? '✓' : step}
                  </div>
                  {step < 5 && (
                    <div className={`w-12 h-1 mx-1 ${
                      step < getStepNumber() ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
            <div className="flex items-center gap-2">
              {currentStep !== 'welcome' && currentStep !== 'confirmation' && (
                <button onClick={goBack} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div className="bg-white/20 p-2 rounded-lg">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Gujarat Citizen Helper</h2>
                <p className="text-xs text-blue-100">गुजरात नागरिक सेवा सहायक</p>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="p-4 min-h-[300px]">
            {/* Welcome Screen */}
            {currentStep === 'welcome' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Gujarat Citizen Services Portal
                </h1>
                <p className="text-lg text-gray-600 mb-1">
                  एकीकृत नागरिक सेवा पोर्टल
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Unified Portal for Government Services
                </p>
                <div className="bg-blue-50 rounded-lg p-4 mb-6 max-w-xl mx-auto">
                  <p className="text-base text-gray-700 mb-3">
                    🙏 <strong>नमस्ते! Welcome!</strong>
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    Apply for name change in your utility connections - <strong>Gas, Electricity, Water & Property</strong> - all in one place
                  </p>
                  <ul className="text-left text-sm text-gray-600 space-y-1">
                    <li>✓ Easy Process</li>
                    <li>✓ Track Status</li>
                    <li>✓ All Providers</li>
                    <li>✓ Secure & Safe</li>
                  </ul>
                </div>
                <button
                  onClick={handleStart}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Start Application →
                </button>
              </div>
            )}

            {/* Chat Messages */}
            {chatHistory.length > 0 && (
              <div className="space-y-3 mb-4">
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      msg.type === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Service Selection */}
            {currentStep === 'service-select' && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                {SERVICES.map((service) => {
                  const Icon = service.icon;
                  return (
                    <button
                      key={service.id}
                      onClick={() => handleServiceSelect(service)}
                      className="p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-md transition-all text-center group"
                    >
                      <div className={`w-12 h-12 ${service.color} rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-base font-bold text-gray-800">{service.name}</h3>
                      <p className="text-sm text-gray-600">{service.nameHindi}</p>
                      <p className="text-xs text-gray-500 mt-1">{service.providers.length} providers</p>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Provider Selection */}
            {currentStep === 'provider-select' && selectedCategory && (
              <div className="mt-4">
                <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-600">Selected Service:</p>
                  <p className="text-sm font-bold text-blue-600">
                    {selectedCategory.name} ({selectedCategory.nameHindi})
                  </p>
                </div>
                <div className="grid gap-2">
                  {selectedCategory.providers.map((provider) => (
                    <button
                      key={provider}
                      onClick={() => handleProviderSelect(provider)}
                      className="p-3 rounded-lg border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all text-left flex items-center justify-between group"
                    >
                      <div>
                        <h3 className="text-sm font-bold text-gray-800 group-hover:text-orange-600">{provider}</h3>
                        <p className="text-xs text-gray-500">Click to select</p>
                      </div>
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm font-bold">→</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Form */}
            {currentStep === 'form' && (
              <form onSubmit={handleFormSubmit} className="mt-4 space-y-3">
                <div className="p-3 bg-green-50 rounded-lg mb-4">
                  <p className="text-xs text-gray-600">Selected Provider:</p>
                  <p className="text-sm font-bold text-green-600">{selectedProvider.name}</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Consumer Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formValues.consumerNumber}
                    onChange={(e) => setFormValues({...formValues, consumerNumber: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your consumer number"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Current Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formValues.oldName}
                    onChange={(e) => setFormValues({...formValues, oldName: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter current name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    New Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formValues.newName}
                    onChange={(e) => setFormValues({...formValues, newName: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter new name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formValues.mobile}
                    onChange={(e) => setFormValues({...formValues, mobile: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter mobile number"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formValues.email}
                    onChange={(e) => setFormValues({...formValues, email: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address (optional)"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Application →'}
                </button>
              </form>
            )}

            {/* Confirmation */}
            {currentStep === 'confirmation' && submissionResult && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  ✅ Application Submitted!
                </h2>
                <div className="bg-green-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
                  <p className="text-xs text-gray-600 mb-1">Tracking ID:</p>
                  <p className="text-xl font-bold text-green-600 mb-3">
                    {submissionResult.trackingId}
                  </p>
                  <p className="text-sm text-gray-600">
                    Your application has been submitted successfully. You can track your application status anytime.
                  </p>
                </div>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => navigate('/applications')}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Track Application
                  </button>
                  <button
                    onClick={startNewApplication}
                    className="bg-gray-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors"
                  >
                    New Application
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidedFlow;
