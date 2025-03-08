import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export const login = (email, password) => async (dispatch) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, {
      email,
      password,
    });
    dispatch(loginSuccess(response.data));
  } catch (error) {
    console.error("Login failed:", error);
  }
};

export const register =
  (name, email, password, phone) => async (dispatch) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, {
        name,
        email,
        password,
        phone,
      });
      dispatch(loginSuccess(response.data));
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

export default authSlice.reducer;
