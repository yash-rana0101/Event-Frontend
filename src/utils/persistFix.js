/* eslint-disable no-unused-vars */
import { store } from "../redux/store";

/**
 * Safely parse a token string that might be JSON or a plain string
 * @param {string} token - Token to parse
 * @returns {string} Parsed token
 */
export const safelyParseToken = (token) => {
  if (!token) return null;

  try {
    // Try to parse as JSON
    const parsed = JSON.parse(token);

    // If it's an object with a token property, return that
    if (parsed && typeof parsed === "object" && parsed.token) {
      return parsed.token;
    }

    // If it's a string, return the parsed value
    if (typeof parsed === "string") {
      return parsed;
    }

    // Return the original token if parsing doesn't yield useful results
    return token;
  } catch (e) {
    // If it's not valid JSON, return the original token as is
    return token;
  }
};

/**
 * Check if token is expired based on expiry time
 * @param {string} expiryTimestamp - Token expiry timestamp
 * @param {number} bufferMinutes - Buffer time in minutes before actual expiration
 * @returns {boolean} True if token is expired or about to expire
 */
export const isTokenExpired = (expiryTimestamp, bufferMinutes = 5) => {
  if (!expiryTimestamp) return true;

  try {
    const expiryTime = parseInt(expiryTimestamp);
    if (isNaN(expiryTime)) return true;

    // Add buffer time in milliseconds to current time
    const currentTime = new Date().getTime();
    const bufferTime = bufferMinutes * 60 * 1000;

    return currentTime + bufferTime > expiryTime;
  } catch (e) {
    console.error("Error checking token expiry:", e);
    return true; // If any error, consider token expired
  }
};

/**
 * Comprehensive cleanup of all auth data (for logout)
 * @param {string} userType - 'user' or 'organizer' to specify which type to logout
 */
export const thoroughAuthCleanup = (userType = "all") => {
  console.log(`Performing thorough cleanup for: ${userType}`);

  // Clear specific user type data
  if (userType === "user" || userType === "all") {
    localStorage.removeItem("token");
    localStorage.removeItem("token_expiry");
    localStorage.removeItem("user");

    // Find and remove any user-related items
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("user_") || key.includes("auth_")) {
        localStorage.removeItem(key);
      }
    });
  }

  // Clear organizer data
  if (userType === "organizer" || userType === "all") {
    localStorage.removeItem("organizer_token");
    localStorage.removeItem("organizer_token_expiry");
    localStorage.removeItem("organizer_user");
    localStorage.removeItem("organizer_profile_complete");

    // Find and remove any organizer-related items
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("organizer_")) {
        localStorage.removeItem(key);
      }
    });
  }

  // Verify cleanup was successful
  const remainingKeys = Object.keys(localStorage);
  console.log("Remaining localStorage items after cleanup:", remainingKeys);

  return {
    success: true,
    remaining: remainingKeys,
  };
};

/**
 * Logout from both user and organizer accounts
 * Useful to fully reset auth state when there are conflicts
 */
export const fullLogout = () => {
  thoroughAuthCleanup("all");

  // Dispatch logout actions for both auth types
  try {
    store.dispatch({ type: "auth/logout" });
    store.dispatch({ type: "organizer/logout" });
  } catch (e) {
    console.error("Error dispatching logout actions:", e);
  }

  return { success: true };
};

/**
 * Checks if a user is authenticated (either as regular user or organizer)
 * @returns {Object} Authentication status details
 */
export const checkAuthStatus = () => {
  // Check Redux store
  const state = store.getState();

  // Check user authentication
  const userToken = state.auth?.token || localStorage.getItem("token");
  const userTokenExpiry =
    state.auth?.tokenExpiry || localStorage.getItem("token_expiry");
  const userIsExpired = isTokenExpired(userTokenExpiry);

  // Check organizer authentication
  const organizerToken =
    state.organizer?.token || localStorage.getItem("organizer_token");
  const organizerTokenExpiry =
    state.organizer?.tokenExpiry ||
    localStorage.getItem("organizer_token_expiry");
  const organizerIsExpired = isTokenExpired(organizerTokenExpiry);

  return {
    isAuthenticated:
      !!(userToken && !userIsExpired) ||
      !!(organizerToken && !organizerIsExpired),
    user: {
      isAuthenticated: !!(userToken && !userIsExpired),
      token: userToken,
      isExpired: userIsExpired,
    },
    organizer: {
      isAuthenticated: !!(organizerToken && !organizerIsExpired),
      token: organizerToken,
      isExpired: organizerIsExpired,
    },
  };
};

/**
 * Fix any persistence issues by syncing localStorage with Redux
 */
export const fixPersistenceIssues = () => {
  try {
    const state = store.getState();

    // Fix user auth persistence
    if (!state.auth?.token) {
      const token = localStorage.getItem("token");
      const tokenExpiry = localStorage.getItem("token_expiry");
      const user = localStorage.getItem("user");

      if (token && !isTokenExpired(tokenExpiry)) {
        store.dispatch({
          type: "auth/loginSuccess",
          payload: {
            token,
            tokenExpiry: parseInt(tokenExpiry),
            user: user ? JSON.parse(user) : null,
          },
        });
      }
    }

    // Fix organizer auth persistence
    if (!state.organizer?.token) {
      const token = localStorage.getItem("organizer_token");
      const tokenExpiry = localStorage.getItem("organizer_token_expiry");
      const user = localStorage.getItem("organizer_user");
      const profileComplete =
        localStorage.getItem("organizer_profile_complete") === "true";

      if (token && !isTokenExpired(tokenExpiry)) {
        store.dispatch({
          type: "organizer/loginSuccess",
          payload: {
            token,
            tokenExpiry: parseInt(tokenExpiry),
            user: user ? JSON.parse(user) : null,
            profileComplete,
          },
        });
      }
    }

    return true;
  } catch (e) {
    console.error("Error fixing persistence issues:", e);
    return false;
  }
};
