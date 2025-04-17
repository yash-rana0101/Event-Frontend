import { useState } from 'react';
import ProfileHeader from '../../components/User/ProfileHeader';
import TabNavigation from '../../components/User/TabNavigation';
import AboutTab from '../../components/User/AboutTab';
import EventsTab from '../../components/User/EventsTab';
import BadgesTab from '../../components/User/BadgesTab';
import PreferencesTab from '../../components/User/PreferencesTab';

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState('about');
  const [expandedReview, setExpandedReview] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("Alex Johnson");
  const [editedLocation, setEditedLocation] = useState("San Francisco, CA");

  // Sample user data
  const user = {
    name: editedName,
    location: editedLocation,
    email: "alex@example.com",
    phone: "+1 (415) 555-7890",
    website: "alexjohnson.com",
    joinDate: "June 2023",
    eventsAttended: 24,
    upcomingEvents: 3,
    followers: 178,
    following: 205,
    bio: "Event enthusiast and tech professional. Always on the lookout for interesting conferences, workshops, and cultural experiences. Love networking and meeting new people at events.",
    interests: ["Tech Conferences", "Music Festivals", "Workshops", "Food & Wine", "Sports Events"],
    attendedEvents: [
      {
        id: 1,
        name: "DevCon 2024",
        date: "February 15-17, 2024",
        type: "Tech Conference",
        image: "/api/placeholder/80/80",
        location: "San Francisco Convention Center",
        rating: 5,
        review: "Incredible experience with amazing speakers and networking opportunities. The workshops were hands-on and I learned a lot of practical skills I could immediately apply. The venue was perfect and the organization was flawless. Would definitely attend again next year!",
        photos: ["/api/placeholder/100/100", "/api/placeholder/100/100"]
      },
      {
        id: 2,
        name: "Summer Music Festival",
        date: "July 22, 2024",
        type: "Music Festival",
        image: "/api/placeholder/80/80",
        location: "Golden Gate Park",
        rating: 4,
        review: "Great lineup and atmosphere. Sound quality was excellent and the food vendors were diverse. Only downside was the long lines for the bathrooms. Overall a fantastic day of music and fun.",
        photos: ["/api/placeholder/100/100"]
      },
      {
        id: 3,
        name: "Photography Workshop",
        date: "September 10, 2024",
        type: "Workshop",
        image: "/api/placeholder/80/80",
        location: "Downtown Arts Center",
        rating: 3,
        review: "The instructor was knowledgeable but the workshop was a bit too basic for my skill level. The venue was nice and equipment provided was high quality.",
        photos: []
      }
    ],
    upcomingEventsList: [
      {
        id: 1,
        name: "Annual Tech Summit",
        date: "May 15-17, 2025",
        type: "Conference",
        image: "/api/placeholder/80/80",
        location: "Tech Campus",
        ticketType: "VIP Pass"
      },
      {
        id: 2,
        name: "Jazz in the Park",
        date: "June 22, 2025",
        type: "Music Festival",
        image: "/api/placeholder/80/80",
        location: "Central Park",
        ticketType: "General Admission"
      },
      {
        id: 3,
        name: "Culinary Experience",
        date: "July 10, 2025",
        type: "Workshop",
        image: "/api/placeholder/80/80",
        location: "Gourmet Kitchen Studio",
        ticketType: "Workshop Pass"
      }
    ],
    preferences: ["Early-bird tickets", "Front-row seating", "Networking events", "Workshop sessions"],
    badges: [
      { id: 1, name: "Event Explorer", description: "Attended events of 5 different types" },
      { id: 2, name: "Feedback Champion", description: "Left reviews for 20+ events" },
      { id: 3, name: "Early Adopter", description: "Among first 500 users on platform" }
    ],
    savedEvents: 7,
    eventPhotos: 34,
    notificationPreferences: [
      { id: 1, name: "Event Reminders", enabled: true, description: "Get notified 24 hours before events" },
      { id: 2, name: "New Events", enabled: true, description: "Get notified when new events match your interests" },
      { id: 3, name: "Friends' Activities", enabled: false, description: "Get notified when friends register for events" },
      { id: 4, name: "Promotions", enabled: true, description: "Get notified about discounts and special offers" }
    ]
  };

  const toggleReview = (id) => {
    if (expandedReview === id) {
      setExpandedReview(null);
    } else {
      setExpandedReview(id);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const filteredEvents = filterType === 'all'
    ? user.attendedEvents
    : user.attendedEvents.filter(event => event.type.toLowerCase().includes(filterType.toLowerCase()));

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-cyan-500 opacity-5 rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-cyan-500 opacity-5 rounded-full filter blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Profile Header */}
        <ProfileHeader
          user={user}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          editedName={editedName}
          setEditedName={setEditedName}
          editedLocation={editedLocation}
          setEditedLocation={setEditedLocation}
          handleSave={handleSave}
        />

        {/* Tab Navigation */}
        <TabNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Content Area */}
        <div className="bg-black rounded-b-2xl shadow-lg p-6 md:p-8 border border-gray-800">
          {activeTab === 'about' && (
            <AboutTab user={user} setActiveTab={setActiveTab} />
          )}

          {activeTab === 'events' && (
            <EventsTab
              user={user}
              filterType={filterType}
              setFilterType={setFilterType}
              filteredEvents={filteredEvents}
              expandedReview={expandedReview}
              toggleReview={toggleReview}
            />
          )}

          {activeTab === 'badges' && (
            <BadgesTab user={user} />
          )}

          {activeTab === 'preferences' && (
            <PreferencesTab user={user} />
          )}
        </div>
      </div>
    </div>
  );
}