/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Server, Key, Database } from 'lucide-react';

const SettingsNavigation = ({ activeTab, setActiveTab }) => {
  const settingsTabs = [
    { id: 'profile', label: 'Profile', icon: User, color: 'from-cyan-400 to-blue-500' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'from-yellow-400 to-orange-500' },
    { id: 'system', label: 'System', icon: Server, color: 'from-green-400 to-green-600' },
    { id: 'api', label: 'API Settings', icon: Key, color: 'from-indigo-400 to-indigo-600' },
    { id: 'backup', label: 'Backup', icon: Database, color: 'from-pink-400 to-pink-600' }
  ];

  return (
    <div className="lg:w-80">
      <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 sticky top-8">
        <h2 className="text-lg font-bold text-white mb-4">Settings Menu</h2>
        <nav className="space-y-2">
          {settingsTabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 text-left ${activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                }`}
              whileHover={{ x: activeTab === tab.id ? 0 : 4 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className={`p-2 rounded-lg ${activeTab === tab.id ? `bg-gradient-to-r ${tab.color}` : 'bg-gray-700/50'}`}>
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-black' : 'text-gray-400'}`} />
              </div>
              <span className="font-medium">{tab.label}</span>
            </motion.button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SettingsNavigation;
