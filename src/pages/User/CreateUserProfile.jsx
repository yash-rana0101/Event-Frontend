/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Map, User, Globe, Link, Phone, Tag, Bell } from 'lucide-react';

const CreateUserProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    bio: '',
    location: '',
    website: '',
    phone: '',
    interests: [],
    interestInput: '', // Temporary state for adding interests
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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestKeyDown = (e) => {
    // Add interest when Enter is pressed
    if (e.key === 'Enter' && formData.interestInput.trim()) {
      e.preventDefault();
      addInterest();
    }
  };

  const addInterest = () => {
    if (!formData.interestInput.trim()) return;

    setFormData(prev => ({
      ...prev,
      interests: [...prev.interests, prev.interestInput.trim()],
      interestInput: ''
    }));
  };

  const removeInterest = (index) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
  };

  const toggleNotification = (index) => {
    setFormData(prev => {
      const updatedPreferences = [...prev.notificationPreferences];
      updatedPreferences[index].enabled = !updatedPreferences[index].enabled;
      return { ...prev, notificationPreferences: updatedPreferences };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Submit the form data
      await axios.post(`${import.meta.env.VITE_API_URL}/profiles/me`, {
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
        phone: formData.phone,
        interests: formData.interests,
        notificationPreferences: formData.notificationPreferences
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });



      toast.success('Profile created successfully!');
      navigate('/user/profile');
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  console.log("response", formData.notificationPreferences);
  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-cyan-500 opacity-5 rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-cyan-500 opacity-5 rounded-full filter blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 shadow-md border border-gray-800/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-cyan-600">
              Complete Your Profile
            </h1>
            <p className="text-gray-300 mt-2">Let's set up your profile to get the most out of your experience</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Bio */}
            <div className="mb-6">
              <label htmlFor="bio" className="flex text-sm font-medium text-gray-300 mb-2 items-center">
                <User size={16} className="mr-2 text-cyan-500" />
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows="3"
                placeholder="Tell us something about yourself..."
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                value={formData.bio}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* Location */}
            <div className="mb-6">
              <label htmlFor="location" className=" text-sm font-medium text-gray-300 mb-2 flex items-center">
                <Map size={16} className="mr-2 text-cyan-500" />
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="Where are you based?"
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            {/* Website */}
            <div className="mb-6">
              <label htmlFor="website" className=" text-sm font-medium text-gray-300 mb-2 flex items-center">
                <Globe size={16} className="mr-2 text-cyan-500" />
                Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                placeholder="Your website or social media profile"
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                value={formData.website}
                onChange={handleChange}
              />
            </div>

            {/* Phone */}
            <div className="mb-6">
              <label htmlFor="phone" className=" text-sm font-medium text-gray-300 mb-2 flex items-center">
                <Phone size={16} className="mr-2 text-cyan-500" />
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Your contact number"
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Interests */}
            <div className="mb-8">
              <label htmlFor="interests" className=" text-sm font-medium text-gray-300 mb-2 flex items-center">
                <Tag size={16} className="mr-2 text-cyan-500" />
                Interests
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  id="interestInput"
                  name="interestInput"
                  placeholder="Add your interests and press Enter"
                  className="flex-grow p-3 bg-gray-900 border border-gray-700 rounded-l-lg text-gray-300 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  value={formData.interestInput}
                  onChange={handleChange}
                  onKeyDown={handleInterestKeyDown}
                />
                <button
                  type="button"
                  onClick={addInterest}
                  className="p-3 bg-cyan-600 text-black font-medium rounded-r-lg hover:bg-cyan-700"
                >
                  Add
                </button>
              </div>

              {/* Display interests as tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.interests.map((interest, index) => (
                  <div
                    key={index}
                    className="bg-cyan-900/40 text-cyan-400 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {interest}
                    <button
                      type="button"
                      onClick={() => removeInterest(index)}
                      className="ml-2 text-cyan-300 hover:text-white"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                <Bell size={18} className="mr-2 text-cyan-500" />
                Notification Preferences
              </h3>

              <div className="space-y-3">
                {formData.notificationPreferences.map((pref, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-900/80 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-white">{pref.name}</p>
                      <p className="text-xs text-gray-400">{pref.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={pref.enabled}
                        onChange={() => toggleNotification(index)}
                      />
                      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <motion.button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-medium rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Creating Profile...' : 'Create Profile'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateUserProfile;
