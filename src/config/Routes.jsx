import { createBrowserRouter } from 'react-router-dom';

// Layouts
import MainLayout from '../layout/Layout';
import AuthLayout from '../layout/AuthLayout';
import AdminLayout from '../layout/AdminLayout';

// Pages
import Home from '../pages/Home/Home';
import Register from '../pages/Auth/Register';
import Login from '../pages/Auth/Login';
import AdminLogin from '../pages/Admin/AdminLogin';
import AdminDashboard from '../components/Admin/Dashboard';
import UserManagement from '../components/Admin/UserManagement';
import EventManagement from '../components/Admin/EventManagement';
import ErrorPage from '../pages/common/Error';
import OrgRegister from '../pages/Auth/OrgRegister';
import About from '../pages/Home/About';
import Events from '../pages/Events/Events';
import Contact from '../pages/Home/Contact';

// Guards
import { AuthGuard, AdminGuard, PublicRoute } from '../routes/Guard';
import OrgLogin from '../pages/Auth/OrgLogin';
import Profile from '../pages/Organizer/OrganizerProfile';
import OrganizerDashboard from '../pages/Organizer/OrganizerDashboard.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: "About",
        element: <About/>,
      },
      {
        path: "event",
        element: <Events />,
      },
      {
        path: "Contact",
        element: <Contact />,
      },
      // Add other main routes here
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <PublicRoute><Login /></PublicRoute>,
      },
      {
        path: 'signup',
        element: <PublicRoute><Register /></PublicRoute>,
      },
    ],
  },
  {
    path: '/organizer',
    element: <AuthLayout />,
    children: [
      {
        path: 'register',
        element: <PublicRoute><OrgRegister /></PublicRoute>,
      },
      {
        path: 'login',
        element: <PublicRoute><OrgLogin /></PublicRoute>,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "dashboard",
        element: <OrganizerDashboard />,
      },
      // Add other organizer routes
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'login',
        element: <PublicRoute><AdminLogin /></PublicRoute>,
      },
      {
        path: '',
        element: <AdminGuard><AdminDashboard /></AdminGuard>,
      },
      {
        path: 'users',
        element: <AdminGuard><UserManagement /></AdminGuard>,
      },
      {
        path: 'events',
        element: <AdminGuard><EventManagement /></AdminGuard>,
      },
    ],
  },
]);