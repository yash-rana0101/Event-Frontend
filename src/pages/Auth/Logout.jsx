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
        // Use fullLogout utility to clean localStorage thoroughly
        fullLogout();
        
        // Dispatch appropriate logout actions
        if (userToken) {
          dispatch(userLogout());
          toast.success('You have been logged out from your user account');
        }
        
        if (organizerToken) {
          dispatch(organizerLogout());
          toast.success('You have been logged out from your organizer account');
        }
        
        // If no tokens found, show generic message
        if (!userToken && !organizerToken) {
          toast.info('You were already logged out');
        }
        
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
