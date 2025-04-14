/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Proper token retrieval helper - improve this function
const getStoredToken = () => {
  const token = localStorage.getItem("organizer_token");
  // Make sure we don't return "null" as a string
  if (!token || token === "null") return null;

  // Handle case where token is stored as JSON string with quotes
  if (token.startsWith('"') && token.endsWith('"')) {
    try {
      return JSON.parse(token);
    } catch (e) {
      console.error("Failed to parse token:", e);
      // If parsing fails, return without quotes
      return token.substring(1, token.length - 1);
    }
  }

  return token;
};

// Helper function to get the current API URL with fallback
const getApiUrl = () => {
  const envApiUrl = import.meta.env.VITE_API_URL;

  const fallbackUrls = [
    "http://localhost:3000/api/v1",
    "http://127.0.0.1:3000/api/v1",
    "http://localhost:5000/api/v1",
    "/api/v1", // Relative path if served from same origin
  ];

  if (envApiUrl) return envApiUrl;

  // Log warning about missing environment variable
  console.warn("VITE_API_URL not defined in environment, using fallback URLs");
  return fallbackUrls[0]; // Default to first fallback
};

// Fix the checkOrganizerProfileCompletion function to properly detect profile completion
export const checkOrganizerProfileCompletion = createAsyncThunk(
  "organizer/checkProfileCompletion",
  async (_, { getState, rejectWithValue }) => {
    try {
      // Get token from state or localStorage as fallback
      const token = getState().organizer?.token || getStoredToken();

      if (!token) return rejectWithValue("No token found");

      // First check if we have a local flag indicating completion
      const localProfileComplete = localStorage.getItem(
        "organizer_profile_complete"
      );
      if (localProfileComplete === "true") {
        console.log("Found local profile complete flag, skipping API check");
        return {
          profileComplete: true,
          details: getState().organizer?.profileDetails || null,
        };
      }

      // Set authorization header
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const apiUrl = getApiUrl();

      // Try to fetch organizer details with the organizerId from the state
      const organizer = getState().organizer?.user;
      let organizerId;

      // Extract organizer ID from potentially stringified user object
      if (typeof organizer === "string") {
        try {
          const parsed = JSON.parse(organizer);
          organizerId = parsed?._id || parsed?.id || parsed?._doc?._id;
        } catch (e) {
          console.error("Error parsing organizer data:", e);
        }
      } else if (organizer) {
        organizerId = organizer._id || organizer.id || organizer?._doc?._id;
      }

      if (!organizerId) {
        console.log("No organizerId found in state");
        return {
          profileComplete: false,
          details: null,
        };
      }

      console.log(`Checking profile completion for organizer: ${organizerId}`);

      // Try both endpoints for fetching organizer details
      try {
        const response = await axios.get(
          `${apiUrl}/organizer/${organizerId}/details`,
          config
        );

        // Check if we have required fields for a complete profile
        const details = response.data;

        // Enhanced check for profile completion - make sure ALL required fields are present and not empty
        const isProfileComplete = !!(
          details &&
          details.title &&
          details.title.trim() !== "" &&
          details.bio &&
          details.bio.trim() !== "" &&
          details.location &&
          details.location.trim() !== ""
        );

        console.log("Profile completion check result:", isProfileComplete);

        // If profile is complete, set the localStorage flag
        if (isProfileComplete) {
          localStorage.setItem("organizer_profile_complete", "true");
          localStorage.setItem(
            "organizer_details_last_shown",
            new Date().getTime().toString()
          );
        }

        return {
          profileComplete: isProfileComplete,
          details: details || null,
        };
      } catch (err) {
        if (err.response?.status === 404) {
          console.log("Organizer details not found");
          return {
            profileComplete: false,
            details: null,
          };
        }
        throw err;
      }
    } catch (error) {
      console.log("Profile completion check failed:", error.message);
      return {
        profileComplete: false,
        details: null,
      };
    }
  }
);

// Modify verifyOrganizerToken to also check profile completion
export const verifyOrganizerToken = createAsyncThunk(
  "organizer/verify",
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      // Get token from state or localStorage as fallback
      const token = getState().organizer?.token || getStoredToken();

      if (!token) return rejectWithValue("No token found");

      // Set authorization header
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // Try different endpoints for verification
      let response;
      const apiUrl = getApiUrl();

      try {
        // First try the profile endpoint
        response = await axios.get(`${apiUrl}/organizer/profile`, config);
      } catch (err) {
        // If that fails, try the /me endpoint
        console.log(
          "Primary endpoint failed, trying /me endpoint...",
          err.message
        );
        response = await axios.get(`${apiUrl}/organizer/me`, config);
      }

      // If still no data, try dashboard stats as last resort
      if (!response || !response.data) {
        console.log("Second endpoint failed, trying dashboard-stats...");
        response = await axios.get(
          `${apiUrl}/organizer/dashboard-stats`,
          config
        );
      }

      // Prevent potential string "null" issue
      if (!response.data) {
        throw new Error("Empty response data");
      }

      // Extract user data - handle different response formats
      const userData = response.data.user || response.data || {};

      // After successful verification, check profile completion immediately
      const profileAction = await dispatch(checkOrganizerProfileCompletion());

      return {
        user: userData,
        token,
        profileComplete: profileAction.payload?.profileComplete || false,
      };
    } catch (error) {
      console.error("Token verification failed:", error);

      // Only remove token if it's truly an auth failure (401/403)
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        localStorage.removeItem("organizer_token");
      }

      return rejectWithValue(
        error.response?.data?.message || "Session expired"
      );
    }
  }
);

// Async thunk for organizer login with improved error handling
export const loginOrganizer = createAsyncThunk(
  "organizer/login",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const apiUrl = getApiUrl();
      console.log(`Attempting login to: ${apiUrl}/organizer/login`);

      const response = await axios.post(`${apiUrl}/organizer/login`, formData, {
        // Add timeout and retry configuration
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log("Login response data:", response.data);

      // Store token if it exists and it's not "null" string
      if (response.data?.token && response.data.token !== "null") {
        localStorage.setItem("organizer_token", response.data.token);

        // Check profile completion status after successful login
        dispatch(checkOrganizerProfileCompletion());

        return {
          user: response.data.user || {},
          token: response.data.token,
        };
      }

      return rejectWithValue("Login successful but no token received");
    } catch (error) {
      // Enhanced error handling with network connectivity detection
      if (error.code === "ERR_NETWORK") {
        console.error("Network error - server might be down or CORS issue");

        // Get the current API URL
        const apiUrl = getApiUrl();

        // Try with different API URLs if available
        const fallbacks = [
          "http://localhost:3000/api/v1",
          "http://127.0.0.1:3000/api/v1",
          "http://localhost:5000/api/v1",
        ].filter((url) => url !== apiUrl);

        // Log the fallback attempts
        console.log(`Trying fallback URLs: ${fallbacks.join(", ")}`);

        // Return a simple string error message instead of an object
        return rejectWithValue(
          "Cannot connect to server. Please check if the backend is running."
        );
      }

      // Make sure we always return a string error
      const errorMessage =
        error.response?.data?.message ||
        (typeof error.message === "string" ? error.message : "Login failed");

      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for organizer registration
export const registerOrganizer = createAsyncThunk(
  "organizer/register",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const apiUrl = getApiUrl();
      const response = await axios.post(
        `${apiUrl}/organizers/register`,
        formData
      );

      if (response.data?.token) {
        localStorage.setItem("organizer_token", response.data.token);

        // Set initial profile completion status to false for new registrations
        return {
          user: response.data.user || {},
          token: response.data.token,
          profileComplete: false,
        };
      }

      return rejectWithValue("Registration successful but no token received");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// Add a new action to directly set profile completion status
export const updateProfileCompletionStatus = createAsyncThunk(
  "organizer/updateProfileCompletionStatus",
  async (isComplete, { dispatch }) => {
    // Store completion status in localStorage too
    if (isComplete) {
      localStorage.setItem("organizer_profile_complete", "true");
      localStorage.setItem(
        "organizer_details_last_shown",
        new Date().getTime().toString()
      );
    } else {
      localStorage.removeItem("organizer_profile_complete");
    }

    // Force a check after marking complete
    await dispatch(checkOrganizerProfileCompletion());
    return { profileComplete: isComplete };
  }
);

const organizerSlice = createSlice({
  name: "organizer",
  initialState: {
    user: null,
    token: getStoredToken(),
    loading: false,
    error: null,
    isAuthenticated: false,
    profileComplete: false,
    profileDetails: null,
  },
  reducers: {
    logout: (state) => {
      // Clear Redux state
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.profileComplete = false;
      state.profileDetails = null;
      state.error = null;

      // Clear localStorage - be thorough and clear all related items
      localStorage.removeItem("organizer_token");
      localStorage.removeItem("organizer_token_expiry");
      localStorage.removeItem("organizer_user");

      // Any other organizer-related items that might be stored
      const keysToRemove = Object.keys(localStorage).filter(
        (key) => key.startsWith("organizer_") || key.includes("organizer")
      );

      keysToRemove.forEach((key) => localStorage.removeItem(key));

      // Log the logout operation
      console.log("Organizer logged out successfully - all data cleared");
    },
    // Add manual setter for testing/debugging
    setOrganizerData: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      if (action.payload.token && action.payload.token !== "null") {
        localStorage.setItem("organizer_token", action.payload.token);
      }
    },
    // Enhanced fixNullValues to also handle quoted tokens
    fixNullValues: (state) => {
      if (state.user === "null") state.user = null;
      if (state.token === "null") {
        state.token = null;
        localStorage.removeItem("organizer_token");
      }

      // If token is a JSON string (starts and ends with quotes), parse it
      if (
        typeof state.token === "string" &&
        state.token.startsWith('"') &&
        state.token.endsWith('"')
      ) {
        try {
          state.token = JSON.parse(state.token);
          localStorage.setItem("organizer_token", state.token);
        } catch (e) {
          console.error("Failed to parse token in reducer:", e);
        }
      }

      // Same for user object
      if (typeof state.user === "string" && state.user !== "null") {
        try {
          state.user = JSON.parse(state.user);
        } catch (e) {
          console.error("Failed to parse user data in reducer:", e);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginOrganizer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginOrganizer.fulfilled, (state, action) => {
        state.loading = false;

        // Make sure we handle both formats of response
        state.user = action.payload.user || action.payload.organizer || {};
        state.token = action.payload.token;
        state.isAuthenticated = true;

        // Save token to localStorage as a direct string, not JSON stringified
        if (action.payload.token) {
          // Make sure we're not saving double-quoted JSON strings
          const tokenToSave =
            typeof action.payload.token === "string" &&
            action.payload.token.startsWith('"') &&
            action.payload.token.endsWith('"')
              ? JSON.parse(action.payload.token)
              : action.payload.token;

          localStorage.setItem("organizer_token", tokenToSave);

          // Also store token expiry time (default 24h)
          const expiryTime = new Date();
          expiryTime.setHours(expiryTime.getHours() + 24);
          localStorage.setItem("organizer_token_expiry", expiryTime.toString());
        }
      })
      .addCase(loginOrganizer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // Registration cases
      .addCase(registerOrganizer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerOrganizer.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        state.profileComplete = false; // New registration, profile is not complete
      })
      .addCase(registerOrganizer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Token verification cases
      .addCase(verifyOrganizerToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOrganizerToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;

        // Set profile completion status from verification if available
        if (action.payload.hasOwnProperty("profileComplete")) {
          state.profileComplete = action.payload.profileComplete;
        }
      })
      .addCase(verifyOrganizerToken.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem("organizer_token");
      })
      // Profile completion check cases
      .addCase(checkOrganizerProfileCompletion.pending, (state) => {
        // Don't change the status while checking
      })
      .addCase(checkOrganizerProfileCompletion.fulfilled, (state, action) => {
        state.profileComplete = action.payload.profileComplete;
        state.profileDetails = action.payload.details;

        // Log the profile completion status change
        console.log(
          "Updated profile completion status:",
          state.profileComplete
        );
      })
      .addCase(checkOrganizerProfileCompletion.rejected, (state) => {
        state.profileComplete = false;
        state.profileDetails = null;
      })
      // Add case for direct profile completion update
      .addCase(updateProfileCompletionStatus.fulfilled, (state, action) => {
        state.profileComplete = action.payload.profileComplete;
        console.log(
          "Profile completion status manually updated to:",
          state.profileComplete
        );
      });
  },
});

export const { logout, setOrganizerData, fixNullValues } =
  organizerSlice.actions;
export default organizerSlice.reducer;
