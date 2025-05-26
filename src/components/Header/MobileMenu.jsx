/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaXmark } from 'react-icons/fa6';
import { TbLogout, TbLogin } from 'react-icons/tb';

const MobileMenu = ({
  isMenuOpen,
  toggleMenu,
  activeUser,
  isAdmin,
  adminData,
  currentOrganizer,
  currentUser,
  DefaultImg,
  adminNavItems,
  newNav,
  nav,
  handleLogout
}) => {
  const navigate = useNavigate();

  const menuVariants = {
    visible: { x: 0 },
    hidden: { x: "100%" },
  };

  const itemVariants = {
    hidden: { x: 20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  return (
    <motion.div
      className={`fixed top-0 right-0 h-full w-full md:w-1/2 lg:w-1/3 bg-black/95 backdrop-blur-lg 
      border-l border-[#00D8FF]/20 z-50 ${isMenuOpen ? "block" : "hidden"}`}
      variants={menuVariants}
      initial="hidden"
      animate={isMenuOpen ? "visible" : "hidden"}
    >
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
        <motion.div
          className="flex flex-col items-center space-y-4 py-8"
          variants={itemVariants}
        >
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-[#00D8FF] ring-offset-2 ring-offset-black">
              {activeUser ? (
                <img
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  src={
                    (isAdmin ? adminData?.avatar : null) ||
                    currentOrganizer?.profilePicture ||
                    currentUser?.profilePicture ||
                    DefaultImg
                  }
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
              {activeUser ?
                (isAdmin ?
                  (adminData?.name || adminData?.firstName || 'Admin') :
                  activeUser.name
                ) : "Guest"
              }
            </h2>

            {activeUser && (
              <div className="text-sm text-[#00D8FF] mb-3">
                {isAdmin ? "Admin" : currentOrganizer ? "Organizer" : "User"}
              </div>
            )}
          </div>
        </motion.div>

        <div className="flex-1 space-y-6">
          {activeUser && (
            <motion.div className="space-y-4" variants={itemVariants}>
              {isAdmin ? (
                <>
                  {adminNavItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <motion.div
                        key={item.name}
                        variants={itemVariants}
                        whileHover={{ x: 10 }}
                      >
                        <NavLink
                          to={item.href}
                          className={({ isActive }) =>
                            `block py-2 px-4 rounded-lg transition-colors duration-200 ${isActive
                              ? "bg-[#00D8FF]/20 text-[#00D8FF]"
                              : "text-gray-400 hover:text-[#00D8FF] hover:bg-[#00D8FF]/10"
                            }`
                          }
                          onClick={toggleMenu}
                        >
                          <div className="flex items-center gap-4 space-x-2">
                            <IconComponent size={20} />
                            {item.name}
                          </div>
                        </NavLink>
                      </motion.div>
                    );
                  })}
                </>
              ) : (
                <>
                  {newNav.map(({ name2, link2, icon }) => (
                    <motion.div
                      key={name2}
                      variants={itemVariants}
                      whileHover={{ x: 10 }}
                      className=""
                    >
                      <NavLink
                        to={link2}
                        end={link2.endsWith("dashboard")}
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
                </>
              )}
            </motion.div>
          )}

          <div className="h-px bg-gradient-to-r from-transparent via-[#00D8FF]/20 to-transparent" />

          <motion.div className="space-y-4" variants={itemVariants}>
            {nav
              .filter(item => !isAdmin || ['Contact'].includes(item.name))
              .map(({ name, link, icon }) => (
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
  );
};

export default MobileMenu;
