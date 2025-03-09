import { useLocation } from "react-router-dom";

// List of static pages where footer should be displayed
const staticPages = [
  "/",
  "/about",
  "/contact",
  "/event",
  "/auth/login",
  "/auth/signup",
  "/organizer/login",
  "/organizer/register",
];

/**
 * Hook to determine if the current route is a static page
 * @returns {boolean} True if the current path is a static page
 */
export const useIsStaticPage = () => {
  const location = useLocation();
  return staticPages.includes(location.pathname);
};

/**
 * Function to check if a given path is a static page
 * @param {string} path - The path to check
 * @returns {boolean} True if the path is a static page
 */
export const isStaticPage = (path) => {
  return staticPages.includes(path);
};
