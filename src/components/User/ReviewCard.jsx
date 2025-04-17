import React, { useState } from 'react';
import { Clock, MapPin, MessageCircle, Share2, Edit, Star, Image, ChevronDown, ChevronUp, Heart } from 'lucide-react';

const ReviewCard = ({ event, expanded: initialExpanded = false, toggleExpand: externalToggle }) => {
  const [expanded, setExpanded] = useState(initialExpanded);

  const toggleExpand = () => {
    const newState = !expanded;
    setExpanded(newState);
    if (externalToggle) externalToggle(newState);
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating
          ? "text-cyan-500 fill-cyan-500"
          : "text-gray-700"
        }
      />
    ));
  };

  return (
    <div className="bg-black border border-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-cyan-500 group">
      {/* Card header with gradient accent */}
      <div className="h-1 w-full bg-gradient-to-r from-cyan-500 to-transparent"></div>

      <div className="p-5">
        {/* Event details section */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Event image with hover effect */}
          <div className="relative w-full sm:w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
          </div>

          {/* Event info */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <h3 className="font-semibold text-lg text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-cyan-300">
                {event.name}
              </h3>
              <div className="flex items-center">
                {renderStars(event.rating)}
                <span className="ml-2 text-white text-sm font-medium">{event.rating}.0</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-2 text-gray-300 text-sm">
              <div className="flex items-center">
                <Clock size={14} className="mr-2 text-cyan-500" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center">
                <MapPin size={14} className="mr-2 text-cyan-500" />
                <span className="truncate max-w-xs">{event.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-gray-800"></div>

        {/* Review Content Section */}
        <div>
          {/* Review header */}
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-white flex items-center">
              <MessageCircle size={16} className="mr-2 text-cyan-500" />
              My Review
            </h4>
            <button
              onClick={toggleExpand}
              className="flex items-center gap-1 text-sm text-cyan-500 hover:text-cyan-400 transition-colors py-1 px-2 rounded-md hover:bg-cyan-500/10"
            >
              {expanded ? (
                <>
                  <span>Show Less</span>
                  <ChevronUp size={14} />
                </>
              ) : (
                <>
                  <span>Show More</span>
                  <ChevronDown size={14} />
                </>
              )}
            </button>
          </div>

          {/* Review text with animation */}
          <div className="relative overflow-hidden transition-all duration-300"
            style={{ maxHeight: expanded ? '1000px' : '80px' }}>
            <p className="text-gray-300 text-sm leading-relaxed">
              {event.review}
            </p>

            {/* Gradient fade for collapsed state */}
            {!expanded && (
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black to-transparent"></div>
            )}
          </div>

          {/* Review Photos with hover effects */}
          {event.photos.length > 0 && expanded && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-white">
                <Image size={16} className="mr-2 text-cyan-500" />
                <h4 className="text-sm font-medium">Photos</h4>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                {event.photos.map((photo, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden group/photo">
                    <img
                      src={photo}
                      alt={`Event photo ${index + 1}`}
                      className="w-full h-full object-cover transform group-hover/photo:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center">
                      <Heart size={20} className="text-cyan-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex justify-end items-center gap-3 mt-4">
          <button className="text-gray-400 hover:text-cyan-500 transition-colors text-sm flex items-center gap-1 py-1 px-2 rounded-md hover:bg-cyan-500/10">
            <Edit size={14} />
            <span className="hidden sm:inline">Edit Review</span>
          </button>
          <button className="text-gray-400 hover:text-cyan-500 transition-colors text-sm flex items-center gap-1 py-1 px-2 rounded-md hover:bg-cyan-500/10">
            <Share2 size={14} />
            <span className="hidden sm:inline">Share</span>
          </button>
          <button className="bg-cyan-500 text-black font-medium text-sm py-1 px-3 rounded-md hover:bg-cyan-400 transition-colors flex items-center gap-1">
            <Heart size={14} className="fill-current" />
            <span>Like</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;