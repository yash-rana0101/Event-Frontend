import React, { useState, useEffect } from 'react';
import {
  Calendar, BarChart3, Users, Clock, MapPin, Settings, Bell, Search, Plus,
  CheckCircle, X, Menu, ChevronRight, Sliders, CheckSquare, Activity,
  Sparkles, ChevronDown, MoreHorizontal, ArrowRight
} from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const OrganizerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [isStatsExpanded, setIsStatsExpanded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize on first load

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      <div className="flex items-center justify-center h-screen bg-black">
        <motion.div
          className="relative flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-24 h-24 rounded-full border-t-4 border-r-4 border-b-4 border-transparent border-l-4 border-cyan-500"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Calendar className="h-8 w-8 text-cyan-500" />
          </motion.div>
          <motion.div
            className="mt-6 text-cyan-500 font-bold text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            EventPro
          </motion.div>
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

  // Nav menu items
  const navItems = [
    { id: 'overview', name: 'Overview', icon: Activity },
    { id: 'events', name: 'Events', icon: Calendar },
    { id: 'attendees', name: 'Attendees', icon: Users },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white overflow-hidden">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 lg:hidden flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-800/50">
              <div className="flex items-center">
                <motion.div
                  whileHover={{ rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Calendar className="h-6 w-6 text-cyan-500" />
                </motion.div>
                <span className="text-cyan-500 text-xl font-bold ml-3">EventPro</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2"
              >
                <X className="h-6 w-6 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              <nav className="px-6">
                <ul className="space-y-3">
                  {navItems.map((item) => (
                    <motion.li
                      key={item.id}
                      whileTap={{ scale: 0.95 }}
                    >
                      <button
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center py-4 px-4 rounded-xl transition-all duration-300 ${activeTab === item.id
                            ? 'bg-cyan-500/20 text-cyan-500'
                            : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                          }`}
                      >
                        <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'text-cyan-500' : 'text-gray-400'}`} />
                        <span className="ml-3 font-medium">{item.name}</span>
                        {activeTab === item.id && (
                          <motion.div
                            className="ml-auto"
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                          >
                            <ChevronRight className="h-5 w-5 text-cyan-500" />
                          </motion.div>
                        )}
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </nav>
            </div>

            <div className="p-6 border-t border-gray-800/50">
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="flex items-center">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 h-10 w-10 rounded-full flex items-center justify-center"
                  >
                    <span className="text-black font-bold">EP</span>
                  </motion.div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">Event Pro</div>
                    <div className="text-xs text-gray-400 truncate">Premium Plan</div>
                  </div>
                  <motion.div
                    whileHover={{ rotate: 90 }}
                  >
                    <Settings className="h-5 w-5 text-gray-400 hover:text-cyan-500 cursor-pointer" />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar - Glass Panel */}
      <motion.div
        className={`fixed top-0 bottom-0 bg-gray-900/80 backdrop-blur-xl border-r border-gray-800/30 z-30 transition-all duration-500 lg:shadow-xl lg:shadow-cyan-500/5
          ${sidebarOpen ? 'left-0 w-64' : '-left-64 lg:left-0 lg:w-20'}`}
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : (window.innerWidth < 768 ? -320 : 0),
          width: sidebarOpen ? 256 : (window.innerWidth < 768 ? 0 : 80)
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-12 bg-gray-900 p-1.5 rounded-full border border-gray-800/80 hidden lg:flex items-center justify-center hover:bg-gray-800 transition-colors shadow-lg shadow-black/20 z-10"
        >
          <motion.div
            animate={{ rotate: sidebarOpen ? 0 : 180 }}
            transition={{ duration: 0.4 }}
          >
            <ChevronRight className="h-4 w-4 text-cyan-500" />
          </motion.div>
        </button>

        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 flex items-center">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20"
            >
              <Calendar className="h-5 w-5 text-black" />
            </motion.div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  className="text-cyan-500 text-xl font-bold ml-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  EventPro
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <nav className="mt-6 flex-1 overflow-y-auto px-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <motion.button
                    onClick={() => setActiveTab(item.id)}
                    whileHover={{ x: sidebarOpen ? 5 : 0 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full flex items-center py-3 px-4 rounded-xl transition-all duration-300 ${activeTab === item.id
                        ? 'bg-gradient-to-r from-cyan-500/20 to-transparent text-cyan-500'
                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                      }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      className={`flex items-center justify-center w-8 h-8 rounded-lg ${activeTab === item.id ? 'bg-cyan-500/20' : 'bg-transparent'
                        }`}
                    >
                      <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'text-cyan-500' : 'text-gray-400'}`} />
                    </motion.div>

                    <AnimatePresence>
                      {sidebarOpen && (
                        <motion.span
                          className="ml-3 truncate"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {activeTab === item.id && sidebarOpen && (
                      <motion.div
                        className="ml-auto"
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="w-1.5 h-6 bg-cyan-500 rounded-full"></div>
                      </motion.div>
                    )}
                  </motion.button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Profile Section */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                className="p-4 m-4 mt-auto border-t border-gray-800/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="bg-gray-800/50 rounded-xl p-3 hover:bg-gray-800/80 transition-all duration-300"
                  whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(6, 182, 212, 0.2)' }}
                >
                  <div className="flex items-center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 h-10 w-10 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/20"
                    >
                      <span className="text-black font-bold">EP</span>
                    </motion.div>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">Event Pro</div>
                      <div className="text-xs text-gray-400 truncate">Premium Plan</div>
                    </div>
                    <motion.div
                      whileHover={{ rotate: 90 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Settings className="h-4 w-4 text-gray-400 hover:text-cyan-500 cursor-pointer" />
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className={`transition-all duration-500 ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'}`}>
        {/* Header */}
        <header className="bg-gray-900/60 backdrop-blur-xl border-b border-gray-800/30 fixed top-0 right-0 left-0 z-20 shadow-lg shadow-black/20">
          <div className="container mx-auto">
            <div className="flex items-center justify-between h-16 px-4 md:px-6">
              {/* Mobile Menu Toggle */}
              <div className="flex items-center lg:hidden">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                >
                  <Menu className="h-5 w-5 text-gray-300" />
                </button>
                <span className="text-cyan-500 text-lg font-bold ml-2">EventPro</span>
              </div>

              {/* Search Bar - Hidden on Mobile */}
              <div className="hidden md:block flex-1 max-w-md">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-4 w-4 text-gray-400 group-hover:text-cyan-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search events, tasks or attendees..."
                    className="w-full py-2 pl-10 pr-4 bg-gray-800/40 border border-gray-700/50 rounded-xl text-sm text-gray-300 
                              focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300
                              group-hover:bg-gray-800/70"
                  />
                </div>
              </div>

              {/* Header Right Section */}
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors relative">
                  <Bell className="h-5 w-5 text-gray-300" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-cyan-500 rounded-full animate-pulse"></span>
                </button>

                <button className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors md:hidden">
                  <Search className="h-5 w-5 text-gray-300" />
                </button>

                <div className="w-px h-6 bg-gray-800/80 mx-1 hidden sm:block"></div>

                <motion.button
                  className="hidden sm:flex items-center space-x-2 p-1.5 rounded-xl bg-gray-800/40 hover:bg-gray-800/80 border border-gray-700/50 transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="h-7 w-7 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
                    <span className="text-black text-xs font-bold">EP</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </motion.button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="pt-24 pb-24 md:pb-8 px-4 md:px-6 lg:px-8">
          {/* Page Title with Animated Underline */}
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

          {/* Quick Actions - Floating Card */}
          <motion.div
            className="mb-10 flex flex-wrap gap-3 p-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.button
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-medium px-5 py-2.5 rounded-xl 
                        flex items-center space-x-2 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="h-4 w-4" />
              <span>New Event</span>
            </motion.button>

            <motion.button
              className="bg-gray-800/60 backdrop-blur-sm text-white font-medium px-5 py-2.5 rounded-xl 
                         flex items-center space-x-2 hover:bg-gray-700/80 transition-all duration-300 border border-gray-700/30"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sliders className="h-4 w-4" />
              <span>Filters</span>
            </motion.button>

            <motion.button
              className="bg-gray-800/60 backdrop-blur-sm text-white font-medium px-5 py-2.5 rounded-xl 
                         flex items-center space-x-2 hover:bg-gray-700/80 transition-all duration-300 border border-gray-700/30"
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
        </main>
      </div>
    </div>
  );
}

export default OrganizerDashboard;