/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import EventCard from './EventCard';
import OverviewSection from './OverviewSection';

const SavedEventsSection = ({ savedEvents, setActiveTab, overview = false, onUnsave }) => {
  // Mark all events as saved
  const eventsWithSavedStatus = savedEvents.map(event => ({
    ...event,
    isSaved: true
  }));

  if (overview) {
    return (
      <OverviewSection title="Saved Events" icon="heart">
        {savedEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {eventsWithSavedStatus.slice(0, 2).map(event => (
              <EventCard
                key={event.id}
                event={event}
                onSave={onUnsave}
              />
            ))}
          </div>
        ) : (
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 text-center">
            <p className="text-gray-400">No saved events yet</p>
          </div>
        )}
        <div className="mt-4 text-right">
          <motion.button
            className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center ml-auto transition-colors"
            onClick={() => setActiveTab('saved')}
            whileHover={{ x: 3 }}
          >
            View All Saved Events <span className="ml-1">→</span>
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
      <h2 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Saved Events</h2>
      {savedEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventsWithSavedStatus.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onSave={onUnsave}
            />
          ))}
        </div>
      ) : (
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-8 text-center">
          <p className="text-gray-400">You haven't saved any events yet</p>
        </div>
      )}
    </motion.div>
  );
};

export default SavedEventsSection;
