import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { isStaticPage } from '../utils/routeUtils';

const AuthLayout = () => {
  const location = useLocation();
  const shouldShowFooter = isStaticPage(location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <Header />
      <main>
        <Outlet />
      </main>
      {shouldShowFooter && <Footer />}
    </div>
  );
};

export default AuthLayout;