/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import EventCard from './EventCard';
import OverviewSection from './OverviewSection';

const RecommendationsSection = ({ recommendations, setActiveTab, overview = false }) => {
  if (overview) {
    return (
      <OverviewSection title="Recommendations" icon="star">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recommendations.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
        <div className="mt-4 text-right">
          <motion.button
            className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center ml-auto transition-colors"
            onClick={() => setActiveTab('recommendations')}
            whileHover={{ x: 3 }}
          >
            View All Recommendations <span className="ml-1">→</span>
          </motion.button>
        </div>
      </OverviewSection>
    );
  }

  return (
    <motion.div
      className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 shadow-md border border-gray-800/50"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Recommended For You</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </motion.div>
  );
};

export default RecommendationsSection;
