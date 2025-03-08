import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const adminFeatures = [
    { title: 'User Management', path: '/admin/users', icon: '👥' },
    { title: 'Event Management', path: '/admin/events', icon: '📅' },
    { title: 'Reports', path: '/admin/reports', icon: '📊' },
    { title: 'Settings', path: '/admin/settings', icon: '⚙️' }
  ];

  return (
    <div className="p-6 bg-black min-h-screen">
      <h1 className="text-3xl text-cyan-500 font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminFeatures.map((feature) => (
          <Link
            key={feature.title}
            to={feature.path}
            className="bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow hover:cursor-pointer"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h2 className="text-xl font-semibold">{feature.title}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
