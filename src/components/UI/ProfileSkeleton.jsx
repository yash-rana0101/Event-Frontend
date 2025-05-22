import React from 'react';

export default function ProfileSkeleton({ className = "" }) {
  return (
    <div className={`min-h-screen ${className} w-full`}>
      <div className="relative w-full">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-64 overflow-hidden z-0">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-0 -right-20 w-60 h-60 bg-cyan-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="px-4 py-8 relative z-10">
          {/* Profile Header Skeleton */}
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              {/* Background banner */}
              <div className="h-40 rounded-2xl bg-gray-800/50 mb-4"></div>

              <div className="flex flex-col md:flex-row gap-6 items-center md:items-end">
                {/* Avatar */}
                <div className="w-28 h-28 rounded-full bg-gray-700/50 border-4 border-black -mt-16"></div>

                <div className="flex-1">
                  {/* Name */}
                  <div className="h-8 bg-gray-700/50 rounded-lg w-48 mb-2"></div>
                  {/* Username/Bio */}
                  <div className="h-4 bg-gray-700/30 rounded w-32 mb-4"></div>

                  {/* Stats */}
                  <div className="flex gap-4">
                    <div className="h-6 bg-gray-700/30 rounded w-20"></div>
                    <div className="h-6 bg-gray-700/30 rounded w-20"></div>
                  </div>
                </div>

                {/* Actions button */}
                <div className="h-10 bg-gray-700/30 rounded-lg w-32 mt-4 md:mt-0"></div>
              </div>
            </div>
          </div>

          {/* Tab Navigation Skeleton */}
          <div className="mt-8 max-w-6xl mx-auto">
            <div className="flex border-b border-gray-800 pb-2 mb-4">
              <div className="h-8 bg-gray-700/50 rounded w-20 mr-4"></div>
              <div className="h-8 bg-gray-700/30 rounded w-20 mr-4"></div>
              <div className="h-8 bg-gray-700/30 rounded w-20"></div>
            </div>

            {/* Tab Content Skeleton */}
            <div className="bg-black rounded-2xl p-8 border border-cyan-900/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/5 to-transparent"></div>
              <div className="animate-pulse space-y-6">
                {/* About section skeleton */}
                <div>
                  <div className="h-6 bg-gray-800/70 rounded w-40 mb-4"></div>
                  <div className="h-4 bg-gray-800/50 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-800/50 rounded w-5/6 mb-2"></div>
                  <div className="h-4 bg-gray-800/50 rounded w-4/6"></div>
                </div>

                {/* Location section */}
                <div>
                  <div className="h-6 bg-gray-800/70 rounded w-40 mb-4"></div>
                  <div className="h-4 bg-gray-800/50 rounded w-56"></div>
                </div>

                {/* Interests section */}
                <div>
                  <div className="h-6 bg-gray-800/70 rounded w-40 mb-4"></div>
                  <div className="flex flex-wrap gap-2">
                    <div className="h-8 bg-gray-800/40 rounded-full w-20"></div>
                    <div className="h-8 bg-gray-800/40 rounded-full w-24"></div>
                    <div className="h-8 bg-gray-800/40 rounded-full w-16"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
