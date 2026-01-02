import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { allServices } from '../data/allServices';
import { 
  ArrowLeft, Send, Bot, CheckCircle, Clock, AlertCircle,
  FileText, User
} from 'lucide-react';

// Helper function to get target website name
const getTargetWebsite = (serviceType) => {
  const mapping = {
    electricity: 'torrent-power',
    gas: 'adani-gas',
    water: 'amc-water',
    property: 'anyror-gujarat'
  };
  return mapping[serviceType] || 'torrent-power';
};

// Helper function to get status message
const getStatusMessage = (status) => {
  const messages = {
    queued: 'Application queued for processing...',
    processing: 'RPA bot is filling and submitting your form...',
    success: 'Application submitted successfully!',
    failed: 'Auto-submission failed. You can retry or submit manually.'
  };
  return messages[status] || 'Processing...';
};

// Helper function to get status icon
const getStatusIcon = (status) => {
  switch (status) {
    case 'processing': return <Bot className="w-5 h-5 text-blue-500 animate-pulse" />;
    case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'failed': case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
    case 'manual': return <FileText className="w-5 h-5 text-orange-500" />;
    default: return <Clock className="w-5 h-5 text-yellow-500" />;
  }
};

const UniversalServiceForm = () => {
  const { serviceType, subServiceType } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Extract serviceType from URL path if not in params
  const location = window.location.pathname;
  const pathParts = location.split('/');
  const actualServiceType = serviceType || pathParts[1]; // Get from URL path
  const actualSubServiceType = subServiceType || pathParts[2];
  
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitMethod, setSubmitMethod] = useState('auto'); // auto or manual
  const [rpaStatus, setRpaStatus] = useState(null);
  const [showRpaViewer, setShowRpaViewer] = useState(false);

  const service = allServices[actualServiceType];
  const subService = service?.services.find(s => s.id === actualSubServiceType);

  // Debug logs
  console.log('UniversalServiceForm - actualServiceType:', actualServiceType);
  console.log('UniversalServiceForm - actualSubServiceType:', actualSubServiceType);
  console.log('UniversalServiceForm - service:', service);
  console.log('UniversalServiceForm - subService:', subService);

  useEffect(() => {
    if (!service || !subService) {
      console.log('Service or subService not found, redirecting to /services');
      console.log('Available services:', Object.keys(allServices));
      if (service) {
        console.log('Available subServices for', serviceType, ':', service.services.map(s => s.id));
      }
      // Temporarily disable redirect to debug
      // navigate('/services');
      return;
    }
    
    // Pre-fill user data
    setFormData({
      applicant_name: user?.full_name || '',
      mobile: user?.mobile || '',
      email: user?.email || '',
      city: user?.city || 'Ahmedabad',
      address: user?.address || '',
      service_type: actualServiceType,
      application_type: actualSubServiceType
    });
  }, [actualServiceType, actualSubServiceType, user, service, subService, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const submitApplication = async () => {
    setSubmitting(true);
    
    try {
      // Step 1: Create application in database first
      const applicationResponse = await api.post('/applications/', {
        service_type: actualServiceType,
        application_type: actualSubServiceType,
        form_data: formData
      });
      
      const applicationId = applicationResponse.data.id;
      
      if (submitMethod === 'auto') {
        // Show RPA form immediately
        setShowRpaViewer(true);
        setRpaStatus({
          id: 'demo-rpa-123',
          status: 'processing',
          message: 'Loading government form and starting auto-fill...',
          step: 1
        });
        
        // Step 2: RPA is filling form (show for longer duration)
        setTimeout(() => {
          setRpaStatus(prev => ({
            ...prev,
            message: 'RPA bot is filling the government form automatically...',
            step: 2
          }));
        }, 3000);
        
        // Step 3: Final submission
        setTimeout(() => {
          setRpaStatus(prev => ({
            ...prev,
            message: 'Submitting application and generating confirmation...',
            step: 3
          }));
        }, 12000);
        
        // Step 4: Success with confirmation
        setTimeout(() => {
          const confirmationNumber = `${actualServiceType.toUpperCase().substring(0,2)}${Date.now()}`;
          setRpaStatus({
            id: 'demo-rpa-123',
            status: 'success',
            message: 'Application submitted successfully! Confirmation received.',
            confirmationNumber: confirmationNumber,
            step: 4
          });
          
          // Auto-close RPA viewer after 4 seconds to show success
          setTimeout(() => {
            setShowRpaViewer(false);
          }, 4000);
        }, 15000);
        
      } else {
        // Manual submission - just show success
        setRpaStatus({
          status: 'manual',
          message: 'Application saved. Please submit manually on official website.',
          applicationId: applicationId
        });
      }
      
    } catch (error) {
      console.error('Submission failed:', error);
      setRpaStatus({
        status: 'error',
        message: error.response?.data?.detail || error.message || 'Submission failed'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const pollRpaStatus = async (rpaId) => {
    const maxPolls = 30;
    let polls = 0;
    
    const poll = async () => {
      try {
        const response = await api.get(`/rpa/status/${rpaId}`);
        const status = response.data;
        
        setRpaStatus({
          id: rpaId,
          status: status.status,
          message: getStatusMessage(status.status),
          confirmationNumber: status.confirmation_number,
          error: status.error_message
        });
        
        // Stop polling if we have success or failure, or reached max polls
        if (status.status === 'success' || status.status === 'failed' || status.confirmation_number || polls >= maxPolls) {
          console.log('Polling stopped:', status.status, 'Confirmation:', status.confirmation_number);
          
          // Close RPA viewer when confirmation is received
          if (status.confirmation_number) {
            setTimeout(() => {
              setShowRpaViewer(false);
            }, 3000); // Close after 3 seconds to show success
          }
          
          return; // Stop polling
        }
        
        if (status.status === 'processing' && polls < maxPolls) {
          polls++;
          setTimeout(poll, 1000);
        }
      } catch (error) {
        console.error('Failed to poll RPA status:', error);
        setRpaStatus(prev => ({
          ...prev,
          status: 'error',
          message: `Status Check Error: ${error.response?.data?.detail || error.message || 'Failed to check status'}`,
          error: error.response?.data?.detail || 'Connection error'
        }));
      }
    };
    
    poll();
  };

  if (!service || !subService) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Debug Information</h1>
            <div className="space-y-2 text-sm">
              <p><strong>Service Type:</strong> {actualServiceType || 'undefined'}</p>
              <p><strong>Sub Service Type:</strong> {actualSubServiceType || 'undefined'}</p>
              <p><strong>Service Found:</strong> {service ? 'Yes' : 'No'}</p>
              <p><strong>Sub Service Found:</strong> {subService ? 'Yes' : 'No'}</p>
              <p><strong>Available Services:</strong> {Object.keys(allServices).join(', ')}</p>
              {service && (
                <p><strong>Available Sub Services:</strong> {service.services.map(s => s.id).join(', ')}</p>
              )}
            </div>
            <button
              onClick={() => navigate('/services')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              ← Back to Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/services')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {service.icon} {subService.name}
            </h1>
            <p className="text-gray-600">{subService.nameHindi} • {service.name}</p>
          </div>
        </div>

        {/* Success Banner */}
        {rpaStatus?.confirmationNumber && (
          <div className="mb-6 p-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-lg">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🎉</div>
              <div>
                <h2 className="text-xl font-bold">Application Submitted Successfully!</h2>
                <p className="text-green-100">Your confirmation number: <span className="font-mono font-bold">{rpaStatus.confirmationNumber}</span></p>
                <p className="text-sm text-green-100 mt-1">You will receive SMS/Email confirmation shortly</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Form - Show actual government form in iframe during RPA processing */}
          <div className="lg:col-span-2">
            {showRpaViewer && rpaStatus?.status === 'processing' ? (
              // Show actual government form in iframe during RPA processing
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-blue-500">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
                    <h3 className="font-bold text-lg">🤖 RPA Auto-Fill in Progress</h3>
                    <div className="ml-auto text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
                      {getTargetWebsite(actualServiceType).replace('-', ' ').toUpperCase()} Portal
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm text-blue-100">
                    {rpaStatus?.message || 'RPA bot is filling the government form...'}
                  </div>
                </div>
                
                {/* Actual Government Form in iframe */}
                <div className="relative">
                  <iframe
                    src={`http://localhost:8000/demo-govt/${getTargetWebsite(actualServiceType)}?rpa=true&data=${encodeURIComponent(JSON.stringify(formData))}`}
                    className="w-full h-screen border-0"
                    title="Government Form - RPA Auto Fill"
                    onLoad={() => {
                      console.log('Government form loaded in iframe');
                    }}
                  />
                  
                  {/* RPA Status Overlay */}
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm font-medium">🤖 RPA Active</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Show normal portal form
              <div className={`bg-white rounded-2xl shadow-lg p-6 transition-all duration-500 ${
                rpaStatus?.confirmationNumber 
                  ? 'ring-4 ring-green-200 border-2 border-green-300' 
                  : ''
              }`}>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  Application Form
                  {rpaStatus?.confirmationNumber && (
                    <span className="text-green-600 animate-bounce">✅</span>
                  )}
                </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                
                {/* Personal Information */}
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Personal Information
                  </h3>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="applicant_name"
                    value={formData.applicant_name || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <select
                    name="city"
                    value={formData.city || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="Ahmedabad">Ahmedabad</option>
                    <option value="Surat">Surat</option>
                    <option value="Vadodara">Vadodara</option>
                    <option value="Rajkot">Rajkot</option>
                    <option value="Gandhinagar">Gandhinagar</option>
                  </select>
                </div>

                {/* Service Specific Fields */}
                {actualServiceType === 'electricity' && (
                  <>
                    <div className="md:col-span-2">
                      <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        ⚡ Electricity Connection Details
                      </h3>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Connection Number *
                      </label>
                      <input
                        type="text"
                        name="service_number"
                        value={formData.service_number || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., TP123456789"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        T Number (Transformer Number) *
                      </label>
                      <input
                        type="text"
                        name="t_no"
                        value={formData.t_no || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., T12345"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Load Sanctioned (KW)
                      </label>
                      <select
                        name="load_sanctioned"
                        value={formData.load_sanctioned || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Load</option>
                        <option value="1">1 KW</option>
                        <option value="2">2 KW</option>
                        <option value="3">3 KW</option>
                        <option value="5">5 KW</option>
                        <option value="10">10 KW</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Connection Type
                      </label>
                      <select
                        name="connection_type"
                        value={formData.connection_type || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Type</option>
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="industrial">Industrial</option>
                        <option value="agricultural">Agricultural</option>
                      </select>
                    </div>
                  </>
                )}

                {actualServiceType === 'gas' && (
                  <>
                    <div className="md:col-span-2">
                      <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        🔥 Gas Connection Details
                      </h3>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Consumer Number
                      </label>
                      <input
                        type="text"
                        name="consumer_number"
                        value={formData.consumer_number || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., AG123456789"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        BP Number (Business Partner)
                      </label>
                      <input
                        type="text"
                        name="bp_number"
                        value={formData.bp_number || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., BP987654321"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gas Connection Type *
                      </label>
                      <select
                        name="gas_connection_type"
                        value={formData.gas_connection_type || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Connection Type</option>
                        <option value="png_domestic">PNG - Domestic</option>
                        <option value="png_commercial">PNG - Commercial</option>
                        <option value="cng_station">CNG Station</option>
                        <option value="industrial">Industrial</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Aadhaar Number *
                      </label>
                      <input
                        type="text"
                        name="aadhaar_number"
                        value={formData.aadhaar_number || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="XXXX-XXXX-XXXX"
                        maxLength="14"
                        required
                      />
                    </div>
                  </>
                )}

                {actualServiceType === 'water' && (
                  <>
                    <div className="md:col-span-2">
                      <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        💧 Water Connection Details
                      </h3>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Water Connection ID
                      </label>
                      <input
                        type="text"
                        name="connection_id"
                        value={formData.connection_id || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., AMC123456"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zone/Ward *
                      </label>
                      <select
                        name="zone"
                        value={formData.zone || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Zone</option>
                        <option value="East Zone">East Zone</option>
                        <option value="West Zone">West Zone</option>
                        <option value="North Zone">North Zone</option>
                        <option value="South Zone">South Zone</option>
                        <option value="Central Zone">Central Zone</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Tax Assessment Number
                      </label>
                      <input
                        type="text"
                        name="property_tax_number"
                        value={formData.property_tax_number || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., PT123456789"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Water Meter Number
                      </label>
                      <input
                        type="text"
                        name="meter_number"
                        value={formData.meter_number || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., WM987654321"
                      />
                    </div>
                  </>
                )}

                {actualServiceType === 'property' && (
                  <>
                    <div className="md:col-span-2">
                      <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        🏠 Property Registration Details
                      </h3>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Survey Number *
                      </label>
                      <input
                        type="text"
                        name="survey_number"
                        value={formData.survey_number || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 123/1/A"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sub-Division Number
                      </label>
                      <input
                        type="text"
                        name="subdivision_number"
                        value={formData.subdivision_number || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., SD-45"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Village/City *
                      </label>
                      <input
                        type="text"
                        name="village"
                        value={formData.village || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter village/city name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Taluka *
                      </label>
                      <select
                        name="taluka"
                        value={formData.taluka || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Taluka</option>
                        <option value="Ahmedabad City">Ahmedabad City</option>
                        <option value="Daskroi">Daskroi</option>
                        <option value="Sanand">Sanand</option>
                        <option value="Dholka">Dholka</option>
                        <option value="Bavla">Bavla</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Type *
                      </label>
                      <select
                        name="property_type"
                        value={formData.property_type || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Property Type</option>
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="industrial">Industrial</option>
                        <option value="agricultural">Agricultural</option>
                        <option value="plot">Vacant Plot</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Area (Sq. Ft.) *
                      </label>
                      <input
                        type="number"
                        name="property_area"
                        value={formData.property_area || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 1200"
                        required
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Submission Method */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-700 mb-3">Submission Method</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="submit_method"
                      value="auto"
                      checked={submitMethod === 'auto'}
                      onChange={(e) => setSubmitMethod(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div>
                      <div className="font-medium text-gray-800">🤖 Auto Submit (Recommended)</div>
                      <div className="text-sm text-gray-600">RPA bot will automatically submit your application</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="submit_method"
                      value="manual"
                      checked={submitMethod === 'manual'}
                      onChange={(e) => setSubmitMethod(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div>
                      <div className="font-medium text-gray-800">📝 Manual Submit</div>
                      <div className="text-sm text-gray-600">Save application and submit manually later</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={submitApplication}
                disabled={submitting || rpaStatus?.confirmationNumber}
                className={`w-full mt-6 py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  rpaStatus?.confirmationNumber 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                    : submitting 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white opacity-50' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                {rpaStatus?.confirmationNumber ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    ✅ Application Submitted Successfully
                  </>
                ) : submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {submitMethod === 'auto' ? 'Auto-Processing...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {submitMethod === 'auto' ? 'Submit & Auto-Process' : 'Save Application'}
                  </>
                )}
              </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Service Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4">Service Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Time:</span>
                  <span className="font-medium">{subService.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fees:</span>
                  <span className="font-medium">{subService.fees}</span>
                </div>
              </div>
            </div>

            {/* Status */}
            {rpaStatus && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  {getStatusIcon(rpaStatus.status)}
                  Application Status
                </h3>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">{rpaStatus.message}</p>
                  
                  {rpaStatus.confirmationNumber && (
                    <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🎉</div>
                        <p className="text-sm font-medium text-green-800 mb-2">
                          Application Submitted Successfully!
                        </p>
                        <p className="text-xs text-green-700 mb-3">Your Confirmation Number:</p>
                        <div className="font-mono text-sm font-bold text-green-900 bg-white px-3 py-2 rounded border break-all max-w-full overflow-hidden text-center leading-tight">
                          {rpaStatus.confirmationNumber}
                        </div>
                        <p className="text-xs text-green-600 mt-2">
                          📧 SMS/Email confirmation will be sent shortly
                        </p>
                        <p className="text-xs text-green-600">
                          ⏱️ Processing time: 3-5 working days
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {rpaStatus.status === 'processing' && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm text-blue-700">RPA bot is processing your application...</p>
                      </div>
                    </div>
                  )}
                  
                  {rpaStatus.error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{rpaStatus.error}</p>
                      <button
                        onClick={() => setSubmitMethod('manual')}
                        className="mt-2 text-xs text-red-700 underline hover:text-red-800"
                      >
                        Switch to Manual Submission
                      </button>
                    </div>
                  )}
                  
                  {rpaStatus.status === 'manual' && (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-orange-700">
                        Application saved. You can submit it manually on the official website.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalServiceForm;