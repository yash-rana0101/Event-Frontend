import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminLayout = () => {
  const navigate = useNavigate();
  const user = useSelector(state => state.auth?.user);
  const token = useSelector(state => state.auth?.token);

  useEffect(() => {
    // Check if user is authenticated and has admin role
    if (!token || !user) {
      navigate('/auth/login');
      return;
    }

    if (user.role !== 'admin' && !user.isAdmin) {
      navigate('/'); // Redirect to home if not admin
      return;
    }
  }, [user, token, navigate]);

  // Don't render admin content if user is not admin
  if (!user || (user.role !== 'admin' && !user.isAdmin)) {
    return null;
  }

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