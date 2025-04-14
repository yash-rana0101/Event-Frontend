/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Calendar, BarChart3, Users, Clock, MapPin, Settings, Bell, Search, Plus,
  CheckCircle, X, Menu, ChevronRight, Sliders, CheckSquare, Activity,
  Sparkles, ChevronDown, MoreHorizontal, ArrowRight
} from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';

const OrganizerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [isStatsExpanded, setIsStatsExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const navigate = useNavigate();

  // Sample data
  const upcomingEvents = [
    { id: 1, name: "Tech Conference 2025", date: "March 15, 2025", attendees: 450, status: "confirmed", location: "Grand Convention Center" },
    { id: 2, name: "Product Launch", date: "March 22, 2025", attendees: 200, status: "pending", location: "Innovation Hub" },
    { id: 3, name: "Networking Mixer", date: "April 5, 2025", attendees: 120, status: "confirmed", location: "Sky Lounge" }
  ];

  const statistics = [
    { label: "Total Events", value: 24, icon: Calendar, change: "+12%", color: "from-cyan-500 to-blue-600" },
    { label: "Total Attendees", value: 3845, icon: Users, change: "+24%", color: "from-cyan-400 to-teal-500" },
    { label: "Completion Rate", value: "94%", icon: CheckCircle, change: "+2%", color: "from-emerald-400 to-cyan-500" },
    { label: "Cancellations", value: 3, icon: X, change: "-50%", color: "from-cyan-500 to-indigo-600" }
  ];

  const tasks = [
    { id: 1, title: "Confirm catering for Tech Conference", due: "Mar 10", priority: "high" },
    { id: 2, title: "Send reminder emails for Product Launch", due: "Mar 18", priority: "medium" },
    { id: 3, title: "Book A/V equipment for Networking Mixer", due: "Mar 25", priority: "medium" }
  ];

  // Simulated revenue data for the chart
  const revenueData = [
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 40 },
    { month: 'Mar', value: 85 },
    { month: 'Apr', value: 50 },
    { month: 'May', value: 75 },
    { month: 'Jun', value: 30 },
    { month: 'Jul', value: 60 },
    { month: 'Aug', value: 45 },
    { month: 'Sep', value: 90 },
    { month: 'Oct', value: 55 },
    { month: 'Nov', value: 70 },
    { month: 'Dec', value: 40 }
  ];

  // Revenue chart view type
  const [chartView, setChartView] = useState('monthly');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (activeTab === 'events') {
      setEventsLoading(true);

      // Parse user and token from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token')?.replace(/"/g, ''); // Remove quotes from token

      if (user && token) {
        axios
          .get(`${import.meta.env.VITE_API_URL}/api/events/organizer/${user.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setEvents(Array.isArray(response.data) ? response.data : []);
            setEventsLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching events:', error);
            setEvents([]); // Reset events to an empty array on error
            setEventsLoading(false);
          });
      } else {
        console.error('User or token is missing or invalid');
        setEvents([]); // Reset events to an empty array
        setEventsLoading(false);
      }
    }
  }, [activeTab]);

  const getStatusColor = (status) => {
    return status === 'confirmed' ? 'bg-cyan-500' : 'bg-yellow-500';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // Loading animation
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen ">
        <motion.div
          className="relative flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-20 h-20 rounded-full border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="mt-2 flex space-x-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-cyan-500"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="w-2 h-2 rounded-full bg-cyan-500"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-2 h-2 rounded-full bg-cyan-500"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
            />
          </motion.div>
        </motion.div>
      </div>
    );
  }

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
          >
            <Sliders className="h-4 w-4" />
            <span>Filters</span>
          </motion.button>

          <motion.button
            className="bg-gray-800/60 backdrop-blur-sm text-white font-medium px-5 py-2.5 rounded-xl 
                       flex items-center space-x-2 hover:bg-gray-700/80 transition-all duration-300 border border-gray-700/30 hover:cursor-pointer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Users className="h-4 w-4" />
            <span>Team</span>
          </motion.button>
        </motion.div>

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
          </motion.div>

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
                      {stat.value}
                    </h3>
                    <span className={`text-xs font-medium ${stat.change.includes('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {stat.change}
                      <span className="text-gray-400 ml-1">from last month</span>
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
                    style={{ width: stat.value }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Revenue Chart */}
        <motion.div
          className="bg-gray-900/40 backdrop-blur-sm rounded-2xl p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-xl md:text-2xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Revenue Overview
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setChartView('monthly')}
                className={`text-sm font-medium ${chartView === 'monthly' ? 'text-cyan-500' : 'text-gray-400'} hover:text-cyan-500 transition-colors`}
              >
                Monthly
              </button>
              <button
                onClick={() => setChartView('yearly')}
                className={`text-sm font-medium ${chartView === 'yearly' ? 'text-cyan-500' : 'text-gray-400'} hover:text-cyan-500 transition-colors`}
              >
                Yearly
              </button>
            </div>
          </div>

          <div className="relative h-48 md:h-64">
            <div className="absolute inset-0 flex items-end">
              <div className="w-full h-1 bg-gray-800/60 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                  style={{ width: 'calc(100% / 12)' }}
                  initial={{ width: 0 }}
                  animate={{ width: 'calc(100% / 12 * 5)' }}
                  transition={{ duration: 1.5 }}
                />
              </div>
            </div>

            <div className="flex justify-between mt-2">
              {revenueData.map((data, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                  <span className="text-xs">{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-xl md:text-2xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Upcoming Events
            </h2>
            <button className="text-sm text-cyan-500 hover:text-cyan-400 transition-colors">View all</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <motion.div
                key={event.id}
                className="bg-gray-900/40 backdrop-blur-sm rounded-2xl p-5 border border-gray-800/30 
                          hover:shadow-xl hover:shadow-cyan-500/5 group relative overflow-hidden"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{event.name}</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {event.date} - {event.location}
                    </p>
                  </div>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                </div>
                <div className="flex items-center mt-4">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400 text-sm ml-1">{event.attendees} Attendees</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tasks */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-xl md:text-2xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Tasks
            </h2>
            <button className="text-sm text-cyan-500 hover:text-cyan-400 transition-colors">View all</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                className="bg-gray-900/40 backdrop-blur-sm rounded-2xl p-5 border border-gray-800/30 
                          hover:shadow-xl hover:shadow-cyan-500/5 group relative overflow-hidden"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{task.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Due: {task.due}
                    </p>
                  </div>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div>
            {eventsLoading ? (
              <div className="text-center text-gray-400">Loading events...</div>
            ) : events.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <div
                    key={event._id}
                    className="bg-gray-900/40 backdrop-blur-sm rounded-2xl p-5 border border-gray-800/30 
                              hover:shadow-xl hover:shadow-cyan-500/5 group relative overflow-hidden"
                  >
                    <Link 
                      to={`/event/${event._id}`} 
                      className="text-lg font-bold text-cyan-500 hover:text-cyan-400 transition-colors"
                    >
                      {event.title}
                    </Link>
                    <p className="text-gray-400 text-sm mt-1">{event.date}</p>
                    <p className="text-gray-400 text-sm mt-1">{event.location?.address || 'No location provided'}</p>
                    <div className="flex items-center mt-4">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400 text-sm ml-1">{event.attendeesCount || 0} Attendees</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400">No events found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrganizerDashboard;

