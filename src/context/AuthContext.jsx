import { createContext, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { verifyUserToken } from '../redux/user/userSlice';
import { verifyOrganizerToken } from '../redux/user/organizer';
import { fixPersistenceIssues } from '../utils/persistFix';

// Create context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const dispatch = useDispatch();
  
  // Get auth state from Redux
  const userAuth = useSelector(state => state.auth);
  const organizerAuth = useSelector(state => state.organizer);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Fix persistence issues first
        fixPersistenceIssues();
        
        // Check for user token
        const userToken = localStorage.getItem('token');
        if (userToken && userToken !== 'null') {
          await dispatch(verifyUserToken()).unwrap();
        }
        
        // Check for organizer token
        const organizerToken = localStorage.getItem('organizer_token');
        if (organizerToken && organizerToken !== 'null') {
          await dispatch(verifyOrganizerToken()).unwrap();
        }
      } catch (error) {
        console.error('Error initializing authentication:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Derive combined auth state
  const isAuthenticated = !!userAuth.token || !!organizerAuth.token;
  const isUserAuthenticated = !!userAuth.token;
  const isOrganizerAuthenticated = !!organizerAuth.token;
  
  const currentUser = userAuth.user;
  const currentOrganizer = organizerAuth.user;
  const activeUser = currentUser || currentOrganizer;

  // Auth context value
  const value = {
    currentUser,
    currentOrganizer,
    activeUser,
    isAuthenticated,
    isUserAuthenticated,
    isOrganizerAuthenticated,
    isInitialized,
    // Additional derived values for convenience
    userRole: currentUser?.role || null,
    organizerId: currentOrganizer?._id || currentOrganizer?.id || null,
    userId: currentUser?._id || currentUser?.id || null,
    userToken: userAuth.token,
    organizerToken: organizerAuth.token,
    userType: isOrganizerAuthenticated ? 'organizer' : (isUserAuthenticated ? 'user' : 'guest')
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
