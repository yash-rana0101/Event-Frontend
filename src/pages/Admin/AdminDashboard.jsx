/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, Settings, ChevronDown, TrendingUp, TrendingDown,
  Calendar, Users, Trophy, DollarSign, Activity, Eye, Filter, Download,
  MoreVertical, AlertTriangle, CheckCircle, Clock, MapPin, Star, Zap,
  Globe, Shield, Cpu, Database, ArrowUpRight, ArrowDownRight, Play,
  Pause, BarChart3, PieChart, LineChart, RefreshCw, Target, Layers
} from 'lucide-react';

export default function AdminDashboard() {
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 23,
    memory: 67,
    network: 45
  });

  // Animated background particles
  const [particles, setParticles] = useState([]);

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

  const statsCards = [
    {
      title: 'Total Events',
      value: '2,847',
      change: '+12.5%',
      icon: Calendar,
      trend: 'up',
      color: 'from-cyan-500 via-cyan-400 to-blue-500',
      subtitle: 'Active events running',
      metric: '24 today',
      pulse: true
    },
    {
      title: 'Total Users',
      value: '18,429',
      change: '+8.2%',
      icon: Users,
      trend: 'up',
      color: 'from-purple-500 via-pink-500 to-purple-600',
      subtitle: 'Registered participants',
      metric: '156 new',
      pulse: false
    },
    {
      title: 'Revenue',
      value: '$145,892',
      change: '+15.3%',
      icon: DollarSign,
      trend: 'up',
      color: 'from-emerald-500 via-green-400 to-teal-500',
      subtitle: 'Monthly earnings',
      metric: '$2.4k today',
      pulse: true
    },
    {
      title: 'Organizers',
      value: '456',
      change: '-2.1%',
      icon: Trophy,
      trend: 'down',
      color: 'from-orange-500 via-red-500 to-pink-500',
      subtitle: 'Active event creators',
      metric: '12 verified',
      pulse: false
    },
  ];

  const recentEvents = [
    {
      id: 1,
      name: 'AI Tech Summit 2024',
      organizer: 'TechCorp Inc.',
      status: 'live',
      attendees: 1247,
      revenue: '$12,450',
      time: '2h ago',
      location: 'San Francisco',
      category: 'Technology',
      growth: '+23%'
    },
    {
      id: 2,
      name: 'Global Gaming Championship',
      organizer: 'GameMasters',
      status: 'upcoming',
      attendees: 892,
      revenue: '$8,920',
      time: '5h ago',
      location: 'New York',
      category: 'Gaming',
      growth: '+15%'
    },
    {
      id: 3,
      name: 'Electronic Music Festival',
      organizer: 'SoundWave',
      status: 'completed',
      attendees: 3456,
      revenue: '$34,560',
      time: '1d ago',
      location: 'Los Angeles',
      category: 'Music',
      growth: '+8%'
    },
  ];

  const topOrganizers = [
    { name: 'EventMaster Pro', events: 45, revenue: '$89,234', rating: 4.9, avatar: 'EM', growth: '+12%', color: 'from-cyan-400 to-blue-500' },
    { name: 'Conference Kings', events: 32, revenue: '$67,890', rating: 4.8, avatar: 'CK', growth: '+8%', color: 'from-purple-400 to-pink-500' },
    { name: 'Festival Creators', events: 28, revenue: '$56,123', rating: 4.7, avatar: 'FC', growth: '+15%', color: 'from-green-400 to-emerald-500' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25';
      case 'upcoming': return 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/25';
      case 'completed': return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/25';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/25';
    }
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? TrendingUp : TrendingDown;
  };

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

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
            {/* Revenue Chart */}
            <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-700/50 overflow-hidden relative">
              {/* Chart glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none"></div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 relative z-10 gap-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1">Revenue Analytics</h3>
                  <p className="text-gray-400 text-sm">Monthly revenue trends with AI predictions</p>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    className="p-2 sm:p-2.5 rounded-xl bg-gray-800/60 text-gray-400 hover:text-cyan-400 transition-colors backdrop-blur-sm border border-gray-700/50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    className="p-2 sm:p-2.5 rounded-xl bg-gray-800/60 text-gray-400 hover:text-cyan-400 transition-colors backdrop-blur-sm border border-gray-700/50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Enhanced Chart */}
              <div className="h-64 sm:h-80 bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700/30 relative overflow-hidden">
                {/* Chart background grid */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8cGF0aCBkPSJNIDIwIDAgTCAwIDAgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDAsIDI1NSwgMjU1LCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz4KPC9zdmc+')] opacity-20"></div>
                {/* Placeholder for chart */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* User Growth Chart */}
            <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-700/50 overflow-hidden relative">
              {/* Chart glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none"></div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 relative z-10 gap-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1">User Growth</h3>
                  <p className="text-gray-400 text-sm">Monthly user growth with AI predictions</p>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    className="p-2 sm:p-2.5 rounded-xl bg-gray-800/60 text-gray-400 hover:text-cyan-400 transition-colors backdrop-blur-sm border border-gray-700/50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    className="p-2 sm:p-2.5 rounded-xl bg-gray-800/60 text-gray-400 hover:text-cyan-400 transition-colors backdrop-blur-sm border border-gray-700/50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Enhanced Chart */}
              <div className="h-64 sm:h-80 bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700/30 relative overflow-hidden">
                {/* Chart background grid */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8cGF0aCBkPSJNIDIwIDAgTCAwIDAgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDAsIDI1NSwgMjU1LCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz4KPC9zdmc+')] opacity-20"></div>
                {/* Placeholder for chart */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Events */}
          <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-gray-700/50 overflow-hidden relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 relative z-10 gap-3">
              <h3 className="text-lg sm:text-xl font-bold text-white">Recent Events</h3>
              <motion.button
                className="p-2 sm:p-2.5 rounded-xl bg-gray-800/60 text-gray-400 hover:text-cyan-400 transition-colors backdrop-blur-sm border border-gray-700/50 self-start sm:self-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Filter className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {recentEvents.map((event) => (
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
                    <span className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                    <span className="text-gray-300">{event.attendees} Attendees</span>
                    <span className="text-gray-300">{event.revenue}</span>
                    <span className="text-gray-500 text-xs">{event.time}</span>
                    <span className="text-gray-500 text-xs">{event.location}</span>
                    <span className={`text-xs font-medium ${event.growth.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {event.growth}
                    </span>
                  </div>
                </motion.div>
              ))}
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
              >
                <Filter className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {topOrganizers.map((organizer) => (
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
                    <span className={`text-xs font-medium ${organizer.growth.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {organizer.growth}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}