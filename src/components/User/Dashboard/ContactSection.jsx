/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import OverviewSection from './OverviewSection';

const ContactSection = ({ events, setActiveTab, overview = false }) => {
  if (overview) {
    return (
      <OverviewSection title="Contact Organizer" icon="phone">
        <div className="flex flex-col sm:flex-row gap-4">
          <select className="p-2 bg-gray-900 border border-gray-700 rounded focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-gray-300 flex-1">
            <option>Select an event organizer</option>
            {events.map(event => (
              <option key={event.id}>{event.title} - Organizer</option>
            ))}
          </select>
          <motion.button
            className="px-6 py-3 rounded-xl bg-gradient-to-r bg-cyan-400 text-black font-medium transition-colors cursor-pointer flex items-center space-x-2 hover:bg-black hover:text-cyan-400 hover:border hover:border-cyan-400"
            onClick={() => setActiveTab('contact')}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Contact
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
      <h2 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Contact Organizer</h2>
      <div className="space-y-6">
        <select className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500">
          <option>Select an event organizer</option>
          {events.map(event => (
            <option key={event.id}>{event.title} - Organizer</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Subject"
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        />

        <textarea
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          rows="4"
          placeholder="Your message to the organizer..."
        ></textarea>

        <motion.button
          className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-black px-6 py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-cyan-700 transition-colors shadow-lg"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          Send Message
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ContactSection;
