/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Globe, ShieldAlert } from 'lucide-react';

const EventPublishSettings = ({ formData, updateFormData, errors }) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const handleChange = (e) => {
    const { name, checked } = e.target;
    updateFormData({ [name]: checked });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="mb-6">
        <motion.h2 variants={itemVariants} className="text-2xl font-bold text-cyan-400 mb-1">
          Publication Settings
        </motion.h2>
        <motion.p variants={itemVariants} className="text-gray-400 text-sm">
          Manage visibility and status of your event
        </motion.p>
      </div>

      <motion.div variants={itemVariants} className="mb-6 bg-gray-800/50 rounded-lg p-5 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Globe className="text-cyan-400" size={20} />
            <div>
              <h3 className="font-medium text-white">Publish Status</h3>
              <p className="text-sm text-gray-400">Make your event visible to the public</p>
            </div>
          </div>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              className="sr-only"
            />
            <div className={`relative w-10 h-5 rounded-full transition-colors ${formData.isPublished ? 'bg-cyan-500' : 'bg-gray-700'}`}>
              <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${formData.isPublished ? 'transform translate-x-5' : ''}`}></div>
            </div>
          </label>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6 bg-gray-800/50 rounded-lg p-5 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Star className="text-yellow-400" size={20} />
            <div>
              <h3 className="font-medium text-white">Featured Event</h3>
              <p className="text-sm text-gray-400">Request to highlight this event on the platform</p>
            </div>
          </div>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="sr-only"
            />
            <div className={`relative w-10 h-5 rounded-full transition-colors ${formData.featured ? 'bg-yellow-500' : 'bg-gray-700'}`}>
              <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${formData.featured ? 'transform translate-x-5' : ''}`}></div>
            </div>
          </label>
        </div>
        {formData.featured && (
          <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start">
            <ShieldAlert className="text-yellow-500 mr-2 flex-shrink-0 mt-1" size={16} />
            <p className="text-xs text-gray-300">
              Featured status requires approval from admins. Your event will be reviewed before being featured.
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default EventPublishSettings;
