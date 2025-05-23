/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import axios from 'axios';
import { toast } from 'react-toastify';
import Evnetpage from "../../components/Events/Evnetpage";
import EventSkeleton from "../../components/UI/Skeleton";
import { useLoader } from "../../context/LoaderContext";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [newEvents, setNewEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: '',
    status: 'all',
    sortBy: 'startDate',
    search: ''
  });

  const { setIsLoading } = useLoader();

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setIsLoading(true); // To show loader
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

        // Build query parameters for filtering and pagination
        const queryParams = new URLSearchParams({
          page: page,
          limit: 6,
          status: filters.status
        });

        if (filters.category) queryParams.append('category', filters.category);
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);

        console.log(`Fetching events from: ${apiUrl}/events?${queryParams.toString()}`);

        const response = await axios.get(`${apiUrl}/events`, {
          params: {
            page: page,
            limit: 6,
            status: filters.status,
            category: filters.category || undefined,
            search: filters.search || undefined,
            sortBy: filters.sortBy || 'startDate'
          }
        });

        // Extract events from the response
        let fetchedEvents = [];
        if (Array.isArray(response.data)) {
          fetchedEvents = response.data;
        } else if (response.data.events && Array.isArray(response.data.events)) {
          fetchedEvents = response.data.events;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          fetchedEvents = response.data.data;
        } else {
          console.warn("Unexpected response format:", response.data);
          fetchedEvents = [];
        }

        // Set pagination data
        if (response.data.totalPages) {
          setTotalPages(response.data.totalPages);
        } else if (response.data.total) {
          // Some API responses provide total count instead
          const totalItems = response.data.total;
          const calculatedPages = Math.ceil(totalItems / 6);
          setTotalPages(Math.max(1, calculatedPages));
        }

        if (fetchedEvents.length === 0) {
          console.warn("No events found in the response");
        } else {
          console.log(`Received ${fetchedEvents.length} events`);
        }

        // Format events
        const formattedEvents = fetchedEvents.map(event => ({
          id: event._id,
          title: event.title,
          description: event.description ? (event.description.substring(0, 120) + '...') : '',
          date: new Date(event.startDate || event.date || Date.now()).toLocaleDateString(),
          location: (event.location?.address || event.location?.city || 'No location specified'),
          image: event.images?.[0],
          category: event.category,
          attendees: event.attendeesCount,
          organizer: event.organizerName,
        }));

        setEvents(formattedEvents);

        // Get the newest events for the carousel
        try {
          const newestResponse = await axios.get(`${apiUrl}/events/newest`, {
            params: { limit: 5 }
          });

          let newestData = [];
          if (Array.isArray(newestResponse.data)) {
            newestData = newestResponse.data;
          } else if (newestResponse.data.events) {
            newestData = newestResponse.data.events;
          } else if (newestResponse.data.data) {
            newestData = newestResponse.data.data;
          }

          // Format newest events
          const formattedNewEvents = newestData.map(event => ({
            id: event._id,
            title: event.title,
            date: new Date(event.startDate || event.date).toLocaleDateString(),
            image: event.images?.[0] || 'https://placehold.co/600x400?text=No+Image',
            location: (event.location?.address || event.location?.city || 'No location specified'),
            category: event.category
          }));

          setNewEvents(formattedNewEvents);
        } catch (err) {
          console.warn("Could not fetch newest events:", err.message);
          // Fallback: use the newest events from main events array if available
          if (formattedEvents.length > 0) {
            const sortedByDate = [...formattedEvents].sort((a, b) =>
              new Date(b.startDate || b.date) - new Date(a.startDate || a.date)
            );
            setNewEvents(sortedByDate.slice(0, 5));
          }
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
        toast.error(`Could not fetch events from server: ${err.message}`);
      } finally {
        setLoading(false);
        setIsLoading(false); // To hide loader
      }
    };

    fetchEvents();
  }, [page, filters]);

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setPage(1); // Reset to first page when filters change
  };

  // Handle search input
  const handleSearch = (searchText) => {
    setFilters(prev => ({
      ...prev,
      search: searchText
    }));
    setPage(1); // Reset to first page when search changes
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && page === 1) {
    return (
      <div className="min-h-screen bg-black pt-20">
        <EventSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Evnetpage
          events={events}
          newEvents={newEvents}
          loading={loading}
          error={error}
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </motion.div>
    </div>
  );
}