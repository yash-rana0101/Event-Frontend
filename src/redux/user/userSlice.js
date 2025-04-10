import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Proper token retrieval helper
const getStoredToken = () => {
  const token = localStorage.getItem("token");
  // Make sure we don't return "null" as a string
  return token && token !== "null" ? token : null;
};

// Verify user token (similar to verifyOrganizerToken)
export const verifyUserToken = createAsyncThunk(
  "auth/verify",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token || getStoredToken();

      if (!token) return rejectWithValue("No token found");

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/profile`, // Updated endpoint
        config
      );

      if (!response.data) {
        throw new Error("Empty response data");
      }

      return { user: response.data, token };
    } catch (error) {
      console.error("User token verification failed:", error);
      localStorage.removeItem("token");
      return rejectWithValue(
        error.response?.data?.message || "Session expired"
      );
    }
  }
);

const initialState = {
  user: null,
  token: getStoredToken(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      if (!action.payload || typeof action.payload !== "object") {
        console.error("Invalid payload in loginSuccess:", action.payload);
        return;
      }
      state.user = action.payload.user || null;
      state.token = action.payload.token || null;
      if (action.payload.token) {
        localStorage.setItem("token", action.payload.token);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
    // Special action to fix "null" string problems
    fixNullValues: (state) => {
      if (state.user === "null") state.user = null;
      if (state.token === "null") state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyUserToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyUserToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(verifyUserToken.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { loginSuccess, logout, fixNullValues } = authSlice.actions;

export const login = (email, password) => async (dispatch) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    console.log("Using API URL:", apiUrl);
    console.log("Attempting login with email:", email);

    // Clear any potential cached responses
    const axiosConfig = {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    };

    // Make the login request
    const response = await axios.post(
      `${apiUrl}/users/login`,
      {
        email: email,
        password,
      },
      axiosConfig
    );

    console.log("Login response status:", response.status);

    // Validate response contains expected data
    if (!response.data || !response.data.success) {
      console.error("Login failed:", response.data?.message || "Unknown error");
      return { error: response.data?.message || "Login failed" };
    }

    // Map server response to expected format
    const userData = {
      user: {
        _id: response.data.user?.id || response.data.user?._id,
        name: response.data.user?.name || "User",
        email: response.data.user?.email,
        role: response.data.user?.role || "user",
      },
      token: response.data.token,
    };

    // Validate essential data
    if (!userData.user || !userData.token) {
      console.error("Login response missing user or token", response.data);
      return { error: "Invalid server response" };
    }

    console.log("Login successful, dispatching loginSuccess");

    // Save token to localStorage
    localStorage.setItem("token", userData.token);

    // Update Redux state
    dispatch(loginSuccess(userData));
    return { success: true, userData };
  } catch (error) {
    const errorMsg = error.response?.data?.message || "Login failed";
    console.error(
      "Login failed:",
      error.message,
      "Status:",
      error.response?.status,
      "Details:",
      error.response?.data
    );
    return { error: errorMsg };
  }
};

export const register = (name, email, password, phone) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/users/register`,
      {
        name, // Send as name since API expects name
        email,
        password,
        phone,
      }
    );

    // Map server response to expected format
    const userData = {
      user: {
        _id: response.data.user?.id || response.data._id,
        name: response.data.user?.name || response.data.name,
        email: response.data.user?.email || response.data.email,
        role: response.data.user?.role || response.data.role,
      },
      token: response.data.token,
    };

    // Validate essential data
    if (!userData.user || !userData.token) {
      console.error("Registration response missing user or token");
      return { error: "Invalid server response" };
    }

    dispatch(loginSuccess(userData));
    return userData;
  } catch (error) {
    console.error("Registration failed:", error);
    return { error: error.response?.data?.message || "Registration failed" };
  }
};

export default authSlice.reducer;
