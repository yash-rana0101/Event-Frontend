/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Ticket, Users } from 'lucide-react';

// Import components
import Sidebar from '../../components/User/Dashboard/Sidebar';
import CalendarView from '../../components/User/Dashboard/CalendarView';
import EventsSection from '../../components/User/Dashboard/EventsSection';
import RecommendationsSection from '../../components/User/Dashboard/RecommendationsSection';
import SavedEventsSection from '../../components/User/Dashboard/SavedEventsSection';
import NotificationsSection from '../../components/User/Dashboard/NotificationsSection';
import FeedbackSection from '../../components/User/Dashboard/FeedbackSection';
import HelpSection from '../../components/User/Dashboard/HelpSection';
import ContactSection from '../../components/User/Dashboard/ContactSection';
import OverviewSection from '../../components/User/Dashboard/OverviewSection';
import EventCard from '../../components/User/Dashboard/EventCard';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data
  const upcomingEvents = [
    { id: 1, title: "Tech Conference 2025", date: "May 5, 2025", location: "Convention Center", image: "/api/placeholder/300/200" },
    { id: 2, title: "Music Festival", date: "May 20, 2025", location: "Central Park", image: "/api/placeholder/300/200" },
    { id: 3, title: "Art Exhibition", date: "June 12, 2025", location: "Art Gallery", image: "/api/placeholder/300/200" }
  ];

  const savedEvents = [
    { id: 4, title: "Business Summit", date: "July 8, 2025", location: "Downtown Conference Hall", image: "/api/placeholder/300/200" },
    { id: 5, title: "Comedy Night", date: "June 28, 2025", location: "City Theater", image: "/api/placeholder/300/200" }
  ];

  const notifications = [
    { id: 1, message: "Reminder: Tech Conference starts in 3 days", time: "2 hours ago" },
    { id: 2, message: "New event: Photography Workshop added", time: "Yesterday" },
    { id: 3, message: "Your ticket for Music Festival is confirmed", time: "2 days ago" }
  ];

  const recommendations = [
    { id: 6, title: "Food Festival", date: "August 15, 2025", location: "City Square", image: "/api/placeholder/300/200" },
    { id: 7, title: "Science Exhibition", date: "July 22, 2025", location: "Science Museum", image: "/api/placeholder/300/200" }
  ];

  // Calendar data
  const calendarDays = Array.from({ length: 31 }, (_, i) => ({
    day: i + 1,
    status: Math.random() > 0.3 ? 'present' : 'absent'
  }));

  return (
    <div className="min-h-screen bg-black flex">
      {/* Decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-cyan-500 opacity-5 rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-cyan-500 opacity-5 rounded-full filter blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
      </div>

      {/* Left Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-black text-white relative z-10" style={{ marginLeft: '16rem' }}>
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* User Profile Banner for Mobile */}
          <div className="md:hidden bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg p-4 mb-6 shadow-lg">
            <div className="flex items-center">
              <div className="bg-black text-cyan-500 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mr-4">
                JD
              </div>
              <div>
                <h1 className="text-xl font-bold text-black">John Doe</h1>
                <p className="text-black">Event Enthusiast</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <motion.button
              className="px-6 py-3 rounded-xl bg-gradient-to-r bg-cyan-400 text-black font-medium transition-colors cursor-pointer flex items-center space-x-2 hover:bg-black hover:text-cyan-400 hover:border hover:border-cyan-400"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Ticket size={16} />
              <span>Book Ticket</span>
            </motion.button>
            <motion.button
              className="bg-black text-cyan-500 border border-cyan-500 hover:bg-cyan-900/20 px-4 py-2 rounded-md transition flex items-center gap-2"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Users size={16} />
              <span>Participate</span>
            </motion.button>
          </div>

          {activeTab === 'overview' ? (
            <div className="space-y-8">
              {/* My Events Section */}
              <OverviewSection title="My Events" icon="ticket">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingEvents.slice(0, 3).map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
                <div className="mt-4 text-right">
                  <button
                    className="text-sm text-cyan-500 hover:text-cyan-400 flex items-center ml-auto transition-colors"
                    onClick={() => setActiveTab('events')}
                  >
                    View All Events <span className="ml-1">→</span>
                  </button>
                </div>
              </OverviewSection>

              {/* Recommendations Section */}
              <RecommendationsSection
                recommendations={recommendations}
                setActiveTab={setActiveTab}
                overview={true}
              />

              {/* Saved Events Section */}
              <SavedEventsSection
                savedEvents={savedEvents}
                setActiveTab={setActiveTab}
                overview={true}
              />

              {/* Notifications Section */}
              <NotificationsSection
                notifications={notifications}
                setActiveTab={setActiveTab}
                overview={true}
              />

              {/* Feedback Section */}
              <FeedbackSection setActiveTab={setActiveTab} overview={true} />

              {/* FAQs Section */}
              <HelpSection setActiveTab={setActiveTab} overview={true} />

              {/* Contact Section */}
              <ContactSection events={upcomingEvents} setActiveTab={setActiveTab} overview={true} />
            </div>
          ) : activeTab === 'calendar' ? (
            <CalendarView calendarDays={calendarDays} />
          ) : activeTab === 'events' ? (
            <EventsSection events={upcomingEvents} />
          ) : activeTab === 'recommendations' ? (
            <RecommendationsSection recommendations={recommendations} />
          ) : activeTab === 'saved' ? (
            <SavedEventsSection savedEvents={savedEvents} />
          ) : activeTab === 'notifications' ? (
            <NotificationsSection notifications={notifications} />
          ) : activeTab === 'feedback' ? (
            <FeedbackSection events={[...upcomingEvents, ...savedEvents]} />
          ) : activeTab === 'help' ? (
            <HelpSection />
          ) : activeTab === 'contact' ? (
            <ContactSection events={upcomingEvents} />
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}
