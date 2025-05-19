import { useState, useEffect } from 'react';
import { 
  Search, Plus, Users, UserPlus, ChevronRight, ChevronLeft, 
  X, Info, CheckCircle2, AlertCircle, Filter, User, ArrowUpRight
} from 'lucide-react';

// Mock data for existing teams
const existingTeams = [
  {
    id: 1,
    name: "Digital Dynamos",
    owner: "Michael Chen",
    description: "Full-stack development team focusing on innovative digital solutions",
    membersCount: 4,
    maxMembers: 6,
    eventName: "WebDev Summit 2025",
    tags: ["development", "innovation"]
  },
  {
    id: 2,
    name: "Creative Coders",
    owner: "Sarah Johnson",
    description: "Collaborative team of creative coders building interactive experiences",
    membersCount: 6,
    maxMembers: 8,
    eventName: "TechFest 2025",
    tags: ["creative", "coding", "interactive"]
  },
  {
    id: 3,
    name: "Tech Titans",
    owner: "James Wilson",
    description: "Expert team focused on emerging technologies and AI integration",
    membersCount: 3,
    maxMembers: 5,
    eventName: "AI Conference 2025",
    tags: ["AI", "tech", "innovation"]
  },
  {
    id: 4,
    name: "Data Dreamers",
    owner: "Emily Brown",
    description: "Data visualization and analytics experts crafting insightful solutions",
    membersCount: 4,
    maxMembers: 6,
    eventName: "DataCon 2025",
    tags: ["data", "analytics", "visualization"]
  },
  {
    id: 5,
    name: "UX Unicorns",
    owner: "David Kim",
    description: "Design-focused team creating exceptional user experiences",
    membersCount: 3,
    maxMembers: 5,
    eventName: "Design Summit 2025",
    tags: ["UX", "design", "creative"]
  },
  {
    id: 6,
    name: "Cloud Champions",
    owner: "Lisa Wong",
    description: "Cloud infrastructure specialists deploying scalable solutions",
    membersCount: 5,
    maxMembers: 7,
    eventName: "Cloud Computing Expo",
    tags: ["cloud", "infrastructure", "scalability"]
  }
];

// Mock data for user's team requests
const initialRequests = [
  {
    id: 1,
    teamId: 2,
    teamName: "Creative Coders",
    status: "pending",
    submittedAt: "2025-05-01"
  },
  {
    id: 2,
    teamId: 5,
    teamName: "UX Unicorns",
    status: "accepted",
    submittedAt: "2025-04-25"
  },
  {
    id: 3,
    teamId: 3,
    teamName: "Tech Titans",
    status: "rejected",
    submittedAt: "2025-04-20"
  }
];

// Status badge component
const StatusBadge = ({ status }) => {
  const baseClasses = "text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1";
  
  if (status === "accepted") {
    return (
      <span className={`${baseClasses} bg-green-100 text-green-800`}>
        <CheckCircle2 size={12} /> Accepted
      </span>
    );
  } else if (status === "pending") {
    return (
      <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
        <AlertCircle size={12} /> Pending
      </span>
    );
  } else {
    return (
      <span className={`${baseClasses} bg-red-100 text-red-800`}>
        <X size={12} /> Rejected
      </span>
    );
  }
};

// Button component for consistent styling
const Button = ({ children, variant = "primary", size = "md", onClick, className = "", disabled = false, fullWidth = false }) => {
  const variants = {
    primary: "bg-cyan-600 hover:bg-cyan-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    outline: "bg-transparent border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white"
  };
  
  const sizes = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2"
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''} 
        rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

// Team card component
const TeamCard = ({ team, onApply, userRequests }) => {
  const existingRequest = userRequests.find(request => request.teamId === team.id);
  const isRequestPending = existingRequest && existingRequest.status === "pending";
  const isRequestAccepted = existingRequest && existingRequest.status === "accepted";
  const isTeamFull = team.membersCount >= team.maxMembers;
  
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-cyan-500 transition-all duration-300 flex flex-col h-full">
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-white">{team.name}</h3>
          <div className="bg-cyan-900/30 text-cyan-400 text-xs px-2 py-1 rounded-full">
            {team.membersCount}/{team.maxMembers} members
          </div>
        </div>
        
        <p className="text-gray-400 text-sm mb-4">{team.description}</p>
        
        <div className="flex items-center text-sm text-gray-400 mb-3">
          <User size={16} className="mr-1" />
          <span>Owner: {team.owner}</span>
        </div>
        
        <div className="text-sm text-gray-400 mb-4">
          <span className="block mb-2">Event: {team.eventName}</span>
          <div className="flex flex-wrap gap-1">
            {team.tags.map((tag, index) => (
              <span key={index} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-auto p-4 pt-2 border-t border-gray-700">
        {isRequestAccepted ? (
          <div className="bg-green-900/20 border border-green-700 text-green-400 p-2 rounded-md text-sm text-center">
            You are a member of this team
          </div>
        ) : isRequestPending ? (
          <div className="bg-yellow-900/20 border border-yellow-700 text-yellow-400 p-2 rounded-md text-sm text-center">
            Request pending
          </div>
        ) : isTeamFull ? (
          <Button 
            variant="secondary" 
            fullWidth 
            disabled={true}
          >
            Team is full
          </Button>
        ) : (
          <Button 
            variant="outline" 
            fullWidth 
            onClick={() => onApply(team)}
            className="flex items-center justify-center gap-1"
          >
            <UserPlus size={16} /> Apply to Join
          </Button>
        )}
      </div>
    </div>
  );
};

// Join team modal component
const JoinTeamModal = ({ isOpen, onClose, team, onSubmit }) => {
  const [message, setMessage] = useState("");
  
  if (!isOpen || !team) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl shadow-xl w-full max-w-md border border-gray-700 overflow-hidden">
        <div className="bg-cyan-900/30 p-5 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Apply to Join Team</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-5">
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-white mb-1">{team.name}</h4>
            <p className="text-gray-400 text-sm">{team.description}</p>
            <div className="mt-3 text-sm text-gray-400">
              <span className="flex items-center">
                <User size={14} className="mr-1" />
                Owner: {team.owner}
              </span>
              <span className="mt-1">Event: {team.eventName}</span>
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
              Why do you want to join this team?
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full rounded-md bg-gray-800 border border-gray-700 text-white p-3 focus:border-cyan-500 focus:ring focus:ring-cyan-500 focus:ring-opacity-30"
              placeholder="Briefly describe your interest and what you bring to the team..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button 
              variant="primary" 
              onClick={() => {
                onSubmit(team, message);
                onClose();
              }}
              disabled={!message.trim()}
            >
              Submit Application
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Create team modal component
const CreateTeamModal = ({ isOpen, onClose, onSubmit }) => {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [eventName, setEventName] = useState("");
  const [maxMembers, setMaxMembers] = useState(5);
  const [tags, setTags] = useState("");
  
  if (!isOpen) return null;
  
  const handleSubmit = () => {
    const tagsList = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    onSubmit({
      name: teamName,
      description,
      eventName,
      maxMembers,
      tags: tagsList
    });
    
    // Reset form
    setTeamName("");
    setDescription("");
    setEventName("");
    setMaxMembers(5);
    setTags("");
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl shadow-xl w-full max-w-lg border border-gray-700 overflow-hidden">
        <div className="bg-cyan-900/30 p-5 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Create New Team</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-5">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="teamName" className="block text-sm font-medium text-gray-300 mb-1">
                Team Name*
              </label>
              <input
                type="text"
                id="teamName"
                className="w-full rounded-md bg-gray-800 border border-gray-700 text-white p-3 focus:border-cyan-500 focus:ring focus:ring-cyan-500 focus:ring-opacity-30"
                placeholder="Enter team name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                Description*
              </label>
              <textarea
                id="description"
                rows={3}
                className="w-full rounded-md bg-gray-800 border border-gray-700 text-white p-3 focus:border-cyan-500 focus:ring focus:ring-cyan-500 focus:ring-opacity-30"
                placeholder="Briefly describe your team and its goals"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="eventName" className="block text-sm font-medium text-gray-300 mb-1">
                Event Name*
              </label>
              <input
                type="text"
                id="eventName"
                className="w-full rounded-md bg-gray-800 border border-gray-700 text-white p-3 focus:border-cyan-500 focus:ring focus:ring-cyan-500 focus:ring-opacity-30"
                placeholder="Which event is this team for?"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="maxMembers" className="block text-sm font-medium text-gray-300 mb-1">
                Maximum Team Size*
              </label>
              <input
                type="number"
                id="maxMembers"
                min={2}
                max={10}
                className="w-full rounded-md bg-gray-800 border border-gray-700 text-white p-3 focus:border-cyan-500 focus:ring focus:ring-cyan-500 focus:ring-opacity-30"
                value={maxMembers}
                onChange={(e) => setMaxMembers(parseInt(e.target.value))}
                required
              />
            </div>
            
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                id="tags"
                className="w-full rounded-md bg-gray-800 border border-gray-700 text-white p-3 focus:border-cyan-500 focus:ring focus:ring-cyan-500 focus:ring-opacity-30"
                placeholder="e.g. design, coding, marketing"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button 
              variant="primary" 
              onClick={handleSubmit}
              disabled={!teamName || !description || !eventName}
            >
              Create Team
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TeamApplyPage() {
  const [teams, setTeams] = useState(existingTeams);
  const [userRequests, setUserRequests] = useState(initialRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("browse");
  const [filters, setFilters] = useState({
    hasOpenings: false,
    tags: []
  });
  
  // Get all unique tags from teams
  const allTags = [...new Set(teams.flatMap(team => team.tags))];
  
  // Filter teams based on search query and filters
  const filteredTeams = teams.filter(team => {
    const matchesSearch = 
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesOpenings = !filters.hasOpenings || team.membersCount < team.maxMembers;
    
    const matchesTags = 
      filters.tags.length === 0 || 
      filters.tags.some(tag => team.tags.includes(tag));
      
    return matchesSearch && matchesOpenings && matchesTags;
  });
  
  // Handle applying to join a team
  const handleApplyToTeam = (team) => {
    setSelectedTeam(team);
    setIsJoinModalOpen(true);
  };
  
  // Handle submit join request
  const handleSubmitJoinRequest = (team, message) => {
    const newRequest = {
      id: userRequests.length + 1,
      teamId: team.id,
      teamName: team.name,
      status: "pending",
      submittedAt: new Date().toISOString().split('T')[0],
      message
    };
    
    setUserRequests([...userRequests, newRequest]);
  };
  
  // Handle create team submission
  const handleCreateTeam = (teamData) => {
    const newTeam = {
      id: teams.length + 1,
      ...teamData,
      owner: "Your Name", // Would come from user profile in a real app
      membersCount: 1 // Creator is the first member
    };
    
    setTeams([...teams, newTeam]);
  };
  
  // Toggle tag filter
  const toggleTagFilter = (tag) => {
    setFilters(prev => {
      if (prev.tags.includes(tag)) {
        return {
          ...prev,
          tags: prev.tags.filter(t => t !== tag)
        };
      } else {
        return {
          ...prev,
          tags: [...prev.tags, tag]
        };
      }
    });
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl shadow-lg p-8 mb-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">Find Your Perfect Team</h1>
            <p className="text-cyan-100 text-lg mb-6">
              Join an existing team or create your own for upcoming events. Collaborate, learn, and succeed together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="primary" 
                size="lg" 
                className="bg-black text-cyan-400 hover:bg-gray-900"
                onClick={() => setActiveTab("browse")}
              >
                Browse Teams
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-cyan-800"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus size={18} className="mr-1" /> Create Your Team
              </Button>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden">
          {/* Tabs navigation */}
          <div className="flex border-b border-gray-800">
            <button
              className={`px-6 py-4 font-medium text-sm flex items-center ${
                activeTab === "browse"
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("browse")}
            >
              <Search size={18} className="mr-2" /> Browse Teams
            </button>
            <button
              className={`px-6 py-4 font-medium text-sm flex items-center ${
                activeTab === "requests"
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("requests")}
            >
              <UserPlus size={18} className="mr-2" /> Your Requests
            </button>
          </div>
          
          {activeTab === "browse" && (
            <div>
              {/* Search and filters */}
              <div className="p-6 border-b border-gray-800">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search teams by name, description, tags..."
                      className="block w-full pl-10 pr-3 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-cyan-500 focus:border-cyan-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center justify-center"
                  >
                    <Plus size={18} className="mr-1" /> Create Team
                  </Button>
                </div>
                
                {/* Filters */}
                <div className="mt-4">
                  <div className="flex items-center mb-2">
                    <Filter size={16} className="text-gray-400 mr-2" />
                    <h3 className="text-gray-300 font-medium">Filters</h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <label className="inline-flex items-center p-2 bg-gray-800 rounded-lg border border-gray-700 cursor-pointer hover:border-cyan-500">
                      <input
                        type="checkbox"
                        className="form-checkbox rounded text-cyan-500 focus:ring-cyan-500 mr-2"
                        checked={filters.hasOpenings}
                        onChange={() => setFilters({...filters, hasOpenings: !filters.hasOpenings})}
                      />
                      <span className="text-sm text-gray-300">Has openings</span>
                    </label>
                    
                    {allTags.map((tag, index) => (
                      <label 
                        key={index}
                        className={`inline-flex items-center p-2 rounded-lg border cursor-pointer transition-colors ${
                          filters.tags.includes(tag)
                            ? "bg-cyan-900/30 border-cyan-500 text-cyan-300"
                            : "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="form-checkbox hidden"
                          checked={filters.tags.includes(tag)}
                          onChange={() => toggleTagFilter(tag)}
                        />
                        <span className="text-sm">{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Teams grid */}
              <div className="p-6">
                {filteredTeams.length === 0 ? (
                  <div className="text-center py-12">
                    <Users size={48} className="mx-auto text-gray-600 mb-4" />
                    <h3 className="text-xl font-medium text-gray-300 mb-2">No teams found</h3>
                    <p className="text-gray-400">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTeams.map(team => (
                      <TeamCard 
                        key={team.id} 
                        team={team} 
                        onApply={handleApplyToTeam}
                        userRequests={userRequests}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === "requests" && (
            <div className="p-6">
              {userRequests.length === 0 ? (
                <div className="text-center py-12">
                  <UserPlus size={48} className="mx-auto text-gray-600 mb-4" />
                  <h3 className="text-xl font-medium text-gray-300 mb-2">No team requests</h3>
                  <p className="text-gray-400 mb-4">You haven't sent any team join requests yet</p>
                  <Button 
                    variant="primary" 
                    onClick={() => setActiveTab("browse")}
                    className="inline-flex items-center"
                  >
                    Browse Teams <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-bold mb-4">Your Team Requests</h2>
                  <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Team</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Submitted</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {userRequests.map(request => (
                          <tr key={request.id} className="hover:bg-gray-750">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-white">{request.teamName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                              {request.submittedAt}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <StatusBadge status={request.status} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              {request.status === "pending" ? (
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => {
                                    setUserRequests(userRequests.filter(r => r.id !== request.id));
                                  }}
                                >
                                  Cancel
                                </Button>
                              ) : (
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => {
                                    // In a real app, would show team details
                                    alert(`View details for ${request.teamName}`);
                                  }}
                                >
                                  Details
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {/* Quick action card */}
              <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">Create your own team</h3>
                    <p className="text-gray-400">Can't find the right team? Start your own and lead the way.</p>
                  </div>
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center"
                  >
                    <Plus size={18} className="mr-1" /> Create Team
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Tips section */}
        <div className="mt-8 bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Info size={20} className="text-cyan-500 mr-2" />
            Tips for Successful Team Applications
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-medium text-cyan-400 mb-2">Be Specific</h3>
              <p className="text-gray-300">Clearly describe your skills and experience when applying to teams. Explain how you can contribute to their success.</p>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-medium text-cyan-400 mb-2">Connect With Purpose</h3>
              <p className="text-gray-300">Research teams before applying. Show genuine interest in their projects and demonstrate alignment with their goals.</p>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-medium text-cyan-400 mb-2">Start Your Own</h3>
              <p className="text-gray-300">Can't find the perfect team? Create your own with a clear vision and promote it to attract like-minded collaborators.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <JoinTeamModal 
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        team={selectedTeam}
        onSubmit={handleSubmitJoinRequest}
      />
      
      <CreateTeamModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTeam}
      />
    </div>
  );
}
