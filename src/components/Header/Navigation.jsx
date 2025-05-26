import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { BsPersonCircle, BsGrid3X3Gap } from 'react-icons/bs';
import { FaHome, FaPhoneAlt } from 'react-icons/fa';
import { GiTrophy } from 'react-icons/gi';
import { IoIosAlert } from 'react-icons/io';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings
} from 'lucide-react';

const Navigation = ({ isAdmin, organizer, activeUser, currentOrganizer, profileLink, adminNavItems, nav }) => {
  const navigate = useNavigate();

  if (isAdmin) {
    return (
      <nav className="hidden md:flex space-x-8">
        {adminNavItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400 transition-colors duration-200"
            >
              <IconComponent size={18} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    );
  }

  if (organizer) {
    return (
      <nav className="hidden md:flex items-center space-x-1">
        {profileLink ? (
          <NavLink
            to={profileLink}
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
                Profile
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#00D8FF] group-hover:w-full transition-all duration-300" />
              </span>
            </div>
            <div className="absolute inset-0 bg-[#00D8FF]/0 group-hover:bg-[#00D8FF]/10 rounded-lg transition-all duration-300" />
          </NavLink>
        ) : (
          <button
            onClick={() => navigate("/auth/login")}
            className="group relative px-4 py-2 rounded-lg transition-all duration-300 hover:cursor-pointer text-gray-400 hover:text-white"
          >
            <div className="flex items-center space-x-3">
              <BsPersonCircle size={24} />
              <span className="relative">
                Profile
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#00D8FF] group-hover:w-full transition-all duration-300" />
              </span>
            </div>
            <div className="absolute inset-0 bg-[#00D8FF]/0 group-hover:bg-[#00D8FF]/10 rounded-lg transition-all duration-300" />
          </button>
        )}

        <NavLink
          to={currentOrganizer ? "/organizer/dashboard" : "/user/dashboard"}
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
              Dashboard
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#00D8FF] group-hover:w-full transition-all duration-300" />
            </span>
          </div>
          <div className="absolute inset-0 bg-[#00D8FF]/0 group-hover:bg-[#00D8FF]/10 rounded-lg transition-all duration-300" />
        </NavLink>

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
                  {React.cloneElement(item.icon, { size: 24 })}
                </span>
                <span className="relative">
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#00D8FF] group-hover:w-full transition-all duration-300" />
                </span>
              </div>
              <div className="absolute inset-0 bg-[#00D8FF]/0 group-hover:bg-[#00D8FF]/10 rounded-lg transition-all duration-300" />
            </NavLink>
          ))}
      </nav>
    );
  }

  return (
    <nav className="hidden md:flex items-center space-x-1">
      {activeUser ? (
        <>
          {profileLink ? (
            <NavLink
              to={profileLink}
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
                  Profile
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#00D8FF] group-hover:w-full transition-all duration-300" />
                </span>
              </div>
              <div className="absolute inset-0 bg-[#00D8FF]/0 group-hover:bg-[#00D8FF]/10 rounded-lg transition-all duration-300" />
            </NavLink>
          ) : (
            <button
              onClick={() => navigate("/auth/login")}
              className="group relative px-4 py-2 rounded-lg transition-all duration-300 hover:cursor-pointer text-gray-400 hover:text-white"
            >
              <div className="flex items-center space-x-3">
                <BsPersonCircle size={24} />
                <span className="relative">
                  Profile
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#00D8FF] group-hover:w-full transition-all duration-300" />
                </span>
              </div>
              <div className="absolute inset-0 bg-[#00D8FF]/0 group-hover:bg-[#00D8FF]/10 rounded-lg transition-all duration-300" />
            </button>
          )}

          <NavLink
            to={currentOrganizer ? "/organizer/dashboard" : "/user/dashboard"}
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
                Dashboard
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#00D8FF] group-hover:w-full transition-all duration-300" />
              </span>
            </div>
            <div className="absolute inset-0 bg-[#00D8FF]/0 group-hover:bg-[#00D8FF]/10 rounded-lg transition-all duration-300" />
          </NavLink>

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
                    {React.cloneElement(item.icon, { size: 24 })}
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
  );
};

export default Navigation;
