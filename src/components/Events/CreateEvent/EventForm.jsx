/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import EventBasicInfo from './EventBasicInfo';
import EventDateTime from './EventDateTime';
import EventLocation from './EventLocation';
import EventCapacityPricing from './EventCapacityPricing';
import EventImagesUpload from './EventImagesUpload';
import EventTimeline from './EventTimeline';
import EventPrizes from './EventPrizes';
import EventSponsors from './EventSponsors';
import EventFAQs from './EventFAQs';

const EventForm = ({ onSubmit, submitting: initialSubmitting }) => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(initialSubmitting || false);

  // Add error state
  const [submitError, setSubmitError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    tagline: '', // Added tagline field to match schema
    description: '',
    category: '',
    date: '', // Keep for UI, but will format as needed for API
    startDate: '',
    endDate: '',
    duration: '', // Added duration field
    location: {
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      coordinates: {
        lat: null,
        lng: null,
      },
    },
    capacity: 0,
    isPaid: false,
    price: 0,
    currency: 'USD',
    registrationDeadline: '',
    images: [],
    tags: [],
    isPublished: false,
    timeline: [],
    prizes: [],
    sponsors: [],
    faqs: [],
    featured: false, // Added featured field
    socialShare: {
      likes: 0,
      comments: 0,
      shares: 0
    },
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]);

  // Update form data when child components change values
  const updateFormData = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  // Form validation for current step
  const validateStep = (step) => {
    let stepErrors = {};
    let isValid = true;

    switch (step) {
      case 1: // Basic Info
        if (!formData.title.trim()) {
          stepErrors.title = 'Title is required';
          isValid = false;
        }
        if (!formData.description.trim()) {
          stepErrors.description = 'Description is required';
          isValid = false;
        }
        if (!formData.category) {
          stepErrors.category = 'Category is required';
          isValid = false;
        }
        break;

      case 2: // Date & Time
        if (!formData.startDate) {
          stepErrors.startDate = 'Start date is required';
          isValid = false;
        }
        if (!formData.endDate) {
          stepErrors.endDate = 'End date is required';
          isValid = false;
        }
        break;

      case 3: // Location
        if (!formData.location.address.trim()) {
          stepErrors.address = 'Address is required';
          isValid = false;
        }
        if (!formData.location.city.trim()) {
          stepErrors.city = 'City is required';
          isValid = false;
        }
        if (!formData.location.country.trim()) {
          stepErrors.country = 'Country is required';
          isValid = false;
        }
        break;

      // Case 4 and beyond don't have required fields
      default:
        break;
    }

    setErrors(stepErrors);
    return isValid;
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 9) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormSuccess = (eventId) => {
    // Redirect to the new event detail page
    navigate(`/event/${eventId}`);
  };

  // Updated handleSubmit with better error handling and retry support
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any previous errors
    setSubmitError(null);

    // Prepare the form data
    const formattedData = {
      ...formData,
      timeline: Array.isArray(formData.timeline) ? formData.timeline : [],
      prizes: Array.isArray(formData.prizes) ? formData.prizes : [],
      sponsors: Array.isArray(formData.sponsors) ? formData.sponsors : [],
      faqs: Array.isArray(formData.faqs) ? formData.faqs : [],
      socialShare: {
        likes: 0,
        comments: 0,
        shares: 0
      }
    };

    setSubmitting(true);

    try {
      // Pass the properly formatted data to the parent component
      const eventId = await onSubmit(formattedData);
      handleFormSuccess(eventId);
      // Successful submission will be handled by the parent component
    } catch (error) {
      console.error("Event creation failed:", error);

      // Set error state with details
      setSubmitError({
        message: error.response?.data?.message || error.message || "Failed to create event",
        details: error.response?.data?.details || "Please check your form data and try again",
        status: error.response?.status,
        error: error
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Function to retry submission after an error
  const handleRetry = () => {
    setSubmitError(null);
    handleSubmit(new Event('submit')); // Create synthetic event object
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 0) {
      // Create preview URLs for displaying images
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));

      // Update preview URLs
      setImagePreviews(prev => [...prev, ...newPreviewUrls]);

      // Store the actual File objects in formData
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...files]
      }));
    }
  };

  const formSteps = [
    { step: 1, component: <EventBasicInfo formData={formData} updateFormData={updateFormData} errors={errors} /> },
    { step: 2, component: <EventDateTime formData={formData} updateFormData={updateFormData} errors={errors} /> },
    { step: 3, component: <EventLocation formData={formData} updateFormData={updateFormData} errors={errors} /> },
    { step: 4, component: <EventCapacityPricing formData={formData} updateFormData={updateFormData} errors={errors} /> },
    { step: 5, component: <EventTimeline formData={formData} updateFormData={updateFormData} errors={errors} /> },
    { step: 6, component: <EventPrizes formData={formData} updateFormData={updateFormData} errors={errors} /> },
    { step: 7, component: <EventSponsors formData={formData} updateFormData={updateFormData} errors={errors} /> },
    { step: 8, component: <EventFAQs formData={formData} updateFormData={updateFormData} errors={errors} /> },
    { step: 9, component: <EventImagesUpload formData={formData} updateFormData={updateFormData} errors={errors} handleImagesChange={handleImagesChange} imagePreviews={imagePreviews} /> }
  ];

  // Progress percentage
  const progress = (currentStep / formSteps.length) * 100;

  // Error display component
  const ErrorDisplay = ({ error, onRetry }) => (
    <div className="bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl p-6 mb-6">
      <div className="flex items-start">
        <AlertCircle className="w-6 h-6 mr-3 mt-1" />
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-2">Failed to Create Event</h3>
          <p className="mb-2">{error.message}</p>
          {error.details && (
            <p className="text-sm opacity-80 mb-4">{error.details}</p>
          )}

          <div className="flex space-x-4 mt-4">
            <button
              type="button"
              onClick={onRetry}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retry Submission
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(1)} // Go back to first step
              className="px-4 py-2 bg-gray-800/50 hover:bg-gray-800 text-white rounded-lg transition-colors"
            >
              Edit Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          ></motion.div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <div className={currentStep >= 1 ? "text-cyan-500" : ""}>Basic Info</div>
          <div className={currentStep >= 2 ? "text-cyan-500" : ""}>Date & Time</div>
          <div className={currentStep >= 3 ? "text-cyan-500" : ""}>Location</div>
          <div className={currentStep >= 4 ? "text-cyan-500" : ""}>Capacity & Pricing</div>
          <div className={currentStep >= 5 ? "text-cyan-500" : ""}>Timeline</div>
          <div className={currentStep >= 6 ? "text-cyan-500" : ""}>Prizes</div>
          <div className={currentStep >= 7 ? "text-cyan-500" : ""}>Sponsors</div>
          <div className={currentStep >= 8 ? "text-cyan-500" : ""}>FAQs</div>
          <div className={currentStep >= 9 ? "text-cyan-500" : ""}>Images</div>
        </div>
      </div>

      {/* Display error message if submission failed */}
      {submitError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ErrorDisplay error={submitError} onRetry={handleRetry} />
        </motion.div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Form content - show only current step */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 md:p-8"
        >
          {formSteps.find(step => step.step === currentStep)?.component}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              className={`px-6 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors ${currentStep === 1 ? 'invisible' : ''
                }`}
              disabled={submitting}
            >
              Previous
            </button>

            {currentStep < formSteps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 rounded-xl bg-gradient-to-r bg-cyan-400 text-black font-medium transition-colors cursor-pointer flex items-center space-x-2 hover:bg-black hover:text-cyan-400 hover:border hover:border-cyan-400"
                disabled={submitting}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 rounded-xl bg-gradient-to-r bg-cyan-400 text-black font-medium transition-colors cursor-pointer flex items-center space-x-2 hover:bg-black hover:text-cyan-400 hover:border hover:border-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Event</span>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </form>
    </div>
  );
};

export default EventForm;
