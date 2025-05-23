/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Download, Filter, Check, X, Mail, Phone,
  Clock, Calendar, MapPin, User, UserCheck, UserX,
  MoreHorizontal, ChevronDown, ChevronUp, UserPlus,
  ArrowLeft, RefreshCw, AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { safelyParseToken } from '../../utils/persistFix';

export default function EventAttendees() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [attendees, setAttendees] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const [statsVisible, setStatsVisible] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [showAddAttendee, setShowAddAttendee] = useState(false);
  const [newAttendee, setNewAttendee] = useState({
    name: '',
    email: '',
    phone: '',
    ticketType: 'Regular'
  });

  // Get auth token from Redux store
  const organizerToken = useSelector(state => state.organizer?.token);

  // Sample statuses for filtering
  const statusOptions = [
    { value: 'all', label: 'All Attendees' },
    { value: 'checked-in', label: 'Checked In' },
    { value: 'not-checked-in', label: 'Not Checked In' },
    { value: 'vip', label: 'VIP' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const ticketTypes = ['Regular', 'VIP', 'Early Bird', 'Student', 'Group'];

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get the clean token
      const token = safelyParseToken(organizerToken || localStorage.getItem('organizer_token'));
      
      if (!token) {
        toast.error('Authentication required. Please log in again.');
        navigate('/organizer/login');
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
      
      // Get event details
      const eventResponse = await axios.get(`${apiUrl}/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setEvent(eventResponse.data);

      // Get attendees for this event
      const attendeesResponse = await axios.get(
        `${apiUrl}/organizer/events/${eventId}/attendees`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!attendeesResponse.data || !attendeesResponse.data.data) {
        throw new Error('Invalid response format from server');
      }

      // Set attendees from response
      setAttendees(attendeesResponse.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      
      // Handle specific errors
      if (error.response?.status === 401) {
        toast.error('Your session has expired. Please log in again.');
        navigate('/organizer/login');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to access this event\'s attendees.');
        navigate('/organizer/events/list');
      } else if (error.response?.status === 404) {
        toast.error('Event not found or has been deleted.');
        navigate('/organizer/events/list');
      } else {
        setError(error.response?.data?.message || error.message || 'Failed to load attendee data');
        toast.error('Failed to load attendee data. Using sample data instead.');
        // Fallback to sample data for demo
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  // Handle check-in/out
  const handleCheckInToggle = async (attendeeId, currentStatus) => {
    const newStatus = currentStatus === 'checked-in' ? 'not-checked-in' : 'checked-in';

    try {
      const token = safelyParseToken(organizerToken || localStorage.getItem('organizer_token'));
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

      // Update on server
      await axios.post(
        `${apiUrl}/organizer/events/${eventId}/attendees/${attendeeId}/check-in`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );

      // Update local state
      setAttendees(prevAttendees =>
        prevAttendees.map(attendee =>
          attendee._id === attendeeId
            ? {
              ...attendee,
              checkInStatus: newStatus,
              checkInTime: newStatus === 'checked-in' ? new Date().toISOString() : null
            }
            : attendee
        )
      );

      toast.success(`Attendee ${newStatus === 'checked-in' ? 'checked in' : 'checked out'} successfully`);
    } catch (error) {
      console.error('Error updating check-in status:', error);
      toast.error(error.response?.data?.message || 'Failed to update check-in status');
    }
  };

  // Handle add attendee manually
  const handleAddAttendee = async () => {
    try {
      // Validate form data
      if (!newAttendee.name.trim() || !newAttendee.email.trim()) {
        toast.warning('Name and email are required');
        return;
      }

      const token = safelyParseToken(organizerToken || localStorage.getItem('organizer_token'));
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

      const response = await axios.post(
        `${apiUrl}/organizer/events/${eventId}/attendees`,
        newAttendee,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Add the new attendee to the state
      setAttendees(prev => [...prev, response.data.data]);
      
      // Reset form and close modal
      setNewAttendee({
        name: '',
        email: '',
        phone: '',
        ticketType: 'Regular'
      });
      setShowAddAttendee(false);
      
      toast.success('Attendee added successfully');
    } catch (error) {
      console.error('Error adding attendee:', error);
      toast.error(error.response?.data?.message || 'Failed to add attendee');
    }
  };

  // Filter and sort attendees
  const filteredAttendees = attendees
    .filter(attendee => {
      // Apply search filter
      const matchesSearch =
        searchQuery === '' ||
        attendee.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attendee.email?.toLowerCase().includes(searchQuery.toLowerCase());

      // Apply status filter
      const matchesStatus =
        filterStatus === 'all' ||
        attendee.checkInStatus === filterStatus;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Apply sorting
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'checkInStatus':
          comparison = (a.checkInStatus || '').localeCompare(b.checkInStatus || '');
          break;
        case 'registrationDate':
          comparison = new Date(a.registrationDate) - new Date(b.registrationDate);
          break;
        default:
          comparison = 0;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

  // Calculate statistics
  const stats = {
    total: attendees.length,
    checkedIn: attendees.filter(a => a.checkInStatus === 'checked-in').length,
    notCheckedIn: attendees.filter(a => a.checkInStatus === 'not-checked-in').length,
    vip: attendees.filter(a => a.checkInStatus === 'vip' || a.ticketType === 'VIP').length,
    cancelled: attendees.filter(a => a.checkInStatus === 'cancelled').length,
  };

  // Handle sorting change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  // Handle export to CSV
  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Ticket Type', 'Status', 'Registration Date', 'Check-in Time'];

    const csvData = filteredAttendees.map(attendee => [
      attendee.name,
      attendee.email,
      attendee.phone || 'N/A',
      attendee.ticketType || 'Regular',
      attendee.checkInStatus || 'Not Checked In',
      new Date(attendee.registrationDate).toLocaleString(),
      attendee.checkInTime ? new Date(attendee.checkInTime).toLocaleString() : 'N/A'
    ]);

    csvData.unshift(headers);

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${event?.title || 'event'}-attendees.csv`);
    link.click();
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAttendee(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <motion.div
        className="w-full bg-gradient-to-r from-black via-black to-cyan-950 py-8 px-4 md:px-8 border-b border-cyan-900/30"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between mb-4">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-cyan-400 hover:text-cyan-300 mb-4 md:mb-0"
            >
              <ArrowLeft size={18} className="mr-1" />
              Back 
            </button>
          
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-cyan-500 mb-2">Event Attendees</h1>
          </div>
          
          {event && (
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <h2 className="text-xl md:text-2xl font-medium text-white">{event.title}</h2>
                <div className="flex items-center mt-2 text-sm text-cyan-300/80">
                  <Calendar size={16} className="mr-2" />
                  <span>{new Date(event.date || event.startDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center mt-1 text-sm text-cyan-300/80">
                  <MapPin size={16} className="mr-2" />
                  <span>{event.location?.address || 'Location not specified'}</span>
                </div>
              </div>

              <div className="flex flex-col">
                <motion.button
                  className="flex items-center justify-center px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-black rounded mt-4 md:mt-0 transition-all duration-200 text-sm font-semibold"
                  whileTap={{ scale: 0.95 }}
                  onClick={exportToCSV}
                >
                  <Download size={16} className="mr-2" /> Export Attendee List
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-cyan-300">Loading attendees...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 mt-0.5" />
              <div>
                <p className="font-semibold">Error loading attendees</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <motion.div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 transition-all duration-300 ${statsVisible ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}
              variants={containerVariants}
              initial="hidden"
              animate={statsVisible ? "visible" : "hidden"}
            >
              <motion.div variants={itemVariants} className="bg-gradient-to-br from-gray-900 to-black border border-cyan-900/50 rounded-lg p-4 shadow-lg shadow-cyan-900/10">
                <div className="text-sm text-cyan-400 mb-1">Total Attendees</div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-xs text-cyan-300/60 mt-2">Registered for this event</div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-gradient-to-br from-green-900/20 to-black border border-green-500/30 rounded-lg p-4 shadow-lg shadow-green-900/10">
                <div className="text-sm text-green-400 mb-1">Checked In</div>
                <div className="text-2xl font-bold">{stats.checkedIn}</div>
                <div className="text-xs text-green-300/60 mt-2">{stats.total ? Math.round((stats.checkedIn / stats.total) * 100) : 0}% of total attendees</div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-gradient-to-br from-yellow-900/20 to-black border border-yellow-500/30 rounded-lg p-4 shadow-lg shadow-yellow-900/10">
                <div className="text-sm text-yellow-400 mb-1">Not Checked In</div>
                <div className="text-2xl font-bold">{stats.notCheckedIn}</div>
                <div className="text-xs text-yellow-300/60 mt-2">{stats.total ? Math.round((stats.notCheckedIn / stats.total) * 100) : 0}% of total attendees</div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/30 rounded-lg p-4 shadow-lg shadow-purple-900/10">
                <div className="text-sm text-purple-400 mb-1">VIP Attendees</div>
                <div className="text-2xl font-bold">{stats.vip}</div>
                <div className="text-xs text-purple-300/60 mt-2">{stats.total ? Math.round((stats.vip / stats.total) * 100) : 0}% of total attendees</div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-gradient-to-br from-red-900/20 to-black border border-red-500/30 rounded-lg p-4 shadow-lg shadow-red-900/10">
                <div className="text-sm text-red-400 mb-1">Cancelled</div>
                <div className="text-2xl font-bold">{stats.cancelled}</div>
                <div className="text-xs text-red-300/60 mt-2">{stats.total ? Math.round((stats.cancelled / stats.total) * 100) : 0}% of total attendees</div>
              </motion.div>
            </motion.div>

            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setStatsVisible(!statsVisible)}
                className="text-xs md:text-sm text-cyan-400 hover:text-cyan-300 flex items-center"
              >
                {statsVisible ? <ChevronUp size={16} className="mr-1" /> : <ChevronDown size={16} className="mr-1" />}
                {statsVisible ? 'Hide Statistics' : 'Show Statistics'}
              </button>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-500" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="w-full pl-10 pr-4 py-2 bg-black border border-cyan-700/50 text-white rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2 md:min-w-[250px]">
                <div className="relative flex-1">
                  <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-500" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-black border border-cyan-700/50 text-white rounded-lg appearance-none focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-500 pointer-events-none" />
                </div>
              </div>

              <motion.button
                className="flex items-center justify-center px-4 py-2 bg-cyan-900/50 hover:bg-cyan-800 border border-cyan-700/50 rounded transition-all duration-200 text-cyan-100 text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('all');
                  setSortBy('name');
                  setSortDirection('asc');
                }}
              >
                Reset Filters
              </motion.button>

              <motion.button
                className="flex items-center justify-center px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-500 rounded transition-all duration-200 text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </motion.button>
            </div>

            {/* Attendees Table */}
            <div className="relative overflow-x-auto rounded-lg border border-cyan-900/30 mb-8 shadow-lg shadow-cyan-900/10">
              <table className="w-full text-sm text-left">
                <thead className="bg-gradient-to-r from-cyan-900/30 to-black text-cyan-300 text-xs uppercase">
                  <tr>
                    <th scope="col" className="px-4 py-3 cursor-pointer" onClick={() => handleSortChange('name')}>
                      <div className="flex items-center">
                        Name
                        {sortBy === 'name' && (
                          sortDirection === 'asc' ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-4 py-3 cursor-pointer hidden md:table-cell">Email</th>
                    <th scope="col" className="px-4 py-3 hidden lg:table-cell">Ticket Type</th>
                    <th scope="col" className="px-4 py-3 cursor-pointer" onClick={() => handleSortChange('checkInStatus')}>
                      <div className="flex items-center">
                        Status
                        {sortBy === 'checkInStatus' && (
                          sortDirection === 'asc' ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-4 py-3 cursor-pointer hidden lg:table-cell" onClick={() => handleSortChange('registrationDate')}>
                      <div className="flex items-center">
                        Registered
                        {sortBy === 'registrationDate' && (
                          sortDirection === 'asc' ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendees.length > 0 ? (
                    filteredAttendees.map((attendee, index) => (
                      <motion.tr
                        key={attendee._id || index}
                        className={`border-b border-gray-800 hover:bg-cyan-950/10 ${index % 2 === 0 ? 'bg-black/40' : 'bg-black/60'}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <td className="px-4 py-3 font-medium whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-cyan-600 to-cyan-400 rounded-full flex items-center justify-center text-black font-bold mr-3">
                              {attendee.name?.charAt(0) || 'A'}
                            </div>
                            {attendee.name}
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">{attendee.email}</td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className={`px-2 py-1 rounded-full text-xs ${attendee.ticketType === 'VIP'
                              ? 'bg-purple-900/30 text-purple-300 border border-purple-500/30'
                              : attendee.ticketType === 'Early Bird'
                                ? 'bg-blue-900/30 text-blue-300 border border-blue-500/30'
                                : 'bg-gray-800 text-gray-300 border border-gray-700'
                            }`}>
                            {attendee.ticketType || 'Regular'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${attendee.checkInStatus === 'checked-in'
                              ? 'bg-green-900/30 text-green-300 border border-green-500/30'
                              : attendee.checkInStatus === 'cancelled'
                                ? 'bg-red-900/30 text-red-300 border border-red-500/30'
                                : attendee.checkInStatus === 'vip'
                                  ? 'bg-purple-900/30 text-purple-300 border border-purple-500/30'
                                  : 'bg-yellow-900/30 text-yellow-300 border border-yellow-500/30'
                            }`}>
                            {attendee.checkInStatus === 'checked-in'
                              ? 'Checked In'
                              : attendee.checkInStatus === 'cancelled'
                                ? 'Cancelled'
                                : attendee.checkInStatus === 'vip'
                                  ? 'VIP'
                                  : 'Not Checked In'}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          {attendee.registrationDate ? (
                            <div className="flex flex-col">
                              <span>{new Date(attendee.registrationDate).toLocaleDateString()}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(attendee.registrationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ) : 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {attendee.checkInStatus !== 'cancelled' && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-1 rounded ${attendee.checkInStatus === 'checked-in'
                                    ? 'bg-red-900/20 text-red-400 hover:bg-red-900/40'
                                    : 'bg-green-900/20 text-green-400 hover:bg-green-900/40'
                                  }`}
                                onClick={() => handleCheckInToggle(attendee._id, attendee.checkInStatus)}
                                title={attendee.checkInStatus === 'checked-in' ? 'Remove check-in' : 'Check in'}
                              >
                                {attendee.checkInStatus === 'checked-in' ? <UserX size={18} /> : <UserCheck size={18} />}
                              </motion.button>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1 rounded bg-cyan-900/20 text-cyan-400 hover:bg-cyan-900/40"
                              onClick={() => setSelectedAttendee(attendee)}
                              title="View details"
                            >
                              <MoreHorizontal size={18} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr className="border-b border-gray-800">
                      <td colSpan="6" className="px-4 py-12 text-center text-gray-400">
                        {searchQuery || filterStatus !== 'all' ? 
                          'No attendees match your search criteria' : 
                          'No attendees registered for this event yet'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-400">
              <div>
                Showing {filteredAttendees.length} of {attendees.length} attendees
              </div>
              <div>
                <button 
                  className="flex items-center text-cyan-500 hover:text-cyan-400 transition-colors"
                  onClick={() => setShowAddAttendee(true)}
                >
                  <UserPlus size={16} className="mr-1" />
                  Add Attendee Manually
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Attendee Details Modal */}
      <AnimatePresence>
        {selectedAttendee && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <motion.div
              className="bg-gray-900 border border-cyan-900/50 rounded-lg max-w-lg w-full shadow-xl shadow-cyan-900/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex justify-between items-center border-b border-cyan-900/30 p-4">
                <h3 className="text-lg font-semibold text-cyan-400">Attendee Details</h3>
                <button
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => setSelectedAttendee(null)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-cyan-400 rounded-full flex items-center justify-center text-black text-xl font-bold mr-4">
                    {selectedAttendee.name?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold">{selectedAttendee.name}</h4>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${selectedAttendee.ticketType === 'VIP'
                        ? 'bg-purple-900/30 text-purple-300 border border-purple-500/30'
                        : selectedAttendee.ticketType === 'Early Bird'
                          ? 'bg-blue-900/30 text-blue-300 border border-blue-500/30'
                          : 'bg-gray-800 text-gray-300 border border-gray-700'
                      }`}>
                      {selectedAttendee.ticketType || 'Regular'} Ticket
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <Mail size={18} className="mr-3 text-cyan-500 mt-1" />
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Email Address</div>
                        <div>{selectedAttendee.email}</div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Phone size={18} className="mr-3 text-cyan-500 mt-1" />
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Phone Number</div>
                        <div>{selectedAttendee.phone || 'Not provided'}</div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Calendar size={18} className="mr-3 text-cyan-500 mt-1" />
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Registration Date</div>
                        <div>
                          {selectedAttendee.registrationDate
                            ? new Date(selectedAttendee.registrationDate).toLocaleDateString()
                            : 'Unknown'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Clock size={18} className="mr-3 text-cyan-500 mt-1" />
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Check-in Time</div>
                        <div>
                          {selectedAttendee.checkInTime
                            ? new Date(selectedAttendee.checkInTime).toLocaleString()
                            : 'Not checked in yet'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-cyan-900/30 pt-4 mt-6 flex justify-end">
                  {selectedAttendee.checkInStatus !== 'cancelled' && (
                    <button
                      className={`px-4 py-2 rounded mr-3 flex items-center ${selectedAttendee.checkInStatus === 'checked-in'
                          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                          : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        }`}
                      onClick={() => {
                        handleCheckInToggle(selectedAttendee._id, selectedAttendee.checkInStatus);
                        setSelectedAttendee(null);
                      }}
                    >
                      {selectedAttendee.checkInStatus === 'checked-in' ? (
                        <>
                          <X size={18} className="mr-2" />
                          Cancel Check-in
                        </>
                      ) : (
                        <>
                          <Check size={18} className="mr-2" />
                          Check In Now
                        </>
                      )}
                    </button>
                  )}

                  <button
                    className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded"
                    onClick={() => setSelectedAttendee(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Attendee Modal */}
      <AnimatePresence>
        {showAddAttendee && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <motion.div
              className="bg-gray-900 border border-cyan-900/50 rounded-lg max-w-lg w-full shadow-xl shadow-cyan-900/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex justify-between items-center border-b border-cyan-900/30 p-4">
                <h3 className="text-lg font-semibold text-cyan-400">Add Attendee Manually</h3>
                <button
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => setShowAddAttendee(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Name*</label>
                    <input
                      type="text"
                      name="name"
                      value={newAttendee.name}
                      onChange={handleInputChange}
                      className="w-full bg-black border border-gray-700 rounded-lg p-2.5 text-white focus:ring-cyan-500 focus:border-cyan-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Email*</label>
                    <input
                      type="email"
                      name="email"
                      value={newAttendee.email}
                      onChange={handleInputChange}
                      className="w-full bg-black border border-gray-700 rounded-lg p-2.5 text-white focus:ring-cyan-500 focus:border-cyan-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={newAttendee.phone}
                      onChange={handleInputChange}
                      className="w-full bg-black border border-gray-700 rounded-lg p-2.5 text-white focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Ticket Type</label>
                    <select
                      name="ticketType"
                      value={newAttendee.ticketType}
                      onChange={handleInputChange}
                      className="w-full bg-black border border-gray-700 rounded-lg p-2.5 text-white focus:ring-cyan-500 focus:border-cyan-500"
                    >
                      {ticketTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="border-t border-cyan-900/30 pt-4 mt-6 flex justify-end">
                  <button
                    className="px-4 py-2 rounded mr-3 bg-gray-800 text-gray-300 hover:bg-gray-700"
                    onClick={() => setShowAddAttendee(false)}
                  >
                    Cancel
                  </button>
                  
                  <button
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded"
                    onClick={handleAddAttendee}
                    disabled={!newAttendee.name || !newAttendee.email}
                  >
                    <UserPlus size={16} className="inline mr-1" />
                    Add Attendee
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
