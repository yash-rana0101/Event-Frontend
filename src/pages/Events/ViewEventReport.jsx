/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  CalendarDaysIcon,
  MapPinIcon,
  UsersIcon,
  ClockIcon,
  TagIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  DownloadIcon,
  RefreshCwIcon,
  AlertCircleIcon,
  PieChartIcon,
  BarChartIcon,
  StarIcon,
  MessageSquareIcon,

  CheckCircleIcon,
  XCircleIcon,
  UserCheckIcon,
  UserXIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { safelyParseToken } from '../../utils/persistFix';
import { HiMiniDocumentArrowUp } from "react-icons/hi2";
import { AiOutlineDollar } from "react-icons/ai";
import Skeleton from '../../components/UI/Skeleton';

export default function ViewEventReport() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  // State management
  const [eventData, setEventData] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [demographics, setDemographics] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  // Get auth token
  const organizerToken = useSelector(state => state.organizer?.token);

  useEffect(() => {
    if (eventId) {
      fetchEventReport();
    }
  }, [eventId]);

  const fetchEventReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = safelyParseToken(organizerToken || localStorage.getItem('organizer_token'));

      if (!token) {
        toast.error('Authentication required');
        navigate('/organizer/login');
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL;
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Fetch all data in parallel with correct endpoint paths
      const [
        eventResponse,
        attendeesResponse,
        demographicsResponse,
        revenueResponse,
        feedbackResponse
      ] = await Promise.allSettled([
        // Event details - using events route
        axios.get(`${apiUrl}/events/${eventId}`, config),

        // Event attendees - using organizer route for attendees
        axios.get(`${apiUrl}/organizer/events/${eventId}/attendees`, config),

        // Attendee demographics - using reports route
        axios.get(`${apiUrl}/reports/events/${eventId}/attendee-demographics`, config),

        // Revenue data - using reports route  
        axios.get(`${apiUrl}/reports/events/${eventId}/revenue`, config),

        // Feedback summary - using feedback route
        axios.get(`${apiUrl}/feedback/events/${eventId}/summary`, config)
      ]);

      // Handle event data
      if (eventResponse.status === 'fulfilled') {
        setEventData(eventResponse.value.data);
      } else {
        throw new Error('Failed to fetch event data');
      }

      // Handle attendees data
      if (attendeesResponse.status === 'fulfilled') {
        const attendeesData = attendeesResponse.value.data;
        setAttendees(Array.isArray(attendeesData) ? attendeesData : attendeesData.data || []);
      }

      // Handle demographics data
      if (demographicsResponse.status === 'fulfilled') {
        setDemographics(demographicsResponse.value.data.demographics || demographicsResponse.value.data);
      }

      // Handle revenue data
      if (revenueResponse.status === 'fulfilled') {
        setRevenue(revenueResponse.value.data.revenue || revenueResponse.value.data);
      }

      // Handle feedback data
      if (feedbackResponse.status === 'fulfilled') {
        const feedbackData = feedbackResponse.value.data;
        setFeedback(feedbackData.data || feedbackData);
      } else {
        console.warn('Failed to fetch feedback data:', feedbackResponse.reason);
        setFeedback({
          totalFeedback: 0,
          averageRating: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
          recentComments: [],
          responseRate: 0
        });
      }

    } catch (error) {
      console.error('Error fetching event report:', error);
      setError(error.response?.data?.message || error.message);
      toast.error('Failed to load event report');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const token = safelyParseToken(organizerToken || localStorage.getItem('organizer_token'));
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

      const response = await axios.get(
        `${apiUrl}/reports/events/${eventId}/export`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${eventData?.title || 'event'}-report.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast.success('Report downloaded successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download report');
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchEventReport();
  };

  // Calculate statistics
  const calculateStats = () => {
    if (!attendees.length) return null;

    const checkedInCount = attendees.filter(a => a.checkInStatus === 'checked-in').length;
    const cancelledCount = attendees.filter(a => a.checkInStatus === 'cancelled').length;
    const attendanceRate = ((checkedInCount / attendees.length) * 100).toFixed(1);
    const cancellationRate = ((cancelledCount / attendees.length) * 100).toFixed(1);

    return {
      totalRegistered: attendees.length,
      checkedIn: checkedInCount,
      cancelled: cancelledCount,
      attendanceRate: parseFloat(attendanceRate),
      cancellationRate: parseFloat(cancellationRate),
      noShows: attendees.length - checkedInCount - cancelledCount
    };
  };

  const calculateResponseRate = () => {
    if (!feedback || !stats || stats.totalRegistered === 0) return 0;
    return Math.floor((feedback.totalFeedback / stats.totalRegistered) * 100);
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <Skeleton type='event-detail' />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Report</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!eventData) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-black via-gray-900 to-black border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center mb-4">
                <button
                  onClick={() => navigate(-1)}
                  className="mr-4 p-2 rounded-full transition-colors hover:bg-gray-800/50 text-cyan-400 hover:text-white"
                >
                  ← Back
                </button>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-500 to-cyan-300 bg-clip-text text-transparent">
                  Event Report
                </h1>
              </div>
              <h2 className="text-xl text-white mb-2">{eventData.title}</h2>
              <p className="text-gray-400">Comprehensive event analytics and attendee information</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-cyan-400 rounded-lg transition-all duration-300"
              >
                <RefreshCwIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
              >
                <HiMiniDocumentArrowUp className="w-5 h-5" />
                Download PDF Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-4 mb-8 border-b border-gray-800">
          {[
            {
              id: 'overview',
              label: 'Overview',
              icon: BarChartIcon
            },
            {
              id: 'attendees',
              label: 'Attendees',
              icon: UsersIcon
            },
            {
              id: 'analytics',
              label: 'Analytics',
              icon: PieChartIcon
            },
            {
              id: 'feedback',
              label: 'Feedback',
              icon: MessageSquareIcon
            },
            {
              id: 'revenue',
              label: 'Revenue',
              icon: AiOutlineDollar
            }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all duration-300 ${activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-400 border-b-2 border-cyan-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Event Details Section */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-cyan-500 mb-6 flex items-center gap-2">
                  <CalendarDaysIcon className="w-6 h-6" />
                  Event Details
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-cyan-400 mb-2">{eventData.title}</h3>
                      <p className="text-gray-300 leading-relaxed">{eventData.description}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 bg-black/30 p-3 rounded-lg">
                        <CalendarDaysIcon className="w-5 h-5 text-cyan-500" />
                        <div>
                          <p className="text-sm text-gray-400">Date</p>
                          <p className="font-medium">{new Date(eventData.startDate).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-black/30 p-3 rounded-lg">
                        <ClockIcon className="w-5 h-5 text-cyan-500" />
                        <div>
                          <p className="text-sm text-gray-400">Time</p>
                          <p className="font-medium">{new Date(eventData.startDate).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-black/30 p-3 rounded-lg">
                      <MapPinIcon className="w-5 h-5 text-cyan-500" />
                      <div>
                        <p className="text-sm text-gray-400">Location</p>
                        <p className="font-medium">{eventData.location?.address || eventData.venue || "Online Event"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-black/30 p-3 rounded-lg">
                      <TagIcon className="w-5 h-5 text-cyan-500" />
                      <div>
                        <p className="text-sm text-gray-400">Category</p>
                        <p className="font-medium">{eventData.category || "General"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Statistics */}
                  {stats && (
                    <div className="space-y-6">
                      <h4 className="text-lg font-semibold text-cyan-400">Event Statistics</h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-500/10 border border-cyan-500/30 p-4 rounded-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <UsersIcon className="w-6 h-6 text-cyan-500" />
                            <span className="text-sm text-gray-400">Total Registered</span>
                          </div>
                          <p className="text-2xl font-bold text-cyan-400">{stats.totalRegistered}</p>
                        </div>

                        <div className="bg-gradient-to-br from-green-600/20 to-green-500/10 border border-green-500/30 p-4 rounded-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <UserCheckIcon className="w-6 h-6 text-green-500" />
                            <span className="text-sm text-gray-400">Checked In</span>
                          </div>
                          <p className="text-2xl font-bold text-green-400">{stats.checkedIn}</p>
                        </div>

                        <div className="bg-gradient-to-br from-red-600/20 to-red-500/10 border border-red-500/30 p-4 rounded-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <UserXIcon className="w-6 h-6 text-red-500" />
                            <span className="text-sm text-gray-400">Cancelled</span>
                          </div>
                          <p className="text-2xl font-bold text-red-400">{stats.cancelled}</p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-600/20 to-purple-500/10 border border-purple-500/30 p-4 rounded-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm text-gray-400">Attendance Rate</span>
                          </div>
                          <p className="text-2xl font-bold text-purple-400">{stats.attendanceRate}%</p>
                          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                            <div
                              className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${stats.attendanceRate}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Revenue Generated</p>
                      <p className="text-2xl font-bold text-green-400">
                        ${revenue?.totalRevenue || (eventData.price * (stats?.checkedIn || 0)) || '0'}
                      </p>
                    </div>
                    <AiOutlineDollar className="w-8 h-8 text-green-500" />
                  </div>
                </div>

                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Average Rating</p>
                      <p className="text-2xl font-bold text-yellow-400">
                        {feedback?.averageRating ? `${feedback.averageRating}/5` : "N/A"}
                      </p>
                    </div>
                    <StarIcon className="w-8 h-8 text-yellow-500" />
                  </div>
                </div>

                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Feedback</p>
                      <p className="text-2xl font-bold text-cyan-400">
                        {feedback?.totalFeedback || 0}
                      </p>
                    </div>
                    <MessageSquareIcon className="w-8 h-8 text-cyan-500" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Attendees Tab */}
          {activeTab === 'attendees' && (
            <motion.div
              key="attendees"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-cyan-500 flex items-center gap-2">
                    <UsersIcon className="w-6 h-6" />
                    Event Attendees ({attendees.length})
                  </h2>
                  <button
                    onClick={() => navigate(`/organizer/events/attendees/${eventId}`)}
                    className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors"
                  >
                    Manage Attendees
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 min-w-full">
                    {attendees.slice(0, 9).map((attendee, index) => (
                      <div
                        key={attendee._id || index}
                        className="bg-black/40 border border-gray-700 hover:border-cyan-500/50 rounded-lg p-4 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white text-lg">{attendee.name}</h3>
                            <p className="text-gray-400 text-sm">{attendee.email}</p>
                            {attendee.phone && (
                              <p className="text-gray-500 text-xs">{attendee.phone}</p>
                            )}
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${attendee.checkInStatus === 'checked-in'
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : attendee.checkInStatus === 'cancelled'
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                  : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                              }`}
                          >
                            {attendee.checkInStatus === 'checked-in' ? 'Attended' :
                              attendee.checkInStatus === 'cancelled' ? 'Cancelled' : 'Registered'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          <div>Ticket: {attendee.ticketType || 'Regular'}</div>
                          <div>Registered: {new Date(attendee.registrationDate).toLocaleDateString()}</div>
                          {attendee.checkInTime && (
                            <div>Checked in: {new Date(attendee.checkInTime).toLocaleString()}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {attendees.length > 9 && (
                    <div className="mt-6 text-center">
                      <button
                        onClick={() => navigate(`/organizer/events/${eventId}/attendees`)}
                        className="px-6 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-colors"
                      >
                        View All {attendees.length} Attendees
                      </button>
                    </div>
                  )}

                  {attendees.length === 0 && (
                    <div className="text-center py-12">
                      <UsersIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No attendees registered for this event yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Demographics Section */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-cyan-500 mb-6">Attendee Demographics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-400 mb-3">Registration Timeline</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Early (2+ weeks)</span>
                        <span className="text-cyan-400">25%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Regular (1-2 weeks)</span>
                        <span className="text-cyan-400">45%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Late (&lt; 1 week)</span>
                        <span className="text-cyan-400">30%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-400 mb-3">Ticket Types</h3>
                    <div className="space-y-2">
                      {Object.entries(
                        attendees.reduce((acc, attendee) => {
                          const type = attendee.ticketType || 'Regular';
                          acc[type] = (acc[type] || 0) + 1;
                          return acc;
                        }, {})
                      ).map(([type, count]) => (
                        <div key={type} className="flex justify-between">
                          <span className="text-gray-400">{type}</span>
                          <span className="text-cyan-400">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-400 mb-3">Attendance Metrics</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Show Rate</span>
                        <span className="text-green-400">{stats?.attendanceRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">No-shows</span>
                        <span className="text-yellow-400">{stats?.noShows}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Cancellations</span>
                        <span className="text-red-400">{stats?.cancelled}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Feedback Tab */}
          {activeTab === 'feedback' && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-cyan-500 mb-6 flex items-center gap-2">
                  <MessageSquareIcon className="w-6 h-6" />
                  Event Feedback Summary
                </h2>

                {feedback && feedback.totalFeedback > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-semibold text-cyan-400 mb-4">Rating Distribution</h3>
                        <div className="space-y-3">
                          {[5, 4, 3, 2, 1].map(rating => {
                            const count = feedback.ratingDistribution[rating] || 0;
                            const percentage = feedback.totalFeedback > 0 ? (count / feedback.totalFeedback) * 100 : 0;
                            return (
                              <div key={rating} className="flex items-center gap-3">
                                <span className="text-gray-400 w-8">{rating}★</span>
                                <div className="flex-1 bg-gray-700 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-gray-400 w-8 text-sm">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-cyan-400 mb-4">Key Metrics</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                            <span className="text-gray-400">Average Rating</span>
                            <span className="text-yellow-400 font-bold">{feedback.averageRating}/5</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                            <span className="text-gray-400">Total Reviews</span>
                            <span className="text-cyan-400 font-bold">{feedback.totalFeedback}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                            <span className="text-gray-400">Response Rate</span>
                            <span className="text-green-400 font-bold">{calculateResponseRate()}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {feedback.recentComments && feedback.recentComments.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold text-cyan-400 mb-4">Recent Comments</h3>
                        <div className="space-y-4">
                          {feedback.recentComments.map((comment, index) => (
                            <div key={index} className="p-4 bg-black/30 rounded-lg border-l-4 border-cyan-500/50">
                              <p className="text-gray-300 mb-2">{comment.comment}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span className="text-yellow-400 text-sm">{comment.rating}</span>
                                  <span className="text-gray-500 text-sm">by {comment.userName}</span>
                                </div>
                                <span className="text-gray-500 text-sm">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-16">
                    <div className="max-w-md mx-auto">
                      <div className="mb-6">
                        <MessageSquareIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <StarIcon className="w-8 h-8 text-gray-600 mx-auto" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-400 mb-3">No Feedback Yet</h3>
                      <p className="text-gray-500 mb-6 leading-relaxed">
                        Your event attendees haven't left any feedback yet. Encourage them to share their thoughts and experiences to help you improve future events!
                      </p>
                      <div className="space-y-3 text-sm text-gray-600">
                        <p className="flex items-center gap-2 justify-center">
                          <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                          Send follow-up emails to attendees
                        </p>
                        <p className="flex items-center gap-2 justify-center">
                          <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                          Share feedback links on social media
                        </p>
                        <p className="flex items-center gap-2 justify-center">
                          <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                          Offer incentives for honest reviews
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Revenue Tab */}
          {activeTab === 'revenue' && (
            <motion.div
              key="revenue"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-cyan-500 mb-6 flex items-center gap-2">
                  <AiOutlineDollar className="w-6 h-6" />
                  Revenue Analysis
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-green-600/20 to-green-500/10 border border-green-500/30 p-6 rounded-lg">
                    <h3 className="text-green-400 font-semibold mb-2">Total Revenue</h3>
                    <p className="text-3xl font-bold text-green-400">
                      ${revenue?.totalRevenue || (eventData.price * stats?.checkedIn || 0)}
                    </p>
                    <p className="text-green-300 text-sm mt-1">From {stats?.checkedIn || 0} attendees</p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-600/20 to-blue-500/10 border border-blue-500/30 p-6 rounded-lg">
                    <h3 className="text-blue-400 font-semibold mb-2">Expected Revenue</h3>
                    <p className="text-3xl font-bold text-blue-400">
                      ${eventData.price * stats?.totalRegistered || 0}
                    </p>
                    <p className="text-blue-300 text-sm mt-1">From {stats?.totalRegistered || 0} registrations</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-600/20 to-purple-500/10 border border-purple-500/30 p-6 rounded-lg">
                    <h3 className="text-purple-400 font-semibold mb-2">Revenue Rate</h3>
                    <p className="text-3xl font-bold text-purple-400">
                      {stats?.attendanceRate || 0}%
                    </p>
                    <p className="text-purple-300 text-sm mt-1">Of expected revenue</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-cyan-400 mb-4">Revenue by Ticket Type</h3>
                    <div className="space-y-3">
                      {Object.entries(
                        attendees.reduce((acc, attendee) => {
                          if (attendee.checkInStatus === 'checked-in') {
                            const type = attendee.ticketType || 'Regular';
                            acc[type] = (acc[type] || 0) + 1;
                          }
                          return acc;
                        }, {})
                      ).map(([type, count]) => (
                        <div key={type} className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                          <span className="text-gray-400">{type}</span>
                          <span className="text-green-400 font-bold">${eventData.price * count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-cyan-400 mb-4">Payment Status</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                        <span className="text-gray-400">Paid</span>
                        <span className="text-green-400 font-bold">{stats?.checkedIn || 0}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                        <span className="text-gray-400">Refunded</span>
                        <span className="text-red-400 font-bold">{stats?.cancelled || 0}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                        <span className="text-gray-400">Pending</span>
                        <span className="text-yellow-400 font-bold">{stats?.noShows || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
