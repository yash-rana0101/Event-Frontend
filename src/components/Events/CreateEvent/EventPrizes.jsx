/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Plus, Trash2 } from 'lucide-react';

const EventPrizes = ({ formData, updateFormData, errors }) => {
  // Add a new prize
  const addPrize = () => {
    const newPrizes = [...formData.prizes, { place: '', amount: '', description: '' }];
    updateFormData({ prizes: newPrizes });
  };

  // Remove a prize
  const removePrize = (index) => {
    const newPrizes = [...formData.prizes];
    newPrizes.splice(index, 1);
    updateFormData({ prizes: newPrizes });
  };

  // Update a prize
  const updatePrize = (index, field, value) => {
    const newPrizes = [...formData.prizes];
    newPrizes[index][field] = value;
    updateFormData({ prizes: newPrizes });
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
          Prizes & Awards
        </motion.h2>
        <motion.p variants={itemVariants} className="text-gray-400 text-sm">
          Define prizes for your event winners
        </motion.p>
      </div>

      <div className="space-y-6">
        {formData.prizes.length > 0 ? (
          formData.prizes.map((prize, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`rounded-lg p-5 border ${index === 0
                ? "bg-gradient-to-r from-yellow-400/20 to-transparent border-yellow-400/30"
                : index === 1
                  ? "bg-gradient-to-r from-gray-400/20 to-transparent border-gray-400/30"
                  : index === 2
                    ? "bg-gradient-to-r from-amber-600/20 to-transparent border-amber-600/30"
                    : "bg-gray-800 border-gray-700"
                }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">
                  {index === 0 ? "🥇 First Place" : index === 1 ? "🥈 Second Place" : index === 2 ? "🥉 Third Place" : `Prize ${index + 1}`}
                </h3>
                <button
                  type="button"
                  onClick={() => removePrize(index)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Prize Title
                  </label>
                  <input
                    type="text"
                    value={prize.place}
                    onChange={(e) => updatePrize(index, 'place', e.target.value)}
                    placeholder="e.g., 'Grand Prize', 'First Place', etc."
                    className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Prize Amount/Value
                  </label>
                  <input
                    type="text"
                    value={prize.amount}
                    onChange={(e) => updatePrize(index, 'amount', e.target.value)}
                    placeholder="e.g., '$1000', 'Gaming PC', etc."
                    className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Prize Description
                  </label>
                  <textarea
                    value={prize.description}
                    onChange={(e) => updatePrize(index, 'description', e.target.value)}
                    placeholder="Describe this prize"
                    className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500 resize-none"
                    rows="2"
                  />
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div variants={itemVariants} className="text-center py-8">
            <Trophy className="mx-auto h-12 w-12 text-gray-500 mb-3" />
            <p className="text-gray-400">No prizes added yet</p>
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <button
            type="button"
            onClick={addPrize}
            className="w-full py-3 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-cyan-400 rounded-lg transition-colors border border-gray-700"
          >
            <Plus size={18} />
            <span>Add Prize</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EventPrizes;
