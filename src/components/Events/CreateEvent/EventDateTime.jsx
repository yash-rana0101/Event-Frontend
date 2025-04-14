import React from 'react';
/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';

const EventDateTime = ({ formData, updateFormData, errors }) => {
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  // Get tomorrow's date as min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

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
          Event Date & Time
        </motion.h2>
        <motion.p variants={itemVariants} className="text-gray-400 text-sm">
          Set when your event will take place
        </motion.p>
      </div>

      <motion.div variants={itemVariants} className="mb-6">
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-1">
          Start Date <span className="text-cyan-500">*</span>
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={formData.startDate}
          onChange={handleDateChange}
          min={minDate}
          className={`w-full px-4 py-3 bg-black border ${errors.startDate ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:outline-none focus:border-cyan-500 text-white`}
          required
        />
        {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6">
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-1">
          End Date <span className="text-cyan-500">*</span>
        </label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={formData.endDate}
          onChange={handleDateChange}
          min={formData.startDate || minDate}
          className={`w-full px-4 py-3 bg-black border ${errors.endDate ? 'border-red-500' : 'border-gray-700'} rounded-lg focus:outline-none focus:border-cyan-500 text-white`}
          required
        />
        {errors.endDate && <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>}
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6">
        <label htmlFor="registrationDeadline" className="block text-sm font-medium text-gray-300 mb-1">
          Registration Deadline
        </label>
        <input
          type="date"
          id="registrationDeadline"
          name="registrationDeadline"
          value={formData.registrationDeadline || ''}
          onChange={handleDateChange}
          max={formData.startDate}
          className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
        />
        <p className="mt-1 text-xs text-gray-500">
          Leave blank for no deadline (registration until event starts)
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6">
        <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-1">
          Duration
        </label>
        <input
          type="text"
          id="duration"
          name="duration"
          value={formData.duration || ''}
          onChange={handleChange}
          placeholder="e.g., '3 hours', '2 days', etc."
          className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
        />
        <p className="mt-1 text-xs text-gray-500">
          Specify how long the event will last
        </p>
      </motion.div>
    </motion.div>
  );
};

export default EventDateTime;
