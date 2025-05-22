import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  MapPin,
  Calendar,
  Edit2,
  MessageSquare,
  Users,
  ChevronRight,
  Share2,
  Settings,
  Camera,
  Ticket
} from 'lucide-react';

const ProfileHeader = ({ profile, isCurrentUser }) => {
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const navigate = useNavigate();

  // Loading state
  if (!profile) {
    return (
      <div className="bg-black rounded-xl p-6 border border-cyan-500/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-black/80 z-0"></div>
        {/* Animated loading elements */}
        <div className="flex justify-center items-center h-40 relative z-10">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-gray-800 relative">
              <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping"></div>
            </div>
            <div className="h-5 w-48 bg-gray-800 rounded"></div>
            <div className="h-4 w-32 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Handle potential nested user object or direct properties
  const userName = profile?.user?.name || profile?.name || "User";
  const userBio = profile?.bio || "No bio provided";
  const userLocation = profile?.location || "No location set";
  const userJoinDate = new Date(profile?.joinDate || profile?.createdAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Handle profile picture logic
  const userProfilePicture = profile?.user?.profilePicture ||
    profile?.profilePicture ||
    null;

  // Stats data - would be replaced with real data in implementation

  return (
    <div className="bg-black rounded-xl overflow-hidden relative border border-cyan-500/20 shadow-lg shadow-cyan-500/5 backdrop-blur-sm">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/5 via-black to-black"></div>

        {/* Geometric patterns */}
        <div className="absolute top-0 right-0 w-1/2 h-48 bg-cyan-500/3 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-cyan-500/5 blur-3xl rounded-full"></div>

        {/* Grid lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent top-1/4 absolute"></div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent top-3/4 absolute"></div>
          <div className="w-px h-full bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent left-1/4 absolute"></div>
          <div className="w-px h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent left-3/4 absolute"></div>
        </div>
      </div>

      <div className="relative">
        {/* Banner area */}
        <div className="relative h-36 md:h-48 overflow-hidden">
          {/* Banner gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/30 via-black to-cyan-900/10"></div>

          {/* Tech circuit pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-24 h-24 border border-cyan-500/30 rounded-full"></div>
            <div className="absolute top-1/2 left-1/3 w-12 h-12 border border-cyan-500/40 rounded-md transform rotate-45"></div>
            <div className="absolute bottom-1/4 right-1/4 w-16 h-16 border border-cyan-500/30 rounded-full"></div>
            <div className="absolute top-3/4 right-1/3 w-8 h-8 border border-cyan-500/50 rounded transform rotate-12"></div>
          </div>

          {/* Controls for current user (desktop) */}
          {isCurrentUser && (
            <div className="hidden md:flex absolute top-4 right-4 gap-3 z-10">
              <button
                onClick={() => navigate("/user/profile/edit")}
                className="flex items-center gap-2 px-4 py-2 bg-black/70 backdrop-blur-md text-cyan-500 rounded-lg border border-cyan-500/40 hover:bg-cyan-500/10 transition group"
              >
                <Edit2 size={16} className="group-hover:animate-pulse" />
                <span>Edit Profile</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-black/70 backdrop-blur-md text-cyan-500 rounded-lg border border-cyan-500/40 hover:bg-cyan-500/10 transition group">
                <Share2 size={16} />
                <span>Share</span>
              </button>
            </div>
          )}

          {/* Mobile menu for current user */}
          {isCurrentUser && (
            <div className="md:hidden absolute top-4 right-4 z-10">
              <button
                onClick={() => setShowProfileOptions(!showProfileOptions)}
                className="p-2 bg-black/70 backdrop-blur-md text-cyan-500 rounded-full border border-cyan-500/40 hover:bg-cyan-500/10"
              >
                <Settings size={18} />
              </button>

              {showProfileOptions && (
                <div className="absolute top-12 right-0 bg-black/90 backdrop-blur-md border border-cyan-500/30 p-3 rounded-xl shadow-xl flex flex-col gap-2 w-40 z-20">
                  <button
                    onClick={() => navigate("/user/edit-profile")}
                    className="flex items-center gap-2 text-sm px-3 py-2 text-cyan-500 hover:bg-cyan-500/10 rounded-lg transition"
                  >
                    <Edit2 size={14} /> Edit Profile
                  </button>
                  <button
                    className="flex items-center gap-2 text-sm px-3 py-2 text-cyan-500 hover:bg-cyan-500/10 rounded-lg transition"
                  >
                    <Share2 size={14} /> Share Profile
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Subtle gradient overlay for bottom part of banner */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent"></div>
        </div>

        {/* Profile content section */}
        <div className="px-4 md:px-8 pb-6 relative">
          <div className="flex flex-col md:flex-row gap-6 -mt-16 md:-mt-20">
            {/* Profile picture with animated effects */}
            <div className="flex justify-center md:justify-start">
              <div className="relative group">
                {/* Animated glows */}
                <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-md opacity-70 group-hover:animate-pulse transition"></div>

                {/* Profile picture container */}
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-cyan-500 shadow-lg shadow-cyan-500/30 overflow-hidden relative z-10 bg-gradient-to-br from-cyan-900 to-black">
                  {userProfilePicture ? (
                    <img
                      src={userProfilePicture}
                      alt={userName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://api.dicebear.com/6.x/initials/svg?seed=${userName}`
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-cyan-500">
                      {userName.split(' ').map(n => n?.[0] || '').join('').length > 0 ? (
                        <span className="text-4xl font-bold">
                          {userName.split(' ').map(n => n?.[0] || '').join('').toUpperCase()}
                        </span>
                      ) : (
                        <User className="w-16 h-16" />
                      )}
                    </div>
                  )}


                  {/* Online indicator */}
                  <div className="absolute bottom-2 right-2 w-4 h-4 bg-cyan-500 rounded-full border-2 border-black"></div>
                </div>
              </div>
            </div>

            {/* User information */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-white mt-4 md:mt-0">
                {userName}
                <span className="bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">.</span>
              </h1>

              {/* Location and join date */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3">
                {userLocation && (
                  <div className="flex items-center gap-1.5 text-gray-300 text-sm bg-cyan-950/20 px-3 py-1.5 rounded-full border border-cyan-500/20">
                    <MapPin size={14} className="text-cyan-500" />
                    <span>{userLocation}</span>
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-gray-300 text-sm bg-cyan-950/20 px-3 py-1.5 rounded-full border border-cyan-500/20">
                  <Calendar size={14} className="text-cyan-500" />
                  <span>Joined {userJoinDate}</span>
                </div>
              </div>

              {/* Bio section */}
              <div className="mt-4">
                <div className="relative px-4 py-3 bg-black/40 backdrop-blur-sm rounded-lg border-l-2 border-cyan-500/50">
                  <p className="text-gray-300 text-sm md:text-base">{userBio}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile edit profile button */}
          {isCurrentUser && (
            <div className="md:hidden w-full mt-6">
              <Link
                to="/user/profile/edit"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500/10 to-black text-cyan-500 rounded-lg border border-cyan-500/30 hover:bg-cyan-950/50 transition-all shadow-md shadow-cyan-500/5 w-full group"
              >
                <Edit2 size={16} />
                <span>Edit Profile</span>
                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
              </Link>
            </div>
          )}

          {/* Action buttons for non-current user */}
          {!isCurrentUser && (
            <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-end">
              <button className="px-5 py-2.5 bg-black text-cyan-500 rounded-lg border border-cyan-500/30 hover:bg-cyan-950/30 transition-all shadow-md hover:shadow-cyan-500/10 flex items-center gap-2">
                <Share2 size={16} />
                <span>Share</span>
              </button>
            </div>
          )}
        </div>

        {/* Bottom decorative line */}
        <div className="h-1 w-full bg-gradient-to-r from-cyan-500/50 via-cyan-500/20 to-transparent"></div>
      </div>
    </div>
  );
};

export default ProfileHeader;