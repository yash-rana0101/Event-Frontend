/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Calendar, Ticket, Star, Heart,
  Bell, MessageCircle, HelpCircle, Phone
} from 'lucide-react';
import NavItem from './NavItem';

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <motion.div
      className="w-64 bg-black/50 backdrop-blur-sm text-white p-4 shadow-lg fixed h-full border-r border-gray-800/50 z-20"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8 flex justify-center">
        <div className="bg-gradient-to-r from-cyan-400 to-cyan-500 text-black rounded-full w-16 h-16 flex items-center justify-center font-bold text-2xl shadow-lg shadow-cyan-500/20">
          JD
        </div>
      </div>
      <h2 className="text-xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">John Doe</h2>
      <p className="text-center text-cyan-400 mb-8 text-sm">Event Enthusiast</p>
      <nav>
        <ul className="space-y-2">
          <NavItem icon={<BookOpen size={18} />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <NavItem icon={<Calendar size={18} />} label="Calendar" active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
          <NavItem icon={<Ticket size={18} />} label="My Events" active={activeTab === 'events'} onClick={() => setActiveTab('events')} />
          <NavItem icon={<Star size={18} />} label="Recommendations" active={activeTab === 'recommendations'} onClick={() => setActiveTab('recommendations')} />
          <NavItem icon={<Heart size={18} />} label="Saved Events" active={activeTab === 'saved'} onClick={() => setActiveTab('saved')} />
          <NavItem icon={<Bell size={18} />} label="Notifications" active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} badge={3} />
          <NavItem icon={<MessageCircle size={18} />} label="Feedback & Reviews" active={activeTab === 'feedback'} onClick={() => setActiveTab('feedback')} />
          <NavItem icon={<HelpCircle size={18} />} label="FAQs & Help" active={activeTab === 'help'} onClick={() => setActiveTab('help')} />
          <NavItem icon={<Phone size={18} />} label="Contact Organizer" active={activeTab === 'contact'} onClick={() => setActiveTab('contact')} />
        </ul>
      </nav>
    </motion.div>
  );
};

export default Sidebar;
