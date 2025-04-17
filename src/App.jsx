import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { verifyUserToken } from './redux/user/userSlice';
import { verifyOrganizerToken } from './redux/user/organizer';
import AppRoutes from './config/Routes';
import { AuthProvider } from './context/AuthContext';
import { fixPersistenceIssues } from './utils/persistFix';
import { LoaderProvider } from './context/LoaderContext';
import GlobalLoader from './components/UI/GlobalLoader';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Clean up any persistence issues
    fixPersistenceIssues();

    // Try to verify both user and organizer tokens
    const userToken = localStorage.getItem('token');
    if (userToken && userToken !== 'null') {
      dispatch(verifyUserToken());
    }

    const organizerToken = localStorage.getItem('organizer_token');
    if (organizerToken && organizerToken !== 'null') {
      dispatch(verifyOrganizerToken());
    }
  }, [dispatch]);

  return (
    <LoaderProvider>
      <GlobalLoader />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </LoaderProvider>
  );
}

export default App;