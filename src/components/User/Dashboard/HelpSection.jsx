/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import OverviewSection from './OverviewSection';

const HelpSection = ({ setActiveTab, overview = false }) => {
  if (overview) {
    return (
      <OverviewSection title="FAQs & Help" icon="help">
        <div className="p-4 bg-black/30 backdrop-blur-sm rounded-lg">
          <h3 className="font-medium text-cyan-400">How do I book tickets?</h3>
          <p className="text-gray-300 mt-2 text-sm">You can book tickets by navigating to the event page and clicking the "Book Ticket" button.</p>
        </div>
        <div className="mt-4 text-right">
          <motion.button
            className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center ml-auto transition-colors"
            onClick={() => setActiveTab('help')}
            whileHover={{ x: 3 }}
          >
            View All FAQs <span className="ml-1">→</span>
          </motion.button>
        </div>
      </OverviewSection>
    );
  }

  const faqItems = [
    {
      question: "How do I book tickets?",
      answer: "You can book tickets by navigating to the event page and clicking the \"Book Ticket\" button. Follow the instructions to complete your purchase."
    },
    {
      question: "Can I cancel my ticket?",
      answer: "Yes, you can cancel your ticket up to 48 hours before the event. A refund will be processed according to our refund policy."
    },
    {
      question: "How do I contact the organizer?",
      answer: "You can contact the organizer by clicking on the \"Contact Organizer\" button on the event page or by visiting the \"Contact\" section."
    }
  ];

  return (
    <motion.div
      className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 shadow-md border border-gray-800/50"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">FAQs & Help Desk</h2>
      <div className="space-y-6">
        {faqItems.map((faq, index) => (
          <motion.div
            key={index}
            className="p-4 bg-black/30 backdrop-blur-sm rounded-lg border border-gray-800/50 hover:border-cyan-500/30 transition-colors"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -2 }}
          >
            <h3 className="font-medium text-cyan-400">{faq.question}</h3>
            <p className="text-gray-300 mt-2">{faq.answer}</p>
          </motion.div>
        ))}

        <motion.button
          className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-black px-6 py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-cyan-700 transition-colors shadow-lg"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          Contact Support
        </motion.button>
      </div>
    </motion.div>
  );
};

export default HelpSection;
