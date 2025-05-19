import React, { useState } from 'react';
import { Settings, Bell, Ticket, Plus, Tag, Check, X, ChevronRight } from 'lucide-react';
import axios from 'axios';

const PreferencesTab = ({ user, token, onUpdate }) => {
  const [activeAccordion, setActiveAccordion] = useState('eventTypes');
  const [hoveredItem, setHoveredItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notificationPreferences, setNotificationPreferences] = useState(
    user?.notificationPreferences || []
  );
  const [interests, setInterests] = useState(user?.interests || []);
  const [preferences, setPreferences] = useState(user?.preferences || []);
  const [newInterest, setNewInterest] = useState('');
  const [newPreference, setNewPreference] = useState('');

  const toggleAccordion = (section) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  const handleMouseEnter = (index) => {
    setHoveredItem(index);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const handleNotificationToggle = (index) => {
    const updatedPreferences = [...notificationPreferences];
    updatedPreferences[index] = {
      ...updatedPreferences[index],
      enabled: !updatedPreferences[index].enabled
    };
    setNotificationPreferences(updatedPreferences);
  };

  const handleAddInterest = () => {
    if (newInterest && !interests.includes(newInterest)) {
      setInterests([...interests, newInterest]);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interestToRemove) => {
    setInterests(interests.filter(interest => interest !== interestToRemove));
  };

  const handleAddPreference = () => {
    if (newPreference && !preferences.includes(newPreference)) {
      setPreferences([...preferences, newPreference]);
      setNewPreference('');
    }
  };

  const handleRemovePreference = (prefToRemove) => {
    setPreferences(preferences.filter(pref => pref !== prefToRemove));
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      setError(null);

      // Save notification preferences
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/profile/me/notification-preferences`,
        { preferences: notificationPreferences },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update profile data with new interests and preferences
      const profileResponse = await axios.put(
        `${import.meta.env.VITE_API_URL}/profile/me`,
        {
          interests: interests,
          preferences: preferences
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data?.success && profileResponse.data?.success) {
        // Notify parent component of the updates
        onUpdate({
          notificationPreferences,
          interests,
          preferences
        });
      } else {
        throw new Error(response.data?.message || 'Failed to update preferences');
      }
    } catch (err) {
      console.error('Error updating preferences:', err);
      setError(err.message || 'An error occurred while updating your preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-8 md:px-6 lg:px-8 bg-black text-white">
      {/* Header with glow effect */}
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-cyan-500 opacity-20 blur-xl rounded-full"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gray-900 p-3 rounded-xl border border-cyan-500/40">
              <Settings size={24} className="text-cyan-500" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-500 bg-clip-text text-transparent">
              Preferences
            </h1>
          </div>
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="space-y-6">
        {/* Event Types Section */}
        <div className="bg-gray-900/50 rounded-2xl overflow-hidden backdrop-blur-sm border border-gray-800">
          <div
            className={`flex items-center justify-between p-5 border-b border-gray-800 cursor-pointer ${activeAccordion === 'eventTypes' ? 'bg-gradient-to-r from-cyan-500/10 to-transparent' : ''}`}
            onClick={() => toggleAccordion('eventTypes')}
          >
            <div className="flex items-center gap-3">
              <div className="bg-black p-2 rounded-lg border border-cyan-500/40">
                <Tag size={18} className="text-cyan-500" />
              </div>
              <h2 className="text-xl font-bold text-white">Event Preferences</h2>
            </div>
            <ChevronRight
              size={20}
              className={`text-cyan-500 transition-transform duration-300 ${activeAccordion === 'eventTypes' ? 'rotate-90' : ''}`}
            />
          </div>

          {activeAccordion === 'eventTypes' && (
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-300 mb-4">Preferred Event Types</h3>
              <div className="flex flex-wrap gap-3 mb-6">
                {interests.map((interest, index) => (
                  <div
                    key={index}
                    className="group relative bg-black border border-cyan-500/40 text-white px-4 py-2 rounded-full text-sm hover:bg-cyan-500 hover:text-black transition-all duration-300 cursor-pointer flex items-center gap-2"
                    onMouseEnter={() => handleMouseEnter(`interest-${index}`)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {interest}
                    <div
                      className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveInterest(interest);
                      }}
                    >
                      <X size={14} className="hover:text-red-500" />
                    </div>
                  </div>
                ))}

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Add interest..."
                    className="bg-black/60 border border-cyan-500/60 text-cyan-500 px-4 py-2 rounded-full text-sm focus:outline-none focus:border-cyan-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddInterest();
                      }
                    }}
                  />
                  <button
                    onClick={handleAddInterest}
                    disabled={!newInterest}
                    className="bg-black/60 border border-dashed border-cyan-500/60 text-cyan-500 p-2 rounded-full text-sm hover:bg-cyan-500/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notification Preferences Section */}
        <div className="bg-gray-900/50 rounded-2xl overflow-hidden backdrop-blur-sm border border-gray-800">
          <div
            className={`flex items-center justify-between p-5 border-b border-gray-800 cursor-pointer ${activeAccordion === 'notifications' ? 'bg-gradient-to-r from-cyan-500/10 to-transparent' : ''}`}
            onClick={() => toggleAccordion('notifications')}
          >
            <div className="flex items-center gap-3">
              <div className="bg-black p-2 rounded-lg border border-cyan-500/40">
                <Bell size={18} className="text-cyan-500" />
              </div>
              <h2 className="text-xl font-bold text-white">Notification Preferences</h2>
            </div>
            <ChevronRight
              size={20}
              className={`text-cyan-500 transition-transform duration-300 ${activeAccordion === 'notifications' ? 'rotate-90' : ''}`}
            />
          </div>

          {activeAccordion === 'notifications' && (
            <div className="p-5">
              <div className="space-y-4">
                {notificationPreferences.map((pref, index) => (
                  <div
                    key={index}
                    className={`group bg-black/40 rounded-xl p-4 border ${hoveredItem === `notification-${index}` ? 'border-cyan-500' : 'border-gray-800'} transition-all duration-300 hover:bg-black/60`}
                    onMouseEnter={() => handleMouseEnter(`notification-${index}`)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-white mb-1">{pref.name}</h3>
                        <p className="text-sm text-gray-400">{pref.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={pref.enabled}
                          onChange={() => handleNotificationToggle(index)}
                        />
                        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                      </label>
                    </div>
                  </div>
                ))}

                {notificationPreferences.length === 0 && (
                  <p className="text-gray-400 text-sm">No notification preferences available.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Ticket Preferences Section */}
        <div className="bg-gray-900/50 rounded-2xl overflow-hidden backdrop-blur-sm border border-gray-800">
          <div
            className={`flex items-center justify-between p-5 border-b border-gray-800 cursor-pointer ${activeAccordion === 'tickets' ? 'bg-gradient-to-r from-cyan-500/10 to-transparent' : ''}`}
            onClick={() => toggleAccordion('tickets')}
          >
            <div className="flex items-center gap-3">
              <div className="bg-black p-2 rounded-lg border border-cyan-500/40">
                <Ticket size={18} className="text-cyan-500" />
              </div>
              <h2 className="text-xl font-bold text-white">Ticket Preferences</h2>
            </div>
            <ChevronRight
              size={20}
              className={`text-cyan-500 transition-transform duration-300 ${activeAccordion === 'tickets' ? 'rotate-90' : ''}`}
            />
          </div>

          {activeAccordion === 'tickets' && (
            <div className="p-5">
              <div className="flex flex-wrap gap-3 mb-6">
                {preferences.map((pref, index) => (
                  <div
                    key={index}
                    className="group relative bg-black border border-cyan-500/40 text-white px-4 py-2 rounded-full text-sm hover:bg-cyan-500 hover:text-black transition-all duration-300 cursor-pointer flex items-center gap-2"
                    onMouseEnter={() => handleMouseEnter(`ticket-${index}`)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {pref}
                    <div
                      className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemovePreference(pref);
                      }}
                    >
                      <X size={14} className="hover:text-red-500" />
                    </div>
                  </div>
                ))}

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newPreference}
                    onChange={(e) => setNewPreference(e.target.value)}
                    placeholder="Add preference..."
                    className="bg-black/60 border border-cyan-500/60 text-cyan-500 px-4 py-2 rounded-full text-sm focus:outline-none focus:border-cyan-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddPreference();
                      }
                    }}
                  />
                  <button
                    onClick={handleAddPreference}
                    disabled={!newPreference}
                    className="bg-black/60 border border-dashed border-cyan-500/60 text-cyan-500 p-2 rounded-full text-sm hover:bg-cyan-500/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-6 bg-red-900/20 text-red-400 border border-red-800 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Save Changes Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSaveChanges}
          disabled={loading}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-medium px-6 py-3 rounded-xl transition-colors duration-300 cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <Check size={18} />
          )}
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default PreferencesTab;