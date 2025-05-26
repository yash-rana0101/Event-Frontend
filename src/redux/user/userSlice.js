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

// Initial state with proper typing
const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  tokenExpiry: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, credentials);

      // Set expiry time for token (7 days from now) - updated from 1 day
      const expiryTime = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;

      // Save to localStorage for backup/direct access
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("token_expiry", expiryTime.toString());
      localStorage.setItem("user", JSON.stringify(response.data.user));

      return {
        token: response.data.token,
        user: response.data.user,
        tokenExpiry: expiryTime,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  }
);

// Verify token validity
export const verifyUserToken = createAsyncThunk(
  "auth/verifyToken",
  async (_, { getState, rejectWithValue }) => {
    try {
      // Get current state
      const { auth } = getState();

      // First check if we have a token in state, otherwise try localStorage
      let token = auth.token;
      if (!token) {
        token = localStorage.getItem("token");

        // Handle case where token might be JSON stringified
        token = safelyParseToken(token);
      }

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      // Check if token is expired
      const tokenExpiry =
        auth.tokenExpiry || localStorage.getItem("token_expiry");
      if (isTokenExpired(tokenExpiry)) {
        // Clear expired token and reject
        localStorage.removeItem("token");
        localStorage.removeItem("token_expiry");
        return rejectWithValue("Token expired");
      }

      // Verify token by calling profile endpoint
      const response = await axios.get(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return {
        token,
        user: response.data.user,
        tokenExpiry,
      };
    } catch (error) {
      // Token verification failed - clean up
      localStorage.removeItem("token");
      localStorage.removeItem("token_expiry");

      return rejectWithValue(
        error.response?.data?.message || "Token verification failed"
      );
    }
  }
);

// User slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      // Clear state
      state.user = null;
      state.token = null;
      state.tokenExpiry = null;
      state.error = null;

      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("token_expiry");
    },
    fixNullValues: (state) => {
      if (state.user === "null") state.user = null;
      if (state.token === "null") state.token = null;
    },
    setAdminStatus: (state, action) => {
      if (state.user) {
        state.user.isAdmin = action.payload;
        state.user.role = action.payload ? "admin" : "user";
      }
    },
  },
  extraReducers: (builder) => {
    // Handle login actions
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.tokenExpiry = action.payload.tokenExpiry;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Login failed";
    });

    // Handle token verification
    builder.addCase(verifyUserToken.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifyUserToken.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.tokenExpiry = action.payload.tokenExpiry;
    });
    builder.addCase(verifyUserToken.rejected, (state, action) => {
      state.loading = false;
      state.user = null;
      state.token = null;
      state.tokenExpiry = null;
    });
  },
});

// Export actions and reducer
export const { logout, fixNullValues, setAdminStatus } = authSlice.actions;
export default authSlice.reducer;
