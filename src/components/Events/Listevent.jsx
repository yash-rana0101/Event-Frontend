/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export default function EventList({ 
  events = [], 
  loading = false,
  error = null,
  filters = {},
  onFilterChange = () => {},
  onSearch = () => {},
  page = 1,
  totalPages = 1,
  onPageChange = () => {}
}) {
  const [searchText, setSearchText] = useState('');
  
  const categories = [
    'All Categories', 'Hackathon', 'Workshop', 'Conference', 'Meetup', 'Webinar'
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchText);
  };

  const handleCategoryClick = (category) => {
    onFilterChange('category', category === 'All Categories' ? '' : category.toLowerCase());
  };

  const handleSortChange = (e) => {
    onFilterChange('sortBy', e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Search & Filter Section */}
      <motion.div 
        className="mb-8 flex flex-col md:flex-row gap-4 justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Search events..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-10 pr-4 py-2 w-full md:w-80 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:border-cyan-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <button type="submit" className="absolute right-2 top-2 bg-cyan-500 text-black p-1 rounded-md hover:bg-cyan-400 transition-colors">
            <Search size={16} />
          </button>
        </form>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center">
            <Filter size={18} className="text-gray-400 mr-2" />
            <select
              value={filters.sortBy || 'startDate'}
              onChange={handleSortChange}
              className="bg-gray-800 border border-gray-700 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
            >
              <option value="startDate">Sort by Date</option>
              <option value="title">Sort by Name</option>
              <option value="-createdAt">Newest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div 
        className="mb-8 overflow-x-auto -mx-4 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex space-x-4 min-w-max pb-2">
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                (filters.category === category.toLowerCase() || 
                (category === 'All Categories' && !filters.category)) 
                  ? 'bg-cyan-500 text-black font-medium'
                  : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div 
          className="mb-6 bg-red-900/30 border border-red-500 rounded-lg p-4 text-red-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-center">{error}</p>
        </motion.div>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && events.length === 0 ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, index) => (
            <motion.div 
              key={`skeleton-${index}`}
              className="bg-gray-800 rounded-xl overflow-hidden animate-pulse"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="h-48 bg-gray-700"></div>
              <div className="p-5 space-y-3">
                <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                <div className="flex justify-between">
                  <div className="h-8 bg-gray-700 rounded w-24"></div>
                  <div className="h-8 bg-gray-700 rounded w-24"></div>
                </div>
              </div>
            </motion.div>
          ))
        ) : events.length > 0 ? (
          // Actual events
          events.map((event, index) => (
            <motion.div
              key={event.id}
              className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-cyan-900/20 transition-all duration-300 transform hover:-translate-y-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition duration-300 hover:scale-105"
                />
                <div className="absolute top-2 right-2 bg-cyan-500 text-black text-xs font-bold uppercase px-2 py-1 rounded">
                  {event.category}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2 hover:text-cyan-400 transition-colors">
                  <Link to={`/event/${event.id}`}>{event.title}</Link>
                </h3>

                <div className="flex items-center text-gray-400 text-sm mb-3">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{event.date}</span>
                  <span className="mx-2">•</span>
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{event.location}</span>
                </div>

                <div className="flex items-center text-gray-400 text-sm mb-4">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{event.attendees} attendees</span>
                </div>

                <div className="flex justify-between items-center">
                  <Link
                    to={`/event/${event.id}`}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-1 text-sm"
                  >
                    <span>Details</span>
                  </Link>
                  <Link
                    to={`/event/${event.id}`}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-medium rounded-lg transition-colors text-sm"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          // No events found
          <motion.div 
            className="col-span-3 py-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-5xl mb-4">😢</div>
            <h3 className="text-xl font-bold text-gray-300 mb-2">No events found</h3>
            <p className="text-gray-400">Try adjusting your filters or search criteria</p>
            <button 
              onClick={() => {
                onFilterChange('category', '');
                onFilterChange('search', '');
                setSearchText('');
              }}
              className="mt-4 px-4 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && !loading && events.length > 0 && (
        <div className="flex justify-center mt-10 space-x-2">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className={`p-2 rounded-lg border ${
              page === 1 
                ? 'border-gray-600 text-gray-600 cursor-not-allowed' 
                : 'border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black transition-colors'
            }`}
          >
            <ChevronLeft size={20} />
          </button>
          
          {Array.from({ length: totalPages }).map((_, index) => {
            // Show limited page numbers: first, last, current, and neighbors
            const pageNum = index + 1;
            if (
              pageNum === 1 || 
              pageNum === totalPages || 
              (pageNum >= page - 1 && pageNum <= page + 1)
            ) {
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-10 h-10 rounded-lg ${
                    pageNum === page
                      ? 'bg-cyan-500 text-black font-bold'
                      : 'border border-gray-700 hover:border-cyan-500 text-gray-300 hover:text-cyan-500'
                  }`}
                >
                  {pageNum}
                </button>
              );
            } else if (
              (pageNum === page - 2 && pageNum > 1) || 
              (pageNum === page + 2 && pageNum < totalPages)
            ) {
              return <span key={pageNum} className="self-end pb-2">...</span>;
            }
            return null;
          })}
          
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className={`p-2 rounded-lg border ${
              page === totalPages 
                ? 'border-gray-600 text-gray-600 cursor-not-allowed' 
                : 'border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black transition-colors'
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}