import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, User, Shield, Bell, Globe, Database, Palette, Code,
  Lock, Key, Mail, Phone, Camera, Save, RefreshCw, Download,
  Upload, Eye, EyeOff, Check, X, AlertTriangle, Info, Zap,
  Server, CloudUpload, HardDrive, Wifi, Monitor, Smartphone,
  Tablet, CreditCard, DollarSign, BarChart3, Users, Calendar,
  MessageSquare, Star, Heart, Share2, TrendingUp, Activity,
  Search, Filter, Plus, Minus, RotateCcw, Copy, Edit3,
  Trash2, Archive, FolderOpen, FileText, Image, Video,
  Music, Download as DownloadIcon, Upload as UploadIcon
} from 'lucide-react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'admin@eventsystem.com',
    phone: '+1 234 567 8901',
    avatar: null,
    bio: 'System Administrator with 5+ years of experience in event management platforms.',
    timezone: 'UTC-8',
    language: 'English'
  });

  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true,
    loginAlerts: true,
    sessionTimeout: 30
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    newUserRegistration: true,
    newEventCreated: true,
    paymentReceived: true,
    systemAlerts: true,
    marketingEmails: false
  });

  const [systemSettings, setSystemSettings] = useState({
    siteName: 'Event Management System',
    siteDescription: 'Professional event management platform for organizers and attendees',
    timezone: 'UTC-8',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    language: 'English',
    maintenanceMode: false,
    debugMode: false,
    analyticsEnabled: true,
    cacheEnabled: true
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    primaryColor: '#06b6d4',
    secondaryColor: '#8b5cf6',
    accentColor: '#f59e0b',
    darkMode: true,
    compactMode: false,
    animationsEnabled: true,
    logoUrl: '',
    faviconUrl: '',
    customCss: ''
  });

  const [apiSettings, setApiSettings] = useState({
    apiKey: 'api_key_placeholder_replace_with_actual_key',
    webhookUrl: 'https://api.eventsystem.com/webhooks',
    rateLimit: 1000,
    apiVersion: 'v1',
    enableCors: true,
    enableLogging: true
  });

  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    retentionPeriod: 30,
    cloudProvider: 'aws',
    lastBackup: '2024-01-15 14:30:00',
    backupSize: '2.4 GB'
  });

  const settingsTabs = [
    { id: 'profile', label: 'Profile', icon: User, color: 'from-cyan-500 to-blue-600' },
    { id: 'security', label: 'Security', icon: Shield, color: 'from-green-500 to-emerald-600' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'from-yellow-500 to-orange-600' },
    { id: 'system', label: 'System', icon: Settings, color: 'from-purple-500 to-pink-600' },
    { id: 'appearance', label: 'Appearance', icon: Palette, color: 'from-indigo-500 to-purple-600' },
    { id: 'api', label: 'API & Integrations', icon: Code, color: 'from-emerald-500 to-teal-600' },
    { id: 'backup', label: 'Backup & Storage', icon: Database, color: 'from-red-500 to-pink-600' }
  ];

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const generateApiKey = () => {
    const newKey = 'api_key_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setApiSettings(prev => ({ ...prev, apiKey: newKey }));
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Camera className="w-5 h-5 mr-2 text-cyan-400" />
          Profile Picture
        </h3>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold text-black">
              {profileData.firstName[0]}{profileData.lastName[0]}
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-black hover:bg-cyan-400 transition-colors"
            >
              <Camera className="w-4 h-4" />
            </motion.button>
          </div>
          <div>
            <p className="text-white font-medium mb-2">Upload new avatar</p>
            <p className="text-gray-400 text-sm mb-3">JPG, PNG or GIF. Max size 2MB.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors border border-cyan-500/30"
            >
              Choose File
            </motion.button>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-cyan-400" />
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">First Name</label>
            <input
              type="text"
              value={profileData.firstName}
              onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))
              }
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Last Name</label>
            <input
              type="text"
              value={profileData.lastName}
              onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))
              }
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Email Address</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))
              }
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Phone Number</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))
              }
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-400 text-sm mb-2">Bio</label>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))
              }
              rows={3}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      {/* Password Change */}
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Lock className="w-5 h-5 mr-2 text-cyan-400" />
          Change Password
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={securitySettings.currentPassword}
                onChange={(e) => setSecuritySettings(prev => ({ ...prev, currentPassword: e.target.value }))
                }
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={securitySettings.newPassword}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, newPassword: e.target.value }))
              }
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Confirm New Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={securitySettings.confirmPassword}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, confirmPassword: e.target.value }))
              }
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Security Options */}
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-cyan-400" />
          Security Options
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Two-Factor Authentication</p>
              <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))
              }
              className={`relative w-14 h-7 rounded-full transition-colors ${securitySettings.twoFactorEnabled ? 'bg-cyan-500' : 'bg-gray-600'
                }`}
            >
              <motion.div
                className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-lg"
                animate={{ x: securitySettings.twoFactorEnabled ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Login Alerts</p>
              <p className="text-gray-400 text-sm">Get notified of suspicious login attempts</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSecuritySettings(prev => ({ ...prev, loginAlerts: !prev.loginAlerts }))
              }
              className={`relative w-14 h-7 rounded-full transition-colors ${securitySettings.loginAlerts ? 'bg-cyan-500' : 'bg-gray-600'
                }`}
            >
              <motion.div
                className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-lg"
                animate={{ x: securitySettings.loginAlerts ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Session Timeout (minutes)</label>
            <select
              value={securitySettings.sessionTimeout}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))
              }
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
              <option value={480}>8 hours</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Bell className="w-5 h-5 mr-2 text-cyan-400" />
          Notification Preferences
        </h3>
        <div className="space-y-4">
          {Object.entries(notificationSettings).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </p>
                <p className="text-gray-400 text-sm">
                  {key === 'emailNotifications' && 'Receive notifications via email'}
                  {key === 'smsNotifications' && 'Receive notifications via SMS'}
                  {key === 'pushNotifications' && 'Receive push notifications in browser'}
                  {key === 'newUserRegistration' && 'Get notified when new users register'}
                  {key === 'newEventCreated' && 'Get notified when new events are created'}
                  {key === 'paymentReceived' && 'Get notified when payments are received'}
                  {key === 'systemAlerts' && 'Receive system maintenance and security alerts'}
                  {key === 'marketingEmails' && 'Receive marketing and promotional emails'}
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setNotificationSettings(prev => ({ ...prev, [key]: !value }))
                }
                className={`relative w-14 h-7 rounded-full transition-colors ${value ? 'bg-cyan-500' : 'bg-gray-600'
                  }`}
              >
                <motion.div
                  className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-lg"
                  animate={{ x: value ? 28 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      {/* General Settings */}
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Globe className="w-5 h-5 mr-2 text-cyan-400" />
          General Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Site Name</label>
            <input
              type="text"
              value={systemSettings.siteName}
              onChange={(e) => setSystemSettings(prev => ({ ...prev, siteName: e.target.value }))
              }
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Default Timezone</label>
            <select
              value={systemSettings.timezone}
              onChange={(e) => setSystemSettings(prev => ({ ...prev, timezone: e.target.value }))
              }
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            >
              <option value="UTC-8">Pacific Time (UTC-8)</option>
              <option value="UTC-5">Eastern Time (UTC-5)</option>
              <option value="UTC+0">Greenwich Mean Time (UTC+0)</option>
              <option value="UTC+1">Central European Time (UTC+1)</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Date Format</label>
            <select
              value={systemSettings.dateFormat}
              onChange={(e) => setSystemSettings(prev => ({ ...prev, dateFormat: e.target.value }))
              }
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Default Currency</label>
            <select
              value={systemSettings.currency}
              onChange={(e) => setSystemSettings(prev => ({ ...prev, currency: e.target.value }))
              }
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-400 text-sm mb-2">Site Description</label>
            <textarea
              value={systemSettings.siteDescription}
              onChange={(e) => setSystemSettings(prev => ({ ...prev, siteDescription: e.target.value }))
              }
              rows={3}
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
            />
          </div>
        </div>
      </div>

      {/* System Control */}
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Server className="w-5 h-5 mr-2 text-cyan-400" />
          System Control
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Maintenance Mode</p>
              <p className="text-gray-400 text-sm">Temporarily disable site for maintenance</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSystemSettings(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))
              }
              className={`relative w-14 h-7 rounded-full transition-colors ${systemSettings.maintenanceMode ? 'bg-red-500' : 'bg-gray-600'
                }`}
            >
              <motion.div
                className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-lg"
                animate={{ x: systemSettings.maintenanceMode ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Debug Mode</p>
              <p className="text-gray-400 text-sm">Enable detailed error logging</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSystemSettings(prev => ({ ...prev, debugMode: !prev.debugMode }))
              }
              className={`relative w-14 h-7 rounded-full transition-colors ${systemSettings.debugMode ? 'bg-yellow-500' : 'bg-gray-600'
                }`}
            >
              <motion.div
                className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-lg"
                animate={{ x: systemSettings.debugMode ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Analytics Tracking</p>
              <p className="text-gray-400 text-sm">Enable user behavior analytics</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSystemSettings(prev => ({ ...prev, analyticsEnabled: !prev.analyticsEnabled }))
              }
              className={`relative w-14 h-7 rounded-full transition-colors ${systemSettings.analyticsEnabled ? 'bg-cyan-500' : 'bg-gray-600'
                }`}
            >
              <motion.div
                className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-lg"
                animate={{ x: systemSettings.analyticsEnabled ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Cache System</p>
              <p className="text-gray-400 text-sm">Enable caching for better performance</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSystemSettings(prev => ({ ...prev, cacheEnabled: !prev.cacheEnabled }))
              }
              className={`relative w-14 h-7 rounded-full transition-colors ${systemSettings.cacheEnabled ? 'bg-green-500' : 'bg-gray-600'
                }`}
            >
              <motion.div
                className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-lg"
                animate={{ x: systemSettings.cacheEnabled ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      {/* Theme Settings */}
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Palette className="w-5 h-5 mr-2 text-cyan-400" />
          Theme & Colors
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Primary Color</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={appearanceSettings.primaryColor}
                onChange={(e) => setAppearanceSettings(prev => ({ ...prev, primaryColor: e.target.value }))
                }
                className="w-12 h-12 rounded-lg border-2 border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={appearanceSettings.primaryColor}
                onChange={(e) => setAppearanceSettings(prev => ({ ...prev, primaryColor: e.target.value }))
                }
                className="flex-1 bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Secondary Color</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={appearanceSettings.secondaryColor}
                onChange={(e) => setAppearanceSettings(prev => ({ ...prev, secondaryColor: e.target.value }))
                }
                className="w-12 h-12 rounded-lg border-2 border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={appearanceSettings.secondaryColor}
                onChange={(e) => setAppearanceSettings(prev => ({ ...prev, secondaryColor: e.target.value }))
                }
                className="flex-1 bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Accent Color</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={appearanceSettings.accentColor}
                onChange={(e) => setAppearanceSettings(prev => ({ ...prev, accentColor: e.target.value }))
                }
                className="w-12 h-12 rounded-lg border-2 border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={appearanceSettings.accentColor}
                onChange={(e) => setAppearanceSettings(prev => ({ ...prev, accentColor: e.target.value }))
                }
                className="flex-1 bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Display Options */}
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Monitor className="w-5 h-5 mr-2 text-cyan-400" />
          Display Options
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Dark Mode</p>
              <p className="text-gray-400 text-sm">Use dark theme across the platform</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setAppearanceSettings(prev => ({ ...prev, darkMode: !prev.darkMode }))
              }
              className={`relative w-14 h-7 rounded-full transition-colors ${appearanceSettings.darkMode ? 'bg-cyan-500' : 'bg-gray-600'
                }`}
            >
              <motion.div
                className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-lg"
                animate={{ x: appearanceSettings.darkMode ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Compact Mode</p>
              <p className="text-gray-400 text-sm">Reduce spacing and padding for more content</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setAppearanceSettings(prev => ({ ...prev, compactMode: !prev.compactMode }))
              }
              className={`relative w-14 h-7 rounded-full transition-colors ${appearanceSettings.compactMode ? 'bg-cyan-500' : 'bg-gray-600'
                }`}
            >
              <motion.div
                className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-lg"
                animate={{ x: appearanceSettings.compactMode ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Animations</p>
              <p className="text-gray-400 text-sm">Enable smooth animations and transitions</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setAppearanceSettings(prev => ({ ...prev, animationsEnabled: !prev.animationsEnabled }))
              }
              className={`relative w-14 h-7 rounded-full transition-colors ${appearanceSettings.animationsEnabled ? 'bg-cyan-500' : 'bg-gray-600'
                }`}
            >
              <motion.div
                className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-lg"
                animate={{ x: appearanceSettings.animationsEnabled ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Code className="w-5 h-5 mr-2 text-cyan-400" />
          Custom CSS
        </h3>
        <textarea
          value={appearanceSettings.customCss}
          onChange={(e) => setAppearanceSettings(prev => ({ ...prev, customCss: e.target.value }))
          }
          placeholder="/* Add your custom CSS here */"
          rows={8}
          className="w-full bg-gray-900/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none font-mono text-sm"
        />
      </div>
    </div>
  );

  const renderApiSettings = () => (
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
              onChange={(e) => setApiSettings(prev => ({ ...prev, webhookUrl: e.target.value }))
              }
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Rate Limit (requests/hour)</label>
              <input
                type="number"
                value={apiSettings.rateLimit}
                onChange={(e) => setApiSettings(prev => ({ ...prev, rateLimit: parseInt(e.target.value) }))
                }
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">API Version</label>
              <select
                value={apiSettings.apiVersion}
                onChange={(e) => setApiSettings(prev => ({ ...prev, apiVersion: e.target.value }))
                }
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
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Enable CORS</p>
              <p className="text-gray-400 text-sm">Allow cross-origin requests</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setApiSettings(prev => ({ ...prev, enableCors: !prev.enableCors }))
              }
              className={`relative w-14 h-7 rounded-full transition-colors ${apiSettings.enableCors ? 'bg-cyan-500' : 'bg-gray-600'
                }`}
            >
              <motion.div
                className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-lg"
                animate={{ x: apiSettings.enableCors ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">API Logging</p>
              <p className="text-gray-400 text-sm">Log all API requests and responses</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setApiSettings(prev => ({ ...prev, enableLogging: !prev.enableLogging }))
              }
              className={`relative w-14 h-7 rounded-full transition-colors ${apiSettings.enableLogging ? 'bg-cyan-500' : 'bg-gray-600'
                }`}
            >
              <motion.div
                className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-lg"
                animate={{ x: apiSettings.enableLogging ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
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
              onChange={(e) => setBackupSettings(prev => ({ ...prev, backupFrequency: e.target.value }))
              }
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
              onChange={(e) => setBackupSettings(prev => ({ ...prev, retentionPeriod: parseInt(e.target.value) }))
              }
              className="w-full bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Cloud Provider</label>
            <select
              value={backupSettings.cloudProvider}
              onChange={(e) => setBackupSettings(prev => ({ ...prev, cloudProvider: e.target.value }))
              }
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
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setBackupSettings(prev => ({ ...prev, autoBackup: !prev.autoBackup }))
                }
                className={`relative w-14 h-7 rounded-full transition-colors ${backupSettings.autoBackup ? 'bg-cyan-500' : 'bg-gray-600'
                  }`}
              >
                <motion.div
                  className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-lg"
                  animate={{ x: backupSettings.autoBackup ? 28 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </motion.button>
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
            <p className="text-white font-medium">{backupSettings.lastBackup}</p>
          </div>
          <div className="bg-gray-700/30 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">Backup Size</p>
            <p className="text-white font-medium">{backupSettings.backupSize}</p>
          </div>
          <div className="bg-gray-700/30 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-1">Status</p>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-green-400 font-medium">Active</p>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors border border-cyan-500/30"
          >
            <CloudUpload className="w-4 h-4 mr-2 inline" />
            Create Backup Now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gray-700/50 text-gray-400 hover:text-white rounded-lg hover:bg-gray-600/50 transition-colors border border-gray-600/50"
          >
            <DownloadIcon className="w-4 h-4 mr-2 inline" />
            Download Backup
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gray-700/50 text-gray-400 hover:text-white rounded-lg hover:bg-gray-600/50 transition-colors border border-gray-600/50"
          >
            <UploadIcon className="w-4 h-4 mr-2 inline" />
            Restore Backup
          </motion.button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileSettings();
      case 'security': return renderSecuritySettings();
      case 'notifications': return renderNotificationSettings();
      case 'system': return renderSystemSettings();
      case 'appearance': return renderAppearanceSettings();
      case 'api': return renderApiSettings();
      case 'backup': return renderBackupSettings();
      default: return renderProfileSettings();
    }
  };

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
          {/* Settings Navigation */}
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
