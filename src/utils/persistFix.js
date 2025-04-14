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
 * Hard reset of all auth data (for emergencies/debugging)
 */
export const resetAllAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("organizer_token");

  // You would need to dispatch logout actions here too if store is available
  if (store) {
    store.dispatch({ type: "auth/logout" });
    store.dispatch({ type: "organizer/logout" });
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
    localStorage.removeItem("user");
    localStorage.removeItem("auth_expiry");

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
 * Helper function to check if organizer profile is complete based on details
 */
export const checkProfileCompleteness = (details) => {
  if (!details) return false;

  // Define what fields are required for a complete profile
  const requiredFields = ["title", "bio", "location"];

  // Check if all required fields have values
  return requiredFields.every(
    (field) => details[field] && details[field].trim() !== ""
  );
};

/**
 * Get stored profile completion status
 */
export const getStoredProfileStatus = () => {
  return localStorage.getItem("organizer_profile_complete") === "true";
};

/**
 * Reset profile completion status (for debugging/testing)
 */
export const resetProfileCompletionStatus = () => {
  localStorage.removeItem("organizer_profile_complete");
  localStorage.removeItem("organizer_details_last_shown");
  console.log("Profile completion status reset");
  return true;
};
