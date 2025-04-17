/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';

const NavItem = ({ icon, label, active, onClick, badge }) => {
  return (
    <motion.li
      className={`flex items-center p-3 rounded-md cursor-pointer transition-all ${active
          ? 'bg-gradient-to-r from-cyan-500/80 to-cyan-600/80 text-white'
          : 'text-gray-300 hover:bg-cyan-500/10'
        }`}
      onClick={onClick}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="mr-3 text-cyan-400">
        {icon}
      </div>
      <span className={`${active ? 'font-medium' : ''}`}>{label}</span>
      {badge && (
        <span className="ml-auto bg-cyan-300 text-cyan-800 text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {badge}
        </span>
      )}
      {active && (
        <motion.div
          layoutId="sidebar-active-indicator"
          className="absolute right-0 w-1 h-8 bg-cyan-400 rounded-l-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.li>
  );
};

export default NavItem;
