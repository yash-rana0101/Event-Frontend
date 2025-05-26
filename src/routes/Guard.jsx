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

  const getUser = (userData) => {
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

  // Check for admin access (only for regular users, not organizers)
  const isAdmin = user?.role === 'admin' || user?.isAdmin === true;

  // Define authentication status based on route type
  const isAuthenticated = (() => {
    switch (type) {
      case 'admin':
        return Boolean(user && cleanUserToken && isAdmin);
      case 'organizer':
        return Boolean(organizer && cleanOrganizerToken);
      case 'user':
        return Boolean(user && cleanUserToken);
      default:
        return Boolean((user && cleanUserToken) || (organizer && cleanOrganizerToken));
    }
  })();

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
    //   isAdmin,
    //   isAuthenticated,
    // });
    const timer = setTimeout(() => setIsCheckingAuth(false), 500);
    return () => {
      clearTimeout(timer);
      setIsLoading(false);
    };
  }, [isCheckingAuth, setIsLoading, type, user, organizer, isAdmin, isAuthenticated]);

  // Route protection logic
  if (type === 'admin') {
    // Admin routes - only for regular users with admin role
    if (!user || !cleanUserToken || !isAdmin) {
      return <Navigate to="/login" replace />;
    }
  } else if (type === 'organizer') {
    // Organizer routes - only check organizer authentication
    if (!organizer || !cleanOrganizerToken) {
      return <Navigate to="/organizer/login" replace />;
    }
  } else if (type === 'user') {
    // Regular user routes
    if (!user || !cleanUserToken) {
      return <Navigate to="/login" replace />;
    }
  }

  // While checking authentication status, return null or loading component
  if (isCheckingAuth) {
    return null;
  }

  // If authenticated, render children or outlet
  if (isAuthenticated) {
    return children || <Outlet />;
  }

  // If not authenticated, navigate to login page
  const loginRoute = type === GUARD_TYPES.ORGANIZER ? '/auth/organizer-login' : '/auth/login';

  // Remember the location the user was trying to access
  return <Navigate to={loginRoute} state={{ from: location.pathname }} replace />;
};

export default Guard;