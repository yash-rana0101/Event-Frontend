import React from 'react';
import { useLoader } from '../../context/LoaderContext';
import EventSkeleton from './Skeleton';

const GlobalLoader = () => {
  const { loading } = useLoader();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center overflow-hidden">
      <div className="relative w-64 h-64">
        <style>
          {`
            .cyberpunk-loader {
              position: relative;
              width: 100%;
              height: 100%;
            }
            .cyberpunk-loader:before, .cyberpunk-loader:after {
              content: '';
              position: absolute;
              border-radius: 50%;
            }
            .cyberpunk-loader:before {
              width: 100%;
              height: 100%;
              background-image: linear-gradient(0deg, #00D8FF 0%, #00D8FF 100%);
              animation: spin 1s infinite linear;
            }
            .cyberpunk-loader:after {
              width: 75%;
              height: 75%;
              top: 12.5%;
              left: 12.5%;
              background-color: black;
              animation: pulse 1s infinite;
            }
            @keyframes spin {
              from {
                transform: rotate(0deg);
                clip-path: polygon(50% 50%, 100% 0, 100% 0%, 100% 100%, 0 100%, 0 0);
              }
              to {
                transform: rotate(360deg);
                clip-path: polygon(50% 50%, 100% 0, 100% 0%, 100% 100%, 0 100%, 0 0);
              }
            }
            @keyframes pulse {
              0% { opacity: 0.6; }
              50% { opacity: 0.8; }
              100% { opacity: 0.6; }
            }
          `}
        </style>
        <div className="cyberpunk-loader"></div>
        <EventSkeleton />
      </div>
    </div>
  );
};

export default GlobalLoader;
