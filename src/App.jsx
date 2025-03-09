import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import { router } from "./config/Routes";

import { fixPersistenceIssues } from './utils/persistFix';
import { verifyUserToken } from './redux/user/userSlice';
import { verifyOrganizerToken } from './redux/user/organizer';
import { debugAuth } from './debug/authDebugger';

function App() {
  const dispatch = useDispatch();

  // Fix persistence issues and debug on application start
  useEffect(() => {
    // First fix any persistence issues
    const result = fixPersistenceIssues();
    console.log("Persistence fix result:", result);

    // Debug current auth state
    console.log("Initial auth state:", debugAuth());

    // Log the API base URL to help troubleshoot
    console.log("API URL:", import.meta.env.VITE_API_URL);

    // Then try to verify tokens if they exist
    const organizerToken = localStorage.getItem("organizer_token");
    if (organizerToken && organizerToken !== "null") {
      console.log("App initialization: Found organizer token, verifying...");
      dispatch(verifyOrganizerToken())
        .unwrap()
        .then(result => {
          console.log("Organizer verification successful:", result);
        })
        .catch(error => {
          console.error("Organizer verification failed:", error);
        });
    }

    const userToken = localStorage.getItem("token");
    if (userToken && userToken !== "null") {
      console.log("App initialization: Found user token, verifying...");
      dispatch(verifyUserToken());
    }
  }, [dispatch]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  );
}

export default App;