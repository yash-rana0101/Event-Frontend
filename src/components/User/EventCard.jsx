import React from 'react';
import { Clock, MapPin, BookmarkPlus, Calendar, ChevronRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  return (
    <div className="group relative bg-black border border-gray-800 rounded-xl overflow-hidden hover:border-cyan-500 transition-all duration-300">
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-bl-full z-0"></div>

      {/* Content container */}
      <div className="relative z-10">
        {/* Image section with overlay gradient */}
        <div className="relative">
          <div className="aspect-[16/9] md:aspect-[3/1] w-full overflow-hidden">
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>

          {/* Event type badge - top right */}
          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-cyan-500 border border-cyan-500 text-xs px-3 py-1 rounded-full">
            {event.type}
          </div>

          {/* Event date badge - bottom left */}
          <div className="absolute bottom-3 left-3 flex items-center bg-black/80 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-lg">
            <Calendar size={14} className="mr-2 text-cyan-500" />
            <span>{event.date}</span>
          </div>
        </div>

        {/* Content section */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-cyan-500 to-white bg-clip-text text-transparent leading-tight">
              {event.name}
            </h3>
            <button className="p-2 bg-black/50 border border-gray-800 rounded-full text-gray-400 hover:text-cyan-500 hover:border-cyan-500 transition-colors">
              <BookmarkPlus size={16} />
            </button>
          </div>

          {/* Event details */}
          <div className="space-y-2">
            <div className="flex items-center text-gray-300 text-sm">
              <Clock size={14} className="mr-2 text-cyan-500 flex-shrink-0" />
              <span className="truncate">{event.date}</span>
            </div>
            <div className="flex items-center text-gray-300 text-sm">
              <MapPin size={14} className="mr-2 text-cyan-500 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>

          {/* Bottom section */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center">
              <span className="bg-cyan-500 text-black text-xs px-3 py-1 rounded-lg font-medium">
                {event.ticketType}
              </span>

              {/* Rating indicator - optional */}
              <div className="ml-2 flex items-center text-xs text-gray-400">
                <Star size={12} className="text-cyan-500 mr-1 fill-current" />
                <span>4.8</span>
              </div>
            </div>

            <button className="flex items-center text-xs text-cyan-500 hover:text-white group-hover:translate-x-1 transition-transform">
              Details
              <ChevronRight size={14} className="ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom highlight bar */}
      <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-cyan-500 to-cyan-300 transition-all duration-500"></div>
    </div>
  );
};

export default EventCard;