import React, { useState, useEffect } from 'react';
import { Eye, Edit2, Trash2, Search, Filter, ChevronLeft, ChevronRight, Calendar, MapPin, Users, Clock } from 'lucide-react';
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { fixPersistenceIssues, safelyParseToken } from "../../utils/persistFix";

const EventListPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');

  // Get auth token from Redux store
  const organizerToken = useSelector(state => state.organizer?.token);
  const organizerData = useSelector(state => state.organizer?.user);

  const eventsPerPage = 4;

  // Fetch events from the API
  const fetchEvents = async () => {
    try {
      setLoading(true);

      // Fix any persistence issues with tokens
      fixPersistenceIssues();

      // Get the token either from Redux or localStorage
      let rawToken = organizerToken || localStorage.getItem('organizer_token');
      const token = safelyParseToken(rawToken);

      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      // Get organizer ID
      let organizerId;
      if (typeof organizerData === 'string') {
        try {
          const parsed = JSON.parse(organizerData);
          organizerId = parsed?._id || parsed?.id;
        } catch (e) {
          console.error('Error parsing organizer data:', e);
        }
      } else if (organizerData) {
        organizerId = organizerData._id || organizerData.id;
      }

      if (!organizerId) {
        toast.error('Could not determine organizer ID. Please log in again.');
        // navigate('/organizer/login');
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

      const response = await axios.get(`${apiUrl}/events/organizer/${organizerId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Format the events to match our UI structure
      const formattedEvents = response.data.map(event => ({
        id: event._id,
        title: event.title,
        date: event.date || new Date(event.startDate).toLocaleDateString(),
        location: event.location?.address || event.venue || "No location specified",
        attendees: event.attendeesCount || 0,
        status: mapEventStatusToUI(event.status),
        description: event.description || "No description available",
        time: event.duration || "Not specified",
        images: event.images,
        startDate: event.startDate,
        endDate: event.endDate
      }));

      setEvents(formattedEvents);
      setError(null);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err.response?.data?.message || err.message || "Failed to load events");
      toast.error("Could not load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Map backend status values to our UI status values
  const mapEventStatusToUI = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'Upcoming';
      case 'draft':
        return 'Planning';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Planning';
    }
  };

  // Handle event deletion
  const handleDelete = async () => {
    try {
      // Fix persistence issues
      fixPersistenceIssues();

      // Get the token
      let rawToken = organizerToken || localStorage.getItem('organizer_token');
      const token = safelyParseToken(rawToken);

      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

      // Delete the event
      await axios.delete(`${apiUrl}/events/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Update local state
      setEvents(events.filter(event => event.id !== deleteId));
      setIsDeleteModalOpen(false);
      setDeleteId(null);

      toast.success('Event deleted successfully');
    } catch (err) {
      console.error("Error deleting event:", err);
      toast.error(err.response?.data?.message || "Failed to delete event");
    }
  };

  // Effect to load events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events based on search term and status
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Get status color - updated to match black/cyan theme
  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-cyan-900/30 text-cyan-400';
      case 'Planning':
        return 'bg-gray-800/40 text-gray-300';
      case 'Completed':
        return 'bg-green-900/30 text-green-400';
      case 'Cancelled':
        return 'bg-red-900/30 text-red-400';
      default:
        return 'bg-gray-800/40 text-gray-300';
    }
  };

  // Format date for display
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
    return event.date || "Date not specified";
  };

  // Loading state UI
  if (loading && events.length === 0) {
    return (
      <div className="min-h-screen bg-black p-4 md:p-8 text-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="mt-4">Loading events...</p>
        </div>
      </div>
    );
  }

  // Error state UI
  if (error && events.length === 0) {
    return (
      <div className="min-h-screen bg-black p-4 md:p-8 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/30 border border-red-500/50 text-red-300 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-bold mb-2">Error Loading Events</h2>
            <p>{error}</p>
            <button
              onClick={fetchEvents}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/organizer/dashboard')}
              className="mt-4 ml-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 md:p-8 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex items-start space-x-4">
          <div className="flex items-start justify-start">
            <button
              onClick={() => navigate('/organizer/dashboard')}
              className="p-2 rounded-full border border-cyan-500 text-cyan-500 hover:bg-cyan-900/30 transition-colors hover:cursor-pointer"
            >
              <FaArrowLeft size={20} />
            </button>
          </div>
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white">My Events</h1>
            <p className="text-gray-400 mt-1">Manage all your events in one place</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-gray-900/50 rounded-lg shadow-md p-4 mb-6 border border-gray-800/60">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-md shadow-sm text-white 
                          focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="flex flex-row gap-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="block pl-10 pr-8 py-2 bg-gray-800/50 border border-gray-700/50 rounded-md shadow-sm text-white
                            focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="All">All</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Planning">Planning</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <Link to="/organizer/event/create" className="px-6 py-2 rounded-xl bg-gradient-to-r bg-cyan-400 text-black font-medium transition-colors cursor-pointer flex items-center space-x-2 hover:bg-black hover:text-cyan-400 hover:border hover:border-cyan-400">
                + New Event
              </Link>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="bg-gray-900/50 rounded-lg shadow-md overflow-hidden border border-gray-800/60">
          {currentEvents.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <table className="min-w-full divide-y divide-gray-800">
                  <thead className="bg-gray-900/80">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Event Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Location
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Attendees
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {currentEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-800/40">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{event.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-cyan-500 mr-2" />
                            <div className="text-sm text-gray-300">{formatEventDate(event)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-cyan-500 mr-2" />
                            <div className="text-sm text-gray-300">{event.location}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 text-cyan-500 mr-2" />
                            <div className="text-sm text-gray-300">{event.attendees}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(event.status)}`}>
                            {event.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Link
                              to={`/event/${event.id}`}
                              className="bg-cyan-900/30 text-cyan-400 hover:bg-cyan-900/50 p-2 rounded-full transition-colors duration-200"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <Link
                              to={`/organizer/event/edit/${event.id}`}
                              className="bg-gray-800/50 text-gray-300 hover:bg-gray-800/80 p-2 rounded-full transition-colors duration-200"
                              title="Edit Event"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => {
                                setDeleteId(event.id);
                                setIsDeleteModalOpen(true);
                              }}
                              className="bg-red-900/30 text-red-400 hover:bg-red-900/50 p-2 rounded-full transition-colors duration-200"
                              title="Delete Event"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-800">
                {currentEvents.map((event) => (
                  <div key={event.id} className="p-4 bg-gray-900/30 hover:bg-gray-800/50">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-white">{event.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-300">
                        <Calendar className="h-4 w-4 text-cyan-500 mr-2" />
                        {formatEventDate(event)}
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <MapPin className="h-4 w-4 text-cyan-500 mr-2" />
                        {event.location || "No location provided"}
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <Users className="h-4 w-4 text-cyan-500 mr-2" />
                        {event.attendees} attendees
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Link
                        to={`/event/${event.id}`}
                        className="bg-cyan-900/30 text-cyan-400 hover:bg-cyan-900/50 p-2 rounded-full transition-colors duration-200"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/organizer/event/edit/${event.id}`}
                        className="bg-gray-800/50 text-gray-300 hover:bg-gray-800/80 p-2 rounded-full transition-colors duration-200"
                        title="Edit Event"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => {
                          setDeleteId(event.id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="bg-red-900/30 text-red-400 hover:bg-red-900/50 p-2 rounded-full transition-colors duration-200"
                        title="Delete Event"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-12 text-center">
              {loading ? (
                <p className="text-gray-400">Loading events...</p>
              ) : (
                <>
                  <p className="text-gray-400 mb-4">No events found. Try adjusting your search criteria or create a new event.</p>
                  <Link
                    to="/organizer/event/create"
                    className="inline-flex items-center px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-medium rounded-lg"
                  >
                    Create Your First Event
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Pagination */}
          {filteredEvents.length > eventsPerPage && (
            <div className="px-4 py-3 bg-gray-900/80 border-t border-gray-800 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-300">
                      Showing <span className="font-medium">{indexOfFirstEvent + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(indexOfLastEvent, filteredEvents.length)}</span> of{' '}
                      <span className="font-medium">{filteredEvents.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border bg-gray-800 text-sm font-medium ${currentPage === 1 ? 'text-gray-500 border-gray-700 cursor-not-allowed' : 'text-gray-300 border-gray-700 hover:bg-gray-700'
                          }`}
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => paginate(index + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === index + 1
                            ? 'z-10 bg-cyan-900/40 border-cyan-500 text-cyan-400'
                            : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border bg-gray-800 text-sm font-medium ${currentPage === totalPages ? 'text-gray-500 border-gray-700 cursor-not-allowed' : 'text-gray-300 border-gray-700 hover:bg-gray-700'
                          }`}
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>

                {/* Mobile Pagination */}
                <div className="flex items-center justify-between w-full sm:hidden">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${currentPage === 1 ? 'text-gray-500 bg-gray-800 border-gray-700 cursor-not-allowed' : 'text-gray-300 bg-gray-800 border-gray-700 hover:bg-gray-700'
                      }`}
                  >
                    Previous
                  </button>
                  <div className="text-sm text-gray-300">
                    Page {currentPage} of {totalPages}
                  </div>
                  <button
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${currentPage === totalPages ? 'text-gray-500 bg-gray-800 border-gray-700 cursor-not-allowed' : 'text-gray-300 bg-gray-800 border-gray-700 hover:bg-gray-700'
                      }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal - updated for dark theme */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg shadow-xl max-w-md w-full border border-gray-800">
            <div className="p-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900/30 mb-4">
                <Trash2 className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-white text-center mb-2">Delete Event</h3>
              <p className="text-gray-400 text-center mb-6">
                Are you sure you want to delete this event? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventListPage;