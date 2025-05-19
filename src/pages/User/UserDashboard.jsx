/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Ticket, Users, ChevronRight, ChevronLeft, List } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Import components
import Sidebar from '../../components/User/Dashboard/Sidebar';
import EventsSection from '../../components/User/Dashboard/EventsSection';
import RecommendationsSection from '../../components/User/Dashboard/RecommendationsSection';
import SavedEventsSection from '../../components/User/Dashboard/SavedEventsSection';
import NotificationsSection from '../../components/User/Dashboard/NotificationsSection';
import FeedbackSection from '../../components/User/Dashboard/FeedbackSection';
import HelpSection from '../../components/User/Dashboard/HelpSection';
import ContactSection from '../../components/User/Dashboard/ContactSection';
import OverviewSection from '../../components/User/Dashboard/OverviewSection';
import EventCard from '../../components/User/Dashboard/EventCard';
import Skeleton from '../../components/UI/Skeleton';
import { getAuthHeaders } from "../../utils/apiUtils";
import eventService from '../../services/eventService';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data states
  const [profile, setProfile] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    upcomingEvents: [],
    savedEvents: [],
    notifications: [],
    recommendations: [],
    calendarDays: [],
    stats: {
      eventsAttended: 0,
      upcomingEvents: 0,
      savedEvents: 0,
      eventPhotos: 0
    }
  });

  // States for specific tabs
  const [events, setEvents] = useState([]);
  const [savedEvents, setSavedEvents] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [calendarData, setCalendarData] = useState({ calendarDays: [] });

  // Track if individual data is loading
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [loadingCalendar, setLoadingCalendar] = useState(false);

  // Add state for mobile sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Reference to main content for scroll management
  const mainContentRef = useRef(null);

  // Toggle sidebar function for mobile
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Detect swipe gestures
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      // Swipe left - close sidebar
      setSidebarOpen(false);
    }

    if (touchEnd - touchStart > 100 && touchStart < 50) {
      // Swipe right from edge - open sidebar
      setSidebarOpen(true);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [sidebarOpen]);

  // Fetch user profile and dashboard data
  useEffect(() => {
    const fetchUserDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if the user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch user profile first
        const profileResponse = await axios.get(`${import.meta.env.VITE_API_URL}/profiles/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setProfile(profileResponse.data.data);

        // Fetch dashboard data for overview
        const dashboardResponse = await axios.get(`${import.meta.env.VITE_API_URL}/profiles/me/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setDashboardData(dashboardResponse.data.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);

        // If profile doesn't exist, redirect to create profile
        if (err.response && err.response.status === 404) {
          toast.info('Please create your profile first');
          navigate('/user/create-profile');
          return;
        }

        setError('Failed to load dashboard data. Please try again later.');
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDashboard();
  }, [navigate]);

  // Fetch tab-specific data when activeTab changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchTabData = async () => {
      try {
        // Fetch specific data based on active tab
        switch (activeTab) {
          case 'events': {
            setLoadingEvents(true);
            try {
              const eventsResponse = await eventService.getUserDashboardEvents();
              setEvents(eventsResponse.data || []);
            } catch (err) {
              console.error("Error fetching events:", err);
              setEvents([]);
              toast.error(`Failed to load events data: ${err.message}`);
            } finally {
              setLoadingEvents(false);
            }
            break;
          }

          case 'saved': {
            setLoadingSaved(true);
            try {
              const savedResponse = await eventService.getUserSavedEvents();
              setSavedEvents(savedResponse.data || []);
            } catch (err) {
              console.error("Error fetching saved events:", err);
              setSavedEvents([]);
              toast.error(`Failed to load saved events data: ${err.message}`);
            } finally {
              setLoadingSaved(false);
            }
            break;
          }

          case 'recommendations': {
            setLoadingRecommendations(true);
            try {
              const recommendationsResponse = await eventService.getUserRecommendations();
              setRecommendations(recommendationsResponse.data || []);
            } catch (err) {
              console.error("Error fetching recommendations:", err);
              setRecommendations([]);
              toast.error(`Failed to load recommendations: ${err.message}`);
            } finally {
              setLoadingRecommendations(false);
            }
            break;
          }

          case 'calendar': {
            setLoadingCalendar(true);
            try {
              const calendarResponse = await eventService.getUserCalendarData();
              setCalendarData(calendarResponse.data || { calendarDays: [] });
            } catch (err) {
              console.error("Error fetching calendar data:", err);
              setCalendarData({ calendarDays: [] });
              toast.error(`Failed to load calendar data: ${err.message}`);
            } finally {
              setLoadingCalendar(false);
            }
            break;
          }

          default:
            // Overview already loaded or other tabs don't need special data
            break;
        }
      } catch (err) {
        console.error(`Error fetching data for ${activeTab} tab:`, err);
        toast.error(`Failed to load ${activeTab} data`);
      }
    };

    if (activeTab !== 'overview') {
      fetchTabData();
    }
  }, [activeTab]);

  // Handle save/unsave event
  const handleSaveEvent = async (eventId, isSaved) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.info('Please login to save events');
        navigate('/login');
        return;
      }

      if (isSaved) {
        // Unsave the event
        await axios.delete(`${import.meta.env.VITE_API_URL}/profiles/events/${eventId}/save`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Event removed from saved events');
      } else {
        // Save the event
        await axios.post(`${import.meta.env.VITE_API_URL}/profiles/events/${eventId}/save`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Event saved successfully');
      }

      // Refresh saved events if on saved tab
      if (activeTab === 'saved') {
        const savedResponse = await axios.get(`${import.meta.env.VITE_API_URL}/profiles/me/dashboard/saved`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSavedEvents(savedResponse.data.data);
      }

      // Refresh dashboard data if on overview
      if (activeTab === 'overview') {
        const dashboardResponse = await axios.get(`${import.meta.env.VITE_API_URL}/profiles/me/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDashboardData(dashboardResponse.data.data);
      }

    } catch (err) {
      console.error('Error saving/unsaving event:', err);
      toast.error('Failed to update saved events');
    }
  };

  // New state and effect for handling API errors and fallback data
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user dashboard data with error handling and fallback
  const fetchUserDashboard = async () => {
    try {
      setIsLoading(true);

      // Get authentication headers
      const { headers } = getAuthHeaders();

      // Try to fetch from the API
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/profiles/me/dashboard`, {
          headers
        });
        setDashboardData(response.data);
        setError(null);
      } catch (apiError) {
        console.warn("API error:", apiError);

        // Fallback to mock data if API fails
        setDashboardData({
          user: {
            name: "User",
            email: "user@example.com",
          },
          stats: {
            eventsAttended: 5,
            upcomingEvents: 3,
            notifications: 2,
            favoriteEvents: 7
          },
          recentEvents: [],
          upcomingEvents: [],
          notifications: []
        });

        // Set error for debugging but don't show to user since we have fallback data
        setError(`API Error: ${apiError.message}. Using mock data.`);

        // Log detailed error for debugging
        if (apiError.response) {
          console.error("API response error:", {
            status: apiError.response.status,
            data: apiError.response.data
          });
        }
      }
    } catch (error) {
      console.error("Dashboard error:", error);
      setError("Failed to load dashboard data");

      // Use mock data as fallback
      setDashboardData({
        user: {
          name: "Guest User",
          email: "guest@example.com",
        },
        stats: {
          eventsAttended: 0,
          upcomingEvents: 0,
          notifications: 0,
          favoriteEvents: 0
        },
        recentEvents: [],
        upcomingEvents: [],
        notifications: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUserDashboard();
  }, [navigate]);

  if (loading) {
    return <Skeleton type='profile' columns={8} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center p-6 max-w-md">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r bg-cyan-400 text-black font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Fix the destructuring issue by ensuring dashboardData is not undefined
  const {
    upcomingEvents = [],
    savedEvents: overviewSavedEvents = [],
    notifications = [],
    recommendations: overviewRecommendations = [],
    calendarDays = [],
    stats = {
      eventsAttended: 0,
      upcomingEvents: 0,
      savedEvents: 0,
      eventPhotos: 0
    }
  } = dashboardData || {};

  // Use the appropriate data source based on active tab
  const displayEvents = activeTab === 'events' ? events : upcomingEvents;
  const displaySavedEvents = activeTab === 'saved' ? savedEvents : overviewSavedEvents;
  const displayRecommendations = activeTab === 'recommendations' ? recommendations : overviewRecommendations;
  const displayCalendarDays = activeTab === 'calendar' ? calendarData.calendarDays : calendarDays;

  return (
    <div
      className="min-h-screen h-screen bg-black flex flex-col md:flex-row relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-cyan-500 opacity-5 rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-cyan-500 opacity-5 rounded-full filter blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
      </div>

      {/* Sliding tab indicator for mobile - replaces menu button */}
      <div className="md:hidden fixed top-1/2 -translate-y-1/2 left-0 z-30">
        <button
          onClick={toggleSidebar}
          className={`flex items-center justify-center bg-black/80 backdrop-blur-sm border ${sidebarOpen ? 'border-cyan-900' : 'border-cyan-500'} 
          border-l-0 rounded-r-md p-2 transition-all duration-300`}
          aria-label="Toggle navigation"
        >
          <ChevronRight
            className={`text-cyan-500 transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : ''}`}
            size={20}
          />
        </button>
      </div>

      {/* Responsive Sidebar with improved animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key="sidebar"
          initial={{ x: -280 }}
          animate={{ x: sidebarOpen || window.innerWidth >= 768 ? 0 : -280 }}
          exit={{ x: -280 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed md:sticky top-0 left-0 h-full z-30 md:z-20 bg-black/95 border-r border-gray-800 
          md:bg-transparent w-64 md:flex-shrink-0 overflow-hidden"
        >
          <Sidebar
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              if (window.innerWidth < 768) {
                setSidebarOpen(false);
                // Scroll to top when changing tabs on mobile
                if (mainContentRef.current) {
                  mainContentRef.current.scrollTo(0, 0);
                }
              }
            }}
          />

          {/* Close button within sidebar for mobile */}
          <button
            className="md:hidden absolute top-4 right-4 text-gray-400 hover:text-cyan-500 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <ChevronLeft size={24} />
          </button>
        </motion.div>
      </AnimatePresence>

      {/* Responsive overlay for mobile when sidebar is open */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          ></motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - With overflow handling and improved scrolling */}
      <div
        ref={mainContentRef}
        className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto bg-black text-white relative z-10 w-full h-full"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(8, 145, 178, 0.3) transparent'
        }}
      >
        <motion.div
          className="max-w-6xl mx-auto pb-16" /* Added bottom padding to prevent content being cut off */
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* User Profile Banner for Mobile - Enhanced with better spacing and positioning */}
          <div className="md:hidden bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg p-4 mb-6 shadow-lg">
            <div className="flex items-center">
              <div className="bg-black text-cyan-500 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4">
                {profile?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h1 className="text-xl font-bold text-black">{profile?.name || 'User'}</h1>
                <p className="text-black">{profile?.badges?.[0]?.name || 'Member'}</p>
              </div>

              {/* Quick toggle for sidebar within the profile banner */}
              <button
                onClick={toggleSidebar}
                className="ml-auto bg-black/30 text-black p-2 rounded-full hover:bg-black/40 transition-colors"
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Stats Display with improved responsive grid and scroll handling */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
              <motion.div
                className="bg-black/40 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-cyan-900/30"
                whileHover={{ y: -5, borderColor: 'rgba(8, 145, 178, 0.5)' }}
              >
                <p className="text-gray-400 text-xs sm:text-sm">Events Attended</p>
                <p className="text-lg sm:text-2xl font-bold text-white">{stats.eventsAttended}</p>
              </motion.div>
              <motion.div
                className="bg-black/40 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-cyan-900/30"
                whileHover={{ y: -5, borderColor: 'rgba(8, 145, 178, 0.5)' }}
              >
                <p className="text-gray-400 text-xs sm:text-sm">Upcoming Events</p>
                <p className="text-lg sm:text-2xl font-bold text-white">{stats.upcomingEvents}</p>
              </motion.div>
              <motion.div
                className="bg-black/40 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-cyan-900/30"
                whileHover={{ y: -5, borderColor: 'rgba(8, 145, 178, 0.5)' }}
              >
                <p className="text-gray-400 text-xs sm:text-sm">Saved Events</p>
                <p className="text-lg sm:text-2xl font-bold text-white">{stats.savedEvents}</p>
              </motion.div>
              <motion.div
                className="bg-black/40 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-cyan-900/30"
                whileHover={{ y: -5, borderColor: 'rgba(8, 145, 178, 0.5)' }}
              >
                <p className="text-gray-400 text-xs sm:text-sm">Event Photos</p>
                <p className="text-lg sm:text-2xl font-bold text-white">{stats.eventPhotos}</p>
              </motion.div>
            </div>
          )}

          {/* Action Buttons - More responsive with better spacing */}
          <div className="flex flex-wrap gap-3 mb-6">
            <motion.button
              className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-xl bg-gradient-to-r bg-cyan-400 text-black font-medium transition-colors cursor-pointer flex items-center space-x-2 hover:bg-black hover:text-cyan-400 hover:border hover:border-cyan-400"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/events')}
            >
              <Ticket size={16} />
              <span>Explore Events</span>
            </motion.button>
            <motion.button
              className="bg-black text-cyan-500 border border-cyan-500 hover:bg-cyan-900/20 px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md transition flex items-center gap-2"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('notifications')}
            >
              <Users size={16} />
              <span>Notifications</span>
            </motion.button>
          </div>

          {/* Tab content with AnimatePresence for smooth transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'overview' ? (
                <div className="space-y-6 md:space-y-8">
                  {/* My Events Section */}
                  <OverviewSection title="My Events" icon="ticket">
                    {upcomingEvents?.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {upcomingEvents.slice(0, 3).map(event => (
                          <EventCard key={event.id} event={event} onSave={handleSaveEvent} />
                        ))}
                      </div>
                    ) : (
                      <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 sm:p-8 text-center">
                        <p className="text-gray-400">You don't have any upcoming events</p>
                        <motion.button
                          className="mt-4 px-4 py-2 bg-cyan-500 text-black rounded-md font-medium"
                          whileHover={{ y: -2 }}
                          onClick={() => navigate('/events')}
                        >
                          Browse Events
                        </motion.button>
                      </div>
                    )}
                    <div className="mt-4 text-right">
                      <motion.button
                        className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center ml-auto transition-colors"
                        onClick={() => setActiveTab('events')}
                        whileHover={{ x: 3 }}
                      >
                        View All Events <span className="ml-1">→</span>
                      </motion.button>
                    </div>
                  </OverviewSection>

                  {/* Recommendations Section - with proper spacing for mobile */}
                  <RecommendationsSection
                    recommendations={overviewRecommendations || []}
                    setActiveTab={setActiveTab}
                    overview={true}
                  />

                  {/* Saved Events Section */}
                  <SavedEventsSection
                    savedEvents={overviewSavedEvents || []}
                    setActiveTab={setActiveTab}
                    overview={true}
                  />

                  {/* Notifications Section */}
                  <NotificationsSection
                    notifications={notifications || []}
                    setActiveTab={setActiveTab}
                    overview={true}
                  />

                  {/* Feedback Section */}
                  <FeedbackSection events={upcomingEvents || []} setActiveTab={setActiveTab} overview={true} />

                  {/* FAQs Section */}
                  <HelpSection setActiveTab={setActiveTab} overview={true} />

                  {/* Contact Section */}
                  <ContactSection events={upcomingEvents || []} setActiveTab={setActiveTab} overview={true} />
                </div>
              ) : activeTab === 'calendar' ? (
                loadingCalendar ? (
                  <Skeleton type="calendar" />
                ) : (
                  <CalendarView calendarDays={displayCalendarDays || []} />
                )
              ) : activeTab === 'events' ? (
                loadingEvents ? (
                  <Skeleton type="events" />
                ) : (
                  <EventsSection events={displayEvents || []} onSaveEvent={handleSaveEvent} />
                )
              ) : activeTab === 'recommendations' ? (
                loadingRecommendations ? (
                  <Skeleton type="events" />
                ) : (
                  <RecommendationsSection recommendations={displayRecommendations || []} />
                )
              ) : activeTab === 'saved' ? (
                loadingSaved ? (
                  <Skeleton type="events" />
                ) : (
                  <SavedEventsSection
                    savedEvents={displaySavedEvents || []}
                    onUnsave={(eventId) => handleSaveEvent(eventId, true)}
                  />
                )
              ) : activeTab === 'notifications' ? (
                <NotificationsSection notifications={notifications || []} />
              ) : activeTab === 'feedback' ? (
                <FeedbackSection events={[...(upcomingEvents || []), ...(displaySavedEvents || [])]} />
              ) : activeTab === 'help' ? (
                <HelpSection />
              ) : activeTab === 'contact' ? (
                <ContactSection events={upcomingEvents || []} />
              ) : null}
            </motion.div>
          </AnimatePresence>

          {/* Floating back to top button - appears when scrolled */}
          <BackToTopButton contentRef={mainContentRef} />
        </motion.div>
      </div>
    </div>
  );
}

// New BackToTopButton component
function BackToTopButton({ contentRef }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      if (contentRef.current.scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const currentRef = contentRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, [contentRef]);

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={scrollToTop}
          className="fixed right-4 bottom-4 bg-cyan-500 text-black p-2 rounded-full shadow-lg z-40
          hover:bg-cyan-400 transition-colors"
        >
          <ChevronLeft className="rotate-90" size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
