/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import OverviewSection from './OverviewSection';

const FeedbackSection = ({ events = [], setActiveTab, overview = false }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (index) => {
    setRating(index);
  };

  const renderStars = () => (
    <div className="flex gap-2 mb-4 justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.div
          key={star}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => handleStarClick(star)}
        >
          <Star
            size={24}
            className={`${(hoverRating || rating) >= star ? 'fill-cyan-500 text-cyan-500' : 'text-gray-500'} cursor-pointer`}
          />
        </motion.div>
      ))}
    </div>
  );

  if (overview) {
    return (
      <OverviewSection title="Feedback & Reviews" icon="message">
        <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg">
          <p className="font-medium text-white mb-3">Share your experience</p>
          {renderStars()}
          <motion.button
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r bg-cyan-400 text-black font-medium transition-colors cursor-pointer  space-x-2 hover:bg-black hover:text-cyan-400 hover:border hover:border-cyan-400"
            onClick={() => setActiveTab('feedback')}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Write a Review
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
      <h2 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Feedback & Reviews</h2>
      <div className="p-6 bg-black/30 backdrop-blur-sm rounded-lg mb-4">
        <p className="font-medium text-white mb-4">Share your experience</p>
        <div className="space-y-6">
          <select className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500">
            <option>Select an event to review</option>
            {events.map(event => (
              <option key={event.id}>{event.title}</option>
            ))}
          </select>

          {renderStars()}

          <textarea
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            rows="4"
            placeholder="Share your thoughts about this event..."
          ></textarea>

          <motion.button
            className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-black px-4 py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-cyan-700 transition-colors"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Submit Review
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default FeedbackSection;
