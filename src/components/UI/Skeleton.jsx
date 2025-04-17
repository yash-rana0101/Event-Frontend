/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

// Basic skeleton element component
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
        <div className="absolute inset-0 bg-gradient-to-r from-gray-700/50 via-gray-600/50 to-gray-700/50 animate-shimmer"></div>
      )}
    </div>
  );
};

// Event Card Skeleton
const EventCardSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50"
    >
      {/* Image skeleton */}
      <div className="relative w-full h-48">
        <SkeletonElement type="thumbnail" />
      </div>

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <SkeletonElement type="title" />

        {/* Description skeleton */}
        <div className="space-y-2">
          <SkeletonElement type="text" />
          <SkeletonElement type="text" className="w-5/6" />
        </div>

        {/* Meta info skeleton */}
        <div className="flex justify-between items-center pt-2">
          <SkeletonElement type="text" className="w-1/4" />
          <SkeletonElement type="text" className="w-1/4" />
        </div>
      </div>
    </motion.div>
  );
};

// Main component with auto detection
const Skeleton = ({ type = 'event', count = 6, columns = { default: 1, md: 2, lg: 3 } }) => {
  // Generate grid classes based on columns prop
  const gridClasses = `grid grid-cols-${columns.default} ${columns.md ? `md:grid-cols-${columns.md}` : ''
    } ${columns.lg ? `lg:grid-cols-${columns.lg}` : ''} gap-6 p-4`;

  const renderSkeletons = () => {
    switch (type) {
      case 'event':
        return [...Array(count)].map((_, index) => (
          <EventCardSkeleton key={index} />
        ));
      case 'list':
        return [...Array(count)].map((_, index) => (
          <div key={index} className="flex space-x-4 p-3 bg-gray-800/50 rounded-lg">
            <SkeletonElement type="avatar" />
            <div className="flex-1 space-y-2">
              <SkeletonElement type="title" />
              <SkeletonElement type="text" className="w-4/5" />
            </div>
          </div>
        ));
      case 'profile':
        return (
          <div className="flex flex-col items-center space-y-4 p-6 bg-gray-800/50 rounded-xl">
            <SkeletonElement type="avatar" className="h-24 w-24" />
            <SkeletonElement type="title" className="w-1/2" />
            <SkeletonElement type="text" className="w-3/4" />
            <div className="grid grid-cols-2 gap-4 w-full mt-2">
              <SkeletonElement type="button" className="w-full" />
              <SkeletonElement type="button" className="w-full" />
            </div>
          </div>
        );
      default:
        return [...Array(count)].map((_, index) => (
          <SkeletonElement key={index} type="text" />
        ));
    }
  };

  return (
    <>
      <div className={gridClasses}>
        {renderSkeletons()}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </>
  );
};

// PropTypes for better documentation and type checking
SkeletonElement.propTypes = {
  type: PropTypes.oneOf(['text', 'title', 'avatar', 'thumbnail', 'button', 'circle']),
  className: PropTypes.string
};

Skeleton.propTypes = {
  type: PropTypes.oneOf(['event', 'list', 'profile', 'text']),
  count: PropTypes.number,
  columns: PropTypes.object
};

// For backward compatibility
export const EventSkeleton = () => <Skeleton type="event" />;

export default Skeleton;
