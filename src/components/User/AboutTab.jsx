import { Mail, Phone, MapPin, Heart, UserCircle } from 'lucide-react';

const AboutTab = ({ profile }) => {
  // Handle possible undefined profile
  if (!profile) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <p className="text-gray-400 text-center">Profile data is loading or unavailable</p>
      </div>
    );
  }

  // Safely extract data from profile with fallbacks
  const email = profile?.user?.email || profile?.email || "No email provided";
  const phone = profile?.phone || "No phone provided";
  const location = profile?.location || "No location provided";
  const bio = profile?.bio || "This user hasn't added a bio yet.";
  
  // Handle interests array
  const interests = Array.isArray(profile?.interests) ? profile.interests : [];
  
  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gray-800 p-2 rounded-lg">
              <Mail className="text-cyan-500" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-white">{email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-gray-800 p-2 rounded-lg">
              <Phone className="text-cyan-500" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Phone</p>
              <p className="text-white">{phone}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-gray-800 p-2 rounded-lg">
              <MapPin className="text-cyan-500" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Location</p>
              <p className="text-white">{location}</p>
            </div>
          </div>
        </div>
      </div>
      
      {interests.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-xl font-semibold text-white mb-4">Interests</h2>
          
          <div className="flex flex-wrap gap-2">
            {interests.map((interest, index) => (
              <div 
                key={index}
                className="bg-gray-800 text-cyan-400 px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                <Heart size={14} />
                <span>{interest}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <h2 className="text-xl font-semibold text-white mb-4">About</h2>
        <p className="text-gray-300">{bio}</p>
      </div>
    </div>
  );
};

export default AboutTab;