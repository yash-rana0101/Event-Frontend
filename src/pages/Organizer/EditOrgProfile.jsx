/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  Calendar, Mail, MapPin, Phone, Award, Users, Star, ArrowRight,
  Clock, ExternalLink, Globe, Zap, Twitter, Linkedin, Instagram,
  Facebook, AlertTriangle, User, Building, Save, Trash2, Plus, X, Edit3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { safelyParseToken } from '../../utils/persistFix';
import { toast } from 'react-toastify';
import { useLoader } from '../../context/LoaderContext';
import Error from '../common/Error';

// Helper function to determine social media icon
const getSocialIcon = (socialUrl) => {
  const url = socialUrl.toLowerCase();
  
  if (url.includes('twitter') || url.includes('x.com')) {
    return <Twitter size={16} className="text-gray-400" />;
  } else if (url.includes('facebook')) {
    return <Facebook size={16} className="text-gray-400" />;
  } else if (url.includes('instagram')) {
    return <Instagram size={16} className="text-gray-400" />;
  } else if (url.includes('linkedin')) {
    return <Linkedin size={16} className="text-gray-400" />;
  } else {
    return <Globe size={16} className="text-gray-400" />;
  }
};

const EditOrgProfile = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('about');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [changesMade, setChangesMade] = useState(false);
  const [showConfirmExit, setShowConfirmExit] = useState(false);

  // Original profile data (for reset purposes)
  const [originalProfile, setOriginalProfile] = useState(null);

  // Editable profile state
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    title: 'Event Organizer',
    company: '',
    bio: '',
    location: '',
    phone: '',
    expertise: [],
    certifications: [],
    socials: [],
    testimonials: [],
    stats: {
      eventsHosted: 0,
      totalAttendees: "0",
      clientSatisfaction: "N/A",
      awards: 0
    }
  });

  // UI states
  const [newExpertise, setNewExpertise] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [newSocial, setNewSocial] = useState('');
  const [expandedTestimonial, setExpandedTestimonial] = useState(null);
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    position: '',
    comment: '',
    rating: 5
  });
  const [showAddTestimonial, setShowAddTestimonial] = useState(false);

  // Error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get organizer from Redux store
  const organizerData = useSelector(state => state.organizer);
  const loggedInUser = organizerData?.user;

  // Extract user ID from possibly nested JSON structure - improved function
  const getUserId = () => {
    if (!loggedInUser) return null;

    // If it's already a simple string ID, return it
    if (typeof loggedInUser === 'string' && /^[0-9a-fA-F]{24}$/.test(loggedInUser)) {
      return loggedInUser;
    }

    // If it's a string but not an ID (might be serialized JSON)
    if (typeof loggedInUser === 'string') {
      try {
        const parsed = JSON.parse(loggedInUser);

        // Check various possible locations of the ID
        if (typeof parsed === 'string' && /^[0-9a-fA-F]{24}$/.test(parsed)) {
          return parsed;
        }

        if (parsed?._id && typeof parsed._id === 'string') {
          return parsed._id;
        }

        if (parsed?.id && typeof parsed.id === 'string') {
          return parsed.id;
        }

        if (parsed?._doc?._id && typeof parsed._doc._id === 'string') {
          return parsed._doc._id;
        }

        // If no string ID found, return null
        return null;
      } catch (e) {
        console.error('Error parsing organizer data:', e);
        return null;
      }
    }

    // If it's an object, try to extract ID directly
    if (loggedInUser?._id && typeof loggedInUser._id === 'string') {
      return loggedInUser._id;
    }

    if (loggedInUser?.id && typeof loggedInUser.id === 'string') {
      return loggedInUser.id;
    }

    if (loggedInUser?._doc?._id && typeof loggedInUser._doc._id === 'string') {
      return loggedInUser._doc._id;
    }

    return null;
  };

  const loggedInUserId = getUserId();
  const { setIsLoading } = useLoader();

  // Show loader when API calls are in progress
  useEffect(() => {
    setIsLoading(loading);
    return () => setIsLoading(false);
  }, [loading, setIsLoading]);

  // Fetch profile data
  useEffect(() => {
    const fetchOrganizerProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!loggedInUserId) {
          setError("You must be logged in to edit your profile");
          setLoading(false);
          return;
        }

        // Get API URL from environment or use fallback
        const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';

        const token = organizerData?.token || localStorage.getItem('organizer_token');
        const cleanToken = safelyParseToken(token);

        if (!cleanToken) {
          setError("Authentication failed. Please log in again.");
          setLoading(false);
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${cleanToken}` }
        };

        // First try to get detailed profile if available - use string ID
        try {
          const response = await axios.get(`${apiUrl}/organizer/${loggedInUserId}/details`, config);

          if (response.data) {
            // If basic user info is not included in details, fetch it separately
            if (!response.data.name || !response.data.email) {
              const basicResponse = await axios.get(`${apiUrl}/organizer/profile/${loggedInUserId}`, config);
              const mergedData = {
                ...basicResponse.data,
                ...response.data
              };
              setOriginalProfile(mergedData);
              setProfile(mergedData);
            } else {
              setOriginalProfile(response.data);
              setProfile(response.data);
            }
          }
        } catch (detailsErr) {
          console.error("Error fetching organizer details:", detailsErr);
          // If detailed profile not found, fall back to basic profile
          const basicResponse = await axios.get(`${apiUrl}/organizer/profile/${loggedInUserId}`, config);
          setOriginalProfile(basicResponse.data);
          setProfile(basicResponse.data);
        }

        setIsLoaded(true);
        setLoading(false);
      } catch (err) {
        console.error("Error in fetchOrganizerProfile:", err);
        setError("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizerProfile();
  }, [loggedInUserId]);

  // Handle profile updates
  const updateProfile = async () => {
    setIsSaving(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';
      const token = organizerData?.token || localStorage.getItem('organizer_token');
      const cleanToken = safelyParseToken(token);

      if (!cleanToken) {
        toast.error("Authentication token is missing. Please log in again.");
        setIsSaving(false);
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${cleanToken}` }
      };

      // Send update request
      await axios.put(`${apiUrl}/organizer/${loggedInUserId}/details`, profile, config);

      toast.success("Profile updated successfully!");
      setChangesMade(false);
      navigate('/organizer/profile');
      // Update original profile reference
      setOriginalProfile({ ...profile });
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error(`Failed to update profile: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle input changes for basic fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }

    setChangesMade(true);
  };

  // Handle array item addition
  const handleAddItem = (field, value) => {
    if (!value.trim()) return;

    setProfile(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), value.trim()]
    }));

    setChangesMade(true);
  };

  // Handle array item removal
  const handleRemoveItem = (field, index) => {
    setProfile(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));

    setChangesMade(true);
  };

  // Handle testimonial actions
  const handleAddTestimonial = () => {
    if (!newTestimonial.name || !newTestimonial.comment) {
      toast.warning("Name and comment are required for testimonials");
      return;
    }

    setProfile(prev => ({
      ...prev,
      testimonials: [...(prev.testimonials || []), { ...newTestimonial }]
    }));

    setNewTestimonial({ name: '', position: '', comment: '', rating: 5 });
    setShowAddTestimonial(false);
    setChangesMade(true);
  };

  const handleUpdateTestimonial = (index, field, value) => {
    setProfile(prev => ({
      ...prev,
      testimonials: prev.testimonials.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));

    setChangesMade(true);
  };

  const handleRemoveTestimonial = (index) => {
    setProfile(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter((_, i) => i !== index)
    }));

    setChangesMade(true);
  };

  // Handle cancel/reset
  const handleCancel = () => {
    if (changesMade) {
      setShowConfirmExit(true);
    } else {
      navigate('/organizer/profile');
    }
  };

  const handleResetChanges = () => {
    setProfile({ ...originalProfile });
    setChangesMade(false);
    toast.info("Changes discarded");
  };

  // Handle confirm dialog actions
  const confirmExit = () => {
    setShowConfirmExit(false);
    navigate('/organizer/profile');
  };

  const cancelExit = () => {
    setShowConfirmExit(false);
  };

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

  if (!profile) {
    return <Error />;
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-cyan-500 opacity-5 rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-cyan-500 opacity-5 rounded-full filter blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Navigation Sidebar */}
        <div className={`fixed top-0 left-0 h-screen w-12 md:w-14 border-r border-gray-800 flex flex-col items-center py-8 transition-all duration-500 transform ${isLoaded ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center mb-12">
            <span className="text-black font-bold text-lg">{profile.name ? profile.name[0] : 'U'}</span>
          </div>

          <nav className="flex flex-col items-center space-y-8">
            {[
              { id: 'about', icon: <Users className={`w-6 h-6 ${activeSection === 'about' ? 'text-cyan-500' : 'text-gray-500'}`} /> },
              { id: 'expertise', icon: <Zap className={`w-6 h-6 ${activeSection === 'expertise' ? 'text-cyan-500' : 'text-gray-500'}`} /> },
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
          {/* Header with action buttons */}
          <div className={`mb-10 transition-all duration-700 ease-out transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
              <div className="flex items-center">
                <div className="mr-3 p-2 bg-cyan-500/10 rounded-lg">
                  <Edit3 className="w-6 h-6 text-cyan-500" />
                </div>
                <h1 className="text-3xl font-bold">Edit Your Profile</h1>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors flex items-center cursor-pointer hover:text-cyan-500"
                  disabled={isSaving}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>

                {changesMade && (
                  <button
                    onClick={handleResetChanges}
                    className="px-4 py-2 border border-amber-700 rounded-lg text-amber-300 hover:bg-amber-900/30 transition-colors flex items-center cursor-pointer"
                    disabled={isSaving}
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Reset
                  </button>
                )}

                <motion.button
                  onClick={updateProfile}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r bg-cyan-400 text-black font-medium transition-colors cursor-pointer flex items-center space-x-2 hover:bg-black hover:text-cyan-400 hover:border hover:border-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSaving || !changesMade}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSaving ? (
                    <motion.div
                      className="w-4 h-4 border-2 border-t-transparent border-black rounded-full mr-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </motion.button>
              </div>
            </div>

            <div className="h-1 w-full bg-gray-900 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300"
                initial={{ width: "0%" }}
                animate={{ width: changesMade ? "100%" : "0%" }}
                transition={{ duration: 0.5 }}
              />
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
                <h2 className="text-2xl font-bold">Basic Information</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Basic Info */}
                <div className="lg:col-span-2 bg-gray-900 rounded-2xl p-6 border-b-2 border-cyan-500">
                  <h3 className="text-xl mb-6">Personal Details</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                    <div>
                      <label className="block text-sm text-cyan-500 mb-2">Job Title</label>
                      <input
                        type="text"
                        name="title"
                        value={profile.title || ''}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                        placeholder="Event Organizer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-cyan-500 mb-2">Company/Organization</label>
                      <input
                        type="text"
                        name="company"
                        value={profile.company || ''}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                        placeholder="Your organization"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-cyan-500 mb-2">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={profile.location || ''}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                        placeholder="City, Country"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-cyan-500 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={profile.phone || ''}
                        onChange={handleInputChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                        placeholder="Your contact number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-cyan-500 mb-2">Bio</label>
                    <textarea
                      name="bio"
                      value={profile.bio || ''}
                      onChange={handleInputChange}
                      rows={12}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                      placeholder="Tell others about yourself and your experience..."
                    />
                  </div>
                </div>

                {/* Stats and Certifications */}
                <div className="bg-gray-900 rounded-2xl p-6 border-t-2 border-cyan-500">
                  <h3 className="text-xl mb-6">Statistics & Certifications</h3>

                  {/* Stats */}
                  <div className="mb-8">
                    <h4 className="text-cyan-500 text-sm uppercase mb-3">Your Stats</h4>

                    <div className="space-y-4">
                      {Object.entries(profile.stats || {}).map(([key, value]) => (
                        <div key={key} className="flex flex-col">
                          <label className="text-sm text-gray-400 capitalize mb-1">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <input
                            type={key.toLowerCase().includes('satisfaction') ? 'text' : 'number'}
                            name={`stats.${key}`}
                            value={value}
                            onChange={handleInputChange}
                            min={0}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div>
                    <h4 className="text-cyan-500 text-sm uppercase mb-3">Certifications</h4>

                    <div className="space-y-2 mb-4">
                      {(profile.certifications || []).map((cert, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-800 rounded-lg p-2 group">
                          <div className="flex items-center">
                            <Award className="w-4 h-4 text-gray-500 mr-2" />
                            <span className="text-gray-300">{cert}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveItem('certifications', index)}
                            className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex">
                      <input
                        type="text"
                        value={newCertification}
                        onChange={(e) => setNewCertification(e.target.value)}
                        className="flex-grow bg-gray-800 border border-gray-700 rounded-l-lg p-2 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                        placeholder="Add certification..."
                      />
                      <button
                        onClick={() => {
                          handleAddItem('certifications', newCertification);
                          setNewCertification('');
                        }}
                        disabled={!newCertification.trim()}
                        className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-700 disabled:text-gray-500 text-black px-3 rounded-r-lg transition-colors"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Section */}
              <div className="mt-8 bg-gray-900 rounded-2xl p-6">
                <h3 className="text-xl mb-6">Social Media Links</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {(profile.socials || []).map((social, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-800 rounded-lg p-3 group hover:bg-gray-800/80 transition-colors">
                      <div className="flex items-center overflow-hidden">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                          {getSocialIcon(social)}
                        </div>
                        <span className="text-gray-300 truncate">{social}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveItem('socials', index)}
                        className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200 ml-2 flex-shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex">
                  <input
                    type="text"
                    value={newSocial}
                    onChange={(e) => setNewSocial(e.target.value)}
                    className="flex-grow bg-gray-800 border border-gray-700 rounded-l-lg p-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                    placeholder="https://twitter.com/yourusername"
                  />
                  <button
                    onClick={() => {
                      handleAddItem('socials', newSocial);
                      setNewSocial('');
                    }}
                    disabled={!newSocial.trim()}
                    className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-700 disabled:text-gray-500 text-black px-4 rounded-r-lg transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </section>

            {/* Expertise Section */}
            <section
              className={`transition-all duration-700 transform ${activeSection === 'expertise' ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0 absolute pointer-events-none'}`}
              style={{ display: activeSection === 'expertise' ? 'block' : 'none' }}
            >
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center mr-3">
                  <Zap className="w-4 h-4 text-black" />
                </div>
                <h2 className="text-2xl font-bold">Expertise & Skills</h2>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6">
                <h3 className="text-xl mb-6">Your Expertise</h3>

                <motion.div
                  className="flex flex-wrap gap-3 mb-6"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.05
                      }
                    }
                  }}
                  initial="hidden"
                  animate="show"
                >
                  {(profile.expertise || []).map((skill, index) => (
                    <motion.div
                      key={index}
                      variants={{
                        hidden: { scale: 0.8, opacity: 0 },
                        show: { scale: 1, opacity: 1 }
                      }}
                      className="group relative"
                    >
                      <div className="px-4 py-2 bg-gray-800 border border-cyan-500/30 rounded-full text-gray-300 flex items-center justify-between gap-2">
                        <span>{skill}</span>
                        <button
                          onClick={() => handleRemoveItem('expertise', index)}
                          className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                <div className="flex">
                  <input
                    type="text"
                    value={newExpertise}
                    onChange={(e) => setNewExpertise(e.target.value)}
                    className="flex-grow bg-gray-800 border border-gray-700 rounded-l-lg p-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                    placeholder="Add your expertise..."
                  />
                  <button
                    onClick={() => {
                      handleAddItem('expertise', newExpertise);
                      setNewExpertise('');
                    }}
                    disabled={!newExpertise.trim()}
                    className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-700 disabled:text-gray-500 text-black px-4 rounded-r-lg transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
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
                <h2 className="text-2xl font-bold">Testimonials</h2>
              </div>

              <div className="bg-gray-900 rounded-2xl p-6">
                <h3 className="text-xl mb-6">Client Testimonials</h3>

                <motion.div
                  className="space-y-4 mb-6"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.05
                      }
                    }
                  }}
                  initial="hidden"
                  animate="show"
                >
                  {(profile.testimonials || []).map((testimonial, index) => (
                    <motion.div
                      key={index}
                      variants={{
                        hidden: { scale: 0.8, opacity: 0 },
                        show: { scale: 1, opacity: 1 }
                      }}
                      className={`relative bg-gray-800 border border-cyan-500/30 rounded-lg p-4 ${expandedTestimonial === index ? 'max-h-screen overflow-auto' : 'max-h-[200px] overflow-hidden'}`}
                    >
                      <div className="flex items-start mb-4">
                        <User className="w-10 h-10 text-cyan-500 mr-3" />
                        <div>
                          <h4 className="text-lg font-semibold">{testimonial.name}</h4>
                          {testimonial.position && (
                            <p className="text-sm text-gray-400">{testimonial.position}</p>
                          )}
                        </div>
                      </div>

                      <p>{testimonial.comment}</p>

                      <button
                        onClick={() => setExpandedTestimonial(expandedTestimonial === index ? null : index)}
                        className={`absolute top-2 right-2 text-gray-400 hover:text-cyan-500 transition-colors ${expandedTestimonial === index ? 'rotate-180' : ''}`}
                      >
                        <ArrowRight size={16} />
                      </button>

                      {expandedTestimonial === index && (
                        <div className="flex
                          items-center justify-between mt-4 text-gray-400">
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span>{testimonial.rating}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveTestimonial(index)}
                            className="text-gray-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
                <div className="flex mb-6">
                  <input
                    type="text"
                    value={newTestimonial.name}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                    className="flex-grow bg-gray-800 border border-gray-700 rounded-l-lg p-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                    placeholder="Client's name"
                  />
                  <button
                    onClick={() => {
                      handleAddTestimonial();
                      setNewTestimonial({ name: '', position: '', comment: '', rating: 5 });
                    }}
                    disabled={!newTestimonial.name.trim() || !newTestimonial.comment.trim()}
                    className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-700 disabled:text-gray-500 text-black px-4 rounded-r-lg transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <div className="flex mb-6">
                  <input
                    type="text"
                    value={newTestimonial.position}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, position: e.target.value })}
                    className="flex-grow bg-gray-800 border border-gray-700 rounded-l-lg p-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                    placeholder="Client's position"
                  />
                  <input
                    type="text"
                    value={newTestimonial.comment}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, comment: e.target.value })}
                    className="flex-grow bg-gray-800 border border-gray-700 rounded-l-lg p-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                    placeholder="Client's testimonial"
                  />
                </div>
                <div className="flex mb-6">
                  <input
                    type="number"
                    value={newTestimonial.rating}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: e.target.value })}
                    className="flex-grow bg-gray-800 border border-gray-700 rounded-l-lg p-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                    placeholder="Client's rating (1-5)"
                    min={1}
                    max={5}
                  />
                  <button
                    onClick={() => {
                      handleAddTestimonial();
                      setNewTestimonial({ name: '', position: '', comment: '', rating: 5 });
                    }}
                    disabled={!newTestimonial.name.trim() || !newTestimonial.comment.trim()}
                    className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-700 disabled:text-gray-500 text-black px-4 rounded-r-lg transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      {/* Confirmation Dialog */}
      {showConfirmExit && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold text-red-500 mb-4">Discard Changes?</h3>
            <p className="text-gray-300 mb-6">You have unsaved changes. Are you sure you want to exit?</p>
            <div className="flex justify-center space-x-4">
              <button onClick={confirmExit} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400 transition-colors">Yes</button>
              <button onClick={cancelExit} className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditOrgProfile;