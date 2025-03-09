import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Proper token retrieval helper
const getStoredToken = () => {
  const token = localStorage.getItem("organizer_token");
  // Make sure we don't return "null" as a string
  return token && token !== "null" ? token : null;
};

// Helper function to get the current API URL with fallback
const getApiUrl = () => {
  // Try the environment variable first
  const envApiUrl = import.meta.env.VITE_API_URL;

  // If it's not available, try these common development server URLs in sequence
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

// Add token verification and user data fetching capabilities
export const verifyOrganizerToken = createAsyncThunk(
  "organizer/verify",
  async (_, { getState, rejectWithValue }) => {
    try {
      // Get token from state or localStorage as fallback
      const token = getState().organizer?.token || getStoredToken();

      if (!token) return rejectWithValue("No token found");

      // Set authorization header
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // Try primary endpoint first
      let response;
      try {
        // Updated path to match your backend route structure
        response = await axios.get(
          `${import.meta.env.VITE_API_URL}/organizer/profile`,
          config
        );
      } catch {
        // Fallback to alternative endpoints
        console.log("Primary endpoint failed, trying alternative...");
        response = await axios.get(
          `${import.meta.env.VITE_API_URL}/organizer/dashboard-stats`,
          config
        );
      }

      // Prevent potential string "null" issue
      if (!response.data) {
        throw new Error("Empty response data");
      }

      // Extract user data - handle different response formats
      const userData = response.data.user || response.data || {};

      return {
        user: userData,
        token,
      };
    } catch (error) {
      console.error("Token verification failed:", error);
      console.log(
        "API endpoint used:",
        `${import.meta.env.VITE_API_URL}/organizer/profile`
      );
      localStorage.removeItem("organizer_token");
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
    const apiUrl = getApiUrl();
    console.log(`Attempting login to: ${apiUrl}/organizer/login`);

    try {
      const response = await axios.post(`${apiUrl}/organizer/login`, formData, {
        // Add timeout and retry configuration
        timeout: 10000,
        // Add CORS headers if needed
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log("Login response data:", response.data);

      // Store token if it exists
      if (response.data?.token) {
        localStorage.setItem("organizer_token", response.data.token);
      }

      // Handle different response formats
      let userData = response.data;

      // If the API returns just a token or doesn't include user data
      if (!response.data.user && response.data.token) {
        // Create a minimal user object with what we have
        userData = {
          token: response.data.token,
          user: formData.email ? { email: formData.email } : {},
        };

        // Try to extract user info from token
        try {
          const tokenPayload = JSON.parse(
            atob(response.data.token.split(".")[1])
          );
          if (tokenPayload && tokenPayload.id) {
            userData.user.id = tokenPayload.id;
          }
        } catch (e) {
          console.log("Could not parse token payload", e);
        }

        // Queue a verification to get complete user data later
        dispatch(verifyOrganizerToken());
      }

      return userData;
    } catch (error) {
      // Enhanced error handling with network connectivity detection
      if (error.code === "ERR_NETWORK") {
        console.error("Network error - server might be down or CORS issue");

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
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/organizer/register`,
        formData
      );

      // Store token in localStorage with proper key
      if (response.data?.token) {
        localStorage.setItem("organizer_token", response.data.token);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

const organizerSlice = createSlice({
  name: "organizer",
  initialState: {
    user: null,
    token: getStoredToken(),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("organizer_token");
    },
    // Add manual setter for testing/debugging
    setOrganizerData: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      if (action.payload.token) {
        localStorage.setItem("organizer_token", action.payload.token);
      }
    },
    // Special action to fix "null" string problems
    fixNullValues: (state) => {
      if (state.user === "null") state.user = null;
      if (state.token === "null") state.token = null;
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
        state.user = action.payload.user || {};
        state.token = action.payload.token;
      })
      .addCase(loginOrganizer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.token = null;
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
      })
      .addCase(verifyOrganizerToken.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem("organizer_token");
      });
  },
});

export const { logout, setOrganizerData, fixNullValues } =
  organizerSlice.actions;
export default organizerSlice.reducer;
