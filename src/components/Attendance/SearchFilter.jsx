import React from 'react';
import { Search, Filter, ChevronDown, X, RefreshCw } from 'lucide-react';

const SearchFilter = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  resetFilters,
  refreshing,
  fetchEvents
}) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-500" />
          <input
            type="text"
            placeholder="Search events by name or location..."
            className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-cyan-900/30 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <div className="relative min-w-[180px]">
            <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-500" />
            <select
              className="w-full pl-10 pr-10 py-3 bg-gray-900/50 border border-cyan-900/30 rounded-lg text-white appearance-none focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="past">Past</option>
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-500 pointer-events-none" />
          </div>

          <button
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 flex items-center transition-colors"
            onClick={resetFilters}
          >
            <X size={16} className="mr-2" />
            Reset
          </button>

          <button
            className="px-4 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 flex items-center transition-colors"
            onClick={fetchEvents}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
