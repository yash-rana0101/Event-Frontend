/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, MoreVertical, CheckCircle, XCircle, Ban, Trash2,
  Eye, Edit, Shield, AlertTriangle, Users, Calendar, DollarSign,
  Star, Clock, MapPin, Mail, Phone, Globe, ChevronDown, Plus,
  Download, RefreshCw, User, UserCheck, UserX, UserMinus
} from 'lucide-react';

export default function OrganizerManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data - replace with actual API calls
  const [organizers, setOrganizers] = useState([
    {
      id: 1,
      name: 'TechCorp Events',
      email: 'admin@techcorp.com',
      phone: '+1 234 567 8901',
      website: 'techcorp.com',
      status: 'pending',
      joinDate: '2024-01-15',
      eventsCount: 0,
      totalRevenue: '$0',
      rating: 0,
      location: 'San Francisco, CA',
      avatar: 'TC',
      lastActivity: '2 hours ago',
      documents: ['business_license.pdf', 'tax_id.pdf']
    },
    {
      id: 2,
      name: 'EventMaster Pro',
      email: 'contact@eventmaster.com',
      phone: '+1 345 678 9012',
      website: 'eventmaster.com',
      status: 'approved',
      joinDate: '2023-08-20',
      eventsCount: 45,
      totalRevenue: '$89,234',
      rating: 4.9,
      location: 'New York, NY',
      avatar: 'EM',
      lastActivity: '30 minutes ago',
      documents: ['business_license.pdf', 'insurance.pdf', 'certification.pdf']
    },
    {
      id: 3,
      name: 'Music Festival Co',
      email: 'info@musicfest.com',
      phone: '+1 456 789 0123',
      website: 'musicfest.com',
      status: 'suspended',
      joinDate: '2023-05-10',
      eventsCount: 12,
      totalRevenue: '$23,450',
      rating: 3.8,
      location: 'Los Angeles, CA',
      avatar: 'MF',
      lastActivity: '1 week ago',
      documents: ['business_license.pdf']
    },
    {
      id: 4,
      name: 'Conference Kings',
      email: 'hello@confkings.com',
      phone: '+1 567 890 1234',
      website: 'confkings.com',
      status: 'blocked',
      joinDate: '2023-12-05',
      eventsCount: 8,
      totalRevenue: '$15,680',
      rating: 2.5,
      location: 'Chicago, IL',
      avatar: 'CK',
      lastActivity: '2 weeks ago',
      documents: ['business_license.pdf', 'tax_id.pdf']
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'suspended': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'blocked': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return Clock;
      case 'approved': return CheckCircle;
      case 'suspended': return AlertTriangle;
      case 'blocked': return Ban;
      default: return User;
    }
  };

  const handleAction = (organizer, action) => {
    setSelectedOrganizer(organizer);
    setActionType(action);
    setShowActionModal(true);
  };

  const confirmAction = () => {
    if (selectedOrganizer && actionType) {
      setOrganizers(prev => prev.map(org =>
        org.id === selectedOrganizer.id
          ? { ...org, status: actionType === 'approve' ? 'approved' : actionType === 'suspend' ? 'suspended' : actionType === 'block' ? 'blocked' : org.status }
          : org
      ));

      if (actionType === 'delete') {
        setOrganizers(prev => prev.filter(org => org.id !== selectedOrganizer.id));
      }
    }
    setShowActionModal(false);
    setSelectedOrganizer(null);
    setActionType('');
  };

  const filteredOrganizers = organizers.filter(organizer => {
    const matchesSearch = organizer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      organizer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || organizer.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredOrganizers.length / itemsPerPage);
  const paginatedOrganizers = filteredOrganizers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = [
    { label: 'Total Organizers', value: organizers.length, icon: Users, color: 'from-cyan-500 to-blue-600' },
    { label: 'Pending Approval', value: organizers.filter(o => o.status === 'pending').length, icon: Clock, color: 'from-yellow-500 to-orange-600' },
    { label: 'Active Organizers', value: organizers.filter(o => o.status === 'approved').length, icon: UserCheck, color: 'from-green-500 to-emerald-600' },
    { label: 'Suspended/Blocked', value: organizers.filter(o => ['suspended', 'blocked'].includes(o.status)).length, icon: UserX, color: 'from-red-500 to-pink-600' }
  ];

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
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm mb-1">{stat.label}</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-20`}>
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
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
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3">
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

        {/* Organizers Table/Cards */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-gray-700/50 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50 border-b border-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Organizer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {paginatedOrganizers.map((organizer, index) => {
                  const StatusIcon = getStatusIcon(organizer.status);
                  return (
                    <motion.tr
                      key={organizer.id}
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
                            <div className="text-gray-400 text-sm">{organizer.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(organizer.status)}`}>
                          <StatusIcon className="w-3 h-3" />
                          <span className="capitalize">{organizer.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">{organizer.email}</div>
                        <div className="text-gray-400 text-sm">{organizer.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{organizer.location}</td>
                      <td className="px-6 py-4 text-gray-400">{organizer.joinDate}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {organizer.status === 'pending' && (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleAction(organizer, 'approve')}
                                className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleAction(organizer, 'reject')}
                                className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </motion.button>
                            </>
                          )}
                          {organizer.status === 'approved' && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleAction(organizer, 'suspend')}
                              className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 transition-colors"
                              title="Suspend"
                            >
                              <AlertTriangle className="w-4 h-4" />
                            </motion.button>
                          )}
                          {organizer.status === 'suspended' && (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleAction(organizer, 'approve')}
                                className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                                title="Reactivate"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleAction(organizer, 'block')}
                                className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                title="Block"
                              >
                                <Ban className="w-4 h-4" />
                              </motion.button>
                            </>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleAction(organizer, 'view')}
                            className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleAction(organizer, 'delete')}
                            className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                            title="Delete"
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

          {/* Mobile Cards */}
          <div className="lg:hidden p-4 space-y-4">
            {paginatedOrganizers.map((organizer, index) => {
              const StatusIcon = getStatusIcon(organizer.status);
              return (
                <motion.div
                  key={organizer.id}
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
                        <div className="text-gray-400 text-sm">{organizer.description}</div>
                      </div>
                    </div>
                    <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(organizer.status)}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span className="capitalize">{organizer.status}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 mb-3">
                    <div>
                      <p className="text-gray-400 text-xs">Email</p>
                      <p className="text-white text-sm">{organizer.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Phone</p>
                      <p className="text-white text-sm">{organizer.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Location</p>
                      <p className="text-white text-sm">{organizer.location}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Joined</p>
                      <p className="text-white text-sm">{organizer.joinDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
                    <div className="flex items-center space-x-2">
                      {organizer.status === 'pending' && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleAction(organizer, 'approve')}
                            className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleAction(organizer, 'reject')}
                            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </motion.button>
                        </>
                      )}
                      {organizer.status === 'approved' && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleAction(organizer, 'suspend')}
                          className="p-2 rounded-lg bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 transition-colors"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </motion.button>
                      )}
                      {organizer.status === 'suspended' && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleAction(organizer, 'approve')}
                            className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleAction(organizer, 'block')}
                            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                          >
                            <Ban className="w-4 h-4" />
                          </motion.button>
                        </>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleAction(organizer, 'view')}
                        className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleAction(organizer, 'delete')}
                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-700/50 flex items-center justify-between">
              <div className="text-gray-400 text-sm">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOrganizers.length)} of {filteredOrganizers.length} organizers
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
                ))}
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
              <p className="text-gray-400 mb-6">
                Are you sure you want to {actionType} "{selectedOrganizer.name}"?
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
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${actionType === 'delete' || actionType === 'block'
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                    : actionType === 'approve'
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
