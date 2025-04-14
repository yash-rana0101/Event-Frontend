import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function EventCarousel({ carouselEvents = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const autoSlideTimerRef = useRef(null);
  
  // Auto-slide interval in milliseconds
  const autoSlideInterval = 5000;

  useEffect(() => {
    // If carouselEvents are provided from props, use them
    if (carouselEvents && carouselEvents.length > 0) {
      processEvents(carouselEvents);
    } else {
      // Otherwise fetch events from API directly
      fetchNewestEvents();
    }
  }, [carouselEvents]);

  const fetchNewestEvents = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
      // Make sure the API URL is properly formatted
      const baseUrl = apiUrl.endsWith('/api/v1') ? apiUrl : `${apiUrl}/api/v1`;
      
      console.log('Fetching newest events from:', `${baseUrl}/events/newest`);
      
      const response = await axios.get(`${baseUrl}/events/newest`, {
        params: { limit: 5 }
      });
      
      // Determine the data structure and extract events
      let fetchedEvents = [];
      if (Array.isArray(response.data)) {
        fetchedEvents = response.data;
      } else if (response.data.events && Array.isArray(response.data.events)) {
        fetchedEvents = response.data.events;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        fetchedEvents = response.data.data;
      }
      
      processEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching carousel events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const processEvents = (rawEvents) => {
    if (!rawEvents || rawEvents.length === 0) {
      setEvents([]);
      return;
    }
    
    // Format events to ensure consistent structure
    const formattedEvents = rawEvents.map(event => ({
      id: event.id || event._id,
      title: event.title || "Unnamed Event",
      date: event.date || new Date(event.startDate || event.createdAt || Date.now()).toLocaleDateString(),
      image: event.image || event.images?.[0] || 'https://placehold.co/600x400?text=No+Image',
      location: typeof event.location === 'object' 
        ? (event.location.address || event.location.city || 'No location specified')
        : (event.location || 'No location specified'),
      category: event.category || 'Event',
      description: event.description ? (event.description.substring(0, 100) + '...') : 'No description available',
    }));
    
    setEvents(formattedEvents);
    setCurrentIndex(0); // Reset index when new events arrive
  };

  // Auto-slide effect
  useEffect(() => {
    // Only run auto-slide if we have more than one event
    if (events.length <= 1 || isPaused) return;
    
    // Clear any existing timer
    if (autoSlideTimerRef.current) {
      clearTimeout(autoSlideTimerRef.current);
    }
    
    // Set up auto-slide timer
    autoSlideTimerRef.current = setTimeout(() => {
      if (!isAnimating) {
        setIsAnimating(true);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
        setTimeout(() => setIsAnimating(false), 600);
      }
    }, autoSlideInterval);
    
    // Clear the timer on component unmount
    return () => {
      if (autoSlideTimerRef.current) {
        clearTimeout(autoSlideTimerRef.current);
      }
    };
  }, [currentIndex, events.length, isAnimating, isPaused]);

  const handleNext = () => {
    if (isAnimating) return;
    
    // Clear auto-slide timer when manually navigating
    if (autoSlideTimerRef.current) {
      clearTimeout(autoSlideTimerRef.current);
    }
    
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    
    // Clear auto-slide timer when manually navigating
    if (autoSlideTimerRef.current) {
      clearTimeout(autoSlideTimerRef.current);
    }
    
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? events.length - 1 : prevIndex - 1));
    setTimeout(() => setIsAnimating(false), 600);
  };

  // Show loading state or return null if no events
  if (loading) {
    return (
      <div className="bg-black py-12 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 w-48 bg-gray-700 rounded mb-8"></div>
            <div className="h-[400px] bg-gray-800 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // If no events, don't render the component
  if (events.length === 0) return null;

  const currentEvent = events[currentIndex];
  const nextEvent = events[(currentIndex + 1) % events.length];

  return (
    <div className="bg-black py-12 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl text-cyan-400 font-bold mb-8 sm:mb-12 tracking-tight relative inline-block">
          Featured Events
          <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-cyan-400 rounded-full"></span>
        </h2>
        
        <div className="relative lg:flex lg:items-center lg:gap-6"
             onMouseEnter={() => setIsPaused(true)}
             onMouseLeave={() => setIsPaused(false)}>
          {/* Main carousel */}
          <div className="w-full lg:w-3/4 relative">
            <div key={currentIndex} className="rounded-2xl overflow-hidden shadow-2xl relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-70 z-10"></div>
              
              <div className="relative overflow-hidden h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px]">
                <img
                  src={currentEvent.image}
                  alt={currentEvent.title}
                  className="w-full h-full object-cover transform transition-transform duration-700 ease-out hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/600x400?text=Image+Not+Available';
                  }}
                />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 z-20 transform transition-transform duration-500">
                <div className="inline-block bg-cyan-400 text-black px-3 py-1 rounded-full text-xs font-bold tracking-wide mb-2">
                  {currentEvent.category?.toUpperCase() || 'FEATURED'}
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-2 tracking-tight">
                  {currentEvent.title}
                </h2>
                
                <p className="text-gray-300 mb-4 line-clamp-2 max-w-3xl">
                  {currentEvent.description}
                </p>
                
                <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-sm sm:text-base text-gray-300">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-cyan-400" />
                    {currentEvent.date}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-cyan-400" />
                    {currentEvent.location}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Link to={`/event/${currentEvent.id}`} className="bg-cyan-400 text-black font-medium px-4 py-2 rounded-lg hover:bg-cyan-500 transition-colors duration-300 inline-flex items-center text-sm">
                    View Details
                  </Link>
                  <Link to={`/event/${currentEvent.id}`} className="bg-transparent border border-cyan-400 text-cyan-400 font-medium px-4 py-2 rounded-lg hover:bg-cyan-400/10 transition-colors duration-300 inline-flex items-center text-sm">
                    Register Now
                  </Link>
                </div>
              </div>
            </div>

            {/* Carousel buttons for mobile */}
            {events.length > 1 && (
              <div className="absolute top-1/3 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-2 z-30 md:hidden">
                <button
                  onClick={handlePrev}
                  className="pointer-events-auto p-2 rounded-full bg-black/30 backdrop-blur-sm text-cyan-400 hover:bg-black/50 hover:text-white transition-colors duration-300"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="pointer-events-auto p-2 rounded-full bg-black/30 backdrop-blur-sm text-cyan-400 hover:bg-black/50 hover:text-white transition-colors duration-300"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Preview of next event (only on desktop) */}
          {events.length > 1 && (
            <div className="hidden lg:block lg:w-1/4">
              <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg cursor-pointer" onClick={handleNext}>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={nextEvent.image}
                    alt={nextEvent.title}
                    className="w-full h-full object-cover transform transition-transform duration-500 ease-out hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/600x400?text=Image+Not+Available';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                  <div className="absolute top-2 right-2 bg-cyan-400 text-black text-xs font-bold px-2 py-1 rounded">
                    NEXT
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{nextEvent.title}</h3>
                  <div className="text-sm text-gray-400">{nextEvent.date}</div>
                </div>
              </div>

              {/* Carousel navigation for desktop */}
              <div className="mt-4 flex justify-between">
                <button
                  onClick={handlePrev}
                  className="group bg-gray-900 p-3 rounded-lg flex items-center justify-center text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300"
                  aria-label="Previous event"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="group bg-gray-900 p-3 rounded-lg flex items-center justify-center text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300"
                  aria-label="Next event"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Progress indicators */}
        {events.length > 1 && (
          <div className="mt-6 flex justify-center lg:justify-start">
            {events.map((_, index) => (
              <button
                key={index}
                className="group relative mx-1 focus:outline-none"
                onClick={() => {
                  if (isAnimating) return;
                  
                  // Clear auto-slide timer when clicking indicator
                  if (autoSlideTimerRef.current) {
                    clearTimeout(autoSlideTimerRef.current);
                  }
                  
                  setIsAnimating(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsAnimating(false), 600);
                }}
                aria-label={`Go to slide ${index + 1}`}
              >
                <span 
                  className={`block w-8 h-1 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? "bg-cyan-400" 
                      : "bg-gray-600 group-hover:bg-gray-400"
                  }`}
                ></span>
                {index === currentIndex && (
                  <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400"></span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}