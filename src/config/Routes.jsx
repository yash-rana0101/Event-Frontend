import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { OrganizerGuard, PublicRoute, ProfileCompletedGuard, AuthGuard, AdminGuard } from '../routes/Guard';

// Page imports
import Home from '../pages/Home/Home';
import Event from '../pages/Events/Events';
import EventDetail from '../pages/Events/EventDetail';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import OrgLogin from '../pages/Auth/OrgLogin';
import OrgRegister from '../pages/Auth/OrgRegister';
import OrganizerDashboard from '../pages/Organizer/OrganizerDashboard';
import OrganizerDetails from '../pages/Organizer/OrganizerDetails';
import OrganizerProfile from '../pages/Organizer/OrganizerProfile';
import CreateEditEvent from '../pages/Organizer/CreateEditEvent';
import EventAttendees from '../pages/Organizer/EventAttendees';
import EditEvent from '../pages/Events/EditEvent';
import Logout from '../pages/Auth/Logout';
import About from '../pages/Home/About';
import Contact from '../pages/Home/Contact';

// Layout imports
import Layout from '../layout/Layout';
import AdminLayout from '../layout/AdminLayout';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="event" element={<Event />} />
        <Route path="contact" element={<Contact />} />
        <Route path="event/:eventId" element={<EventDetail />} />

        {/* Auth Routes */}
        <Route path="auth">
          <Route
            path="login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="signup"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="organizer/login"
            element={
              <PublicRoute>
                <OrgLogin />
              </PublicRoute>
            }
          />
          <Route
            path="organizer/register"
            element={
              <PublicRoute>
                <OrgRegister />
              </PublicRoute>
            }
          />
          <Route path="logout" element={<Logout />} />
        </Route>

        {/* Organizer Routes */}
        <Route path="organizer">
          <Route
            path="login"
            element={
              <PublicRoute>
                <OrgLogin />
              </PublicRoute>
            }
          />
          <Route
            path="register"
            element={
              <PublicRoute>
                <OrgRegister />
              </PublicRoute>
            }
          />
          <Route
            path="dashboard"
            element={
              <ProfileCompletedGuard>
                <OrganizerDashboard />
              </ProfileCompletedGuard>
            }
          />
          <Route
            path="details"
            element={
              <OrganizerGuard>
                <OrganizerDetails />
              </OrganizerGuard>
            }
          />
          <Route
            path="profile/:organizerId"
            element={<OrganizerProfile />}
          />
          <Route
            path="create"
            element={
              <ProfileCompletedGuard>
                <CreateEditEvent />
              </ProfileCompletedGuard>
            }
          />
          <Route
            path="edit/:eventId"
            element={
              <ProfileCompletedGuard>
                <EditEvent />
              </ProfileCompletedGuard>
            }
          />
          <Route
            path="events/:eventId/attendees"
            element={
              <ProfileCompletedGuard>
                <EventAttendees />
              </ProfileCompletedGuard>
            }
          />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminGuard>
            <AdminLayout />
          </AdminGuard>
        }
      >
        {/* Add admin routes here */}
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;