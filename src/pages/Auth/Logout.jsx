import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout as userLogout } from '../../redux/user/userSlice';
import { logout as organizerLogout } from '../../redux/user/organizer';
import { fullLogout } from '../../utils/persistFix';
import { toast } from 'react-toastify';

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Check what type of user is logged in
  const userToken = useSelector(state => state.auth?.token);
  const organizerToken = useSelector(state => state.organizer?.token);

  useEffect(() => {
    const performLogout = () => {
      try {
        // Determine which type of logout to perform
        let logoutMessage = '';

        if (organizerToken) {
          // Organizer logout
          fullLogout("organizer");
          dispatch(organizerLogout());
          logoutMessage = 'You have been logged out from your organizer account';
        } else if (userToken) {
          // User logout (including admin)
          fullLogout("user");
          dispatch(userLogout());
          logoutMessage = 'You have been logged out from your account';
        } else {
          // No tokens found
          fullLogout("all");
          logoutMessage = 'You were already logged out';
        }

        toast.success(logoutMessage);

        // Redirect to home page
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Logout error:', error);
        toast.error('There was a problem logging you out. Please try again.');
      }
    };

    performLogout();
  }, [dispatch, navigate, userToken, organizerToken]);

  // This component doesn't render anything, it just performs the logout
  return null;
};

export default Logout;
