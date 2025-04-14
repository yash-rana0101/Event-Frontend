import React from 'react';
/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';

const EventBasicInfo = ({ formData, updateFormData, errors }) => {
  const categories = [
    { value: "conference", label: "Conference" },
    { value: "workshop", label: "Workshop" },
    { value: "seminar", label: "Seminar" },
    { value: "webinar", label: "Webinar" },
    { value: "networking", label: "Networking" },
    { value: "other", label: "Other" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="mb-6">
        <motion.h2 variants={itemVariants} className="text-2xl font-bold text-cyan-400 mb-1">
          Event Details
        </motion.h2>
        <motion.p variants={itemVariants} className="text-gray-400 text-sm">
          Let's start with the basic information about your event
        </motion.p>
      </div>

      <motion.div variants={itemVariants} className="mb-6">
        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
          Event Title <span className="text-cyan-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter a clear title for your event"
          className={`w-full px-4 py-3 bg-black border ${errors.title ? 'border-red-500' : 'border-gray-700'
            } rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500`}
          required
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6">
        <label htmlFor="tagline" className="block text-sm font-medium text-gray-300 mb-1">
          Event Tagline
        </label>
        <input
          type="text"
          id="tagline"
          name="tagline"
          value={formData.tagline || ''}
          onChange={handleChange}
          placeholder="A short, catchy phrase describing your event"
          className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500"
          maxLength={150}
        />
        <p className="mt-1 text-xs text-gray-500">
          {formData.tagline ? formData.tagline.length : 0}/150 characters
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6">
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
          Event Description <span className="text-cyan-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="5"
          placeholder="Describe your event, highlight what attendees can expect"
          className={`w-full px-4 py-3 bg-black border ${errors.description ? 'border-red-500' : 'border-gray-700'
            } rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500 resize-none`}
          required
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {formData.description.length}/1000 characters
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
          Event Category <span className="text-cyan-500">*</span>
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`w-full px-4 py-3 bg-black border ${errors.category ? 'border-red-500' : 'border-gray-700'
            } rounded-lg focus:outline-none focus:border-cyan-500 text-white appearance-none`}
          required
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-500">{errors.category}</p>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="mt-6">
        <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 p-3 bg-black border border-gray-700 rounded-lg focus-within:border-cyan-500">
          {formData.tags.map((tag, index) => (
            <div key={index} className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full flex items-center">
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => {
                  const newTags = [...formData.tags];
                  newTags.splice(index, 1);
                  updateFormData({ tags: newTags });
                }}
                className="ml-2 text-cyan-400 hover:text-red-400 focus:outline-none"
              >
                &times;
              </button>
            </div>
          ))}
          <input
            type="text"
            placeholder="Add tags and press Enter"
            className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-white"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                e.preventDefault();
                updateFormData({
                  tags: [...formData.tags, e.target.value.trim()]
                });
                e.target.value = '';
              }
            }}
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Add tags to help attendees find your event
        </p>
      </motion.div>
    </motion.div>
  );
};

export default EventBasicInfo;
