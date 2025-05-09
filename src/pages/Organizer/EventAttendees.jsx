import { useState, useEffect } from 'react';
import { 
  Check, X, Plus, Users, UserPlus, Filter, Search, 
  ChevronRight, ChevronLeft, MoreHorizontal, User
} from 'lucide-react';

// Mock data for teams
const initialTeams = [
  {
    id: 1,
    name: "Digital Dynamos",
    owner: "Michael Chen",
    email: "michael@example.com",
    members: 4,
    status: "approved",
    createdAt: "2025-04-15"
  },
  {
    id: 2,
    name: "Creative Coders",
    owner: "Sarah Johnson",
    email: "sarah@example.com",
    members: 6,
    status: "approved",
    createdAt: "2025-04-10"
  },
  {
    id: 3,
    name: "Tech Titans",
    owner: "James Wilson",
    email: "james@example.com",
    members: 3,
    status: "pending",
    createdAt: "2025-05-01"
  },
  {
    id: 4,
    name: "Innovation Squad",
    owner: "Emily Brown",
    email: "emily@example.com",
    members: 5,
    status: "pending",
    createdAt: "2025-05-02"
  },
  {
    id: 5,
    name: "Byte Builders",
    owner: "David Kim",
    email: "david@example.com",
    members: 4,
    status: "rejected",
    createdAt: "2025-04-20"
  }
];

// Badge component for displaying status
const StatusBadge = ({ status }) => {
  const baseClasses = "text-xs font-medium px-2 py-1 rounded-full";
  
  if (status === "approved") {
    return <span className={`${baseClasses} bg-cyan-100 text-cyan-800`}>Approved</span>;
  } else if (status === "pending") {
    return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</span>;
  } else {
    return <span className={`${baseClasses} bg-red-100 text-red-800`}>Rejected</span>;
  }
};

// Button component for consistent styling
const Button = ({ children, variant = "primary", size = "md", onClick, className = "" }) => {
  const variants = {
    primary: "bg-cyan-600 hover:bg-cyan-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white"
  };
  
  const sizes = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2"
  };
  
  return (
    <button
      onClick={onClick}
      className={`${variants[variant]} ${sizes[size]} rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-50 ${className}`}
    >
      {children}
    </button>
  );
};

// Modal component for creating a team
const CreateTeamModal = ({ isOpen, onClose, onCreateTeam }) => {
  const [teamName, setTeamName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [memberCount, setMemberCount] = useState(1);
  
  const handleSubmit = () => {
    if (!teamName || !ownerName || !ownerEmail || memberCount < 1) {
      return;
    }
    
    onCreateTeam({
      name: teamName,
      owner: ownerName,
      email: ownerEmail,
      members: memberCount,
      status: "pending",
      createdAt: new Date().toISOString().split('T')[0]
    });
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Create New Team</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="teamName" className="block text-sm font-medium text-gray-700">Team Name</label>
              <input
                type="text"
                id="teamName"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 bg-gray-50 p-2 border"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">Owner Name</label>
              <input
                type="text"
                id="ownerName"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 bg-gray-50 p-2 border"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="ownerEmail" className="block text-sm font-medium text-gray-700">Owner Email</label>
              <input
                type="email"
                id="ownerEmail"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 bg-gray-50 p-2 border"
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="memberCount" className="block text-sm font-medium text-gray-700">Number of Members</label>
              <input
                type="number"
                id="memberCount"
                min="1"
                max="20"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 bg-gray-50 p-2 border"
                value={memberCount}
                onChange={(e) => setMemberCount(parseInt(e.target.value))}
                required
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={handleSubmit}>Create Team</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Team detail modal component
const TeamDetailModal = ({ team, isOpen, onClose, onApprove, onReject }) => {
  if (!isOpen || !team) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Team Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-2">
              <div className="h-20 w-20 bg-cyan-100 rounded-full flex items-center justify-center">
                <Users size={32} className="text-cyan-600" />
              </div>
            </div>
            
            <div className="text-center mb-4">
              <h4 className="text-xl font-bold text-gray-900">{team.name}</h4>
              <StatusBadge status={team.status} />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Owner</p>
                  <p className="font-medium">{team.owner}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{team.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Members</p>
                  <p className="font-medium">{team.members}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created On</p>
                  <p className="font-medium">{team.createdAt}</p>
                </div>
              </div>
            </div>
          </div>
          
          {team.status === "pending" && (
            <div className="mt-6 flex justify-center space-x-3">
              <Button 
                variant="danger" 
                onClick={() => {
                  onReject(team.id);
                  onClose();
                }}
                className="flex items-center"
              >
                <X size={16} className="mr-1" /> Reject
              </Button>
              <Button 
                variant="success" 
                onClick={() => {
                  onApprove(team.id);
                  onClose();
                }}
                className="flex items-center"
              >
                <Check size={16} className="mr-1" /> Approve
              </Button>
            </div>
          )}

          {team.status !== "pending" && (
            <div className="mt-6 flex justify-end">
              <Button variant="secondary" onClick={onClose}>Close</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function TeamManagement() {
  const [teams, setTeams] = useState(initialTeams);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Map page numbers to tabs
  const pageToTabMap = {
    1: "all",
    2: "pending",
    3: "approved",
    4: "rejected",
  };

  // Update active tab when page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setActiveTab(pageToTabMap[page]);
  };

  // Update page number when active tab changes
  useEffect(() => {
    const tabToPageMap = {
      all: 1,
      pending: 2,
      approved: 3,
      rejected: 4,
    };
    setCurrentPage(tabToPageMap[activeTab]);
  }, [activeTab]);

  // Filter teams based on active tab and search query
  const filteredTeams = teams.filter(team => {
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "pending" && team.status === "pending") ||
      (activeTab === "approved" && team.status === "approved") ||
      (activeTab === "rejected" && team.status === "rejected");
      
    const matchesSearch = 
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.email.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesTab && matchesSearch;
  });
  
  const pendingCount = teams.filter(team => team.status === "pending").length;
  
  // Team actions
  const approveTeam = (teamId) => {
    setTeams(teams.map(team => 
      team.id === teamId ? { ...team, status: "approved" } : team
    ));
  };
  
  const rejectTeam = (teamId) => {
    setTeams(teams.map(team => 
      team.id === teamId ? { ...team, status: "rejected" } : team
    ));
  };
  
  const createTeam = (newTeam) => {
    setTeams([
      ...teams,
      {
        id: teams.length + 1,
        ...newTeam
      }
    ]);
  };
  
  const openTeamDetails = (team) => {
    setSelectedTeam(team);
    setIsDetailModalOpen(true);
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-900 rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-cyan-500 to-cyan-700 text-black">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  <Users className="mr-2" /> Team Management
                </h1>
                <p className="text-cyan-100 mt-1">Manage event teams and requests</p>
              </div>
              
              <Button 
                variant="primary" 
                size="lg"
                className="bg-black text-cyan-500 hover:bg-gray-800 flex items-center" 
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus size={20} className="mr-1" /> Create Team
              </Button>
            </div>
          </div>
          
          {/* Filters and search */}
          <div className="border-b border-gray-800">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 gap-4">
              <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 overflow-x-auto">
                <button 
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === "all" 
                      ? "bg-cyan-500 text-black shadow-sm" 
                      : "hover:bg-gray-700 text-gray-300"
                  }`}
                >
                  All Teams
                </button>
                <button 
                  onClick={() => setActiveTab("pending")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center ${
                    activeTab === "pending" 
                      ? "bg-cyan-500 text-black shadow-sm" 
                      : "hover:bg-gray-700 text-gray-300"
                  }`}
                >
                  Pending
                  {pendingCount > 0 && (
                    <span className="ml-2 bg-black text-cyan-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {pendingCount}
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab("approved")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === "approved" 
                      ? "bg-cyan-500 text-black shadow-sm" 
                      : "hover:bg-gray-700 text-gray-300"
                  }`}
                >
                  Approved
                </button>
                <button 
                  onClick={() => setActiveTab("rejected")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === "rejected" 
                      ? "bg-cyan-500 text-black shadow-sm" 
                      : "hover:bg-gray-700 text-gray-300"
                  }`}
                >
                  Rejected
                </button>
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search teams or owners"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-cyan-500 focus:border-cyan-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Teams table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Team
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Owner
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Members
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {filteredTeams.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      <Users size={48} className="mx-auto mb-4 text-gray-700" />
                      <p className="text-lg font-medium">No teams found</p>
                      <p className="text-sm">Try changing your search or filters</p>
                    </td>
                  </tr>
                ) : (
                  filteredTeams.map((team) => (
                    <tr 
                      key={team.id} 
                      className="hover:bg-gray-800 cursor-pointer"
                      onClick={() => openTeamDetails(team)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-cyan-500 rounded-full flex items-center justify-center">
                            <Users size={20} className="text-black" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{team.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User size={16} className="text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm text-white">{team.owner}</div>
                            <div className="text-xs text-gray-400">{team.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{team.members}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={team.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {team.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {team.status === "pending" ? (
                          <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                            <Button 
                              variant="danger" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                rejectTeam(team.id);
                              }}
                            >
                              <X size={16} />
                            </Button>
                            <Button 
                              variant="success" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                approveTeam(team.id);
                              }}
                            >
                              <Check size={16} />
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              openTeamDetails(team);
                            }}
                          >
                            Details
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="bg-gray-900 px-4 py-3 border-t border-gray-800 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-400">
                    Showing <span className="font-medium">{filteredTeams.length}</span> teams
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-gray-800 text-sm font-medium ${
                        currentPage === 1 ? "text-gray-600 cursor-not-allowed" : "text-gray-400 hover:bg-gray-700"
                      }`}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    {[1, 2, 3, 4].map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-700 ${
                          currentPage === page
                            ? "bg-cyan-500 text-black"
                            : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        } text-sm font-medium`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-gray-800 text-sm font-medium ${
                        currentPage === 4 ? "text-gray-600 cursor-not-allowed" : "text-gray-400 hover:bg-gray-700"
                      }`}
                      disabled={currentPage === 4}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <CreateTeamModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onCreateTeam={createTeam}
      />
      
      <TeamDetailModal 
        team={selectedTeam}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onApprove={approveTeam}
        onReject={rejectTeam}
      />
    </div>
  );
}

