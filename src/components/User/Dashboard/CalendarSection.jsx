/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight } from 'lucide-react';
import OverviewSection from './OverviewSection';

const CalendarSection = ({ calendarDays, setActiveTab }) => {
  // Get current date for highlighting today
  const today = new Date().getDate();

  return (
    <OverviewSection title="Calendar" icon="calendar">
      <motion.div
        className="bg-black/40 backdrop-blur-md rounded-xl p-4 shadow-lg border border-cyan-900/20 overflow-hidden relative"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Decorative elements */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl"></div>

        {/* Month indicator */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Calendar size={16} className="text-cyan-500" />
            <span className="text-xs font-medium text-gray-300">April 2025</span>
          </div>
          <div className="h-px flex-grow mx-2 bg-gradient-to-r from-transparent via-cyan-900/30 to-transparent"></div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-cyan-500/80">{day}</div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const isPresent = day.status === 'present';
            const isToday = day.day === today;

            return (
              <motion.div
                key={index}
                className={`
                  relative aspect-square flex items-center justify-center 
                  text-xs md:text-sm rounded-md cursor-pointer group
                  ${isPresent
                    ? 'bg-cyan-500/90 text-black font-medium'
                    : 'bg-black/30 text-gray-400 hover:bg-gray-800/50'}
                  ${isToday ? 'ring-1 ring-cyan-400/50' : ''}
                `}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                {day.day}

                {/* Indicator dot for present days */}
                {isPresent && (
                  <motion.div
                    className="absolute -bottom-0.5 w-1 h-1 bg-white rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 * index, duration: 0.2 }}
                  />
                )}

                {/* Day hover effect */}
                <motion.div
                  className="absolute inset-0 rounded-md bg-cyan-500/0 group-hover:bg-cyan-500/10"
                  initial={false}
                  whileHover={{ opacity: 1 }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Legend and action button */}
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-cyan-500 rounded-full mr-1.5"></div>
              <span className="text-xs text-gray-300">Present</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-black border border-gray-700/70 rounded-full mr-1.5"></div>
              <span className="text-xs text-gray-300">Absent</span>
            </div>
          </div>

          <motion.button
            className="text-xs px-2 py-1 text-cyan-400 hover:text-cyan-300 flex items-center rounded-md hover:bg-cyan-900/20 transition-all cursor-pointer"
            onClick={() => setActiveTab('calendar')}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.97 }}
          >
            Full Calendar <ChevronRight size={14} className="ml-1" />
          </motion.button>
        </div>
      </motion.div>
    </OverviewSection>
  );
};

export default CalendarSection;