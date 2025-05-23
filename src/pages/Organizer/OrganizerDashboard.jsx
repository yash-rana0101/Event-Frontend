/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Calendar, BarChart3, Users, Clock, MapPin, Settings, Bell, Search, Plus,
  CheckCircle, X, Menu, ChevronRight, Sliders, CheckSquare, Activity,
  Sparkles, ChevronDown, MoreHorizontal, ArrowRight, AlertCircle, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useLoader } from '../../context/LoaderContext';
import { useSelector } from 'react-redux';
import { safelyParseToken } from '../../utils/persistFix';
import { toast } from 'react-toastify';
import { getOrganizerMetrics, getRevenueMetrics } from '../../services/organizerService';

const OrganizerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [isStatsExpanded, setIsStatsExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Event data states
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [eventStats, setEventStats] = useState({
    totalEvents: 0,
    totalAttendees: 0,
    completionRate: 0,
    cancellations: 0,
  });
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState(null);

  const navigate = useNavigate();
  const { setIsLoading } = useLoader();

  // Get auth token from Redux store
  const organizerData = useSelector(state => state.organizer);
  const token = organizerData?.token;
  const user = organizerData?.user;

  // Get organizer ID from user object
  const getOrganizerId = () => {
    if (!user) return null;

    if (typeof user === 'string') {
      try {
        const parsed = JSON.parse(user);
        return parsed?._id || parsed?.id || parsed?._doc?._id;
      } catch (e) {
        console.error('Error parsing organizer data:', e);
        return null;
      }
    }

    return user?._id || user?.id || user?._doc?._id;
  };

  useEffect(() => {
    setIsLoading(loading || eventsLoading);
    return () => setIsLoading(false);
  }, [loading, eventsLoading, setIsLoading]);

  const fetchEvents = async () => {
    setEventsLoading(true);
    setError(null);

    try {
      // Get the clean token
      const parsedToken = safelyParseToken(token);
      const organizerId = getOrganizerId();

      if (!parsedToken || !organizerId) {
        throw new Error('Authentication required. Please log in again.');
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
      const config = {
        headers: {
          Authorization: `Bearer ${parsedToken}`
        }
      };

      // Try different endpoint formats - the error shows we need to fix the URL
      try {
        // First try organizer-specific endpoint
        const response = await axios.get(
          `${apiUrl}/events/organizer/${organizerId}`,
          config
        );
        setEvents(response.data);
      } catch (err1) {
        console.warn("First endpoint failed, trying fallback:", err1);

        try {
          // Try general events endpoint with organizer filter
          const fallbackResponse = await axios.get(
            `${apiUrl}/events`,
            {
              params: { organizer: organizerId },
              headers: config.headers
            }
          );

          setEvents(Array.isArray(fallbackResponse.data)
            ? fallbackResponse.data
            : fallbackResponse.data.events || []);
        } catch (err2) {
          console.error("All endpoints failed:", err2);
          throw err2;
        }
      }

      // Sort events into upcoming and past
      const now = new Date();
      const upcoming = events.filter(event => {
        const eventDate = new Date(event.date || event.startDate);
        return eventDate > now;
      }).slice(0, 3); // Show only 3 upcoming events

      const past = events.filter(event => {
        const eventDate = new Date(event.date || event.startDate);
        return eventDate <= now;
      }).slice(0, 3); // Show only 3 past events

      setUpcomingEvents(upcoming);
      setPastEvents(past);

      // Calculate basic stats
      setEventStats({
        totalEvents: events.length,
        totalAttendees: events.reduce((sum, event) => sum + (event.attendeesCount || 0), 0),
        completionRate: Math.round((past.length / Math.max(events.length, 1)) * 100) + '%',
        cancellations: events.filter(event => event.status === 'cancelled').length
      });
    } catch (err) {
      console.error("Error fetching events:", err);

      // Provide more specific error message for 404
      if (err.response?.status === 404) {
        setError("Could not find events API endpoint. The server returned a 404 error.");
      } else {
        setError(err.response?.data?.message || err.message || "Failed to load events");
      }

      // Show a descriptive toast with debugging hint
      toast.error(`Could not load events: ${err.response?.status === 404 ?
        "API endpoint not found (404)" :
        "Server error"}`);
    } finally {
      setEventsLoading(false);
      setLoading(false);
    }
  };

  // Fetch metrics data
  const fetchMetrics = async () => {
    setMetricsLoading(true);
    setMetricsError(null);

    try {
      const metricsResponse = await getOrganizerMetrics();
      setMetrics(metricsResponse.data);
    } catch (err) {
      console.error("Error fetching metrics:", err);
      setMetricsError(err.response?.data?.message || "Failed to load metrics");
      toast.error("Failed to load metrics data");
    } finally {
      setMetricsLoading(false);
    }
  };

  // Update the useEffect to fetch metrics
  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([
        fetchEvents(),
        fetchMetrics()
      ]);
    };

    fetchAllData();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'confirmed':
        return 'bg-cyan-500 text-black';
      case 'pending':
        return 'bg-yellow-500 text-black';
      case 'cancelled':
        return 'bg-red-500 text-white';
      case 'completed':
        return 'bg-green-500 text-black';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatEventDate = (event) => {
    if (event.startDate && event.endDate) {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);

      if (start.toDateString() === end.toDateString()) {
        return new Date(event.startDate).toLocaleDateString();
      } else {
        return `${new Date(event.startDate).toLocaleDateString()} - ${new Date(event.endDate).toLocaleDateString()}`;
      }
    }
    return event.date || new Date(event.startDate || event.createdAt).toLocaleDateString();
  };

  // Update statistics generation to use real metrics data
  const statistics = metrics ? [
    {
      label: "Total Events",
      value: metrics.metrics.totalEvents.value,
      icon: Calendar,
      change: metrics.metrics.totalEvents.change,
      color: "from-cyan-500 to-blue-600",
      trend: metrics.metrics.totalEvents.trend
    },
    {
      label: "Total Attendees",
      value: metrics.metrics.totalAttendees.value,
      icon: Users,
      change: metrics.metrics.totalAttendees.change,
      color: "from-cyan-400 to-teal-500",
      trend: metrics.metrics.totalAttendees.trend
    },
    {
      label: "Completion Rate",
      value: metrics.metrics.completionRate.value,
      icon: CheckCircle,
      change: metrics.metrics.completionRate.change,
      color: "from-emerald-400 to-cyan-500",
      trend: metrics.metrics.completionRate.trend
    },
    {
      label: "Cancellations",
      value: metrics.metrics.cancellations.value,
      icon: X,
      change: metrics.metrics.cancellations.change,
      color: "from-cyan-500 to-indigo-600",
      trend: metrics.metrics.cancellations.trend
    }
  ] : [
    // Fallback static data while loading
    {
      label: "Total Events",
      value: eventStats.totalEvents,
      icon: Calendar,
      change: "+12%",
      color: "from-cyan-500 to-blue-600"
    },
    {
      label: "Total Attendees",
      value: eventStats.totalAttendees,
      icon: Users,
      change: "+24%",
      color: "from-cyan-400 to-teal-500"
    },
    {
      label: "Completion Rate",
      value: eventStats.completionRate,
      icon: CheckCircle,
      change: "+2%",
      color: "from-emerald-400 to-cyan-500"
    },
    {
      label: "Cancellations",
      value: eventStats.cancellations,
      icon: X,
      change: "-50%",
      color: "from-cyan-500 to-indigo-600"
    }
  ];

  // Error display component
  const ErrorDisplay = ({ message }) => (
    <div className="bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl p-4 flex items-start">
      <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
      <div>
        <p className="font-medium">Error loading data</p>
        <p className="text-sm">{message}</p>
        <button
          onClick={fetchEvents}
          className="mt-2 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-stone-400">
      {/* Main Content */}
      <div className="py-10 pb-24 md:pb-8 px-4 md:px-6 lg:px-8">
        {/* Page Title */}
        <div className="mb-8">
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <motion.div
              className="ml-3 flex items-center text-cyan-500 opacity-80"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            >
              <Sparkles className="h-5 w-5" />
            </motion.div>
          </motion.div>
          <motion.div
            className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-blue-600 mt-2 rounded-full"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '6rem', opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          ></motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          className="mb-10 flex flex-wrap gap-3 p-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.button
            className="px-6 py-3 rounded-xl bg-gradient-to-r bg-cyan-400 text-black font-medium transition-colors cursor-pointer flex items-center space-x-2 hover:bg-black hover:text-cyan-400 hover:border hover:border-cyan-400"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/organizer/create')}
          >
            <Plus className="h-4 w-4" />
            <span>Create Event</span>
          </motion.button>

          <motion.button
            className="bg-gray-800/60 backdrop-blur-sm text-white font-medium px-5 py-2.5 rounded-xl 
                       flex items-center space-x-2 hover:bg-gray-700/80 transition-all duration-300 border border-gray-700/30 hover:cursor-pointer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/organizer/profile')}
          >
            <Users className="h-4 w-4" />
            <span>My Profile</span>
          </motion.button>

          <motion.button
            className="bg-gray-800/60 backdrop-blur-sm text-white font-medium px-5 py-2.5 rounded-xl 
                       flex items-center space-x-2 hover:bg-gray-700/80 transition-all duration-300 border border-gray-700/30 hover:cursor-pointer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/organizer/events/list')}
          >
            <Calendar className="h-4 w-4" />
            <span>All Events</span>
          </motion.button>
        </motion.div>

        {/* Display error if there is one */}
        {error && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ErrorDisplay message={error} />
          </motion.div>
        )}

        {/* Statistics Cards */}
        <div className="mb-10">
          <motion.div
            className="flex items-center justify-between mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="font-bold text-xl md:text-2xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Key Metrics
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchMetrics}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center"
                disabled={metricsLoading}
              >
                <RefreshCw className={`w-3 h-3 mr-1 ${metricsLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setIsStatsExpanded(!isStatsExpanded)}
                className="text-sm text-cyan-500 hover:text-cyan-400 transition-colors flex items-center"
              >
                <span>{isStatsExpanded ? 'Show less' : 'Show more'}</span>
                <motion.div
                  animate={{ rotate: isStatsExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="h-4 w-4 ml-1" />
                </motion.div>
              </button>
            </div>
          </motion.div>

          {metricsError && (
            <div className="bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl p-4 mb-6">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 mt-0.5" />
                <div>
                  <p className="font-semibold">Error loading metrics</p>
                  <p className="text-sm mt-1">{metricsError}</p>
                </div>
              </div>
            </div>
          )}

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {statistics.slice(0, isStatsExpanded ? 4 : 2).map((stat, index) => (
              <motion.div
                key={index}
                className="bg-gray-900/40 backdrop-blur-sm rounded-2xl p-5 border border-gray-800/30 
                          hover:shadow-xl hover:shadow-cyan-500/5 group relative overflow-hidden"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.3 }
                }}
              >
                {/* Animated background gradient */}
                <motion.div
                  className={`absolute -inset-1 bg-gradient-to-r ${stat.color} opacity-0 blur-xl group-hover:opacity-20 
                              transition-opacity duration-700 z-0`}
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />

                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <h3 className="text-3xl font-bold mt-1 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      {metricsLoading ? (
                        <div className="w-16 h-8 bg-gray-700 animate-pulse rounded"></div>
                      ) : (
                        stat.value
                      )}
                    </h3>
                    <span className={`text-xs font-medium ${stat.change?.includes('+') ? 'text-green-400' :
                        stat.change?.includes('-') ? 'text-red-400' : 'text-gray-400'
                      }`}>
                      {metricsLoading ? (
                        <div className="w-12 h-3 bg-gray-700 animate-pulse rounded"></div>
                      ) : (
                        <>
                          {stat.change}
                          <span className="text-gray-400 ml-1">from last month</span>
                        </>
                      )}
                    </span>
                  </div>
                  <motion.div
                    className={`p-3 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 
                              border border-gray-700/30 shadow-lg shadow-black/40 group-hover:shadow-cyan-500/10 
                              flex items-center justify-center`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <stat.icon className="h-5 w-5 text-cyan-500" />
                  </motion.div>
                </div>

                <div className="mt-4 h-2 w-full bg-gray-800/60 rounded-full overflow-hidden relative z-10">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                    style={{
                      width: metricsLoading ? '50%' :
                        typeof stat.value === 'string' ? (parseInt(stat.value) || 50) + '%' :
                          `${Math.min(100, Math.max(10, (stat.value / 100) * 100))}%`
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Upcoming Events */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center justify-between my-6">
            <h2 className="font-bold text-xl md:text-2xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Upcoming Events
            </h2>
            <button className="px-3 py-2 rounded-xl bg-gradient-to-r bg-cyan-400 text-black font-medium transition-colors cursor-pointer flex space-x-2 hover:bg-black hover:text-cyan-400 hover:border hover:border-cyan-400"
              onClick={() => navigate('/organizer/events/list')}
            >
              View all
            </button>
          </div>

          {eventsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-900/40 backdrop-blur-sm rounded-2xl p-5 border border-gray-800/30 animate-pulse">
                  <div className="h-6 bg-gray-800 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-800 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-800 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <motion.div
                  key={event._id}
                  className="bg-gray-900/40 backdrop-blur-sm rounded-2xl p-5 border border-gray-800/30 
                           hover:shadow-xl hover:shadow-cyan-500/5 group relative overflow-hidden cursor-pointer"
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(`/event/${event._id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-white">{event.title}</h3>
                      <p className="text-gray-400 text-sm mt-1">
                        {formatEventDate(event)}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        {event.location?.address || event.venue || "No location specified"}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(event.status)}`}>
                      {event.status || 'active'}
                    </span>
                  </div>
                  <div className="flex items-center mt-4 justify-between">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400 text-sm ml-1">{event.attendeesCount || 0} Attendees</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-cyan-500 transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-900/30 border border-gray-800/30 rounded-xl p-8 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-600 mb-3" />
              <h3 className="text-xl font-medium text-gray-400 mb-2">No Upcoming Events</h3>
              <p className="text-gray-500 mb-6">You don't have any upcoming events scheduled.</p>
              <button
                onClick={() => navigate('/organizer/create')}
                className="px-6 py-3 bg-cyan-500 text-black font-medium rounded-xl hover:bg-cyan-600 transition-colors"
              >
                Create Your First Event
              </button>
            </div>
          )}
        </motion.div>

        {/* Past Events Section */}
        {pastEvents.length > 0 && (
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex items-center justify-between my-6">
              <h2 className="font-bold text-xl md:text-2xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Past Events
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pastEvents.map((event) => (
                <motion.div
                  key={event._id}
                  className="bg-gray-900/30 rounded-xl p-4 border border-gray-800/30 hover:bg-gray-900/50 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate(`/event/${event._id}`)}
                >
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium text-gray-300">{event.title}</h4>
                      <div className="flex flex-wrap gap-x-4 text-xs text-gray-400 mt-1">
                        <div className="flex items-center">
                          <Calendar size={12} className="mr-1" />
                          {formatEventDate(event)}
                        </div>
                        <div className="flex items-center">
                          <Users size={12} className="mr-1" />
                          {event.attendeesCount || 0}
                        </div>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">
                      <ArrowRight size={12} className="text-gray-500 group-hover:text-cyan-500" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Event Reports Section */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="flex items-center justify-between my-6">
            <h2 className="font-bold text-xl md:text-2xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Reports & Analytics
            </h2>
          </div>

          <div className="bg-gray-900/30 border border-gray-800/30 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                className="bg-gray-800/50 rounded-lg p-5 border border-gray-700/30 hover:border-cyan-500/30 transition-colors cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => navigate('/organizer/events/attendance/list')}
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center mr-3">
                    <Users className="h-5 w-5 text-cyan-500" />
                  </div>
                  <h3 className="font-medium text-lg">Attendance Reports</h3>
                </div>
                <p className="text-gray-400 text-sm">View detailed attendance information for your events</p>
              </motion.div>

              <motion.div
                className="bg-gray-800/50 rounded-lg p-5 border border-gray-700/30 hover:border-cyan-500/30 transition-colors cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => navigate('/organizer/reports/revenue')}
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mr-3">
                    <BarChart3 className="h-5 w-5 text-green-500" />
                  </div>
                  <h3 className="font-medium text-lg">Revenue Analytics</h3>
                </div>
                <p className="text-gray-400 text-sm">Track financial performance of your events</p>
              </motion.div>

              <motion.div
                className="bg-gray-800/50 rounded-lg p-5 border border-gray-700/30 hover:border-cyan-500/30 transition-colors cursor-pointer"
                whileHover={{ y: -5 }}
                onClick={() => navigate('/organizer/events/report/list')}
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mr-3">
                    <Activity className="h-5 w-5 text-purple-500" />
                  </div>
                  <h3 className="font-medium text-lg">Event Report</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Analyze the Report of your All events 
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default OrganizerDashboard;

