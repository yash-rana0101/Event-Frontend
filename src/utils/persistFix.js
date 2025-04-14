import { store } from "../redux/store";

export const fixPersistenceIssues = () => {
  // Get Redux state
  const state = store.getState();

  // Check localStorage for unexpected values
  const userToken = localStorage.getItem("token");
  const organizerToken = localStorage.getItem("organizer_token");

  // Fix "null" string values
  if (userToken === "null") {
    console.log("Fixing user token in localStorage");
    localStorage.removeItem("token");
  }

  if (organizerToken === "null") {
    console.log("Fixing organizer token in localStorage");
    localStorage.removeItem("organizer_token");
  }

  // Fix quoted token values by parsing JSON strings
  try {
    if (
      organizerToken &&
      (organizerToken.startsWith('"') || organizerToken.endsWith('"'))
    ) {
      console.log("Fixing double-quoted organizer token");
      // Parse JSON string and store the actual token value
      const parsedToken = JSON.parse(organizerToken);
      localStorage.setItem("organizer_token", parsedToken);
    }
  } catch (e) {
    console.error("Error fixing quoted token:", e);
  }

  try {
    if (userToken && (userToken.startsWith('"') || userToken.endsWith('"'))) {
      console.log("Fixing double-quoted user token");
      // Parse JSON string and store the actual token value
      const parsedToken = JSON.parse(userToken);
      localStorage.setItem("token", parsedToken);
    }
  } catch (e) {
    console.error("Error fixing quoted token:", e);
  }

  return {
    fixed: {
      auth: state.auth?.user === "null" || state.auth?.token === "null",
      organizer:
        state.organizer?.user === "null" || state.organizer?.token === "null",
      localStorage: userToken === "null" || organizerToken === "null",
      quotedTokens:
        (userToken && (userToken.startsWith('"') || userToken.endsWith('"'))) ||
        (organizerToken &&
          (organizerToken.startsWith('"') || organizerToken.endsWith('"'))),
    },
  };
};

/**
 * Enhanced helper function to safely parse potentially JSON-stringified tokens
 * @param {string} token - Token that might be JSON stringified
 * @returns {string} - Properly formatted token
 */
export const safelyParseToken = (token) => {
  if (!token) return null;

  // If token is already a regular string, return it
  if (typeof token === "string") {
    // Handle tokens stored as JSON strings with quotes
    if (token.startsWith('"') && token.endsWith('"')) {
      try {
        return JSON.parse(token); // This removes the surrounding quotes
      } catch (e) {
        console.error("Failed to parse quoted token:", e);
        // Return the token without quotes if parsing fails
        return token.substring(1, token.length - 1);
      }
    }

    // Handle escaped quotes that might remain
    if (token.includes('"')) {
      return token.replace(/"/g, '"');
    }

    // Not a JSON string, return as is
    return token;
  }

  // If token is some other type, convert to string
  return String(token);
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
  const userAuthenticated = !!userToken && userToken !== "null";

  // Check organizer authentication
  const organizerToken =
    state.organizer?.token || localStorage.getItem("organizer_token");
  const organizerAuthenticated = !!organizerToken && organizerToken !== "null";

  return {
    userAuthenticated,
    organizerAuthenticated,
    userToken: userToken ? safelyParseToken(userToken) : null,
    organizerToken: organizerToken ? safelyParseToken(organizerToken) : null,
    anyAuthenticated: userAuthenticated || organizerAuthenticated,
    bothAuthenticated: userAuthenticated && organizerAuthenticated,
  };
};
