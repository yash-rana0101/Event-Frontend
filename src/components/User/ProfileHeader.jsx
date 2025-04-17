import React, { useState } from 'react';
import { Edit, Share2, Settings, MapPin, Calendar, Ticket, MessageCircle, Camera, X, Check } from 'lucide-react';

const ProfileHeader = ({
  user,
  isEditing,
  setIsEditing,
  editedName,
  setEditedName,
  editedLocation,
  setEditedLocation,
  handleSave
}) => {
  const [showProfileOptions, setShowProfileOptions] = useState(false);

  return (
    <div className="relative bg-black text-white rounded-xl overflow-hidden">
      {/* Background with gradient effect */}
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-cyan-500/30 to-black"></div>

      <div className="relative pt-6 px-4 md:px-8">
        {/* Profile actions - floating buttons on mobile, fixed on desktop */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            onClick={() => setShowProfileOptions(!showProfileOptions)}
            className="bg-black/70 backdrop-blur-md text-cyan-500 p-2 rounded-full hover:bg-cyan-500 hover:text-black transition md:hidden"
          >
            <Settings size={18} />
          </button>

          {showProfileOptions && (
            <div className="absolute top-10 right-0 bg-black/90 backdrop-blur-md border border-gray-800 p-3 rounded-xl shadow-xl flex flex-col gap-2 md:hidden">
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 text-sm px-4 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400"
                >
                  <Check size={14} /> Save
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 text-sm px-4 py-2 bg-black text-cyan-500 border border-cyan-500 rounded-lg hover:bg-cyan-500 hover:text-black"
                >
                  <Edit size={14} /> Edit
                </button>
              )}
              <button className="flex items-center gap-1 text-sm px-4 py-2 bg-black text-cyan-500 border border-cyan-500 rounded-lg hover:bg-cyan-500 hover:text-black">
                <Share2 size={14} /> Share
              </button>
            </div>
          )}
        </div>

        <div className="hidden md:flex absolute top-6 right-6 gap-3">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-4 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition font-medium"
            >
              <Check size={16} /> Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1 px-4 py-2 bg-black/70 backdrop-blur-sm text-cyan-500 border border-cyan-500 rounded-lg hover:bg-cyan-500 hover:text-black transition font-medium"
            >
              <Edit size={16} /> Edit Profile
            </button>
          )}
          <button className="flex items-center gap-1 px-4 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition font-medium">
            <Share2 size={16} /> Share
          </button>
        </div>

        {/* Profile content with improved layout */}
        <div className="flex flex-col items-center md:items-start md:flex-row md:gap-8 pt-16">
          {/* Avatar with animated border effect */}
          <div className="relative mb-4 md:mb-0">
            <div className="group relative">
              {/* Pulsing border effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300 blur-sm opacity-70 group-hover:opacity-100 group-hover:animate-pulse transition"></div>

              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-cyan-500 to-black flex items-center justify-center text-black text-3xl font-bold border-2 border-black relative z-10">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>

              <button className="absolute bottom-0 right-0 bg-black text-cyan-500 rounded-full p-2 shadow-lg border border-cyan-500 hover:bg-cyan-500 hover:text-black transition z-10">
                <Camera size={14} />
              </button>
            </div>
          </div>

          {/* User info with modern styling */}
          <div className="text-center md:text-left flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="text-2xl font-bold bg-black/50 text-white border-b-2 border-cyan-500 px-2 py-1 w-full focus:outline-none focus:border-cyan-300"
                    placeholder="Your name"
                  />
                </div>
                <div className="relative flex items-center">
                  <MapPin size={16} className="absolute left-2 text-cyan-500" />
                  <input
                    type="text"
                    value={editedLocation}
                    onChange={(e) => setEditedLocation(e.target.value)}
                    className="pl-8 bg-black/50 text-white border-b-2 border-cyan-500 px-2 py-1 w-full focus:outline-none focus:border-cyan-300"
                    placeholder="Your location"
                  />
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-500 to-white bg-clip-text text-transparent">{user.name}</h1>
                <div className="flex items-center justify-center md:justify-start mt-1 text-gray-300">
                  <MapPin size={16} className="mr-1 text-cyan-500" />
                  <span>{user.location}</span>
                </div>
              </>
            )}

            {/* User stats with hover effects */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
              <div className="bg-black/60 border border-gray-800 px-3 py-1.5 rounded-lg text-gray-300 text-sm flex items-center hover:border-cyan-500 transition-all">
                <Calendar size={14} className="mr-1.5 text-cyan-500" />
                <span>Joined {user.joinDate}</span>
              </div>
              <div className="bg-black/60 border border-gray-800 px-3 py-1.5 rounded-lg text-gray-300 text-sm flex items-center hover:border-cyan-500 transition-all">
                <Ticket size={14} className="mr-1.5 text-cyan-500" />
                <span>{user.eventsAttended} Events</span>
              </div>
              <div className="bg-black/60 border border-gray-800 px-3 py-1.5 rounded-lg text-gray-300 text-sm flex items-center hover:border-cyan-500 transition-all">
                <MessageCircle size={14} className="mr-1.5 text-cyan-500" />
                <span>{user.attendedEvents.length} Reviews</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom decorative element */}
        <div className="h-1 w-full bg-gradient-to-r from-cyan-500 to-transparent mt-6"></div>
      </div>
    </div>
  );
};

export default ProfileHeader;