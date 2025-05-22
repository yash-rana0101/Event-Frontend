import { motion } from 'framer-motion';
import React from 'react';

// Creating a local SkeletonElement to avoid dependency issues
const SkeletonElement = ({ type, className = '' }) => {
  const baseClasses = 'bg-gray-700/50 rounded animate-pulse';
  const classes = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    avatar: 'h-12 w-12 rounded-full',
    thumbnail: 'h-48 w-full',
    button: 'h-8 w-24 rounded-md',
    circle: 'rounded-full',
  };

  return (
    <div className={`${baseClasses} ${classes[type] || ''} ${className}`}>
      {type === 'thumbnail' && (
        <div className="bg-gradient-to-r from-gray-700/50 via-gray-600/50 to-gray-700/50"></div>
      )}
    </div>
  );
};

const EventDetailSkeleton = () => {
  return (
    <div className="min-h-screen text-white">
      {/* Hero Section Skeleton */}
      <div className="relative h-64 sm:h-80 md:h-96 lg:h-[400px]">
        <div className="h-full w-full bg-gray-800/70"></div>

        {/* Event Title Overlay Skeleton */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 transform translate-y-1/2">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="w-full md:w-2/3">
                  <SkeletonElement type="text" className="h-8 w-1/3 mb-3" />
                  <SkeletonElement type="title" className="h-10 w-3/4 mb-3" />
                  <SkeletonElement type="text" className="h-4 w-1/2 mb-4" />

                  <div className="flex flex-wrap gap-4 mt-4">
                    <SkeletonElement type="text" className="h-6 w-32" />
                    <SkeletonElement type="text" className="h-6 w-40" />
                  </div>
                </div>

                <div className="w-full md:w-1/3">
                  <SkeletonElement type="button" className="h-12 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section Skeleton */}
      <div className="max-w-6xl mx-auto px-4 sm:px-4 lg:px-8 py-8 sm:pt-28 mt-44 md:mt-2">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:w-2/3">
            {/* Tabs Skeleton */}
            <div className="flex border-b border-gray-700 mb-6 overflow-x-auto scrollbar-hide">
              {[1, 2, 3, 4, 5].map((item) => (
                <SkeletonElement key={item} type="button" className="h-10 w-24 mx-2" />
              ))}
            </div>

            {/* Content Blocks Skeleton */}
            {[1, 2, 3].map((block) => (
              <div key={block} className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
                <SkeletonElement type="title" className="h-7 w-1/3 mb-4" />
                <div className="space-y-3">
                  <SkeletonElement type="text" className="h-4 w-full" />
                  <SkeletonElement type="text" className="h-4 w-full" />
                  <SkeletonElement type="text" className="h-4 w-3/4" />
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((item) => (
                    <SkeletonElement key={item} type="text" className="h-20 rounded-md" />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:w-1/3 space-y-6">
            {/* Registration CTA Skeleton */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <SkeletonElement type="title" className="h-7 w-1/2 mb-4" />
              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 mb-6">
                <div className="flex justify-between mb-2">
                  <SkeletonElement type="text" className="h-4 w-1/3" />
                  <SkeletonElement type="text" className="h-4 w-1/4" />
                </div>
                <div className="flex justify-between">
                  <SkeletonElement type="text" className="h-4 w-1/3" />
                  <SkeletonElement type="text" className="h-4 w-1/4" />
                </div>
              </div>
              <SkeletonElement type="button" className="h-12 w-full" />
            </div>

            {/* Organizer Info Skeleton */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <SkeletonElement type="title" className="h-7 w-1/2 mb-4" />
              <div className="flex items-center">
                <SkeletonElement type="avatar" className="w-12 h-12 rounded-lg mr-4" />
                <div>
                  <SkeletonElement type="text" className="h-5 w-32 mb-2" />
                  <SkeletonElement type="text" className="h-4 w-24" />
                </div>
              </div>
            </div>

            {/* Social Engagement Skeleton */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <SkeletonElement type="title" className="h-7 w-1/2 mb-4" />
              <div className="flex items-center justify-between mb-4">
                {[1, 2, 3, 4].map((item) => (
                  <SkeletonElement key={item} type="button" className="h-8 w-16" />
                ))}
              </div>
              <div className="flex justify-between gap-2">
                <SkeletonElement type="button" className="h-10 w-full" />
                <SkeletonElement type="button" className="h-10 w-full" />
              </div>
            </div>

            {/* Similar Events Skeleton */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <SkeletonElement type="title" className="h-7 w-1/2" />
                <SkeletonElement type="text" className="h-4 w-16" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((event) => (
                  <div key={event} className="flex gap-3 p-2">
                    <SkeletonElement type="thumbnail" className="w-20 h-16 rounded" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <SkeletonElement type="text" className="h-4 w-2/3 mb-2" />
                        <SkeletonElement type="text" className="h-4 w-16" />
                      </div>
                      <SkeletonElement type="text" className="h-3 w-1/2 mb-2" />
                      <SkeletonElement type="text" className="h-3 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailSkeleton;
