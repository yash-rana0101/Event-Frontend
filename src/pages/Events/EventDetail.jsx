/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, Clock, Code, Trophy, Briefcase, ChevronDown, Share2, Heart, MessageCircle, AlertCircle, ArrowLeft, Bookmark, ExternalLink } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Error from "../common/Error";
import { useLoader } from '../../context/LoaderContext';
import { FaArrowLeft } from "react-icons/fa";
import Skeleton from "../../components/UI/Skeleton";

export default function EventDetail() {
  const { eventId } = useParams(); // Ensure eventId is retrieved from route params
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarEvents, setSimilarEvents] = useState([]);
  const [showCancelWarning, setShowCancelWarning] = useState(false);
  const [wasRegistered, setWasRegistered] = useState(false);
  const [showReregisterConfirm, setShowReregisterConfirm] = useState(false);

  // New state for social engagement
  const [isSaved, setIsSaved] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [socialStats, setSocialStats] = useState({
    likes: 0,
    comments: 0,
    shares: 0,
    saved: 0
  });
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Get current user from Redux
  const user = useSelector(state => state.auth?.user);
  const organizer = useSelector(state => state.organizer?.user);
  const userToken = useSelector(state => state.auth?.token);

  const { setIsLoading } = useLoader();

  useEffect(() => {
    setIsLoading(loading);
    return () => setIsLoading(false);
  }, [loading, setIsLoading]);

  // Fixed function to fetch event details with saved status
  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!eventId) {
        throw new Error("Event ID is missing.");
      }

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
      const response = await axios.get(`${apiUrl}/events/${eventId}`);
      setEvent(response.data);

      // Initialize social stats from backend or defaults
      const eventData = response.data;
      setSocialStats({
        likes: eventData.socialStats?.likes || 0,
        comments: eventData.socialStats?.comments || 0,
        shares: eventData.socialStats?.shares || 0,
        saved: eventData.socialStats?.saved || 0
      });

      // Fetch similar events based on category or tags
      try {
        let queryParams = '';
        if (eventData.category) {
          queryParams = `category=${eventData.category}`;
        } else if (eventData.tags && eventData.tags.length > 0) {
          queryParams = `tags=${eventData.tags[0]}`;
        }

        const similarResponse = await axios.get(`${apiUrl}/events/published?limit=3&${queryParams}`);

        // Check which property contains events array
        const eventsArray = similarResponse.data.events ||
          similarResponse.data.data ||
          (Array.isArray(similarResponse.data) ? similarResponse.data : []);

        // Filter out the current event from similar events
        setSimilarEvents(eventsArray.filter(e => e._id !== eventId));
      } catch (err) {
        console.warn("Could not load similar events:", err);
        setSimilarEvents([]);
      }

      // Check if user has saved this event
      if (user && userToken) {
        try {
          const savedResponse = await axios.get(
            `${apiUrl}/profiles/me/saved-events`,
            {
              headers: { Authorization: `Bearer ${userToken}` }
            }
          );

          const savedEvents = savedResponse.data.data || [];
          const eventIsSaved = savedEvents.some(e => e._id === eventId || e.event === eventId);
          setIsSaved(eventIsSaved);

          // Check if user has liked this event
          const interactionResponse = await axios.get(
            `${apiUrl}/events/${eventId}/interactions`,
            {
              headers: { Authorization: `Bearer ${userToken}` }
            }
          );

          setHasLiked(interactionResponse.data.hasLiked || false);
        } catch (err) {
          console.warn("Error checking saved/liked status:", err);
        }
      }

      // Check if user is registered for this event
      if (user && userToken) {
        try {
          const registrationResponse = await axios.get(
            `${apiUrl}/registrations/check/${eventId}`,
            {
              headers: { Authorization: `Bearer ${userToken}` }
            }
          );

          // Update registration status based on backend response
          setIsRegistered(registrationResponse.data.isRegistered &&
            registrationResponse.data.status !== "cancelled");

          // If there's a registration but it's cancelled, mark wasRegistered as true
          if (registrationResponse.data.isRegistered &&
            registrationResponse.data.status === "cancelled") {
            setWasRegistered(true);
          }
        } catch (err) {
          // If error occurs in registration check, just assume not registered
          console.warn("Error checking registration status:", err);
          setIsRegistered(false);
        }
      }
    } catch (err) {
      console.error("Error fetching event details:", err);
      // Check if there's a specific error message from the server
      const errorMessage = err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to load event details";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Call fetchEventDetails when component mounts or eventId changes
  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  // Handle save event functionality
  const handleSaveEvent = async () => {
    if (!user && !organizer) {
      toast.info("Please login to save this event");
      navigate("/auth/login", { state: { from: `/event/${eventId}` } });
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

      // Optimistic update
      setIsSaved(prev => !prev);
      setShowSavedToast(true);

      if (isSaved) {
        // Unsave the event - fix the endpoint URL structure
        await axios.delete(`${apiUrl}/profiles/me/events/${eventId}/save`, {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        setSocialStats(prev => ({ ...prev, saved: Math.max(0, prev.saved - 1) }));
        toast.success("Event removed from saved events");
      } else {
        // Save the event - fix the endpoint URL structure
        await axios.post(`${apiUrl}/profiles/me/events/${eventId}/save`, {}, {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        setSocialStats(prev => ({ ...prev, saved: prev.saved + 1 }));
        toast.success("Event saved successfully");
      }

      // Hide saved toast after 2 seconds
      setTimeout(() => setShowSavedToast(false), 2000);

    } catch (err) {
      // Revert optimistic update on error
      setIsSaved(prev => !prev);
      console.error("Error saving/unsaving event:", err);
      toast.error(err.response?.data?.message || "Failed to update saved events");
    }
  };

  // Handle like event functionality
  const handleLikeEvent = async () => {
    if (!user && !organizer) {
      toast.info("Please login to like this event");
      navigate("/auth/login", { state: { from: `/event/${eventId}` } });
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

      // Optimistic update
      setHasLiked(prev => !prev);
      setSocialStats(prev => ({
        ...prev,
        likes: hasLiked ? Math.max(0, prev.likes - 1) : prev.likes + 1
      }));

      if (hasLiked) {
        // Unlike the event
        await axios.delete(`${apiUrl}/events/${eventId}/like`, {
          headers: { Authorization: `Bearer ${userToken}` }
        });
      } else {
        // Like the event
        await axios.post(`${apiUrl}/events/${eventId}/like`, {}, {
          headers: { Authorization: `Bearer ${userToken}` }
        });
      }
    } catch (err) {
      // Revert optimistic update on error
      setHasLiked(prev => !prev);
      setSocialStats(prev => ({
        ...prev,
        likes: hasLiked ? prev.likes + 1 : Math.max(0, prev.likes - 1)
      }));

      console.error("Error liking/unliking event:", err);
      toast.error("Failed to update like status");
    }
  };

  // Handle share event functionality
  const handleShareEvent = async () => {
    try {
      // Optimistic update
      setSocialStats(prev => ({ ...prev, shares: prev.shares + 1 }));

      const shareUrl = window.location.href;
      const eventTitle = event?.title || 'Check out this event';

      // Try to use Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: eventTitle,
          text: `Join me at ${eventTitle}!`,
          url: shareUrl
        });
        toast.success("Event shared successfully");
      } else {
        // Fallback to clipboard if Web Share API is not available
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Event link copied to clipboard!");

        // Show share options
        setShowShareOptions(true);
        setTimeout(() => setShowShareOptions(false), 3000);
      }

      // Update share count on backend
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
      await axios.post(`${apiUrl}/events/${eventId}/share`, {}, {
        headers: user ? { Authorization: `Bearer ${userToken}` } : {}
      });

    } catch (err) {
      // Revert optimistic update on error
      setSocialStats(prev => ({ ...prev, shares: Math.max(0, prev.shares - 1) }));
      console.error("Error sharing event:", err);

      // Still try to copy to clipboard as fallback
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Event link copied to clipboard!");
      } catch (clipboardErr) {
        toast.error("Failed to share event");
      }
    }
  };

  const handleRegister = async () => {
    // If not logged in, redirect to login page
    if (!user && !organizer) {
      toast.info("Please login to register for this event");
      navigate("/auth/login", { state: { from: `/event/${eventId}` } });
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

      // Handling cancellation flow
      if (isRegistered) {
        if (!showCancelWarning) {
          // Show warning first instead of immediately cancelling
          setShowCancelWarning(true);
          return;
        }

        // User confirmed cancellation, proceed
        setShowCancelWarning(false);
        await axios.delete(
          `${apiUrl}/registrations/events/${eventId}`,
          { headers: { Authorization: `Bearer ${userToken}` } }
        );
        setIsRegistered(false);
        setWasRegistered(true); // Mark that user was previously registered
        toast.info("Registration cancelled");
        return;
      }

      // Handling re-registration flow for previously cancelled registrations
      if (wasRegistered && !showReregisterConfirm) {
        // If user previously cancelled and trying to register again, show confirmation first
        setShowReregisterConfirm(true);
        return;
      }

      // Reset confirmation dialog state
      setShowReregisterConfirm(false);

      try {
        // Optimistic update for better UX
        setIsRegistered(true);

        if (wasRegistered) {
          const response = await axios.patch(
            `${apiUrl}/registrations/events/${eventId}/reactivate`,
            {
              status: "confirmed",
              event: eventId,
              user: user._id
            },
            { headers: { Authorization: `Bearer ${userToken}` } }
          );

          setWasRegistered(false);
          toast.success("Successfully re-registered for event!");
          return;
        }
        const checkResponse = await axios.get(
          `${apiUrl}/registrations/check/${eventId}`,
          { headers: { Authorization: `Bearer ${userToken}` } }
        );

        if (checkResponse.data.isRegistered && checkResponse.data.status !== "cancelled") {
          toast.info("You're already registered for this event");
          return;
        }

        if (checkResponse.data.isRegistered && checkResponse.data.status === "cancelled") {
          await axios.patch(
            `${apiUrl}/registrations/events/${eventId}/reactivate`,
            {
              status: "confirmed",
              event: eventId,
              user: user._id
            },
            { headers: { Authorization: `Bearer ${userToken}` } }
          );
          toast.success("Successfully re-registered for event!");
          return;
        }

        // Otherwise create a new registration
        const response = await axios.post(
          `${apiUrl}/registrations/events/${eventId}`,
          { status: "confirmed" },  // Include status in the payload
          { headers: { Authorization: `Bearer ${userToken}` } }
        );
        toast.success(response.data.message || "Successfully registered for event!");
      } catch (err) {
        // Handle specific error responses
        setIsRegistered(false); // Revert optimistic update

        if (err.response?.status === 409) {
          // Conflict - already registered
          toast.info("You're already registered for this event");
          setIsRegistered(true);
        } else if (err.response?.status === 400) {
          // Bad request - e.g., event capacity reached or validation errors
          toast.warning(err.response.data.message || "Unable to register for this event");
          console.error("Registration error details:", err.response.data);
        } else if (err.response?.status === 404) {
          // If reactivate endpoint not found, try regular registration as fallback
          try {
            const response = await axios.post(
              `${apiUrl}/registrations/events/${eventId}`,
              { status: "confirmed" },  // Include status in the payload
              { headers: { Authorization: `Bearer ${userToken}` } }
            );
            setIsRegistered(true);
            setWasRegistered(false);
            toast.success(response.data.message || "Successfully registered for event!");
          } catch (fallbackErr) {
            toast.error(fallbackErr.response?.data?.message || "Error processing registration");
          }
        } else {
          // Other errors
          console.error("Registration error:", err);
          toast.error(err.response?.data?.message || "Error processing registration");
        }
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(err.response?.data?.message || "Error processing registration");
    }
  };

  // Show error state
  if (error || !event) {
    return (
      <Skeleton type="event-detail" />
    );
  }

  // Format data for display, ensuring we have default values for missing properties
  const formattedEvent = {
    id: event._id,
    title: event.title || "Unnamed Event",
    tagline: event.tagline || "Join us for this exciting event",
    date: event.date || new Date(event.startDate || Date.now()).toLocaleDateString(),
    location: (event.location?.address) || "No location specified",
    participants: `${event.attendeesCount || 0}+ Participants${event.capacity ? ` (Max: ${event.capacity})` : ''}`,
    duration: event.duration,
    registrationDeadline: event.registrationDeadline
      ? new Date(event.registrationDeadline).toLocaleDateString()
      : "Until seats last",
    image: event.images?.[0] || "https://placehold.co/1200x600?text=No+Image+Available",
    organizer: event.organizerName,
    organizerId: event.organizer?._id || event.organizer, // Ensure we get the ID properly
    organizerLogo: event.organizerLogo || "https://placehold.co/80x80?text=Organizer",
    featured: event.featured || false,
    description: event.description || "No description provided for this event.",
    timeline: event.timeline || [],
    prizes: event.prizes || [],
    sponsors: event.sponsors || [],
    faqs: event.faqs || [],
    tags: event.tags || [],
    socialShare: {
      likes: socialStats.likes,
      comments: socialStats.comments,
      shares: socialStats.shares,
      saved: socialStats.saved
    }
  };

  // console.log("Organizer ID:", formattedEvent.organizerId._id);

  return (
    <div className="min-h-screen text-white">
      {/* Hero Section */}
      <div className="relative">
        <div className="h-64 sm:h-80 md:h-96 lg:h-[400px] overflow-hidden">
          <img
            src={formattedEvent.image}
            alt={formattedEvent.title}
            className="w-full h-full object-cover  transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black" />
        </div>

        {/* Event Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 transform translate-y-1/2">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  {formattedEvent.featured && (
                    <span className="inline-block bg-cyan-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full mb-3">
                      FEATURED EVENT
                    </span>
                  )}
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">{formattedEvent.title}</h1>
                  <p className="text-cyan-400 mt-2">{formattedEvent.tagline}</p>

                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex items-center text-gray-300">
                      <Calendar size={16} className="text-cyan-400 mr-2" />
                      <span>{formattedEvent.date}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <MapPin size={16} className="text-cyan-400 mr-2" />
                      <span>{formattedEvent.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <div className="flex items-center space-x-2">
                    <FaArrowLeft size={14} className="text-cyan-500" />
                    <span className="relative">
                      <Link
                        to={`/event`}
                        className="text-cyan-400 hover:text-cyan-300 transition-all duration-300 group"
                      >
                        Back
                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#00D8FF] group-hover:w-full transition-all duration-300" />
                      </Link>
                    </span>
                  </div>

                  {showCancelWarning ? (
                    <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
                      <div className="flex items-start">
                        <AlertCircle className="text-red-400 mr-2 shrink-0 mt-1" size={18} />
                        <p className="text-sm text-red-100">
                          Warning: Are you sure you want to cancel your registration for this event?
                        </p>
                      </div>

                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() => setShowCancelWarning(false)}
                          className="flex-1 py-2 px-4 bg-gray-700 text-gray-300 rounded-md text-sm transition-colors hover:bg-gray-600"
                        >
                          Keep Registration
                        </button>
                        <button
                          onClick={handleRegister}
                          className="flex-1 py-2 px-4 bg-red-500 text-white rounded-md text-sm transition-colors hover:bg-red-600"
                        >
                          Yes, Cancel
                        </button>
                      </div>
                    </div>
                  ) : showReregisterConfirm ? (
                    <div className="mb-4 p-3 bg-cyan-900/30 border border-cyan-500/50 rounded-lg">
                      <div className="flex items-start">
                        <AlertCircle className="text-cyan-400 mr-2 shrink-0 mt-1" size={18} />
                        <p className="text-sm text-cyan-100">
                          You previously cancelled your registration. Would you like to register for this event again?
                        </p>
                      </div>

                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() => setShowReregisterConfirm(false)}
                          className="flex-1 py-2 px-4 bg-gray-700 text-gray-300 rounded-md text-sm transition-colors hover:bg-gray-600"
                        >
                          No, Cancel
                        </button>
                        <button
                          onClick={handleRegister}
                          className="flex-1 py-2 px-4 bg-cyan-500 text-white rounded-md text-sm transition-colors hover:bg-cyan-600"
                        >
                          Yes, Register Again
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleRegister}
                      className={`
                        w-full px-6 py-3 rounded-lg font-semibold text-center transition-all duration-300 cursor-pointer 
                        ${isRegistered
                          ? "bg-red-500/80 hover:bg-red-600 text-white border border-red-400/50"
                          : wasRegistered
                            ? "bg-cyan-500/80 hover:bg-cyan-600 text-white border border-cyan-400/50"
                            : "bg-cyan-400 hover:bg-black hover:text-cyan-500 text-gray-900 hover:border"}
                    `}
                    >
                      {isRegistered
                        ? "Cancel Registration"
                        : wasRegistered
                          ? "Register Again"
                          : "Register Now"}
                    </button>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-4 lg:px-8 py-8 sm:pt-28 mt-44 md:mt-2">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Tabs */}
            <div className="flex border-b border-gray-700 mb-6 overflow-x-auto scrollbar-hide ">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-3 font-medium transition-colors duration-300 cursor-pointer whitespace-nowrap ${activeTab === "overview"
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-gray-400 hover:text-gray-200"
                  }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("timeline")}
                className={`px-4 py-3 font-medium transition-colors duration-300 cursor-pointer whitespace-nowrap ${activeTab === "timeline"
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-gray-400 hover:text-gray-200"
                  }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setActiveTab("prizes")}
                className={`px-4 py-3 font-medium transition-colors duration-300 cursor-pointer whitespace-nowrap ${activeTab === "prizes"
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-gray-400 hover:text-gray-200"
                  }`}
              >
                Prizes
              </button>
              <button
                onClick={() => setActiveTab("sponsors")}
                className={`px-4 py-3 font-medium transition-colors duration-300 cursor-pointer whitespace-nowrap ${activeTab === "sponsors"
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-gray-400 hover:text-gray-200"
                  }`}
              >
                Sponsors
              </button>
              <button
                onClick={() => setActiveTab("faqs")}
                className={`px-4 py-3 font-medium transition-colors duration-300 cursor-pointer whitespace-nowrap ${activeTab === "faqs"
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-gray-400 hover:text-gray-200"
                  }`}
              >
                FAQs
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-6 ">
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h2 className="text-xl font-semibold mb-4">About This Event</h2>
                  <p className="text-gray-300 leading-relaxed">
                    {showFullDescription
                      ? formattedEvent.description
                      : `${formattedEvent.description.substring(0, 300)}${formattedEvent.description.length > 300 ? '...' : ''}`}
                  </p>
                  {formattedEvent.description.length > 300 && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="text-cyan-400 hover:text-cyan-300 mt-2 flex items-center text-sm font-medium"
                    >
                      {showFullDescription ? "Read Less" : "Read More"}
                      <ChevronDown
                        size={16}
                        className={`ml-1 transform transition-transform duration-300 ${showFullDescription ? "rotate-180" : ""}`}
                      />
                    </button>
                  )}
                </div>

                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h2 className="text-xl font-semibold mb-4">Event Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <Calendar size={20} className="text-cyan-400 mr-3 mt-1" />
                      <div>
                        <h3 className="font-medium text-white">Date & Time</h3>
                        <p className="text-gray-300 text-sm">{formattedEvent.date}</p>
                        <p className="text-gray-400 text-sm">{formattedEvent.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin size={20} className="text-cyan-400 mr-3 mt-1" />
                      <div>
                        <h3 className="font-medium text-white">Location</h3>
                        <p className="text-gray-300 text-sm">{formattedEvent.location}</p>
                        <button className="text-cyan-400 text-sm cursor-pointer hover:underline">View on map</button>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Users size={20} className="text-cyan-400 mr-3 mt-1" />
                      <div>
                        <h3 className="font-medium text-white">Participants</h3>
                        <p className="text-gray-300 text-sm">{formattedEvent.participants}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock size={20} className="text-cyan-400 mr-3 mt-1" />
                      <div>
                        <h3 className="font-medium text-white">Registration Deadline</h3>
                        <p className="text-gray-300 text-sm">{formattedEvent.registrationDeadline}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h2 className="text-xl font-semibold mb-4">What to Expect</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                      <div className="flex items-center mb-3">
                        <Code size={18} className="text-cyan-400 mr-2" />
                        <h3 className="font-medium">Skill Development</h3>
                      </div>
                      <p className="text-gray-300 text-sm">Enhance your coding skills, learn new technologies, and get hands-on experience with real-world projects.</p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                      <div className="flex items-center mb-3">
                        <Users size={18} className="text-cyan-400 mr-2" />
                        <h3 className="font-medium">Networking</h3>
                      </div>
                      <p className="text-gray-300 text-sm">Connect with like-minded individuals, industry experts, and potential employers or collaborators.</p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                      <div className="flex items-center mb-3">
                        <Trophy size={18} className="text-cyan-400 mr-2" />
                        <h3 className="font-medium">Compete & Win</h3>
                      </div>
                      <p className="text-gray-300 text-sm">Showcase your talent, compete for exciting prizes, and gain recognition for your innovative solutions.</p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                      <div className="flex items-center mb-3">
                        <Briefcase size={18} className="text-cyan-400 mr-2" />
                        <h3 className="font-medium">Career Growth</h3>
                      </div>
                      <p className="text-gray-300 text-sm">Expand your portfolio, find job opportunities, and make connections that can boost your career.</p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {formattedEvent.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {formattedEvent.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "timeline" && (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-6">Event Timeline</h2>
                {formattedEvent.timeline.length > 0 ? (
                  <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-700"></div>

                    {/* Timeline Items */}
                    <div className="space-y-8">
                      {formattedEvent.timeline.map((item, index) => (
                        <div key={index} className="relative pl-10">
                          {/* Timeline Dot */}
                          <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-gray-700 border-4 border-gray-800 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                          </div>

                          <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                            <h3 className="font-semibold text-cyan-400">{item.time}</h3>
                            <p className="text-white mt-1">{item.event}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-6">No timeline details available for this event.</p>
                )}
              </div>
            )}

            {activeTab === "prizes" && (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-6">Prizes & Awards</h2>
                {formattedEvent.prizes.length > 0 ? (
                  <div className="space-y-4">
                    {formattedEvent.prizes.map((prize, index) => (
                      <div
                        key={index}
                        className={`rounded-lg p-5 border ${index === 0
                          ? "bg-gradient-to-r from-yellow-400/20 to-transparent border-yellow-400/30"
                          : index === 1
                            ? "bg-gradient-to-r from-gray-400/20 to-transparent border-gray-400/30"
                            : index === 2
                              ? "bg-gradient-to-r from-amber-600/20 to-transparent border-amber-600/30"
                              : "bg-gray-700/50 border-gray-600"
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-lg">
                            {prize.place}
                            {index < 3 && (
                              <span className="ml-2">
                                {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                              </span>
                            )}
                          </h3>
                          <span className={`text-xl font-bold ${index === 0
                            ? "text-yellow-400"
                            : index === 1
                              ? "text-gray-300"
                              : index === 2
                                ? "text-amber-600"
                                : "text-cyan-400"
                            }`}>
                            {prize.amount}
                          </span>
                        </div>
                        <p className="text-gray-300 mt-2">{prize.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-6">No prize information available for this event.</p>
                )}
              </div>
            )}

            {activeTab === "sponsors" && (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">

                {formattedEvent.sponsors.length > 0 ? (
                  <>
                    {/* Platinum Sponsors */}
                    {formattedEvent.sponsors.filter(sponsor => sponsor.tier === "platinum").length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-lg font-medium mb-4 text-gray-200">Platinum Sponsors</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {formattedEvent.sponsors
                            .filter(sponsor => sponsor.tier === "platinum")
                            .map((sponsor, index) => (
                              <div key={index} className="bg-gray-700/50  rounded-lg border border-gray-600 flex flex-col items-center justify-center">
                                <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
                                  <img src={sponsor.logo} alt={sponsor.name} className="max-h-20 mb-3" />
                                  <h4 className="text-center font-medium text-gray-200">{sponsor.name}</h4>
                                </a>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    )}

                    {/* Gold Sponsors */}
                    {formattedEvent.sponsors.filter(sponsor => sponsor.tier === "gold").length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-lg font-medium mb-4 text-gray-200">Gold Sponsors</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {formattedEvent.sponsors
                            .filter(sponsor => sponsor.tier === "gold")
                            .map((sponsor, index) => (
                              <div key={index} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 flex flex-col items-center justify-center">
                                <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
                                  <img src={sponsor.logo} alt={sponsor.name} className="max-h-16 mb-3" />
                                  <h4 className="text-center font-medium text-gray-200">{sponsor.name}</h4>
                                </a>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    )}

                    {/* Silver & Bronze Sponsors */}
                    {formattedEvent.sponsors.filter(sponsor =>
                      sponsor.tier === "silver" || sponsor.tier === "bronze"
                    ).length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium mb-4 text-gray-200">Silver & Bronze Sponsors</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {formattedEvent.sponsors
                              .filter(sponsor => sponsor.tier === "silver" || sponsor.tier === "bronze")
                              .map((sponsor, index) => (
                                <div key={index} className="bg-gray-700/50 p-3 rounded-lg border border-gray-600 flex flex-col items-center justify-center">
                                  <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
                                    <img src={sponsor.logo} alt={sponsor.name} className="max-h-12 mb-2" />
                                    <h4 className="text-center text-sm font-medium text-gray-200">{sponsor.name}</h4>
                                  </a>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      )}
                  </>
                ) : (
                  <p className="text-gray-400 text-center py-6">No sponsor information available for this event.</p>
                )}
              </div>
            )}

            {activeTab === "faqs" && (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-6">Frequently Asked Questions</h2>
                {formattedEvent.faqs.length > 0 ? (
                  <div className="space-y-4">
                    {formattedEvent.faqs.map((faq, index) => (
                      <details
                        key={index}
                        className="group bg-gray-700/50 rounded-lg border border-gray-600 overflow-hidden"
                      >
                        <summary className="flex justify-between items-center p-4 cursor-pointer list-none">
                          <h3 className="font-medium text-white">{faq.question}</h3>
                          <ChevronDown
                            size={20}
                            className="text-cyan-400 group-open:rotate-180 transition-transform duration-300"
                          />
                        </summary>
                        <div className="p-4 pt-0 text-gray-300">
                          <p>{faq.answer}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-6">No FAQ information available for this event.</p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            {/* Registration Call to Action */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Join the Event</h2>
              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Registration Deadline:</span>
                  <span className="text-cyan-400 font-medium">{formattedEvent.registrationDeadline}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Registration Fee:</span>
                  <span className={`${event.isPaid ? "text-yellow-400" : "text-green-400"} font-medium`}>
                    {event.isPaid ? `${event.price} ${event.currency || 'USD'}` : "Free"}
                  </span>
                </div>
              </div>

              {showCancelWarning ? (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="text-red-400 mr-2 shrink-0 mt-1" size={18} />
                    <p className="text-sm text-red-100">
                      Warning: Are you sure you want to cancel your registration for this event?
                    </p>
                  </div>

                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => setShowCancelWarning(false)}
                      className="flex-1 py-2 px-4 bg-gray-700 text-gray-300 rounded-md text-sm transition-colors hover:bg-gray-600"
                    >
                      Keep Registration
                    </button>
                    <button
                      onClick={handleRegister}
                      className="flex-1 py-2 px-4 bg-red-500 text-white rounded-md text-sm transition-colors hover:bg-red-600"
                    >
                      Yes, Cancel
                    </button>
                  </div>
                </div>
              ) : showReregisterConfirm ? (
                <div className="mb-4 p-3 bg-cyan-900/30 border border-cyan-500/50 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="text-cyan-400 mr-2 shrink-0 mt-1" size={18} />
                    <p className="text-sm text-cyan-100">
                      You previously cancelled your registration. Would you like to register for this event again?
                    </p>
                  </div>

                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => setShowReregisterConfirm(false)}
                      className="flex-1 py-2 px-4 bg-gray-700 text-gray-300 rounded-md text-sm transition-colors hover:bg-gray-600"
                    >
                      No, Cancel
                    </button>
                    <button
                      onClick={handleRegister}
                      className="flex-1 py-2 px-4 bg-cyan-500 text-white rounded-md text-sm transition-colors hover:bg-cyan-600"
                    >
                      Yes, Register Again
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleRegister}
                  className={`
                    w-full px-6 py-3 rounded-lg font-semibold text-center transition-all duration-300 cursor-pointer 
                    ${isRegistered
                      ? "bg-red-500/80 hover:bg-red-600 text-white border border-red-400/50"
                      : wasRegistered
                        ? "bg-cyan-500/80 hover:bg-cyan-600 text-white border border-cyan-400/50"
                        : "bg-cyan-400 hover:bg-black hover:text-cyan-500 text-gray-900 hover:border"}
                  `}
                >
                  {isRegistered
                    ? "Cancel Registration"
                    : wasRegistered
                      ? "Register Again"
                      : "Register Now"}
                </button>
              )}

              {isRegistered && !showCancelWarning && (
                <p className="text-green-400 text-sm text-center mt-3">
                  You've successfully registered for this event!
                </p>
              )}

              {wasRegistered && !isRegistered && !showReregisterConfirm && (
                <p className="text-gray-300 text-sm text-center mt-3">
                  You previously cancelled your registration
                </p>
              )}
            </div>

            {/* Organizer Info */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Organizer</h2>
              <div className="flex items-center">
                <img
                  src={formattedEvent.organizerLogo}
                  alt={formattedEvent.organizer}
                  className="w-12 h-12 rounded-lg mr-4"
                />
                <div>
                  <h3 className="font-medium text-white">{formattedEvent.organizer}</h3>
                  <Link
                    to={`/organizer/profile/${formattedEvent.organizerId}`}
                    className="text-cyan-400 text-sm hover:underline"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>

            {/* Social Engagement - Enhanced with dynamic functionality */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 relative">
              <h2 className="text-xl font-semibold mb-4">Share & Engage</h2>
              <div className="flex items-center justify-between mb-4">
                <button
                  className={`flex-1 flex items-center justify-center gap-2 py-2 transition-colors ${hasLiked ? 'text-cyan-400' : 'text-gray-300 hover:text-cyan-400'}`}
                  onClick={handleLikeEvent}
                >
                  <Heart size={18} className={hasLiked ? "fill-cyan-400" : ""} />
                  <span>{formattedEvent.socialShare.likes}</span>
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-300 hover:text-cyan-400 transition-colors"
                  onClick={() => {
                    const commentsSection = document.getElementById('comments-section');
                    if (commentsSection) commentsSection.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <MessageCircle size={18} />
                  <span>{formattedEvent.socialShare.comments}</span>
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-300 hover:text-cyan-400 transition-colors relative"
                  onClick={handleShareEvent}
                >
                  <Share2 size={18} />
                  <span>{formattedEvent.socialShare.shares}</span>
                </button>
                <button
                  className={`flex-1 flex items-center justify-center gap-2 py-2 transition-colors ${isSaved ? 'text-cyan-400' : 'text-gray-300 hover:text-cyan-400'}`}
                  onClick={handleSaveEvent}
                >
                  <Bookmark size={18} className={isSaved ? "fill-cyan-400" : ""} />
                  <span>{isSaved ? "Saved" : "Save"}</span>
                </button>
              </div>

              {/* Share options popup */}
              <AnimatePresence>
                {showShareOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl z-10 w-64"
                  >
                    <div className="text-sm font-medium text-gray-300 mb-2">Share this event via:</div>
                    <div className="flex justify-around">
                      <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Check out ${event.title}!`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1DA1F2] hover:opacity-80 transition-opacity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                        </svg>
                      </a>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1877F2] hover:opacity-80 transition-opacity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                        </svg>
                      </a>
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0A66C2] hover:opacity-80 transition-opacity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                          <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                        </svg>
                      </a>
                      <a
                        href={`mailto:?subject=${encodeURIComponent(`Join me at ${event.title}`)}&body=${encodeURIComponent(`I thought you might be interested in this event: ${event.title}.\n\nCheck it out here: ${window.location.href}`)}`}
                        className="text-gray-300 hover:text-cyan-400 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                      </a>
                    </div>
                    <div className="mt-2 text-xs text-center text-gray-400">Click to share via your preferred platform</div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Saved confirmation toast */}
              <AnimatePresence>
                {showSavedToast && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-cyan-500/80 backdrop-blur-sm text-white px-4 py-2 rounded-md shadow-lg"
                  >
                    {isSaved ? "Event saved to your collection" : "Event removed from your collection"}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between gap-2">
                <button
                  onClick={handleShareEvent}
                  className="flex-1 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 size={16} />
                  Share Event
                </button>
                <button
                  onClick={handleSaveEvent}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${isSaved
                    ? "bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20"
                    : "bg-gray-700/50 text-gray-300 hover:bg-gray-700/70"
                    }`}
                >
                  <Bookmark size={16} className={isSaved ? "fill-cyan-500" : ""} />
                  {isSaved ? "Saved" : "Save Event"}
                </button>
              </div>
            </div>

            {/* Similar Events - Enhanced with better display and interactivity */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Similar Events</h2>
                <Link to="/event" className="text-cyan-400 text-sm hover:underline">View All</Link>
              </div>

              {similarEvents.length > 0 ? (
                <div className="space-y-4">
                  {similarEvents.map((event) => (
                    <motion.div
                      key={event._id}
                      className="flex gap-3 p-2 rounded-lg hover:bg-gray-700/30 transition-colors cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/event/${event._id}`)}
                    >
                      <img
                        src={event.images?.[0] || "/api/placeholder/80/60"}
                        alt={event.title}
                        className="w-20 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium text-white text-sm hover:text-cyan-400 cursor-pointer transition-colors truncate">
                            {event.title}
                          </h3>
                          <span className="bg-cyan-500/20 text-cyan-400 text-xs px-2 py-0.5 rounded-full whitespace-nowrap ml-1">
                            {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-400 text-xs mt-1">
                          <MapPin size={12} className="flex-shrink-0 mr-1" />
                          <span className="truncate">{event.location?.address || event.venue || "No location specified"}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-gray-400 text-xs flex items-center">
                            <Users size={12} className="flex-shrink-0 mr-1" />
                            <span>{event.attendeesCount || 0}+ Participants</span>
                          </p>
                          <ExternalLink size={12} className="text-cyan-400" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-20 h-16 bg-gray-700 rounded"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-gray-400 mb-3">No similar events found.</p>
                  <Link to="/event" className="px-4 py-2 bg-cyan-500 text-black rounded-md text-sm font-medium hover:bg-cyan-400 transition-colors">
                    Browse All Events
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comments section anchor */}
      <div id="comments-section"></div>
    </div>
  );
}

