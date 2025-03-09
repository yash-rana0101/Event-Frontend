import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { useIsStaticPage } from '../utils/routeUtils';

const Layout = () => {
  const isStaticPage = useIsStaticPage();

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
      {isStaticPage && <Footer />}
    </>
  );
};

export default Layout;