import React from 'react';
import { Award, Shield, Medal, Trophy, Crown, Star, TrendingUp, Camera, Bookmark, MessageSquare } from 'lucide-react';

const BadgesTab = ({ user }) => {
  // Map badge types to icons
  const getBadgeIcon = (type) => {
    const icons = {
      'attendance': <Award size={40} className="text-cyan-500" />,
      'review': <MessageSquare size={40} className="text-cyan-500" />,
      'exclusive': <Crown size={40} className="text-cyan-500" />,
      'achievement': <Trophy size={40} className="text-cyan-500" />,
      'special': <Medal size={40} className="text-cyan-500" />,
      'default': <Shield size={40} className="text-cyan-500" />
    };
    return icons[type] || icons.default;
  };

  return (
    <div className="space-y-8">
      {/* Header with decorative elements */}
      <div className="relative">
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl"></div>
        <h2 className="text-2xl font-bold relative z-10 bg-gradient-to-r from-cyan-500 to-white bg-clip-text text-transparent inline-flex items-center">
          <Award size={24} className="mr-3 text-cyan-500" />
          Your Achievement Badges
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-transparent mt-2"></div>
      </div>

      {/* Badges Grid with hover effects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {user.badges.map(badge => (
          <div
            key={badge.id}
            className="group relative bg-black border border-gray-800 hover:border-cyan-500 rounded-xl p-6 text-center transition-all duration-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] cursor-pointer"
          >
            {/* Highlight accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

            {/* Badge content */}
            <div className="flex flex-col items-center">
              <div className="mb-4 relative">
                <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-md scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                {getBadgeIcon(badge.type)}
              </div>
              <h3 className="font-bold text-lg text-cyan-500 group-hover:text-white transition-colors duration-300">{badge.name}</h3>
              <p className="text-gray-400 text-sm mt-2 group-hover:text-gray-300 transition-colors">{badge.description}</p>

              {/* Badge level indicator */}
              {badge.level && (
                <div className="mt-4 flex items-center justify-center">
                  {Array(5).fill(0).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 mx-0.5 rounded-full ${i < badge.level ? 'bg-cyan-500' : 'bg-gray-700'}`}
                    ></div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Empty badge placeholder with animation */}
        <div className="group relative bg-black border border-dashed border-gray-700 hover:border-cyan-500/50 p-6 rounded-xl text-center cursor-pointer transition-all duration-300">
          <div className="absolute inset-0 bg-cyan-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex flex-col items-center justify-center h-full">
            <div className="mb-3 opacity-50 group-hover:opacity-80 transition-opacity">
              <Award size={40} className="text-gray-600 group-hover:text-cyan-500/50 transition-colors" />
            </div>
            <h3 className="font-bold text-lg text-gray-500 group-hover:text-gray-400 transition-colors">Next Badge</h3>
            <p className="text-gray-600 text-sm mt-2 group-hover:text-gray-500 transition-colors">Continue attending events to unlock</p>
            <div className="mt-4 inline-flex items-center">
              <div className="h-1 w-16 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-cyan-500/50 rounded-full"></div>
              </div>
              <span className="ml-2 text-xs text-cyan-500/50">65%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-12">
        <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-500 to-white bg-clip-text text-transparent mb-6 flex items-center">
          <TrendingUp size={22} className="mr-2 text-cyan-500" />
          Activity Statistics
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Events Attended */}
          <div className="group bg-black border border-gray-800 hover:border-cyan-500 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer">
            <div className="flex items-center p-3 border-b border-gray-800 group-hover:border-cyan-500/30 transition-colors">
              <Trophy size={18} className="text-cyan-500 mr-2" />
              <span className="text-sm text-gray-400">Events</span>
            </div>
            <div className="p-4 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-white group-hover:text-cyan-500 transition-colors">{user.eventsAttended}</div>
              <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors mt-1">Attended</div>
            </div>
          </div>

          {/* Reviews Written */}
          <div className="group bg-black border border-gray-800 hover:border-cyan-500 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer">
            <div className="flex items-center p-3 border-b border-gray-800 group-hover:border-cyan-500/30 transition-colors">
              <MessageSquare size={18} className="text-cyan-500 mr-2" />
              <span className="text-sm text-gray-400">Reviews</span>
            </div>
            <div className="p-4 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-white group-hover:text-cyan-500 transition-colors">{user.attendedEvents.length}</div>
              <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors mt-1">Written</div>
            </div>
          </div>

          {/* Saved Events */}
          <div className="group bg-black border border-gray-800 hover:border-cyan-500 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer">
            <div className="flex items-center p-3 border-b border-gray-800 group-hover:border-cyan-500/30 transition-colors">
              <Bookmark size={18} className="text-cyan-500 mr-2" />
              <span className="text-sm text-gray-400">Saved</span>
            </div>
            <div className="p-4 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-white group-hover:text-cyan-500 transition-colors">{user.savedEvents}</div>
              <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors mt-1">Events</div>
            </div>
          </div>

          {/* Photos Shared */}
          <div className="group bg-black border border-gray-800 hover:border-cyan-500 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer">
            <div className="flex items-center p-3 border-b border-gray-800 group-hover:border-cyan-500/30 transition-colors">
              <Camera size={18} className="text-cyan-500 mr-2" />
              <span className="text-sm text-gray-400">Gallery</span>
            </div>
            <div className="p-4 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-white group-hover:text-cyan-500 transition-colors">{user.eventPhotos}</div>
              <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors mt-1">Photos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Progress */}
      <div className="mt-8 bg-black border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <Star size={18} className="mr-2 text-cyan-500" />
          Achievement Progress
        </h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Elite Attendee</span>
              <span className="text-xs text-cyan-500">8/10</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full" style={{ width: '80%' }}></div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Feedback Master</span>
              <span className="text-xs text-cyan-500">5/15</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full" style={{ width: '33%' }}></div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Photo Enthusiast</span>
              <span className="text-xs text-cyan-500">12/20</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgesTab;