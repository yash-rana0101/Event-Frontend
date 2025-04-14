/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { safelyParseToken } from "../../utils/persistFix";

// Get API URL from environment or use default
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

// Helper to handle token expiration
const isTokenExpired = (expiryTime) => {
  if (!expiryTime) return true;
  return new Date().getTime() > expiryTime;
};

// Initial state
const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  tokenExpiry: null,
  profileComplete: false,
};

// Async thunk for organizer login
export const loginOrganizer = createAsyncThunk(
  "organizer/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/organizer/login`,
        credentials
      );

      // Set expiry time for token (1 day from now)
      const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000;

      // Save to localStorage for backup/direct access
      localStorage.setItem("organizer_token", response.data.token);
      localStorage.setItem("organizer_token_expiry", expiryTime.toString());

      return {
        token: response.data.token,
        user: response.data.organizer || response.data.user,
        tokenExpiry: expiryTime,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  }
);

// Verify organizer token validity
export const verifyOrganizerToken = createAsyncThunk(
  "organizer/verifyToken",
  async (_, { getState, rejectWithValue }) => {
    try {
      // Get current state
      const { organizer } = getState();

      // First check if we have a token in state, otherwise try localStorage
      let token = organizer.token;
      if (!token) {
        token = localStorage.getItem("organizer_token");

        // Handle case where token might be JSON stringified
        token = safelyParseToken(token);
      }

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      // Check if token is expired
      const tokenExpiry =
        organizer.tokenExpiry || localStorage.getItem("organizer_token_expiry");
      if (isTokenExpired(tokenExpiry)) {
        // Clear expired token and reject
        localStorage.removeItem("organizer_token");
        localStorage.removeItem("organizer_token_expiry");
        return rejectWithValue("Token expired");
      }

      // Verify token by calling profile endpoint
      const response = await axios.get(`${API_URL}/organizer/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return {
        token,
        user: response.data,
        tokenExpiry,
      };
    } catch (error) {
      // Token verification failed - clean up
      localStorage.removeItem("organizer_token");
      localStorage.removeItem("organizer_token_expiry");

      return rejectWithValue(
        error.response?.data?.message || "Token verification failed"
      );
    }
  }
);

// Organizer slice
const organizerSlice = createSlice({
  name: "organizer",
  initialState,
  reducers: {
    logout: (state) => {
      // Clear state
      state.user = null;
      state.token = null;
      state.tokenExpiry = null;
      state.error = null;
      state.profileComplete = false;

      // Clear localStorage
      localStorage.removeItem("organizer_token");
      localStorage.removeItem("organizer_token_expiry");
      localStorage.removeItem("organizer_profile_complete");
      localStorage.removeItem("organizer_details_last_shown");
    },
    fixNullValues: (state) => {
      if (state.user === "null") state.user = null;
      if (state.token === "null") state.token = null;
    },
    setProfileComplete: (state, action) => {
      state.profileComplete = action.payload;
      localStorage.setItem("organizer_profile_complete", action.payload);
    },
  },
  extraReducers: (builder) => {
    // Handle login actions
    builder.addCase(loginOrganizer.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginOrganizer.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.tokenExpiry = action.payload.tokenExpiry;
    });
    builder.addCase(loginOrganizer.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Login failed";
    });

    // Handle token verification
    builder.addCase(verifyOrganizerToken.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifyOrganizerToken.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.tokenExpiry = action.payload.tokenExpiry;

      // Check if profile is complete based on user data
      if (action.payload.user && action.payload.user.details) {
        state.profileComplete = true;
        localStorage.setItem("organizer_profile_complete", "true");
      }
    });
    builder.addCase(verifyOrganizerToken.rejected, (state, action) => {
      state.loading = false;
      state.user = null;
      state.token = null;
      state.tokenExpiry = null;
      state.profileComplete = false;
    });
  },
});

// Export actions and reducer
export const { logout, fixNullValues, setProfileComplete } =
  organizerSlice.actions;
export default organizerSlice.reducer;
