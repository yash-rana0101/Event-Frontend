import React from 'react';
import { Bell } from 'lucide-react';
import ToggleSwitch from '../UI/ToggleSwitch';

const NotificationSettings = ({ notificationSettings, setNotificationSettings }) => {
  const notificationLabels = {
    emailNotifications: { label: 'Email Notifications', description: 'Receive notifications via email' },
    smsNotifications: { label: 'SMS Notifications', description: 'Receive notifications via SMS' },
    pushNotifications: { label: 'Push Notifications', description: 'Receive push notifications in browser' },
    newUserRegistration: { label: 'New User Registration', description: 'Get notified when new users register' },
    newEventCreated: { label: 'New Event Created', description: 'Get notified when new events are created' },
    paymentReceived: { label: 'Payment Received', description: 'Get notified when payments are received' },
    systemAlerts: { label: 'System Alerts', description: 'Receive system maintenance and security alerts' },
    marketingEmails: { label: 'Marketing Emails', description: 'Receive marketing and promotional emails' }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Bell className="w-5 h-5 mr-2 text-cyan-400" />
          Notification Preferences
        </h3>
        <div className="space-y-4">
          {Object.entries(notificationSettings).map(([key, value]) => (
            <ToggleSwitch
              key={key}
              value={value}
              onChange={(newValue) => setNotificationSettings(prev => ({ ...prev, [key]: newValue }))}
              label={notificationLabels[key]?.label || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              description={notificationLabels[key]?.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
