import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { verifyUserToken } from '../redux/user/userSlice';
import { verifyOrganizerToken } from '../redux/user/organizer';
import { safelyParseToken } from '../utils/persistFix';

// Create context
const AuthContext = createContext(null);

// Context provider component
export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  
  // Get auth state from Redux
  const userAuth = useSelector(state => state.auth || {});
  const organizerAuth = useSelector(state => state.organizer || {});

  // Current user state (combined from both possible auth types)
  const [currentUser, setCurrentUser] = useState(null);
  const [currentOrganizer, setCurrentOrganizer] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [organizerToken, setOrganizerToken] = useState(null);

  // On mount, check tokens and verify auth if needed
  useEffect(() => {
    const verifyAuth = async () => {
      setLoading(true);
      
      try {
        // Check localStorage for tokens
        const storedUserToken = localStorage.getItem('token');
        const storedOrganizerToken = localStorage.getItem('organizer_token');
        
        // Safely parse tokens (handle JSON string format)
        const parsedUserToken = safelyParseToken(storedUserToken);
        const parsedOrganizerToken = safelyParseToken(storedOrganizerToken);
        
        setUserToken(parsedUserToken);
        setOrganizerToken(parsedOrganizerToken);
        
        // Verify tokens if they exist
        if (parsedOrganizerToken) {
          await dispatch(verifyOrganizerToken());
        }
        
        if (parsedUserToken) {
          await dispatch(verifyUserToken());
        }
      } catch (error) {
        console.error('Auth verification error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    verifyAuth();
  }, [dispatch]);

  // Update local state when Redux state changes
  useEffect(() => {
    setCurrentUser(userAuth.user || null);
    setUserToken(userAuth.token || null);
  }, [userAuth]);

  useEffect(() => {
    setCurrentOrganizer(organizerAuth.user || null);
    setOrganizerToken(organizerAuth.token || null);
  }, [organizerAuth]);

  // Determine if the user is authenticated
  const isAuthenticated = Boolean(currentUser || currentOrganizer);
  
  // Get current active user (either organizer or regular user)
  const activeUser = currentOrganizer || currentUser;
  
  // Determine user role
  const userRole = currentOrganizer ? 'organizer' : (currentUser?.role || 'user');

  // Context value
  const value = {
    currentUser,
    currentOrganizer,
    userToken,
    organizerToken,
    isAuthenticated,
    activeUser,
    userRole,
    isOrganizer: Boolean(currentOrganizer),
    isUser: Boolean(currentUser),
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;
