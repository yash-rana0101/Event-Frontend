/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Heart, MapPin, Users, Clock, ArrowRight, Share2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event, onSave, onShare }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(event.isSaved || false);
  const [isSharing, setIsSharing] = useState(false);
  const navigate = useNavigate();

  // Handle save button click
  const handleSave = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    if (onSave) {
      onSave(event.id, isSaved);
    }
  };

  // Handle view details click
  const handleViewDetails = () => {
    // Navigate to event detail page
    navigate(`/event/${event.id}`);
  };

  // Handle share button click
  const handleShare = (e) => {
    e.stopPropagation();
    setIsSharing(true);

    // Create shareable link
    const eventUrl = `${window.location.origin}/event/${event.id}`;

    // Use Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: event.title || event.name,
        text: `Check out this event: ${event.title || event.name}`,
        url: eventUrl
      })
        .then(() => {
          console.log('Successfully shared');
          if (onShare) onShare(event.id, 'success');
        })
        .catch((error) => {
          console.error('Error sharing:', error);
          if (onShare) onShare(event.id, 'error', error);
        })
        .finally(() => {
          setIsSharing(false);
        });
    } else {
      // Fallback for browsers that don't support Web Share API
      try {
        navigator.clipboard.writeText(eventUrl);
        // Show feedback that URL was copied - this would typically be handled by a toast
        if (onShare) onShare(event.id, 'copied');
        setTimeout(() => setIsSharing(false), 1500);
      } catch (err) {
        console.error('Failed to copy URL', err);
        if (onShare) onShare(event.id, 'error', err);
        setIsSharing(false);
      }
    }
  };

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
      onClick={handleViewDetails}
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
          {event.category || event.type || 'Event'}
        </motion.span>
      </div>

      {/* Event Image with Overlay */}
      <div className="relative overflow-hidden">
        <motion.img
          src={event.image || '/assets/event-placeholder.jpg'} // Add a default placeholder
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
          onClick={handleSave}
        >
          <Heart
            size={16}
            className={isSaved ? "fill-cyan-500 text-cyan-500" : "hover:fill-cyan-500"}
          />
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
          {event.title || event.name}
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
            <span>{event.location || 'Online'}</span>
          </div>

          {event.attendees && (
            <div className="flex items-center text-gray-400 text-xs">
              <Users size={14} className="mr-2 text-cyan-500/70" />
              <span>{event.attendees} attendees</span>
            </div>
          )}
        </div>

        {/* Action Buttons - With dynamic behavior */}
        <div className="flex gap-3 items-center justify-between">
          {/* Share Button */}
          <motion.button
            className={`bg-black border border-cyan-500/30 text-cyan-500 p-2 rounded-lg text-sm hover:bg-cyan-500/10 cursor-pointer flex items-center ${isSharing ? 'opacity-50' : ''}`}
            whileHover={{ borderColor: 'rgb(8, 145, 178, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            disabled={isSharing}
          >
            <Share2 size={16} />
            {isSharing && <span className="ml-2 text-xs">Copied!</span>}
          </motion.button>

          {/* View Details link (visible on desktop without hovering) */}
          <motion.button
            className="hidden md:flex items-center text-xs text-cyan-500 hover:underline"
            onClick={handleViewDetails}
            whileHover={{ x: 2 }}
          >
            View Details
            <ArrowRight size={12} className="ml-1" />
          </motion.button>
        </div>
      </div>

      {/* View Details Overlay - Appears on hover (for desktop) or on touch devices */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 pointer-events-none"
        animate={{
          opacity: isHovered ? 1 : 0,
          pointerEvents: isHovered ? 'auto' : 'none'
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          className="px-6 py-3 rounded-xl bg-gradient-to-r bg-cyan-400 text-black font-medium transition-colors cursor-pointer flex items-center hover:bg-black hover:text-cyan-400 hover:border hover:border-cyan-400"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleViewDetails}
        >
          View Details
          <ArrowRight size={16} className="ml-2" />
        </motion.button>
      </motion.div>

      {/* Mobile touch indicator (subtle hint for mobile users) */}
      <div className="absolute bottom-2 right-2 md:hidden">
        <ExternalLink size={14} className="text-gray-500" />
      </div>
    </motion.div>
  );
};

export default EventCard;