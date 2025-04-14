/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Plus, Trash2 } from 'lucide-react';

const EventTimeline = ({ formData, updateFormData, errors }) => {
  // Add a new timeline item
  const addTimelineItem = () => {
    const newTimeline = [...formData.timeline, { time: '', event: '' }];
    updateFormData({ timeline: newTimeline });
  };

  // Remove a timeline item
  const removeTimelineItem = (index) => {
    const newTimeline = [...formData.timeline];
    newTimeline.splice(index, 1);
    updateFormData({ timeline: newTimeline });
  };

  // Update a timeline item
  const updateTimelineItem = (index, field, value) => {
    const newTimeline = [...formData.timeline];
    newTimeline[index][field] = value;
    updateFormData({ timeline: newTimeline });
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
          Event Timeline
        </motion.h2>
        <motion.p variants={itemVariants} className="text-gray-400 text-sm">
          Create a detailed schedule for your event
        </motion.p>
      </div>

      <div className="space-y-6">
        {formData.timeline.length > 0 ? (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-700"></div>

            {/* Timeline Items */}
            {formData.timeline.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative pl-12 mb-6"
              >
                {/* Timeline Dot */}
                <div className="absolute left-0 top-6 w-12 h-12 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-cyan-500 border-4 border-black z-10"></div>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white text-lg font-medium">Item {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeTimelineItem(index)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Time / Title
                      </label>
                      <input
                        type="text"
                        value={item.time}
                        onChange={(e) => updateTimelineItem(index, 'time', e.target.value)}
                        placeholder="e.g., '9:00 AM', 'Day 1', etc."
                        className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        value={item.event}
                        onChange={(e) => updateTimelineItem(index, 'event', e.target.value)}
                        placeholder="Describe this timeline item"
                        className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500 resize-none"
                        rows="2"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div variants={itemVariants} className="text-center py-8">
            <Clock className="mx-auto h-12 w-12 text-gray-500 mb-3" />
            <p className="text-gray-400">No timeline items added yet</p>
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <button
            type="button"
            onClick={addTimelineItem}
            className="w-full py-3 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-cyan-400 rounded-lg transition-colors border border-gray-700"
          >
            <Plus size={18} />
            <span>Add Timeline Item</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EventTimeline;
