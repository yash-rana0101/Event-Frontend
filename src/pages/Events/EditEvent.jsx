import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Edit, Trash2, Share2, ChevronLeft, Star, Music, Coffee, MessageSquare, Loader, AlertCircle, Check } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { safelyParseToken } from '../../utils/persistFix';

export default function EditEvent() {
  const { eventId } = useParams(); // Get eventId from URL params
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();

  // States for data management
  const [event, setEvent] = useState({
    id: "",
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    attendees: 0,
    ticketsSold: 0,
    category: "",
    image: "",
    organizer: "",
    featured: false,
    sessions: []
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [newSession, setNewSession] = useState({ name: "", speaker: "", time: "" });

  // Get auth token from Redux
  const organizerToken = useSelector(state => state.organizer?.token);
  const userToken = useSelector(state => state.auth?.token);

  // Fetch event data when component mounts
  useEffect(() => {
    if (eventId) {
      fetchEventData();
    } else {
      setLoading(false);
      setError("No event ID provided");
    }
  }, [eventId]);

  const fetchEventData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
      
      console.log(`Fetching event data from: ${apiUrl}/events/${eventId}`);
      
      // Get token for authorization
      let rawToken = organizerToken || localStorage.getItem('organizer_token');
      const token = safelyParseToken(rawToken);

      // Attempt to fetch with authorization header (in case it's a private event)
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      try {
        const response = await axios.get(`${apiUrl}/events/${eventId}`, { headers });
        const eventData = response.data;
        
        // Format the data for our component
        setEvent({
          id: eventData._id || eventId,
          title: eventData.title || "Untitled Event",
          date: eventData.date || new Date(eventData.startDate || Date.now()).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          time: eventData.time || `${new Date(eventData.startDate || Date.now()).toLocaleTimeString([],
            { hour: '2-digit', minute: '2-digit' })} - ${new Date(eventData.endDate || Date.now()).toLocaleTimeString([],
              { hour: '2-digit', minute: '2-digit' })}`,
          location: eventData.location?.address || eventData.location || "",
          description: eventData.description || "",
          attendees: eventData.capacity || 0,
          ticketsSold: eventData.attendeesCount || 0,
          category: eventData.category || "Technology",
          image: eventData.images?.[0] || "/api/placeholder/800/400",
          organizer: eventData.organizer?.name || eventData.organizerName || "Event Organizer",
          organizerId: eventData.organizer?._id || eventData.organizer,
          featured: eventData.featured || false,
          sessions: eventData.timeline || eventData.sessions || []
        });
        
        // If the event was successfully loaded, set error to null
        setError(null);
      } catch (firstError) {
        console.error("Error fetching from first endpoint:", firstError.message);
        
        // If first attempt fails, try alternate endpoint
        console.log("Trying alternate endpoint...");
        const response = await axios.get(`${apiUrl}/events/${eventId}`, { headers });
        const eventData = response.data;
        
        // Format the data for our component 
        setEvent({
          id: eventData._id || eventId,
          title: eventData.title || "Untitled Event",
          date: eventData.date || new Date(eventData.startDate || Date.now()).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          time: eventData.time || `${new Date(eventData.startDate || Date.now()).toLocaleTimeString([],
            { hour: '2-digit', minute: '2-digit' })} - ${new Date(eventData.endDate || Date.now()).toLocaleTimeString([],
              { hour: '2-digit', minute: '2-digit' })}`,
          location: eventData.location?.address || eventData.location || "",
          description: eventData.description || "",
          attendees: eventData.capacity || 0,
          ticketsSold: eventData.attendeesCount || 0,
          category: eventData.category || "Technology",
          image: eventData.images?.[0] || "/api/placeholder/800/400",
          organizer: eventData.organizer?.name || eventData.organizerName || "Event Organizer",
          organizerId: eventData.organizer?._id || eventData.organizer,
          featured: eventData.featured || false,
          sessions: eventData.timeline || eventData.sessions || []
        });
        
        setError(null);
      }
    } catch (err) {
      console.error("Failed to fetch event:", err);
      setError(err.response?.data?.message || "Could not load event data. Please try again.");
      toast.error("Error loading event data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEvent({
      ...event,
      [name]: value
    });
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSessionChange = (e) => {
    const { name, value } = e.target;
    setNewSession(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addSession = () => {
    if (newSession.name && newSession.time) {
      setEvent(prev => ({
        ...prev,
        sessions: [...prev.sessions, newSession]
      }));
      setNewSession({ name: "", speaker: "", time: "" });
    } else {
      toast.warning("Session name and time are required");
    }
  };

  const removeSession = (index) => {
    setEvent(prev => ({
      ...prev,
      sessions: prev.sessions.filter((_, i) => i !== index)
    }));
  };

    const saveChanges = async () => {
    setSaving(true);
    setError(null);
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const token = organizerToken || userToken;
      
      if (!token) {
        throw new Error("Authentication required");
      }

      // Parse the token from the store
      const parsedToken = safelyParseToken(token);
      
      // Prepare data for API
      const eventData = {
        title: event.title,
        description: event.description,
        category: event.category,
        location: {
          address: event.location
        },
        // Convert sessions data to timeline format expected by API
        timeline: event.sessions.map(session => ({
          time: session.time,
          event: session.name || session.event,
          speaker: session.speaker
        })),
        featured: event.featured
      };
      
      console.log(`Updating event with ID: ${event.id}`);
      console.log("Data to send:", eventData);
      
      // Make a single request to update the event
      const response = await axios.put(
        `${apiUrl}/events/${event.id}`,
        eventData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${parsedToken}`
          }
        }
      );
      
      // If we've reached here, the request succeeded
      console.log("Update response:", response?.data);
      setSuccess(true);
      setIsEditMode(false);
      toast.success("Event updated successfully!");
      
      // Reload the data to show updated info
      setTimeout(() => {
        fetchEventData();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      console.error("Error updating event:", err);
      
      // More detailed error logging
      if (err.response) {
        console.error("Response status:", err.response.status);
        console.error("Response data:", err.response.data);
      }
      
      // Add debugging info to the error message
      let errorMessage = err.response?.data?.message || "Failed to update event";
      
      // Provide specific guidance based on error
      if (err.response?.status === 404) {
        errorMessage = "Event not found or you don't have permission to update it. The event might have been deleted.";
        toast.error(errorMessage);
        // Option to navigate back after a failure
        setTimeout(() => {
          // navigate('/organizer/dashboard');
        }, 5000);
      } else if (err.response?.status === 403) {
        errorMessage = "You don't have permission to edit this event.";
        toast.error(errorMessage);
      } else if (err.response?.status === 401) {
        errorMessage = "Your session has expired. Please log in again.";
        toast.error(errorMessage);
        // Clear token and redirect to login
        localStorage.removeItem('organizer_token');
        setTimeout(() => {
          navigate('/organizer/login');
        }, 2000);
      } else {
        toast.error(`Error: ${errorMessage}`);
      }
      
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

    // Check if the event API has the correct event ID structure
    useEffect(() => {
      // This function can help debug if there's an ID mismatch between what we use in the UI vs. the API
      const verifyEventId = async () => {
        try {
          if (!eventId) return;
          
          // Try to fetch events and look for the current one
          const apiUrl = import.meta.env.VITE_API_URL;
          const response = await axios.get(`${apiUrl}/events`);
          
          const events = response.data.events || response.data;
          if (Array.isArray(events)) {
            console.log("Available events:", events.map(e => ({ id: e._id, title: e.title })));
            
            // Check if our event ID exists in the list
            const eventExists = events.some(e => e._id === eventId);
            console.log(`Current event ID ${eventId} exists in API response: ${eventExists}`);
          }
        } catch (error) {
          console.error("Error checking events:", error);
        }
      };
      
      verifyEventId();
    }, [eventId]);

    const confirmDelete = async () => {
      try {
        setIsDeleteModalOpen(false);

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
        const token = organizerToken || userToken;

        if (!token) {
          throw new Error("Authentication required");
        }

        const parsedToken = safelyParseToken(token);

        // Delete the event
        await axios.delete(
          `${apiUrl}/events/${event.id}`,
          {
            headers: {
              'Authorization': `Bearer ${parsedToken}`
            }
          }
        );

        toast.success("Event deleted successfully");

        // Navigate back to events list
        navigate('/organizer/dashboard');
      } catch (err) {
        console.error("Error deleting event:", err);
        toast.error(err.response?.data?.message || "Failed to delete event");
      }
    };

    if (loading) {
      return (
        <div className="min-h-screen text-gray-100 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader size={32} className="text-cyan-400 animate-spin mb-4" />
            <h3 className="text-xl">Loading event details...</h3>
          </div>
        </div>
      );
    }

  if (error && !event.id) {
    return (
      <div className="min-h-screen text-gray-100 p-4">
        <div className="max-w-lg mx-auto bg-gray-800 rounded-xl p-6 mt-12 border border-red-500/30">
          <div className="flex items-center mb-4">
            <AlertCircle className="text-red-500 mr-3" size={24} />
            <h2 className="text-xl font-semibold">Error Loading Event</h2>
          </div>
          <p className="text-gray-300 mb-6">{error}</p>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/organizer/dashboard')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={fetchEventData}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-md transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-100">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-black p-4 z-50 shadow-md shadow-cyan-900/20 border-b border-gray-800">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <ChevronLeft size={24} className="text-cyan-400" />
            </button>
            <h1 className="text-xl font-bold text-cyan-400">Event Manager</h1>
          </div>
          <div className="flex space-x-3">
            {!isEditMode && (
              <>
                <button
                  onClick={toggleEditMode}
                  className="flex items-center px-4 py-2 rounded-xl bg-gradient-to-r bg-cyan-400 text-black font-medium transition-colors cursor-pointer space-x-2 hover:bg-black hover:text-cyan-400 hover:border hover:border-cyan-400"
                >
                  <Edit size={16} className="mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-red-700 hover:bg-gray-600 rounded-md transition-colors cursor-pointer"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </button>
              </>
            )}
            {isEditMode && (
              <>
                <button
                  onClick={saveChanges}
                  disabled={saving}
                  className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader size={16} className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : 'Save'}
                </button>
                <button
                  onClick={toggleEditMode}
                  className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-10 pt-24">
        {/* Success message */}
        {success && (
          <div className="mb-4 p-4 bg-green-900/30 border border-green-500 rounded-lg flex items-center">
            <Check size={20} className="text-green-500 mr-2" />
            <span className="text-green-300">Event updated successfully</span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 p-4 bg-red-900/30 border border-red-500 rounded-lg flex items-center">
            <AlertCircle size={20} className="text-red-500 mr-2" />
            <span className="text-red-300">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Hero Section */}
            <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-gray-800 to-black border border-gray-800 shadow-lg">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-64 md:h-80 object-cover opacity-80"
              />
              <div className="absolute top-4 right-4">
                {event.featured && (
                  <div className="flex items-center bg-cyan-600 px-3 py-1 rounded-full text-sm">
                    <Star size={14} className="mr-1" />
                    Featured
                  </div>
                )}
              </div>

              <div className="p-4 space-y-4">
                {isEditMode ? (
                  <input
                    type="text"
                    name="title"
                    value={event.title}
                    onChange={handleInputChange}
                    className="w-full text-2xl md:text-3xl font-bold bg-transparent border-b border-cyan-500 focus:outline-none focus:border-cyan-300 pb-1"
                  />
                ) : (
                  <h2 className="text-2xl md:text-3xl font-bold text-cyan-300">{event.title}</h2>
                )}

                <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-2 md:space-y-0 text-gray-300">
                  <div className="flex items-center">
                    <Calendar size={18} className="mr-2 text-cyan-400" />
                    {isEditMode ? (
                      <input
                        type="text"
                        name="date"
                        value={event.date}
                        onChange={handleInputChange}
                        className="bg-transparent border-b border-cyan-500 focus:outline-none focus:border-cyan-300"
                      />
                    ) : event.date}
                  </div>
                  <div className="flex items-center">
                    <Clock size={18} className="mr-2 text-cyan-400" />
                    {isEditMode ? (
                      <input
                        type="text"
                        name="time"
                        value={event.time}
                        onChange={handleInputChange}
                        className="bg-transparent border-b border-cyan-500 focus:outline-none focus:border-cyan-300"
                      />
                    ) : event.time}
                  </div>
                  <div className="flex items-center">
                    <MapPin size={18} className="mr-2 text-cyan-400" />
                    {isEditMode ? (
                      <input
                        type="text"
                        name="location"
                        value={event.location}
                        onChange={handleInputChange}
                        className="bg-transparent border-b border-cyan-500 focus:outline-none focus:border-cyan-300"
                      />
                    ) : event.location}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-cyan-300">Event Description</h3>
              {isEditMode ? (
                <textarea
                  name="description"
                  value={event.description}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 focus:outline-none focus:border-cyan-500 text-gray-200"
                ></textarea>
              ) : (
                <p className="text-gray-300 leading-relaxed">{event.description}</p>
              )}
            </div>

            {/* Sessions */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-cyan-300">Event Sessions</h3>
              <div className="space-y-4">
                {event.sessions && event.sessions.length > 0 ? (
                  event.sessions.map((session, index) => (
                    <div key={index} className="p-4 rounded-lg border border-gray-700 bg-gray-900 hover:border-cyan-500 transition-colors">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div>
                          <h4 className="font-medium text-white">{session.name || session.event}</h4>
                          <p className="text-gray-400">{session.speaker}</p>
                        </div>
                        <div className="flex items-center mt-2 md:mt-0">
                          <Clock size={16} className="text-cyan-400 mr-2" />
                          <span className="text-gray-300">{session.time}</span>
                          {isEditMode && (
                            <button
                              onClick={() => removeSession(index)}
                              className="ml-3 text-red-400 hover:text-red-300"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center pb-2">No sessions added yet</p>
                )}

                {isEditMode && (
                  <div className="mt-4 bg-gray-900 border border-gray-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium mb-3 text-cyan-400">Add New Session</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Session Name"
                        name="name"
                        value={newSession.name}
                        onChange={handleSessionChange}
                        className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                      />
                      <input
                        type="text"
                        placeholder="Speaker"
                        name="speaker"
                        value={newSession.speaker}
                        onChange={handleSessionChange}
                        className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                      />
                      <input
                        type="text"
                        placeholder="Time (e.g. 9:00 AM - 10:30 AM)"
                        name="time"
                        value={newSession.time}
                        onChange={handleSessionChange}
                        className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <button
                      onClick={addSession}
                      className="w-full mt-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
                    >
                      Add Session
                    </button>
                  </div>
                )}

                {isEditMode && event.sessions.length === 0 && (
                  <button className="w-full p-3 border border-dashed border-cyan-500 rounded-lg text-cyan-400 hover:bg-cyan-900/20 transition-colors mt-2">
                    + Add New Session
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Status */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-cyan-300">Event Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                  <span className="text-gray-300">Status</span>
                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">Active</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                  <span className="text-gray-300">Category</span>
                  {isEditMode ? (
                    <select
                      name="category"
                      value={event.category}
                      onChange={handleInputChange}
                      className="bg-gray-900 border border-gray-700 rounded-md p-1 text-cyan-300"
                    >
                      <option value="Technology">Technology</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Conference">Conference</option>
                      <option value="Meetup">Meetup</option>
                      <option value="Hackathon">Hackathon</option>
                      <option value="Webinar">Webinar</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <span className="text-cyan-300">{event.category}</span>
                  )}
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                  <span className="text-gray-300">Created by</span>
                  <span className="text-white">{event.organizer}</span>
                </div>
                {isEditMode && (
                  <div className="flex items-center pt-2">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        name="featured"
                        checked={event.featured}
                        onChange={(e) => setEvent({ ...event, featured: e.target.checked })}
                      />
                      <div className="relative w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-cyan-600 peer-focus:ring-2 peer-focus:ring-cyan-300 dark:peer-focus:ring-cyan-800">
                        <div className={`absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5 transition-all ${event.featured ? 'translate-x-full' : ''}`}></div>
                      </div>
                      <span className="ml-3 text-sm font-medium text-gray-300">Featured Event</span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Analytics */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-cyan-300">Analytics</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-300">Ticket Sales</span>
                    <span className="text-cyan-300">{event.ticketsSold}/{event.attendees}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-cyan-500 h-2.5 rounded-full"
                      style={{ width: `${event.attendees ? (event.ticketsSold / event.attendees) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                    <div className="text-2xl font-bold text-white">{event.attendees}</div>
                    <div className="text-sm text-gray-400">Capacity</div>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                    <div className="text-2xl font-bold text-cyan-400">{event.ticketsSold}</div>
                    <div className="text-sm text-gray-400">Registered</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-cyan-300">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/event/${event.id}`;
                    navigator.clipboard.writeText(url);
                    toast.success("Event link copied to clipboard");
                  }}
                  className="flex flex-col items-center justify-center p-4 bg-gray-900 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
                >
                  <Share2 size={20} className="text-cyan-400 mb-2" />
                  <span className="text-sm">Share</span>
                </button>
                <button
                  onClick={() => navigate(`/organizer/events/${event.id}/attendees`)}
                  className="flex flex-col items-center justify-center p-4 bg-gray-900 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
                >
                  <Users size={20} className="text-cyan-400 mb-2" />
                  <span className="text-sm">Attendees</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 bg-gray-900 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700">
                  <Music size={20} className="text-cyan-400 mb-2" />
                  <span className="text-sm">Promo</span>
                </button>
                <button
                  onClick={() => navigate(`/event/${event.id}`)}
                  className="flex flex-col items-center justify-center p-4 bg-gray-900 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
                >
                  <MessageSquare size={20} className="text-cyan-400 mb-2" />
                  <span className="text-sm">View Event</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-white">Delete Event</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to delete "{event.title}"? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}