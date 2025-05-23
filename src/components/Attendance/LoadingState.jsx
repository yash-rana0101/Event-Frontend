import React from 'react';

const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-cyan-400">Loading events...</p>
    </div>
  );
};

export default LoadingState;
