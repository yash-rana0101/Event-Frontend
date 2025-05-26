/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { BsPersonCircle, BsGrid3X3Gap } from 'react-icons/bs';
import { FaBars, FaHome, FaPhoneAlt } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import { GiTrophy } from 'react-icons/gi';
import { IoIosAlert } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings
} from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';
import Navigation from './Navigation';
import UserDropdown from './UserDropdown';
import AuthButtons from './AuthButtons';
import MobileMenu from './MobileMenu';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const controls = useAnimation();

  const {
    currentUser,
    currentOrganizer,
    profileLink,
    activeUser,
    organizer,
    isAdmin,
    adminData,
    debugAuthInfo,
    hasValidAuthentication,
    handleLogout
  } = useAuth();

  const DefaultImg = "https://api.dicebear.com/9.x/dylan/svg?seed=Caleb";
  const leaduserdemo = "https://api.dicebear.com/9.x/dylan/svg?seed=Caleb";

  const nav = [
    {
      name: "Home",
      link: "/",
      icon: <FaHome />,
      guestOnly: true,
    },
    {
      name: "About",
      link: "/about",
      icon: <IoIosAlert />,
      guestOnly: true,
    },
    {
      name: "Event",
      link: "/event",
      icon: <GiTrophy />,
      guestOnly: false,
    },
    {
      name: "Contact",
      link: "/contact",
      icon: <FaPhoneAlt />,
      guestOnly: false,
    },
  ];

  const organizerNav = [
    {
      name2: "Organizer Profile",
      link2: profileLink || "/auth/login",
      icon: <BsPersonCircle />,
      requiresAuth: true
    },
    {
      name2: "Dashboard",
      link2: "/organizer/dashboard",
      icon: <BsGrid3X3Gap />,
    },
  ];

  const userNav = [
    {
      name2: "Profile",
      link2: profileLink || "/auth/login",
      icon: <BsPersonCircle />,
      requiresAuth: true
    },
    {
      name2: "Dashboard",
      link2: "/user/dashboard",
      icon: <BsGrid3X3Gap />,
    },
  ];

  const newNav = currentOrganizer ? organizerNav : userNav;

  const adminNavItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'organizer', href: '/admin/organizer', icon: Users },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    });
  }, []);

  return (
    <motion.div
      className={`sticky z-40 top-0 w-full h-20 md:px-10 px-4 ${isScrolled ? "bg-black" : "bg-transparent"}`}
      animate={controls}
      initial={{ backgroundColor: "black" }}
      transition={{ duration: 0.3 }}
    >
      {debugAuthInfo && (
        <div className="fixed bottom-0 right-0 bg-black/80 text-xs text-white p-2 max-w-xs z-50" style={{ display: 'none' }}>
          Auth: {debugAuthInfo.authState.tokenExists ? '✓' : '✗'}
          Org: {debugAuthInfo.organizerState.tokenExists ? '✓' : '✗'}
          User: {debugAuthInfo.activeUser ? '✓' : '✗'}
        </div>
      )}

      <div className="w-full h-full flex justify-between items-center border-b-2 border-[#00D8FF]">
        <div className="text-2xl flex items-center gap-2 font-bold relative">
          <button
            className="z-10 cursor-pointer bg-transparent border-none p-0 font-inherit"
            onClick={() => {
              navigate("/");
            }}
            aria-label="Navigate to home page"
          >
            <span className="text-[#00D8FF]">Event</span>{" "}
            <span className="drop-shadow-[0px_0px_5px_#00D8FF]">System</span>
          </button>
          <div className="h-40 w-40 bg-[#00D8FF] overflow-hidden absolute top-0 -translate-y-1/2 right-0 translate-x-1/4 rounded-full opacity-45 blur-2xl"></div>
        </div>

        <Navigation
          isAdmin={isAdmin}
          organizer={organizer}
          activeUser={activeUser}
          currentOrganizer={currentOrganizer}
          profileLink={profileLink}
          adminNavItems={adminNavItems}
          nav={nav}
        />

        <div className="flex items-center relative">
          {activeUser || hasValidAuthentication() ? (
            <UserDropdown
              isAdmin={isAdmin}
              adminData={adminData}
              currentOrganizer={currentOrganizer}
              currentUser={currentUser}
              handleLogout={handleLogout}
              leaduserdemo={leaduserdemo}
            />
          ) : (
            <AuthButtons />
          )}

          <div className="md:hidden">
            <button
              className="text-[#00D8FF] focus:outline-none transition-all duration-300"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <FaXmark className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>

          <MobileMenu
            isMenuOpen={isMenuOpen}
            toggleMenu={toggleMenu}
            activeUser={activeUser}
            isAdmin={isAdmin}
            adminData={adminData}
            currentOrganizer={currentOrganizer}
            currentUser={currentUser}
            DefaultImg={DefaultImg}
            adminNavItems={adminNavItems}
            newNav={newNav}
            nav={nav}
            handleLogout={handleLogout}
          />
        </div>
      </div>
    </motion.div>
  );
}
