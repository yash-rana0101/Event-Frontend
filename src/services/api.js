  import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
console.log("API_URL:", API_URL); // Add this line to verify the URL

export const registerUser = (userData) =>
  axios.post(`${API_URL}/users/register`, userData);
export const loginUser = (userData) =>
  axios.post(`${API_URL}/users/login`, userData);
export const getUserProfile = (token) =>
  axios.get(`${API_URL}/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
