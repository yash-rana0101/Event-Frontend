import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import ProfileHeader from "../../components/User/ProfileHeader";
import TabNavigation from "../../components/User/TabNavigation";
import AboutTab from "../../components/User/AboutTab";
import EventsTab from "../../components/User/EventsTab";
import BadgesTab from "../../components/User/BadgesTab";
import PreferencesTab from "../../components/User/PreferencesTab";
import { useLoader } from '../../context/LoaderContext';
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";

export default function UserProfile() {
  const { userId } = useParams(); // Get userId from URL parameters
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  const { setIsLoading } = useLoader();
  const navigate = useNavigate();

  // Get current user from Redux store for comparison
  const currentUser = useSelector(state => state.auth?.user);
  const isCurrentUserProfile = currentUser &&
    (currentUser.id === userId || currentUser._id === userId);

  useEffect(() => {
    setIsLoading(loading);
    return () => setIsLoading(false);
  }, [loading, setIsLoading]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!userId) {
          throw new Error('User ID is missing');
        }

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
        console.log(`Fetching profile for user ID: ${userId} from ${apiUrl}/profiles/user/${userId}`);

        const response = await axios.get(`${apiUrl}/profiles/user/${userId}`);

        console.log("Profile API response:", response.data);

        if (response.data && (response.data.status === 'success' || response.data.data)) {
          // Check if data is nested in a data property or directly in response.data
          const profileData = response.data.data || response.data;

          // Create default values if any expected properties are missing
          const safeProfile = {
            ...profileData,
            user: profileData.user || {
              name: "User",
              email: "Email not available",
              profilePicture: null
            },
            bio: profileData.bio || "No bio available",
            location: profileData.location || "Location not set",
            joinDate: profileData.joinDate || profileData.createdAt || new Date(),
            badges: profileData.badges || [],
            interests: profileData.interests || [],
            notificationPreferences: profileData.notificationPreferences || []
          };

          setProfile(safeProfile);
          console.log("Profile data set:", safeProfile);
        } else {
          throw new Error(response.data?.message || 'Failed to load profile data');
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load profile');
      } finally {
        // Always set loading to false when done, whether successful or not
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    } else {
      setLoading(false);
      setError("User ID is required");
    }
  }, [userId]);

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center h-60 bg-black rounded-2xl border border-cyan-900/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 to-transparent"></div>
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-cyan-900/20 to-transparent opacity-50"></div>

            <Loader2 className="h-12 w-12 text-cyan-500 animate-spin" />
            <p className="mt-4 text-cyan-400 font-medium">Loading profile information...</p>
            <div className="mt-2 w-48 h-1 bg-black overflow-hidden rounded-full">
              <div className="h-full bg-cyan-500 w-1/3 animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center py-12 bg-black rounded-2xl border border-red-900/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-transparent"></div>

            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>

            <h2 className="text-xl font-bold mb-2 text-white">Error Loading Profile</h2>
            <p className="text-red-300 mb-6 text-center max-w-md">{error}</p>

            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-6 py-3 bg-black text-red-400 rounded-lg border border-red-500/30 hover:bg-red-950/30 transition-all shadow-lg shadow-red-500/10"
            >
              <ArrowLeft size={18} />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Provide a default profile when profile is null
  if (!profile) {
    const defaultProfile = {
      user: {
        name: "User",
        email: "Loading...",
        profilePicture: null
      },
      bio: "Profile information is loading...",
      location: "Unknown",
      joinDate: new Date(),
      badges: [],
      interests: [],
      notificationPreferences: []
    };

    return (
      <div className="min-h-screen bg-black text-white">
        <div className="relative w-full">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-64 overflow-hidden z-0">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"></div>
            <div className="absolute top-0 -right-20 w-60 h-60 bg-cyan-500/5 rounded-full blur-3xl"></div>
          </div>

          <div className="  relative z-10">
            <ProfileHeader
              profile={defaultProfile}
              isCurrentUser={isCurrentUserProfile}
            />

            <div className="mt-8">
              <TabNavigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isCurrentUser={isCurrentUserProfile}
              />

              <div className="mt-6 bg-black rounded-2xl p-8 border border-cyan-900/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/5 to-transparent"></div>
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-4 bg-gray-800 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-800 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-800 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main component render
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative w-full">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-64 overflow-hidden z-0">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-0 -right-20 w-60 h-60 bg-cyan-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="px-4 py-8 relative z-10">
          <ProfileHeader
            profile={profile}
            isCurrentUser={isCurrentUserProfile}
          />

          <div className="mt-8">
            <TabNavigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isCurrentUser={isCurrentUserProfile}
            />

            <div className="mt-6">
              {activeTab === 'about' && (
                <AboutTab profile={profile} />
              )}
              {activeTab === 'events' && (
                <EventsTab userId={userId} />
              )}
              {activeTab === 'badges' && (
                <BadgesTab badges={profile.badges || []} />
              )}
              {activeTab === 'preferences' && isCurrentUserProfile && (
                <PreferencesTab
                  preferences={profile.notificationPreferences || []}
                  userId={userId}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}