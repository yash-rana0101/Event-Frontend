/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';

const ProfileSettings = ({ profileData, setProfileData, handleAvatarUpload }) => {
  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Camera className="w-5 h-5 mr-2 text-cyan-400" />
          Profile Picture
        </h3>
        <div className="flex items-center space-x-6">
          <div className="relative">
            {profileData.avatar ? (
              <img
                src={profileData.avatar}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold text-black">
                {profileData.firstName?.[0]}{profileData.lastName?.[0]}
              </div>
            )}
            <motion.label
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-black hover:bg-cyan-400 transition-colors cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </motion.label>
          </div>
          <div>
            <p className="text-white font-medium mb-2">Upload new avatar</p>
            <p className="text-gray-400 text-sm mb-3">JPG, PNG or GIF. Max size 2MB.</p>
            <motion.label
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors border border-cyan-500/30 cursor-pointer"
            >
              Choose File
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </motion.label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
