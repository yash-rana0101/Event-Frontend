import React from 'react';
import { Calendar, Clock, MapPin, Download, Star, MessageCircle, Share2, Edit } from 'lucide-react';
import EventCard from './EventCard';
import ReviewCard from './ReviewCard';

const EventsTab = ({ user, filterType, setFilterType, filteredEvents, expandedReview, toggleReview }) => {
  return (
    <div className="space-y-8">
      {/* Upcoming Events */}
      <div>
        <h2 className="text-xl font-bold text-cyan-500 mb-4 flex items-center">
          <Calendar size={20} className="mr-2 text-cyan-500" />
          Upcoming Events
        </h2>

        {user.upcomingEventsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.upcomingEventsList.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-gray-300 text-center py-4 bg-gray-900 rounded-lg">No upcoming events</p>
        )}
      </div>

      {/* Attended Events with Reviews */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-xl font-bold text-cyan-500 flex items-center mb-3 sm:mb-0">
            <MessageCircle size={20} className="mr-2 text-cyan-500" />
            Event Reviews
          </h2>

          <div className="flex items-center bg-gray-900 rounded-lg p-1 border border-gray-800">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition ${filterType === 'all' ? 'bg-cyan-500 text-black' : 'text-gray-300 hover:bg-gray-800'}`}>
              All
            </button>
            <button
              onClick={() => setFilterType('conference')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition ${filterType === 'conference' ? 'bg-cyan-500 text-black' : 'text-gray-300 hover:bg-gray-800'}`}>
              Conferences
            </button>
            <button
              onClick={() => setFilterType('festival')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition ${filterType === 'festival' ? 'bg-cyan-500 text-black' : 'text-gray-300 hover:bg-gray-800'}`}>
              Festivals
            </button>
            <button
              onClick={() => setFilterType('workshop')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition ${filterType === 'workshop' ? 'bg-cyan-500 text-black' : 'text-gray-300 hover:bg-gray-800'}`}>
              Workshops
            </button>
          </div>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="space-y-4">
            {filteredEvents.map(event => (
              <ReviewCard
                key={event.id}
                event={event}
                expanded={expandedReview === event.id}
                toggleExpand={() => toggleReview(event.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-300 text-center py-4 bg-gray-900 rounded-lg">No events found with the selected filter</p>
        )}
      </div>
    </div>
  );
};

export default EventsTab;
