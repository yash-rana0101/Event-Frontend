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
  publicProfile: null,
  publicProfileLoading: false,
  publicProfileError: null,
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

      // Only proceed if login was successful and user is verified
      if (response.data.success && response.data.token) {
        // Set expiry time for token (1 day from now)
        const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000;

        return {
          token: response.data.token,
          user: response.data.user,
          tokenExpiry: expiryTime,
        };
      } else {
        return rejectWithValue("Login failed. Please try again.");
      }
    } catch (error) {
      // Handle verification-specific errors
      if (error.response?.status === 403) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Account pending approval. Please wait for admin verification."
        );
      }

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

      let token = organizer.token;

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      // Check if token is expired
      const tokenExpiry = organizer.tokenExpiry;
      if (isTokenExpired(tokenExpiry)) {
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
      return rejectWithValue(
        error.response?.data?.message || "Token verification failed"
      );
    }
  }
);

// Add new action for public profile access
export const fetchPublicOrganizerProfile = createAsyncThunk(
  "organizer/fetchPublicProfile",
  async (organizerId, { rejectWithValue }) => {
    try {
      if (!organizerId) {
        return rejectWithValue("No organizer ID provided");
      }

      const apiUrl = import.meta.env.VITE_API_URL;

      try {
        // Use a public endpoint that doesn't require authentication
        const response = await axios.get(
          `${apiUrl}/organizer/public/profile/${organizerId}`
        );
        return { publicProfile: response.data };
      } catch (error) {
        // If public endpoint fails, try the original endpoint
        try {
          const fallbackResponse = await axios.get(
            `${apiUrl}/organizer/profile/${organizerId}`
          );
          return { publicProfile: fallbackResponse.data };
        } catch (fallbackError) {
          throw new Error(fallbackError.message);
        }
      }
    } catch (error) {
      console.error("Error fetching public organizer profile:", error);
      return rejectWithValue(
        error.message || "Failed to fetch organizer profile"
      );
    }
  }
);

// Add new async thunk to check profile completion
export const checkProfileCompletion = createAsyncThunk(
  "organizer/checkProfileCompletion",
  async (organizerId, { rejectWithValue, dispatch }) => {
    try {
      if (!organizerId) {
        return rejectWithValue("No organizer ID provided");
      }

      const apiUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("organizer_token");

      if (!token) {
        return rejectWithValue("No authentication token");
      }

      const response = await axios.get(
        `${apiUrl}/organizer/${organizerId}/details`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // More comprehensive profile completion check
      const profile = response.data;
      const requiredFields = ["bio", "location", "phone"];
      const isComplete = requiredFields.every(
        (field) => profile[field] && profile[field].toString().trim().length > 0
      );

      // Automatically update the profileComplete state
      dispatch(setProfileComplete(isComplete));

      return { isComplete, profile };
    } catch (error) {
      console.error("Error checking profile completion:", error);
      // If profile doesn't exist, it's definitely not complete
      if (error.response?.status === 404) {
        dispatch(setProfileComplete(false));
        return { isComplete: false, profile: null };
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to check profile completion"
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
    },
    fixNullValues: (state) => {
      if (state.user === "null") state.user = null;
      if (state.token === "null") state.token = null;
    },
    setProfileComplete: (state, action) => {
      state.profileComplete = Boolean(action.payload); // Ensure it's always a boolean
    },
    setToken: (state, action) => {
      state.token = action.payload;
      // Set a 7-day expiration time for the token
      state.tokenExpiry = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.tokenExpiry = action.payload.tokenExpiry;
      state.loading = false;
      state.error = null;
      state.profileComplete = action.payload.profileComplete || false;
    },
    clearExpiredToken: (state) => {
      state.user = null;
      state.token = null;
      state.tokenExpiry = null;
      state.profileComplete = false;
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
      }
    });
    builder.addCase(verifyOrganizerToken.rejected, (state, action) => {
      state.loading = false;
      state.user = null;
      state.token = null;
      state.tokenExpiry = null;
      state.profileComplete = false;
    });

    // Handle public profile fetching
    builder.addCase(fetchPublicOrganizerProfile.pending, (state) => {
      state.publicProfileLoading = true;
      state.publicProfileError = null;
    });
    builder.addCase(fetchPublicOrganizerProfile.fulfilled, (state, action) => {
      state.publicProfileLoading = false;
      state.publicProfile = action.payload.publicProfile;
    });
    builder.addCase(fetchPublicOrganizerProfile.rejected, (state, action) => {
      state.publicProfileLoading = false;
      state.publicProfileError = action.payload;
    });

    // Handle profile completion checking
    builder
      .addCase(checkProfileCompletion.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.profileComplete = Boolean(action.payload.isComplete);
      })
      .addCase(checkProfileCompletion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkProfileCompletion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.profileComplete = false;
      });
  },
});

// Export actions and reducer
export const {
  logout,
  fixNullValues,
  setProfileComplete,
  setToken,
  setUser,
  loginSuccess,
  clearExpiredToken,
} = organizerSlice.actions;
export default organizerSlice.reducer;
