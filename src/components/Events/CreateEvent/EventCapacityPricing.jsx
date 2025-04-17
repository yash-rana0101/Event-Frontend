import React from 'react';
/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import { Users, DollarSign } from 'lucide-react';

const EventCapacityPricing = ({ formData, updateFormData, errors }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      updateFormData({ [name]: checked });
      // Reset price to 0 if event is set to free
      if (name === 'isPaid' && !checked) {
        updateFormData({ price: 0 });
      }
    } else if (type === 'number') {
      updateFormData({ [name]: parseInt(value) || 0 });
    } else {
      updateFormData({ [name]: value });
    }
  };

  // Currency options
  const currencies = [
    { code: 'USD', name: 'US Dollar ($)' },
    { code: 'EUR', name: 'Euro (€)' },
    { code: 'GBP', name: 'British Pound (£)' },
    { code: 'CAD', name: 'Canadian Dollar (C$)' },
    { code: 'AUD', name: 'Australian Dollar (A$)' },
    { code: 'JPY', name: 'Japanese Yen (¥)' },
    { code: 'CNY', name: 'Chinese Yuan (¥)' },
    { code: 'INR', name: 'Indian Rupee (₹)' },
    { code: 'BRL', name: 'Brazilian Real (R$)' },
    { code: 'ZAR', name: 'South African Rand (R)' }
  ];

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
      <div className="mb-8">
        <motion.h2 variants={itemVariants} className="text-2xl font-bold text-cyan-400 mb-1">
          Capacity & Pricing
        </motion.h2>
        <motion.p variants={itemVariants} className="text-gray-400 text-sm">
          Set attendance limits and pricing options for your event
        </motion.p>
      </div>

      {/* Capacity */}
      <motion.div variants={itemVariants} className="mb-10">
        <h3 className="text-lg font-semibold text-white mb-4">Capacity</h3>

        <div className="relative">
          <label htmlFor="capacity" className="block text-sm font-medium text-gray-300 mb-1">
            Maximum Attendees
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Users size={18} className="text-cyan-500" />
            </div>
            <input
              type="text"
              id="capacity"
              name="capacity"
              min="0"
              onChange={handleChange}
              placeholder="Leave as 0 for unlimited capacity"
              className="w-full pl-10 pr-4 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Set to 0 for unlimited attendance
          </p>
        </div>
      </motion.div>

      {/* Pricing */}
      <motion.div variants={itemVariants}>
        <h3 className="text-lg font-semibold text-white mb-4">Pricing</h3>

        <div className="mb-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="isPaid"
              checked={formData.isPaid}
              onChange={handleChange}
              className="sr-only"
            />
            <div className={`relative w-12 h-6 rounded-full transition-all duration-200 ${formData.isPaid ? 'bg-cyan-500' : 'bg-gray-700'}`}>
              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all duration-200 transform ${formData.isPaid ? 'translate-x-6' : ''}`}></div>
            </div>
            <span className="ml-3 text-gray-300">This is a paid event</span>
          </label>
        </div>

        {formData.isPaid && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">
                Ticket Price <span className="text-cyan-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign size={18} className="text-cyan-500" />
                </div>
                <input
                  type="text"
                  id="price"
                  name="price"
                  min="0"
                  step="0.01"
                  onChange={handleChange}
                  placeholder="0.00"
                  className={`w-full pl-10 pr-4 py-3 bg-black border ${errors.price ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500`}
                  required={formData.isPaid}
                />
              </div>
              {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
            </div>

            {/* Currency */}
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-300 mb-1">
                Currency <span className="text-cyan-500">*</span>
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-black border ${errors.currency ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg focus:outline-none focus:border-cyan-500 text-white`}
                required={formData.isPaid}
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>{currency.name}</option>
                ))}
              </select>
              {errors.currency && <p className="mt-1 text-sm text-red-500">{errors.currency}</p>}
            </div>
          </motion.div>
        )}

        {/* Pricing insights */}
        <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="ml-3 text-sm text-cyan-300">
              {formData.isPaid
                ? `Consider your audience and event value when setting a price. Remember to factor in any platform fees.`
                : `Free events typically attract more registrations, but may have higher no-show rates.`
              }
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EventCapacityPricing;
