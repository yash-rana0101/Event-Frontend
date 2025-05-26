/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminApi } from '../../services/adminApi';
import { toast } from 'react-toastify';
import { RefreshCw, Save, Check } from 'lucide-react';

// Import child components
import SettingsNavigation from '../../components/Admin/SettingsNavigation';
import ProfileSettings from '../../components/Admin/ProfileSettings';
import NotificationSettings from '../../components/Admin/NotificationSettings';
import SystemSettings from '../../components/Admin/SystemSettings';
import ApiSettings from '../../components/Admin/ApiSettings';
import BackupSettings from '../../components/Admin/BackupSettings';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Form states - now with empty initial values
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: null,
    bio: '',
    timezone: '',
    language: ''
  });

  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    loginAlerts: false,
    sessionTimeout: 30
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: false,
    smsNotifications: false,
    pushNotifications: false,
    newUserRegistration: false,
    newEventCreated: false,
    paymentReceived: false,
    systemAlerts: false,
    marketingEmails: false
  });

  const [systemSettings, setSystemSettings] = useState({
    siteName: '',
    siteDescription: '',
    timezone: '',
    dateFormat: '',
    currency: '',
    language: '',
    maintenanceMode: false,
    debugMode: false,
    analyticsEnabled: false,
    cacheEnabled: false
  });


  const [backupSettings, setBackupSettings] = useState({
    autoBackup: false,
    backupFrequency: 'daily',
    retentionPeriod: 30,
    cloudProvider: 'aws',
    lastBackup: '',
    backupSize: ''
  });

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsInitialLoading(true);

      // Load all settings in parallel
      const [
        profileRes,
        systemRes,
        notificationRes,
        appearanceRes,
        apiRes,
        backupRes
      ] = await Promise.all([
        adminApi.getProfile(),
        adminApi.getSystemSettings(),
        adminApi.getNotificationSettings(),
        adminApi.getAppearanceSettings(),
        adminApi.getApiSettings(),
        adminApi.getBackupSettings()
      ]);

      setProfileData(profileRes.data);
      setSystemSettings(systemRes.data);
      setNotificationSettings(notificationRes.data);
      setBackupSettings(backupRes.data);

      toast.success('Settings loaded successfully');
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setIsInitialLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      let updatePromise;

      switch (activeTab) {
        case 'profile':
          updatePromise = adminApi.updateProfile(profileData);
          break;
        case 'security':
          if (securitySettings.newPassword) {
            if (securitySettings.newPassword !== securitySettings.confirmPassword) {
              toast.error('New passwords do not match');
              return;
            }
            await adminApi.changePassword({
              currentPassword: securitySettings.currentPassword,
              newPassword: securitySettings.newPassword
            });
          }
          updatePromise = adminApi.updateSecuritySettings({
            twoFactorEnabled: securitySettings.twoFactorEnabled,
            loginAlerts: securitySettings.loginAlerts,
            sessionTimeout: securitySettings.sessionTimeout
          });
          break;
        case 'notifications':
          updatePromise = adminApi.updateNotificationSettings(notificationSettings);
          break;
        case 'system':
          updatePromise = adminApi.updateSystemSettings(systemSettings);
          break;
        
        case 'backup':
          updatePromise = adminApi.updateBackupSettings(backupSettings);
          break;
        default:
          updatePromise = Promise.resolve();
      }

      await updatePromise;
      setSaveSuccess(true);
      toast.success('Settings saved successfully');
      setTimeout(() => setSaveSuccess(false), 3000);

      // Clear password fields after successful save
      if (activeTab === 'security') {
        setSecuritySettings(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }

    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };


  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast.error('File size must be less than 2MB');
      return;
    }

    try {
      const response = await adminApi.uploadAvatar(file);
      setProfileData(prev => ({ ...prev, avatar: response.data.avatarUrl }));
      toast.success('Avatar uploaded successfully');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    }
  };

  const handleCreateBackup = async () => {
    try {
      setIsLoading(true);
      await adminApi.createBackup();
      toast.success('Backup created successfully');
      // Reload backup settings to get updated info
      const backupRes = await adminApi.getBackupSettings();
      setBackupSettings(backupRes.data);
    } catch (error) {
      console.error('Error creating backup:', error);
      toast.error('Failed to create backup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadBackup = async (backupId) => {
    try {
      const response = await adminApi.downloadBackup(backupId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `backup-${backupId}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Backup downloaded successfully');
    } catch (error) {
      console.error('Error downloading backup:', error);
      toast.error('Failed to download backup');
    }
  };

  const handleRestoreBackup = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsLoading(true);
      await adminApi.restoreBackup(file);
      toast.success('Backup restored successfully');
      // Reload all settings after restore
      await loadInitialData();
    } catch (error) {
      console.error('Error restoring backup:', error);
      toast.error('Failed to restore backup');
    } finally {
      setIsLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileSettings
            profileData={profileData}
            setProfileData={setProfileData}
            handleAvatarUpload={handleAvatarUpload}
          />
        );
      case 'notifications':
        return (
          <NotificationSettings
            notificationSettings={notificationSettings}
            setNotificationSettings={setNotificationSettings}
          />
        );
      case 'system':
        return (
          <SystemSettings
            systemSettings={systemSettings}
            setSystemSettings={setSystemSettings}
          />
        );
      case 'backup':
        return (
          <BackupSettings
            backupSettings={backupSettings}
            setBackupSettings={setBackupSettings}
            handleCreateBackup={handleCreateBackup}
            handleRestoreBackup={handleRestoreBackup}
            isLoading={isLoading}
          />
        );
      default:
        return (
          <ProfileSettings
            profileData={profileData}
            setProfileData={setProfileData}
            handleAvatarUpload={handleAvatarUpload}
          />
        );
    }
  };

  // Show loading spinner while initial data is loading
  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
          <span className="text-xl">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 opacity-10 rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-600 opacity-15 rounded-full filter blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500 opacity-5 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDAsIDI1NSwgMjU1LCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgLz4KPC9zdmc+')] opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Admin Settings
          </motion.h1>
          <p className="text-gray-400 text-sm sm:text-base">Configure system settings, preferences, and administrative controls</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <SettingsNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Settings Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <motion.button
                onClick={handleSave}
                disabled={isLoading}
                className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${isLoading
                  ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
                  : saveSuccess
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/30'
                  }`}
                whileHover={!isLoading ? { scale: 1.05 } : {}}
                whileTap={!isLoading ? { scale: 0.95 } : {}}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : saveSuccess ? (
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4" />
                    <span>Saved Successfully!</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </div>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
