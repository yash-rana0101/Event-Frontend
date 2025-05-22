/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Save,
  X,
  MapPin,
  Globe,
  Phone,
  Link as LinkIcon,
  Tag,
  Bell,
  Camera,
  Loader,
  ArrowLeft,
  Trash2,
  Plus,
  AlertTriangle
} from 'lucide-react';
import { useLoader } from '../../context/LoaderContext';
import Skeleton from '../../components/UI/Skeleton';

const EditUserProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { setIsLoading } = useLoader();

  // Get current user from Redux store for comparison
  const currentUser = useSelector(state => state.auth?.user);
  const isCurrentUserProfile = currentUser &&
    (currentUser.id == userId || currentUser._id == userId);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Form data state
  const [profile, setProfile] = useState({
    bio: '',
    location: '',
    website: '',
    phone: '',
    interests: [],
    notificationPreferences: []
  });

  // Temporary state for interest input
  const [interestInput, setInterestInput] = useState('');

  // Error state
  const [error, setError] = useState(null);

  // Original profile state (for detecting changes)
  const [originalProfile, setOriginalProfile] = useState(null);

  useEffect(() => {
    setIsLoading(loading);
    return () => setIsLoading(false);
  }, [loading, setIsLoading]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Check authorization
        if (!isCurrentUserProfile) {
          toast.error("You don't have permission to edit this profile");
          navigate(`/user/${userId}`);
          return;
        }

        // Fetch profile data
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${apiUrl}/profiles/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          const profileData = response.data.data;

          // Set profile data
          setProfile({
            bio: profileData.bio || '',
            location: profileData.location || '',
            website: profileData.website || '',
            phone: profileData.phone || '',
            interests: profileData.interests || [],
            notificationPreferences: profileData.notificationPreferences || []
          });

          // Initialize notification preferences if empty
          if (!profileData.notificationPreferences ||
            profileData.notificationPreferences.length === 0) {
            setProfile(prev => ({
              ...prev,
              notificationPreferences: [
                {
                  type: "event_reminder",
                  name: "Event Reminders",
                  enabled: true,
                  description: "Get notified 24 hours before events"
                },
                {
                  type: "new_event",
                  name: "New Events",
                  enabled: true,
                  description: "Get notified when new events match your interests"
                },
                {
                  type: "event_notification",
                  name: "Friends' Activities",
                  enabled: false,
                  description: "Get notified when friends register for events"
                },
                {
                  type: "admin_notification",
                  name: "Promotions",
                  enabled: true,
                  description: "Get notified about discounts and special offers"
                }
              ]
            }));
          }

          // Set profile image if exists
          const profilePicture = profileData.user?.profilePicture || profileData.profilePicture;
          if (profilePicture) {
            setImagePreview(profilePicture);
          }

          // Keep original profile for change detection
          setOriginalProfile({
            bio: profileData.bio || '',
            location: profileData.location || '',
            website: profileData.website || '',
            phone: profileData.phone || '',
            interests: profileData.interests || [],
            notificationPreferences: profileData.notificationPreferences || []
          });
        } else {
          throw new Error("Failed to load profile data");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.message || "Failed to load profile. Please try again.");
        toast.error("Error loading profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, navigate, isCurrentUserProfile]);

  // Check for unsaved changes when profile or originalProfile changes
  useEffect(() => {
    if (originalProfile) {
      const hasProfileChanges =
        profile.bio !== originalProfile.bio ||
        profile.location !== originalProfile.location ||
        profile.website !== originalProfile.website ||
        profile.phone !== originalProfile.phone ||
        JSON.stringify(profile.interests) !== JSON.stringify(originalProfile.interests) ||
        JSON.stringify(profile.notificationPreferences) !== JSON.stringify(originalProfile.notificationPreferences);

      setHasChanges(hasProfileChanges || imageFile !== null);
    }
  }, [profile, originalProfile, imageFile]);

  // Form input handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestKeyDown = (e) => {
    // Add interest when Enter is pressed
    if (e.key === 'Enter' && interestInput.trim()) {
      e.preventDefault();
      addInterest();
    }
  };

  const addInterest = () => {
    if (!interestInput.trim()) return;

    setProfile(prev => ({
      ...prev,
      interests: [...prev.interests, interestInput.trim()]
    }));
    setInterestInput('');
  };

  const removeInterest = (index) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
  };

  const toggleNotification = (index) => {
    setProfile(prev => {
      const updatedPreferences = [...prev.notificationPreferences];
      updatedPreferences[index].enabled = !updatedPreferences[index].enabled;
      return { ...prev, notificationPreferences: updatedPreferences };
    });
  };

  // Image upload handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setImageFile(file);
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL;

      // Create formData if image is being uploaded
      let response;

      if (imageFile) {
        const formData = new FormData();
        formData.append('profileImage', imageFile);
        formData.append('bio', profile.bio);
        formData.append('location', profile.location);
        formData.append('website', profile.website);
        formData.append('phone', profile.phone);
        formData.append('interests', JSON.stringify(profile.interests));
        formData.append('notificationPreferences', JSON.stringify(profile.notificationPreferences));

        response = await axios.put(`${apiUrl}/profiles/me`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Regular JSON update without image
        response = await axios.put(`${apiUrl}/profiles/me`, {
          bio: profile.bio,
          location: profile.location,
          website: profile.website,
          phone: profile.phone,
          interests: profile.interests,
          notificationPreferences: profile.notificationPreferences
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      if (response.data.success) {
        toast.success('Profile updated successfully!');
        navigate(`/user/profile/${userId}`);
      } else {
        throw new Error(response.data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Navigation handlers with unsaved changes check
  const handleCancel = () => {
    if (hasChanges) {
      setShowUnsavedChangesModal(true);
    } else {
      navigate(`/user/profile`);
    }
  };

  const confirmNavigation = () => {
    setShowUnsavedChangesModal(false);
    navigate(`/user/profile`);
  };

  if (loading) {
    return (
      <Skeleton type="profile" className="min-h-screen bg-black text-white mx-auto" />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center py-12 bg-black rounded-2xl border border-red-900/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-transparent"></div>

            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>

            <h2 className="text-xl font-bold mb-2 text-white">Error Loading Profile</h2>
            <p className="text-red-300 mb-6 text-center max-w-md">{error}</p>

            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-6 py-3 bg-black text-red-400 rounded-lg border border-red-500/30 hover:bg-red-950/30 transition-all shadow-lg shadow-red-500/10"
            >
              <ArrowLeft size={18} />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-cyan-500 opacity-5 rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-cyan-500 opacity-5 rounded-full filter blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-400 hover:text-cyan-500 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to Profile</span>
          </button>

          <div className="text-sm text-cyan-500">
            {hasChanges ? "Unsaved changes" : "No changes"}
          </div>
        </div>

        <motion.div
          className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 shadow-md border border-gray-800/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-cyan-600">
              Edit Your Profile
            </h1>
            <p className="text-gray-300 mt-2">Update your personal information and preferences</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Profile Image */}
            <div className="mb-10 flex justify-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-md opacity-70 group-hover:opacity-90 transition-opacity"></div>
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-cyan-500 relative z-10">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-cyan-900 to-black flex items-center justify-center">
                      <User className="h-16 w-16 text-cyan-500" />
                    </div>
                  )}
                </div>
                <label htmlFor="profile-image" className="absolute bottom-0 right-0 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg z-10 border-2 border-black hover:bg-cyan-400 transition-colors">
                  <Camera className="h-5 w-5 text-black" />
                </label>
                <input
                  type="file"
                  id="profile-image"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            {/* Bio */}
            <div className="mb-6">
              <label htmlFor="bio" className="flex text-sm font-medium text-gray-300 mb-2 items-center">
                <User size={16} className="mr-2 text-cyan-500" />
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows="4"
                placeholder="Tell us something about yourself..."
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                value={profile.bio}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* Location */}
            <div className="mb-6">
              <label htmlFor="location" className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                <MapPin size={16} className="mr-2 text-cyan-500" />
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="Where are you based?"
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                value={profile.location}
                onChange={handleChange}
              />
            </div>

            {/* Website */}
            <div className="mb-6">
              <label htmlFor="website" className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                <Globe size={16} className="mr-2 text-cyan-500" />
                Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                placeholder="Your website or social media profile"
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                value={profile.website}
                onChange={handleChange}
              />
            </div>

            {/* Phone */}
            <div className="mb-6">
              <label htmlFor="phone" className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                <Phone size={16} className="mr-2 text-cyan-500" />
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Your contact number"
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                value={profile.phone}
                onChange={handleChange}
              />
            </div>

            {/* Interests */}
            <div className="mb-8">
              <label htmlFor="interests" className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                <Tag size={16} className="mr-2 text-cyan-500" />
                Interests
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  id="interestInput"
                  placeholder="Add your interests and press Enter"
                  className="flex-grow p-3 bg-gray-900 border border-gray-700 rounded-l-lg text-gray-300 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={handleInterestKeyDown}
                />
                <button
                  type="button"
                  onClick={addInterest}
                  className="p-3 bg-cyan-600 text-black font-medium rounded-r-lg hover:bg-cyan-700 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Display interests as tags with animation */}
              <div className="flex flex-wrap gap-2 mt-3">
                <AnimatePresence>
                  {profile.interests.map((interest, index) => (
                    <motion.div
                      key={interest + index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      className="bg-cyan-900/40 text-cyan-400 px-3 py-1 rounded-full text-sm flex items-center group"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => removeInterest(index)}
                        className="ml-2 text-cyan-300 hover:text-white transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 pt-4 border-t border-gray-800">
              <motion.button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 bg-transparent border border-red-500/50 text-red-400 font-medium rounded-lg hover:bg-red-950/10 transition-colors flex items-center justify-center gap-2"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <X size={18} />
                Cancel
              </motion.button>

              <motion.button
                type="submit"
                disabled={saving || !hasChanges}
                className={`px-8 py-3 font-medium rounded-lg flex items-center justify-center gap-2 shadow-lg 
                  ${saving || !hasChanges
                    ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                    : 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-black hover:from-cyan-600 hover:to-cyan-700'}`}
                whileHover={hasChanges && !saving ? { y: -2 } : {}}
                whileTap={hasChanges && !saving ? { scale: 0.98 } : {}}
              >
                {saving ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Unsaved Changes Modal */}
      <AnimatePresence>
        {showUnsavedChangesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-900 border border-cyan-500/20 rounded-xl p-6 max-w-md w-full shadow-xl"
            >
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-amber-500" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-center mb-2">Unsaved Changes</h3>
              <p className="text-gray-400 text-center mb-6">
                You have unsaved changes. Are you sure you want to leave this page? Your changes will be lost.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setShowUnsavedChangesModal(false)}
                  className="px-6 py-2 bg-transparent border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Keep Editing
                </button>

                <button
                  onClick={confirmNavigation}
                  className="px-6 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  Discard Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EditUserProfile;
