import React from 'react';
import { Clock, MapPin, BookmarkPlus, Calendar, ChevronRight, Star, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const EventCard = ({ event, registrationStatus, registrationDate, showDetailedStatus }) => {

  // Add a flag to easily check if this is an attended past event
  const isAttendedEvent = event.attendanceStatus === true ||
    registrationStatus === 'attended' ||
    (event.type === 'attended' && new Date(event.date) < new Date());

  return (
    <div className="group relative bg-black border border-gray-800 rounded-xl overflow-hidden hover:border-cyan-500 transition-all duration-300">
      {/* Show attendance badge for attended events */}
      {isAttendedEvent && (
        <div className="absolute top-3 right-3 z-20 bg-cyan-500/80 text-black text-xs px-2 py-1 rounded-full flex items-center">
          <Award size={12} className="mr-1" />
          Attended
        </div>
      )}

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

          {/* Event date badge - bottom left */}
          <div className="absolute bottom-3 left-3 flex items-center bg-black/80 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-lg">
            <Calendar size={14} className="mr-2 text-cyan-500" />
            <span>{event.date}</span>
          </div>
        </div>

        {/* Content section */}
        <div className="p-4">
          <h3 className="font-semibold text-lg text-white mb-2">
            {/* Display the title with fallback */}
            {event.title}
          </h3>

          {/* If there's a registration status to show */}
          {showDetailedStatus && (
            <div className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-2
              ${registrationStatus === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                registrationStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                  registrationStatus === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                    'bg-gray-500/20 text-gray-400'}`}
            >
              {registrationStatus === 'confirmed' ? 'Confirmed' :
                registrationStatus === 'pending' ? 'Pending' :
                  registrationStatus === 'cancelled' ? 'Cancelled' :
                    'Unknown'}
            </div>
          )}

          {/* Display event details */}
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

          {/* Add registration date if available */}
          {registrationDate && (
            <div className="text-xs text-gray-400 mt-2 flex items-center">
              <Calendar size={12} className="mr-1" />
              <span>Registered: {registrationDate}</span>
            </div>
          )}

          {/* Add rating display if available */}
          {event.rating > 0 && (
            <div className="flex items-center mt-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < event.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}
                />
              ))}
              {event.review && (
                <span className="text-xs text-gray-400 ml-2">"Reviewed"</span>
              )}
            </div>
          )}

          {/* Bottom section */}
          <div className="flex justify-end items-center mt-4">
            <Link
              to={`/event/${event.id}`}
              className="px-3 py-2 rounded-xl bg-gradient-to-r bg-cyan-400 text-black font-medium transition-colors cursor-pointer flex items-center space-x-2 hover:bg-black hover:text-cyan-400 hover:border hover:border-cyan-400"
              aria-label={`View details for ${event.title || 'this event'}`}
            >
              Details
              <ChevronRight size={14} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom highlight bar */}
      <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-cyan-500 to-cyan-300 transition-all duration-500"></div>
    </div>
  );
};

export default EventCard;