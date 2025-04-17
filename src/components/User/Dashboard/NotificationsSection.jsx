/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import OverviewSection from './OverviewSection';

const NotificationsSection = ({ notifications, setActiveTab, overview = false }) => {
  const renderNotifications = () => (
    <div className="space-y-3">
      {notifications.map((note, index) => (
        <motion.div
          key={note.id}
          className="p-3 border-l-4 border-cyan-500 bg-black/30 rounded-r hover:bg-black/50 transition-colors cursor-pointer"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ x: 5 }}
        >
          <p className="text-white">{note.message}</p>
          <p className="text-xs text-cyan-400 mt-1">{note.time}</p>
        </motion.div>
      ))}
    </div>
  );

  if (overview) {
    return (
      <OverviewSection title="Notifications & Reminders" icon="bell">
        {renderNotifications()}
        <div className="mt-4 text-right">
          <motion.button
            className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center ml-auto transition-colors"
            onClick={() => setActiveTab('notifications')}
            whileHover={{ x: 3 }}
          >
            View All Notifications <span className="ml-1">→</span>
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
      <h2 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Notifications & Reminders</h2>
      <div className="space-y-4">
        {renderNotifications()}
      </div>
    </motion.div>
  );
};

export default NotificationsSection;
