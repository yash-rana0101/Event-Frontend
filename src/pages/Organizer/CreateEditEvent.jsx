/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Tag, AlertCircle, X, Check, ArrowLeft, Save, Upload, Image } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fixPersistenceIssues, safelyParseToken } from '../../utils/persistFix';

const CreateEditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(eventId);

  // Get organizer data from Redux store
  const organizerToken = useSelector(state => state.organizer?.token);
  const organizer = useSelector(state => state.organizer?.user);

  // Form state with structure matching the Event model
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    description: '',
    category: '',
    startDate: '',
    endDate: '',
    duration: '',
    location: {
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      coordinates: { lat: null, lng: null }
    },
    capacity: 0,
    isPaid: false,
    price: 0,
    currency: 'USD',
    registrationDeadline: '',
    images: [],
    tags: [],
    featured: false,
    isPublished: false,
    status: 'draft',
    timeline: [],
    prizes: [],
    sponsors: [],
    faqs: []
  });

  const [newTimelineItem, setNewTimelineItem] = useState({ time: '', event: '' });
  const [newPrize, setNewPrize] = useState({ place: '', amount: '', description: '' });
  const [newSponsor, setNewSponsor] = useState({ name: '', tier: 'other', logo: '' });
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);

  // Fetch event data if editing
  useEffect(() => {
    // Fix persistence issues
    fixPersistenceIssues();

    if (isEditMode) {
      fetchEventData();
    }
  }, [eventId]);

  const fetchEventData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get token and parse it if it's a JSON string
      let rawToken = organizerToken || localStorage.getItem('organizer_token');
      const token = safelyParseToken(rawToken);

      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';

      const response = await axios.get(`${apiUrl}/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Format the data to match our form structure
      const eventData = response.data;

      // Convert dates to expected format
      const startDate = eventData.startDate ? new Date(eventData.startDate).toISOString().split('T')[0] : '';
      const endDate = eventData.endDate ? new Date(eventData.endDate).toISOString().split('T')[0] : '';
      const registrationDeadline = eventData.registrationDeadline ?
        new Date(eventData.registrationDeadline).toISOString().split('T')[0] : '';

      setFormData({
        title: eventData.title || '',
        tagline: eventData.tagline || '',
        description: eventData.description || '',
        category: eventData.category || '',
        startDate,
        endDate,
        duration: eventData.duration || '',
        location: eventData.location || {
          address: '',
          city: '',
          state: '',
          country: '',
          zipCode: '',
          coordinates: { lat: null, lng: null }
        },
        capacity: eventData.capacity || 0,
        isPaid: eventData.isPaid || false,
        price: eventData.price || 0,
        currency: eventData.currency || 'USD',
        registrationDeadline,
        images: eventData.images || [],
        tags: eventData.tags || [],
        featured: eventData.featured || false,
        isPublished: eventData.status === 'active' || false,
        status: eventData.status || 'draft',
        timeline: eventData.timeline || [],
        prizes: eventData.prizes || [],
        sponsors: eventData.sponsors || [],
        faqs: eventData.faqs || []
      });

      // Set preview images for already uploaded images
      setPreviewImages(eventData.images || []);
    } catch (error) {
      console.error("Error fetching event data:", error);
      setError(error.response?.data?.message || "Failed to load event data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      // Handle nested objects like location.city
      const [objectName, propertyName] = name.split('.');
      setFormData(prevData => ({
        ...prevData,
        [objectName]: {
          ...prevData[objectName],
          [propertyName]: value
        }
      }));
    } else {
      // Handle direct properties
      setFormData(prevData => ({
        ...prevData,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleTimelineChange = (e) => {
    const { name, value } = e.target;
    setNewTimelineItem((prev) => ({ ...prev, [name]: value }));
  };

  const addTimelineItem = () => {
    if (newTimelineItem.time && newTimelineItem.event) {
      setFormData((prev) => ({
        ...prev,
        timeline: [...prev.timeline, newTimelineItem],
      }));
      setNewTimelineItem({ time: '', event: '' });
    }
  };

  const handlePrizeChange = (e) => {
    const { name, value } = e.target;
    setNewPrize((prev) => ({ ...prev, [name]: value }));
  };

  const addPrize = () => {
    if (newPrize.place && newPrize.amount) {
      setFormData((prev) => ({
        ...prev,
        prizes: [...prev.prizes, newPrize],
      }));
      setNewPrize({ place: '', amount: '', description: '' });
    }
  };

  const handleSponsorChange = (e) => {
    const { name, value } = e.target;
    setNewSponsor((prev) => ({ ...prev, [name]: value }));
  };

  const addSponsor = () => {
    if (newSponsor.name && newSponsor.tier) {
      setFormData((prev) => ({
        ...prev,
        sponsors: [...prev.sponsors, newSponsor],
      }));
      setNewSponsor({ name: '', tier: 'other', logo: '' });
    }
  };

  const handleFaqChange = (e) => {
    const { name, value } = e.target;
    setNewFaq((prev) => ({ ...prev, [name]: value }));
  };

  const addFaq = () => {
    if (newFaq.question && newFaq.answer) {
      setFormData((prev) => ({
        ...prev,
        faqs: [...prev.faqs, newFaq],
      }));
      setNewFaq({ question: '', answer: '' });
    }
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError(null);

    try {
      // Get token and parse it if it's a JSON string
      let rawToken = organizerToken || localStorage.getItem('organizer_token');
      const token = safelyParseToken(rawToken);

      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';

      // For each file, create a preview and simulate upload progress
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file size and type
        if (file.size > 5 * 1024 * 1024) { // 5MB
          toast.warning(`File ${file.name} is too large (max 5MB)`);
          continue;
        }

        if (!file.type.startsWith('image/')) {
          toast.warning(`File ${file.name} is not an image`);
          continue;
        }

        // Create form data for file upload
        const formDataForUpload = new FormData();
        formDataForUpload.append('images', file);

        // Simulate upload progress
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            const newProgress = prev + 5;
            return newProgress >= 100 ? 100 : newProgress;
          });
        }, 100);

        try {
          let uploadUrl;
          if (isEditMode) {
            uploadUrl = `${apiUrl}/events/${eventId}/upload-images`;
          } else {
            // For new events, we need a temporary endpoint or we can upload after event creation
            uploadUrl = `${apiUrl}/uploads/temp`;
          }

          // Upload the file
          const response = await axios.post(uploadUrl, formDataForUpload, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            },
            onUploadProgress: progressEvent => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            }
          });

          clearInterval(interval);
          setUploadProgress(100);

          // Get the uploaded file URL from response
          const imageUrl = response.data.imageUrl || response.data.url || response.data.path;

          if (!imageUrl) {
            throw new Error('No image URL returned from server');
          }

          // Create a preview for the uploaded image
          const objectUrl = URL.createObjectURL(file);
          setPreviewImages(prev => [...prev, objectUrl]);

          // Add the image URL to form data
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, imageUrl]
          }));

          toast.success(`Image ${file.name} uploaded successfully`);
        } catch (uploadError) {
          clearInterval(interval);
          console.error('Upload error:', uploadError);

          // Create local preview for failed upload (for UI consistency)
          const objectUrl = URL.createObjectURL(file);
          setPreviewImages(prev => [...prev, objectUrl]);

          toast.error(`Failed to upload ${file.name}: ${uploadError.message}`);
        }
      }
    } catch (error) {
      console.error("File upload error:", error);
      setError(error.message || 'Failed to upload files');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Fix persistence issues first
      fixPersistenceIssues();

      // Get token and parse it if it's a JSON string
      let rawToken = organizerToken || localStorage.getItem('organizer_token');
      const token = safelyParseToken(rawToken);

      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      // Handle possibly stringified organizer object
      let organizerId;
      if (typeof organizer === 'string') {
        try {
          const parsedOrganizer = JSON.parse(organizer);
          organizerId = parsedOrganizer?._id || parsedOrganizer?.id || parsedOrganizer?._doc?._id;
        } catch (e) {
          console.error("Failed to parse organizer data:", e);
        }
      } else if (organizer) {
        organizerId = organizer._id || organizer.id || organizer?._doc?._id;
      }

      if (!organizerId) {
        throw new Error('Unable to determine organizer ID. Please log in again.');
      }

      // Format data according to the Event model structure
      const eventDataToSubmit = {
        title: formData.title,
        tagline: formData.tagline || '',
        description: formData.description,
        category: formData.category,
        date: new Date(formData.startDate).toLocaleDateString(), // Format date as string
        startDate: formData.startDate,
        endDate: formData.endDate,
        duration: formData.duration || '',
        location: formData.location,
        capacity: parseInt(formData.capacity) || 0,
        isPaid: formData.isPaid,
        price: parseFloat(formData.price) || 0,
        currency: formData.currency,
        registrationDeadline: formData.registrationDeadline || null,
        images: formData.images,
        tags: formData.tags,
        featured: formData.featured || false,
        status: formData.isPublished ? 'active' : 'draft',
        organizer: organizerId,
        timeline: formData.timeline,
        prizes: formData.prizes,
        sponsors: formData.sponsors,
        faqs: formData.faqs
      };

      const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';

      let response;
      if (isEditMode) {
        console.log(`Updating event ${eventId} with data:`, eventDataToSubmit);
        response = await axios.put(
          `${apiUrl}/events/${eventId}`,
          eventDataToSubmit,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
      } else {
        console.log('Creating new event with data:', eventDataToSubmit);
        response = await axios.post(
          `${apiUrl}/events`,
          eventDataToSubmit,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
      }

      setSuccess(true);
      toast.success(isEditMode ? 'Event updated successfully!' : 'Event created successfully!');

      // Navigate to the events page after a short delay
      setTimeout(() => {
        navigate('/organizer/dashboard', {
          state: {
            activeTab: 'events',
            message: isEditMode ? 'Event updated successfully' : 'Event created successfully'
          }
        });
      }, 2000);
    } catch (error) {
      console.error("Event submission error:", error);

      let errorMessage = 'Failed to save event. Please try again.';

      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = 'Authentication failed. Please log in again.';
            localStorage.removeItem('organizer_token');
            setTimeout(() => navigate('/organizer/login'), 3000);
            break;

          case 403:
            errorMessage = 'You do not have permission to manage this event.';
            break;

          case 400:
            errorMessage = error.response.data?.message || 'Invalid event data provided.';
            break;

          default:
            errorMessage = error.response.data?.message || 'Server error. Please try again later.';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading && isEditMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white p-6">
        <div className="max-w-4xl mx-auto mt-12">
          <div className="flex items-center justify-center p-12">
            <motion.div
              className="h-12 w-12 rounded-full border-4 border-t-cyan-500 border-r-cyan-500 border-b-transparent border-l-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span className="ml-3 text-lg text-gray-300">Loading event data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto mt-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/organizer/dashboard')}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Dashboard
          </button>

          <h1 className="text-3xl font-bold mt-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {isEditMode ? 'Edit Event' : 'Create New Event'}
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-blue-600 mt-2 rounded-full"></div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 flex items-start"
          >
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto bg-red-800/50 hover:bg-red-800 rounded-full p-1"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-900/30 border border-green-500/50 text-green-200 p-4 rounded-xl mb-6 flex items-start"
          >
            <Check className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Success!</p>
              <p className="text-sm">{isEditMode ? 'Event updated successfully' : 'Event created successfully'}</p>
            </div>
          </motion.div>
        )}

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/30 rounded-2xl p-6"
        >
          {/* Basic Event Info Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Calendar className="mr-2 text-cyan-500" size={20} />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-full">
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="Give your event a descriptive name"
                />
              </div>

              <div className="col-span-full">
                <label htmlFor="tagline" className="block text-sm font-medium text-gray-300 mb-1">
                  Event Tagline
                </label>
                <input
                  type="text"
                  id="tagline"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="A catchy tagline for your event"
                />
              </div>

              <div className="col-span-full">
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                  Event Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full p-3 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="Describe your event, what attendees can expect, and why they should attend"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                >
                  <option value="">Select a category</option>
                  <option value="conference">Conference</option>
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                  <option value="webinar">Webinar</option>
                  <option value="hackathon">Hackathon</option>
                  <option value="meetup">Meetup</option>
                  <option value="networking">Networking</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags.join(', ')}
                    onChange={(e) => {
                      const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                      setFormData(prev => ({ ...prev, tags: tagsArray }));
                    }}
                    className="w-full p-3 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    placeholder="tech, innovation, etc."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Date & Time Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Clock className="mr-2 text-cyan-500" size={20} />
              Date & Time
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-1">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>

              <div>
                <label htmlFor="registrationDeadline" className="block text-sm font-medium text-gray-300 mb-1">
                  Registration Deadline
                </label>
                <input
                  type="date"
                  id="registrationDeadline"
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <MapPin className="mr-2 text-cyan-500" size={20} />
              Location
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-full">
                <label htmlFor="location.address" className="block text-sm font-medium text-gray-300 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="location.address"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="Street address"
                />
              </div>

              <div>
                <label htmlFor="location.city" className="block text-sm font-medium text-gray-300 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="location.city"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>

              <div>
                <label htmlFor="location.state" className="block text-sm font-medium text-gray-300 mb-1">
                  State/Province
                </label>
                <input
                  type="text"
                  id="location.state"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>

              <div>
                <label htmlFor="location.country" className="block text-sm font-medium text-gray-300 mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="location.country"
                  name="location.country"
                  value={formData.location.country}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>

              <div>
                <label htmlFor="location.zipCode" className="block text-sm font-medium text-gray-300 mb-1">
                  Zip/Postal Code
                </label>
                <input
                  type="text"
                  id="location.zipCode"
                  name="location.zipCode"
                  value={formData.location.zipCode}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>
            </div>
          </div>

          {/* Capacity and Pricing Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Users className="mr-2 text-cyan-500" size={20} />
              Capacity & Pricing
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-300 mb-1">
                  Capacity (0 for unlimited)
                </label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  min="0"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>

              <div className="flex items-center h-full">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPaid"
                    checked={formData.isPaid}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`relative w-10 h-5 rounded-full transition-colors ${formData.isPaid ? 'bg-cyan-500' : 'bg-gray-700'}`}>
                    <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${formData.isPaid ? 'transform translate-x-5' : ''}`}></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-300">This is a paid event</span>
                </label>
              </div>

              {formData.isPaid && (
                <>
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      required={formData.isPaid}
                      className="w-full p-3 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                  </div>

                  <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-300 mb-1">
                      Currency <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      required={formData.isPaid}
                      className="w-full p-3 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                      <option value="INR">INR - Indian Rupee</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Timeline Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Tag className="mr-2 text-cyan-500" size={20} />
              Timeline
            </h2>

            <div>
              {formData.timeline.map((item, index) => (
                <div key={index} className="mb-2">
                  <span className="text-gray-300">{item.time}</span> - <span className="text-gray-300">{item.event}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="time"
                value={newTimelineItem.time}
                onChange={handleTimelineChange}
                placeholder="Time"
                className="w-full p-3 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              <input
                type="text"
                name="event"
                value={newTimelineItem.event}
                onChange={handleTimelineChange}
                placeholder="Event"
                className="w-full p-3 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
            <button
              type="button"
              onClick={addTimelineItem}
              className="mt-4 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-medium rounded-xl transition-colors"
            >
              Add Timeline Item
            </button>
          </div>

          {/* Prizes Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Tag className="mr-2 text-cyan-500" size={20} />
              Prizes
            </h2>

            <div>
              {formData.prizes.map((prize, index) => (
                <div key={index} className="mb-2">
                  <span className="text-gray-300">{prize.place}</span>: <span className="text-gray-300">{prize.amount}</span> - <span className="text-gray-300">{prize.description}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="place"
                value={newPrize.place}
                onChange={handlePrizeChange}
                placeholder="Place"
                className="w-full p-3 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              <input
                type="text"
                name="amount"
                value={newPrize.amount}
                onChange={handlePrizeChange}
                placeholder="Amount"
                className="w-full p-3 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              <input
                type="text"
                name="description"
                value={newPrize.description}
                onChange={handlePrizeChange}
                placeholder="Description"
                className="w-full p-3 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
            <button
              type="button"
              onClick={addPrize}
              className="mt-4 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-medium rounded-xl transition-colors"
            >
              Add Prize
            </button>
          </div>

          {/* Sponsors Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Tag className="mr-2 text-cyan-500" size={20} />
              Sponsors
            </h2>

            <div>
              {formData.sponsors.map((sponsor, index) => (
                <div key={index} className="mb-2">
                  <span className="text-gray-300">{sponsor.name}</span> - <span className="text-gray-300">{sponsor.tier}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="name"
                value={newSponsor.name}
                onChange={handleSponsorChange}
                placeholder="Name"
                className="w-full p-3 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              <select
                name="tier"
                value={newSponsor.tier}
                onChange={handleSponsorChange}
                className="w-full p-3 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              >
                <option value="platinum">Platinum</option>
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="bronze">Bronze</option>
                <option value="other">Other</option>
              </select>
              <input
                type="text"
                name="logo"
                value={newSponsor.logo}
                onChange={handleSponsorChange}
                placeholder="Logo URL"
                className="w-full p-3 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
            <button
              type="button"
              onClick={addSponsor}
              className="mt-4 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-medium rounded-xl transition-colors"
            >
              Add Sponsor
            </button>
          </div>

          {/* FAQs Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Tag className="mr-2 text-cyan-500" size={20} />
              FAQs
            </h2>

            <div>
              {formData.faqs.map((faq, index) => (
                <div key={index} className="mb-2">
                  <span className="text-gray-300">{faq.question}</span> - <span className="text-gray-300">{faq.answer}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="question"
                value={newFaq.question}
                onChange={handleFaqChange}
                placeholder="Question"
                className="w-full p-3 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              <input
                type="text"
                name="answer"
                value={newFaq.answer}
                onChange={handleFaqChange}
                placeholder="Answer"
                className="w-full p-3 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
            <button
              type="button"
              onClick={addFaq}
              className="mt-4 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-medium rounded-xl transition-colors"
            >
              Add FAQ
            </button>
          </div>

          {/* Images Upload Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Image className="mr-2 text-cyan-500" size={20} />
              Event Images
            </h2>

            <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
              <div className="flex flex-col items-center justify-center">
                <Upload className="h-12 w-12 text-cyan-500 mb-4" />
                <p className="text-gray-300 mb-4">Drag & drop images here or click to browse</p>
                <input
                  type="file"
                  id="eventImages"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                <label
                  htmlFor="eventImages"
                  className={`
                    px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-medium rounded-lg cursor-pointer
                    flex items-center transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading... {uploadProgress}%
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 mr-2" />
                      Choose Images
                    </>
                  )}
                </label>
                <p className="text-gray-500 text-sm mt-3">
                  Supported formats: JPG, PNG, GIF. Max size: 5MB per file.
                </p>
              </div>
            </div>

            {/* Image Preview Grid */}
            {previewImages.length > 0 && (
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-300 mb-3">Selected Images</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {previewImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-800 border border-gray-700">
                        <img
                          src={image}
                          alt={`Event preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                      {index === 0 && (
                        <span className="absolute top-2 left-2 bg-cyan-500 text-black text-xs px-2 py-1 rounded-md">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Publication Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Tag className="mr-2 text-cyan-500" size={20} />
              Publication Status
            </h2>

            <div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`relative w-10 h-5 rounded-full transition-colors ${formData.isPublished ? 'bg-cyan-500' : 'bg-gray-700'}`}>
                  <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${formData.isPublished ? 'transform translate-x-5' : ''}`}></div>
                </div>
                <span className="ml-2 text-sm text-gray-300">
                  {formData.isPublished ? 'Published - Event is visible to the public' : 'Draft - Only visible to you'}
                </span>
              </label>
            </div>
          </div>

          {/* Form Buttons */}
          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={() => navigate('/organizer/dashboard')}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-medium rounded-xl flex items-center transition-colors ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {submitting ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-t-transparent border-black rounded-full mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  {isEditMode ? 'Update Event' : 'Create Event'}
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default CreateEditEvent;
