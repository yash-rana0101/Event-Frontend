import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../layout/Layout';
import AdminLayout from '../layout/AdminLayout';
import Guard, { GUARD_TYPES } from '../routes/Guard';

// Public Pages
import Home from '../pages/Home/Home';
import Contact from '../pages/Home/Contact';

// Auth Pages
import Login from '../pages/Auth/Login';
import OrgLogin from '../pages/Auth/OrgLogin';
import Register from '../pages/Auth/Register';
import OrgRegister from '../pages/Auth/OrgRegister';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import ResetPassword from '../pages/Auth/ResetPassword';
import Logout from '../pages/Auth/Logout';

// Event Pages
import Events from '../pages/Events/Events';
import EventDetail from '../pages/Events/EventDetail';
import CreateEvent from '../pages/Events/CreateEvent';
import EditEvent from '../pages/Events/EditEvent';
import EventListPage from '../pages/Events/EventListPage';


// Organizer Pages
import OrganizerDashboard from '../pages/Organizer/OrganizerDashboard';
import OrganizerDetails from '../pages/Organizer/OrganizerDetails';
import OrganizerProfile from '../pages/Organizer/OrganizerProfile';
import EventAttendees from '../pages/Organizer/EventAttendees';

// user Pages
import UserDashboard from '../pages/User/UserDashboard';
import About from '../pages/Home/About';
import EditOrgProfile from '../pages/Organizer/EditOrgProfile';
import UserProfile from '../pages/User/UserProfile';
import EditUserProfile from '../pages/User/EditUserProfile';
import CreateUserProfile from '../pages/User/CreateUserProfile';


function AppRoutes() {
  return (
    <Routes>
      
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="contact" element={<Contact />} />
        <Route path="about" element={<About />} />
        <Route path="/organizer/profile/:organizerId" element={<OrganizerProfile />} />
        
        {/* Events */}
        <Route path="event" element={<Events />} />
        <Route path="event/:eventId" element={<EventDetail />} />
        
        {/* Auth Routes */}
        <Route path="auth">
          <Route path="login" element={<Login />} />
          <Route path="organizer-login" element={<OrgLogin />} />
          <Route path="signup" element={<Register />} />
          <Route path="organizer-register" element={<OrgRegister />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password/:token" element={<ResetPassword />} />
          <Route path="logout" element={<Logout />} />
        </Route>
      
      
      {/* User Protected Routes */}
      <Route path="/user" element={
        <Guard type={GUARD_TYPES.USER}>
          <AdminLayout />
        </Guard>
      }>
        <Route path="dashboard" element={<UserDashboard/>} />
        <Route path="profile" element={<UserProfile/>} />
        <Route path="profile/edit" element={<EditUserProfile/>} />
        <Route path="profile/create" element={<CreateUserProfile/>} />
      </Route>
      
      {/* Organizer Protected Routes */}
      <Route path="/organizer" element={
        <Guard type={GUARD_TYPES.ORGANIZER}>
          <AdminLayout />
        </Guard>
      }>
        <Route path="dashboard" element={<OrganizerDashboard />} />
        <Route path="profile" element={<OrganizerProfile />} />
        <Route path="profile/edit" element={<EditOrgProfile />} />
        <Route path="details" element={<OrganizerDetails />} />
        <Route path="events/list" element={<EventListPage />} />
        <Route path="events/attendees/:eventId" element={<EventAttendees />} />
        <Route path="event/edit/:eventId" element={<EditEvent />} />
        
        {/* Legacy path support */}
        <Route path="create" element={<CreateEvent />} />
      </Route>
      
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
    </Routes>
  );
}

export default AppRoutes;