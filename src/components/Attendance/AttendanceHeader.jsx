/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const AttendanceHeader = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="w-full bg-gradient-to-r from-black via-black to-cyan-950 py-8 px-4 md:px-8 border-b border-cyan-900/30"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-cyan-400 hover:text-cyan-300 mb-4 md:mb-0"
          >
            <ArrowLeft size={18} className="mr-1" />
            Back
          </button>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-cyan-500">Event Attendance Management</h1>
        </div>

        <p className="text-gray-400 mt-2 max-w-3xl">
          View and manage attendance for all your events. Export attendance lists or view detailed attendance information.
        </p>
      </div>
    </motion.div>
  );
};

export default AttendanceHeader;
