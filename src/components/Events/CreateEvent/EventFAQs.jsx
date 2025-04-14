/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Plus, Trash2 } from 'lucide-react';

const EventFAQs = ({ formData, updateFormData, errors }) => {
  // Add a new FAQ
  const addFAQ = () => {
    const newFAQs = [...formData.faqs, { question: '', answer: '' }];
    updateFormData({ faqs: newFAQs });
  };

  // Remove a FAQ
  const removeFAQ = (index) => {
    const newFAQs = [...formData.faqs];
    newFAQs.splice(index, 1);
    updateFormData({ faqs: newFAQs });
  };

  // Update a FAQ
  const updateFAQ = (index, field, value) => {
    const newFAQs = [...formData.faqs];
    newFAQs[index][field] = value;
    updateFormData({ faqs: newFAQs });
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
          Frequently Asked Questions
        </motion.h2>
        <motion.p variants={itemVariants} className="text-gray-400 text-sm">
          Add FAQs to help your attendees
        </motion.p>
      </div>

      <div className="space-y-6">
        {formData.faqs.length > 0 ? (
          formData.faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-gray-800 rounded-lg p-5 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">FAQ {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeFAQ(index)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Question
                  </label>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                    placeholder="Enter a common question"
                    className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Answer
                  </label>
                  <textarea
                    value={faq.answer}
                    onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                    placeholder="Provide a helpful answer"
                    className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 text-white placeholder-gray-500 resize-none"
                    rows="3"
                  />
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div variants={itemVariants} className="text-center py-8">
            <HelpCircle className="mx-auto h-12 w-12 text-gray-500 mb-3" />
            <p className="text-gray-400">No FAQs added yet</p>
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <button
            type="button"
            onClick={addFAQ}
            className="w-full py-3 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-cyan-400 rounded-lg transition-colors border border-gray-700"
          >
            <Plus size={18} />
            <span>Add FAQ</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EventFAQs;
