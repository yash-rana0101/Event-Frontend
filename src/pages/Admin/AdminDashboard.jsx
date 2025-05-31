/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, Settings, ChevronDown, TrendingUp, TrendingDown,
  Calendar, Users, Trophy, DollarSign, Activity, Eye, Filter, Download,
  MoreVertical, AlertTriangle, CheckCircle, Clock, MapPin, Star, Zap,
  Globe, Shield, Cpu, Database, ArrowUpRight, ArrowDownRight, Play,
  Pause, BarChart3, PieChart, LineChart, RefreshCw, Target, Layers, Loader
} from 'lucide-react';
import adminService from '../../services/adminService';
import { organizerService } from '../../services/adminService';
import { toast } from 'react-toastify';
import { useLoader } from '../../context/LoaderContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function AdminDashboard() {
  // Authentication and navigation
  const authContext = useAuth();
  const navigate = useNavigate();
  const adminToken = useSelector((state) => state.auth.token);
  const reduxUser = useSelector((state) => state.auth.user);
  const isAdmin = reduxUser?.role === 'admin';

  // Parse user and token from context or localStorage
  const getAuthData = () => {
    try {
      // Prefer Redux token over context/localStorage
      if (adminToken) {
        let user = null;
        if (authContext?.user) {
          user = typeof authContext.user === 'string' ? JSON.parse(authContext.user) : authContext.user;
        } else {
          const persistAuth = localStorage.getItem('persist:auth');
          if (persistAuth) {
            const authData = JSON.parse(persistAuth);
            user = authData.user ? JSON.parse(authData.user) : null;
          }
        }
        return {
          user,
          token: adminToken,
          logout: authContext?.logout || (() => {
            localStorage.removeItem('persist:auth');
            navigate('/admin/login');
          })
        };
      }

      // Fallback to context
      if (authContext?.user && authContext?.token) {
        return {
          user: typeof authContext.user === 'string' ? JSON.parse(authContext.user) : authContext.user,
          token: typeof authContext.token === 'string' ? authContext.token.replace(/"/g, '') : authContext.token,
          logout: authContext.logout || (() => {
            localStorage.removeItem('persist:auth');
            navigate('/admin/login');
          })
        };
      }

      // Fallback to localStorage
      const persistAuth = localStorage.getItem('persist:auth');
      if (persistAuth) {
        const authData = JSON.parse(persistAuth);
        const user = authData.user ? JSON.parse(authData.user) : null;
        const token = authData.token ? authData.token.replace(/"/g, '') : null;
        return {
          user,
          token,
          logout: authContext?.logout || (() => {
            localStorage.removeItem('persist:auth');
            navigate('/admin/login');
          })
        };
      }

      return { user: null, token: null, logout: () => navigate('/admin/login') };
    } catch (error) {
      console.error('Error parsing auth data:', error);
      return { user: null, token: null, logout: () => navigate('/admin/login') };
    }
  };

  const { user, token, logout } = getAuthData();

  // State management
  const [dashboardData, setDashboardData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [topOrganizers, setTopOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 23,
    memory: 67,
    network: 45
  });

  // Animated background particles
  const [particles, setParticles] = useState([]);
  const { setIsLoading } = useLoader();

  // Update loader context
  useEffect(() => {
    setIsLoading(loading || actionLoading);
    return () => setIsLoading(false);
  }, [loading, actionLoading, setIsLoading]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.1,
      duration: Math.random() * 20 + 10
    }));
    setParticles(newParticles);
  }, []);

  // Check authentication and authorization
  useEffect(() => {
    if (!token) {
      toast.error('Please login to access this page');
      navigate('/admin/login');
      return;
    }

    if (!user || user.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }

    // Load dashboard data if authenticated - only run once
    loadDashboardData();
  }, []); // Remove token, user, navigate from dependencies to prevent continuous calls

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch dashboard data using direct axios call
      const dashboardResponse = await axios.get(`${import.meta.env.VITE_API_URL}/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Set dashboard data from response
      setDashboardData(dashboardResponse.data);

      // Set recent events from dashboard response instead of separate call
      if (dashboardResponse.data?.data?.recentActivity?.events) {
        setRecentEvents(dashboardResponse.data.data.recentActivity.events);
      } else {
        setRecentEvents([]);
      }

      // Try to fetch top organizers separately
      try {
        const organizersResponse = await axios.get(`${import.meta.env.VITE_API_URL}/admin/organizers?page=1&limit=3&sortBy=createdAt&sortOrder=desc`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (organizersResponse.data?.success && organizersResponse.data?.data?.organizers) {
          setTopOrganizers(organizersResponse.data.data.organizers);
        } else {
          setTopOrganizers([]);
        }
      } catch (organizersError) {
        console.warn('Organizers not available:', organizersError.message);
        setTopOrganizers([]);
      }

      // Try to fetch analytics (optional)
      try {
        const analyticsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/admin/analytics?timeRange=30d`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setAnalytics(analyticsResponse.data || {});
      } catch (analyticsError) {
        console.warn('Analytics not available:', analyticsError.message);
        setAnalytics({});
      }

      // Set system metrics (placeholder)
      setSystemMetrics({
        cpu: 23,
        memory: 67,
        network: 45
      });

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
      console.error('Error loading dashboard data:', err);
      toast.error('Error loading dashboard data: ' + (err.response?.data?.message || 'Unknown error'));

      // If unauthorized, redirect to login
      if (err.response?.status === 401 || err.response?.status === 403) {
        if (logout) logout();
        navigate('/admin/login');
      }
    }
  }, [token]); // Only depend on token

  const refreshData = useCallback(async () => {
    await loadDashboardData();
    toast.success('Dashboard data refreshed successfully');
  }, [loadDashboardData]);

  // Transform dashboard data into stats cards - Updated for your API structure
  const getStatsCards = () => {
    if (!dashboardData?.data?.overview) return [];

    const overview = dashboardData.data.overview;

    return [
      {
        title: 'Total Events',
        value: overview.totalEvents.count.toLocaleString(),
        change: `${overview.totalEvents.growth >= 0 ? '+' : ''}${overview.totalEvents.growth}%`,
        icon: Calendar,
        trend: overview.totalEvents.growth >= 0 ? 'up' : 'down',
        color: 'from-cyan-500 via-cyan-400 to-blue-500',
        subtitle: 'Active events running',
        metric: `${overview.totalEvents.active} active`,
        pulse: overview.totalEvents.active > 0
      },
      {
        title: 'Total Users',
        value: overview.totalUsers.count.toLocaleString(),
        change: `${overview.totalUsers.growth >= 0 ? '+' : ''}${overview.totalUsers.growth}%`,
        icon: Users,
        trend: overview.totalUsers.growth >= 0 ? 'up' : 'down',
        color: 'from-purple-500 via-pink-500 to-purple-600',
        subtitle: 'Registered participants',
        metric: 'This month',
        pulse: false
      },
      {
        title: 'Registrations',
        value: overview.totalRegistrations.count.toLocaleString(),
        change: `${overview.totalRegistrations.growth >= 0 ? '+' : ''}${overview.totalRegistrations.growth}%`,
        icon: DollarSign,
        trend: overview.totalRegistrations.growth >= 0 ? 'up' : 'down',
        color: 'from-emerald-500 via-green-400 to-teal-500',
        subtitle: 'Total registrations',
        metric: 'Monthly growth',
        pulse: overview.totalRegistrations.count > 0
      },
      {
        title: 'Organizers',
        value: overview.totalOrganizers.count.toString(),
        change: overview.totalOrganizers.pending > 0 ? `${overview.totalOrganizers.pending} pending` : 'All approved',
        icon: Trophy,
        trend: overview.totalOrganizers.pending === 0 ? 'up' : 'down',
        color: 'from-orange-500 via-red-500 to-pink-500',
        subtitle: 'Active event creators',
        metric: `${overview.totalOrganizers.pending} pending`,
        pulse: overview.totalOrganizers.pending > 0
      },
    ];
  };

  const formatRecentEvents = (events) => {
    if (!events || events.length === 0) return [];

    return events.slice(0, 3).map(event => ({
      id: event._id,
      name: event.title,
      organizer: event.organizer?.name || 'Unknown Organizer',
      status: event.status || 'draft',
      attendees: event.attendeesCount || 0,
      revenue: `$${(event.revenue || 0).toLocaleString()}`,
      time: getTimeAgo(event.createdAt),
      location: event.city || event.location || 'Not specified',
      category: event.category || 'General',
      growth: '+0%'
    }));
  };

  const formatTopOrganizers = (organizers) => {
    if (!organizers || organizers.length === 0) return [];

    const colors = [
      'from-cyan-400 to-blue-500',
      'from-purple-400 to-pink-500',
      'from-green-400 to-emerald-500'
    ];

    return organizers.slice(0, 3).map((organizer, index) => ({
      name: organizer.name,
      events: organizer.statistics?.totalEvents || organizer.eventsCount || 0,
      revenue: `$${(organizer.statistics?.totalRevenue || organizer.totalRevenue || 0).toLocaleString()}`,
      rating: organizer.statistics?.avgRating || organizer.rating || 4.5,
      avatar: organizer.avatar || organizer.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      growth: '+0%',
      color: colors[index] || colors[0]
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'live':
      case 'published':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25';
      case 'upcoming':
        return 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/25';
      case 'completed':
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/25';
      case 'draft':
        return 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg shadow-yellow-500/25';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/25';
    }
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? TrendingUp : TrendingDown;
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown';

    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Don't render anything if not authenticated
  if (!token || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="w-8 h-8 animate-spin text-cyan-400" />
          <p className="text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse mb-4 mx-auto"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mb-4 mx-auto" />
          <h2 className="text-xl font-bold text-red-500 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Only render if we have dashboard data - Updated path
  if (!dashboardData?.data) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4 mx-auto" />
          <h2 className="text-xl font-bold text-yellow-500 mb-2">No Dashboard Data</h2>
          <p className="text-gray-400 mb-4">Unable to load dashboard information</p>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  const statsCards = getStatsCards();
  const formattedEvents = formatRecentEvents(recentEvents);
  const formattedOrganizers = formatTopOrganizers(topOrganizers);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 opacity-10 rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-600 opacity-15 rounded-full filter blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500 opacity-5 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>

        {/* Floating Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [particle.opacity, particle.opacity * 0.3, particle.opacity],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDAsIDI1NSwgMjU1LCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz4KPC9zdmc+')] opacity-20"></div>
      </div>

      {/* Main Content - Full Width */}
      <div className="min-h-screen flex flex-col relative">
        {/* Dashboard Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 relative max-w-7xl mx-auto w-full">
          {/* Header with Refresh Button */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-gray-400">Monitor and manage your event platform</p>
            </div>
            <motion.button
              onClick={refreshData}
              className="p-3 rounded-xl bg-gray-800/60 text-gray-400 hover:text-cyan-400 transition-colors backdrop-blur-sm border border-gray-700/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            {statsCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
                whileHover={{ y: -5 }}
              >
                <div className="relative bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-700/50 hover:border-cyan-500/40 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-cyan-500/10 overflow-hidden">
                  {/* Card glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-5 rounded-2xl sm:rounded-3xl transition-opacity duration-500`}></div>

                  {/* Pulse effect for active cards */}
                  {stat.pulse && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                  )}

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                        <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                      </div>
                      <div className={`flex items-center space-x-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold ${stat.trend === 'up' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                        {React.createElement(getTrendIcon(stat.trend), { className: 'w-3 h-3' })}
                        <span>{stat.change}</span>
                      </div>
                    </div>

                    <h3 className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">{stat.title}</h3>
                    <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-gray-500 text-xs mb-2">{stat.subtitle}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-400 text-xs font-medium">{stat.metric}</span>
                      <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 group-hover:text-cyan-400 transition-colors" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Recent Events */}
          <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-700/50 overflow-hidden relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 relative z-10 gap-3">
              <h3 className="text-lg sm:text-xl font-bold text-white">Recent Events</h3>
              <motion.button
                className="p-2 sm:p-2.5 rounded-xl bg-gray-800/60 text-gray-400 hover:text-cyan-400 transition-colors backdrop-blur-sm border border-gray-700/50 self-start sm:self-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin/events')}
              >
                <Eye className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {formattedEvents.length > 0 ? formattedEvents.map((event) => (
                <motion.div
                  key={event.id}
                  className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4 border border-gray-700/30 hover:border-cyan-500/30 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/25 flex-shrink-0">
                      <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-base sm:text-lg font-semibold text-white truncate">{event.name}</h4>
                      <p className="text-gray-400 text-sm truncate">{event.organizer}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm">
                  
                    <span className="text-gray-300">{event.attendees} Attendees</span>
                    <span className="text-gray-300">{event.revenue}</span>
                    <span className="text-gray-500 text-xs">{event.time}</span>
                    <span className="text-gray-500 text-xs">{event.location}</span>
                  </div>
                </motion.div>
              )) : (
                <div className="text-center text-gray-400 py-8">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No recent events found</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Organizers */}
          <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-700/50 overflow-hidden relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 relative z-10 gap-3">
              <h3 className="text-lg sm:text-xl font-bold text-white">Top Organizers</h3>
              <motion.button
                className="p-2 sm:p-2.5 rounded-xl bg-gray-800/60 text-gray-400 hover:text-cyan-400 transition-colors backdrop-blur-sm border border-gray-700/50 self-start sm:self-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin/organizer')}
              >
                <Eye className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {formattedOrganizers.length > 0 ? formattedOrganizers.map((organizer) => (
                <motion.div
                  key={organizer.name}
                  className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4 border border-gray-700/30 hover:border-cyan-500/30 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${organizer.color} rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/25 flex-shrink-0`}>
                      <span className="text-black font-bold text-base sm:text-lg">{organizer.avatar}</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-base sm:text-lg font-semibold text-white truncate">{organizer.name}</h4>
                      <p className="text-gray-400 text-sm">{organizer.events} Events</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm">
                    <span className="text-gray-300">{organizer.revenue}</span>
                    <span className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium ${organizer.rating >= 4.5 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {organizer.rating} <Star className="inline w-3 h-3" />
                    </span>
                  </div>
                </motion.div>
              )) : (
                <div className="text-center text-gray-400 py-8">
                  <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No organizers found</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}