import React, { useState, useEffect } from 'react';
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';
import EventForm from '../../components/Events/CreateEvent/EventForm';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fixPersistenceIssues, safelyParseToken } from '../../utils/persistFix';
import eventService from '../../services/eventService';
import { useLoader } from '../../context/LoaderContext';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [tokenValid, setTokenValid] = useState(false);
  const [savedFormData, setSavedFormData] = useState(null);
  const { setIsLoading } = useLoader();

  const organizerToken = useSelector(state => state.organizer?.token);
  const user = useSelector(state => state.organizer?.user);

  // Fix persistence issues on component mount
  useEffect(() => {
    fixPersistenceIssues();
  }, []);

  useEffect(() => {
    setIsLoading(submitting);
    return () => setIsLoading(false);
  }, [submitting, setIsLoading]);

  useEffect(() => {
    // Get the raw token from state or localStorage
    let rawToken = organizerToken;

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

  // Restore form data from localStorage if present
  useEffect(() => {
    const saved = localStorage.getItem("event_form_data");
    if (saved) {
      setSavedFormData(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = async (eventData) => {
    try {
      setSubmitting(true);
      setError(null);

      // Get token - simplified token handling
      let rawToken = organizerToken;
      const token = safelyParseToken(rawToken);

      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      // Simplified organizer ID extraction
      let organizerId = null;

      // Extract ID from user object if available
      if (user) {
        const userObj = typeof user === 'string' ? JSON.parse(user) : user;
        organizerId = userObj._id || userObj.id ||
          (userObj._doc && (userObj._doc._id || userObj._doc.id));
      }

      // Fallback to localStorage if needed
      if (!organizerId) {
        const localOrganizer = JSON.parse(localStorage.getItem('organizer_user') || '{}');
        organizerId = localOrganizer._id || localOrganizer.id;
      }

      if (!organizerId) {
        throw new Error('Organizer ID not found. Please log in again.');
      }

      // Prepare FormData for file upload
      const formData = new FormData();
      // Append all fields to FormData
      for (const key in eventData) {
        if (key === "image" && eventData[key]) {
          formData.append("image", eventData[key]);
        } else if (Array.isArray(eventData[key]) || typeof eventData[key] === "object") {
          formData.append(key, JSON.stringify(eventData[key]));
        } else if (eventData[key] !== undefined && eventData[key] !== null) {
          formData.append(key, eventData[key]);
        }
      }
      formData.append("organizer", organizerId);

      // return console.log("formData prepared:", eventData);

      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await axios.post(
        `${apiUrl}/events`,
        eventData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
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

      // More detailed error handling
      let errorMessage = 'Failed to create event. Please try again.';

      if (error.response) {
        console.error('Error response:', error.response.data);
        errorMessage = error.response.data?.message ||
          error.response.data?.error ||
          'Server error. Please check your data and try again.';
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      if (errorMessage.includes('Authentication failed')) {
        localStorage.removeItem('organizer_token');
        setTimeout(() => navigate('/organizer/login'), 3000);
      }

      // Save form data to localStorage on error
      localStorage.setItem("event_form_data", JSON.stringify(eventData));
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

                <EventForm
                  onSubmit={handleSubmit}
                  submitting={submitting}
                  initialFormData={savedFormData}
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
