import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorState = ({ error, retry }) => {
  return (
    <div className="bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl p-6 my-8">
      <div className="flex items-start">
        <AlertCircle className="w-6 h-6 mr-3 mt-1" />
        <div>
          <h3 className="text-lg font-semibold mb-2">Error Loading Events</h3>
          <p>{error}</p>
          <button
            onClick={retry}
            className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
