/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
    // navigate(`/event/${eventId}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare the form data - ensure arrays are proper arrays and not strings
    const formattedData = {
      ...formData,
      // Make sure these are actual arrays/objects, not stringified versions
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

    // Pass the properly formatted data to the parent component
    onSubmit(formattedData).then((eventId) => {
      handleFormSuccess(eventId);
    });
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
            >
              Previous
            </button>

            {currentStep < formSteps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 rounded-xl bg-gradient-to-r bg-cyan-400 text-black font-medium transition-colors cursor-pointer flex items-center space-x-2 hover:bg-black hover:text-cyan-400 hover:border hover:border-cyan-400"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 rounded-xl bg-gradient-to-r bg-cyan-400 text-black font-medium transition-colors cursor-pointer flex items-center space-x-2 hover:bg-black hover:text-cyan-400 hover:border hover:border-cyan-400"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
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
