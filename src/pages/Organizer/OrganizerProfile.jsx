/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import {
  Calendar, Mail, MapPin, Phone, Award, Users, Star, ArrowRight,
  Clock, ExternalLink, Globe, Zap, Twitter, Linkedin, Instagram,
  Facebook, AlertTriangle, User, Building
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { safelyParseToken } from '../../utils/persistFix';
import { toast } from 'react-toastify';
import { useLoader } from '../../context/LoaderContext';
import Error from '../common/Error';
import { FaPhone } from 'react-icons/fa6';
import Skeleton from '../../components/UI/Skeleton';
import { fetchPublicOrganizerProfile } from '../../redux/user/organizer';

const OrganizerProfile = () => {
  const { organizerId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState('about');
  const [isLoaded, setIsLoaded] = useState(false);
  const [expandedEvent, setExpandedEvent] = useState(null);

  // State for the profile data
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);

  // Get organizer from Redux store
  const organizerData = useSelector(state => state.organizer);
  const loggedInUser = organizerData?.user;
  const publicProfile = useSelector(state => state.organizer.publicProfile);
  const publicProfileLoading = useSelector(state => state.organizer.publicProfileLoading);
  const publicProfileError = useSelector(state => state.organizer.publicProfileError);

  // Extract user ID from possibly nested JSON structure
  const getUserId = () => {
    if (!loggedInUser) return null;

    if (typeof loggedInUser === 'string') {
      try {
        const parsed = JSON.parse(loggedInUser);
        return parsed?._id || parsed?.id || parsed?._doc?._id;
      } catch (e) {
        return null;
      }
    }

    return loggedInUser._id || loggedInUser.id || loggedInUser?._doc?._id;
  };

  const loggedInUserId = getUserId();
  // Check if path is /profile/:organizerId which is public route
  const isPublicRoute = window.location.pathname.startsWith('/profile/');
  const isOwnProfile = organizerId === loggedInUserId && !isPublicRoute;
  const isAuthenticated = !!loggedInUserId && !isPublicRoute;

  const { setIsLoading } = useLoader();

  useEffect(() => {
    setIsLoading(loading);
    return () => setIsLoading(false);
  }, [loading, setIsLoading]);

  // Add this function to filter events by date
  const filterEventsByDate = (events) => {
    const currentDate = new Date();

    // Filter past events (dates that have passed)
    const pastEvents = events.filter(event => {
      const eventDate = new Date(event.date || event.startDate);
      return eventDate < currentDate;
    });

    // Filter upcoming events (dates in the future)
    const upcomingEvents = events.filter(event => {
      const eventDate = new Date(event.date || event.startDate);
      return eventDate >= currentDate;
    });

    return {
      pastEvents,
      upcomingEvents
    };
  };

  // Helper function to parse and sanitize organizer ID
  const parseOrganizerId = (id) => {
    // If it's already a valid MongoDB id (24 hex chars)
    if (typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id)) {
      return id;
    }

    // Try to extract ID if it's an object or JSON string
    if (typeof id === 'object' && id !== null) {
      if (id._id) return id._id;
      if (id.id) return id.id;
      if (id._doc?._id) return id._doc._id;
    }

    // If it's a string that could be JSON
    if (typeof id === 'string') {
      try {
        const parsed = JSON.parse(id);
        if (parsed._id) return parsed._id;
        if (parsed.id) return parsed.id;
        if (parsed._doc?._id) return parsed._doc._id;
      } catch (e) {
        // Not a valid JSON string, return as is
        return id;
      }
    }

    return id; // Return as is if we couldn't extract a better ID
  };

  useEffect(() => {
    const fetchOrganizerProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        // Parse and sanitize the ID
        const cleanOrganizerId = parseOrganizerId(organizerId);
        const idToFetch = cleanOrganizerId || loggedInUserId;

        if (!idToFetch) {
          setError("No organizer ID found");
          setLoading(false);
          return;
        }

        console.log("Fetching organizer profile with ID:", idToFetch);
        console.log("Is public route:", isPublicRoute);
        console.log("Is authenticated:", isAuthenticated);

        // If this is a public view (public route or not logged in)
        if (isPublicRoute || !isAuthenticated) {
          // Use the Redux action to fetch public profile
          const resultAction = await dispatch(fetchPublicOrganizerProfile(idToFetch));

          if (fetchPublicOrganizerProfile.fulfilled.match(resultAction)) {
            setProfile(resultAction.payload.publicProfile);
          } else {
            throw new Error(resultAction.payload || 'Failed to load profile');
          }
        } else {
          // Authenticated and viewing own profile - original code path
          // Get API URL from environment or use fallback
          const apiUrl = import.meta.env.VITE_API_URL;

          const token = organizerData?.token || localStorage.getItem('organizer_token');
          const cleanToken = safelyParseToken(token);

          const config = cleanToken ? {
            headers: { Authorization: `Bearer ${cleanToken}` }
          } : {};

          // First try to get detailed profile if available
          try {
            const detailsResponse = await axios.get(`${apiUrl}/organizer/${idToFetch}/details`, config);

            if (detailsResponse.data) {
              // If basic user info is not included in details, fetch it separately
              if (!detailsResponse.data.name || !detailsResponse.data.email) {
                const basicResponse = await axios.get(`${apiUrl}/organizer/profile/${idToFetch}`, config);
                setProfile({
                  ...basicResponse.data,
                  ...detailsResponse.data
                });
              } else {
                setProfile(detailsResponse.data);
              }
            }
          } catch (detailsErr) {
            console.error("Error fetching organizer details:", detailsErr);
            // If detailed profile not found, fall back to basic profile
            const basicResponse = await axios.get(`${apiUrl}/organizer/profile/${idToFetch}`, config);
            setProfile(basicResponse.data);
          }
        }

        // Fetch events for this organizer - works for both public and private
        try {
          const apiUrl = import.meta.env.VITE_API_URL;
          const eventsResponse = await axios.get(`${apiUrl}/events?organizer=${idToFetch}`);

          if (eventsResponse.data && Array.isArray(eventsResponse.data)) {
            const { pastEvents, upcomingEvents } = filterEventsByDate(eventsResponse.data);
            setUpcomingEvents(upcomingEvents);
            setPastEvents(pastEvents);
          } else if (eventsResponse.data?.events && Array.isArray(eventsResponse.data.events)) {
            const { pastEvents, upcomingEvents } = filterEventsByDate(eventsResponse.data.events);
            setUpcomingEvents(upcomingEvents);
            setPastEvents(pastEvents);
          } else {
            setUpcomingEvents([]);
            setPastEvents([]);
          }
        } catch (eventsErr) {
          console.error("Error fetching events:", eventsErr);
          setUpcomingEvents([]);
          setPastEvents([]);
        } finally {
          setEventsLoading(false);
        }

        setIsLoaded(true);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching organizer profile:", err);
        setError("Failed to load organizer profile. " + err.message);
        setLoading(false);
      }
    };

    fetchOrganizerProfile();
  }, [organizerId, loggedInUserId, dispatch, isAuthenticated, isPublicRoute]);

  const handleEventClick = (eventId) => {
    if (expandedEvent === eventId) {
      setExpandedEvent(null);
    } else {
      setExpandedEvent(eventId);
    }
  };

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '';
    // Simple formatting, modify as needed
    return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  };

  // Add this to fetch attended events for the profile
  const fetchAttendedEvents = async (userId) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${apiUrl}/profiles/user/${userId}/attended-events`);

      if (response.data && response.data.data) {
        setPastEvents(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching attended events:", error);
    }
  };

  useEffect(() => {
    // Add this inside an existing useEffect or create a new one
    if (organizerId) {
      fetchAttendedEvents(organizerId);
    }
  }, [organizerId]);

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-3xl mx-auto bg-gray-900/50 border border-red-500/30 rounded-xl p-8">
          <div className="flex items-start">
            <AlertTriangle className="text-red-500 mr-4 mt-1" size={24} />
            <div>
              <h2 className="text-xl font-bold text-red-400 mb-2">Error Loading Profile</h2>
              <p className="text-gray-300">{error}</p>
              <button
                onClick={() => navigate(-1)}
                className="mt-6 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <Skeleton type='profile' count={12} columns={{ default: 1, md: 1, lg: 1 }} />
    );
  }

  if (!profile) {
    return (
      <Error />
    );
  }

  // Get basic information, with fallbacks
  const name = profile.name || profile?.user?.name || 'Unnamed Organizer';
  const company = profile.company || profile.organization || '';
  const email = profile.email || profile?.user?.email || '';
  const location = profile.location || '';
  const phone = profile.phone || '';
  const bio = profile.bio || 'No bio provided';

  // Extract profile data with fallbacks
  const expertise = profile.expertise || [];
  const certifications = profile.certifications || [];
  const socials = profile.socials || [];
  const testimonials = profile.testimonials || [];

  // Add default stats if not available
  const stats = profile.stats || {
    eventsHosted: upcomingEvents.length + pastEvents.length || 0,
    totalAttendees: "0",
    clientSatisfaction: "N/A",
    awards: 0
  };

  // Function to get icon for social media
  const getSocialIcon = (url) => {
    if (!url) return <Globe size={16} />;

    if (url.includes('twitter') || url.includes('x.com')) return <Twitter size={16} />;
    if (url.includes('linkedin')) return <Linkedin size={16} />;
    if (url.includes('instagram')) return <Instagram size={16} />;
    if (url.includes('facebook')) return <Facebook size={16} />;

    return <Globe size={16} />;
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-cyan-500 opacity-5 rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-cyan-500 opacity-5 rounded-full filter blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Navigation Sidebar */}
        <div className={`fixed top-0 left-0 h-screen w-12 md:w-14  border-r border-gray-800 flex flex-col items-center py-8 transition-all duration-500 transform ${isLoaded ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center mb-12">
            <span className="text-black font-bold text-lg">{name[0]}</span>
          </div>

          <nav className="flex flex-col items-center space-y-8">
            {[
              { id: 'about', icon: <Users className={`w-6 h-6 ${activeSection === 'about' ? 'text-cyan-500' : 'text-gray-500'}`} /> },
              { id: 'events', icon: <Calendar className={`w-6 h-6 ${activeSection === 'events' ? 'text-cyan-500' : 'text-gray-500'}`} /> },
              { id: 'testimonials', icon: <Star className={`w-6 h-6 ${activeSection === 'testimonials' ? 'text-cyan-500' : 'text-gray-500'}`} /> }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`group relative w-10 h-10 rounded-lg flex items-center justify-center ${activeSection === item.id ? 'bg-gray-800' : 'hover:bg-gray-800/50'} transition-all duration-300`}
              >
                {item.icon}
                {activeSection === item.id && (
                  <span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-5 bg-cyan-500 rounded-full"></span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="ml-16 md:ml-20">
          {/* Organizer Header */}
          <div className={`transition-all duration-700 ease-out transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="flex flex-col md:flex-row md:items-end gap-8 mb-12">
              {/* Profile Image with Glowing Effect */}
              <div className="relative">
                <div className="relative w-32 h-32 bg-gradient-to-br from-cyan-500 to-black rounded-2xl overflow-hidden shadow-lg transform rotate-3">
                  <div className="absolute inset-0 flex items-center justify-center text-5xl font-bold">
                    {name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black opacity-40"></div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-black border border-cyan-500 rounded-full flex items-center justify-center transform rotate-12">
                  <Zap className="w-6 h-6 text-cyan-500" />
                </div>
              </div>

              {/* Organizer Info */}
              <div className="flex-grow">
                <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">{name}</h1>
                <div className="flex items-center mt-2 space-x-2">
                  <span className="text-xl text-cyan-500">{profile.title || 'Event Organizer'}</span>
                  {company && (
                    <>
                      <span className="text-gray-500">•</span>
                      <span className="text-xl">{company}</span>
                    </>
                  )}
                </div>

                {expertise.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {expertise.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-black border border-cyan-500 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact Button */}
              {!isOwnProfile && (
                <button
                  onClick={() => {
                    if (email) {
                      window.location.href = `mailto:${email}`;
                    } else {
                      toast.info("Contact information not available");
                    }
                  }}
                  className="md:self-center bg-cyan-500 text-black px-6 py-3 rounded-full font-bold flex items-center transform transition-transform hover:scale-105 hover:shadow-cyan-900 hover:shadow-lg hover:text-cyan-500 hover:bg-black hover:border hover:border-cyan-500 cursor-pointer"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Contact
                </button>
              )}

              {/* Edit Profile Button (for own profile) */}
              {isOwnProfile && (
                <button
                  onClick={() => navigate('/organizer/profile/edit')}
                  className="md:self-center bg-cyan-500 text-black hover:text-cyan-500 hover:bg-black hover:border hover:border-cyan-500 px-6 py-3 rounded-full font-bold flex items-center transform transition-transform hover:scale-105 hover:shadow-cyan-900 hover:shadow-lg cursor-pointer"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {Object.entries(stats).map(([key, value], index) => (
                <div
                  key={key}
                  className={`transition-all duration-500 delay-${index * 100} transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} bg-gray-900 border-l-2 border-cyan-500 p-6 rounded-tr-2xl rounded-br-2xl`}
                >
                  <div className="text-3xl font-bold text-white mb-1">{value}</div>
                  <div className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Sections */}
          <div className="space-y-12">
            {/* About Section */}
            <section
              className={`transition-all duration-700 transform ${activeSection === 'about' ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0 absolute pointer-events-none'}`}
              style={{ display: activeSection === 'about' ? 'block' : 'none' }}
            >
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center mr-3">
                  <Users className="w-4 h-4 text-black" />
                </div>
                <h2 className="text-2xl font-bold">About</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bio */}
                <div className="lg:col-span-2 bg-gray-900 rounded-2xl p-6 border-b-2 border-cyan-500">
                  <h3 className="text-xl mb-4">Biography</h3>
                  <p className="text-gray-300 leading-relaxed">{bio}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div>
                      <h4 className="text-cyan-500 text-sm uppercase mb-3">Contact Information</h4>
                      <ul className="space-y-3">
                        {location && (
                          <li className="flex items-center text-gray-300">
                            <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                            {location}
                          </li>
                        )}
                        {email && (
                          <li className="flex items-center text-gray-300">
                            <Mail className="w-4 h-4 text-gray-500 mr-2" />
                            {email}
                          </li>
                        )}
                        {phone && (
                          <li className="flex items-center text-gray-300">
                            <Phone className="w-4 h-4 text-gray-500 mr-2" />
                            {formatPhoneNumber(phone)}
                          </li>
                        )}
                        {!location && !email && !phone && (
                          <li className="text-gray-400">No contact information provided</li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-cyan-500 text-sm uppercase mb-3">Certifications</h4>
                      <ul className="space-y-3">
                        {certifications.length > 0 ? certifications.map((cert, index) => (
                          <li key={index} className="flex items-center text-gray-300">
                            <Award className="w-4 h-4 text-gray-500 mr-2" />
                            {cert}
                          </li>
                        )) : (
                          <li className="text-gray-400">No certifications listed</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Social Engagement */}
                <div className="bg-gray-900 rounded-2xl p-6 border-t-2 border-cyan-500">
                  <h3 className="text-xl mb-4">Social Engagement</h3>

                  <div className="flex flex-col space-y-4">
                    {socials.length > 0 ? socials.map((social, index) => {
                      if (!social) return null;

                      // Extract domain name for display
                      let displayName = social;
                      try {
                        const url = new URL(social.startsWith('http') ? social : `https://${social}`);
                        displayName = url.hostname.replace('www.', '');
                      } catch (e) {
                        // If parsing fails, use original value
                        displayName = social;
                      }

                      return (
                        <a href={social.startsWith('http') ? social : `https://${social}`} key={index} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mr-3 group-hover:bg-cyan-500 transition-colors">
                              {getSocialIcon(social)}
                            </div>
                            <span className="text-gray-300 group-hover:text-white transition-colors">{displayName}</span>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-cyan-500 transition-colors" />
                        </a>
                      );
                    }) : (
                      <p className="text-gray-400">No social media links provided</p>
                    )}
                  </div>

                  <div className="mt-8 pt-8 border-t border-gray-800">
                    <h4 className="text-cyan-500 text-sm uppercase mb-3">Response Time</h4>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-gray-300">Usually responds within</span>
                      </div>
                      <span className="font-bold">2 hours</span>
                    </div>

                    <div className="w-full h-2 bg-gray-800 rounded-full mt-3 overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Events Section */}
            <section
              className={`transition-all duration-700 transform ${activeSection === 'events' ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0 absolute pointer-events-none'}`}
              style={{ display: activeSection === 'events' ? 'block' : 'none' }}
            >
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center mr-3">
                  <Calendar className="w-4 h-4 text-black" />
                </div>
                <h2 className="text-2xl font-bold">Events</h2>
              </div>

              {eventsLoading ? (
                <div className="flex items-center justify-center p-12">
                  <motion.div
                    className="w-8 h-8 border-2 border-t-transparent border-cyan-500 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="ml-3 text-gray-400">Loading events...</span>
                </div>
              ) : (
                <>
                  {/* Upcoming Events */}
                  <div className="mb-12">
                    <h3 className="text-xl mb-4 flex items-center">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></div>
                      Upcoming Events
                    </h3>

                    {upcomingEvents.length > 0 ? (
                      <div className="space-y-6">
                        {upcomingEvents.map(event => (
                          <div
                            key={event._id}
                            className={`relative bg-gray-900 rounded-2xl overflow-hidden transition-all duration-300 ${expandedEvent === event._id ? 'transform scale-102 shadow-lg shadow-cyan-900/20' : 'hover:transform hover:scale-101'}`}
                          >
                            {/* Decorative element */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500 opacity-10 rounded-full transform translate-x-12 -translate-y-12"></div>

                            <div
                              className="p-6 cursor-pointer"
                              onClick={() => handleEventClick(event._id)}
                            >
                              <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <div className="flex-grow">
                                  <div className="flex items-center mb-2">
                                    <span className="text-xs text-cyan-500 uppercase tracking-wider px-2 py-1 bg-cyan-900/30 rounded-full mr-2">
                                      {event.category || "Event"}
                                    </span>
                                    <span className="text-xs text-teal-300 uppercase tracking-wider px-2 py-1 bg-teal-900/30 rounded-full">
                                      upcoming
                                    </span>
                                  </div>

                                  <h4 className="text-xl font-bold hover:text-cyan-500 transition-colors">{event.title}</h4>

                                  <div className="flex flex-wrap gap-x-6 text-sm text-gray-400 mt-2">
                                    <div className="flex items-center">
                                      <Calendar size={14} className="mr-1" />
                                      {new Date(event.date || event.startDate).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center">
                                      <MapPin size={14} className="mr-1" />
                                      {event.location?.address || event.venue || "No location specified"}
                                    </div>
                                    <div className="flex items-center">
                                      <Users size={14} className="mr-1" />
                                      {event.attendeesCount || 0} attendees
                                    </div>
                                  </div>
                                </div>

                                <div className={`transition-transform duration-300 transform ${expandedEvent === event._id ? 'rotate-90' : ''}`}>
                                  <ArrowRight size={20} className="text-cyan-500" />
                                </div>
                              </div>
                            </div>

                            {/* Expanded view */}
                            <div
                              className={`transition-all duration-300 ease-in-out overflow-hidden ${expandedEvent === event._id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                              <div className="px-6 pb-6 pt-2">
                                <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-6"></div>

                                <p className="text-gray-300 mb-4">{event.description || "No description available"}</p>

                                {event.highlights && event.highlights.length > 0 && (
                                  <>
                                    <h5 className="text-sm uppercase text-cyan-500 mb-3">Event Highlights</h5>
                                    <div className="flex flex-wrap gap-2">
                                      {event.highlights.map((highlight, index) => (
                                        <span key={index} className="px-3 py-1 bg-black/50 rounded-full text-sm text-gray-300">
                                          {highlight}
                                        </span>
                                      ))}
                                    </div>
                                  </>
                                )}

                                <button
                                  onClick={() => navigate(`/event/${event._id}`)}
                                  className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r bg-cyan-400 text-black font-medium transition-colors cursor-pointer flex items-center space-x-2 hover:bg-black hover:text-cyan-400 hover:border hover:border-cyan-400"
                                >
                                  View Event Details
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-900/50 rounded-xl p-6 text-center">
                        <p className="text-gray-400">No upcoming events scheduled.</p>
                      </div>
                    )}
                  </div>

                  {/* Past Events */}
                  <div>
                    <h3 className="text-xl mb-4 flex items-center">
                      <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                      Past Events
                    </h3>

                    {pastEvents.length > 0 ? (
                      <div className="space-y-6">
                        {pastEvents.map(event => (
                          <div
                            key={event._id}
                            className={`relative bg-gray-900 rounded-2xl overflow-hidden transition-all duration-300 ${expandedEvent === event._id ? 'transform scale-102 shadow-lg shadow-cyan-900/20' : 'hover:transform hover:scale-101'}`}
                          >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500 opacity-10 rounded-full transform translate-x-12 -translate-y-12"></div>

                            <div
                              className="p-6 cursor-pointer"
                              onClick={() => handleEventClick(event._id)}
                            >
                              <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <div className="flex-grow">
                                  <div className="flex items-center mb-2">
                                    <span className="text-xs text-cyan-500 uppercase tracking-wider px-2 py-1 bg-cyan-900/30 rounded-full mr-2">
                                      {event.category || "Event"}
                                    </span>
                                    <span className="text-xs text-gray-400 uppercase tracking-wider px-2 py-1 bg-gray-700/30 rounded-full">
                                      completed
                                    </span>
                                  </div>

                                  <h4 className="text-xl font-bold hover:text-cyan-500 transition-colors">{event.title}</h4>

                                  <div className="flex flex-wrap gap-x-6 text-sm text-gray-400 mt-2">
                                    <div className="flex items-center">
                                      <Calendar size={14} className="mr-1" />
                                      {new Date(event.date || event.startDate).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center">
                                      <MapPin size={14} className="mr-1" />
                                      {event.location?.address || event.venue || "No location specified"}
                                    </div>
                                    <div className="flex items-center">
                                      <Users size={14} className="mr-1" />
                                      {event.attendeesCount || 0} attendees
                                    </div>
                                  </div>
                                </div>

                                <div className={`transition-transform duration-300 transform ${expandedEvent === event._id ? 'rotate-90' : ''}`}>
                                  <ArrowRight size={20} className="text-cyan-500" />
                                </div>
                              </div>
                            </div>

                            <div
                              className={`transition-all duration-300 ease-in-out overflow-hidden ${expandedEvent === event._id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                              <div className="px-6 pb-6 pt-2">
                                <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-6"></div>

                                <p className="text-gray-300 mb-4">{event.description || "No description available"}</p>

                                {event.highlights && event.highlights.length > 0 && (
                                  <>
                                    <h5 className="text-sm uppercase text-cyan-500 mb-3">Event Highlights</h5>
                                    <div className="flex flex-wrap gap-2">
                                      {event.highlights.map((highlight, index) => (
                                        <span key={index} className="px-3 py-1 bg-black/50 rounded-full text-sm text-gray-300">
                                          {highlight}
                                        </span>
                                      ))}
                                    </div>
                                  </>
                                )}

                                <button
                                  onClick={() => navigate(`/event/${event._id}`)}
                                  className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r bg-gray-600 text-white font-medium transition-colors cursor-pointer flex items-center space-x-2 hover:bg-black hover:text-gray-400 hover:border hover:border-gray-400"
                                >
                                  View Event Details
                                  <ArrowRight className="w-4 h-4 ml-2" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-900/50 rounded-xl p-6 text-center">
                        <p className="text-gray-400">No past events found.</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </section>

            {/* Testimonials Section */}
            <section
              className={`transition-all duration-700 transform ${activeSection === 'testimonials' ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0 absolute pointer-events-none'}`}
              style={{ display: activeSection === 'testimonials' ? 'block' : 'none' }}
            >
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center mr-3">
                  <Star className="w-4 h-4 text-black" />
                </div>
                <h2 className="text-2xl font-bold">Client Testimonials</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.length > 0 ? testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="bg-gray-900 rounded-2xl overflow-hidden relative group"
                  >
                    {/* Decorative accent */}
                    <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-cyan-500 via-cyan-300 to-transparent"></div>

                    <div className="p-6">
                      <div className="flex mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < testimonial.rating ? "text-cyan-500 fill-current" : "text-gray-700"}
                          />
                        ))}
                      </div>

                      <blockquote className="text-gray-300 mb-6">"{testimonial.comment}"</blockquote>

                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-black flex items-center justify-center">
                          <span className="font-bold">{testimonial.name[0]}</span>
                        </div>
                        <div className="ml-3">
                          <div className="font-medium">{testimonial.name}</div>
                          <div className="text-xs text-gray-400">{testimonial.position}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full bg-gray-900/50 rounded-xl p-6 text-center">
                    <p className="text-gray-400">No testimonials available.</p>
                  </div>
                )}

                {/* Contact CTA Card */}
                <div className="bg-gradient-to-br from-black to-gray-900 rounded-2xl overflow-hidden relative col-span-full">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500 opacity-10 rounded-full transform translate-x-20 -translate-y-20"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500 opacity-5 rounded-full transform -translate-x-16 translate-y-16"></div>

                  <div className="p-8 md:p-12 relative z-10">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Create Your Next Event?</h3>
                    <p className="text-gray-300 mb-8 max-w-2xl">
                      Contact {name} to discuss how to transform your vision into an unforgettable experience that exceeds expectations.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                      {email ? (
                        <a
                          href={`mailto:${email}`}
                          className="bg-cyan-500 text-black px-6 py-3 rounded-xl font-bold flex items-center justify-center transform transition-transform hover:scale-105"
                        >
                          <Mail className="w-5 h-5 mr-2" />
                          Get in Touch
                        </a>
                      ) : (
                        <button
                          onClick={() => toast.info("Contact information not available")}
                          className="bg-cyan-500 text-black px-6 py-3 rounded-xl font-bold flex items-center justify-center transform transition-transform hover:scale-105"
                        >
                          <Mail className="w-5 h-5 mr-2" />
                          Get in Touch
                        </button>
                      )}

                      <button
                        onClick={() => navigate(`/organizer/events/list`)}
                        className="bg-transparent border border-cyan-500 text-cyan-500 px-6 py-3 rounded-xl font-bold flex items-center justify-center transform transition-transform hover:scale-105"
                      >
                        <FaPhone className="w-5 h-5 mr-2  " />
                        Call to Action
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerProfile;