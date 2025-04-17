import { useState } from 'react';
import { Calendar, MapPin, Mail, Phone, Globe, Clock, Tag, Heart, Users, User, Settings, Edit, Ticket, Star, MessageCircle, Share2, Bookmark, Award, Download, Filter } from 'lucide-react';

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

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} size={16} className={i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} />
    ));
  };

  return (
    <div className="min-h-screen bg-black text-cyan-500 font-sans">
      {/* Decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-cyan-500 opacity-10 rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-cyan-500 opacity-10 rounded-full filter blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-black to-cyan-500 rounded-t-2xl shadow-lg">
          <div className="flex flex-col md:flex-row items-center p-6 md:p-8">
            <div className="relative mb-6 md:mb-0 md:mr-8">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-black flex items-center justify-center text-black text-4xl font-bold shadow-xl border-4 border-cyan-500">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="absolute bottom-0 right-0 bg-black text-cyan-500 rounded-full p-2 shadow-lg cursor-pointer hover:bg-cyan-700">
                <Edit size={16} />
              </div>
            </div>
            
            <div className="text-center md:text-left flex-1">
              {isEditing ? (
                <div>
                  <input 
                    type="text" 
                    value={editedName} 
                    onChange={(e) => setEditedName(e.target.value)} 
                    className="text-3xl font-bold text-black bg-cyan-500 rounded-lg px-2 py-1"
                  />
                  <input 
                    type="text" 
                    value={editedLocation} 
                    onChange={(e) => setEditedLocation(e.target.value)} 
                    className="mt-2 text-black bg-cyan-500 rounded-lg px-2 py-1"
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-cyan-500">{user.name}</h1>
                  <div className="flex items-center justify-center md:justify-start mt-1 text-cyan-300">
                    <MapPin size={16} className="mr-1" />
                    <span>{user.location}</span>
                  </div>
                </>
              )}
              <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                <div className="bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full text-cyan-500 text-sm flex items-center">
                  <Calendar size={14} className="mr-1" /> 
                  <span>Joined {user.joinDate}</span>
                </div>
                <div className="bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full text-cyan-500 text-sm flex items-center">
                  <Ticket size={14} className="mr-1" /> 
                  <span>{user.eventsAttended} Events Attended</span>
                </div>
                <div className="bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full text-cyan-500 text-sm flex items-center">
                  <MessageCircle size={14} className="mr-1" /> 
                  <span>{user.attendedEvents.length} Reviews</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 md:mt-0 flex flex-col md:items-end gap-2">
              {isEditing ? (
                <button 
                  onClick={handleSave} 
                  className="bg-cyan-500 text-black font-medium px-4 py-2 rounded-lg hover:bg-cyan-700 transition flex items-center w-full md:w-auto justify-center"
                >
                  Save
                </button>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="bg-black text-cyan-500 font-medium px-4 py-2 rounded-lg hover:bg-cyan-700 transition flex items-center w-full md:w-auto justify-center"
                >
                  <Settings size={16} className="mr-1" /> Edit Profile
                </button>
              )}
              <button className="bg-cyan-500 text-black font-medium px-4 py-2 rounded-lg hover:bg-cyan-700 transition flex items-center w-full md:w-auto justify-center">
                <Share2 size={16} className="mr-1" /> Share Profile
              </button>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex bg-black/30 backdrop-blur-sm rounded-b-lg overflow-hidden">
            <button 
              onClick={() => setActiveTab('about')} 
              className={`flex-1 py-3 text-center font-medium text-sm transition ${activeTab === 'about' ? 'bg-black text-cyan-500' : 'text-cyan-300 hover:bg-black/20'}`}>
              About
            </button>
            <button 
              onClick={() => setActiveTab('events')} 
              className={`flex-1 py-3 text-center font-medium text-sm transition ${activeTab === 'events' ? 'bg-black text-cyan-500' : 'text-cyan-300 hover:bg-black/20'}`}>
              Events & Reviews
            </button>
            <button 
              onClick={() => setActiveTab('badges')} 
              className={`flex-1 py-3 text-center font-medium text-sm transition ${activeTab === 'badges' ? 'bg-black text-cyan-500' : 'text-cyan-300 hover:bg-black/20'}`}>
              Badges
            </button>
            <button 
              onClick={() => setActiveTab('preferences')} 
              className={`flex-1 py-3 text-center font-medium text-sm transition ${activeTab === 'preferences' ? 'bg-black text-cyan-500' : 'text-cyan-300 hover:bg-black/20'}`}>
              Preferences
            </button>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="bg-black rounded-b-2xl shadow-lg p-6 md:p-8">
          {activeTab === 'about' && (
            <div className="space-y-8">
              {/* Bio Section */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-cyan-500 mb-3 flex items-center">
                  <User size={18} className="mr-2 text-cyan-500" />
                  About Me
                </h2>
                <p className="text-cyan-300">{user.bio}</p>
              </div>
              
              {/* Contact Information */}
              <div className="bg-black rounded-xl p-6">
                <h2 className="text-lg font-bold text-cyan-500 mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <div className="bg-cyan-500 p-2 rounded-lg mr-3">
                      <Mail size={18} className="text-black" />
                    </div>
                    <div>
                      <p className="text-sm text-cyan-300">Email</p>
                      <p className="text-cyan-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-cyan-500 p-2 rounded-lg mr-3">
                      <Phone size={18} className="text-black" />
                    </div>
                    <div>
                      <p className="text-sm text-cyan-300">Phone</p>
                      <p className="text-cyan-500">{user.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-cyan-500 p-2 rounded-lg mr-3">
                      <Globe size={18} className="text-black" />
                    </div>
                    <div>
                      <p className="text-sm text-cyan-300">Website</p>
                      <p className="text-cyan-500">{user.website}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-cyan-500 p-2 rounded-lg mr-3">
                      <MapPin size={18} className="text-black" />
                    </div>
                    <div>
                      <p className="text-sm text-cyan-300">Location</p>
                      <p className="text-cyan-500">{user.location}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Interests */}
              <div>
                <h2 className="text-lg font-bold text-cyan-500 mb-3 flex items-center">
                  <Heart size={18} className="mr-2 text-cyan-500" />
                  Interests
                </h2>
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest, index) => (
                    <span key={index} className="bg-cyan-500 text-black px-3 py-1 rounded-full text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-cyan-500 to-black text-black p-4 rounded-xl text-center">
                  <div className="text-3xl font-bold">{user.eventsAttended}</div>
                  <div className="text-sm text-cyan-300">Events Attended</div>
                </div>
                <div className="bg-gradient-to-br from-cyan-500 to-black text-black p-4 rounded-xl text-center">
                  <div className="text-3xl font-bold">{user.upcomingEvents}</div>
                  <div className="text-sm text-cyan-300">Upcoming Events</div>
                </div>
                <div className="bg-gradient-to-br from-black to-cyan-500 text-black p-4 rounded-xl text-center">
                  <div className="text-3xl font-bold">{user.followers}</div>
                  <div className="text-sm text-cyan-300">Followers</div>
                </div>
                <div className="bg-gradient-to-br from-black to-cyan-500 text-black p-4 rounded-xl text-center">
                  <div className="text-3xl font-bold">{user.following}</div>
                  <div className="text-sm text-cyan-300">Following</div>
                </div>
              </div>
              
              {/* Upcoming Events Preview */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-cyan-500 flex items-center">
                    <Calendar size={18} className="mr-2 text-cyan-500" />
                    Upcoming Events
                  </h2>
                  {user.upcomingEventsList.length > 0 && (
                    <button onClick={() => setActiveTab('events')} className="text-cyan-500 text-sm font-medium hover:text-cyan-700">
                      View All
                    </button>
                  )}
                </div>
                
                {user.upcomingEventsList.length > 0 ? (
                  <div className="space-y-3">
                    {user.upcomingEventsList.slice(0, 2).map(event => (
                      <div key={event.id} className="bg-black p-4 rounded-lg flex items-center">
                        <img src={event.image} alt={event.name} className="w-16 h-16 rounded-lg object-cover mr-4" />
                        <div className="flex-1">
                          <h3 className="font-medium text-cyan-500">{event.name}</h3>
                          <div className="flex items-center text-cyan-300 text-sm mt-1">
                            <Clock size={14} className="mr-1" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center text-cyan-300 text-sm mt-1">
                            <MapPin size={14} className="mr-1" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        <div>
                          <span className="bg-black text-cyan-500 text-xs px-3 py-1 rounded-full">
                            {event.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-cyan-300 text-center py-4">No upcoming events</p>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'events' && (
            <div className="space-y-8">
              {/* Upcoming Events */}
              <div>
                <h2 className="text-xl font-bold text-cyan-500 mb-4 flex items-center">
                  <Calendar size={20} className="mr-2 text-cyan-500" />
                  Upcoming Events
                </h2>
                
                {user.upcomingEventsList.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.upcomingEventsList.map(event => (
                      <div key={event.id} className="bg-black border border-cyan-500 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                        <div className="p-4 flex">
                          <img src={event.image} alt={event.name} className="w-20 h-20 rounded-lg object-cover mr-4" />
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className="font-semibold text-cyan-500">{event.name}</h3>
                              <button className="text-cyan-300 hover:text-cyan-500">
                                <Download size={16} />
                              </button>
                            </div>
                            <div className="flex items-center text-cyan-300 text-sm mt-1">
                              <Clock size={14} className="mr-1" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center text-cyan-300 text-sm mt-1">
                              <MapPin size={14} className="mr-1" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <span className="bg-cyan-500 text-black text-xs px-3 py-1 rounded-full">
                                {event.ticketType}
                              </span>
                              <span className="bg-black text-cyan-500 text-xs px-3 py-1 rounded-full">
                                {event.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-cyan-300 text-center py-4">No upcoming events</p>
                )}
              </div>
              
              {/* Attended Events with Reviews */}
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <h2 className="text-xl font-bold text-cyan-500 flex items-center mb-3 sm:mb-0">
                    <Ticket size={20} className="mr-2 text-cyan-500" />
                    Event Reviews
                  </h2>
                  
                  <div className="flex items-center bg-black rounded-lg p-1">
                    <button 
                      onClick={() => setFilterType('all')} 
                      className={`px-3 py-1 text-xs font-medium rounded-md transition ${filterType === 'all' ? 'bg-cyan-500 text-black' : 'text-cyan-300 hover:bg-cyan-700'}`}>
                      All
                    </button>
                    <button 
                      onClick={() => setFilterType('conference')} 
                      className={`px-3 py-1 text-xs font-medium rounded-md transition ${filterType === 'conference' ? 'bg-cyan-500 text-black' : 'text-cyan-300 hover:bg-cyan-700'}`}>
                      Conferences
                    </button>
                    <button 
                      onClick={() => setFilterType('festival')} 
                      className={`px-3 py-1 text-xs font-medium rounded-md transition ${filterType === 'festival' ? 'bg-cyan-500 text-black' : 'text-cyan-300 hover:bg-cyan-700'}`}>
                      Festivals
                    </button>
                    <button 
                      onClick={() => setFilterType('workshop')} 
                      className={`px-3 py-1 text-xs font-medium rounded-md transition ${filterType === 'workshop' ? 'bg-cyan-500 text-black' : 'text-cyan-300 hover:bg-cyan-700'}`}>
                      Workshops
                    </button>
                  </div>
                </div>
                
                {filteredEvents.length > 0 ? (
                  <div className="space-y-4">
                    {filteredEvents.map(event => (
                      <div key={event.id} className="bg-black border border-cyan-500 rounded-xl overflow-hidden shadow-sm">
                        <div className="p-4">
                          <div className="flex items-start">
                            <img src={event.image} alt={event.name} className="w-16 h-16 rounded-lg object-cover mr-4" />
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                <h3 className="font-semibold text-cyan-500">{event.name}</h3>
                                <div className="flex mt-2 sm:mt-0">
                                  {renderStars(event.rating)}
                                </div>
                              </div>
                              <div className="flex items-center text-cyan-300 text-sm mt-1">
                                <Clock size={14} className="mr-1" />
                                <span>{event.date}</span>
                              </div>
                              <div className="flex items-center text-cyan-300 text-sm mt-1">
                                <MapPin size={14} className="mr-1" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Review Content */}
                          <div className="mt-4">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="text-sm font-medium text-cyan-500 flex items-center">
                                <MessageCircle size={14} className="mr-1 text-cyan-500" />
                                My Review
                              </h4>
                              <button className="text-cyan-500 text-sm" onClick={() => toggleReview(event.id)}>
                                {expandedReview === event.id ? "Show Less" : "Show More"}
                              </button>
                            </div>
                            <p className={`text-cyan-300 text-sm ${expandedReview === event.id ? '' : 'line-clamp-2'}`}>
                              {event.review}
                            </p>
                            
                            {/* Review Photos */}
                            {event.photos.length > 0 && (
                              <div className="mt-3">
                                <h4 className="text-sm font-medium text-cyan-500 mb-2">Photos</h4>
                                <div className="flex space-x-2">
                                  {event.photos.map((photo, index) => (
                                    <img 
                                      key={index} 
                                      src={photo} 
                                      alt={`Event photo ${index+1}`} 
                                      className="w-16 h-16 rounded-lg object-cover" 
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex justify-end mt-3 gap-2">
                            <button className="text-cyan-300 hover:text-cyan-500 text-sm flex items-center">
                              <Edit size={14} className="mr-1" />
                              Edit Review
                            </button>
                            <button className="text-cyan-300 hover:text-cyan-500 text-sm flex items-center">
                              <Share2 size={14} className="mr-1" />
                              Share
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-cyan-300 text-center py-4">No events found with the selected filter</p>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'badges' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-cyan-500 mb-4 flex items-center">
                <Award size={20} className="mr-2 text-cyan-500" />
                Your Badges
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {user.badges.map(badge => (
                  <div key={badge.id} className="text-center flex flex-col items-center">
                    <Award size={40} className="mb-2 text-cyan-500" />
                    <h3 className="font-bold text-lg text-cyan-500">{badge.name}</h3>
                    <p className="text-cyan-300 text-sm mt-1">{badge.description}</p>
                  </div>
                ))}
                {/* Empty badge placeholder */}
                <div className="bg-black border-2 border-dashed border-cyan-500 p-6 rounded-xl text-center flex flex-col items-center justify-center">
                  <Award size={40} className="mb-2 text-cyan-300" />
                  <h3 className="font-bold text-lg text-cyan-300">Next Badge</h3>
                  <p className="text-cyan-300 text-sm mt-1">Continue attending events to unlock</p>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-bold text-cyan-500 mb-4">Activity Stats</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-black p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-cyan-500">{user.eventsAttended}</div>
                    <div className="text-sm text-cyan-300">Events Attended</div>
                  </div>
                  <div className="bg-black p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-cyan-500">{user.attendedEvents.length}</div>
                    <div className="text-sm text-cyan-300">Reviews Written</div>
                  </div>
                  <div className="bg-black p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-cyan-500">{user.savedEvents}</div>
                    <div className="text-sm text-cyan-300">Saved Events</div>
                  </div>
                  <div className="bg-black p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-cyan-500">{user.eventPhotos}</div>
                    <div className="text-sm text-cyan-300">Photos Shared</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-cyan-500 mb-4 flex items-center">
                <Settings size={20} className="mr-2 text-cyan-500" />
                Event Preferences
              </h2>
              
              <div className="p-6">
                <h3 className="text-lg font-medium text-cyan-500 mb-3">Preferred Event Types</h3>
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest, index) => (
                    <div key={index} className="text-sm flex items-center justify-between">
                      <span className="text-cyan-500">{interest}</span>
                      <Edit size={14} className="ml-2 text-cyan-300 cursor-pointer hover:text-cyan-500" />
                    </div>
                  ))}
                  <div className="cursor-pointer">
                    <span className="text-cyan-500">+ Add Interest</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-medium text-cyan-500 mb-3">Ticket Preferences</h3>
                <div className="space-y-3">
                  {user.preferences.map((pref, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-cyan-500">{pref}</span>
                      <Edit size={14} className="text-cyan-300 cursor-pointer hover:text-cyan-500" />
                    </div>
                  ))}
                  <div className="flex items-center justify-center cursor-pointer">
                    <span className="text-cyan-500 font-medium">+ Add Preference</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}