/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { safelyParseToken } from '../../utils/persistFix';
import { useLoader } from '../../context/LoaderContext';

// Import components
import AttendanceHeader from '../../components/Attendance/AttendanceHeader';
import SearchFilter from '../../components/Attendance/SearchFilter';
import LoadingState from '../../components/Attendance/LoadingState';
import ErrorState from '../../components/Attendance/ErrorState';
import EmptyState from '../../components/Attendance/EmptyState';
import EventsGrid from '../../components/Attendance/EventsGrid';
import Pagination from '../../components/Attendance/Pagination';

// Import utils
import { formatDate, getEventStatus, getRandomEventImage } from '../../utils/eventUtils';
import Skeleton from '../../components/UI/Skeleton';

export default function Attendance() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(6);
  const [refreshing, setRefreshing] = useState(false);
  const { setIsLoading } = useLoader();

  // Navigation
  const navigate = useNavigate();

  // Get auth token from Redux store
  const organizerToken = useSelector(state => state.organizer?.token);

  useEffect(() => {
    setIsLoading(loading);
    return () => setIsLoading(false);
  }, [loading, setIsLoading]);

  // Fetch events data
  useEffect(() => {
    fetchEvents();
  }, []);

  const getUserIdFromToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload);
      return payload.id;
    } catch (e) {
      console.error("Error extracting user ID from token:", e);
      return null;
    }
  };

  const fetchEvents = async () => {
    setRefreshing(true);
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

      // Try to get events organized by this organizer
      const organizerId = getUserIdFromToken(token);
      let eventsResponse;

      try {
        eventsResponse = await axios.get(`${apiUrl}/events/organizer/${organizerId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.log("First endpoint attempt failed, trying alternative", err);
        // If the first approach fails, try the general events endpoint
        eventsResponse = await axios.get(`${apiUrl}/organizer/events`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      // Process the response data
      let eventsData = Array.isArray(eventsResponse.data)
        ? eventsResponse.data
        : (eventsResponse.data.data || eventsResponse.data.events || []);

      // Format the events
      const formattedEvents = eventsData.map(event => ({
        id: event._id,
        title: event.title,
        description: event.description?.substring(0, 100) + (event.description?.length > 100 ? '...' : '') || 'No description available',
        date: event.startDate || event.date || event.createdAt,
        formattedDate: formatDate(event.startDate || event.date || event.createdAt),
        location: event.location?.address || 'No location specified',
        attendees: event.attendeesCount || 0,
        capacity: event.capacity || 'Unlimited',
        status: getEventStatus(event.startDate || event.date, event.endDate),
        image: event.images?.[0] || getRandomEventImage()
      }));

      setEvents(formattedEvents);
      setFilteredEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events. Please try again later.');
      toast.error('Could not load events. ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Apply filters and search
  useEffect(() => {
    let filtered = [...events];

    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(event => event.status === filterStatus);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'date':
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case 'attendees':
          comparison = a.attendees - b.attendees;
          break;
        default:
          comparison = 0;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    setFilteredEvents(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [events, searchTerm, filterStatus, sortBy, sortDirection]);

  // Handle sort change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  // Handle view attendees click
  const handleViewAttendees = (eventId) => {
    navigate(`/organizer/events/attendees/${eventId}`);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setSortBy('date');
    setSortDirection('asc');
  };

  // Pagination logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  // Page change handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <AttendanceHeader />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          resetFilters={resetFilters}
          refreshing={refreshing}
          fetchEvents={fetchEvents}
        />

        {loading && <Skeleton count={6} />}

        {error && !loading && <ErrorState error={error} retry={fetchEvents} />}

        {!loading && !error && filteredEvents.length === 0 && (
          <EmptyState
            searchTerm={searchTerm}
            filterStatus={filterStatus}
            navigate={navigate}
          />
        )}

        {!loading && !error && filteredEvents.length > 0 && (
          <EventsGrid
            events={currentEvents}
            handleViewAttendees={handleViewAttendees}
          />
        )}

        {!loading && !error && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
          />
        )}
      </div>
    </div>
  );
}
