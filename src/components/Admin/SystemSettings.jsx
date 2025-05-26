import React from 'react';
import { Server } from 'lucide-react';
import ToggleSwitch from '../UI/ToggleSwitch';

const SystemSettings = ({ systemSettings, setSystemSettings }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Server className="w-5 h-5 mr-2 text-cyan-400" />
          System Control
        </h3>
        <div className="space-y-4">
          <ToggleSwitch
            value={systemSettings.maintenanceMode}
            onChange={(value) => setSystemSettings(prev => ({ ...prev, maintenanceMode: value }))}
            label="Maintenance Mode"
            description="Temporarily disable site for maintenance"
            color="bg-red-500"
          />

          <ToggleSwitch
            value={systemSettings.debugMode}
            onChange={(value) => setSystemSettings(prev => ({ ...prev, debugMode: value }))}
            label="Debug Mode"
            description="Enable detailed error logging"
            color="bg-yellow-500"
          />

          <ToggleSwitch
            value={systemSettings.analyticsEnabled}
            onChange={(value) => setSystemSettings(prev => ({ ...prev, analyticsEnabled: value }))}
            label="Analytics Tracking"
            description="Enable user behavior analytics"
            color="bg-cyan-500"
          />

          <ToggleSwitch
            value={systemSettings.cacheEnabled}
            onChange={(value) => setSystemSettings(prev => ({ ...prev, cacheEnabled: value }))}
            label="Cache System"
            description="Enable caching for better performance"
            color="bg-green-500"
          />
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
