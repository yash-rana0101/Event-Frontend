import { useState } from 'react';
import { Calendar, Bell, BookOpen, Star, Heart, MessageCircle, HelpCircle, Phone, Users, Ticket, ChevronRight } from 'lucide-react';

export default function UserDashboard() {
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
      {/* Left Sidebar Navigation */}
      <div className="w-64 bg-black text-cyan-500 p-4 shadow-lg fixed h-full">
        <div className="mb-8 flex justify-center">
          <div className="bg-cyan-500 text-black rounded-full w-16 h-16 flex items-center justify-center font-bold text-2xl">
            JD
          </div>
        </div>
        <h2 className="text-xl font-bold text-center mb-4">John Doe</h2>
        <p className="text-center text-cyan-500 mb-6">Event Enthusiast</p>
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
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-black text-cyan-500" style={{ marginLeft: '16rem' }}>
        <div className="max-w-6xl mx-auto">
          {/* User Profile Banner for Mobile */}
          <div className="md:hidden bg-cyan-500 rounded-lg p-4 mb-6 shadow-lg">
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
            <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md transition flex items-center gap-2">
              <Ticket size={16} />
              <span>Book Ticket</span>
            </button>
            <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md transition flex items-center gap-2">
              <Users size={16} />
              <span>Participate</span>
            </button>
          </div>
          
          {activeTab === 'overview' ? (
            <div className="space-y-8">
              {/* Calendar Section */}
              <OverviewSection title="Calendar" icon={<Calendar size={20} />}>
                <div className="bg-black rounded-lg p-4 shadow-md">
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                      <div key={day} className="text-center font-medium text-cyan-500">{day}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {calendarDays.slice(0, 14).map((day, index) => (
                      <div 
                        key={index} 
                        className={`p-2 text-center rounded-md ${
                          day.status === 'present' 
                            ? 'bg-cyan-500 text-black border border-cyan-500' 
                            : 'bg-black text-cyan-500'
                        }`}
                      >
                        {day.day}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-cyan-500 border border-black rounded mr-1"></div>
                        <span className="text-xs text-cyan-500">Present</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-black rounded mr-1"></div>
                        <span className="text-xs text-cyan-500">Absent</span>
                      </div>
                    </div>
                    <button 
                      className="text-xs text-cyan-500 hover:text-black flex items-center"
                      onClick={() => setActiveTab('calendar')}
                    >
                      View Full Calendar <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </OverviewSection>
              
              {/* My Events Section */}
              <OverviewSection title="My Events" icon={<Ticket size={20} />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingEvents.slice(0, 3).map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
                <div className="mt-4 text-right">
                  <button 
                    className="text-sm text-cyan-500 hover:text-black flex items-center ml-auto"
                    onClick={() => setActiveTab('events')}
                  >
                    View All Events <ChevronRight size={14} />
                  </button>
                </div>
              </OverviewSection>
              
              {/* Recommendations Section */}
              <OverviewSection title="Recommendations" icon={<Star size={20} />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recommendations.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
                <div className="mt-4 text-right">
                  <button 
                    className="text-sm text-cyan-500 hover:text-black flex items-center ml-auto"
                    onClick={() => setActiveTab('recommendations')}
                  >
                    View All Recommendations <ChevronRight size={14} />
                  </button>
                </div>
              </OverviewSection>
              
              {/* Saved Events Section */}
              <OverviewSection title="Saved Events" icon={<Heart size={20} />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
                <div className="mt-4 text-right">
                  <button 
                    className="text-sm text-cyan-500 hover:text-black flex items-center ml-auto"
                    onClick={() => setActiveTab('saved')}
                  >
                    View All Saved Events <ChevronRight size={14} />
                  </button>
                </div>
              </OverviewSection>
              
              {/* Notifications Section */}
              <OverviewSection title="Notifications & Reminders" icon={<Bell size={20} />}>
                <div className="space-y-3">
                  {notifications.map(note => (
                    <div key={note.id} className="p-3 border-l-4 border-cyan-500 bg-black rounded">
                      <p className="text-cyan-500">{note.message}</p>
                      <p className="text-xs text-cyan-500 mt-1">{note.time}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-right">
                  <button 
                    className="text-sm text-cyan-500 hover:text-black flex items-center ml-auto"
                    onClick={() => setActiveTab('notifications')}
                  >
                    View All Notifications <ChevronRight size={14} />
                  </button>
                </div>
              </OverviewSection>
              
              {/* Feedback Section */}
              <OverviewSection title="Feedback & Reviews" icon={<MessageCircle size={20} />}>
                <div className="bg-black p-4 rounded-lg">
                  <p className="font-medium text-cyan-500 mb-3">Share your experience</p>
                  <div className="flex gap-2 mb-4 justify-center">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} size={24} className="text-cyan-500 cursor-pointer" />
                    ))}
                  </div>
                  <button 
                    className="w-full bg-cyan-500 text-black px-4 py-2 rounded hover:bg-black transition"
                    onClick={() => setActiveTab('feedback')}
                  >
                    Write a Review
                  </button>
                </div>
              </OverviewSection>
              
              {/* FAQs Section */}
              <OverviewSection title="FAQs & Help" icon={<HelpCircle size={20} />}>
                <div className="p-4 bg-black rounded-lg">
                  <h3 className="font-medium text-cyan-500">How do I book tickets?</h3>
                  <p className="text-cyan-500 mt-2 text-sm">You can book tickets by navigating to the event page and clicking the "Book Ticket" button.</p>
                </div>
                <div className="mt-4 text-right">
                  <button 
                    className="text-sm text-cyan-500 hover:text-black flex items-center ml-auto"
                    onClick={() => setActiveTab('help')}
                  >
                    View All FAQs <ChevronRight size={14} />
                  </button>
                </div>
              </OverviewSection>
              
              {/* Contact Section */}
              <OverviewSection title="Contact Organizer" icon={<Phone size={20} />}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <select className="p-2 border border-cyan-300 rounded flex-1">
                    <option>Select an event organizer</option>
                    {upcomingEvents.map(event => (
                      <option key={event.id}>{event.title} - Organizer</option>
                    ))}
                  </select>
                  <button 
                    className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition"
                    onClick={() => setActiveTab('contact')}
                  >
                    Contact
                  </button>
                </div>
              </OverviewSection>
            </div>
          ) : activeTab === 'calendar' ? (
            <div className="bg-black rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-bold mb-4 text-cyan-500">Your Calendar</h2>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-medium text-cyan-500">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => (
                  <div 
                    key={index} 
                    className={`p-2 text-center rounded-md cursor-pointer ${
                      day.status === 'present' 
                        ? 'bg-cyan-500 text-black border border-cyan-500' 
                        : 'bg-black text-cyan-500'
                    }`}
                  >
                    {day.day}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-center gap-6">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-cyan-500 border border-black rounded mr-2"></div>
                  <span className="text-sm text-cyan-500">Present</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-black rounded mr-2"></div>
                  <span className="text-sm text-cyan-500">Absent</span>
                </div>
              </div>
            </div>
          ) : activeTab === 'events' ? (
            <div className="bg-black rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-bold mb-4 text-cyan-500">My Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          ) : activeTab === 'recommendations' ? (
            <div className="bg-black rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-bold mb-4 text-cyan-500">Recommended For You</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          ) : activeTab === 'saved' ? (
            <div className="bg-black rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-bold mb-4 text-cyan-500">Saved Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          ) : activeTab === 'notifications' ? (
            <div className="bg-black rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-bold mb-4 text-cyan-500">Notifications & Reminders</h2>
              <div className="space-y-4">
                {notifications.map(note => (
                  <div key={note.id} className="p-4 border-l-4 border-cyan-500 bg-black rounded">
                    <p className="text-cyan-500">{note.message}</p>
                    <p className="text-xs text-cyan-500 mt-1">{note.time}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'feedback' ? (
            <div className="bg-black rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-bold mb-4 text-cyan-500">Feedback & Reviews</h2>
              <div className="p-4 bg-black rounded-lg mb-4">
                <p className="font-medium text-cyan-500 mb-2">Share your experience</p>
                <div className="space-y-4">
                  <select className="w-full p-2 border border-cyan-300 rounded">
                    <option>Select an event to review</option>
                    {[...upcomingEvents, ...savedEvents].map(event => (
                      <option key={event.id}>{event.title}</option>
                    ))}
                  </select>
                  <div className="flex gap-2 justify-center">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} size={24} className="text-cyan-500 cursor-pointer" />
                    ))}
                  </div>
                  <textarea className="w-full p-2 border border-cyan-300 rounded" rows="4" placeholder="Share your thoughts about this event..."></textarea>
                  <button className="bg-cyan-500 text-black px-4 py-2 rounded hover:bg-black transition">Submit Review</button>
                </div>
              </div>
            </div>
          ) : activeTab === 'help' ? (
            <div className="bg-black rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-bold mb-4 text-cyan-500">FAQs & Help Desk</h2>
              <div className="space-y-4">
                <div className="p-4 bg-black rounded-lg">
                  <h3 className="font-medium text-cyan-500">How do I book tickets?</h3>
                  <p className="text-cyan-500 mt-2">You can book tickets by navigating to the event page and clicking the "Book Ticket" button. Follow the instructions to complete your purchase.</p>
                </div>
                <div className="p-4 bg-black rounded-lg">
                  <h3 className="font-medium text-cyan-500">Can I cancel my ticket?</h3>
                  <p className="text-cyan-500 mt-2">Yes, you can cancel your ticket up to 48 hours before the event. A refund will be processed according to our refund policy.</p>
                </div>
                <div className="p-4 bg-black rounded-lg">
                  <h3 className="font-medium text-cyan-500">How do I contact the organizer?</h3>
                  <p className="text-cyan-500 mt-2">You can contact the organizer by clicking on the "Contact Organizer" button on the event page or by visiting the "Contact" section.</p>
                </div>
                <button className="bg-cyan-500 text-black px-4 py-2 rounded hover:bg-black transition">Contact Support</button>
              </div>
            </div>
          ) : activeTab === 'contact' ? (
            <div className="bg-black rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-bold mb-4 text-cyan-500">Contact Organizer</h2>
              <div className="space-y-4">
                <select className="w-full p-2 border border-cyan-300 rounded">
                  <option>Select an event organizer</option>
                  {upcomingEvents.map(event => (
                    <option key={event.id}>{event.title} - Organizer</option>
                  ))}
                </select>
                <input type="text" placeholder="Subject" className="w-full p-2 border border-cyan-300 rounded" />
                <textarea className="w-full p-2 border border-cyan-300 rounded" rows="4" placeholder="Your message to the organizer..."></textarea>
                <button className="bg-cyan-500 text-black px-4 py-2 rounded hover:bg-black transition">Send Message</button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// Helper Components
function NavItem({ icon, label, active, onClick, badge }) {
  return (
    <li 
      className={`flex items-center p-3 rounded-md cursor-pointer transition ${
        active ? 'bg-cyan-600 text-white' : 'text-cyan-200 hover:bg-cyan-700'
      }`}
      onClick={onClick}
    >
      <div className="mr-3">
        {icon}
      </div>
      <span className={active ? 'font-medium' : ''}>{label}</span>
      {badge && (
        <span className="ml-auto bg-cyan-300 text-cyan-800 text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {badge}
        </span>
      )}
    </li>
  );
}

function MobileNavItem({ icon, active, onClick, badge }) {
  return (
    <button 
      className={`p-2 ${active ? 'text-white' : 'text-cyan-200'}`}
      onClick={onClick}
    >
      <div className="relative">
        {icon}
        {badge && (
          <span className="absolute -top-1 -right-1 bg-cyan-300 text-cyan-800 text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {badge}
          </span>
        )}
      </div>
    </button>
  );
}

function OverviewSection({ title, icon, children }) {
  return (
    <div className="bg-black rounded-lg shadow-md overflow-hidden">
      <div className="bg-cyan-500 text-black p-3 flex items-center">
        <div className="mr-2">
          {icon}
        </div>
        <h2 className="font-bold">{title}</h2>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}

function EventCard({ event }) {
  return (
    <div className="bg-black border border-cyan-500 p-3 rounded-lg shadow-sm hover:shadow-md transition overflow-hidden">
      <img src={event.image} alt={event.title} className="w-full h-32 object-cover rounded-md mb-3" />
      <h3 className="font-bold text-cyan-500 mb-1">{event.title}</h3>
      <div className="flex items-center text-cyan-500 text-xs mb-3">
        <Calendar size={12} className="mr-1" />
        {event.date}
        <span className="mx-1">•</span>
        <span>{event.location}</span>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 bg-cyan-500 text-black px-2 py-1 rounded text-xs hover:bg-black transition">Book Ticket</button>
        <button className="bg-black text-cyan-500 px-2 py-1 rounded text-xs hover:bg-cyan-500 transition">
          <Heart size={14} />
        </button>
      </div>
    </div>
  );
}
