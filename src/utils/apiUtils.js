/* eslint-disable no-unused-vars */
import axios from "axios";
import { toast } from "react-toastify";

/**
 * Helper function to get the API base URL with fallback
 */
export const getApiBaseUrl = () => {
  const envApiUrl = import.meta.env.VITE_API_URL;

  // Default fallback URLs in order of preference
  const fallbackUrls = [
    "http://localhost:3000/api/v1",
    "http://127.0.0.1:3000/api/v1",
    "/api/v1", // Relative path if served from same origin
  ];

  if (envApiUrl) return envApiUrl;

  // Log warning about missing environment variable
  console.warn("VITE_API_URL not defined in environment, using fallback URL");
  return fallbackUrls[0]; // Default to first fallback
};

/**
 * Create a full API endpoint URL
 * @param {string} endpoint - The API endpoint path (without leading slash)
 * @returns {string} The complete URL
 */
export const createApiUrl = (endpoint) => {
  const baseUrl = getApiBaseUrl();
  const path = endpoint.startsWith("/") ? endpoint.substring(1) : endpoint;

  return `${baseUrl}/${path}`;
};

/**
 * Get standard headers for API requests
 * @param {boolean} includeAuth - Whether to include auth token in headers
 * @param {string} tokenType - Type of token to include ('organizer' or 'user')
 * @returns {Object} The headers object
 */
export const getApiHeaders = (includeAuth = true, tokenType = "organizer") => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    let token;

    // Get appropriate token based on tokenType
    if (tokenType === "organizer") {
      token = localStorage.getItem("organizer_token");
    } else if (tokenType === "user") {
      token = localStorage.getItem("token");
    } else if (tokenType === "admin") {
      token = localStorage.getItem("admin_token");
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

/**
 * Get authentication token from Redux or localStorage
 * @returns {Object} Object containing token and headers
 */
export const getAuthHeaders = () => {
  // Try to get token from localStorage
  const userToken = localStorage.getItem("token");
  const organizerToken = localStorage.getItem("organizer_token");

  // Use the first valid token found
  const token = userToken || organizerToken;

  if (token) {
    // Ensure we're returning the actual token, not "null" or with quotes
    const cleanToken =
      token === "null"
        ? null
        : token.startsWith('"') && token.endsWith('"')
        ? token.slice(1, -1)
        : token;

    if (cleanToken) {
      return {
        token: cleanToken,
        headers: {
          Authorization: `Bearer ${cleanToken}`,
        },
      };
    }
  }

  return {
    token: null,
    headers: {},
  };
};

/**
 * Make API request with consistent error handling and authentication
 */
export const apiRequest = async (
  method,
  endpoint,
  data = null,
  requiresAuth = false
) => {
  try {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}${endpoint}`;

    // Get authentication headers if needed or requested
    const { headers } = requiresAuth ? getAuthHeaders() : { headers: {} };

    // Add common headers
    const requestHeaders = {
      ...headers,
      "Content-Type": "application/json",
    };

    const config = {
      method,
      url,
      headers: requestHeaders,
    };

    if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
      config.data = data;
    } else if (data && method === "GET") {
      config.params = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    // Format error consistently
    const formattedError = formatApiError(error);

    // If it's an authentication error and auth was required, throw a specific error
    if (requiresAuth && formattedError.status === 401) {
      throw new Error("Authentication required. Please log in to continue.");
    }

    throw formattedError;
  }
};

/**
 * Format API error for consistent handling
 */
export const formatApiError = (error) => {
  if (error.response) {
    // Server responded with a status code outside of 2xx range
    const message =
      error.response.data?.message ||
      error.response.data?.error ||
      "Server error";
    return {
      message,
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // The request was made but no response was received
    return {
      message: "No response from server. Please check your connection.",
      status: 0,
      data: null,
    };
  } else {
    // Something happened in setting up the request
    return {
      message: error.message || "An unknown error occurred",
      status: 0,
      data: null,
    };
  }
};

/**
 * Helper to extract pagination data from response
 */
export const extractPaginationData = (response) => {
  const totalCount =
    parseInt(response.headers["x-total-count"]) ||
    response.data?.totalCount ||
    response.data?.total ||
    response.data?.meta?.total ||
    0;

  const currentPage =
    parseInt(response.data?.page) ||
    parseInt(response.data?.meta?.currentPage) ||
    parseInt(response.headers["x-current-page"]) ||
    1;

  const pageSize =
    parseInt(response.data?.limit) ||
    parseInt(response.data?.meta?.perPage) ||
    parseInt(response.headers["x-page-size"]) ||
    10;

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    totalCount,
    currentPage,
    pageSize,
    totalPages,
  };
};

export default {
  getApiBaseUrl,
  createApiUrl,
  getApiHeaders,
  getAuthHeaders,
  apiRequest,
  formatApiError,
  extractPaginationData,
};
