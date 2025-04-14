import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { verifyUserToken } from '../redux/user/userSlice';
import { verifyOrganizerToken } from '../redux/user/organizer';
import { fixPersistenceIssues } from '../utils/persistFix';

// Types of guards
const GUARD_TYPES = {
  USER: 'user',
  ORGANIZER: 'organizer',
  ANY: 'any',
};

const Guard = ({ children, type = GUARD_TYPES.USER, redirectTo }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [isVerifying, setIsVerifying] = useState(true);
  
  // Get authentication state from Redux
  const userAuth = useSelector(state => state.auth);
  const organizerAuth = useSelector(state => state.organizer);
  
  // Default redirect paths
  const defaultRedirects = {
    [GUARD_TYPES.USER]: '/auth/login',
    [GUARD_TYPES.ORGANIZER]: '/auth/organizer-login',
    [GUARD_TYPES.ANY]: '/auth/login',
  };
  
  // Determine final redirect path
  const finalRedirectTo = redirectTo || defaultRedirects[type] || '/auth/login';

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Fix any persistence issues with tokens
        fixPersistenceIssues();
        
        // Verify tokens based on guard type
        if (type === GUARD_TYPES.USER || type === GUARD_TYPES.ANY) {
          if (userAuth.token) {
            await dispatch(verifyUserToken()).unwrap();
          }
        }
        
        if (type === GUARD_TYPES.ORGANIZER || type === GUARD_TYPES.ANY) {
          if (organizerAuth.token) {
            await dispatch(verifyOrganizerToken()).unwrap();
          }
        }
      } catch (error) {
        console.error('Token verification failed:', error);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAuth();
  }, [dispatch, type, userAuth.token, organizerAuth.token]);

  // Show nothing while verifying to prevent flashes of redirect
  if (isVerifying) {
    return null;
  }

  // Check if user is authenticated based on guard type
  const isAuthenticated = (() => {
    switch (type) {
      case GUARD_TYPES.USER:
        return !!userAuth.token && !!userAuth.user;
      case GUARD_TYPES.ORGANIZER:
        return !!organizerAuth.token && !!organizerAuth.user;
      case GUARD_TYPES.ANY:
        return (!!userAuth.token && !!userAuth.user) || (!!organizerAuth.token && !!organizerAuth.user);
      default:
        return false;
    }
  })();

  if (!isAuthenticated) {
    // Redirect to login with current location saved for later redirect back
    return <Navigate to={finalRedirectTo} state={{ from: location.pathname }} replace />;
  }

  return children;
};

// Export guard types for convenience
export { GUARD_TYPES };
export default Guard;