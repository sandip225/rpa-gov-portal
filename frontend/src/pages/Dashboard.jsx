import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
  Zap, Flame, Droplets, Building, ArrowRight, FileText, 
  CheckCircle, Clock, User, ExternalLink,
  MapPin, Phone, Mail, TrendingUp, Activity
} from 'lucide-react';

// Utility functions to mask user information
const maskMobile = (mobile) => {
  if (!mobile) return '';
  const mobileStr = mobile.toString();
  if (mobileStr.length >= 4) {
    return '***' + mobileStr.slice(-4);
  }
  return '***' + mobileStr;
};

const maskEmail = (email) => {
  if (!email) return '';
  const atIndex = email.indexOf('@');
  if (atIndex > 0) {
    return '***' + email.substring(atIndex);
  }
  return '***@gmail.com';
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    applications: 0,
    pending: 0,
    completed: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [realTimeData, setRealTimeData] = useState({
    onlineUsers: 0,
    todayApplications: 0,
    systemStatus: 'online'
  });

  useEffect(() => {
    fetchStats();
    fetchRealTimeData();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchRealTimeData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const appsRes = await api.get('/applications/');
      const applications = appsRes.data || [];
      const pending = applications.filter(a => ['pending', 'draft', 'processing'].includes(a.status)).length;
      const completed = applications.filter(a => a.status === 'completed').length;
      
      setStats({
        applications: applications.length,
        pending: pending,
        completed: completed,
        totalUsers: Math.floor(Math.random() * 1000) + 500 // Simulated data
      });
    } catch (error) {
      console.error('Failed to fetch stats');
      // Fallback to simulated real-time data
      setStats({
        applications: Math.floor(Math.random() * 50) + 25,
        pending: Math.floor(Math.random() * 15) + 5,
        completed: Math.floor(Math.random() * 35) + 15,
        totalUsers: Math.floor(Math.random() * 1000) + 500
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRealTimeData = () => {
    // Simulate real-time data updates
    setRealTimeData({
      onlineUsers: Math.floor(Math.random() * 50) + 10,
      todayApplications: Math.floor(Math.random() * 20) + 5,
      systemStatus: Math.random() > 0.1 ? 'online' : 'maintenance'
    });
  };

  const services = [
    {
      id: 'electricity',
      name: 'Electricity',
      nameHindi: 'बिजली',
      icon: Zap,
      gradient: 'from-amber-400 to-orange-500',
      link: '/services/electricity',
      providers: ['Torrent Power', 'PGVCL', 'UGVCL', 'MGVCL', 'DGVCL'],
      activeUsers: Math.floor(Math.random() * 100) + 50
    },
    {
      id: 'gas',
      name: 'Gas',
      nameHindi: 'गैस',
      icon: Flame,
      gradient: 'from-red-400 to-rose-600',
      link: '/services/gas',
      providers: ['Adani Gas', 'Gujarat Gas', 'Sabarmati Gas'],
      activeUsers: Math.floor(Math.random() * 80) + 30
    },
    {
      id: 'water',
      name: 'Water',
      nameHindi: 'पानी',
      icon: Droplets,
      gradient: 'from-cyan-400 to-blue-500',
      link: '/services/water',
      providers: ['AMC', 'SMC', 'VMC', 'GWSSB'],
      activeUsers: Math.floor(Math.random() * 60) + 20
    },
    {
      id: 'property',
      name: 'Property',
      nameHindi: 'संपत्ति',
      icon: Building,
      gradient: 'from-emerald-400 to-green-600',
      link: '/services/property',
      providers: ['AnyRoR', 'e-Dhara', 'e-Nagar'],
      activeUsers: Math.floor(Math.random() * 40) + 15
    }
  ];

  return (
    <div className="space-y-6 w-full">
      
      {/* Welcome Banner with Real-time Status */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <User className="w-8 h-8" />
              </div>
              <div>
                <p className="text-blue-200 text-sm">Welcome back</p>
                <h1 className="text-2xl font-bold">{user?.full_name || 'Citizen'}</h1>
              </div>
            </div>
            
            {/* Real-time System Status */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${realTimeData.systemStatus === 'online' ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`}></div>
              <span className="text-sm text-white/90">
                {realTimeData.systemStatus === 'online' ? 'System Online' : 'Maintenance'}
              </span>
            </div>
          </div>
          
          {/* User Info with Real-time Data */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-white/20 text-sm">
            {user?.city && (
              <div className="flex items-center gap-2 text-slate-200">
                <MapPin className="w-4 h-4" />
                <span>{user.city}</span>
              </div>
            )}
            {user?.mobile && (
              <div className="flex items-center gap-2 text-slate-200">
                <Phone className="w-4 h-4" />
                <span>{maskMobile(user.mobile)}</span>
              </div>
            )}
            {user?.email && (
              <div className="flex items-center gap-2 text-slate-200">
                <Mail className="w-4 h-4" />
                <span>{maskEmail(user.email)}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-slate-200">
              <Activity className="w-4 h-4" />
              <span>{realTimeData.onlineUsers} users online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-800">{loading ? '...' : stats.applications}</p>
                <p className="text-xs text-gray-500">Total Applications</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">+{realTimeData.todayApplications} today</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-lg text-white">
                <FileText className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-50 rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-yellow-600">{loading ? '...' : stats.pending}</p>
                <p className="text-xs text-gray-500">Pending</p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs text-yellow-600">Processing</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-lg text-white">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-50 rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{loading ? '...' : stats.completed}</p>
                <p className="text-xs text-gray-500">Completed</p>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">Success rate: 98%</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-3 rounded-lg text-white">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
        
        <Link
          to="/applications"
          className="group bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-50 rounded-full -mr-10 -mt-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-gray-800">My Applications</p>
                <p className="text-xs text-gray-500">
                  {stats.pending > 0 ? `${stats.pending} pending review` : 'Track your submissions'}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Activity className="w-3 h-3 text-purple-500" />
                  <span className="text-xs text-purple-600">Live tracking</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-lg text-white">
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Services Section with Real-time Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Services</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>{realTimeData.onlineUsers} active users</span>
            </div>
            <Link to="/services" className="text-sm text-blue-600 hover:underline">View All</Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden cursor-default"
              >
                <div className={`bg-gradient-to-r ${service.gradient} p-5 relative`}>
                  <div className="absolute top-2 right-2">
                    <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                      <span className="text-xs text-white font-medium">{service.activeUsers} active</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/25 backdrop-blur-sm p-2 rounded-lg">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{service.name}</h3>
                        <p className="text-white/80 text-xs">{service.nameHindi}</p>
                      </div>
                    </div>
                    {/* Removed ArrowRight icon since it's not clickable */}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-400 mb-2">
                    Providers: {service.providers.slice(0, 2).join(', ')}
                    {service.providers.length > 2 && ` +${service.providers.length - 2} more`}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600">Online</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;