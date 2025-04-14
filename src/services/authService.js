import axios from "axios";
import { getApiBaseUrl } from "../utils/apiUtils";

const AUTH_TOKEN_KEY = "organizer_token";
const TOKEN_EXPIRY_KEY = "organizer_token_expiry";

const authService = {
  /**
   * Get the current auth token
   */
  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  /**
   * Set auth token with optional expiry
   */
  setToken(token, expiryHours = 24) {
    if (!token) return false;

    localStorage.setItem(AUTH_TOKEN_KEY, token);

    // Set expiry time
    const expiryTime = new Date();
    expiryTime.setHours(expiryTime.getHours() + expiryHours);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());

    return true;
  },

  /**
   * Clear auth token
   */
  clearToken() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  },

  /**
   * Check if token is valid and not expired
   */
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    // Check if token is expired
    const expiryTimeStr = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (expiryTimeStr) {
      const expiryTime = new Date(expiryTimeStr);
      if (expiryTime < new Date()) {
        // Token expired
        this.clearToken();
        return false;
      }
    }

    return true;
  },

  /**
   * Verify token with backend
   */
  async verifyToken() {
    try {
      const token = this.getToken();
      if (!token) return false;

      const apiUrl = getApiBaseUrl();
      const response = await axios.get(`${apiUrl}/organizers/verify-token`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.status === 200;
    } catch (error) {
      console.error("Token verification failed:", error);

      // If unauthorized, clear token
      if (error.response?.status === 401) {
        this.clearToken();
      }

      return false;
    }
  },
};

export default authService;
