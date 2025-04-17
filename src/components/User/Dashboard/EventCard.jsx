/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Heart, MapPin, Users, Clock, ArrowRight, Share2 } from 'lucide-react';

const EventCard = ({ event }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="bg-black border border-gray-800 rounded-2xl overflow-hidden cursor-pointer relative group"
      whileHover={{
        y: -8,
        boxShadow: '0 20px 30px -10px rgba(8, 145, 178, 0.15)',
        borderColor: 'rgba(8, 145, 178, 0.3)'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Glowing effect on hover */}
      <motion.div
        className="absolute inset-0 bg-cyan-500 rounded-2xl opacity-0 blur-xl z-0"
        animate={{ opacity: isHovered ? 0.06 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Category Badge - Always visible */}
      <div className="absolute top-4 left-4 z-10">
        <motion.span
          className="bg-black/70 backdrop-blur-sm text-cyan-500 text-xs px-3 py-1 rounded-full border border-cyan-500/30"
          whileHover={{ scale: 1.05, backgroundColor: "rgba(8, 145, 178, 0.2)" }}
        >
          {event.category}
        </motion.span>
      </div>

      {/* Event Image with Overlay */}
      <div className="relative overflow-hidden">
        <motion.img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover"
          animate={{
            scale: isHovered ? 1.05 : 1,
            filter: isHovered ? 'brightness(0.7)' : 'brightness(0.9)'
          }}
          transition={{ duration: 0.4 }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"
          animate={{ opacity: isHovered ? 0.9 : 0.7 }}
          transition={{ duration: 0.3 }}
        />

        {/* Like Button - Top right */}
        <motion.button
          className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm text-white p-2 rounded-full border border-gray-700 hover:border-cyan-500 hover:text-cyan-500 transition-colors z-10"
          whileTap={{ scale: 0.9 }}
          whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
        >
          <Heart size={16} className="hover:fill-cyan-500" />
        </motion.button>
      </div>

      {/* Content Section */}
      <div className="p-5 relative z-10">
        {/* Title with hover animation */}
        <motion.h3
          className="font-bold text-lg text-white mb-2"
          animate={{ color: isHovered ? 'rgb(8, 145, 178)' : 'white' }}
          transition={{ duration: 0.3 }}
        >
          {event.title}
        </motion.h3>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-400 text-xs">
            <Calendar size={14} className="mr-2 text-cyan-500/70" />
            <span>{event.date}</span>
            {event.time && (
              <>
                <Clock size={14} className="ml-3 mr-2 text-cyan-500/70" />
                <span>{event.time}</span>
              </>
            )}
          </div>

          <div className="flex items-center text-gray-400 text-xs">
            <MapPin size={14} className="mr-2 text-cyan-500/70" />
            <span>{event.location}</span>
          </div>

          {event.attendees && (
            <div className="flex items-center text-gray-400 text-xs">
              <Users size={14} className="mr-2 text-cyan-500/70" />
              <span>{event.attendees} attendees</span>
            </div>
          )}
        </div>

        {/* Action Buttons - With cool hover effects */}
        <div className="flex gap-3 items-center">
          

          <motion.button
            className="bg-black border border-cyan-500/30 text-cyan-500 p-2 rounded-lg text-sm hover:bg-cyan-500/10 cursor-pointer"
            whileHover={{ borderColor: 'rgb(8, 145, 178, 0.5)' }}
            whileTap={{ scale: 0.95 }}
          >
            <Share2 size={16} />
          </motion.button>
        </div>
      </div>

      {/* View Details Overlay - Appears on hover */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 pointer-events-none"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          className="px-6 py-3 rounded-xl bg-gradient-to-r bg-cyan-400 text-black font-medium transition-colors cursor-pointer flex items-center space-x-2 hover:bg-black hover:text-cyan-400 hover:border hover:border-cyan-400"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          View Details
          <ArrowRight size={16} />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default EventCard;