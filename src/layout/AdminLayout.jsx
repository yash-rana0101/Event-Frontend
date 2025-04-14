import React from 'react';
import { Outlet } from 'react-router-dom';
// Import your admin sidebar if you have one
// import AdminSidebar from '../components/Admin/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-black">
      {/* <AdminSidebar /> */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;