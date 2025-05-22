/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Clock, Users, Star, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import EventCard from './EventCard';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

const EventsTab = ({ userId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [detailedEvents, setDetailedEvents] = useState({});
  const token = useSelector(state => state.auth?.token);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL;

        // Fetch user registrations
        const registrationsResponse = await axios.get(`${apiUrl}/registrations`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!registrationsResponse.data || registrationsResponse.data.length === 0) {
          setEvents([]);
          setLoading(false);
          return;
        }

        // Extract event IDs from registrations
        const eventIds = registrationsResponse.data
          .filter(reg => reg.event && (reg.event._id || reg.event))
          .map(reg => typeof reg.event === 'string' ? reg.event : reg.event._id);

        // Fetch full details for each event if we have IDs
        const detailedEventsData = {};

        if (eventIds.length > 0) {
          // Fetch detailed info for each event in parallel
          await Promise.all(eventIds.map(async (eventId) => {
            try {
              const eventDetailResponse = await axios.get(`${apiUrl}/events/${eventId}`);
              if (eventDetailResponse.data) {
                // Store detailed event data with both possible ID formats as keys
                detailedEventsData[eventId] = eventDetailResponse.data;
                if (eventDetailResponse.data._id) {
                  detailedEventsData[eventDetailResponse.data._id] = eventDetailResponse.data;
                }
              }
            } catch (detailErr) {
              console.warn(`Couldn't fetch details for event ${eventId}:`, detailErr);
            }
          }));
        }

        // Process registrations into events format with registration status
        const processedEvents = registrationsResponse.data.map(registration => {
          // Handle both string ID and object references
          const eventId = typeof registration.event === 'string'
            ? registration.event
            : registration.event?._id;

          // Get detailed event data
          const detailedEvent = detailedEventsData[eventId] || {};

          // Debug log to see what data we're working with
          console.log(`Processing event ${eventId}:`, {
            detailedTitle: detailedEvent?.title,
            regEventTitle: registration.event?.title,
            detailedEvent: detailedEvent,
            regEvent: registration.event
          });

          // Access the event object properly from either detailed data or registration
          const eventData = {
            id: eventId,
            // For title, explicitly check if we have data before using it
            title: detailedEvent?.title ||
              (registration.event && typeof registration.event !== 'string' ? registration.event.title : null) ||
              "Unnamed Event",
            description: detailedEvent?.description ||
              (registration.event && typeof registration.event !== 'string' ? registration.event.description : null) ||
              "",
            date: detailedEvent?.date ||
              (registration.event && typeof registration.event !== 'string' ? registration.event.date : null) ||
              new Date(
                detailedEvent?.startDate ||
                (registration.event && typeof registration.event !== 'string' ? registration.event.startDate : null) ||
                registration.registrationDate ||
                Date.now()
              ).toLocaleDateString(),
            // Handle other properties similarly with careful null/undefined checking
            location: detailedEvent?.location?.address ||
              (registration.event && typeof registration.event !== 'string' ? registration.event.location?.address : null) ||
              "No location specified",
            image: detailedEvent?.images?.[0] ||
              (registration.event && typeof registration.event !== 'string' ? registration.event.images?.[0] : null) ||
              null,
            category: detailedEvent?.category ||
              (registration.event && typeof registration.event !== 'string' ? registration.event.category : null) ||
              "Event",
            organizerName: detailedEvent?.organizerName ||
              (registration.event && typeof registration.event !== 'string' ? registration.event.organizerName : null) ||
              "Event Organizer",
            status: registration.status || "confirmed",
            attendees: detailedEvent?.attendeesCount ||
              (registration.event && typeof registration.event !== 'string' ? registration.event.attendeesCount : null) ||
              0,
            rating: detailedEvent?.rating ||
              (registration.event && typeof registration.event !== 'string' ? registration.event.rating : null),
            registrationDate: new Date(registration.createdAt).toLocaleDateString(),
            registrationId: registration._id,
            featured: detailedEvent?.featured || false,
            isPaid: detailedEvent?.isPaid || false,
            price: detailedEvent?.price,
            currency: detailedEvent?.currency || 'USD'
          };

          return {
            ...eventData
          };
        }).filter(event => event.id); // Filter out any events without an ID

        setEvents(processedEvents);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.response?.data?.message || err.message || "Failed to load events");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchEvents();
    } else {
      setLoading(false);
      setEvents([]);
      setError("Authentication required to fetch events");
    }
  }, [userId, token]);

  // Add a third tab for cancelled events
  const currentDate = new Date();

  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return (eventDate >= currentDate || !isNaN(eventDate.getTime())) &&
      (event.status === 'confirmed' || event.status === 'pending');
  });

  const pastEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate < currentDate &&
      !isNaN(eventDate.getTime()) &&
      event.status !== 'cancelled';
  });

  const cancelledEvents = events.filter(event =>
    event.status === 'cancelled'
  );

  // Determine which events to display based on active tab
  let displayEvents = [];
  if (activeTab === 'upcoming') displayEvents = upcomingEvents;
  else if (activeTab === 'past') displayEvents = pastEvents;
  else if (activeTab === 'cancelled') displayEvents = cancelledEvents;

  // Animation variants
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex border-b border-gray-700">
          {/* Loading tab skeleton */}
          <div className="px-4 py-2 border-b-2 border-transparent">
            <div className="h-6 w-28 bg-gray-700 animate-pulse rounded"></div>
          </div>
          <div className="px-4 py-2 border-b-2 border-transparent">
            <div className="h-6 w-24 bg-gray-700 animate-pulse rounded"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-gray-900/70 rounded-lg p-6 border border-gray-800 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-red-900/30">
        <div className="flex items-center justify-center mb-4">
          <AlertCircle className="text-red-400 mr-2" size={20} />
          <h3 className="text-red-400 font-medium">Error Loading Events</h3>
        </div>
        <p className="text-gray-400 text-center mb-4">{error}</p>
        <div className="text-center">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-cyan-500 text-black rounded-md hover:bg-cyan-400 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Selection */}
      <div className="flex border-b border-gray-700 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 border-b-2 font-medium whitespace-nowrap ${activeTab === 'upcoming'
            ? 'border-cyan-500 text-cyan-400'
            : 'border-transparent text-gray-400 hover:text-white'
            }`}
        >
          Upcoming Events ({upcomingEvents.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 border-b-2 font-medium whitespace-nowrap ${activeTab === 'past'
            ? 'border-cyan-500 text-cyan-400'
            : 'border-transparent text-gray-400 hover:text-white'
            }`}
        >
          Past Events ({pastEvents.length})
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`px-4 py-2 border-b-2 font-medium whitespace-nowrap ${activeTab === 'cancelled'
            ? 'border-cyan-500 text-cyan-400'
            : 'border-transparent text-gray-400 hover:text-white'
            }`}
        >
          Cancelled ({cancelledEvents.length})
        </button>
      </div>

      {/* Events List with animations */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={containerVariants}
        >
          {displayEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayEvents.map((event) => (
                <motion.div key={event.id} variants={itemVariants}>
                  <EventCard
                    event={event}
                    registrationStatus={event.status}
                    registrationDate={event.registrationDate}
                    showDetailedStatus={true}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="bg-gray-900/70 rounded-lg p-6 border border-gray-800 text-center"
            >
              <p className="text-gray-400 mb-3">
                {activeTab === 'upcoming'
                  ? "No upcoming events found."
                  : activeTab === 'past'
                    ? "No past events found."
                    : "No cancelled events found."}
              </p>
              <Link
                to="/event"
                className="mt-4 inline-block px-4 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-colors"
              >
                Browse Events
              </Link>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Stats summary */}
      {events.length > 0 && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 mt-4">
          <h3 className="text-gray-300 font-medium mb-2">Your Event Activity</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="bg-black/30 p-2 rounded-md">
              <p className="text-gray-400">Total Events</p>
              <p className="text-cyan-400 font-medium">{events.length}</p>
            </div>
            <div className="bg-black/30 p-2 rounded-md">
              <p className="text-gray-400">Upcoming</p>
              <p className="text-cyan-400 font-medium">{upcomingEvents.length}</p>
            </div>
            <div className="bg-black/30 p-2 rounded-md">
              <p className="text-gray-400">Completed</p>
              <p className="text-cyan-400 font-medium">{pastEvents.length}</p>
            </div>
            <div className="bg-black/30 p-2 rounded-md">
              <p className="text-gray-400">Cancelled</p>
              <p className="text-cyan-400 font-medium">{cancelledEvents.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsTab;
