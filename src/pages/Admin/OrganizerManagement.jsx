/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, MoreVertical, CheckCircle, XCircle, Ban, Trash2,
  Eye, Edit, Shield, AlertTriangle, Users, Calendar, DollarSign,
  Star, Clock, MapPin, Mail, Phone, Globe, ChevronDown, Plus,
  Download, RefreshCw, User, UserCheck, UserX, UserMinus, Loader
} from 'lucide-react';
import { organizerService } from '../../services/adminService';
import { toast } from 'react-toastify';
import { useLoader } from '../../context/LoaderContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function OrganizerManagement() {
  // Authentication and navigation
  const authContext = useAuth();
  const navigate = useNavigate();
  const adminToken = useSelector((state) => state.auth.token);
  // Check if user is admin
  const reduxUser = useSelector((state) => state.auth.user);
  const isAdmin = reduxUser?.role === 'admin';

  // Check admin privileges
  if (isAdmin) {
    console.log('Admin privileges confirmed');
  }



  // Parse user and token from context or localStorage
  const getAuthData = () => {
    try {
      // Prefer Redux token over context/localStorage
      if (adminToken) {
        // Try to get user from context or localStorage
        let user = null;

        if (authContext?.user) {
          user = typeof authContext.user === 'string' ? JSON.parse(authContext.user) : authContext.user;
        } else {
          // Fallback to localStorage for user data
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

  // Debug log to check token
  useEffect(() => {
    console.log('Auth Debug:', {
      adminToken,
      contextToken: authContext?.token,
      finalToken: token,
      user: user
    });
  }, [adminToken, authContext?.token, token, user]);

  // State management
  const [organizers, setOrganizers] = useState([]);
  const [stats, setStats] = useState({
    totalOrganizers: 0,
    pendingOrganizers: 0,
    approvedOrganizers: 0,
    activeOrganizers: 0,
    rejectedOrganizers: 0,
    suspendedOrganizers: 0,
    blockedOrganizers: 0,
    verifiedOrganizers: 0,
    unverifiedOrganizers: 0,
    inactiveOrganizers: 0,
    verificationRate: 0,
    approvalRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [reason, setReason] = useState('');

  const itemsPerPage = 10;
  const { setIsLoading } = useLoader();

  // Update loader context
  useEffect(() => {
    setIsLoading(loading || actionLoading);
    return () => setIsLoading(false);
  }, [loading, actionLoading, setIsLoading]);

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
  }, [token, user, navigate]);

  // Fetch organizers data
  const fetchOrganizers = async () => {
    try {
      setLoading(true);

      // Double check authentication before making request
      if (!token) {
        toast.error('Authentication token missing. Please login again.');
        if (logout) logout();
        navigate('/admin/login');
        return;
      }

      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
        status: filterStatus,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      const response = await organizerService.getAllOrganizers(params);
      setOrganizers(response.data.organizers);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching organizers:', error);

      // Handle authentication errors
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        if (logout) logout();
        navigate('/admin/login');
        return;
      }

      toast.error(error.response?.data?.message || 'Failed to fetch organizers');
      setOrganizers([]);
    } finally {
      setLoading(false);
    }
  };

  console.log('Organizers fetched:', organizers);

  // Fetch statistics
  const fetchStats = async () => {
    try {
      // Check authentication before making request
      if (!token) {
        return;
      }

      const response = await organizerService.getOrganizerStats();
      // Use the exact response structure from your API
      const statsData = response.data;
      setStats({
        totalOrganizers: statsData.totalOrganizers || 0,
        pendingOrganizers: statsData.pendingOrganizers || 0,
        approvedOrganizers: statsData.approvedOrganizers || 0,
        activeOrganizers: statsData.activeOrganizers || 0,
        rejectedOrganizers: statsData.rejectedOrganizers || 0,
        suspendedOrganizers: statsData.suspendedOrganizers || 0,
        blockedOrganizers: statsData.blockedOrganizers || 0,
        verifiedOrganizers: statsData.verifiedOrganizers || 0,
        unverifiedOrganizers: statsData.unverifiedOrganizers || 0,
        inactiveOrganizers: statsData.inactiveOrganizers || 0,
        verificationRate: statsData.verificationRate || 0,
        approvalRate: statsData.approvalRate || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);

      // Handle authentication errors
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        if (logout) logout();
        navigate('/admin/login');
        return;
      }

      toast.error('Failed to fetch statistics');
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchOrganizers();
    fetchStats();
  }, [currentPage, searchQuery, filterStatus]);

  // Debounced search
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchOrganizers();
      }
    }, 500);

    console.log("organizer stats:", stats);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  // Status filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'suspended': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'blocked':
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return Clock;
      case 'approved': return CheckCircle;
      case 'suspended': return AlertTriangle;
      case 'blocked': return Ban;
      case 'rejected': return XCircle;
      default: return User;
    }
  };

  const handleAction = (organizer, action) => {
    setSelectedOrganizer(organizer);
    setActionType(action);
    setReason('');
    setShowActionModal(true);
  };

  const confirmAction = async () => {
    if (!selectedOrganizer || !actionType) return;

    try {
      setActionLoading(true);

      // Check authentication before making request
      if (!token) {
        toast.error('Authentication token missing. Please login again.');
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL;
      let endpoint = '';
      let payload = {};

      switch (actionType) {
        case 'approve':
          endpoint = `${apiUrl}/admin/organizers/${selectedOrganizer._id}/approve`;
          payload = { approved: true, reason };
          break;
        case 'reject':
          endpoint = `${apiUrl}/admin/organizers/${selectedOrganizer._id}/approve`;
          payload = { approved: false, reason };
          break;
        case 'suspend':
          endpoint = `${apiUrl}/admin/organizers/${selectedOrganizer._id}/status`;
          payload = { status: false, reason };
          break;
        case 'block':
          endpoint = `${apiUrl}/admin/organizers/${selectedOrganizer._id}/status`;
          payload = { status: actionType === 'suspend' ? 'suspended' : 'blocked', reason };
          break;
        default:
          throw new Error('Invalid action type');
      }

      const response = await axios.put(endpoint, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        toast.success(`Organizer ${actionType}d successfully`);
        // Refresh the organizers list
        fetchOrganizers();
        setShowActionModal(false);
      } else {
        throw new Error(response.data.message || 'Action failed');
      }
    } catch (error) {
      console.error('Action error:', error);
      toast.error(error.response?.data?.message || error.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchOrganizers();
    fetchStats();
    toast.success('Data refreshed successfully');
  };

  const handleExport = () => {
    // Check if we have data to export
    if (!organizers.length) {
      toast.warning('No data to export');
      return;
    }

    try {
      // Implement CSV export functionality
      const csvData = organizers.map(org => ({
        Name: org.name,
        Email: org.email,
        Phone: org.phone || '',
        Status: org.status,
        'Join Date': new Date(org.createdAt).toLocaleDateString(),
        'Events Count': org.eventsCount || 0,
        'Total Revenue': org.totalRevenue || 0,
        Location: org.profile?.location || org.location || ''
      }));

      const csvContent = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map(row => Object.values(row).map(value =>
          // Escape commas and quotes in CSV values
          typeof value === 'string' && value.includes(',') ? `"${value.replace(/"/g, '""')}"` : value
        ).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `organizers-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success('Data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  const formatCurrency = (amount) => {
    if (typeof amount === 'number') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    }
    return amount || '$0';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getActionButtons = (organizer) => {
    const buttons = [];

    // View button (always available)
    buttons.push({
      action: 'view',
      icon: Eye,
      color: 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30',
      title: 'View Details'
    });

    // Status-specific action buttons
    if (organizer.status === 'pending') {
      buttons.push({
        action: 'approve',
        icon: CheckCircle,
        color: 'bg-green-500/20 text-green-400 hover:bg-green-500/30',
        title: 'Approve'
      });
      buttons.push({
        action: 'reject',
        icon: XCircle,
        color: 'bg-red-500/20 text-red-400 hover:bg-red-500/30',
        title: 'Reject'
      });
    }

    if (organizer.status === 'approved') {
      buttons.push({
        action: 'suspend',
        icon: AlertTriangle,
        color: 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30',
        title: 'Suspend'
      });
    }

    if (organizer.status === 'suspended') {
      buttons.push({
        action: 'approve',
        icon: CheckCircle,
        color: 'bg-green-500/20 text-green-400 hover:bg-green-500/30',
        title: 'Reactivate'
      });
      buttons.push({
        action: 'block',
        icon: Ban,
        color: 'bg-red-500/20 text-red-400 hover:bg-red-500/30',
        title: 'Block'
      });
    }

    // Delete button (available for non-active organizers)
    if (organizer.status !== 'approved') {
      buttons.push({
        action: 'delete',
        icon: Trash2,
        color: 'bg-red-500/20 text-red-400 hover:bg-red-500/30',
        title: 'Delete'
      });
    }

    return buttons;
  };

  const statsCards = [
    {
      label: 'Total Organizers',
      value: stats.totalOrganizers,
      icon: Users,
      color: 'from-cyan-500 to-blue-600',
      subtext: `${stats.verificationRate}% verified`
    },
    {
      label: 'Pending Approval',
      value: stats.pendingOrganizers,
      icon: Clock,
      color: 'from-yellow-500 to-orange-600',
      subtext: 'Awaiting review'
    },
    {
      label: 'unverified Organizers',
        value: stats.unverifiedOrganizers,
      icon: UserX,
      color: 'from-yellow-500 to-orange-600',
      subtext: 'Awaiting review'
    },
    {
      label: 'Active Organizers',
      value: stats.activeOrganizers,
      icon: UserCheck,
      color: 'from-green-500 to-emerald-600',
      subtext: `${stats.approvalRate}% approval rate`
    },
    {
      label: 'Inactive Organizers',
      value: stats.inactiveOrganizers,
      icon: UserX,
      color: 'from-red-500 to-pink-600',
      subtext: `${stats.rejectedOrganizers} rejected, ${stats.suspendedOrganizers} suspended`
    },
    {
      label: 'Suspended Organizers',
      value: stats.suspendedOrganizers,
      icon: AlertTriangle,
      color: 'from-red-500 to-pink-600',
      subtext: `${stats.rejectedOrganizers} rejected, ${stats.suspendedOrganizers} suspended`
    },{
      label: 'Blocked Organizers',
      value: stats.blockedOrganizers,
      icon: Ban,
      color: 'from-red-500 to-pink-600',
      subtext: `${stats.rejectedOrganizers} rejected, ${stats.suspendedOrganizers} suspended`
    },{
      label: 'Rejected Organizers',
      value: stats.rejectedOrganizers,
      icon: UserMinus,
      color: 'from-red-500 to-orange-600',
      subtext: `${stats.rejectedOrganizers} rejected, ${stats.suspendedOrganizers} suspended`
    }
  ];

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

  if (loading && organizers.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="w-8 h-8 animate-spin text-cyan-400" />
          <p className="text-gray-400">Loading organizers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 opacity-10 rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-600 opacity-15 rounded-full filter blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500 opacity-5 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Organizer Management
          </motion.h1>
          <p className="text-gray-400 text-sm sm:text-base">Manage organizer accounts, approvals, and permissions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-20`}>
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-xl sm:text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-xs sm:text-sm mb-1">{stat.label}</p>
                {stat.subtext && (
                  <p className="text-gray-500 text-xs">{stat.subtext}</p>
                )}
              </div>
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
                  placeholder="Search organizers by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800/60 border border-gray-700/50 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>

              {/* Filter */}
              <div className="relative sm:w-48">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full bg-gray-800/60 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 appearance-none pr-8 cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="suspended">Suspended</option>
                  <option value="blocked">Blocked</option>
                  <option value="rejected">Rejected</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={loading}
                className="p-2.5 rounded-lg bg-gray-800/60 text-gray-400 hover:text-cyan-400 transition-colors border border-gray-700/50 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                className="p-2.5 rounded-lg bg-gray-800/60 text-gray-400 hover:text-cyan-400 transition-colors border border-gray-700/50"
              >
                <Download className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Organizers Table/Cards */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-gray-700/50 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50 border-b border-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Organizer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Verified</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {organizers.map((organizer, index) => {
                  const StatusIcon = getStatusIcon(organizer.status);
                  const actionButtons = getActionButtons(organizer);

                  return (
                    <motion.tr
                      key={organizer._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-black font-bold">
                            {organizer.avatar}
                          </div>
                          <div>
                            <div className="text-white font-medium">{organizer.name}</div>
                            <div className="text-gray-400 text-sm">{organizer.company || organizer.organization || 'No company'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">{organizer.email}</div>
                        <div className="text-gray-400 text-sm">{organizer.phone || 'No phone'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${organizer.verified ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-700/40 text-gray-400 border border-gray-600/30'}`}>
                          {organizer.verified ? 'Verified' : 'Not Verified'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{formatDate(organizer.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {actionButtons.map((button) => (
                            <motion.button
                              key={button.action}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleAction(organizer, button.action)}
                              className={`p-1.5 rounded-lg transition-colors ${button.color}`}
                              title={button.title}
                              disabled={actionLoading}
                            >
                              <button.icon className="w-4 h-4" />
                            </motion.button>
                          ))}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden p-4 space-y-4">
            {organizers.map((organizer, index) => {
              const StatusIcon = getStatusIcon(organizer.status);
              const actionButtons = getActionButtons(organizer);

              return (
                <motion.div
                  key={organizer._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-black font-bold">
                        {organizer.avatar}
                      </div>
                      <div>
                        <div className="text-white font-medium">{organizer.name}</div>
                        <div className="text-gray-400 text-sm">{organizer.company || organizer.organization || 'No company'}</div>
                      </div>
                    </div>
                    <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(organizer.status)}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span className="capitalize">{organizer.status}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-gray-400 text-xs">Email</p>
                      <p className="text-white text-sm truncate">{organizer.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Phone</p>
                      <p className="text-white text-sm">{organizer.phone || 'No phone'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Verified</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${organizer.verified ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-700/40 text-gray-400 border border-gray-600/30'}`}>
                        {organizer.verified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Joined</p>
                      <p className="text-white text-sm">{formatDate(organizer.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center pt-3 border-t border-gray-700/50">
                    <div className="flex items-center space-x-2 flex-wrap justify-center gap-2">
                      {actionButtons.map((button) => (
                        <motion.button
                          key={button.action}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleAction(organizer, button.action)}
                          className={`p-2 rounded-lg transition-colors ${button.color}`}
                          title={button.title}
                          disabled={actionLoading}
                        >
                          <button.icon className="w-4 h-4" />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-700/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-gray-400 text-sm">
                Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} organizers
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={!pagination.hasPrevPage || loading}
                  className="px-3 py-2 rounded-lg bg-gray-800/60 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-700/50"
                >
                  Previous
                </motion.button>
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <motion.button
                      key={page}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage(page)}
                      disabled={loading}
                      className={`px-3 py-2 rounded-lg transition-colors border ${pagination.currentPage === page
                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                        : 'bg-gray-800/60 text-gray-400 hover:text-white border-gray-700/50'
                        } disabled:opacity-50`}
                    >
                      {page}
                    </motion.button>
                  );
                })}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                  disabled={!pagination.hasNextPage || loading}
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
        {showActionModal && selectedOrganizer && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-white mb-4 capitalize">
                {actionType} Organizer
              </h3>
              <p className="text-gray-400 mb-4">
                Are you sure you want to {actionType} "{selectedOrganizer.name}"?
                {actionType === 'delete' && ' This action cannot be undone.'}
              </p>

              {/* Reason input for certain actions */}
              {(['reject', 'suspend', 'block'].includes(actionType)) && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Reason (optional)
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter reason for this action..."
                    className="w-full bg-gray-800/60 border border-gray-700/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
                    rows={3}
                  />
                </div>
              )}

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowActionModal(false)}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800/60 text-gray-400 hover:text-white transition-colors border border-gray-700/50 disabled:opacity-50"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmAction}
                  disabled={actionLoading}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center ${actionType === 'delete' || actionType === 'block'
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                    : actionType === 'approve'
                      ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30'
                      : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/30'
                    }`}
                >
                  {actionLoading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    'Confirm'
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
