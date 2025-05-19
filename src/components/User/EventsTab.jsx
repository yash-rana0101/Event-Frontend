import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import EventCard from './EventCard';
import { useSelector } from 'react-redux';

const EventsTab = ({ userId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const token = useSelector(state => state.auth?.token);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
        
        // Fetch user registrations instead of profile
        const response = await axios.get(`${apiUrl}/registrations`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Get events from registrations
        if (response.data) {
          // Process registrations into events format
          const processedEvents = response.data.map(registration => ({
            id: registration.event?._id,
            title: registration.event?.title || "Unnamed Event",
            date: registration.event?.date || new Date(registration.event?.startDate || registration.registrationDate).toLocaleDateString(),
            location: registration.event?.location?.address || "No location specified",
            status: registration.status || "confirmed"
          })).filter(event => event.id); // Filter out any events without an ID
          
          setEvents(processedEvents);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message || "Failed to load events");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchEvents();
    } else {
      setLoading(false);
      setEvents([]);
    }
  }, [userId, token]);

  // Split events into upcoming and past
  const currentDate = new Date();
  
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= currentDate || event.status === 'confirmed';
  });
  
  const pastEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate < currentDate && event.status !== 'confirmed';
  });

  const displayEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <p className="text-red-400 text-center">Error loading events: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Selection */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 border-b-2 font-medium ${
            activeTab === 'upcoming'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Upcoming Events
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 border-b-2 font-medium ${
            activeTab === 'past'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Past Events
        </button>
      </div>

      {/* Events List */}
      {displayEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-900/70 rounded-lg p-6 border border-gray-800 text-center">
          <p className="text-gray-400">
            {activeTab === 'upcoming'
              ? "No upcoming events found."
              : "No past events found."}
          </p>
          <Link
            to="/event"
            className="mt-4 inline-block px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition-colors"
          >
            Browse Events
          </Link>
        </div>
      )}
    </div>
  );
};

export default EventsTab;
