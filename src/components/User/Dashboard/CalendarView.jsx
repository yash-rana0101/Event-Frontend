/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarView = ({ calendarDays }) => {
  const [hoveredDay, setHoveredDay] = useState(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.2
      }
    }
  };

  const dayVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };

  // Use full weekday names to create unique keys
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  // Use shorter display names
  const displayWeekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      <motion.div
        className="w-full bg-black bg-opacity-80 backdrop-blur-md rounded-2xl p-4 md:p-6 shadow-xl border border-cyan-900/30 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Background design elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500 opacity-5 rounded-full -mr-16 -mt-16 blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500 opacity-5 rounded-full -ml-12 -mb-12 blur-xl"></div>

        {/* Header section */}
        <div className="flex items-center justify-between mb-6 border-b pb-4 border-cyan-800/90">
          <motion.div
            className="flex items-center"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Calendar className="text-cyan-500 mr-2 h-5 w-5" />
            <h2 className="text-lg md:text-xl font-bold text-white bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-500/50">
              Calendar
            </h2>
          </motion.div>

          <div className="flex space-x-2">
            <motion.button
              className="p-1.5 rounded-full bg-black border border-cyan-900/50 text-cyan-500 hover:bg-cyan-900/20 cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={16} />
            </motion.button>
            <motion.button
              className="p-1.5 rounded-full bg-black border border-cyan-900/50 text-cyan-500 hover:bg-cyan-900/20 cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={16} />
            </motion.button>
          </div>
        </div>

        {/* Weekday headers - Using index to ensure unique keys */}
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
          {displayWeekdays.map((day, index) => (
            <div key={`weekday-${index}`} className="text-center text-xs md:text-sm font-medium text-gray-400 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <motion.div
          className="grid grid-cols-7 gap-1 md:gap-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {calendarDays.map((day, index) => {
            const isPresent = day.status === 'present';

            return (
              <motion.div
                key={`calday-${index}`}
                variants={dayVariants}
                className="aspect-square relative"
                onMouseEnter={() => setHoveredDay(index)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                <motion.div
                  className={`
                    w-full h-full flex items-center justify-center rounded-lg cursor-pointer text-sm md:text-base
                    ${isPresent
                      ? 'bg-gradient-to-br from-cyan-500/90 to-cyan-600/80 text-black font-medium'
                      : 'bg-black/40 border border-gray-800/30 text-gray-400'}
                  `}
                  whileHover={{
                    scale: 1.1,
                    boxShadow: isPresent ? '0 0 8px rgba(6, 182, 212, 0.6)' : 'none',
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {day.day}

                  {/* Show indicator dot for days with events */}
                  {day.events && day.events.length > 0 && (
                    <div className="absolute bottom-1 w-1 h-1 rounded-full bg-white"></div>
                  )}
                </motion.div>

                {/* Event tooltip on hover */}
                {hoveredDay === index && day.events && day.events.length > 0 && (
                  <motion.div
                    className="absolute z-10 bg-gray-900 border border-cyan-900/50 text-xs text-white p-2 rounded shadow-lg"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {day.events[0].title}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs md:text-sm">
          <div className="flex items-center">
            <motion.div
              className="w-3 h-3 md:w-4 md:h-4 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full mr-2"
              whileHover={{ scale: 1.2 }}
            ></motion.div>
            <span className="text-gray-300">Present</span>
          </div>
          <div className="flex items-center">
            <motion.div
              className="w-3 h-3 md:w-4 md:h-4 bg-black border border-gray-700 rounded-full mr-2"
              whileHover={{ scale: 1.2 }}
            ></motion.div>
            <span className="text-gray-300">Absent</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CalendarView;