/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import axios from 'axios';
import updateProfileCompletionStatus  from '../../redux/user/organizer';
import checkOrganizerProfileCompletion  from '../../redux/user/organizer';
import { safelyParseToken } from '../../utils/persistFix';
import { toast } from 'react-toastify';

const OrganizerDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token, profileDetails, profileComplete } = useSelector((state) => state.organizer);
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    bio: '',
    phone: '',
    website: '',
    location: '',
    socialLinks: {
      twitter: '',
      facebook: '',
      instagram: '',
      linkedin: ''
    },
    tags: []
  });

  // Debug logging for initial state
  useEffect(() => {
    console.log("OrganizerDetails - Initial Redux State:", {
      profileComplete,
      hasProfileDetails: !!profileDetails,
      userId: user?._id || (typeof user === 'string' ? 'string-user' : 'no-id')
    });
  }, []);
  
  // Get organizer ID
  const getOrganizerId = () => {
    if (!user) return null;
    
    if (typeof user === 'string') {
      try {
        const parsed = JSON.parse(user);
        return parsed?._id || parsed?.id || parsed?._doc?._id;
      } catch (e) {
        console.error('Error parsing organizer data:', e);
        return null;
      }
    }
    
    return user?._id || user?.id || user?._doc?._id;
  };
  
  const organizerId = getOrganizerId();
  
  // Load existing profile details on component mount
  useEffect(() => {
    const fetchProfileDetails = async () => {
      if (!token || !organizerId) return;
      
      setLoading(true);
      try {
        // Check if we already have profile details in Redux store
        if (profileDetails) {
          setFormData({
            title: profileDetails.title || '',
            bio: profileDetails.bio || '',
            phone: profileDetails.phone || '',
            website: profileDetails.website || '',
            location: profileDetails.location || '',
            socialLinks: profileDetails.socialLinks || {
              twitter: '',
              facebook: '',
              instagram: '',
              linkedin: ''
            },
            tags: profileDetails.tags || []
          });
          setLoading(false);
          return;
        }
        
        // Force a check for profile details
        await dispatch(checkOrganizerProfileCompletion());
      } catch (error) {
        console.error('Error fetching profile details:', error);
        toast.error('Failed to load your profile details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileDetails();
  }, [dispatch, token, organizerId, profileDetails]);
  
  // Update form when profileDetails change in Redux store
  useEffect(() => {
    if (profileDetails) {
      console.log("Setting form data from profileDetails:", profileDetails);
      setFormData({
        title: profileDetails.title || '',
        bio: profileDetails.bio || '',
        phone: profileDetails.phone || '',
        website: profileDetails.website || '',
        location: profileDetails.location || '',
        socialLinks: profileDetails.socialLinks || {
          twitter: '',
          facebook: '',
          instagram: '',
          linkedin: ''
        },
        tags: Array.isArray(profileDetails.tags) ? profileDetails.tags : []
      });
    }
  }, [profileDetails]);

  // Navigate if profile is already complete and this isn't a fresh login
  useEffect(() => {
    // Only redirect if profile is complete and we're not in the initial loading state
    if (profileComplete && !loading && profileDetails) {
      // Add a timestamp to localStorage to prevent infinite loop
      const lastCheck = localStorage.getItem('organizer_details_last_shown');
      const now = new Date().getTime();
      
      if (lastCheck && (now - parseInt(lastCheck) < 300000)) { // 5 minutes threshold
        console.log("Profile already complete, redirecting to dashboard");
        navigate('/organizer/dashboard');
      } else {
        // Update the timestamp
        localStorage.setItem('organizer_details_last_shown', now.toString());
      }
    }
  }, [profileComplete, loading, profileDetails, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parentKey, childKey] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [childKey]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleTagsChange = (e) => {
    const tagsString = e.target.value;
    // Improved tag handling - properly split by commas and handle whitespace
    const tagsArray = tagsString.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
      
    setFormData(prev => ({ ...prev, tags: tagsArray }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (!organizerId || !token) {
        throw new Error('Authentication required');
      }
      
      // Use API URL from environment variable or default
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
      
      // Safely parse the token if needed
      const parsedToken = safelyParseToken(token);

      // Validate required fields
      if (!formData.title.trim() || !formData.bio.trim() || !formData.location.trim()) {
        toast.error('Title, bio, and location are required');
        setSubmitting(false);
        return;
      }
      
      // Check if we're updating or creating
      const method = profileDetails ? 'put' : 'post';
      
      console.log("Submitting organizer details:", {
        method,
        url: `${apiUrl}/organizer/${organizerId}/details`,
        data: formData
      });
      
      const response = await axios({
        method,
        url: `${apiUrl}/organizer/${organizerId}/details`,
        data: formData,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${parsedToken}`
        }
      });
      
      console.log('Profile data saved:', response.data);
      toast.success('Profile details saved successfully');
      
      // Set profile completion flag in localStorage to prevent redirect loops
      localStorage.setItem('organizer_profile_complete', 'true');
      localStorage.setItem('organizer_details_last_shown', new Date().getTime().toString());
      
      // Force a profile completion check to update Redux state
      await dispatch(updateProfileCompletionStatus(true));
      
      // Wait a moment to ensure state updates, then redirect
      setTimeout(() => {
        navigate('/organizer/dashboard');
      }, 1000);
      
    } catch (error) {
      console.error('Error saving profile details:', error);
      toast.error(error.response?.data?.message || 'Failed to save profile details');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <div className="w-12 h-12 border-4 border-t-cyan-500 border-cyan-500/30 rounded-full animate-spin"></div>
        <span className="ml-3">Loading your profile...</span>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2 text-center">Complete Your Organizer Profile</h1>
          <p className="text-gray-400 text-center mb-8">
            Fill in the details below so event attendees can learn more about you and your events.
          </p>
        </motion.div>
        
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          onSubmit={handleSubmit}
          className="bg-gray-900 rounded-lg p-6 border border-gray-800"
        >
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Organization/Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              placeholder="Your organization name"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bio/Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              required
              rows={4}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              placeholder="Tell attendees about your organization"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                placeholder="Your contact number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              placeholder="City, Country"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags/Categories (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags.join(', ')}
              onChange={handleTagsChange}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              placeholder="tech, conference, workshop"
            />
            {formData.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-700 text-sm px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Social Media Links
            </label>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Twitter</label>
                <input
                  type="url"
                  name="socialLinks.twitter"
                  value={formData.socialLinks.twitter}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  placeholder="https://twitter.com/username"
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1">LinkedIn</label>
                <input
                  type="url"
                  name="socialLinks.linkedin"
                  value={formData.socialLinks.linkedin}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black font-medium rounded-lg transition-colors flex items-center
                ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save & Continue'
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default OrganizerDetails;
