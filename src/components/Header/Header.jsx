import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, verifyUserToken, fixNullValues as fixUserNullValues } from '../../redux/user/userSlice';
import { logout as organizerLogout, verifyOrganizerToken, fixNullValues as fixOrganizerNullValues } from '../../redux/user/organizer';
// eslint-disable-next-line no-unused-vars
import { motion, useAnimation } from 'framer-motion';
import { BsPersonCircle, BsGrid3X3Gap } from 'react-icons/bs';
import { SiFreelancer } from 'react-icons/si';
import { TbSignRight, TbLogin, TbLogout } from 'react-icons/tb';
import { FaAngleDown, FaBars, FaHome } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import { GiTrophy } from 'react-icons/gi';
import { IoIosAlert } from 'react-icons/io';
import { MdMiscellaneousServices } from 'react-icons/md';
import { PiRankingFill } from 'react-icons/pi';
import { FaPhoneAlt } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = React.useState(false);
  const [debugAuthInfo, setDebugAuthInfo] = useState(null);

  // Enhanced state access with more robust checks
  // const auth = useSelector((state) => state.auth);
  // const organizer = useSelector((state) => state.organizer);
  const currentUser = useSelector((state) => state.auth?.user);
  const currentOrganizer = useSelector((state) => state.organizer?.user);
  const authToken = useSelector((state) => state.auth?.token);
  const organizerToken = useSelector((state) => state.organizer?.token);

  const dispatch = useDispatch();
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

  const userNav = [
    {
      name2: "Profile",
      link2: "/dashboard/profile",
      icon: <BsPersonCircle />,
    },
    {
      name2: "Dashboard",
      link2: "/dashboard",
      icon: <BsGrid3X3Gap />,
    },
  ];

  const organizerNav = [
    {
      name2: "Organizer Profile",
      link2: "/organizer/profile",
      icon: <BsPersonCircle />,
    },
    {
      name2: "Event Management",
      link2: "/organizer/dashboard",
      icon: <BsGrid3X3Gap />,
    },
  ];

  // Choose the correct navigation based on who is logged in
  const newNav = currentOrganizer ? organizerNav : userNav;

  const navigate = useNavigate();
  const controls = useAnimation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleLogout = () => {
    if (currentOrganizer) {
      dispatch(organizerLogout());
    } else {
      dispatch(logout());
    }
    navigate("/");
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

  const menuVariants = {
    visible: { x: 0 },
    hidden: { x: "100%" },
  };

  const itemVariants = {
    hidden: { x: 20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  // Fix the "null" string issue on component mount
  useEffect(() => {
    // Dispatch fixes for possible "null" string values
    dispatch(fixUserNullValues());
    dispatch(fixOrganizerNullValues());

    // Then try to verify tokens
    const organizerToken = localStorage.getItem("organizer_token");
    if (organizerToken && organizerToken !== "null") {
      console.log("Found organizer token, verifying...");
      dispatch(verifyOrganizerToken());
    }

    const userToken = localStorage.getItem("token");
    if (userToken && userToken !== "null") {
      console.log("Found user token, verifying...");
      dispatch(verifyUserToken());
    }
  }, [dispatch]);

  // Debug effect to log auth state on every render or auth change
  useEffect(() => {
    // Create a debug object for inspection
    const debug = {
      authState: {
        user: currentUser,
        token: authToken,
        tokenExists: !!authToken,
        isValidToken: authToken && typeof authToken === 'string' && authToken.startsWith('ey'),
        tokenType: typeof authToken
      },
      organizerState: {
        user: currentOrganizer,
        token: organizerToken,
        tokenExists: !!organizerToken,
        isValidToken: organizerToken && typeof organizerToken === 'string' && organizerToken.startsWith('ey'),
        tokenType: typeof organizerToken
      },
      activeUser: currentUser || currentOrganizer,
      isAuthenticated: !!(currentUser || currentOrganizer),
      localStorage: {
        userToken: localStorage.getItem("token"),
        organizerToken: localStorage.getItem("organizer_token")
      }
    };

    setDebugAuthInfo(debug);
    console.log("Auth Debug Info:", debug);

    // Force UI update if we detect token but no user - auto refresh user data
    if (organizerToken && !currentOrganizer) {
      console.log("Organizer token exists but user is null - fetching organizer data");
      dispatch(verifyOrganizerToken());
    }
  }, [currentUser, currentOrganizer, authToken, organizerToken, dispatch]);

  // Determine the active user (either regular user or organizer) with more robust check
  const activeUser = currentUser || currentOrganizer || null;

  // Function to check if we have valid auth
  const hasValidAuthentication = () => {
    return Boolean(
      (authToken && typeof authToken === 'string' && authToken.startsWith('ey')) ||
      (organizerToken && typeof organizerToken === 'string' && organizerToken.startsWith('ey'))
    );
  };

  return (
    <motion.div
      className={`sticky z-40 top-0 w-full h-20 md:px-10 px-4 ${isScrolled ? "bg-black" : "bg-transparent"}`}
      animate={controls}
      initial={{ backgroundColor: "black" }}
      transition={{ duration: 0.3 }}
    >
      {/* Optional: Debug indicator (remove in production) */}
      {debugAuthInfo && (
        <div className="fixed bottom-0 right-0 bg-black/80 text-xs text-white p-2 max-w-xs z-50" style={{ display: 'none' }}>
          Auth: {debugAuthInfo.authState.tokenExists ? '✓' : '✗'}
          Org: {debugAuthInfo.organizerState.tokenExists ? '✓' : '✗'}
          User: {debugAuthInfo.activeUser ? '✓' : '✗'}
        </div>
      )}

      <div className="w-full h-full flex justify-between items-center border-b-2 border-[#00D8FF]">
        {/* Logo */}
        <div className="text-2xl flex items-center gap-2 font-bold relative">
          <button
            className="z-10 cursor-pointer bg-transparent border-none p-0 font-inherit"
            onClick={() => {
              navigate("/");
            }}
            aria-label="Navigate to home page"
          >
            <span className="text-[#00D8FF]">Cyber</span>{" "}
            <span className="drop-shadow-[0px_0px_5px_#00D8FF]">Hunter</span>
          </button>
          <div className="h-40 w-40 bg-[#00D8FF] overflow-hidden absolute top-0 -translate-y-1/2 right-0 translate-x-1/4 rounded-full opacity-45 blur-2xl"></div>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-1">
          {activeUser ? (
            <>
              {/* Profile Link */}
              <NavLink
                to={currentOrganizer ? "/organizer/profile" : "/dashboard/profile"}
                className={({ isActive }) =>
                  `group relative px-4 py-2 rounded-lg transition-all duration-300 hover:cursor-pointer ${isActive
                    ? "text-[#00D8FF]"
                    : "text-gray-400 hover:text-white"
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <BsPersonCircle size={24} />
                  <span className="relative">
                    {currentOrganizer ? "Organizer Profile" : "Profile"}
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#00D8FF] group-hover:w-full transition-all duration-300" />
                  </span>
                </div>
                <div className="absolute inset-0 bg-[#00D8FF]/0 group-hover:bg-[#00D8FF]/10 rounded-lg transition-all duration-300" />
              </NavLink>

              {/* Dashboard Link */}
              <NavLink
                to={currentOrganizer ? "/organizer/dashboard" : "/dashboard"}
                end
                className={({ isActive }) =>
                  `group relative px-4 py-2 rounded-lg transition-all duration-300 ${isActive
                    ? "text-[#00D8FF]"
                    : "text-gray-400 hover:text-white"
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <BsGrid3X3Gap size={24} />
                  <span className="relative ">
                    {currentOrganizer ? "Event Management" : "Dashboard"}
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#00D8FF] group-hover:w-full transition-all duration-300" />
                  </span>
                </div>
                <div className="absolute inset-0 bg-[#00D8FF]/0 group-hover:bg-[#00D8FF]/10 rounded-lg transition-all duration-300" />
              </NavLink>

              {/* Only show Freelance link for regular users */}
              {currentUser && (
                <NavLink
                  to="/freelancer"
                  end
                  className={({ isActive }) =>
                    `group relative px-4 py-2 rounded-lg transition-all duration-300 ${isActive
                      ? "text-[#00D8FF]"
                      : "text-gray-400 hover:text-white"
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <SiFreelancer size={26} />
                    <span className="relative">
                      Freelance
                      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#00D8FF] group-hover:w-full transition-all duration-300" />
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-[#00D8FF]/0 group-hover:bg-[#00D8FF]/10 rounded-lg transition-all duration-300" />
                </NavLink>
              )}

              {/* Filtered nav items (Leaderboard, Event, Contact) */}
              {nav
                .filter((item) => !item.guestOnly)
                .map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.link}
                    className={({ isActive }) =>
                      `group relative px-4 py-2 rounded-lg transition-all duration-300 ${isActive
                        ? "text-[#00D8FF]"
                        : "text-gray-400 hover:text-white"
                      }`
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center justify-center">
                        {React.cloneElement(item.icon, { size: 24 })}  {/* Explicitly set icon size to 24px */}
                      </span>
                      <span className="relative">
                        {item.name}
                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#00D8FF] group-hover:w-full transition-all duration-300" />
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-[#00D8FF]/0 group-hover:bg-[#00D8FF]/10 rounded-lg transition-all duration-300" />
                  </NavLink>
                ))}
            </>
          ) : (
            // Guest navigation
            nav.map((item) => (
              <NavLink
                key={item.name}
                to={item.link}
                className={({ isActive }) =>
                  `group relative px-4 py-2 rounded-lg transition-all duration-300 ${isActive
                    ? "text-[#00D8FF]"
                    : "text-gray-400 hover:text-white"
                  }`
                }
              >
                <div className="flex items-center space-x-2">
                  {item.icon}
                  <span className="relative">
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#00D8FF] group-hover:w-full transition-all duration-300" />
                  </span>
                </div>
                <div className="absolute inset-0 bg-[#00D8FF]/0 group-hover:bg-[#00D8FF]/5 rounded-lg transition-all duration-300" />
              </NavLink>
            ))
          )}
        </nav>

        <div className="flex items-center relative">
          {/* User Profile / Buttons */}
          {activeUser || hasValidAuthentication() ? (
            <div id="user-dropdown" className="relative">
              <div
                onClick={toggleUserDropdown}
                className="md:flex hidden items-center gap-3 border border-[#00D8FF]/30 rounded-full p-1 pr-4 text-white cursor-pointer backdrop-blur-sm bg-black/30 hover:text-[#00D8FF] hover:border-[#00D8FF] hover:bg-[#00D8FF]/5 transform transition-all duration-300 ease-out hover:shadow-[0_0_15px_rgba(0,216,255,0.3)] group relative overflow-hidden"
                title="User Menu"
              >
                {/* Glow effect behind image */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-[#00D8FF]/0 via-[#00D8FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />

                {/* Profile Image Container */}
                <div className="relative">
                  <div
                    className="absolute inset-0 bg-[#00D8FF] rounded-full blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  />
                  <img
                    src={
                      (currentOrganizer?.profilePicture || currentUser?.profilePicture || leaduserdemo)
                    }
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-[#00D8FF]/50 transform transition-all duration-300 group-hover:scale-105 relative z-10"
                  />
                </div>

                {/* Username with User Type Badge */}
                <div className="flex flex-col">
                  <span className="font-semibold relative">
                    <span className="relative z-10 group-hover:text-[#00D8FF] transition-colors duration-300">
                      {currentOrganizer ? currentOrganizer.name : currentUser?.name || " "}
                    </span>
                    <span
                      className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#00D8FF] group-hover:w-full transition-all duration-300"
                    />
                  </span>
                  {/* User type indicator */}
                  <span className="text-xs text-[#00D8FF]/70">
                    {currentOrganizer ? "Organizer" : "User"}
                  </span>
                </div>

                {/* Dropdown Icon with Animation */}
                <span
                  className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-y-[2px] relative z-10"
                >
                  <FaAngleDown className="text-[#00D8FF]/70 group-hover:text-[#00D8FF]" />
                </span>

                {/* Hover Animation Border */}
                <div
                  className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00D8FF]/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                />
              </div>

              {/* Dropdown Menu */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-black border border-[#00D8FF] rounded-lg shadow-lg z-50">
                  <div className="px-4 py-2 font-bold text-[#00D8FF] border-b border-[#00D8FF]">
                    {currentOrganizer ? "Organizer Account" : "User Account"}
                  </div>

                  <ul className="py-1">
                    <div className="border-t border-[#00D8FF]/20 my-1"></div>
                    <li
                      onClick={handleLogout}
                      className="px-4 py-2 hover:bg-[#00D8FF]/10 cursor-pointer text-red-500 hover:text-red-400 flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <motion.button
                className="group relative hidden md:flex items-center gap-2 px-6 py-2 rounded-full overflow-hidden border-2 border-cyan-500/30 hover:border-[#00D8FF] transition-colors duration-300 hover:cursor-pointer"
                onClick={() => navigate("/auth/signup")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Background gradient effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#00D8FF]/0 via-[#00D8FF]/10 to-[#00D8FF]/0"
                  animate={{
                    x: ["100%", "-100%"],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "linear",
                  }}
                />

                {/* Icon and text */}
                <TbSignRight className="text-[#00D8FF] group-hover:scale-110 transition-transform duration-300" />
                <span className="text-white font-bold relative">
                  Sign Up
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#00D8FF] group-hover:w-full transition-all duration-300" />
                </span>

                {/* Glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-[#00D8FF]/10 blur-md" />
                </div>
              </motion.button>

              <motion.button
                className="group relative  items-center gap-2 md:px-6 md:py-2 hidden md:flex rounded-full overflow-hidden mr-4  transition-colors duration-300 border-2 hover:border-[#00D8FF] hover:cursor-pointer border-cyan-500/30"
                onClick={() => navigate("/auth/login")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Animated background particles */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    background: [
                      "radial-gradient(circle at 20% 20%, rgba(0,216,255,0.4) 0%, transparent 10%)",
                      "radial-gradient(circle at 80% 80%, rgba(0,216,255,0.4) 0%, transparent 50%)",
                    ],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />

                {/* Icon and text */}
                <TbLogin className="text-cyan-500 group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-white font-bold relative">
                  Login
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-cyan-500 group-hover:w-full transition-all duration-300" />
                </span>

                {/* Shine effect */}
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
              </motion.button>
            </div>
          )}

          {/* Mobile Menu Button */}
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

          {/* Updated Mobile Menu */}
          <motion.div
            className={`fixed top-0 right-0 h-full w-full md:w-1/2 lg:w-1/3 bg-black/95 backdrop-blur-lg 
            border-l border-[#00D8FF]/20 z-50 ${isMenuOpen ? "block" : "hidden"}`}
            variants={menuVariants}
            initial="hidden"
            animate={isMenuOpen ? "visible" : "hidden"}
          >
            {/* Close Button */}
            <motion.button
              className="absolute top-4 right-4 p-2 rounded-full bg-[#00D8FF]/10 text-[#00D8FF]
              hover:bg-[#00D8FF]/20 transition-colors duration-200 z-50"
              onClick={toggleMenu}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ rotate: 0 }}
              animate={{ rotate: isMenuOpen ? 180 : 0 }}
            >
              <FaXmark className="w-6 h-6" />
            </motion.button>

            <div className="h-full flex flex-col p-6 overflow-y-auto">
              {/* Profile Section */}
              <motion.div
                className="flex flex-col items-center space-y-4 py-8"
                variants={itemVariants}
              >
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-[#00D8FF] ring-offset-2 ring-offset-black">
                    {activeUser ? (
                      <img
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        src={(currentOrganizer?.profilePicture || currentUser?.profilePicture || DefaultImg)}
                        alt={`${activeUser.name}'s profile`}
                        draggable="false"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <span className="text-4xl text-[#00D8FF]">G</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <h2 className="text-xl font-bold text-white mb-1">
                    {activeUser ? activeUser.name : "Guest"}
                  </h2>

                  {activeUser && (
                    <div className="text-sm text-[#00D8FF] mb-3">
                      {currentOrganizer ? "Organizer" : "User"}
                    </div>
                  )}

                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#00D8FF]/10 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-[#00D8FF] animate-pulse" />
                    <span className="text-[#00D8FF]">
                      {currentUser ? currentUser.points || 0 : 0} Points
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Navigation Links */}
              <div className="flex-1 space-y-6">
                {activeUser && (
                  <motion.div className="space-y-4" variants={itemVariants}>
                    {newNav.map(({ name2, link2, icon }) => (
                      <motion.div
                        key={name2}
                        variants={itemVariants}
                        whileHover={{ x: 10 }}
                        className=""
                      >
                        <NavLink
                          to={link2}
                          end={link2.endsWith("dashboard")} // Add end prop for exact matching
                          className={({ isActive }) =>
                            `block py-2 px-4 rounded-lg transition-colors duration-200 ${isActive
                              ? "bg-[#00D8FF]/20 text-[#00D8FF]"
                              : "text-gray-400 hover:text-[#00D8FF] hover:bg-[#00D8FF]/10"
                            }`
                          }
                          onClick={toggleMenu}
                        >
                          <div className="flex items-center gap-4 space-x-2">
                            {icon}
                            {name2}
                          </div>
                        </NavLink>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                <div className="h-px bg-gradient-to-r from-transparent via-[#00D8FF]/20 to-transparent" />

                <motion.div className="space-y-4" variants={itemVariants}>
                  {nav.map(({ name, link, icon }) => (
                    <motion.div
                      key={name}
                      variants={itemVariants}
                      whileHover={{ x: 10 }}
                    >
                      <NavLink
                        to={link}
                        className={({ isActive }) =>
                          `block py-2 px-4 rounded-lg transition-colors duration-200 ${isActive
                            ? "bg-[#00D8FF]/20 text-[#00D8FF]"
                            : "text-gray-400 hover:text-[#00D8FF] hover:bg-[#00D8FF]/10"
                          }`
                        }
                        onClick={toggleMenu}
                      >
                        <div className="flex items-center gap-4 space-x-2">
                          {icon}
                          {name}
                        </div>
                      </NavLink>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Login/Logout Button */}
              <motion.div
                className="pt-6 border-t border-[#00D8FF]/20"
                variants={itemVariants}
              >
                {activeUser ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg
                    bg-red-500/10 text-red-500 hover:bg-red-500/50 hover:text-black transition-colors duration-200"
                  >
                    <TbLogout className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      navigate("/auth/login");
                      toggleMenu();
                    }}
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg
                    bg-[#00D8FF]/10 text-[#00D8FF] hover:bg-[#00D8FF]/20 transition-colors duration-200"
                  >
                    <TbLogin className="w-5 h-5" />
                    <span>Login</span>
                  </button>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
