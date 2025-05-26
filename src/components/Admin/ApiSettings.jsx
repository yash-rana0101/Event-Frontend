/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { Key, Settings, Copy, RefreshCw } from 'lucide-react';
import ToggleSwitch from '../UI/ToggleSwitch';

const ApiSettings = ({ apiSettings, setApiSettings, generateApiKey }) => {
  return (
    <div className="space-y-6">
      {/* API Configuration */}
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Key className="w-5 h-5 mr-2 text-cyan-400" />
          API Configuration
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">API Key</label>
            <div className="flex space-x-3">
              <input
                type="text"
                value={apiSettings.apiKey}
                readOnly
                className="flex-1 bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigator.clipboard.writeText(apiSettings.apiKey)}
                className="px-4 py-3 bg-gray-700/50 text-gray-400 hover:text-white rounded-lg border border-gray-600/50 hover:border-gray-500 transition-colors"
              >
                <Copy className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generateApiKey}
                className="px-4 py-3 bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 rounded-lg border border-cyan-500/30 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Webhook URL</label>
            <input
              type="url"
              value={apiSettings.webhookUrl}
              onChange={(e) => setApiSettings(prev => ({ ...prev, webhookUrl: e.target.value }))}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Rate Limit (requests/hour)</label>
              <input
                type="number"
                value={apiSettings.rateLimit}
                onChange={(e) => setApiSettings(prev => ({ ...prev, rateLimit: parseInt(e.target.value) }))}
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">API Version</label>
              <select
                value={apiSettings.apiVersion}
                onChange={(e) => setApiSettings(prev => ({ ...prev, apiVersion: e.target.value }))}
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              >
                <option value="v1">v1</option>
                <option value="v2">v2</option>
                <option value="v3">v3 (Beta)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* API Options */}
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-cyan-400" />
          API Options
        </h3>
        <div className="space-y-4">
          <ToggleSwitch
            value={apiSettings.enableCors}
            onChange={(value) => setApiSettings(prev => ({ ...prev, enableCors: value }))}
            label="Enable CORS"
            description="Allow cross-origin requests"
          />

          <ToggleSwitch
            value={apiSettings.enableLogging}
            onChange={(value) => setApiSettings(prev => ({ ...prev, enableLogging: value }))}
            label="API Logging"
            description="Log all API requests and responses"
          />
        </div>
      </div>
    </div>
  );
};

export default ApiSettings;
