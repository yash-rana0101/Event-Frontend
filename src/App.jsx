import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRoutes from './config/Routes'; // Change from import { router } to import AppRoutes
import { fixPersistenceIssues } from './utils/persistFix';

function App() {
  // Fix localStorage persistence issues on mount
  useEffect(() => {
    fixPersistenceIssues();
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes /> {/* Use the imported component directly */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
}

export default App;