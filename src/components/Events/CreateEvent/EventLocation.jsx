import React from 'react';
/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import { MapPin, Globe } from 'lucide-react';

const EventLocation = ({ formData, updateFormData, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({
      location: {
        ...formData.location,
        [name]: value
      }
    });
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

  // List of countries
  const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
    "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
    "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
    "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
    "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador",
    "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
    "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
    "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
    "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South",
    "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein",
    "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania",
    "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
    "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway",
    "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
    "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
    "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
    "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
    "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
    "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela",
    "Vietnam", "Yemen", "Zambia", "Zimbabwe"
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="mb-6">
        <motion.h2 variants={itemVariants} className="text-2xl font-bold text-cyan-400 mb-1">
          Event Location
        </motion.h2>
        <motion.p variants={itemVariants} className="text-gray-400 text-sm">
          Where will your event be held?
        </motion.p>
      </div>

      <motion.div variants={itemVariants} className="mb-6">
        <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">
          Address <span className="text-cyan-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin size={18} className="text-cyan-500" />
          </div>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.location.address}
            onChange={handleChange}
            placeholder="Street address, venue name, etc."
            className={`w-full pl-10 pr-4 py-3 bg-black border ${errors.address ? 'border-red-500' : 'border-gray-700'
              } rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500`}
            required
          />
        </div>
        {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <motion.div variants={itemVariants}>
          <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">
            City <span className="text-cyan-500">*</span>
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.location.city}
            onChange={handleChange}
            placeholder="City"
            className={`w-full px-4 py-3 bg-black border ${errors.city ? 'border-red-500' : 'border-gray-700'
              } rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500`}
            required
          />
          {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
        </motion.div>

        <motion.div variants={itemVariants}>
          <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-1">
            State/Province
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.location.state}
            onChange={handleChange}
            placeholder="State or province (optional)"
            className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <motion.div variants={itemVariants}>
          <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-1">
            Country <span className="text-cyan-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe size={18} className="text-cyan-500" />
            </div>
            <select
              id="country"
              name="country"
              value={formData.location.country}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 bg-black border ${errors.country ? 'border-red-500' : 'border-gray-700'
                } rounded-lg focus:outline-none focus:border-cyan-500 text-white appearance-none`}
              required
            >
              <option value="" disabled>Select a country</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country}</p>}
        </motion.div>

        <motion.div variants={itemVariants}>
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-300 mb-1">
            Postal/Zip Code
          </label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.location.zipCode}
            onChange={handleChange}
            placeholder="Postal or zip code (optional)"
            className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500"
          />
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="mt-6">
        <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="ml-3 text-sm text-cyan-300">
              Provide clear location details so attendees can easily find your event. The full address will only be shared with registered attendees.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EventLocation;
