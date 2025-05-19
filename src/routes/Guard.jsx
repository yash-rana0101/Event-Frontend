import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useLoader } from '../context/LoaderContext';

// Export guard types as a constant
export const GUARD_TYPES = {
  USER: 'user',
  ORGANIZER: 'organizer',
  ADMIN: 'admin'
};

const Guard = ({ type, children }) => {
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { setIsLoading } = useLoader();

  // Get authentication state from Redux
  const authState = useSelector(state => state.auth);
  const organizerState = useSelector(state => state.organizer);

  // Parse user data if it's stored as a string
  const getUser = (userData) => {
    if (!userData) return null;
    
    if (typeof userData === 'string') {
      try {
        return JSON.parse(userData);
      } catch (e) {
        console.error('Error parsing user data:', e);
        return null;
      }
    }
    
    return userData;
  };
  
  const user = getUser(authState?.user);
  const userToken = authState?.token;
  
  const organizer = getUser(organizerState?.user);
  const organizerToken = organizerState?.token;
  
  // Parse token if needed
  const parseToken = (token) => {
    if (!token) return null;
    
    if (typeof token === 'string') {
      // Remove quotes if the token is stored with them
      return token.replace(/^"(.*)"$/, '$1');
    }
    
    return token;
  };
  
  const cleanUserToken = parseToken(userToken);
  const cleanOrganizerToken = parseToken(organizerToken);

  // Set up loading state
  useEffect(() => {
    setIsLoading(isCheckingAuth);
    
    // Debugging - log authentication state
    // console.log('Guard Authentication Check:', {
    //   type,
    //   user: Boolean(user),
    //   userToken: Boolean(cleanUserToken),
    //   organizer: Boolean(organizer),
    //   organizerToken: Boolean(cleanOrganizerToken),
    //   isCheckingAuth
    // });
    
    const timer = setTimeout(() => setIsCheckingAuth(false), 500);
    return () => {
      clearTimeout(timer);
      setIsLoading(false);
    };
  }, [isCheckingAuth, setIsLoading, type, user, organizer]);

  // Check if authenticated based on type
  const isAuthenticated = () => {
    if (type === GUARD_TYPES.USER) {
      return Boolean(user && cleanUserToken);
    }
    if (type === GUARD_TYPES.ORGANIZER) {
      return Boolean(organizer && cleanOrganizerToken);
    }
    return false;
  };

  // Remove loading state after checking auth
  useEffect(() => {
    if (isCheckingAuth) {
      setIsCheckingAuth(false);
    }
  }, []);

  // While checking authentication status, return null or loading component
  if (isCheckingAuth) {
    return null;
  }

  // If authenticated, render children or outlet
  if (isAuthenticated()) {
    return children || <Outlet />;
  }

  // If not authenticated, navigate to login page
  const loginRoute = type === GUARD_TYPES.ORGANIZER ? '/auth/organizer-login' : '/auth/login';
  
  // Remember the location the user was trying to access
  return <Navigate to={loginRoute} state={{ from: location.pathname }} replace />;
};

export default Guard;