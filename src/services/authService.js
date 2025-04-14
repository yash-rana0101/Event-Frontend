/* eslint-disable no-unused-vars */
const AUTH_TOKEN_KEY = "token";
const TOKEN_EXPIRY_KEY = "token_expiry";
const ORGANIZER_TOKEN_KEY = "organizer_token";
const ORGANIZER_TOKEN_EXPIRY_KEY = "organizer_token_expiry";

// Helper to check if a token is expired
export const isTokenExpired = (expiryTime) => {
  if (!expiryTime) return true;
  return new Date().getTime() > parseInt(expiryTime);
};

// Parse potentially stringified tokens
export const parseToken = (token) => {
  if (!token) return null;

  // If token is already a string but not a JSON string, return it
  if (typeof token === "string" && !token.startsWith('"')) {
    return token;
  }

  // Try to parse it as JSON (handles double quoted strings)
  try {
    return JSON.parse(token);
  } catch (e) {
    return token;
  }
};

// User authentication methods
export const getUserToken = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return parseToken(token);
};

export const getUserTokenExpiry = () => {
  return localStorage.getItem(TOKEN_EXPIRY_KEY);
};

export const setUserAuth = (token, expiryTime) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
};

export const clearUserAuth = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
};

export const isUserAuthenticated = () => {
  const token = getUserToken();
  const expiry = getUserTokenExpiry();

  return !!token && !isTokenExpired(expiry);
};

// Organizer authentication methods
export const getOrganizerToken = () => {
  const token = localStorage.getItem(ORGANIZER_TOKEN_KEY);
  return parseToken(token);
};

export const getOrganizerTokenExpiry = () => {
  return localStorage.getItem(ORGANIZER_TOKEN_EXPIRY_KEY);
};

export const setOrganizerAuth = (token, expiryTime) => {
  localStorage.setItem(ORGANIZER_TOKEN_KEY, token);
  localStorage.setItem(ORGANIZER_TOKEN_EXPIRY_KEY, expiryTime.toString());
};

export const clearOrganizerAuth = () => {
  localStorage.removeItem(ORGANIZER_TOKEN_KEY);
  localStorage.removeItem(ORGANIZER_TOKEN_EXPIRY_KEY);
};

export const isOrganizerAuthenticated = () => {
  const token = getOrganizerToken();
  const expiry = getOrganizerTokenExpiry();

  return !!token && !isTokenExpired(expiry);
};

// Helper to determine if any type of user is authenticated
export const isAnyUserAuthenticated = () => {
  return isUserAuthenticated() || isOrganizerAuthenticated();
};

// Helper to get appropriate token for API calls based on user type
export const getAuthToken = (userType) => {
  if (userType === "organizer") {
    return getOrganizerToken();
  }
  return getUserToken();
};

export default {
  getUserToken,
  getUserTokenExpiry,
  setUserAuth,
  clearUserAuth,
  isUserAuthenticated,
  getOrganizerToken,
  getOrganizerTokenExpiry,
  setOrganizerAuth,
  clearOrganizerAuth,
  isOrganizerAuthenticated,
  isAnyUserAuthenticated,
  getAuthToken,
  parseToken,
  isTokenExpired,
};
