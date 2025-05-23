/* eslint-disable no-unused-vars */
import axios from "axios";
import { toast } from "react-toastify";
import { safelyParseToken } from "./persistFix";

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

/**
 * Extracts data safely from various API response formats
 * @param {Object} response - The response object from axios
 * @param {String} entityName - The name of the entity (e.g., 'events', 'teams')
 * @returns {Array} - The extracted data array
 */
export const extractApiData = (response, entityName) => {
  if (!response || !response.data) {
    console.warn(`Empty response or missing data for ${entityName}`);
    return [];
  }

  // Try to extract data from different response formats
  let extractedData;

  if (Array.isArray(response.data)) {
    // Direct array format
    extractedData = response.data;
  } else if (response.data.data && Array.isArray(response.data.data)) {
    // { data: [...] } format
    extractedData = response.data.data;
  } else if (
    response.data.data &&
    response.data.data[entityName] &&
    Array.isArray(response.data.data[entityName])
  ) {
    // { data: { entityName: [...] } } format
    extractedData = response.data.data[entityName];
  } else if (
    response.data[entityName] &&
    Array.isArray(response.data[entityName])
  ) {
    // { entityName: [...] } format
    extractedData = response.data[entityName];
  } else {
    // Last resort, try to find any array property
    const arrayProps = Object.keys(response.data).filter((key) =>
      Array.isArray(response.data[key])
    );

    if (arrayProps.length > 0) {
      extractedData = response.data[arrayProps[0]];
    } else {
      console.warn(
        `Could not extract ${entityName} data from response:`,
        response.data
      );
      extractedData = [];
    }
  }

  return Array.isArray(extractedData) ? extractedData : [];
};

/**
 * A utility to help debug API responses
 * @param {Object} response - The response object from axios
 * @returns {Object} - Debug information about the response
 */
export const debugApiResponse = (response, entityName) => {
  return {
    hasData: !!response?.data,
    dataType: typeof response?.data,
    isArray: Array.isArray(response?.data),
    hasDataProperty: !!response?.data?.data,
    hasEntityProperty: !!response?.data?.[entityName],
    responseKeys: response?.data ? Object.keys(response.data) : [],
    extractedData: extractApiData(response, entityName),
  };
};

/**
 * Determines if an event is published based on various status fields
 * @param {Object} event - The event object
 * @returns {Boolean} - Whether the event should be considered published
 */
export const isEventPublished = (event) => {
  return (
    event.isPublished == true ||
    event.status == "published" ||
    event.status == "active" ||
    event.published == true
  );
};

/**
 * Creates an axios instance with authorization headers
 * @param {string} tokenType - 'user' or 'organizer'
 * @returns {object} - Axios instance with auth headers
 */
export const createAuthenticatedClient = (tokenType = "user") => {
  const tokenKey = tokenType === "organizer" ? "organizer_token" : "token";
  const token = localStorage.getItem(tokenKey);
  const cleanToken = safelyParseToken(token);

  return axios.create({
    baseURL: API_URL,
    headers: cleanToken
      ? {
          Authorization: `Bearer ${cleanToken}`,
          "Content-Type": "application/json",
        }
      : {
          "Content-Type": "application/json",
        },
  });
};

/**
 * Event attendees API
 */
export const attendeesApi = {
  /**
   * Get all attendees for an event
   * @param {string} eventId - Event ID
   * @returns {Promise} - API response
   */
  getEventAttendees: async (eventId) => {
    const client = createAuthenticatedClient("organizer");
    return client.get(`/organizer/events/${eventId}/attendees`);
  },

  /**
   * Update attendee check-in status
   * @param {string} eventId - Event ID
   * @param {string} attendeeId - Attendee ID
   * @param {string} status - New status ('checked-in', 'not-checked-in', 'cancelled')
   * @returns {Promise} - API response
   */
  updateCheckInStatus: async (eventId, attendeeId, status) => {
    const client = createAuthenticatedClient("organizer");
    return client.post(
      `/organizer/events/${eventId}/attendees/${attendeeId}/check-in`,
      { status }
    );
  },

  /**
   * Add attendee manually
   * @param {string} eventId - Event ID
   * @param {object} attendeeData - Attendee data
   * @returns {Promise} - API response
   */
  addAttendeeManually: async (eventId, attendeeData) => {
    const client = createAuthenticatedClient("organizer");
    return client.post(`/organizer/events/${eventId}/attendees`, attendeeData);
  },
};

/**
 * Handle API errors consistently
 * @param {Error} error - Axios error
 * @returns {object} - Standardized error object
 */
export const handleApiError = (error) => {
  const defaultError = {
    message: "An unexpected error occurred",
    statusCode: 500,
    data: null,
  };

  // Not an axios error
  if (!error.response) {
    return {
      ...defaultError,
      message: error.message || defaultError.message,
    };
  }

  // Return structured error
  return {
    message: error.response.data?.message || defaultError.message,
    statusCode: error.response.status,
    data: error.response.data,
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
  extractApiData,
  debugApiResponse,
  isEventPublished,
  createAuthenticatedClient,
  attendeesApi,
  handleApiError,
};
