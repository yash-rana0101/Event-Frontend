import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout as userLogout } from '../../redux/user/userSlice';
import { logout as organizerLogout } from '../../redux/user/organizer';
import { thoroughAuthCleanup } from '../../utils/persistFix';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Check which type of user is logged in
  const userAuth = useSelector(state => state.auth);
  const organizerAuth = useSelector(state => state.organizer);

  useEffect(() => {
    // Determine which type of user to log out
    const hasUserAuth = userAuth?.token && userAuth?.isAuthenticated;
    const hasOrganizerAuth = organizerAuth?.token && organizerAuth?.isAuthenticated;
    
    console.log("Logging out user:", { hasUserAuth, hasOrganizerAuth });
    
    // Perform complete logout actions
    if (hasUserAuth) {
      thoroughAuthCleanup('user');
      dispatch(userLogout());
    }
    
    if (hasOrganizerAuth) {
      thoroughAuthCleanup('organizer');
      dispatch(organizerLogout());
    }
    
    // If no specific auth found, clean everything just to be sure
    if (!hasUserAuth && !hasOrganizerAuth) {
      thoroughAuthCleanup('all');
      dispatch(userLogout());
      dispatch(organizerLogout());
    }
    
    // Redirect to home page
    setTimeout(() => {
      navigate('/');
    }, 500);
  }, [dispatch, navigate, userAuth, organizerAuth]);

  return (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4 animate-spin"></div>
        <h1 className="text-2xl font-bold text-white mb-2">Logging out...</h1>
        <p className="text-gray-400">Please wait while we securely log you out.</p>
      </div>
    </div>
  );
};

export default Logout;
