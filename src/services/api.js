import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const registerUser = (userData) => api.post(`/users/register`, userData);
export const loginUser = (userData) => api.post(`/users/login`, userData);
export const getUserProfile = (token) =>
  api.get(`/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
// Add event details function for public and admin access
// export const getEventDetails = (eventId, isAdmin = false) => {
//   const endpoint = isAdmin ? `/admin/events/${eventId}` : `/events/${eventId}`;
//   return api.get(endpoint);
// };

export default api;
