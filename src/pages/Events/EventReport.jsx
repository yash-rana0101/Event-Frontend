/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft, Calendar, MapPin, Users, BarChart3,
  CheckCircle, Clock, Search, ArrowRight, RefreshCw,
  AlertCircle, Filter, ChevronDown, FileText
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { safelyParseToken } from '../../utils/persistFix';
import { toast } from 'react-toastify';
import { useLoader } from '../../context/LoaderContext';

const EventReport = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');

  const navigate = useNavigate();
  const organizerToken = useSelector(state => state.organizer?.token);
  const { setIsLoading } = useLoader();

  // Set loader context
  useEffect(() => {
    setIsLoading(loading);
    return () => setIsLoading(false);
  }, [loading, setIsLoading]);

  useEffect(() => {
    fetchCompletedEvents();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [events, searchTerm, filterType, sortBy, sortDirection, selectedTimeframe]);

  const fetchCompletedEvents = async () => {
    setLoading(true);
    setRefreshing(true);
    setError(null);

    try {
      const token = safelyParseToken(organizerToken || localStorage.getItem('organizer_token'));

      if (!token) {
        toast.error("Authentication required. Please log in again.");
        navigate('/organizer/login');
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

      const response = await axios.get(
        `${apiUrl}/organizer/events/completed`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Check if response exists and has the expected structure
      if (response && response.data && Array.isArray(response.data.data)) {
        setEvents(response.data.data);
      } else if (response && response.data && Array.isArray(response.data)) {
        // Fallback if data is directly in response.data
        setEvents(response.data);
      } else {
        throw new Error('Invalid response format or no data received');
      }

    } catch (err) {
      console.error("Error fetching completed events:", err);

      // Better error message handling
      let errorMessage = "Failed to fetch completed events";

      if (err.response) {
        // Server responded with error status
        errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = "No response from server. Please check your connection.";
      } else {
        // Something else happened
        errorMessage = err.message || "An unexpected error occurred";
      }

      setError(errorMessage);
      toast.error("Could not load completed events. Please try again later.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...events];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(event =>
        event.title.toLowerCase().includes(term) ||
        event.location?.address?.toLowerCase().includes(term) ||
        event.description?.toLowerCase().includes(term)
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      result = result.filter(event => event.eventType === filterType);
    }

    // Apply timeframe filter
    if (selectedTimeframe !== 'all') {
      const now = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(now.getDate() - 90);

      switch (selectedTimeframe) {
        case '30days':
          result = result.filter(event => new Date(event.endDate) >= thirtyDaysAgo);
          break;
        case '90days':
          result = result.filter(event => new Date(event.endDate) >= ninetyDaysAgo);
          break;
        case 'thisYear':
          result = result.filter(event => new Date(event.endDate).getFullYear() === now.getFullYear());
          break;
        default:
          break;
      }
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return sortDirection === 'asc'
            ? new Date(a.endDate) - new Date(b.endDate)
            : new Date(b.endDate) - new Date(a.endDate);
        case 'attendees':
          return sortDirection === 'asc'
            ? (a.attendeesCount || 0) - (b.attendeesCount || 0)
            : (b.attendeesCount || 0) - (a.attendeesCount || 0);
        case 'title':
          return sortDirection === 'asc'
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    setFilteredEvents(result);
  };

  const handleRefresh = () => {
    fetchCompletedEvents();
  };

  const handleViewReport = (eventId) => {
    navigate(`/organizer/events/report/${eventId}`);
  };

  const formatEventDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleSortDirection = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  // Card animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <motion.div
        className="w-full bg-gradient-to-r from-black to-cyan-950/30 py-8 px-4 md:px-8 border-b border-cyan-900/30"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between mb-4">
            <button
              onClick={() => navigate('/organizer/dashboard')}
              className="flex items-center text-cyan-400 hover:text-cyan-300 mb-4 md:mb-0"
            >
              <ChevronLeft size={18} className="mr-1" />
              Back
            </button>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-200 bg-clip-text text-transparent">
              Event Reports
            </h1>
          </div>

          <p className="text-gray-400 max-w-3xl">
            View analytics and detailed reports for your completed events. Gain insights into attendance, engagement, and event success metrics.
          </p>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-500" />
            <input
              type="text"
              placeholder="Search events..."
              className="w-full pl-10 pr-4 py-2 bg-black border border-cyan-700/50 text-white rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <div className="relative min-w-[150px]">
              <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full pl-10 pr-8 py-2 bg-black border border-cyan-700/50 text-white rounded-lg appearance-none focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              >
                <option value="all">All Types</option>
                <option value="conference">Conference</option>
                <option value="workshop">Workshop</option>
                <option value="webinar">Webinar</option>
                <option value="hackathon">Hackathon</option>
                <option value="meetup">Meetup</option>
              </select>
              <ChevronDown size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-500 pointer-events-none" />
            </div>

            <div className="relative min-w-[150px]">
              <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-500" />
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="w-full pl-10 pr-8 py-2 bg-black border border-cyan-700/50 text-white rounded-lg appearance-none focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              >
                <option value="all">All Time</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="thisYear">This Year</option>
              </select>
              <ChevronDown size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-500 pointer-events-none" />
            </div>

            <motion.button
              className="flex items-center justify-center px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-500 rounded-lg transition-all duration-200 text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 mt-0.5" />
              <div>
                <p className="font-semibold">Error loading events</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Sort options */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-gray-400 text-sm">
            {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">Sort by:</span>
            <button
              className={`text-sm ${sortBy === 'date' ? 'text-cyan-400' : 'text-gray-400'} hover:text-cyan-300`}
              onClick={() => toggleSortDirection('date')}
            >
              Date {sortBy === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
            <button
              className={`text-sm ${sortBy === 'attendees' ? 'text-cyan-400' : 'text-gray-400'} hover:text-cyan-300`}
              onClick={() => toggleSortDirection('attendees')}
            >
              Attendance {sortBy === 'attendees' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
            <button
              className={`text-sm ${sortBy === 'title' ? 'text-cyan-400' : 'text-gray-400'} hover:text-cyan-300`}
              onClick={() => toggleSortDirection('title')}
            >
              Name {sortBy === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((placeholder) => (
              <div key={placeholder} className="bg-gray-900/40 rounded-2xl border border-gray-800/50 p-5 animate-pulse">
                <div className="h-6 bg-gray-800/50 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-800/50 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-800/50 rounded w-5/6 mb-6"></div>
                <div className="flex justify-between items-center">
                  <div className="h-8 bg-gray-800/50 rounded-full w-24"></div>
                  <div className="h-10 bg-gray-800/50 rounded-lg w-32"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredEvents.map((event) => (
              <motion.div
                key={event._id}
                className="bg-gradient-to-br from-gray-900 to-black border border-gray-800/50 hover:border-cyan-600/30 rounded-2xl overflow-hidden group relative"
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                {/* Color overlay based on event type */}
                <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-cyan-950/20 to-transparent"></div>

                {/* Success indicator */}
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                </div>

                <div className="p-6 relative z-10">
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <span className="px-3 py-1 text-xs rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {event.eventType || 'Event'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                      {event.title}
                    </h3>

                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center text-gray-400">
                        <Calendar className="w-4 h-4 mr-2 text-cyan-500" />
                        {formatEventDate(event.endDate)}
                      </div>
                      <div className="flex items-center text-gray-400">
                        <MapPin className="w-4 h-4 mr-2 text-cyan-500" />
                        {event.location?.address || 'Online'}
                      </div>
                      <div className="flex items-center text-gray-400">
                        <Users className="w-4 h-4 mr-2 text-cyan-500" />
                        {event.attendeesCount || 0} Attendees
                      </div>
                    </div>
                  </div>

                  {/* Stats preview */}
                  <div className="mb-6 grid grid-cols-3 gap-2">
                    <div className="bg-gray-900/60 rounded-lg p-2 text-center">
                      <div className="text-cyan-400 text-lg font-semibold">
                        {Math.round((event.attendeesCount || 0) / (event.capacity || 1) * 100)}%
                      </div>
                      <div className="text-xs text-gray-500">Capacity</div>
                    </div>
                    <div className="bg-gray-900/60 rounded-lg p-2 text-center">
                      <div className="text-cyan-400 text-lg font-semibold">
                        {event.checkInRate || '0%'}
                      </div>
                      <div className="text-xs text-gray-500">Check-in</div>
                    </div>
                    <div className="bg-gray-900/60 rounded-lg p-2 text-center">
                      <div className="text-cyan-400 text-lg font-semibold">
                        {event.rating || '-'}
                      </div>
                      <div className="text-xs text-gray-500">Rating</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-cyan-500">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {new Date(event.endDate).toLocaleDateString()}
                    </div>

                    <motion.button
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-black font-medium rounded-lg flex items-center space-x-2 group-hover:shadow-lg group-hover:shadow-cyan-500/20 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleViewReport(event._id)}
                    >
                      <FileText size={16} className="mr-1" />
                      <span>View Report</span>
                      <ArrowRight size={16} className="ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="bg-gray-900/20 text-center py-16 rounded-2xl border border-gray-800/30">
            <BarChart3 className="w-16 h-16 mx-auto text-gray-700 mb-4" />
            <h3 className="text-xl font-medium text-gray-400 mb-2">No Completed Events Found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchTerm || filterType !== 'all' || selectedTimeframe !== 'all'
                ? 'No events match your search criteria. Try adjusting your filters.'
                : 'Once you have completed events, they will appear here with detailed reports.'}
            </p>
            {(searchTerm || filterType !== 'all' || selectedTimeframe !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                  setSelectedTimeframe('all');
                }}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventReport;
