import React from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <main>
        <Outlet />
      </main>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AuthLayout;