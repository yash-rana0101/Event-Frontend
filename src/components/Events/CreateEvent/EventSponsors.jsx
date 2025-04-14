/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Plus, Trash2 } from 'lucide-react';

const EventSponsors = ({ formData, updateFormData, errors }) => {
  // Add a new sponsor
  const addSponsor = () => {
    const newSponsors = [...formData.sponsors, { name: '', tier: 'gold', logo: '', website: '' }];
    updateFormData({ sponsors: newSponsors });
  };

  // Remove a sponsor
  const removeSponsor = (index) => {
    const newSponsors = [...formData.sponsors];
    newSponsors.splice(index, 1);
    updateFormData({ sponsors: newSponsors });
  };

  // Update a sponsor
  const updateSponsor = (index, field, value) => {
    const newSponsors = [...formData.sponsors];
    newSponsors[index][field] = value;
    updateFormData({ sponsors: newSponsors });
  };

  // Sponsor tier options
  const tierOptions = [
    { value: 'platinum', label: 'Platinum' },
    { value: 'gold', label: 'Gold' },
    { value: 'silver', label: 'Silver' },
    { value: 'bronze', label: 'Bronze' },
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
      <div className="mb-6">
        <motion.h2 variants={itemVariants} className="text-2xl font-bold text-cyan-400 mb-1">
          Event Sponsors
        </motion.h2>
        <motion.p variants={itemVariants} className="text-gray-400 text-sm">
          Add information about your event sponsors
        </motion.p>
      </div>

      <div className="space-y-6">
        {formData.sponsors.length > 0 ? (
          formData.sponsors.map((sponsor, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-gray-800 rounded-lg p-5 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Sponsor {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeSponsor(index)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Sponsor Name
                  </label>
                  <input
                    type="text"
                    value={sponsor.name}
                    onChange={(e) => updateSponsor(index, 'name', e.target.value)}
                    placeholder="Company/Organization name"
                    className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Sponsor Tier
                  </label>
                  <select
                    value={sponsor.tier}
                    onChange={(e) => updateSponsor(index, 'tier', e.target.value)}
                    className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 text-white"
                  >
                    {tierOptions.map((tier) => (
                      <option key={tier.value} value={tier.value}>{tier.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Logo URL
                  </label>
                  <input
                    type="text"
                    value={sponsor.logo}
                    onChange={(e) => updateSponsor(index, 'logo', e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Website URL
                  </label>
                  <input
                    type="text"
                    value={sponsor.website}
                    onChange={(e) => updateSponsor(index, 'website', e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500"
                  />
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div variants={itemVariants} className="text-center py-8">
            <Briefcase className="mx-auto h-12 w-12 text-gray-500 mb-3" />
            <p className="text-gray-400">No sponsors added yet</p>
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <button
            type="button"
            onClick={addSponsor}
            className="w-full py-3 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-cyan-400 rounded-lg transition-colors border border-gray-700"
          >
            <Plus size={18} />
            <span>Add Sponsor</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EventSponsors;
