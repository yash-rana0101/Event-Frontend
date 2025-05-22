/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import {
  BookOpen, Calendar, Ticket, Star, Heart,
  Bell, MessageCircle, HelpCircle, Phone, UserPlus
} from 'lucide-react';
import NavItem from './NavItem';

const Sidebar = ({ activeTab, setActiveTab }) => {
  // Get user data from Redux store
  const user = useSelector(state => state.auth?.user) || {};
  const profile = useSelector(state => state.profile?.data) || {};

  // Extract user details with fallbacks
  const userName = user?.name || profile?.name || "User";
  const userRole = profile?.role || user?.role || "Event Enthusiast";

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return "U";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const userInitials = getInitials(userName);

  return (
    <motion.div
      className="w-64 bg-black/50 backdrop-blur-sm text-white p-4 shadow-lg fixed h-full border-r border-gray-800/50 z-20"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8 flex justify-center">
        <div className="bg-gradient-to-r from-cyan-400 to-cyan-500 text-black rounded-full w-16 h-16 flex items-center justify-center font-bold text-2xl shadow-lg shadow-cyan-500/20">
          {userInitials}
        </div>
      </div>
      <h2 className="text-xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
        {userName}
      </h2>
      <p className="text-center text-cyan-400 mb-8 text-sm">
        {userRole}
      </p>
      <nav>
        <ul className="space-y-2">
          <NavItem icon={<BookOpen size={18} />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <NavItem icon={<Ticket size={18} />} label="My Events" active={activeTab === 'events'} onClick={() => setActiveTab('events')} />
          <NavItem icon={<Star size={18} />} label="Recommendations" active={activeTab === 'recommendations'} onClick={() => setActiveTab('recommendations')} />
          <NavItem icon={<Heart size={18} />} label="Saved Events" active={activeTab === 'saved'} onClick={() => setActiveTab('saved')} />
          <NavItem icon={<Bell size={18} />} label="Notifications" active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} badge={3} />
          <NavItem icon={<UserPlus size={18} />} label="Teams" active={activeTab === 'teams'} onClick={() => setActiveTab('teams')} />
          <NavItem icon={<MessageCircle size={18} />} label="Feedback & Reviews" active={activeTab === 'feedback'} onClick={() => setActiveTab('feedback')} />
          <NavItem icon={<HelpCircle size={18} />} label="FAQs & Help" active={activeTab === 'help'} onClick={() => setActiveTab('help')} />
          <NavItem icon={<Phone size={18} />} label="Contact Organizer" active={activeTab === 'contact'} onClick={() => setActiveTab('contact')} />
        </ul>
      </nav>
    </motion.div>
  );
};

export default Sidebar;
