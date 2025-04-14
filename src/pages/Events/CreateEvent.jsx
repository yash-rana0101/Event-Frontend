import React, { useState, useEffect } from 'react';
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';
import EventForm from '../../components/Events/CreateEvent/EventForm';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fixPersistenceIssues, safelyParseToken } from '../../utils/persistFix';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [tokenValid, setTokenValid] = useState(false);

  const organizerToken = useSelector(state => state.organizer?.token);
  const user = useSelector(state => state.organizer?.user);

  // Fix persistence issues on component mount
  useEffect(() => {
    fixPersistenceIssues();
  }, []);

  useEffect(() => {
    // Get the raw token from state or localStorage
    let rawToken = organizerToken || localStorage.getItem('organizer_token');

    // Safely parse the token to handle JSON string format
    const token = safelyParseToken(rawToken);

    console.log('Token check - Original token:', typeof rawToken, rawToken ? rawToken.substring(0, 15) + '...' : 'none');
    console.log('Token check - Parsed token:', typeof token, token ? token.substring(0, 15) + '...' : 'none');

    if (!token) {
      setError('You need to be logged in to create events');
      toast.error('Authentication required. Please login first.');
      setTimeout(() => {
        navigate('/organizer/login');
      }, 2000);
    } else {
      setTokenValid(true);
    }
  }, [organizerToken, navigate]);

  const handleSubmit = async (eventData) => {
    try {
      setSubmitting(true);
      setError(null);

      // Fix persistence issues first
      fixPersistenceIssues();

      // Get token and parse it if it's a JSON string
      let rawToken = organizerToken || localStorage.getItem('organizer_token');
      const token = safelyParseToken(rawToken);

      console.log('Submit - Raw token type:', typeof rawToken);
      console.log('Submit - Parsed token:', typeof token, token ? token.substring(0, 15) + '...' : 'none');

      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      // Handle possibly stringified user object
      let organizer = user;
      let organizerId = null;
      
      if (typeof user === 'string') {
        try {
          organizer = JSON.parse(user);
        } catch (e) {
          console.error("Failed to parse user data:", e);
        }
      }

      // Attempt to extract organizer ID from various possible structures
      if (organizer) {
        if (typeof organizer === 'object') {
          organizerId = 
            organizer._id || 
            organizer.id || 
            (organizer._doc && (organizer._doc._id || organizer._doc.id));
        }
      }

      // Check localStorage as fallback (for testing purposes)
      if (!organizerId) {
        try {
          const localOrganizer = JSON.parse(localStorage.getItem('organizer_user'));
          if (localOrganizer) {
            organizerId = localOrganizer._id || localOrganizer.id;
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }

      // Process images - convert any blob URLs to actual files
      let processedImages = [...eventData.images].map(img => {
        if (typeof img === 'string' && img.startsWith('blob:')) {
          // For now, we'll use a placeholder
          return "https://via.placeholder.com/800x600?text=Image+Pending";
        }
        return img;
      });      
      // Format event data for submission
      const formattedData = {
        ...eventData,
        images: processedImages,
        organizer: organizerId
      };

      // Make sure we're using absolute URL path and correct API endpoint
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
      const baseUrl = apiUrl.endsWith('/api/v1') ? apiUrl : `${apiUrl}/api/v1`;

      console.log(`Sending request to: ${baseUrl}/events`);
      console.log('Using token:', token.substring(0, 15) + '...');
      
      // Log the headers we're sending
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      console.log('Request headers:', JSON.stringify(headers));

      // Send the request with proper headers
      const response = await axios.post(
        `${baseUrl}/events`,
        formattedData,
        {
          headers: headers,
          withCredentials: false // Include credentials for CORS requests
        }
      );

      console.log("Event created:", response.data);
      toast.success('Event created successfully!');
      setSuccess(true);

      setTimeout(() => {
        navigate('/organizer/events');
      }, 2000);

    } catch (error) {
      console.error("Failed to create event:", error);
      
      // Enhanced error logging
      if (error.response) {
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", error.response.data);
        console.error("Error response headers:", error.response.headers);
      }

      let errorMessage = 'Failed to create event. Please try again.';

      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = 'Authentication failed. Your session may have expired - please log in again.';
            // Add debug info
            if (error.response.data?.message) {
              errorMessage += ` (${error.response.data.message})`;
            }
            localStorage.removeItem('organizer_token');
            setTimeout(() => navigate('/organizer/login'), 3000);
            break;

          case 403:
            errorMessage = 'You do not have permission to create events.';
            break;

          case 400:
            errorMessage = error.response.data?.message || 'Invalid event data provided.';
            break;

          default:
            errorMessage = error.response.data?.message || 'Server error. Please try again later.';
        }
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-cyan-500 opacity-5 rounded-full filter blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-cyan-500 opacity-5 rounded-full filter blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-3">Event Created Successfully!</h2>
                <p className="text-gray-400">Redirecting you to your events dashboard...</p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center mb-10">
                  <motion.h1
                    className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Create Your <span className="text-cyan-500">Event</span>
                  </motion.h1>
                  <motion.p
                    className="text-gray-400 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Fill in the details below to create your new event. All fields marked with an asterisk (*) are required.
                  </motion.p>
                </div>

                {error && (
                  <motion.div
                    className="mb-6 p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-400 text-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.div>
                )}

                <EventForm
                  onSubmit={handleSubmit}
                  submitting={submitting}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(6, 182, 212, 0.1) 1px, transparent 1px);
          background-size: 24px 24px;
        }
      `}</style>
    </div>
  );
}
