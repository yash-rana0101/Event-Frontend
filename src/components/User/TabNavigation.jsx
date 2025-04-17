import React from 'react';

const TabNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex bg-gray-900 rounded-b-lg overflow-hidden border-l border-r border-b border-gray-800">
      <button
        onClick={() => setActiveTab('about')}
        className={`flex-1 py-3 text-center font-medium text-sm transition ${activeTab === 'about' ? 'bg-black text-cyan-500' : 'text-gray-300 hover:bg-black/20'}`}>
        About
      </button>
      <button
        onClick={() => setActiveTab('events')}
        className={`flex-1 py-3 text-center font-medium text-sm transition ${activeTab === 'events' ? 'bg-black text-cyan-500' : 'text-gray-300 hover:bg-black/20'}`}>
        Events & Reviews
      </button>
      <button
        onClick={() => setActiveTab('badges')}
        className={`flex-1 py-3 text-center font-medium text-sm transition ${activeTab === 'badges' ? 'bg-black text-cyan-500' : 'text-gray-300 hover:bg-black/20'}`}>
        Badges
      </button>
      <button
        onClick={() => setActiveTab('preferences')}
        className={`flex-1 py-3 text-center font-medium text-sm transition ${activeTab === 'preferences' ? 'bg-black text-cyan-500' : 'text-gray-300 hover:bg-black/20'}`}>
        Preferences
      </button>
    </div>
  );
};

export default TabNavigation;
