import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const ToggleSwitch = ({
  value,
  onChange,
  label,
  description,
  color = 'bg-cyan-500',
  disabled = false
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white font-medium">{label}</p>
        {description && <p className="text-gray-400 text-sm">{description}</p>}
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => !disabled && onChange(!value)}
        disabled={disabled}
        className={`relative w-14 h-7 rounded-full transition-colors ${value ? color : 'bg-gray-600'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <motion.div
          className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-lg"
          animate={{ x: value ? 28 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </div>
  );
};

export default ToggleSwitch;
