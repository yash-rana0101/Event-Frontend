import React from 'react';
import { Users } from 'lucide-react';

const EmptyState = ({ searchTerm, filterStatus, navigate }) => {
  return (
    <div className="text-center py-20 bg-gray-900/30 rounded-xl border border-gray-800/50">
      <Users className="h-16 w-16 mx-auto text-gray-600 mb-4" />
      <h3 className="text-xl font-semibold text-gray-300 mb-2">No Events Found</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {searchTerm || filterStatus !== 'all'
          ? "No events match your search criteria. Try adjusting your filters."
          : "You haven't created any events yet. Create an event to manage attendees."}
      </p>
      <button
        onClick={() => navigate('/organizer/create')}
        className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors"
      >
        Create New Event
      </button>
    </div>
  );
};

export default EmptyState;
