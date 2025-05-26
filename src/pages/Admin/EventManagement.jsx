/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, MoreVertical, Eye, Edit, Trash2, Globe, Clock,
  Calendar, Users, DollarSign, MapPin, Star, ChevronDown, Plus,
  Download, RefreshCw, Play, Pause, StopCircle, AlertTriangle,
  CheckCircle, XCircle, Settings, Share2, BarChart3, Heart,
  MessageSquare, Flag, Award, TrendingUp, Image as ImageIcon
} from 'lucide-react';

export default function EventManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const itemsPerPage = 12;

  // Mock data - replace with actual API calls
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'AI Tech Summit 2024',
      description: 'The biggest AI technology conference of the year featuring industry leaders and cutting-edge innovations.',
      organizer: 'TechCorp Inc.',
      organizerId: 1,
      category: 'Technology',
      status: 'draft',
      publishStatus: 'unpublished',
      startDate: '2024-03-15',
      endDate: '2024-03-17',
      startTime: '09:00',
      endTime: '18:00',
      location: 'San Francisco Convention Center',
      city: 'San Francisco',
      country: 'USA',
      ticketPrice: 299,
      capacity: 2500,
      registeredCount: 0,
      revenue: '$0',
      rating: 0,
      reviewsCount: 0,
      likesCount: 0,
      sharesCount: 0,
      image: '/api/placeholder/400/250',
      tags: ['AI', 'Technology', 'Conference', 'Innovation'],
      createdAt: '2024-01-10',
      lastModified: '2024-01-15',
      featured: false,
      trending: false
    },
    {
      id: 2,
      title: 'Global Music Festival',
      description: 'A three-day music extravaganza featuring top artists from around the world.',
      organizer: 'SoundWave Entertainment',
      organizerId: 2,
      category: 'Music',
      status: 'published',
      publishStatus: 'published',
      startDate: '2024-04-20',
      endDate: '2024-04-22',
      startTime: '14:00',
      endTime: '23:00',
      location: 'Central Park',
      city: 'New York',
      country: 'USA',
      ticketPrice: 150,
      capacity: 50000,
      registeredCount: 32500,
      revenue: '$4,875,000',
      rating: 4.8,
      reviewsCount: 1250,
      likesCount: 8900,
      sharesCount: 2300,
      image: '/api/placeholder/400/250',
      tags: ['Music', 'Festival', 'Entertainment', 'Live'],
      createdAt: '2024-01-05',
      lastModified: '2024-02-10',
      featured: true,
      trending: true
    },
    {
      id: 3,
      title: 'Business Leadership Conference',
      description: 'Annual conference for business leaders and entrepreneurs to network and learn.',
      organizer: 'Business Leaders Inc.',
      organizerId: 3,
      category: 'Business',
      status: 'published',
      publishStatus: 'published',
      startDate: '2024-05-10',
      endDate: '2024-05-12',
      startTime: '08:00',
      endTime: '17:00',
      location: 'Grand Hotel Convention Center',
      city: 'Chicago',
      country: 'USA',
      ticketPrice: 450,
      capacity: 1000,
      registeredCount: 890,
      revenue: '$400,500',
      rating: 4.6,
      reviewsCount: 340,
      likesCount: 1200,
      sharesCount: 450,
      image: '/api/placeholder/400/250',
      tags: ['Business', 'Leadership', 'Networking', 'Conference'],
      createdAt: '2024-02-01',
      lastModified: '2024-02-20',
      featured: false,
      trending: false
    },
    {
      id: 4,
      title: 'Gaming Championship 2024',
      description: 'The ultimate esports tournament with the biggest prizes in gaming history.',
      organizer: 'GameMasters Pro',
      organizerId: 4,
      category: 'Gaming',
      status: 'suspended',
      publishStatus: 'suspended',
      startDate: '2024-06-01',
      endDate: '2024-06-03',
      startTime: '10:00',
      endTime: '22:00',
      location: 'Gaming Arena',
      city: 'Los Angeles',
      country: 'USA',
      ticketPrice: 75,
      capacity: 15000,
      registeredCount: 8500,
      revenue: '$637,500',
      rating: 4.2,
      reviewsCount: 680,
      likesCount: 5600,
      sharesCount: 1800,
      image: '/api/placeholder/400/250',
      tags: ['Gaming', 'Esports', 'Tournament', 'Competition'],
      createdAt: '2024-01-20',
      lastModified: '2024-02-25',
      featured: true,
      trending: false
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'published': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'suspended': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft': return Clock;
      case 'published': return Globe;
      case 'suspended': return Pause;
      case 'cancelled': return XCircle;
      case 'completed': return CheckCircle;
      default: return Clock;
    }
  };

  const handleAction = (event, action) => {
    setSelectedEvent(event);
    setActionType(action);
    setShowActionModal(true);
  };

  const confirmAction = () => {
    if (selectedEvent && actionType) {
      switch (actionType) {
        case 'publish':
          setEvents(prev => prev.map(event =>
            event.id === selectedEvent.id
              ? { ...event, status: 'published', publishStatus: 'published' }
              : event
          ));
          break;
        case 'unpublish':
          setEvents(prev => prev.map(event =>
            event.id === selectedEvent.id
              ? { ...event, status: 'draft', publishStatus: 'unpublished' }
              : event
          ));
          break;
        case 'suspend':
          setEvents(prev => prev.map(event =>
            event.id === selectedEvent.id
              ? { ...event, status: 'suspended', publishStatus: 'suspended' }
              : event
          ));
          break;
        case 'feature':
          setEvents(prev => prev.map(event =>
            event.id === selectedEvent.id
              ? { ...event, featured: !event.featured }
              : event
          ));
          break;
        case 'delete':
          setEvents(prev => prev.filter(event => event.id !== selectedEvent.id));
          break;
        default:
          break;
      }
    }
    setShowActionModal(false);
    setSelectedEvent(null);
    setActionType('');
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || event.category.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = [
    {
      label: 'Total Events',
      value: events.length,
      icon: Calendar,
      color: 'from-cyan-500 to-blue-600',
      change: '+12%'
    },
    {
      label: 'Published Events',
      value: events.filter(e => e.status === 'published').length,
      icon: Globe,
      color: 'from-green-500 to-emerald-600',
      change: '+8%'
    },
    {
      label: 'Draft Events',
      value: events.filter(e => e.status === 'draft').length,
      icon: Clock,
      color: 'from-yellow-500 to-orange-600',
      change: '+15%'
    },
    {
      label: 'Total Revenue',
      value: '$5.9M',
      icon: DollarSign,
      color: 'from-purple-500 to-pink-600',
      change: '+23%'
    }
  ];

  const categories = ['All', 'Technology', 'Music', 'Business', 'Gaming', 'Sports', 'Education', 'Health'];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 opacity-10 rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-600 opacity-15 rounded-full filter blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500 opacity-5 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDAsIDI1NSwgMjU1LCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz4KPC9zdmc+')] opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Event Management
          </motion.h1>
          <p className="text-gray-400 text-sm sm:text-base">Manage all events, publish, review, and control event lifecycle</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-20`}>
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                  <TrendingUp className="w-3 h-3" />
                  <span>{stat.change}</span>
                </div>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm mb-1">{stat.label}</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700/50 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
              {/* Search - Full Width */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search events by title, organizer, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800/60 border border-gray-700/50 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>

              <div className="flex gap-3">
                {/* Status Filter */}
                <div className="relative sm:w-40">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full bg-gray-800/60 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 appearance-none pr-8 cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="suspended">Suspended</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>

                {/* Category Filter */}
                <div className="relative sm:w-40">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full bg-gray-800/60 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 appearance-none pr-8 cursor-pointer"
                  >
                    {categories.map(category => (
                      <option key={category} value={category.toLowerCase()}>{category}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-800/60 rounded-lg border border-gray-700/50">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-lg transition-colors ${viewMode === 'grid'
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'text-gray-400 hover:text-white'
                    }`}
                >
                  <BarChart3 className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-lg transition-colors ${viewMode === 'list'
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'text-gray-400 hover:text-white'
                    }`}
                >
                  <Filter className="w-4 h-4" />
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-lg bg-gray-800/60 text-gray-400 hover:text-cyan-400 transition-colors border border-gray-700/50"
              >
                <RefreshCw className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-lg bg-gray-800/60 text-gray-400 hover:text-cyan-400 transition-colors border border-gray-700/50"
              >
                <Download className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Events Grid/List */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-gray-700/50 overflow-hidden">
          {viewMode === 'grid' ? (
            /* Grid View */
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {paginatedEvents.map((event, index) => {
                  const StatusIcon = getStatusIcon(event.status);
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden hover:border-cyan-500/30 transition-all duration-300 group"
                    >
                      {/* Event Image */}
                      <div className="relative h-48 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                        <ImageIcon className="w-16 h-16 text-gray-600" />
                        {event.featured && (
                          <div className="absolute top-3 left-3 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium border border-yellow-500/30">
                            Featured
                          </div>
                        )}
                        {event.trending && (
                          <div className="absolute top-3 right-3 px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium border border-red-500/30">
                            Trending
                          </div>
                        )}
                        <div className={`absolute bottom-3 left-3 inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                          <StatusIcon className="w-3 h-3" />
                          <span className="capitalize">{event.status}</span>
                        </div>
                      </div>

                      {/* Event Content */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-bold text-lg truncate mb-1">{event.title}</h3>
                            <p className="text-gray-400 text-sm truncate">{event.organizer}</p>
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-white text-sm">{event.rating || 'N/A'}</span>
                          </div>
                        </div>

                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{event.description}</p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center space-x-2 text-sm">
                            <Calendar className="w-4 h-4 text-cyan-400" />
                            <span className="text-gray-300">{event.startDate} - {event.endDate}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <MapPin className="w-4 h-4 text-cyan-400" />
                            <span className="text-gray-300 truncate">{event.location}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Users className="w-4 h-4 text-cyan-400" />
                            <span className="text-gray-300">{event.registeredCount}/{event.capacity}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <Heart className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-400 text-xs">{event.likesCount}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageSquare className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-400 text-xs">{event.reviewsCount}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleAction(event, 'view')}
                              className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>

                            {event.status === 'draft' && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleAction(event, 'publish')}
                                className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                                title="Publish Event"
                              >
                                <Globe className="w-4 h-4" />
                              </motion.button>
                            )}

                            {event.status === 'published' && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleAction(event, 'suspend')}
                                className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 transition-colors"
                                title="Suspend Event"
                              >
                                <Pause className="w-4 h-4" />
                              </motion.button>
                            )}

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleAction(event, 'feature')}
                              className={`p-1.5 rounded-lg transition-colors ${event.featured
                                  ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                                  : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                                }`}
                              title={event.featured ? 'Remove from Featured' : 'Add to Featured'}
                            >
                              <Award className="w-4 h-4" />
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleAction(event, 'delete')}
                              className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                              title="Delete Event"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* List View */
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50 border-b border-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Event</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Attendees</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {paginatedEvents.map((event, index) => {
                    const StatusIcon = getStatusIcon(event.status);
                    return (
                      <motion.tr
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-800/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                              <Calendar className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div>
                              <div className="text-white font-medium">{event.title}</div>
                              <div className="text-gray-400 text-sm">{event.organizer}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                            <StatusIcon className="w-3 h-3" />
                            <span className="capitalize">{event.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{event.startDate}</td>
                        <td className="px-6 py-4 text-gray-300">{event.city}</td>
                        <td className="px-6 py-4 text-white font-medium">{event.registeredCount}/{event.capacity}</td>
                        <td className="px-6 py-4 text-cyan-400 font-medium">{event.revenue}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleAction(event, 'view')}
                              className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>

                            {event.status === 'draft' && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleAction(event, 'publish')}
                                className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                                title="Publish Event"
                              >
                                <Globe className="w-4 h-4" />
                              </motion.button>
                            )}

                            {event.status === 'published' && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleAction(event, 'suspend')}
                                className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 transition-colors"
                                title="Suspend Event"
                              >
                                <Pause className="w-4 h-4" />
                              </motion.button>
                            )}

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleAction(event, 'delete')}
                              className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                              title="Delete Event"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-gray-400 text-sm">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredEvents.length)} of {filteredEvents.length} events
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg bg-gray-800/60 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-700/50"
                >
                  Previous
                </motion.button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <motion.button
                      key={page}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg transition-colors border ${currentPage === page
                          ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                          : 'bg-gray-800/60 text-gray-400 hover:text-white border-gray-700/50'
                        }`}
                    >
                      {page}
                    </motion.button>
                  );
                })}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg bg-gray-800/60 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-700/50"
                >
                  Next
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Modal */}
      <AnimatePresence>
        {showActionModal && selectedEvent && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-white mb-4 capitalize">
                {actionType} Event
              </h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to {actionType} "{selectedEvent.title}"?
                {actionType === 'delete' && ' This action cannot be undone.'}
              </p>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowActionModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-400 hover:text-white transition-colors border border-gray-700/50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmAction}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${actionType === 'delete'
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                      : actionType === 'publish'
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30'
                        : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/30'
                    }`}
                >
                  Confirm
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
