import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';

const OrganizerLayout = () => {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      {/* Organizer layout wrapper */}
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default OrganizerLayout;
