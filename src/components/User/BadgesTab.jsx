/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';

const BadgesTab = ({ profile }) => {
  // Add a loading state if the profile is still being fetched
  if (!profile) {
    return (
      <div className="p-4 text-center">
        <div className="animate-pulse bg-gray-700/50 h-8 w-40 mx-auto mb-6 rounded-lg"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="bg-gray-800/40 animate-pulse p-4 rounded-lg h-40"></div>
          ))}
        </div>
      </div>
    );
  }

  // Initialize badges to an empty array if it doesn't exist
  const badges = profile.badges || [];

  // Default badges to show if user has none
  const defaultBadges = [
    {
      id: "new-user",
      name: "New Explorer",
      description: "Just joined the platform",
      image: "https://api.dicebear.com/6.x/shapes/svg?seed=badge1",
      acquired: true
    },
    {
      id: "first-event",
      name: "First Event",
      description: "Register for your first event to unlock",
      image: "https://api.dicebear.com/6.x/shapes/svg?seed=badge2",
      acquired: false
    }
  ];

  // Combine user badges with default ones, or just use defaults if no badges exist
  const displayBadges = badges.length > 0 ? badges : defaultBadges;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-white mb-6">Your Achievement Badges</h2>

      {displayBadges.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400">No badges earned yet. Participate in events to earn badges!</p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {displayBadges.map((badge, index) => (
            <motion.div
              key={badge.id || index}
              className={`bg-gray-800 rounded-lg p-4 flex flex-col items-center text-center 
                ${badge.acquired ? 'border border-cyan-500/30' : 'border border-gray-700/50 opacity-60'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="w-20 h-20 mb-3 relative">
                <img
                  src={badge.image || `https://api.dicebear.com/6.x/shapes/svg?seed=${badge.name}`}
                  alt={badge.name}
                  className="w-full h-full object-contain"
                />
                {!badge.acquired && (
                  <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                )}
              </div>
              <h3 className="text-lg font-medium text-white">{badge.name}</h3>
              <p className="text-sm text-gray-400 mt-1">{badge.description}</p>
              {badge.acquired && badge.date && (
                <span className="text-xs text-cyan-400 mt-2">Unlocked on {new Date(badge.date).toLocaleDateString()}</span>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default BadgesTab;