/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { verifyOrganizerToken, checkOrganizerProfileCompletion } from '../redux/user/organizer';

// Public routes - accessible when not logged in
export const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.organizer || {});

  if (isAuthenticated) {
    return <Navigate to="/organizer/dashboard" replace />;
  }

  return children || <Outlet />;
};

// Auth guard for organizer routes
export const OrganizerGuard = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, loading, profileComplete, token } = useSelector((state) => state.organizer || {});
  
  // Track if we're currently on the details page to prevent redirect loops
  const isOnDetailsPage = location.pathname.includes('/organizer/details');

  // Check if we've shown the details page in the current session
  const hasShownDetailsRecently = () => {
    const lastShown = localStorage.getItem('organizer_details_last_shown');
    if (!lastShown) return false;
    
    // If shown in the last 5 minutes, don't show again
    const fiveMinutesAgo = new Date().getTime() - 5 * 60 * 1000;
    return parseInt(lastShown) > fiveMinutesAgo;
  };

  useEffect(() => {
    // Always verify token first
    if (!loading && token) {
      dispatch(verifyOrganizerToken()).then(() => {
        // After token verification, force a fresh profile completion check
        dispatch(checkOrganizerProfileCompletion());
      });
    }
  }, [dispatch, token]);

  // Log the current state for debugging
  console.log("OrganizerGuard - Auth state:", { 
    isAuthenticated, 
    profileComplete, 
    path: location.pathname,
    isOnDetailsPage,
    hasShownDetailsRecently: hasShownDetailsRecently(),
  });

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/organizer/login" state={{ from: location }} replace />;
  }

  // Only redirect to details page if:
  // 1. Profile is not complete
  // 2. Not already on the details page
  // 3. Not trying to logout
  // 4. Haven't just shown the details page recently
  if (isAuthenticated && 
      profileComplete === false && 
      !isOnDetailsPage &&
      !location.pathname.includes('/auth/logout') &&
      !hasShownDetailsRecently()) {
    console.log("Profile not complete, redirecting to details page");
    return <Navigate to="/organizer/details" replace />;
  }

  return children || <Outlet />;
};

// For routes that require profile completion
export const ProfileCompletedGuard = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, profileComplete, token } = useSelector((state) => state.organizer || {});

  // Force a profile completion check on mount
  useEffect(() => {
    if (token) {
      dispatch(checkOrganizerProfileCompletion());
    }
  }, [dispatch, token]);

  console.log("ProfileCompletedGuard - State:", { isAuthenticated, profileComplete });

  if (!isAuthenticated) {
    console.log("ProfileCompletedGuard: Not authenticated, redirecting to login");
    return <Navigate to="/organizer/login" replace />;
  }

  if (isAuthenticated && profileComplete === false) {
    console.log("ProfileCompletedGuard: Profile not complete, redirecting to details");
    return <Navigate to="/organizer/details" replace />;
  }

  return children || <Outlet />;
};

// Admin guard - unchanged
export const AdminGuard = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (user && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children || <Outlet />;
};

// Auth guard - unchanged
export const AuthGuard = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children || <Outlet />;
};