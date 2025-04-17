import React, { useState } from 'react';
import { User, Mail, Phone, Globe, MapPin, Heart, Calendar, ArrowRight, Users, UserPlus } from 'lucide-react';

const AboutTab = ({ user, setActiveTab }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="px-4 py-8 md:px-6 lg:px-8 bg-black text-white">
      {/* Bio Section - Modern Card with Gradient Border */}
      <div className="relative mb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-cyan-400 opacity-20 blur-xl"></div>
        <div className="relative bg-black bg-opacity-90 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-1 bg-cyan-500 rounded-full"></div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-500 bg-clip-text text-transparent">
              About Me
            </h2>
          </div>
          <p className="text-gray-300 leading-relaxed">{user.bio}</p>
        </div>
      </div>

      {/* 3-Column Layout for Desktop, Stack for Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Contact Section */}
        <div className="lg:col-span-2">
          <div className="relative bg-gray-900/50 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-cyan-400"></div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center mr-3">
                  <Mail size={16} className="text-black" />
                </div>
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group flex items-center p-3 rounded-xl transition-all duration-300 hover:bg-cyan-500/10">
                  <div className="bg-black p-3 rounded-xl mr-4 border border-cyan-500/40 group-hover:border-cyan-500 transition-all duration-300">
                    <Mail size={18} className="text-cyan-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="group flex items-center p-3 rounded-xl transition-all duration-300 hover:bg-cyan-500/10">
                  <div className="bg-black p-3 rounded-xl mr-4 border border-cyan-500/40 group-hover:border-cyan-500 transition-all duration-300">
                    <Phone size={18} className="text-cyan-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="text-white font-medium">{user.phone}</p>
                  </div>
                </div>
                <div className="group flex items-center p-3 rounded-xl transition-all duration-300 hover:bg-cyan-500/10">
                  <div className="bg-black p-3 rounded-xl mr-4 border border-cyan-500/40 group-hover:border-cyan-500 transition-all duration-300">
                    <Globe size={18} className="text-cyan-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Website</p>
                    <p className="text-white font-medium">{user.website}</p>
                  </div>
                </div>
                <div className="group flex items-center p-3 rounded-xl transition-all duration-300 hover:bg-cyan-500/10">
                  <div className="bg-black p-3 rounded-xl mr-4 border border-cyan-500/40 group-hover:border-cyan-500 transition-all duration-300">
                    <MapPin size={18} className="text-cyan-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="text-white font-medium">{user.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
          <div className="bg-gray-900/50 rounded-2xl p-5 backdrop-blur-sm border-l-2 border-cyan-500 flex items-center">
            <div className="bg-black p-3 rounded-xl mr-4 border border-cyan-500/40">
              <Calendar size={18} className="text-cyan-500" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{user.eventsAttended}</p>
              <p className="text-sm text-gray-400">Events Attended</p>
            </div>
          </div>
          <div className="bg-gray-900/50 rounded-2xl p-5 backdrop-blur-sm border-l-2 border-cyan-500 flex items-center">
            <div className="bg-black p-3 rounded-xl mr-4 border border-cyan-500/40">
              <Calendar size={18} className="text-cyan-500" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{user.upcomingEvents}</p>
              <p className="text-sm text-gray-400">Upcoming Events</p>
            </div>
          </div>
          <div className="bg-gray-900/50 rounded-2xl p-5 backdrop-blur-sm border-l-2 border-cyan-500 flex items-center">
            <div className="bg-black p-3 rounded-xl mr-4 border border-cyan-500/40">
              <Users size={18} className="text-cyan-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">{user.followers}</p>
                  <p className="text-sm text-gray-400">Followers</p>
                </div>
                <div className="h-8 w-px bg-gray-700 mx-2"></div>
                <div>
                  <p className="text-3xl font-bold text-white">{user.following}</p>
                  <p className="text-sm text-gray-400">Following</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interests Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-1 bg-cyan-500 rounded-full"></div>
          <h2 className="text-xl font-bold text-white">Interests</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {user.interests.map((interest, index) => (
            <span
              key={index}
              className="bg-black border border-cyan-500/40 text-white px-4 py-2 rounded-full text-sm hover:bg-cyan-500 hover:text-black transition-all duration-300 cursor-pointer"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-cyan-500 rounded-full"></div>
            <h2 className="text-xl font-bold text-white">Upcoming Events</h2>
          </div>
          {user.upcomingEventsList.length > 0 && (
            <button
              onClick={() => setActiveTab('events')}
              className="flex items-center gap-2 text-cyan-500 text-sm font-medium hover:text-cyan-400 transition-colors duration-300"
            >
              View All
              <ArrowRight size={16} />
            </button>
          )}
        </div>

        {user.upcomingEventsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.upcomingEventsList.slice(0, 2).map((event, index) => (
              <div
                key={event.id}
                className="relative group"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Background with overlay */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative p-6 min-h-48 rounded-2xl flex flex-col justify-end border border-cyan-500">
                  <div className="absolute top-4 right-4">
                    <span className="bg-black/60 text-cyan-500 border border-cyan-500 text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                      {event.type}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl text-white mb-2">{event.name}</h3>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center text-gray-300 text-sm">
                      <Calendar size={14} className="mr-2 text-cyan-500" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-gray-300 text-sm">
                      <MapPin size={14} className="mr-2 text-cyan-500" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {/* View Details Button - Shows on hover */}
                  <div className={`absolute inset-0 rounded-2xl flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}`}>
                    <button className="px-6 py-3 rounded-xl bg-gradient-to-r bg-cyan-400 text-black font-medium transition-colors cursor-pointer flex items-center space-x-2 hover:bg-black hover:text-cyan-400 hover:border hover:border-cyan-400">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-gray-800">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
              <Calendar size={24} className="text-cyan-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No Upcoming Events</h3>
            <p className="text-gray-400 mb-4">Check back later for new events</p>
            <button className="bg-cyan-500 text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-cyan-400 transition-colors duration-300">
              Browse Events
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutTab;