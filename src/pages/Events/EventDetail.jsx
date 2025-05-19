/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, Clock, Code, Trophy, Briefcase, ChevronDown, Share2, Heart, MessageCircle, AlertCircle, ArrowLeft } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Error from "../common/Error";
import { useLoader } from '../../context/LoaderContext';
import { FaArrowLeft } from "react-icons/fa";

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

  // Get current user from Redux
  const user = useSelector(state => state.auth?.user);
  const organizer = useSelector(state => state.organizer?.user);
  const userToken = useSelector(state => state.auth?.token);

  const { setIsLoading } = useLoader();

  useEffect(() => {
    setIsLoading(loading);
    return () => setIsLoading(false);
  }, [loading, setIsLoading]);

  // Fixed function to fetch event details
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

      // Also fetch similar events (just getting a few published events for now)
      try {
        const similarResponse = await axios.get(`${apiUrl}/events/published?limit=3`);

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

      // Check if user is registered for this event
      if (user && userToken) {
        try {
          const registrationResponse = await axios.get(
            `${apiUrl}/registrations/check/${eventId}`,
            {
              headers: { Authorization: `Bearer ${userToken}` }
            }
          );

          console.log("Registration check response:", registrationResponse.data);

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
      <Error />
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
    organizerId: event.organizer,
    organizerLogo: event.organizerLogo || "https://placehold.co/80x80?text=Organizer",
    featured: event.featured || false,
    description: event.description || "No description provided for this event.",
    timeline: event.timeline || [],
    prizes: event.prizes || [],
    sponsors: event.sponsors || [],
    faqs: event.faqs || [],
    tags: event.tags || [],
    socialShare: event.socialShare || {
      likes: 0,
      comments: 0,
      shares: 0
    }
  };

  console.log("sponsors", formattedEvent.sponsors);

  console.log("Formatted Event Data:", formattedEvent);

  return (
    <div className=" min-h-screen text-white">
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
      <div className="max-w-6xl mx-auto px-4 sm:px-4 lg:px-8 py-8 sm:pt-28 mt-8 md:mt-16">
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
              <div className="space-y-6">
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

            {/* Social Engagement */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Share & Engage</h2>
              <div className="flex items-center justify-between mb-4">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-300 hover:text-cyan-400 transition-colors">
                  <Heart size={18} />
                  <span>{formattedEvent.socialShare.likes}</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-300 hover:text-cyan-400 transition-colors">
                  <MessageCircle size={18} />
                  <span>{formattedEvent.socialShare.comments}</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-300 hover:text-cyan-400 transition-colors">
                  <Share2 size={18} />
                  <span>{formattedEvent.socialShare.shares}</span>
                </button>
              </div>

              <div className="flex justify-between gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Event link copied to clipboard!");
                  }}
                  className="flex-1 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Share Link
                </button>
              </div>
            </div>

            {/* Similar Events */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Similar Events</h2>
                <Link to="/event" className="text-cyan-400 text-sm hover:underline">View All</Link>
              </div>

              <div className="space-y-4">
                {similarEvents.length > 0 ? similarEvents.map((event) => (
                  <div key={event._id} className="flex gap-3">
                    <img
                      src={event.images?.[0] || "/api/placeholder/80/60"}
                      alt={event.title}
                      className="w-20 h-16 object-cover rounded"
                    />
                    <div>
                      <Link to={`/event/${event._id}`} className="font-medium text-white text-sm hover:text-cyan-400 cursor-pointer transition-colors">
                        {event.title}
                      </Link>
                      <p className="text-gray-400 text-xs mt-1">
                        {event.date || new Date(event.startDate).toLocaleDateString()}
                      </p>
                      <p className="text-gray-400 text-xs">{event.location?.address || event.venue || "No location specified"}</p>
                      <p className="text-gray-400 text-xs">{event.attendeesCount || 0}+ Participants</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-400 text-center py-4">No similar events found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

