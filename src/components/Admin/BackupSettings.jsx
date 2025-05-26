/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { Database, Activity, CloudUpload, Upload as UploadIcon } from 'lucide-react';
import ToggleSwitch from '../UI/ToggleSwitch';

const BackupSettings = ({
  backupSettings,
  setBackupSettings,
  handleCreateBackup,
  handleRestoreBackup,
  isLoading
}) => {
  return (
    <div className="space-y-6">
      {/* Backup Configuration */}
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Database className="w-5 h-5 mr-2 text-cyan-400" />
          Backup Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Backup Frequency</label>
            <select
              value={backupSettings.backupFrequency}
              onChange={(e) => setBackupSettings(prev => ({ ...prev, backupFrequency: e.target.value }))}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Retention Period (days)</label>
            <input
              type="number"
              value={backupSettings.retentionPeriod}
              onChange={(e) => setBackupSettings(prev => ({ ...prev, retentionPeriod: parseInt(e.target.value) }))}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Cloud Provider</label>
            <select
              value={backupSettings.cloudProvider}
              onChange={(e) => setBackupSettings(prev => ({ ...prev, cloudProvider: e.target.value }))}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            >
              <option value="aws">Amazon S3</option>
              <option value="gcp">Google Cloud Storage</option>
              <option value="azure">Azure Blob Storage</option>
              <option value="local">Local Storage</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Auto Backup</label>
            <div className="flex items-center h-12">
              <ToggleSwitch
                value={backupSettings.autoBackup}
                onChange={(value) => setBackupSettings(prev => ({ ...prev, autoBackup: value }))}
                label=""
                description=""
              />
            </div>
          </div>
        </div>
      </div>

      {/* Backup Status */}
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-cyan-400" />
          Backup Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-700/30 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">Last Backup</p>
            <p className="text-white font-medium">
              {backupSettings.lastBackup ? new Date(backupSettings.lastBackup).toLocaleString() : 'Never'}
            </p>
          </div>
          <div className="bg-gray-700/30 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">Backup Size</p>
            <p className="text-white font-medium">{backupSettings.backupSize || 'N/A'}</p>
          </div>
          <div className="bg-gray-700/30 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">Status</p>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${backupSettings.autoBackup ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <p className={`font-medium ${backupSettings.autoBackup ? 'text-green-400' : 'text-red-400'}`}>
                {backupSettings.autoBackup ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateBackup}
            disabled={isLoading}
            className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors border border-cyan-500/30 disabled:opacity-50"
          >
            <CloudUpload className="w-4 h-4 mr-2 inline" />
            Create Backup Now
          </motion.button>
          <motion.label
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-4 py-2 bg-gray-700/50 text-gray-400 hover:text-white rounded-lg hover:bg-gray-600/50 transition-colors border border-gray-600/50 cursor-pointer"
          >
            <UploadIcon className="w-4 h-4 mr-2 inline" />
            Restore Backup
            <input
              type="file"
              accept=".zip"
              onChange={handleRestoreBackup}
              className="hidden"
            />
          </motion.label>
        </div>
      </div>
    </div>
  );
};

export default BackupSettings;
