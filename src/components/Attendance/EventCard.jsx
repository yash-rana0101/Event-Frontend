import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users } from 'lucide-react';
import { getStatusColor } from '../../utils/eventUtils';

const EventCard = ({ event, handleViewAttendees }) => {
  return (
    <motion.div
      className="bg-gray-900/50 rounded-xl overflow-hidden border border-cyan-900/20 hover:border-cyan-500/40 transition-all duration-300 flex flex-col h-full hover:shadow-lg hover:shadow-cyan-500/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
        <div className="absolute top-3 right-3 z-20">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 z-20">
          <div className="flex items-center text-sm text-white bg-black/60 px-2 py-1 rounded-lg">
            <Users size={14} className="mr-1 text-cyan-400" />
            <span>{event.attendees} {event.attendees === 1 ? 'attendee' : 'attendees'}</span>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="p-5 flex-grow">
        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{event.title}</h3>

        <div className="flex items-center text-sm text-gray-400 mb-2">
          <Calendar size={14} className="mr-1 text-cyan-500" />
          <span>{event.formattedDate}</span>
        </div>

        <div className="flex items-center text-sm text-gray-400 mb-3">
          <MapPin size={14} className="mr-1 text-cyan-500 flex-shrink-0" />
          <span className="line-clamp-1">{event.location}</span>
        </div>

        <p className="text-gray-400 text-sm line-clamp-2 mb-4">{event.description}</p>
      </div>

      {/* Action Buttons */}
      <div className="px-5 pb-5 mt-auto">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleViewAttendees(event.id)}
            className="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r bg-cyan-400 text-black font-medium transition-colors cursor-pointer flex justify-center items-center space-x-2 hover:bg-black hover:text-cyan-400 hover:border hover:border-cyan-400"
          >
            <Users size={16} className="mr-2" />
            View Attendees
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
