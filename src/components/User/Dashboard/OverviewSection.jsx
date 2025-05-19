/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Star, Heart, Bell, MessageCircle, HelpCircle, Phone, Ticket } from 'lucide-react';

const OverviewSection = ({ title, icon, children }) => {
  const getIcon = () => {
    switch (icon) {
      case 'star': return <Star size={20} />;
      case 'heart': return <Heart size={20} />;
      case 'bell': return <Bell size={20} />;
      case 'message': return <MessageCircle size={20} />;
      case 'help': return <HelpCircle size={20} />;
      case 'phone': return <Phone size={20} />;
      case 'ticket': return <Ticket size={20} />;
      default: return <Calendar size={20} />;
    }
  };

  return (
    <motion.div
      className="bg-gray-900/40 backdrop-blur-sm rounded-xl shadow-md overflow-hidden border border-gray-800/50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ boxShadow: '0 10px 25px -5px rgba(8, 145, 178, 0.1)' }}
    >
      <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-black p-3 flex items-center">
        <div className="mr-2 bg-black/20 p-1 rounded">
          {getIcon()}
        </div>
        <h2 className="font-bold">{title}</h2>
      </div>
      <div className="p-4">
        {children}
      </div>
    </motion.div>
  );
};

export default OverviewSection;
